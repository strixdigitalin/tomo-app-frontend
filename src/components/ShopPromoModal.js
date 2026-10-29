import React from 'react';
import { View, Text, Image, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../assets/Fonts';
import IMG from '../assets/Images';

// Detail sheet for a promoted shop (web: ShopDetailModel.jsx).
const ShopPromoModal = ({ visible, promotion, onClose, isDarkMode, accent }) => {
  const shop = promotion?.SellerShop;
  const seller = promotion?.Seller;

  const bg = isDarkMode ? '#131B2B' : '#FFFFFF';
  const text = isDarkMode ? '#F3F4F6' : '#0F172A';
  const muted = isDarkMode ? '#94A3B8' : '#64748B';
  const chipBg = isDarkMode ? '#1B2538' : '#F1F5F9';

  const name = shop?.Name?.trim() || seller?.StoreName || 'Promoted shop';
  const image = shop?.Image || seller?.CoverImage || seller?.ProfileImage;
  const locations = (shop?.Address || []).map(a => a?.LocationName).filter(Boolean);
  const sellerName = seller?.FullName || seller?.UserName;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: bg, borderColor: accent + '40' }]}>
          <View style={styles.grabber} />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
            <View>
              <Image source={image ? { uri: image } : IMG.MessageProfile} style={styles.cover} resizeMode="cover" />
              <TouchableOpacity style={styles.close} onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="x" size={18} color="#fff" />
              </TouchableOpacity>
              <View style={[styles.promoPill, { backgroundColor: accent }]}>
                <Text style={styles.promoPillText}>Promoted</Text>
              </View>
            </View>

            <View style={{ padding: 18 }}>
              <Text style={[styles.name, { color: text }]}>{name}</Text>
              {locations.map((l, i) => (
                <View key={`${l}-${i}`} style={styles.locRow}>
                  <Icon name="map-pin" size={13} color={accent} />
                  <Text style={[styles.loc, { color: muted }]}>{l}</Text>
                </View>
              ))}

              {!!shop?.Services && <Text style={[styles.services, { color: text }]}>{shop.Services}</Text>}

              {shop?.ShopCategory?.length > 0 && (
                <View style={styles.cats}>
                  {shop.ShopCategory.map((c, i) => (
                    <View key={`${c}-${i}`} style={[styles.cat, { backgroundColor: chipBg }]}>
                      <Text style={[styles.catText, { color: text }]}>{c}</Text>
                    </View>
                  ))}
                </View>
              )}

              {(!!promotion?.Goal || !!promotion?.PromotionType) && (
                <View style={[styles.infoRow, { backgroundColor: chipBg }]}>
                  {!!promotion?.Goal && <Text style={[styles.info, { color: muted }]}>Goal: <Text style={{ color: text }}>{promotion.Goal}</Text></Text>}
                  {!!promotion?.PromotionType && <Text style={[styles.info, { color: muted }]}>Type: <Text style={{ color: text }}>{promotion.PromotionType}</Text></Text>}
                </View>
              )}

              {!!seller && (
                <View style={styles.sellerRow}>
                  <Image source={seller?.ProfileImage ? { uri: seller.ProfileImage } : IMG.MessageProfile} style={styles.sellerAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sellerName, { color: text }]}>
                      {sellerName}
                      {seller?.IsVerified ? '  ✓' : ''}
                    </Text>
                    {!!seller?.StoreName && <Text style={[styles.loc, { color: muted }]}>{seller.StoreName}</Text>}
                  </View>
                </View>
              )}

            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.6)', justifyContent: 'flex-end' },
  sheet: { maxHeight: '90%', borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, overflow: 'hidden' },
  grabber: { width: 44, height: 5, borderRadius: 3, alignSelf: 'center', marginVertical: 10, backgroundColor: '#64748B66' },
  cover: { width: '100%', height: 190, backgroundColor: '#1F2937' },
  close: { position: 'absolute', top: 12, right: 14, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  promoPill: { position: 'absolute', left: 14, bottom: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  promoPillText: { color: '#fff', fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textTransform: 'uppercase' },
  name: { fontSize: 22, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  loc: { marginLeft: 6, fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  services: { fontSize: 15, lineHeight: 22, marginTop: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  cats: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  cat: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, marginRight: 8, marginBottom: 8 },
  catText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  infoRow: { borderRadius: 14, padding: 12, marginTop: 8 },
  info: { fontSize: 13, marginVertical: 2 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  sellerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  sellerName: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
});

export default ShopPromoModal;
