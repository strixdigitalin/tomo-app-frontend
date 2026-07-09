import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomText from './TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';
import { white } from '../common/Colors/colors';
import { apiGet, apiPut } from '../utils/Apis';
import { setUser } from '../redux/reducer/user';
import urls from '../config/urls';

const LastActiveToggle = () => {
  const { isDarkMode } = useSelector(state => state.theme);
  const dispatch = useDispatch();
  
  // ✅ Get current user data from Redux
  let selector = useSelector(state => state?.user?.userData);
  if (Object.keys(selector).length !== 0) {
    selector = JSON.parse(selector);
  }

  // ✅ Local state for toggle (synced with Redux)
  const [isLastActiveEnabled, setIsLastActiveEnabled] = useState(
    selector?.ShowLastActive ?? true
  );

  // ✅ Sync with Redux when selector changes
  useEffect(() => {
    setIsLastActiveEnabled(selector?.ShowLastActive ?? true);
  }, [selector?.ShowLastActive]);

  // ✅ Handle Toggle
  const handleToggle = async () => {
    try {
      // ✅ NEW VALUE (opposite of current)
      const newValue = !isLastActiveEnabled;
      
      // Optimistic update (UI responds instantly)
      setIsLastActiveEnabled(newValue);

      // ✅ Call API with CORRECT new value
      const res = await apiPut('/api/user/ToggleLastActive', {
        ShowLastActive: newValue,  // ✅ FIXED: ab sahi value jayegi
        ShowJoinedDate: selector?.ShowJoinedDate ?? true  // ✅ Current value maintain karo
      });

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
          Show Last Active
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

export default LastActiveToggle;