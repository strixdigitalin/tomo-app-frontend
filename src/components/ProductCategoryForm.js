import React, { useEffect, useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import CustomText from './TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';
import { apiGet } from '../utils/Apis';
import { CATEGORIES, getFields } from '../utils/productFields';
import { THEMES } from '../redux/reducer/theme';

// Category → sub-category chips, then the fields that category needs
// (web: AddProduct.jsx steps 1–2). State is owned by the parent screen.
const ProductCategoryForm = ({ category, subCategory, details, onSelectSub, onChangeDetail, errors = {} }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const primary = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const [allBrands, setAllBrands] = useState([]);
  const [brandFocus, setBrandFocus] = useState(null);
  const [openCat, setOpenCat] = useState(category || '');

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet('/api/admin/GetBrands');
        setAllBrands(Array.isArray(res) ? res : res?.data || res?.brands || []);
      } catch (e) {}
    })();
  }, []);

  const brandOptions = useMemo(() => {
    const keys = [category, subCategory].map(s => String(s || '').toLowerCase());
    const matched = allBrands.filter(b => keys.includes(String(b.Type || '').toLowerCase()));
    const list = (matched.length ? matched : allBrands).map(b => (b?.BandName || b?.BrandName || '').trim());
    return [...new Set(list.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }, [allBrands, category, subCategory]);

  const fields = getFields(category, subCategory);
  const text = isDarkMode ? '#fff' : '#111';
  const border = isDarkMode ? '#444' : '#d1d5db';

  const chip = (label, active, onPress, key) => (
    <TouchableOpacity
      key={key || label}
      onPress={onPress}
      style={[styles.chip, { borderColor: active ? primary : border, backgroundColor: active ? primary + '22' : 'transparent' }]}>
      <CustomText style={{ color: active ? primary : text, fontSize: 13 }}>{label}</CustomText>
    </TouchableOpacity>
  );

  return (
    <View>
      <CustomText style={styles.label}>Category *</CustomText>
      <View style={styles.row}>
        {Object.keys(CATEGORIES).map(cat => chip(cat, openCat === cat, () => setOpenCat(cat)))}
      </View>
      {!!errors._category && <CustomText style={styles.error}>{errors._category}</CustomText>}
      {!!openCat && (
        <>
          <CustomText style={styles.label}>Type *</CustomText>
          <View style={styles.row}>
            {CATEGORIES[openCat].map(sub => chip(sub, subCategory === sub, () => onSelectSub(openCat, sub)))}
          </View>
        </>
      )}

      {fields.map(f => (
        <View key={f.name}>
          <CustomText style={styles.label}>
            {f.label}
            {f.required ? ' *' : ''}
          </CustomText>
          {f.type === 'options' ? (
            <View style={styles.row}>
              {f.options.map(o => chip(o, details[f.name] === o, () => onChangeDetail(f.name, o)))}
            </View>
          ) : (
            <>
              <TextInput
                value={details[f.name] || ''}
                keyboardType={f.type === 'number' ? 'number-pad' : 'default'}
                placeholder={f.type === 'brand' ? 'Select or type a brand' : f.label}
                placeholderTextColor="#888"
                onFocus={() => f.type === 'brand' && setBrandFocus(f.name)}
                onBlur={() => setTimeout(() => setBrandFocus(null), 150)}
                onChangeText={v => onChangeDetail(f.name, f.maxLength ? v.replace(/\D/g, '').slice(0, f.maxLength) : v)}
                style={[styles.input, { color: text, borderColor: errors[f.name] ? '#EF4444' : border }]}
              />
              {f.type === 'brand' && brandFocus === f.name && (
                <View style={styles.row}>
                  {brandOptions
                    .filter(b => b.toLowerCase().includes((details[f.name] || '').trim().toLowerCase()))
                    .slice(0, 8)
                    .map(b => chip(b, details[f.name] === b, () => onChangeDetail(f.name, b)))}
                </View>
              )}
            </>
          )}
          {!!errors[f.name] && <CustomText style={styles.error}>{errors[f.name]}</CustomText>}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, fontSize: 14, marginTop: 14, marginBottom: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  error: { color: '#EF4444', fontSize: 12, marginTop: 5 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
});

export default ProductCategoryForm;
