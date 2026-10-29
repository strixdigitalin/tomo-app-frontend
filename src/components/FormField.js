import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';

// Standard text input for every form: label, optional "*", left icon, password eye,
// character counter, helper text and an inline error (red border + message under the field).
const FormField = React.forwardRef(({
  label, required, value, onChangeText, onBlur, error, helper,
  placeholder, secure, leftIcon, rightElement, maxLength, showCounter,
  multiline, keyboardType, autoCapitalize = 'none', editable = true,
  containerStyle, inputStyle, ...rest
}, ref) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const borderColor = error ? c.danger : focused ? accent : c.divider;
  const len = (value || '').length;

  return (
    <View style={[styles.wrap, containerStyle]}>
      {!!label && (
        <Text style={[styles.label, { color: c.muted }]}>
          {label}
          {required ? <Text style={{ color: c.danger }}> *</Text> : null}
        </Text>
      )}

      <View
        style={[
          styles.box,
          multiline && styles.boxMulti,
          { backgroundColor: c.chip, borderColor, opacity: editable ? 1 : 0.6 },
        ]}>
        {!!leftIcon && <Feather name={leftIcon} size={17} color={focused ? accent : c.muted} style={styles.left} />}
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur && onBlur(); }}
          placeholder={placeholder}
          placeholderTextColor={c.muted}
          secureTextEntry={!!secure && hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          maxLength={maxLength}
          multiline={multiline}
          editable={editable}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={[styles.input, multiline && styles.inputMulti, { color: c.text }, inputStyle]}
          {...rest}
        />
        {!!secure && (
          <TouchableOpacity onPress={() => setHidden(h => !h)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name={hidden ? 'eye-off' : 'eye'} size={18} color={c.muted} />
          </TouchableOpacity>
        )}
        {rightElement}
      </View>

      {(!!error || !!helper || (showCounter && maxLength)) && (
        <View style={styles.footer}>
          <Text style={[styles.msg, { color: error ? c.danger : c.muted }]} numberOfLines={2}>
            {error || helper || ''}
          </Text>
          {showCounter && !!maxLength && (
            <Text style={[styles.counter, { color: len >= maxLength ? c.danger : c.muted }]}>{len}/{maxLength}</Text>
          )}
        </View>
      )}
    </View>
  );
});
FormField.displayName = 'FormField';

const styles = StyleSheet.create({
  wrap: { marginBottom: 14, alignSelf: 'stretch' },
  label: { fontSize: 13, marginBottom: 6, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  box: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, minHeight: 50 },
  boxMulti: { alignItems: 'flex-start', paddingTop: 4 },
  left: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, paddingVertical: 12, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  inputMulti: { minHeight: 96, paddingTop: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, paddingHorizontal: 2 },
  msg: { flex: 1, fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  counter: { fontSize: 11, marginLeft: 8, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
});

export default FormField;
