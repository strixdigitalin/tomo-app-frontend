import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { apiPut } from './Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocationManager {
  constructor() {
    this.lastKnownLocation = null;
    this.lastUpdateTime = null;
    this.MINIMUM_DISTANCE = 500; // 500 meters
    this.UPDATE_INTERVAL = 15 * 60 * 1000; // 15 minutes
    this.isUpdating = false;
    this.onLocationUpdatedCallback = null;
    this.locationRetryCount = 0;
    this.MAX_RETRY_COUNT = 3;
  }

  // Set callback function for location updates
  setLocationUpdateCallback(callback) {
    this.onLocationUpdatedCallback = callback;
  }

  // Check and request location permissions
  async requestLocationPermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location for better experience',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS handles permission automatically
    } catch (error) {
      return false;
    }
  }

  // Get current position with fallback strategy
  async getCurrentPosition(highAccuracy = true) {
    const options = {
      enableHighAccuracy: highAccuracy,
      timeout: highAccuracy ? 15000 : 10000, // Reduced timeouts
      maximumAge: 300000, // 5 minutes cache
    };

    return new Promise((resolve, reject) => {
      
      Geolocation.getCurrentPosition(
        (position) => {
          this.locationRetryCount = 0; // Reset retry count on success
          resolve(position);
        },
        (error) => {
          reject(error);
        },
        options
      );
    });
  }

  // Get location with retry and fallback mechanism
  async getLocationWithRetry() {
    let lastError;
    
    // Try high accuracy first
    try {
      return await this.getCurrentPosition(true);
    } catch (error) {
      lastError = error;
      
      // Fallback to low accuracy
      try {
        return await this.getCurrentPosition(false);
      } catch (lowAccError) {
        
        // Try to get cached location as last resort
        try {
          const cachedLocation = await this.getCachedLocation();
          if (cachedLocation && this.isCachedLocationValid(cachedLocation)) {
            return {
              coords: {
                latitude: cachedLocation.coordinates[1],
                longitude: cachedLocation.coordinates[0],
                accuracy: 1000 // Mark as low accuracy
              }
            };
          }
        } catch (cacheError) {
        }
        
        throw lastError; // Throw the original high accuracy error
      }
    }
  }

  // Get cached location
  async getCachedLocation() {
    try {
      const cached = await AsyncStorage.getItem('lastLocationUpdate');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      return null;
    }
  }

  // Check if cached location is still valid (within 1 hour)
  isCachedLocationValid(cachedLocation) {
    if (!cachedLocation || !cachedLocation.timestamp) return false;
    const ageInMinutes = (Date.now() - cachedLocation.timestamp) / (1000 * 60);
    return ageInMinutes < 60; // Consider valid if less than 1 hour old
  }

  // Calculate distance between two points
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Update location on server
  async updateLocationOnServer(coords, accuracy = null) {
    try {
      if (this.isUpdating) {
        return;
      }

      this.isUpdating = true;
      
      const locationData = {
        Location: {
          type: "Point",
          coordinates: [coords.longitude, coords.latitude]
        }
      };

      // Add accuracy info if available
      if (accuracy !== null) {
        locationData.accuracy = accuracy;
      }

      
      const response = await apiPut('/api/user/UpdateLocation', locationData);
      
      if (response) {
        
        // Cache the updated location
        await AsyncStorage.setItem('lastLocationUpdate', JSON.stringify({
          coordinates: [coords.longitude, coords.latitude],
          timestamp: Date.now(),
          accuracy: accuracy
        }));

        // Call the callback function if it exists
        if (this.onLocationUpdatedCallback && typeof this.onLocationUpdatedCallback === 'function') {
          try {
            await this.onLocationUpdatedCallback();
          } catch (callbackError) {
          }
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      this.isUpdating = false;
    }
  }

  // Check if location update is needed
  async checkAndUpdateLocation(forceUpdate = false) {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        return { success: false, error: 'Permission denied' };
      }

      let position;
      try {
        position = await this.getLocationWithRetry();
      } catch (error) {
        
        // Handle specific error types
        if (error.code === 3) { // TIMEOUT
          return { success: false, error: 'Location request timed out. Please check your GPS settings.' };
        } else if (error.code === 2) { // POSITION_UNAVAILABLE
          return { success: false, error: 'Location unavailable. Please check your GPS settings.' };
        } else if (error.code === 1) { // PERMISSION_DENIED
          return { success: false, error: 'Location permission denied' };
        }
        
        throw error;
      }

      const { latitude, longitude, accuracy } = position.coords;
      const now = Date.now();


      // Force update on app start or manual trigger
      if (forceUpdate) {
        await this.updateLocationOnServer({ latitude, longitude }, accuracy);
        this.lastKnownLocation = { latitude, longitude };
        this.lastUpdateTime = now;
        return { success: true, message: 'Location updated successfully' };
      }

      // Check cached location first
      if (!this.lastKnownLocation) {
        try {
          const cachedLocation = await this.getCachedLocation();
          if (cachedLocation) {
            this.lastKnownLocation = {
              latitude: cachedLocation.coordinates[1],
              longitude: cachedLocation.coordinates[0]
            };
            this.lastUpdateTime = cachedLocation.timestamp;
          }
        } catch (error) {
        }
      }

      // First time - always update
      if (!this.lastKnownLocation) {
        await this.updateLocationOnServer({ latitude, longitude }, accuracy);
        this.lastKnownLocation = { latitude, longitude };
        this.lastUpdateTime = now;
        return { success: true, message: 'First location update completed' };
      }

      // Calculate distance from last known location
      const distance = this.calculateDistance(
        this.lastKnownLocation.latitude,
        this.lastKnownLocation.longitude,
        latitude,
        longitude
      );

      // Calculate time difference
      const timeDiff = now - this.lastUpdateTime;

      // Check if update is needed
      const shouldUpdateDistance = distance > this.MINIMUM_DISTANCE;
      const shouldUpdateTime = timeDiff > this.UPDATE_INTERVAL;

      if (shouldUpdateDistance || shouldUpdateTime) {
        await this.updateLocationOnServer({ latitude, longitude }, accuracy);
        this.lastKnownLocation = { latitude, longitude };
        this.lastUpdateTime = now;
        return { success: true, message: 'Location updated due to distance/time threshold' };
      } else {
        return { success: true, message: 'Location update not needed', skipped: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Initialize location tracking with better error handling
  async initializeLocationTracking() {
    
    try {
      const result = await this.checkAndUpdateLocation(true);
      
      if (result.success) {
        this.startPeriodicLocationCheck();
        return result;
      } else {
        // App will work without location, just won't have location-based features
        return result;
      }
      
    } catch (error) {
      // Don't crash the app, just work without location features
      return { success: false, error: 'Location initialization failed' };
    }
  }

  // Start periodic location checks
  startPeriodicLocationCheck() {
    // Clear any existing interval
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
    }

    // Check location every 10 minutes when app is active
    this.locationInterval = setInterval(() => {
      this.checkAndUpdateLocation().then(result => {
        if (!result.success && !result.skipped) {
          // Don't spam retries if location is consistently failing
          this.locationRetryCount++;
          if (this.locationRetryCount > this.MAX_RETRY_COUNT) {
            // Could implement exponential backoff here
          }
        }
      }).catch(error => {
      });
    }, 10 * 60 * 1000);

  }

  // Stop location tracking
  stopLocationTracking() {
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
      this.locationInterval = null;
    }
  }

  // Manual location update with better feedback
  async updateLocationNow() {
    return await this.checkAndUpdateLocation(true);
  }

  // Get last known location (useful for UI)
  getLastKnownLocation() {
    return this.lastKnownLocation;
  }

  // Check location service availability
  async checkLocationServices() {
    try {
      const position = await this.getCurrentPosition(false);
      return { available: true, location: position.coords };
    } catch (error) {
      return { available: false, error: error.message, code: error.code };
    }
  }
}

// Export singleton instance
export default new LocationManager();