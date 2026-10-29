import React from 'react';
import { View, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import CustomText from './TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';

// Card for What's New → Tips / Blog items (fields: Name, Detail, Link, Image, createdAt)
const InfoCard = ({ item, isDarkMode }) => {
  const d = item?.createdAt ? new Date(item.createdAt) : null;
  const when = d ? d.toLocaleDateString([], { day: 'numeric', month: 'short' }) : '';
  return (
    <View style={[styles.card, { backgroundColor: isDarkMode ? '#131B2B' : '#FFFFFF', borderColor: isDarkMode ? '#1E293B' : '#E2E8F0' }]}>
      <CustomText style={styles.title}>{item?.Name}</CustomText>
      {!!when && <CustomText style={styles.date}>{when}</CustomText>}
      {!!item?.Detail && <CustomText style={styles.detail}>{item.Detail.replace(/<[^>]*>/g, '')}</CustomText>}
      {!!item?.Link && (
        <TouchableOpacity onPress={() => Linking.openURL(item.Link).catch(() => {})}>
          <CustomText style={styles.link}>Read More</CustomText>
        </TouchableOpacity>
      )}
      {!!item?.Image && <Image source={{ uri: item.Image }} style={styles.image} resizeMode="cover" />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { marginHorizontal: 12, marginBottom: 14, padding: 14, borderRadius: 12, borderWidth: 1 },
  title: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  date: { fontSize: 12, color: '#888', marginBottom: 8 },
  detail: { fontSize: 14, marginBottom: 8 },
  link: { color: '#1877f2', textDecorationLine: 'underline', marginBottom: 10, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  image: { width: '100%', height: 220, borderRadius: 10 },
});

export default InfoCard;
