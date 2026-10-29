import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import CustomText from './TextComponent';
import { detailRows } from '../utils/productFields';

// Category-specific details (brand, year, fuel, km, ...) for a product detail screen.
const ProductSpecRows = ({ product }) => {
  const { isDarkMode } = useSelector(state => state.theme);
  const rows = detailRows(product);
  if (!rows.length) return null;
  return (
    <View style={{ marginVertical: 8 }}>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.row}>
          <CustomText style={{ color: isDarkMode ? '#94A3B8' : '#64748B' }}>{label}</CustomText>
          <CustomText style={{ color: isDarkMode ? '#fff' : '#111' }}>{value}</CustomText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
});

export default ProductSpecRows;
