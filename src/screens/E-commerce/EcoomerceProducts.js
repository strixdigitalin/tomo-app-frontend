// import React, { useState, useCallback, useMemo, useRef } from 'react';
// import {
//   View, Text, FlatList, TouchableOpacity, StyleSheet,
//   ScrollView, StatusBar, Dimensions, Animated,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useSelector } from 'react-redux';
// import { THEMES } from '../../redux/reducer/theme';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import { white } from '../../common/Colors/colors';

// // ─── Merch Store — Data & Constants ──────────────────────────────────────────

// export const PRODUCTS = [
//   // ── CAPS ──────────────────────────────────────────────────────────────────
//   {
//     id: 'cap-001',
//     name: 'Champion Snapback',
//     sub: 'Race 77 Edition',
//     cat: 'cap',
//     emoji: '🧢',
//     price: 1299,
//     originalPrice: 1699,
//     badge: 'new',
//     glowColor: '#e8ff00',
//     desc: 'Official race team snapback. Structured 6-panel cap with embroidered team logo, moisture-wicking sweatband, and adjustable snap closure. Built for the paddock, worn everywhere.',
//     sizes: ['S/M', 'L/XL', 'ONE SIZE'],
//     specs: [
//       { key: 'Material', value: '100% Cotton Twill' },
//       { key: 'Closure', value: 'Snapback' },
//       { key: 'Team', value: 'Race 77' },
//       { key: 'Edition', value: '2025 Season' },
//     ],
//   },
//   {
//     id: 'cap-002',
//     name: 'Speed Demon Trucker',
//     sub: 'Limited Race Edition',
//     cat: 'cap',
//     emoji: '🪖',
//     price: 999,
//     originalPrice: 1299,
//     badge: 'hot',
//     glowColor: '#ff4d00',
//     desc: 'Trucker-style cap with mesh back panels for maximum ventilation. Features heat-pressed race number graphic on front panel.',
//     sizes: ['ONE SIZE'],
//     specs: [
//       { key: 'Type', value: 'Trucker' },
//       { key: 'Back', value: 'Mesh Panel' },
//       { key: 'Fit', value: 'Adjustable' },
//       { key: 'Collab', value: 'Race 77' },
//     ],
//   },
//   {
//     id: 'cap-003',
//     name: 'Podium Cap',
//     sub: 'Victory Collection',
//     cat: 'cap',
//     emoji: '🎩',
//     price: 1599,
//     originalPrice: null,
//     badge: 'ltd',
//     glowColor: '#ffd700',
//     desc: 'Worn on the podium. Lightweight performance cap with DryFit technology. Same cap used by drivers on race day.',
//     sizes: ['S', 'M', 'L'],
//     specs: [
//       { key: 'Tech', value: 'DryFit' },
//       { key: 'Weight', value: '82g' },
//       { key: 'UPF', value: '50+' },
//       { key: 'Authenticity', value: 'Certificate included' },
//     ],
//   },
//   // ── APPAREL ───────────────────────────────────────────────────────────────
//   {
//     id: 'app-001',
//     name: 'Race Day Tee',
//     sub: 'Signature Collection',
//     cat: 'apparel',
//     emoji: '👕',
//     price: 1499,
//     originalPrice: 1899,
//     badge: 'hot',
//     glowColor: '#e8ff00',
//     desc: 'Premium heavyweight cotton tee with oversized race graphic print. Garment-washed for a broken-in feel. The unofficial uniform of race day fans.',
//     sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
//     specs: [
//       { key: 'Weight', value: '220gsm' },
//       { key: 'Cotton', value: '100% Combed' },
//       { key: 'Print', value: 'Screen Print' },
//       { key: 'Wash', value: 'Garment Washed' },
//     ],
//   },
//   {
//     id: 'app-002',
//     name: 'Pit Crew Hoodie',
//     sub: 'Tech Series',
//     cat: 'apparel',
//     emoji: '🧥',
//     price: 2999,
//     originalPrice: 3499,
//     badge: 'new',
//     glowColor: '#7b8fff',
//     desc: 'Team-grade pullover hoodie. French terry fabric with race stripe detailing on sleeves. Front kangaroo pocket with hidden earbud port.',
//     sizes: ['S', 'M', 'L', 'XL', '2XL'],
//     specs: [
//       { key: 'Fabric', value: 'French Terry' },
//       { key: 'Weight', value: '320gsm' },
//       { key: 'Feature', value: 'Earbud Port' },
//       { key: 'Fit', value: 'Relaxed' },
//     ],
//   },
//   {
//     id: 'app-003',
//     name: 'Race Track Jacket',
//     sub: 'Bomber Edition',
//     cat: 'apparel',
//     emoji: '🧤',
//     price: 4299,
//     originalPrice: 4999,
//     badge: 'ltd',
//     glowColor: '#ff4d00',
//     desc: 'Satin bomber jacket inspired by vintage pit crew uniforms. Embroidered patches, rib-knit cuffs and collar. Full zip front.',
//     sizes: ['S', 'M', 'L', 'XL'],
//     specs: [
//       { key: 'Shell', value: '100% Satin' },
//       { key: 'Style', value: 'Bomber' },
//       { key: 'Patches', value: '6 embroidered' },
//       { key: 'Edition', value: 'Limited 500 pcs' },
//     ],
//   },
//   // ── BRACELETS ─────────────────────────────────────────────────────────────
//   {
//     id: 'brc-001',
//     name: 'Carbon Fiber Bracelet',
//     sub: 'Race 77 x Carbon',
//     cat: 'bracelet',
//     emoji: '⌚',
//     price: 799,
//     originalPrice: 999,
//     badge: 'new',
//     glowColor: '#888888',
//     desc: 'Genuine carbon fiber bracelet with race team colors. Lightweight at just 14g. Adjustable titanium clasp. The perfect pit lane accessory.',
//     sizes: ['S', 'M', 'L'],
//     specs: [
//       { key: 'Material', value: 'Carbon Fiber' },
//       { key: 'Clasp', value: 'Titanium' },
//       { key: 'Weight', value: '14g' },
//       { key: 'Water resistant', value: '50m' },
//     ],
//   },
//   {
//     id: 'brc-002',
//     name: 'Woven Racer Band',
//     sub: 'Paddock Club',
//     cat: 'bracelet',
//     emoji: '🎽',
//     price: 449,
//     originalPrice: 599,
//     badge: 'hot',
//     glowColor: '#e8ff00',
//     desc: 'Handwoven nylon friendship bracelet with race team color stripes. Adjustable sliding knot. Stack them — collect all 5 colorways.',
//     sizes: ['ONE SIZE'],
//     specs: [
//       { key: 'Material', value: 'Woven Nylon' },
//       { key: 'Closure', value: 'Sliding Knot' },
//       { key: 'Width', value: '8mm' },
//       { key: 'Colorways', value: '5 available' },
//     ],
//   },
//   {
//     id: 'brc-003',
//     name: 'Chrome Cuff',
//     sub: 'Victory Lap Series',
//     cat: 'bracelet',
//     emoji: '💎',
//     price: 1199,
//     originalPrice: null,
//     badge: 'ltd',
//     glowColor: '#ffd700',
//     desc: 'Polished chrome-finish stainless steel cuff. Laser-engraved with race team championship years. Open-ended design fits most wrists.',
//     sizes: ['S/M', 'L/XL'],
//     specs: [
//       { key: 'Material', value: '316L Stainless Steel' },
//       { key: 'Finish', value: 'Polished Chrome' },
//       { key: 'Engraving', value: 'Laser' },
//       { key: 'Packaging', value: 'Gift Box' },
//     ],
//   },
//   {
//     id: 'brc-004',
//     name: 'Race Number Beads',
//     sub: 'Stack Series',
//     cat: 'bracelet',
//     emoji: '🔮',
//     price: 349,
//     originalPrice: 499,
//     badge: 'new',
//     glowColor: '#ff4d00',
//     desc: 'Silicone beaded bracelet with your race number. Available in team colors. Waterproof and sweat-resistant.',
//     sizes: ['ONE SIZE'],
//     specs: [
//       { key: 'Material', value: 'Medical Silicone' },
//       { key: 'Waterproof', value: 'Yes' },
//       { key: 'Numbers', value: '1–99 available' },
//       { key: 'Pack', value: '3 included' },
//     ],
//   },
//   // ── SIGNATURES ────────────────────────────────────────────────────────────
//   {
//     id: 'sig-001',
//     name: 'Champion Autograph',
//     sub: '2024 Champion',
//     cat: 'signature',
//     emoji: '✍️',
//     price: 4999,
//     originalPrice: 5999,
//     badge: 'ltd',
//     glowColor: '#ffd700',
//     desc: 'Authentic hand-signed memorabilia by Race 77 champion. Signed on official team card with certificate of authenticity. Individually numbered from 500.',
//     sizes: ['FRAMED', 'UNFRAMED'],
//     specs: [
//       { key: 'Signed by', value: 'Race 77 Driver' },
//       { key: 'COA', value: 'Yes, included' },
//       { key: 'Numbered', value: 'Yes, /500' },
//       { key: 'Frame', value: 'Optional rosewood' },
//     ],
//   },
//   {
//     id: 'sig-002',
//     name: 'Race Day Print – Signed',
//     sub: 'Gallery Edition',
//     cat: 'signature',
//     emoji: '🖼️',
//     price: 7999,
//     originalPrice: 9999,
//     badge: 'hot',
//     glowColor: '#e8ff00',
//     desc: 'Limited edition A2 race day illustration. Hand-signed in silver pen by the driver. Archival pigment print on 300gsm fine art paper.',
//     sizes: ['A3', 'A2', 'A1'],
//     specs: [
//       { key: 'Print', value: 'Archival Pigment' },
//       { key: 'Paper', value: '300gsm Fine Art' },
//       { key: 'Signature', value: 'Silver pen' },
//       { key: 'Frame', value: 'Not included' },
//     ],
//   },
//   {
//     id: 'sig-003',
//     name: 'Helmet Replica – Signed',
//     sub: "Collector's Piece",
//     cat: 'signature',
//     emoji: '🪖',
//     price: 14999,
//     originalPrice: null,
//     badge: 'ltd',
//     glowColor: '#ff4d00',
//     desc: '1:2 scale die-cast helmet replica, hand-signed on visor. Comes with acrylic display case and team authentication card.',
//     sizes: ['1:2 SCALE'],
//     specs: [
//       { key: 'Scale', value: '1:2' },
//       { key: 'Material', value: 'Die-cast' },
//       { key: 'Signed', value: 'Visor area' },
//       { key: 'Display', value: 'Acrylic case included' },
//     ],
//   },
//   {
//     id: 'sig-004',
//     name: 'Signed Race Card',
//     sub: 'Trading Card Edition',
//     cat: 'signature',
//     emoji: '🃏',
//     price: 1999,
//     originalPrice: 2499,
//     badge: 'new',
//     glowColor: '#7b8fff',
//     desc: 'Official race team trading card, individually hand-signed. Comes in protective sleeve and numbered backing card.',
//     sizes: ['STANDARD'],
//     specs: [
//       { key: 'Card', value: 'Official Team Issue' },
//       { key: 'Signed', value: 'Hand signature' },
//       { key: 'Condition', value: 'Mint' },
//       { key: 'Sleeve', value: 'UV protective' },
//     ],
//   },
//   {
//     id: 'sig-005',
//     name: 'Glove – Match Worn Signed',
//     sub: 'Ultimate Collection',
//     cat: 'signature',
//     emoji: '🧤',
//     price: 24999,
//     originalPrice: null,
//     badge: 'hot',
//     glowColor: '#ffd700',
//     desc: 'Actual race glove worn and signed by the driver. Includes race day report, team letter of authenticity, and custom display case.',
//     sizes: ['ONE'],
//     specs: [
//       { key: 'Worn', value: 'Actual race use' },
//       { key: 'Signed', value: 'Post-race' },
//       { key: 'LOA', value: 'Team authenticated' },
//       { key: 'Display', value: 'Custom shadow box' },
//     ],
//   },
// ];

// export const CATEGORIES = [
//   { id: 'all', label: 'All' },
//   { id: 'cap', label: 'Caps' },
//   { id: 'apparel', label: 'Apparel' },
//   { id: 'bracelet', label: 'Bracelets' },
//   { id: 'signature', label: 'Autographs' },
// ];

// export const BADGE_CONFIG = {
//   new: { label: 'NEW', bg: '#e8ff00', color: '#000' },
//   hot: { label: 'HOT', bg: '#ff4d00', color: '#fff' },
//   ltd: { label: 'LTD', bg: '#ffd700', color: '#000' },
// };

// export const COLORS = {
//   bg: '#0a0a0b',
//   bg2: '#111113',
//   bg3: '#1a1a1e',
//   card: '#141416',
//   border: '#2a2a30',
//   border2: '#3a3a44',
//   primary: '#e8ff00',
//   accent: '#ff4d00',
//   gold: '#ffd700',
//   text: '#f0f0f0',
//   muted: '#888888',
//   muted2: '#555555',
//   red: '#ff3232',
//   green: '#1db954',
// };

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = (width - 48) / 2;

// // ─── GlowDot ─────────────────────────────────────────────────────────────────
// // ─── StoreScreen ─────────────────────────────────────────────────────────────
// const StoreScreen = ({ navigation }) => {
//   const insets = useSafeAreaInsets();
//   const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);

//   const currentTheme = THEMES[selectedColorTheme] || THEMES.default;

//   const COLORS = useMemo(() => ({
//     bg: isDarkMode ? '#000000' : '#ffffff',
//     bg2: isDarkMode ? '#1a1a1a' : '#f8f8f8',
//     bg3: isDarkMode ? '#2a2a2a' : '#e8e8e8',
//     card: isDarkMode ? '#1a1a1a' : '#ffffff',
//     border: isDarkMode ? '#333333' : '#d0d0d0',
//     border2: isDarkMode ? '#444444' : '#b0b0b0',
//     primary: currentTheme.primary,
//     accent: currentTheme.primary,
//     gold: '#ffd700',
//     text: isDarkMode ? '#ffffff' : '#000000',
//     muted: isDarkMode ? '#cccccc' : '#666666',
//     muted2: isDarkMode ? '#999999' : '#333333',
//     red: '#ff3232',
//     green: '#1db954',
//   }), [isDarkMode, currentTheme]);

//   const [selectedCat, setSelectedCat] = useState('all');
//   const [cart, setCart] = useState([]);

//   const filteredProducts = useMemo(() =>
//     selectedCat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === selectedCat),
//     [selectedCat]
//   );

//   const cartCount = useMemo(() => cart.reduce((a, i) => a + i.qty, 0), [cart]);

//   const addToCart = useCallback((product) => {
//     setCart(prev => {
//       const existing = prev.find(i => i.id === product.id);
//       if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
//       return [...prev, { ...product, qty: 1, selectedSize: product.sizes[0] }];
//     });
//   }, []);

//   const isInCart = useCallback((id) => cart.some(i => i.id === id), [cart]);

//   const openProduct = useCallback((product) => {
//     navigation.navigate('EcomProductDetailScreen', { product, cart, setCart });
//   }, [navigation, cart]);

//   const openCart = useCallback(() => {
//     navigation.navigate('CartScreen', { cart, setCart });
//   }, [navigation, cart]);

//   const renderProduct = useCallback(({ item }) => (
//     <ProductCard
//       item={item}
//       onPress={() => openProduct(item)}
//       onAddToCart={() => addToCart(item)}
//       isInCart={isInCart(item.id)}
//     />
//   ), [openProduct, addToCart, isInCart]);

//   const keyExtractor = useCallback((item) => item.id, []);

//   const S = useMemo(() => StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.bg },

//     // Header
//     header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
//     brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//     glowDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, shadowColor: COLORS.primary, shadowOpacity: 1, shadowRadius: 6, elevation: 4 },
//     brandName: { fontSize: 20, fontWeight: '900', color: COLORS.text, letterSpacing: 2 },
//     cartBtn: { backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border2, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, position: 'relative' },
//     cartBtnText: { fontSize: 18 },
//     cartBadge: { position: 'absolute', top: -6, right: -6, backgroundColor: COLORS.accent, borderRadius: 9, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
//     cartBadgeText: { fontSize: 9, fontWeight: '700', color: '#fff' },

//     // Hero
//     heroPad: { paddingHorizontal: 16, marginBottom: 16 },
//     heroBanner: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border2, borderRadius: 16, padding: 20, overflow: 'hidden', position: 'relative', minHeight: 160 },
//     heroGlow: { position: 'absolute', width: 160, height: 160, borderRadius: 80, opacity: 0.1 },
//     heroSeason: { fontSize: 10, letterSpacing: 3, color: COLORS.primary, fontWeight: '700', marginBottom: 6 },
//     heroTitle: { fontSize: 28, fontFamily:FONTS_FAMILY.SourceSans3_Bold, color: COLORS.text, lineHeight: 38, marginBottom: 8, letterSpacing: 1 },
//     heroSub: { fontSize: 13, color: COLORS.muted, marginBottom: 16 },
//     heroCta: { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start' },
//     heroCtaText: { fontSize: 13, fontFamily:FONTS_FAMILY.SourceSans3_Medium, color: white, letterSpacing: 1 },
//     heroNumber: { position: 'absolute', right: 16, bottom: 6, fontSize: 88, fontWeight: '900', color: 'rgba(255,255,255,0.04)', lineHeight: 88 },

//     // Categories
//     catRow: { paddingHorizontal: 16, paddingBottom: 16, gap: 8, flexDirection: 'row' },
//     catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border2, backgroundColor: 'transparent' },
//     catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//     catChipText: { fontSize: 12, fontWeight: '700', color: COLORS.muted, letterSpacing: 0.5 },
//     catChipTextActive: { color: '#000' },

//     // Section
//     sectionLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 20, marginBottom: 12 },
//     sectionTitle: { fontSize: 22, fontWeight: '900', color: COLORS.text, letterSpacing: 1 },
//     sectionCount: { fontSize: 11, color: COLORS.muted, letterSpacing: 0.5 },

//     // Grid
//     grid: { paddingHorizontal: 12 },
//     gridRow: { justifyContent: 'space-between', marginBottom: 12 },

//     // Product Card
//     productCardWrap: { width: CARD_WIDTH },
//     productCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, overflow: 'hidden' },
//     productCardFeatured: { borderColor: COLORS.accent, shadowColor: COLORS.accent, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
//     prodImgArea: { height: 140, alignItems: 'center', justifyContent: 'center', position: 'relative' },
//     badge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
//     badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
//     discBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.accent, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
//     discBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
//     prodEmoji: { fontSize: 52 },
//     prodInfo: { padding: 12 },
//     prodName: { fontSize: 14, fontWeight: '700', color: COLORS.text, letterSpacing: 0.3, marginBottom: 2 },
//     prodSub: { fontSize: 11, color: COLORS.muted, marginBottom: 10 },
//     prodFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//     prodPrice: { fontSize: 18, fontWeight: '900', color: COLORS.primary, letterSpacing: 0.5 },
//     addBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border2, alignItems: 'center', justifyContent: 'center' },
//     addBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//     addBtnText: { fontSize: 18, color: COLORS.text, fontWeight: '700', lineHeight: 22 },
//   }), [COLORS]);

//   const GlowDot = useMemo(() => React.memo(() => {
//     const pulse = useRef(new Animated.Value(0.6)).current;
//     React.useEffect(() => {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
//           Animated.timing(pulse, { toValue: 0.6, duration: 1000, useNativeDriver: true }),
//         ])
//       ).start();
//     }, []);
//     return (
//       <Animated.View style={[S.glowDot, { opacity: pulse }]} />
//     );
//   }), [S]);

//   const HeroBanner = useMemo(() => React.memo(({ onPress }) => (
//     <TouchableOpacity style={S.heroBanner} onPress={onPress} activeOpacity={0.85}>
//       <Text style={S.heroSeason}>2025 SEASON COLLECTION</Text>
//       <Text style={S.heroTitle}>
//         {'RACE DAY\n'}
//         <Text style={{ color: COLORS.primary }}>EDITION</Text>
//       </Text>
//       <Text style={S.heroSub}>Official racer merch — limited drops</Text>
//       <View style={S.heroCta}>
//         <Text style={S.heroCtaText}>SHOP NOW  ▶</Text>
//       </View>
//       <Text style={S.heroNumber}>77</Text>
//       <View style={[S.heroGlow, { top: -30, right: -30, backgroundColor: COLORS.primary }]} />
//       <View style={[S.heroGlow, { bottom: -20, left: '40%', backgroundColor: COLORS.accent }]} />
//     </TouchableOpacity>
//   )), [S, COLORS]);

//   const CategoryChip = useMemo(() => React.memo(({ label, active, onPress }) => (
//     <TouchableOpacity
//       style={[S.catChip, active && S.catChipActive]}
//       onPress={onPress}
//       activeOpacity={0.7}
//     >
//       <Text style={[S.catChipText, active && S.catChipTextActive]}>{label}</Text>
//     </TouchableOpacity>
//   )), [S]);

//   const ProductCard = useMemo(() => React.memo(({ item, onPress, onAddToCart, isInCart }) => {
//     const scale = useRef(new Animated.Value(1)).current;
//     const badge = BADGE_CONFIG[item.badge];
//     const discount = item.originalPrice
//       ? Math.round((1 - item.price / item.originalPrice) * 100)
//       : null;

//     const handlePressIn = useCallback(() => {
//       Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, damping: 15, stiffness: 150 }).start();
//     }, []);
//     const handlePressOut = useCallback(() => {
//       Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 15, stiffness: 150 }).start();
//     }, []);

//     return (
//       <Animated.View style={[S.productCardWrap, { transform: [{ scale }] }]}>
//         <TouchableOpacity
//           style={[S.productCard, item.badge === 'ltd' && S.productCardFeatured]}
//           onPress={onPress}
//           onPressIn={handlePressIn}
//           onPressOut={handlePressOut}
//           activeOpacity={1}
//         >
//           <View style={[S.prodImgArea, { backgroundColor: item.glowColor + '15' }]}>
//             {badge && (
//               <View style={[S.badge, { backgroundColor: badge.bg }]}>
//                 <Text style={[S.badgeText, { color: badge.color }]}>{badge.label}</Text>
//               </View>
//             )}
//             {discount && (
//               <View style={S.discBadge}>
//                 <Text style={S.discBadgeText}>-{discount}%</Text>
//               </View>
//             )}
//             <Text style={S.prodEmoji}>{item.emoji}</Text>
//           </View>
//           <View style={S.prodInfo}>
//             <Text style={S.prodName} numberOfLines={1}>{item.name}</Text>
//             <Text style={S.prodSub} numberOfLines={1}>{item.sub}</Text>
//             <View style={S.prodFooter}>
//               <Text style={S.prodPrice}>₹{item.price.toLocaleString()}</Text>
//               <TouchableOpacity
//                 style={[S.addBtn, isInCart && S.addBtnActive]}
//                 onPress={onAddToCart}
//                 hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//               >
//                 <Text style={[S.addBtnText, isInCart && { color: '#000' }]}>
//                   {isInCart ? '✓' : '+'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   }), [S]);

//   return (
//     <View style={[S.container, { paddingTop: insets.top }]}>
//       <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

//       {/* Header */}
//       <View style={S.header}>
//         <View style={S.brandRow}>
//           <GlowDot />
//           <Text style={S.brandName}>VELOCITY GEAR</Text>
//         </View>
//         <TouchableOpacity style={S.cartBtn} onPress={openCart}>
//           <Text style={S.cartBtnText}>🛒</Text>
//           {cartCount > 0 && (
//             <View style={S.cartBadge}>
//               <Text style={S.cartBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
//         {/* Hero */}
//         <View style={S.heroPad}>
//           <HeroBanner onPress={() => openProduct(PRODUCTS[0])} />
//         </View>

//         {/* Categories */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={S.catRow}
//         >
//           {CATEGORIES.map(cat => (
//             <CategoryChip
//               key={cat.id}
//               label={cat.label}
//               active={selectedCat === cat.id}
//               onPress={() => setSelectedCat(cat.id)}
//             />
//           ))}
//         </ScrollView>

//         {/* Section label */}
//         <View style={S.sectionLabel}>
//           <Text style={S.sectionTitle}>Products</Text>
//           <Text style={S.sectionCount}>{filteredProducts.length} items</Text>
//         </View>

//         {/* Grid */}
//         <FlatList
//           data={filteredProducts}
//           keyExtractor={keyExtractor}
//           renderItem={renderProduct}
//           numColumns={2}
//           scrollEnabled={false}
//           contentContainerStyle={S.grid}
//           columnWrapperStyle={S.gridRow}
//           maxToRenderPerBatch={6}
//           initialNumToRender={6}
//           removeClippedSubviews
//         />
//       </ScrollView>
//     </View>
//   );
// };

// // ─── Styles ───────────────────────────────────────────────────────────────────
// // Moved inside component

// export default StoreScreen;


// import React, { useState, useCallback, useMemo, useRef } from 'react';
// import {
//   View, Text, FlatList, TouchableOpacity, StyleSheet,
//   ScrollView, StatusBar, Dimensions, Animated, Platform,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useSelector } from 'react-redux';
// import { BlurView } from '@react-native-community/blur'; // add this dep if not present
// import { THEMES } from '../../redux/reducer/theme';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import { white } from '../../common/Colors/colors';

// // ─── Merch Store — Data & Constants ──────────────────────────────────────────

// export const PRODUCTS = [
//   // ── CAPS ──────────────────────────────────────────────────────────────────
//   {
//     id: 'cap-001',
//     name: 'Champion Snapback',
//     sub: 'Race 77 Edition',
//     cat: 'cap',
//     emoji: '🧢',
//     price: 1299,
//     originalPrice: 1699,
//     badge: 'new',
//     glowColor: '#c8d8ff',
//     desc: 'Official race team snapback. Structured 6-panel cap with embroidered team logo, moisture-wicking sweatband, and adjustable snap closure. Built for the paddock, worn everywhere.',
//     sizes: ['S/M', 'L/XL', 'ONE SIZE'],
//     specs: [
//       { key: 'Material', value: '100% Cotton Twill' },
//       { key: 'Closure', value: 'Snapback' },
//       { key: 'Team', value: 'Race 77' },
//       { key: 'Edition', value: '2025 Season' },
//     ],
//   },
//   {
//     id: 'cap-002',
//     name: 'Speed Demon Trucker',
//     sub: 'Limited Race Edition',
//     cat: 'cap',
//     emoji: '🪖',
//     price: 999,
//     originalPrice: 1299,
//     badge: 'hot',
//     glowColor: '#ffc8a0',
//     desc: 'Trucker-style cap with mesh back panels for maximum ventilation. Features heat-pressed race number graphic on front panel.',
//     sizes: ['ONE SIZE'],
//     specs: [
//       { key: 'Type', value: 'Trucker' },
//       { key: 'Back', value: 'Mesh Panel' },
//       { key: 'Fit', value: 'Adjustable' },
//       { key: 'Collab', value: 'Race 77' },
//     ],
//   },
//   {
//     id: 'cap-003',
//     name: 'Podium Cap',
//     sub: 'Victory Collection',
//     cat: 'cap',
//     emoji: '🎩',
//     price: 1599,
//     originalPrice: null,
//     badge: 'ltd',
//     glowColor: '#ffe5a0',
//     desc: 'Worn on the podium. Lightweight performance cap with DryFit technology. Same cap used by drivers on race day.',
//     sizes: ['S', 'M', 'L'],
//     specs: [
//       { key: 'Tech', value: 'DryFit' },
//       { key: 'Weight', value: '82g' },
//       { key: 'UPF', value: '50+' },
//       { key: 'Authenticity', value: 'Certificate included' },
//     ],
//   },
//   // ── APPAREL ───────────────────────────────────────────────────────────────
//   {
//     id: 'app-001',
//     name: 'Race Day Tee',
//     sub: 'Signature Collection',
//     cat: 'apparel',
//     emoji: '👕',
//     price: 1499,
//     originalPrice: 1899,
//     badge: 'hot',
//     glowColor: '#c8d8ff',
//     desc: 'Premium heavyweight cotton tee with oversized race graphic print. Garment-washed for a broken-in feel. The unofficial uniform of race day fans.',
//     sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
//     specs: [
//       { key: 'Weight', value: '220gsm' },
//       { key: 'Cotton', value: '100% Combed' },
//       { key: 'Print', value: 'Screen Print' },
//       { key: 'Wash', value: 'Garment Washed' },
//     ],
//   },
//   {
//     id: 'app-002',
//     name: 'Pit Crew Hoodie',
//     sub: 'Tech Series',
//     cat: 'apparel',
//     emoji: '🧥',
//     price: 2999,
//     originalPrice: 3499,
//     badge: 'new',
//     glowColor: '#b8c8ff',
//     desc: 'Team-grade pullover hoodie. French terry fabric with race stripe detailing on sleeves. Front kangaroo pocket with hidden earbud port.',
//     sizes: ['S', 'M', 'L', 'XL', '2XL'],
//     specs: [
//       { key: 'Fabric', value: 'French Terry' },
//       { key: 'Weight', value: '320gsm' },
//       { key: 'Feature', value: 'Earbud Port' },
//       { key: 'Fit', value: 'Relaxed' },
//     ],
//   },
//   {
//     id: 'app-003',
//     name: 'Race Track Jacket',
//     sub: 'Bomber Edition',
//     cat: 'apparel',
//     emoji: '🧤',
//     price: 4299,
//     originalPrice: 4999,
//     badge: 'ltd',
//     glowColor: '#ffc8a0',
//     desc: 'Satin bomber jacket inspired by vintage pit crew uniforms. Embroidered patches, rib-knit cuffs and collar. Full zip front.',
//     sizes: ['S', 'M', 'L', 'XL'],
//     specs: [
//       { key: 'Shell', value: '100% Satin' },
//       { key: 'Style', value: 'Bomber' },
//       { key: 'Patches', value: '6 embroidered' },
//       { key: 'Edition', value: 'Limited 500 pcs' },
//     ],
//   },
//   // ── BRACELETS ─────────────────────────────────────────────────────────────
//   {
//     id: 'brc-001',
//     name: 'Carbon Fiber Bracelet',
//     sub: 'Race 77 x Carbon',
//     cat: 'bracelet',
//     emoji: '⌚',
//     price: 799,
//     originalPrice: 999,
//     badge: 'new',
//     glowColor: '#d0d0e0',
//     desc: 'Genuine carbon fiber bracelet with race team colors. Lightweight at just 14g. Adjustable titanium clasp. The perfect pit lane accessory.',
//     sizes: ['S', 'M', 'L'],
//     specs: [
//       { key: 'Material', value: 'Carbon Fiber' },
//       { key: 'Clasp', value: 'Titanium' },
//       { key: 'Weight', value: '14g' },
//       { key: 'Water resistant', value: '50m' },
//     ],
//   },
//   {
//     id: 'brc-002',
//     name: 'Woven Racer Band',
//     sub: 'Paddock Club',
//     cat: 'bracelet',
//     emoji: '🎽',
//     price: 449,
//     originalPrice: 599,
//     badge: 'hot',
//     glowColor: '#c8d8ff',
//     desc: 'Handwoven nylon friendship bracelet with race team color stripes. Adjustable sliding knot. Stack them — collect all 5 colorways.',
//     sizes: ['ONE SIZE'],
//     specs: [
//       { key: 'Material', value: 'Woven Nylon' },
//       { key: 'Closure', value: 'Sliding Knot' },
//       { key: 'Width', value: '8mm' },
//       { key: 'Colorways', value: '5 available' },
//     ],
//   },
//   {
//     id: 'brc-003',
//     name: 'Chrome Cuff',
//     sub: 'Victory Lap Series',
//     cat: 'bracelet',
//     emoji: '💎',
//     price: 1199,
//     originalPrice: null,
//     badge: 'ltd',
//     glowColor: '#ffe5a0',
//     desc: 'Polished chrome-finish stainless steel cuff. Laser-engraved with race team championship years. Open-ended design fits most wrists.',
//     sizes: ['S/M', 'L/XL'],
//     specs: [
//       { key: 'Material', value: '316L Stainless Steel' },
//       { key: 'Finish', value: 'Polished Chrome' },
//       { key: 'Engraving', value: 'Laser' },
//       { key: 'Packaging', value: 'Gift Box' },
//     ],
//   },
//   {
//     id: 'brc-004',
//     name: 'Race Number Beads',
//     sub: 'Stack Series',
//     cat: 'bracelet',
//     emoji: '🔮',
//     price: 349,
//     originalPrice: 499,
//     badge: 'new',
//     glowColor: '#ffc8a0',
//     desc: 'Silicone beaded bracelet with your race number. Available in team colors. Waterproof and sweat-resistant.',
//     sizes: ['ONE SIZE'],
//     specs: [
//       { key: 'Material', value: 'Medical Silicone' },
//       { key: 'Waterproof', value: 'Yes' },
//       { key: 'Numbers', value: '1–99 available' },
//       { key: 'Pack', value: '3 included' },
//     ],
//   },
//   // ── SIGNATURES ────────────────────────────────────────────────────────────
//   {
//     id: 'sig-001',
//     name: 'Champion Autograph',
//     sub: '2024 Champion',
//     cat: 'signature',
//     emoji: '✍️',
//     price: 4999,
//     originalPrice: 5999,
//     badge: 'ltd',
//     glowColor: '#ffe5a0',
//     desc: 'Authentic hand-signed memorabilia by Race 77 champion. Signed on official team card with certificate of authenticity. Individually numbered from 500.',
//     sizes: ['FRAMED', 'UNFRAMED'],
//     specs: [
//       { key: 'Signed by', value: 'Race 77 Driver' },
//       { key: 'COA', value: 'Yes, included' },
//       { key: 'Numbered', value: 'Yes, /500' },
//       { key: 'Frame', value: 'Optional rosewood' },
//     ],
//   },
//   {
//     id: 'sig-002',
//     name: 'Race Day Print – Signed',
//     sub: 'Gallery Edition',
//     cat: 'signature',
//     emoji: '🖼️',
//     price: 7999,
//     originalPrice: 9999,
//     badge: 'hot',
//     glowColor: '#c8d8ff',
//     desc: 'Limited edition A2 race day illustration. Hand-signed in silver pen by the driver. Archival pigment print on 300gsm fine art paper.',
//     sizes: ['A3', 'A2', 'A1'],
//     specs: [
//       { key: 'Print', value: 'Archival Pigment' },
//       { key: 'Paper', value: '300gsm Fine Art' },
//       { key: 'Signature', value: 'Silver pen' },
//       { key: 'Frame', value: 'Not included' },
//     ],
//   },
//   {
//     id: 'sig-003',
//     name: 'Helmet Replica – Signed',
//     sub: "Collector's Piece",
//     cat: 'signature',
//     emoji: '🪖',
//     price: 14999,
//     originalPrice: null,
//     badge: 'ltd',
//     glowColor: '#ffc8a0',
//     desc: '1:2 scale die-cast helmet replica, hand-signed on visor. Comes with acrylic display case and team authentication card.',
//     sizes: ['1:2 SCALE'],
//     specs: [
//       { key: 'Scale', value: '1:2' },
//       { key: 'Material', value: 'Die-cast' },
//       { key: 'Signed', value: 'Visor area' },
//       { key: 'Display', value: 'Acrylic case included' },
//     ],
//   },
//   {
//     id: 'sig-004',
//     name: 'Signed Race Card',
//     sub: 'Trading Card Edition',
//     cat: 'signature',
//     emoji: '🃏',
//     price: 1999,
//     originalPrice: 2499,
//     badge: 'new',
//     glowColor: '#b8c8ff',
//     desc: 'Official race team trading card, individually hand-signed. Comes in protective sleeve and numbered backing card.',
//     sizes: ['STANDARD'],
//     specs: [
//       { key: 'Card', value: 'Official Team Issue' },
//       { key: 'Signed', value: 'Hand signature' },
//       { key: 'Condition', value: 'Mint' },
//       { key: 'Sleeve', value: 'UV protective' },
//     ],
//   },
//   {
//     id: 'sig-005',
//     name: 'Glove – Match Worn Signed',
//     sub: 'Ultimate Collection',
//     cat: 'signature',
//     emoji: '🧤',
//     price: 24999,
//     originalPrice: null,
//     badge: 'hot',
//     glowColor: '#ffe5a0',
//     desc: 'Actual race glove worn and signed by the driver. Includes race day report, team letter of authenticity, and custom display case.',
//     sizes: ['ONE'],
//     specs: [
//       { key: 'Worn', value: 'Actual race use' },
//       { key: 'Signed', value: 'Post-race' },
//       { key: 'LOA', value: 'Team authenticated' },
//       { key: 'Display', value: 'Custom shadow box' },
//     ],
//   },
// ];

// export const CATEGORIES = [
//   { id: 'all', label: 'All' },
//   { id: 'cap', label: 'Caps' },
//   { id: 'apparel', label: 'Apparel' },
//   { id: 'bracelet', label: 'Bracelets' },
//   { id: 'signature', label: 'Autographs' },
// ];

// export const BADGE_CONFIG = {
//   new:  { label: 'NEW', bg: 'rgba(180,200,255,0.25)', color: '#c8d8ff', border: 'rgba(180,200,255,0.4)' },
//   hot:  { label: 'HOT', bg: 'rgba(255,160,100,0.22)', color: '#ffbf8a', border: 'rgba(255,160,100,0.4)' },
//   ltd:  { label: 'LTD', bg: 'rgba(255,220,130,0.22)', color: '#ffe5a0', border: 'rgba(255,220,130,0.4)' },
// };

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = (width - 48) / 2;

// // ─── StoreScreen ─────────────────────────────────────────────────────────────
// const StoreScreen = ({ navigation }) => {
//   const insets = useSafeAreaInsets();
//   const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
//   const { THEMES } = require('../../redux/reducer/theme');
//   const currentTheme = THEMES[selectedColorTheme] || THEMES.default;

//   // ── Glassmorphism-friendly palette ──────────────────────────────────────
//   // Primary is now a soft ice-blue instead of neon yellow — easier on eyes,
//   // still distinctive. Accents are warm amber & subtle gold.
//   const COLORS = useMemo(() => ({
//     bg:       isDarkMode ? '#08080f' : '#f0f2fa',
//     bg2:      isDarkMode ? '#0f0f1a' : '#e8eaf5',
//     bg3:      isDarkMode ? '#16162a' : '#dde0f0',
//     card:     isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.55)',
//     cardBorder: isDarkMode ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.75)',
//     glassBg:  isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.45)',
//     glassBorder: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.8)',

//     // Primary: soft ice-blue — replaces aggressive #e8ff00
//     primary:    isDarkMode ? '#a8c4ff' : '#4a7eff',
//     primaryBg:  isDarkMode ? 'rgba(168,196,255,0.15)' : 'rgba(74,126,255,0.12)',
//     primaryBorder: isDarkMode ? 'rgba(168,196,255,0.35)' : 'rgba(74,126,255,0.35)',

//     // Accent: warm amber (replaces harsh #ff4d00)
//     accent:     isDarkMode ? '#ffbf8a' : '#e07030',
//     accentBg:   isDarkMode ? 'rgba(255,160,100,0.15)' : 'rgba(224,112,48,0.1)',

//     // Gold stays but softened
//     gold:    '#d4a843',
//     goldBg:  'rgba(212,168,67,0.14)',

//     text:    isDarkMode ? '#eeeef8' : '#0a0a18',
//     muted:   isDarkMode ? '#8888aa' : '#6666aa',
//     muted2:  isDarkMode ? '#4a4a70' : '#9090c0',
//     red:     '#e05555',
//     green:   '#4ecf80',

//     // Glow orbs in hero
//     orb1: isDarkMode ? 'rgba(100,140,255,0.18)' : 'rgba(100,140,255,0.25)',
//     orb2: isDarkMode ? 'rgba(248, 191, 144, 0.12)'  : 'rgba(255,160,80,0.18)',
//   }), [isDarkMode, currentTheme]);

//   const [selectedCat, setSelectedCat] = useState('all');
//   const [cart, setCart] = useState([]);

//   const filteredProducts = useMemo(() =>
//     selectedCat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === selectedCat),
//     [selectedCat]
//   );

//   const cartCount = useMemo(() => cart.reduce((a, i) => a + i.qty, 0), [cart]);

//   const addToCart = useCallback((product) => {
//     setCart(prev => {
//       const existing = prev.find(i => i.id === product.id);
//       if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
//       return [...prev, { ...product, qty: 1, selectedSize: product.sizes[0] }];
//     });
//   }, []);

//   const isInCart = useCallback((id) => cart.some(i => i.id === id), [cart]);

//   const openProduct = useCallback((product) => {
//     navigation.navigate('EcomProductDetailScreen', { product, cart, setCart });
//   }, [navigation, cart]);

//   const openCart = useCallback(() => {
//     navigation.navigate('CartScreen', { cart, setCart });
//   }, [navigation, cart]);

//   const renderProduct = useCallback(({ item }) => (
//     <ProductCard
//       item={item}
//       COLORS={COLORS}
//       S={S}
//       onPress={() => openProduct(item)}
//       onAddToCart={() => addToCart(item)}
//       isInCart={isInCart(item.id)}
//     />
//   ), [openProduct, addToCart, isInCart, COLORS]);

//   const keyExtractor = useCallback((item) => item.id, []);

//   const S = useMemo(() => StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.bg },

//     // ── Background orbs (absolute, rendered via View) ──
//     orb: { position: 'absolute', borderRadius: 999 },

//     // ── Header (glass) ──
//     header: {
//       flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//       paddingHorizontal: 20, paddingVertical: 14,
//       backgroundColor: COLORS.glassBg,
//       borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder,
//     },
//     brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//     glowDot: {
//       width: 8, height: 8, borderRadius: 4,
//       backgroundColor: COLORS.primary,
//       shadowColor: COLORS.primary, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4,
//     },
//     brandName: { fontSize: 20, fontWeight: '900', color: COLORS.text, letterSpacing: 2 },
//     cartBtn: {
//       backgroundColor: COLORS.glassBg,
//       borderWidth: 1, borderColor: COLORS.glassBorder,
//       borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, position: 'relative',
//     },
//     cartBtnText: { fontSize: 18 },
//     cartBadge: {
//       position: 'absolute', top: -6, right: -6,
//       backgroundColor: COLORS.accent,
//       borderRadius: 9, width: 18, height: 18,
//       alignItems: 'center', justifyContent: 'center',
//     },
//     cartBadgeText: { fontSize: 9, fontWeight: '700', color: '#fff' },

//     // ── Hero ──
//     heroPad: { paddingHorizontal: 16, marginBottom: 16 },
//     heroBanner: {
//       backgroundColor: COLORS.glassBg,
//       borderWidth: 1, borderColor: COLORS.glassBorder,
//       borderRadius: 20, padding: 22, overflow: 'hidden',
//       position: 'relative', minHeight: 170,
//     },
//     heroGlow: { position: 'absolute', borderRadius: 999, opacity: 0.55 },
//     heroSeason: { fontSize: 10, letterSpacing: 3, color: COLORS.primary, fontWeight: '700', marginBottom: 6 },
//     heroTitle: { fontSize: 28, fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: COLORS.text, lineHeight: 38, marginBottom: 8, letterSpacing: 1 },
//     heroAccent: { color: COLORS.primary },
//     heroSub: { fontSize: 13, color: COLORS.muted, marginBottom: 16 },
//     heroCta: {
//       backgroundColor: COLORS.primaryBg,
//       borderWidth: 1, borderColor: COLORS.primaryBorder,
//       borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9,
//       alignSelf: 'flex-start',
//     },
//     heroCtaText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: COLORS.primary, letterSpacing: 1 },
//     heroNumber: { position: 'absolute', right: 16, bottom: 6, fontSize: 88, fontWeight: '900', color: 'rgba(255,255,255,0.04)', lineHeight: 88 },

//     // ── Categories ──
//     catRow: { paddingHorizontal: 16, paddingBottom: 16, gap: 8, flexDirection: 'row' },
//     catChip: {
//       paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
//       borderWidth: 1, borderColor: COLORS.glassBorder,
//       backgroundColor: COLORS.glassBg,
//     },
//     catChipActive: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primaryBorder },
//     catChipText: { fontSize: 12, fontWeight: '700', color: COLORS.muted, letterSpacing: 0.5 },
//     catChipTextActive: { color: COLORS.primary },

//     // ── Section ──
//     sectionLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 20, marginBottom: 12 },
//     sectionTitle: { fontSize: 22, fontWeight: '900', color: COLORS.text, letterSpacing: 1 },
//     sectionCount: { fontSize: 11, color: COLORS.muted, letterSpacing: 0.5 },

//     // ── Grid ──
//     grid: { paddingHorizontal: 12 },
//     gridRow: { justifyContent: 'space-between', marginBottom: 12 },

//     // ── Product Card (glass) ──
//     productCardWrap: { width: CARD_WIDTH },
//     productCard: {
//       backgroundColor: COLORS.card,
//       borderWidth: 1, borderColor: COLORS.cardBorder,
//       borderRadius: 16, overflow: 'hidden',
//     },
//     productCardFeatured: {
//       borderColor: COLORS.goldBg,
//       shadowColor: COLORS.gold,
//       shadowOpacity: 0.18, shadowRadius: 10, elevation: 4,
//     },
//     prodImgArea: { height: 140, alignItems: 'center', justifyContent: 'center', position: 'relative' },
//     badge: {
//       position: 'absolute', top: 8, left: 8,
//       paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
//       borderWidth: 1,
//     },
//     badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
//     discBadge: {
//       position: 'absolute', top: 8, right: 8,
//       backgroundColor: COLORS.accentBg,
//       borderWidth: 1, borderColor: COLORS.accent + '55',
//       paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6,
//     },
//     discBadgeText: { fontSize: 9, fontWeight: '800', color: COLORS.accent },
//     prodEmoji: { fontSize: 52 },
//     prodInfo: { padding: 12 },
//     prodName: { fontSize: 14, fontWeight: '700', color: COLORS.text, letterSpacing: 0.3, marginBottom: 2 },
//     prodSub: { fontSize: 11, color: COLORS.muted, marginBottom: 10 },
//     prodFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//     prodPrice: { fontSize: 17, fontWeight: '900', color: COLORS.text, letterSpacing: 0.3 },
//     addBtn: {
//       width: 30, height: 30, borderRadius: 8,
//       backgroundColor: COLORS.glassBg,
//       borderWidth: 1, borderColor: COLORS.glassBorder,
//       alignItems: 'center', justifyContent: 'center',
//     },
//     addBtnActive: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primaryBorder },
//     addBtnText: { fontSize: 18, color: COLORS.muted, fontWeight: '700', lineHeight: 22 },
//     addBtnTextActive: { color: COLORS.primary },
//   }), [COLORS]);

//   // ── Sub-components ─────────────────────────────────────────────────────────

//   const GlowDot = useMemo(() => React.memo(() => {
//     const pulse = useRef(new Animated.Value(0.5)).current;
//     React.useEffect(() => {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
//           Animated.timing(pulse, { toValue: 0.5, duration: 1200, useNativeDriver: true }),
//         ])
//       ).start();
//     }, []);
//     return <Animated.View style={[S.glowDot, { opacity: pulse }]} />;
//   }), [S]);

//   const HeroBanner = useMemo(() => React.memo(({ onPress }) => (
//     <TouchableOpacity style={S.heroBanner} onPress={onPress} activeOpacity={0.85}>
//       {/* Soft glow orbs inside hero */}
//       <View style={[S.heroGlow, { width: 180, height: 180, top: -60, right: -40, backgroundColor: COLORS.orb1 }]} />
//       <View style={[S.heroGlow, { width: 130, height: 130, bottom: -40, left: '35%', backgroundColor: COLORS.orb2 }]} />

//       <Text style={S.heroSeason}>2025 SEASON COLLECTION</Text>
//       <Text style={S.heroTitle}>
//         {'RACE DAY\n'}
//         <Text style={S.heroAccent}>EDITION</Text>
//       </Text>
//       <Text style={S.heroSub}>Official racer merch — limited drops</Text>
//       <View style={S.heroCta}>
//         <Text style={S.heroCtaText}>SHOP NOW  ▶</Text>
//       </View>
//       <Text style={S.heroNumber}>77</Text>
//     </TouchableOpacity>
//   )), [S, COLORS]);

//   const CategoryChip = useMemo(() => React.memo(({ label, active, onPress }) => (
//     <TouchableOpacity
//       style={[S.catChip, active && S.catChipActive]}
//       onPress={onPress}
//       activeOpacity={0.7}
//     >
//       <Text style={[S.catChipText, active && S.catChipTextActive]}>{label}</Text>
//     </TouchableOpacity>
//   )), [S]);

//   return (
//     <View style={[S.container, { paddingTop: insets.top }]}>
//       {/* Background ambient orbs */}
//       {/* <View style={[S.orb, { width: 300, height: 300, top: -80, right: -80, backgroundColor: COLORS.orb1 }]} />
//       <View style={[S.orb, { width: 220, height: 220, top: 320, left: -80, backgroundColor: COLORS.orb2 }]} />
//       <View style={[S.orb, { width: 180, height: 180, bottom: 200, right: -50, backgroundColor: COLORS.orb1 }]} /> */}

//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

//       {/* Header */}
//       <View style={S.header}>
//         <View style={S.brandRow}>
//           {/* <GlowDot /> */}
//           <Text style={S.brandName}>VELOCITY GEAR</Text>
//         </View>
//         <TouchableOpacity style={S.cartBtn} onPress={openCart}>
//           <Text style={S.cartBtnText}>🛒</Text>
//           {cartCount > 0 && (
//             <View style={S.cartBadge}>
//               <Text style={S.cartBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
//         {/* Hero */}
//         <View style={S.heroPad}>
//           <HeroBanner onPress={() => openProduct(PRODUCTS[0])} />
//         </View>

//         {/* Categories */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={S.catRow}
//         >
//           {CATEGORIES.map(cat => (
//             <CategoryChip
//               key={cat.id}
//               label={cat.label}
//               active={selectedCat === cat.id}
//               onPress={() => setSelectedCat(cat.id)}
//             />
//           ))}
//         </ScrollView>

//         {/* Section label */}
//         <View style={S.sectionLabel}>
//           <Text style={S.sectionTitle}>Products</Text>
//           <Text style={S.sectionCount}>{filteredProducts.length} items</Text>
//         </View>

//         {/* Grid */}
//         <FlatList
//           data={filteredProducts}
//           keyExtractor={keyExtractor}
//           renderItem={renderProduct}
//           numColumns={2}
//           scrollEnabled={false}
//           contentContainerStyle={S.grid}
//           columnWrapperStyle={S.gridRow}
//           maxToRenderPerBatch={6}
//           initialNumToRender={6}
//           removeClippedSubviews
//         />
//       </ScrollView>
//     </View>
//   );
// };

// // ── ProductCard (extracted — needs COLORS & S passed as props) ────────────────
// const ProductCard = React.memo(({ item, onPress, onAddToCart, isInCart, COLORS, S }) => {
//   const scale = useRef(new Animated.Value(1)).current;
//   const badge = BADGE_CONFIG[item.badge];
//   const discount = item.originalPrice
//     ? Math.round((1 - item.price / item.originalPrice) * 100)
//     : null;

//   const handlePressIn = useCallback(() => {
//     Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, damping: 15, stiffness: 150 }).start();
//   }, []);
//   const handlePressOut = useCallback(() => {
//     Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 15, stiffness: 150 }).start();
//   }, []);

//   return (
//     <Animated.View style={[S.productCardWrap, { transform: [{ scale }] }]}>
//       <TouchableOpacity
//         style={[S.productCard, item.badge === 'ltd' && S.productCardFeatured]}
//         onPress={onPress}
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}
//         activeOpacity={1}
//       >
//         {/* Image area with soft tinted bg */}
//         <View style={[S.prodImgArea, { backgroundColor: item.glowColor + '18' }]}>
//           {badge && (
//             <View style={[S.badge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
//               <Text style={[S.badgeText, { color: badge.color }]}>{badge.label}</Text>
//             </View>
//           )}
//           {discount && (
//             <View style={S.discBadge}>
//               <Text style={S.discBadgeText}>-{discount}%</Text>
//             </View>
//           )}
//           <Text style={S.prodEmoji}>{item.emoji}</Text>
//         </View>

//         <View style={S.prodInfo}>
//           <Text style={S.prodName} numberOfLines={1}>{item.name}</Text>
//           <Text style={S.prodSub} numberOfLines={1}>{item.sub}</Text>
//           <View style={S.prodFooter}>
//             <Text style={S.prodPrice}>₹{item.price.toLocaleString()}</Text>
//             <TouchableOpacity
//               style={[S.addBtn, isInCart && S.addBtnActive]}
//               onPress={onAddToCart}
//               hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//             >
//               <Text style={[S.addBtnText, isInCart && S.addBtnTextActive]}>
//                 {isInCart ? '✓' : '+'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// });

// export default StoreScreen;


import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Dimensions, Animated, Platform,
  TextInput, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { App_Primary_color, white } from '../../common/Colors/colors';
import { apiGet, apiPost } from '../../utils/Apis';
import Row from '../../components/wrapper/row';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const BADGE_CONFIG = {
  new:  { label: 'NEW', bg: 'rgba(180,200,255,0.25)', color: '#c8d8ff', border: 'rgba(180,200,255,0.4)' },
  hot:  { label: 'HOT', bg: 'rgba(255,160,100,0.22)', color: '#ffbf8a', border: 'rgba(255,160,100,0.4)' },
  ltd:  { label: 'LTD', bg: 'rgba(255,220,130,0.22)', color: '#ffe5a0', border: 'rgba(255,220,130,0.4)' },
};

// ─── StoreScreen ─────────────────────────────────────────────────────────────
const StoreScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const { THEMES } = require('../../redux/reducer/theme');
  const currentTheme = THEMES[selectedColorTheme] || THEMES.default;

  const COLORS = useMemo(() => ({
    bg:          isDarkMode ? '#08080f' : '#f0f2fa',
    bg2:         isDarkMode ? '#0f0f1a' : '#e8eaf5',
    bg3:         isDarkMode ? '#16162a' : '#dde0f0',
    card:        isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.55)',
    cardBorder:  isDarkMode ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.75)',
    glassBg:     isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.45)',
    glassBorder: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.8)',
    primary:        isDarkMode ? '#a8c4ff' : '#4a7eff',
    primaryBg:      isDarkMode ? 'rgba(168,196,255,0.15)' : 'rgba(74,126,255,0.12)',
    primaryBorder:  isDarkMode ? 'rgba(168,196,255,0.35)' : 'rgba(74,126,255,0.35)',
    accent:      isDarkMode ? '#ffbf8a' : '#e07030',
    accentBg:    isDarkMode ? 'rgba(255,160,100,0.15)' : 'rgba(224,112,48,0.1)',
    gold:        '#d4a843',
    goldBg:      'rgba(212,168,67,0.14)',
    text:        isDarkMode ? '#eeeef8' : '#0a0a18',
    muted:       isDarkMode ? '#8888aa' : '#6666aa',
    muted2:      isDarkMode ? '#4a4a70' : '#9090c0',
    red:         '#e05555',
    green:       '#4ecf80',
    orb1:        isDarkMode ? 'rgba(100,140,255,0.18)' : 'rgba(100,140,255,0.25)',
    orb2:        isDarkMode ? 'rgba(248,191,144,0.12)'  : 'rgba(255,160,80,0.18)',
    inputBg:     isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.7)',
    inputBorder: isDarkMode ? 'rgba(255,255,255,0.13)' : 'rgba(74,126,255,0.2)',
  }), [isDarkMode, currentTheme]);

  // ── State ───────────────────────────────────────────────────────────────────
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [searchText,  setSearchText]  = useState('');
  const [cart,        setCart]        = useState({}); // { productId: qty }
  const [cartLoading, setCartLoading] = useState({}); // { productId: bool }

  // ── Fetch products ──────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async (search = '') => {
    try {
      setLoading(true);
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await apiGet(`/api/shop/GetAllProducts${params}`);
      setProducts(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.log('Products fetch error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Search debounce ─────────────────────────────────────────────────────────
  const searchTimeout = useRef(null);
  const handleSearch = useCallback((text) => {
    setSearchText(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchProducts(text);
    }, 500);
  }, [fetchProducts]);

  // ── Cart total count ────────────────────────────────────────────────────────
  const cartCount = useMemo(() =>
    Object.values(cart).reduce((a, b) => a + b, 0), [cart]);

  // ── Add / Remove cart ───────────────────────────────────────────────────────
  const handleAddToCart = useCallback(async (product) => {
    const id = product._id;
    try {
      setCartLoading(prev => ({ ...prev, [id]: true }));
      await apiPost('/api/shop/AddToCart', {
        ProductId: id,
        Quantity: '1',
      });
      setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    } catch (error) {
      console.log('Add to cart error:', error);
    } finally {
      setCartLoading(prev => ({ ...prev, [id]: false }));
    }
  }, []);

  const handleIncrement = useCallback(async (product) => {
    const id = product._id;
    try {
      setCartLoading(prev => ({ ...prev, [id]: true }));
      await apiPost('/api/shop/AddToCart', { ProductId: id, Quantity: '1' });
      setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    } catch (error) {
      console.log('Increment error:', error);
    } finally {
      setCartLoading(prev => ({ ...prev, [id]: false }));
    }
  }, []);

  const handleDecrement = useCallback((product) => {
    const id = product._id;
    setCart(prev => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  }, []);

  const openCart   = useCallback(() => navigation.navigate('CartScreen', { cart, setCart }), [navigation, cart]);
  const openProduct = useCallback((product) => navigation.navigate('EcomProductDetailScreen', { product, cart, setCart }), [navigation, cart]);

  // ── Styles ──────────────────────────────────────────────────────────────────
  const S = useMemo(() => StyleSheet.create({
    container:   { flex: 1, backgroundColor: COLORS.bg },
    header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: COLORS.glassBg, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
    brandRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
    brandName:   { fontSize: 20, fontWeight: '900', color: COLORS.text, letterSpacing: 2 },
    cartBtn:     { backgroundColor: COLORS.glassBg, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, position: 'relative' },
    cartBtnText: { fontSize: 18 },
    cartBadge:   { position: 'absolute', top: -6, right: -6, backgroundColor: COLORS.accent, borderRadius: 9, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
    cartBadgeText: { fontSize: 9, fontWeight: '700', color: '#fff' },

    // ── Search Bar ──
    searchWrapper: { paddingHorizontal: 16, paddingVertical: 12 },
    searchBox: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      backgroundColor: COLORS.inputBg,
      borderWidth: 1, borderColor: COLORS.inputBorder,
      borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    },
    searchIcon:  { fontSize: 16 },
    searchInput: { flex: 1, fontSize: 14, color: COLORS.text, fontFamily: FONTS_FAMILY.SourceSans3_Regular, padding: 0 },

    // ── Hero ──
    heroPad:    { paddingHorizontal: 16, marginBottom: 16 },
    heroBanner: { backgroundColor: COLORS.glassBg, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: 20, padding: 22, overflow: 'hidden', position: 'relative', minHeight: 170 },
    heroGlow:   { position: 'absolute', borderRadius: 999, opacity: 0.55 },
    heroSeason: { fontSize: 10, letterSpacing: 3, color: COLORS.primary, fontWeight: '700', marginBottom: 6 },
    heroTitle:  { fontSize: 28, fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: COLORS.text, lineHeight: 38, marginBottom: 8, letterSpacing: 1 },
    heroAccent: { color: COLORS.primary },
    heroSub:    { fontSize: 13, color: COLORS.muted, marginBottom: 16 },
    heroCta:    { backgroundColor: COLORS.primaryBg, borderWidth: 1, borderColor: COLORS.primaryBorder, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9, alignSelf: 'flex-start' },
    heroCtaText:{ fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: COLORS.primary, letterSpacing: 1 },
    heroNumber: { position: 'absolute', right: 16, bottom: 6, fontSize: 88, fontWeight: '900', color: 'rgba(255,255,255,0.04)', lineHeight: 88 },

    // ── Section label ──
    sectionLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 20, marginBottom: 12 },
    sectionTitle: { fontSize: 22, fontWeight: '900', color: COLORS.text, letterSpacing: 1 },
    sectionCount: { fontSize: 11, color: COLORS.muted, letterSpacing: 0.5 },

    // ── Grid ──
    grid:    { paddingHorizontal: 12 },
    gridRow: { justifyContent: 'space-between', marginBottom: 12 },

    // ── Product Card ──
    productCardWrap: { width: CARD_WIDTH },
    productCard:     { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder, borderRadius: 16, overflow: 'hidden' },
    prodImgArea:     { height: 140, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    badge:           { position: 'absolute', top: 8, left: 8, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
    badgeText:       { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
    discBadge:       { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.accentBg, borderWidth: 1, borderColor: COLORS.accent + '55', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
    discBadgeText:   { fontSize: 9, fontWeight: '800', color: COLORS.accent },
    prodEmoji:       { fontSize: 52 },
    prodInfo:        { padding: 12 },
    prodName:        { fontSize: 14, fontWeight: '700', color: COLORS.text, letterSpacing: 0.3, marginBottom: 2 },
    prodSub:         { fontSize: 11, color: COLORS.muted, marginBottom: 10 },
    prodFooter:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    prodPrice:       { fontSize: 17, fontWeight: '900', color: COLORS.text, letterSpacing: 0.3 },
    prodOrigPrice:   { fontSize: 11, color: COLORS.muted, textDecorationLine: 'line-through', marginTop: 1 },

    // ── Quantity controls ──
    qtyRow:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
    qtyBtn:    { width: 26, height: 26, borderRadius: 7, backgroundColor: COLORS.glassBg, borderWidth: 1, borderColor: COLORS.glassBorder, alignItems: 'center', justifyContent: 'center' },
    qtyBtnAdd: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primaryBorder },
    qtyBtnText:{ fontSize: 16, color: COLORS.muted, fontWeight: '700', lineHeight: 20 },
    qtyBtnTextAdd: { color: COLORS.primary },
    qtyCount:  { fontSize: 13, fontWeight: '800', color: COLORS.text, minWidth: 18, textAlign: 'center' },

    addBtn:         { width: 30, height: 30, borderRadius: 8, backgroundColor: COLORS.glassBg, borderWidth: 1, borderColor: COLORS.glassBorder, alignItems: 'center', justifyContent: 'center' },
    addBtnActive:   { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primaryBorder },
    addBtnText:     { fontSize: 18, color: COLORS.muted, fontWeight: '700', lineHeight: 22 },
    addBtnTextActive: { color: COLORS.primary },

    // ── Loader / Empty ──
    loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
    emptyWrap:  { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyText:  { fontSize: 14, color: COLORS.muted, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  }), [COLORS]);

  // ── Hero Banner ─────────────────────────────────────────────────────────────
  const HeroBanner = useMemo(() => React.memo(({ onPress }) => (
    <TouchableOpacity style={S.heroBanner} onPress={onPress} activeOpacity={0.85}>
      <View style={[S.heroGlow, { width: 180, height: 180, top: -60, right: -40, backgroundColor: COLORS.orb1 }]} />
      <View style={[S.heroGlow, { width: 130, height: 130, bottom: -40, left: '35%', backgroundColor: COLORS.orb2 }]} />
      <Text style={S.heroSeason}>2025 SEASON COLLECTION</Text>
      <Text style={S.heroTitle}>
        {'SHOP\n'}<Text style={S.heroAccent}>EDITION</Text>
      </Text>
      <Text style={S.heroSub}>Official merch — limited drops</Text>
      <View style={S.heroCta}>
        <Text style={S.heroCtaText}>SHOP NOW  ▶</Text>
      </View>
      <Text style={S.heroNumber}>77</Text>
    </TouchableOpacity>
  )), [S, COLORS]);

  // ── Product Card ─────────────────────────────────────────────────────────────
  const renderProduct = useCallback(({ item }) => {
    const id       = item._id;
    const qty      = cart[id] || 0;
    const inCart   = qty > 0;
    const isLoading = cartLoading[id];
    const discount = item.DiscountPrice && item.Price
      ? Math.round((1 - item.DiscountPrice / item.Price) * 100)
      : null;

    // pick emoji by category/name heuristic
    const emoji = item.Images?.[0]
      ? null
      : '🛍️';

    return (
      <Animated.View style={S.productCardWrap}>
        <TouchableOpacity
          style={S.productCard}
          onPress={() => openProduct(item)}
          activeOpacity={0.9}
        >
          {/* Image / Emoji area */}
          <View style={[S.prodImgArea, { backgroundColor: 'rgba(74,126,255,0.07)' }]}>
            {discount !== null && discount > 0 && (
              <View style={S.discBadge}>
                <Text style={S.discBadgeText}>-{discount}%</Text>
              </View>
            )}
            {item.IsFeatured && (
              <View style={[S.badge, { backgroundColor: BADGE_CONFIG.hot.bg, borderColor: BADGE_CONFIG.hot.border, top: 8, left: 8 }]}>
                <Text style={[S.badgeText, { color: BADGE_CONFIG.hot.color }]}>HOT</Text>
              </View>
            )}
            {item.Images?.[0] ? (
              <View style={{ width: '100%', height: '100%' }}>
                {/* eslint-disable-next-line react-native/no-inline-styles */}
                <Animated.Image
                  source={{ uri: item.Images[0] }}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </View>
            ) : (
              <Text style={S.prodEmoji}>🛍️</Text>
            )}
          </View>

          <View style={S.prodInfo}>
            <Text style={S.prodName} numberOfLines={1}>{item.ProductName}</Text>
            <Text style={S.prodSub} numberOfLines={1}>{item.Brand ?? item.ShortDescription}</Text>

            <View style={S.prodFooter}>
              {/* Price block */}
              <View>
                <Text style={S.prodPrice}>
                  ₹{(item.DiscountPrice ?? item.Price)?.toLocaleString()}
                </Text>
                {item.DiscountPrice && item.DiscountPrice !== item.Price && (
                  <Text style={S.prodOrigPrice}>₹{item.Price?.toLocaleString()}</Text>
                )}
              </View>

              {/* Cart controls */}
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : inCart ? (
                <View style={S.qtyRow}>
                  <TouchableOpacity
                    style={S.qtyBtn}
                    onPress={() => handleDecrement(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={S.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={S.qtyCount}>{qty}</Text>
                  <TouchableOpacity
                    style={[S.qtyBtn, S.qtyBtnAdd]}
                    onPress={() => handleIncrement(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={[S.qtyBtnText, S.qtyBtnTextAdd]}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={S.addBtn}
                  onPress={() => handleAddToCart(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={S.addBtnText}>+</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [cart, cartLoading, S, COLORS, openProduct, handleAddToCart, handleIncrement, handleDecrement]);

  const keyExtractor = useCallback((item) => item._id, []);

  // ── Main Return ─────────────────────────────────────────────────────────────
  return (
    <View style={[S.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity style={S.brandRow} >
          <Text style={S.brandName}>E-COMMERCE</Text>
        </TouchableOpacity>
        <Row>
        <TouchableOpacity style={{backgroundColor:App_Primary_color, padding:10, borderRadius:10}} onPress={() => navigation.navigate('Orders')}>
          <Text style={{color: white, fontFamily: FONTS_FAMILY.SourceSans3_Medium}}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={S.cartBtn} onPress={openCart}>
          <Text style={S.cartBtnText}>🛒</Text>
          {cartCount > 0 && (
            <View style={S.cartBadge}>
              <Text style={S.cartBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        </Row>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Hero */}
        <View style={S.heroPad}>
          <HeroBanner onPress={() => products[0] && openProduct(products[0])} />
        </View>

        {/* Search Bar */}
        <View style={S.searchWrapper}>
          <View style={S.searchBox}>
            <Text style={S.searchIcon}>🔍</Text>
            <TextInput
              style={S.searchInput}
              placeholder="Search products..."
              placeholderTextColor={COLORS.muted}
              value={searchText}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Text style={{ fontSize: 16, color: COLORS.muted }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories — commented out as per request */}
        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.catRow}>
          {CATEGORIES.map(cat => (
            <CategoryChip key={cat.id} label={cat.label} active={selectedCat === cat.id} onPress={() => setSelectedCat(cat.id)} />
          ))}
        </ScrollView> */}

        {/* Section label */}
        <View style={S.sectionLabel}>
          <Text style={S.sectionTitle}>Products</Text>
          <Text style={S.sectionCount}>{products.length} items</Text>
        </View>

        {/* Grid */}
        {loading ? (
          <View style={S.loaderWrap}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : products.length === 0 ? (
          <View style={S.emptyWrap}>
            <Text style={{ fontSize: 40 }}>🛍️</Text>
            <Text style={S.emptyText}>No products found</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={keyExtractor}
            renderItem={renderProduct}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={S.grid}
            columnWrapperStyle={S.gridRow}
            maxToRenderPerBatch={6}
            initialNumToRender={6}
            removeClippedSubviews
          />
        )}
      </ScrollView>
    </View>
  );
};

export default StoreScreen;