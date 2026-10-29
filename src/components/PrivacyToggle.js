import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomText from './TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';
import { white } from '../common/Colors/colors';
import { apiGet, apiPut } from '../utils/Apis';
import { setUser } from '../redux/reducer/user';
import urls from '../config/urls';

// field: ShowLastActive | ShowJoinedDate | ShowAddress | PrivateProfile.
// All are saved via ToggleLastActive; every flag is sent together, like web.
const PrivacyToggle = ({ field = 'ShowLastActive', label = 'Show Last Active', defaultValue = true }) => {
  const { isDarkMode } = useSelector(state => state.theme);
  const dispatch = useDispatch();
  
  // ✅ Get current user data from Redux
  let selector = useSelector(state => state?.user?.userData);
  if (Object.keys(selector).length !== 0) {
    selector = JSON.parse(selector);
  }

  // ✅ Local state for toggle (synced with Redux)
  const [isLastActiveEnabled, setIsLastActiveEnabled] = useState(
    selector?.[field] ?? defaultValue
  );

  // ✅ Sync with Redux when selector changes
  useEffect(() => {
    setIsLastActiveEnabled(selector?.[field] ?? defaultValue);
  }, [selector?.[field]]);

  // ✅ Handle Toggle
  const handleToggle = async () => {
    try {
      // ✅ NEW VALUE (opposite of current)
      const newValue = !isLastActiveEnabled;
      
      // Optimistic update (UI responds instantly)
      setIsLastActiveEnabled(newValue);

      // ✅ Call API with CORRECT new value
      const body = {
        ShowLastActive: selector?.ShowLastActive ?? true,
        ShowJoinedDate: selector?.ShowJoinedDate ?? true,
        ShowAddress: selector?.ShowAddress ?? true,
        PrivateProfile: selector?.PrivateProfile ?? false,
      };
      body[field] = newValue;
      const res = await apiPut('/api/user/ToggleLastActive', body);

      if (res?.statusCode === 200) {
        // ✅ Fetch updated user data
        const getUserDetails = await apiGet(urls.userProfile);
        
        if (getUserDetails?.statusCode === 200) {
          // ✅ Dispatch updated data to Redux
          dispatch(setUser(JSON.stringify(getUserDetails?.data)));
        }
      } else {
        // Revert on failure
        setIsLastActiveEnabled(!newValue);
      }
    } catch (error) {
      console.error('Failed to update Last Active:', error);
      // Revert on error
      setIsLastActiveEnabled(!isLastActiveEnabled);
    }
  };

  return (
    <TouchableOpacity onPress={handleToggle} style={styles.container}>
      <View style={styles.content}>
        <CustomText style={[styles.text, { color: isDarkMode ? 'white' : 'black' }]}>
          {label}
        </CustomText>
        <View
          style={[
            styles.toggleContainer,
            isLastActiveEnabled && styles.toggleActive,
          ]}
        >
          <View
            style={[
              styles.toggleButton,
              isLastActiveEnabled && styles.toggleButtonActive,
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  text: {
    fontFamily: FONTS_FAMILY.OpenSans_Condensed_Bold,
    fontSize: 18,
  },
  toggleContainer: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E4E4E4',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: 'black',
  },
  toggleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: white,
    position: 'absolute',
    left: 2,
    transition: '0.3s',
  },
  toggleButtonActive: {
    transform: [{ translateX: 22 }],
  },
});

export default PrivacyToggle;