import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import CustomText from './TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';
import useThemeColor from '../utils/useThemeColor';

const CustomInputField = ({ 
  icon, 
  lableStyle, 
  value, 
  onChangeText, 
  Lefticon, 
  editable, 
  secureTextEntry, 
  keyboardType, 
  placeholder, 
  label,
  isPasswordField = false, // New prop to identify password fields
  ...props 
}) => {
  const { isDarkMode, primaryColor } = useThemeColor();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: primaryColor,
      borderRadius: 20,
      paddingHorizontal: 10,
      backgroundColor: isDarkMode ? 'black' : 'rgba(137, 138, 131, 0.05)',
      width: '100%',
      height: verticalScale(52),
      gap: 10,
    },
    input: {
      flex: 1,
      minWidth: 0,
      fontSize: 16,
      color: isDarkMode ? 'white' : '#333',
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
    },
    icon: {
      marginRight: 10,
    },
  });

  // Determine if password should be hidden
  const shouldHidePassword = isPasswordField ? !isPasswordVisible : secureTextEntry;

  return (
    <>
      <CustomText style={{
        color: 'rgba(151, 150, 161, 1)',
        fontFamily: FONTS_FAMILY.Alatsi_Regular, 
        fontSize: 16,
        alignSelf: 'flex-start',
        bottom: lableStyle ? 10 : 0
      }}>
        {label}
      </CustomText>
      <View style={styles.container}>
        {Lefticon}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? 'white' : "rgba(137, 138, 131, 0.4)"}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          editable={editable}
          value={value}
          secureTextEntry={shouldHidePassword}
          {...props}
        />
        {isPasswordField ? (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            {icon}
          </TouchableOpacity>
        ) : (
          icon
        )}
      </View>
    </>
  );
};

export default CustomInputField;