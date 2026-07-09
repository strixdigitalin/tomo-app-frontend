


// import React, { useState, useCallback, useRef, useMemo } from 'react';
// import {
//     View, Text, TouchableOpacity, ScrollView, StyleSheet,
//     StatusBar, Dimensions, Animated,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useSelector } from 'react-redux';
// import { THEMES } from '../../redux/reducer/theme';

// export const BADGE_CONFIG = {
//     new: { label: 'NEW', bg: 'rgba(180,200,255,0.25)', color: '#c8d8ff', border: 'rgba(180,200,255,0.4)' },
//     hot: { label: 'HOT', bg: 'rgba(255,160,100,0.22)', color: '#ffbf8a', border: 'rgba(255,160,100,0.4)' },
//     ltd: { label: 'LTD', bg: 'rgba(255,220,130,0.22)', color: '#ffe5a0', border: 'rgba(255,220,130,0.4)' },
// };

// export const PRODUCTS = [
//     // ── CAPS ──────────────────────────────────────────────────────────────────
//     {
//         id: 'cap-001',
//         name: 'Champion Snapback',
//         sub: 'Race 77 Edition',
//         cat: 'cap',
//         emoji: '🧢',
//         price: 1299,
//         originalPrice: 1699,
//         badge: 'new',
//         glowColor: '#c8d8ff',
//         desc: 'Official race team snapback. Structured 6-panel cap with embroidered team logo, moisture-wicking sweatband, and adjustable snap closure. Built for the paddock, worn everywhere.',
//         sizes: ['S/M', 'L/XL', 'ONE SIZE'],
//         specs: [
//             { key: 'Material', value: '100% Cotton Twill' },
//             { key: 'Closure', value: 'Snapback' },
//             { key: 'Team', value: 'Race 77' },
//             { key: 'Edition', value: '2025 Season' },
//         ],
//     },
//     {
//         id: 'cap-002',
//         name: 'Speed Demon Trucker',
//         sub: 'Limited Race Edition',
//         cat: 'cap',
//         emoji: '🪖',
//         price: 999,
//         originalPrice: 1299,
//         badge: 'hot',
//         glowColor: '#ffc8a0',
//         desc: 'Trucker-style cap with mesh back panels for maximum ventilation. Features heat-pressed race number graphic on front panel.',
//         sizes: ['ONE SIZE'],
//         specs: [
//             { key: 'Type', value: 'Trucker' },
//             { key: 'Back', value: 'Mesh Panel' },
//             { key: 'Fit', value: 'Adjustable' },
//             { key: 'Collab', value: 'Race 77' },
//         ],
//     },
//     {
//         id: 'cap-003',
//         name: 'Podium Cap',
//         sub: 'Victory Collection',
//         cat: 'cap',
//         emoji: '🎩',
//         price: 1599,
//         originalPrice: null,
//         badge: 'ltd',
//         glowColor: '#ffe5a0',
//         desc: 'Worn on the podium. Lightweight performance cap with DryFit technology. Same cap used by drivers on race day.',
//         sizes: ['S', 'M', 'L'],
//         specs: [
//             { key: 'Tech', value: 'DryFit' },
//             { key: 'Weight', value: '82g' },
//             { key: 'UPF', value: '50+' },
//             { key: 'Authenticity', value: 'Certificate included' },
//         ],
//     },
//     // ── APPAREL ───────────────────────────────────────────────────────────────
//     {
//         id: 'app-001',
//         name: 'Race Day Tee',
//         sub: 'Signature Collection',
//         cat: 'apparel',
//         emoji: '👕',
//         price: 1499,
//         originalPrice: 1899,
//         badge: 'hot',
//         glowColor: '#c8d8ff',
//         desc: 'Premium heavyweight cotton tee with oversized race graphic print. Garment-washed for a broken-in feel. The unofficial uniform of race day fans.',
//         sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
//         specs: [
//             { key: 'Weight', value: '220gsm' },
//             { key: 'Cotton', value: '100% Combed' },
//             { key: 'Print', value: 'Screen Print' },
//             { key: 'Wash', value: 'Garment Washed' },
//         ],
//     },
//     {
//         id: 'app-002',
//         name: 'Pit Crew Hoodie',
//         sub: 'Tech Series',
//         cat: 'apparel',
//         emoji: '🧥',
//         price: 2999,
//         originalPrice: 3499,
//         badge: 'new',
//         glowColor: '#b8c8ff',
//         desc: 'Team-grade pullover hoodie. French terry fabric with race stripe detailing on sleeves. Front kangaroo pocket with hidden earbud port.',
//         sizes: ['S', 'M', 'L', 'XL', '2XL'],
//         specs: [
//             { key: 'Fabric', value: 'French Terry' },
//             { key: 'Weight', value: '320gsm' },
//             { key: 'Feature', value: 'Earbud Port' },
//             { key: 'Fit', value: 'Relaxed' },
//         ],
//     },
//     {
//         id: 'app-003',
//         name: 'Race Track Jacket',
//         sub: 'Bomber Edition',
//         cat: 'apparel',
//         emoji: '🧤',
//         price: 4299,
//         originalPrice: 4999,
//         badge: 'ltd',
//         glowColor: '#ffc8a0',
//         desc: 'Satin bomber jacket inspired by vintage pit crew uniforms. Embroidered patches, rib-knit cuffs and collar. Full zip front.',
//         sizes: ['S', 'M', 'L', 'XL'],
//         specs: [
//             { key: 'Shell', value: '100% Satin' },
//             { key: 'Style', value: 'Bomber' },
//             { key: 'Patches', value: '6 embroidered' },
//             { key: 'Edition', value: 'Limited 500 pcs' },
//         ],
//     },
//     // ── BRACELETS ─────────────────────────────────────────────────────────────
//     {
//         id: 'brc-001',
//         name: 'Carbon Fiber Bracelet',
//         sub: 'Race 77 x Carbon',
//         cat: 'bracelet',
//         emoji: '⌚',
//         price: 799,
//         originalPrice: 999,
//         badge: 'new',
//         glowColor: '#d0d0e0',
//         desc: 'Genuine carbon fiber bracelet with race team colors. Lightweight at just 14g. Adjustable titanium clasp. The perfect pit lane accessory.',
//         sizes: ['S', 'M', 'L'],
//         specs: [
//             { key: 'Material', value: 'Carbon Fiber' },
//             { key: 'Clasp', value: 'Titanium' },
//             { key: 'Weight', value: '14g' },
//             { key: 'Water resistant', value: '50m' },
//         ],
//     },
//     {
//         id: 'brc-002',
//         name: 'Woven Racer Band',
//         sub: 'Paddock Club',
//         cat: 'bracelet',
//         emoji: '🎽',
//         price: 449,
//         originalPrice: 599,
//         badge: 'hot',
//         glowColor: '#c8d8ff',
//         desc: 'Handwoven nylon friendship bracelet with race team color stripes. Adjustable sliding knot. Stack them — collect all 5 colorways.',
//         sizes: ['ONE SIZE'],
//         specs: [
//             { key: 'Material', value: 'Woven Nylon' },
//             { key: 'Closure', value: 'Sliding Knot' },
//             { key: 'Width', value: '8mm' },
//             { key: 'Colorways', value: '5 available' },
//         ],
//     },
//     {
//         id: 'brc-003',
//         name: 'Chrome Cuff',
//         sub: 'Victory Lap Series',
//         cat: 'bracelet',
//         emoji: '💎',
//         price: 1199,
//         originalPrice: null,
//         badge: 'ltd',
//         glowColor: '#ffe5a0',
//         desc: 'Polished chrome-finish stainless steel cuff. Laser-engraved with race team championship years. Open-ended design fits most wrists.',
//         sizes: ['S/M', 'L/XL'],
//         specs: [
//             { key: 'Material', value: '316L Stainless Steel' },
//             { key: 'Finish', value: 'Polished Chrome' },
//             { key: 'Engraving', value: 'Laser' },
//             { key: 'Packaging', value: 'Gift Box' },
//         ],
//     },
//     {
//         id: 'brc-004',
//         name: 'Race Number Beads',
//         sub: 'Stack Series',
//         cat: 'bracelet',
//         emoji: '🔮',
//         price: 349,
//         originalPrice: 499,
//         badge: 'new',
//         glowColor: '#ffc8a0',
//         desc: 'Silicone beaded bracelet with your race number. Available in team colors. Waterproof and sweat-resistant.',
//         sizes: ['ONE SIZE'],
//         specs: [
//             { key: 'Material', value: 'Medical Silicone' },
//             { key: 'Waterproof', value: 'Yes' },
//             { key: 'Numbers', value: '1–99 available' },
//             { key: 'Pack', value: '3 included' },
//         ],
//     },
//     // ── SIGNATURES ────────────────────────────────────────────────────────────
//     {
//         id: 'sig-001',
//         name: 'Champion Autograph',
//         sub: '2024 Champion',
//         cat: 'signature',
//         emoji: '✍️',
//         price: 4999,
//         originalPrice: 5999,
//         badge: 'ltd',
//         glowColor: '#ffe5a0',
//         desc: 'Authentic hand-signed memorabilia by Race 77 champion. Signed on official team card with certificate of authenticity. Individually numbered from 500.',
//         sizes: ['FRAMED', 'UNFRAMED'],
//         specs: [
//             { key: 'Signed by', value: 'Race 77 Driver' },
//             { key: 'COA', value: 'Yes, included' },
//             { key: 'Numbered', value: 'Yes, /500' },
//             { key: 'Frame', value: 'Optional rosewood' },
//         ],
//     },
//     {
//         id: 'sig-002',
//         name: 'Race Day Print – Signed',
//         sub: 'Gallery Edition',
//         cat: 'signature',
//         emoji: '🖼️',
//         price: 7999,
//         originalPrice: 9999,
//         badge: 'hot',
//         glowColor: '#c8d8ff',
//         desc: 'Limited edition A2 race day illustration. Hand-signed in silver pen by the driver. Archival pigment print on 300gsm fine art paper.',
//         sizes: ['A3', 'A2', 'A1'],
//         specs: [
//             { key: 'Print', value: 'Archival Pigment' },
//             { key: 'Paper', value: '300gsm Fine Art' },
//             { key: 'Signature', value: 'Silver pen' },
//             { key: 'Frame', value: 'Not included' },
//         ],
//     },
//     {
//         id: 'sig-003',
//         name: 'Helmet Replica – Signed',
//         sub: "Collector's Piece",
//         cat: 'signature',
//         emoji: '🪖',
//         price: 14999,
//         originalPrice: null,
//         badge: 'ltd',
//         glowColor: '#ffc8a0',
//         desc: '1:2 scale die-cast helmet replica, hand-signed on visor. Comes with acrylic display case and team authentication card.',
//         sizes: ['1:2 SCALE'],
//         specs: [
//             { key: 'Scale', value: '1:2' },
//             { key: 'Material', value: 'Die-cast' },
//             { key: 'Signed', value: 'Visor area' },
//             { key: 'Display', value: 'Acrylic case included' },
//         ],
//     },
//     {
//         id: 'sig-004',
//         name: 'Signed Race Card',
//         sub: 'Trading Card Edition',
//         cat: 'signature',
//         emoji: '🃏',
//         price: 1999,
//         originalPrice: 2499,
//         badge: 'new',
//         glowColor: '#b8c8ff',
//         desc: 'Official race team trading card, individually hand-signed. Comes in protective sleeve and numbered backing card.',
//         sizes: ['STANDARD'],
//         specs: [
//             { key: 'Card', value: 'Official Team Issue' },
//             { key: 'Signed', value: 'Hand signature' },
//             { key: 'Condition', value: 'Mint' },
//             { key: 'Sleeve', value: 'UV protective' },
//         ],
//     },
//     {
//         id: 'sig-005',
//         name: 'Glove – Match Worn Signed',
//         sub: 'Ultimate Collection',
//         cat: 'signature',
//         emoji: '🧤',
//         price: 24999,
//         originalPrice: null,
//         badge: 'hot',
//         glowColor: '#ffe5a0',
//         desc: 'Actual race glove worn and signed by the driver. Includes race day report, team letter of authenticity, and custom display case.',
//         sizes: ['ONE'],
//         specs: [
//             { key: 'Worn', value: 'Actual race use' },
//             { key: 'Signed', value: 'Post-race' },
//             { key: 'LOA', value: 'Team authenticated' },
//             { key: 'Display', value: 'Custom shadow box' },
//         ],
//     },
// ];

// const { width } = Dimensions.get('window');

// // ─── ProductDetailScreen ─────────────────────────────────────────────────────
// const EcomProductDetailScreen = ({ route, navigation }) => {

//     const { product, cart, setCart } = route.params;
//     const insets = useSafeAreaInsets();
//     const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
//     const currentTheme = THEMES[selectedColorTheme] || THEMES.default;

//     // ── Glassmorphism palette (matches StoreScreen) ──────────────────────────
//     const COLORS = useMemo(() => ({
//         bg:       isDarkMode ? '#08080f' : '#f0f2fa',
//         bg2:      isDarkMode ? '#0f0f1a' : '#e8eaf5',
//         bg3:      isDarkMode ? '#16162a' : '#dde0f0',
//         card:     isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.55)',
//         cardBorder: isDarkMode ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.75)',
//         glassBg:  isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.45)',
//         glassBorder: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.8)',

//         // Soft ice-blue primary
//         primary:       isDarkMode ? '#a8c4ff' : '#4a7eff',
//         primaryBg:     isDarkMode ? 'rgba(168,196,255,0.15)' : 'rgba(74,126,255,0.12)',
//         primaryBorder: isDarkMode ? 'rgba(168,196,255,0.35)' : 'rgba(74,126,255,0.35)',

//         // Warm amber accent
//         accent:       isDarkMode ? '#ffbf8a' : '#e07030',
//         accentBg:     isDarkMode ? 'rgba(255,160,100,0.15)' : 'rgba(224,112,48,0.1)',
//         accentBorder: isDarkMode ? 'rgba(255,160,100,0.35)' : 'rgba(224,112,48,0.3)',

//         gold:    '#d4a843',
//         goldBg:  'rgba(212,168,67,0.14)',

//         text:    isDarkMode ? '#eeeef8' : '#0a0a18',
//         muted:   isDarkMode ? '#8888aa' : '#6666aa',
//         muted2:  isDarkMode ? '#4a4a70' : '#9090c0',
//         red:     '#e05555',
//         green:   '#4ecf80',

//         orb1: isDarkMode ? 'rgba(100,140,255,0.18)' : 'rgba(100,140,255,0.25)',
//         orb2: isDarkMode ? 'rgba(255,160,80,0.12)'  : 'rgba(255,160,80,0.18)',
//     }), [isDarkMode, currentTheme]);

//     // ─── SizeButton ───────────────────────────────────────────────────────────
//     const SizeButton = React.memo(({ size, active, onPress }) => (
//         <TouchableOpacity
//             style={[S.sizeBtn, active && S.sizeBtnActive]}
//             onPress={onPress}
//             activeOpacity={0.7}
//         >
//             <Text style={[S.sizeBtnText, active && S.sizeBtnTextActive]}>{size}</Text>
//         </TouchableOpacity>
//     ));

//     // ─── SpecRow ──────────────────────────────────────────────────────────────
//     const SpecRow = React.memo(({ spec, isLast }) => (
//         <View style={[S.specRow, !isLast && S.specRowBorder]}>
//             <Text style={S.specKey}>{spec.key}</Text>
//             <Text style={S.specVal}>{spec.value}</Text>
//         </View>
//     ));

//     const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
//     const [wishlisted, setWishlisted] = useState(false);
//     const [addedToCart, setAddedToCart] = useState(
//         () => cart.some(i => i.id === product.id)
//     );

//     const heartScale = useRef(new Animated.Value(1)).current;
//     const addBtnScale = useRef(new Animated.Value(1)).current;

//     const badge = BADGE_CONFIG[product.badge];
//     const discount = product.originalPrice
//         ? Math.round((1 - product.price / product.originalPrice) * 100)
//         : null;

//     const catLabel = useMemo(() => ({
//         cap: 'CAP',
//         apparel: 'APPAREL',
//         bracelet: 'BRACELET',
//         signature: 'AUTOGRAPH',
//     })[product.cat] || product.cat.toUpperCase(), [product.cat]);

//     const handleAddToCart = useCallback(() => {
//         Animated.sequence([
//             Animated.timing(addBtnScale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
//             Animated.spring(addBtnScale, { toValue: 1, useNativeDriver: true, damping: 10 }),
//         ]).start();

//         if (setCart) {
//             setCart(prev => {
//                 const existing = prev.find(i => i.id === product.id && i.selectedSize === selectedSize);
//                 if (existing) {
//                     return prev.map(i =>
//                         i.id === product.id && i.selectedSize === selectedSize
//                             ? { ...i, qty: i.qty + 1 }
//                             : i
//                     );
//                 }
//                 return [...prev, { ...product, qty: 1, selectedSize }];
//             });
//         }
//         setAddedToCart(true);
//     }, [product, selectedSize, setCart]);

//     const handleWishlist = useCallback(() => {
//         Animated.sequence([
//             Animated.timing(heartScale, { toValue: 1.4, duration: 120, useNativeDriver: true }),
//             Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, damping: 8 }),
//         ]).start();
//         setWishlisted(w => !w);
//     }, []);

//     const handleGoToCart = useCallback(() => {
//         navigation.navigate('CartScreen', { cart, setCart });
//     }, [navigation, cart, setCart]);

//     const S = useMemo(() => StyleSheet.create({
//         container: { flex: 1, backgroundColor: COLORS.bg },

//         // Ambient orbs
//         orb: { position: 'absolute', borderRadius: 999 },

//         // ── Header (glass) ──
//         header: {
//             flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//             paddingHorizontal: 20, paddingVertical: 12,
//             backgroundColor: COLORS.glassBg,
//             borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder,
//         },
//         backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//         backArrow: { fontSize: 20, color: COLORS.muted },
//         backText: { fontSize: 13, fontWeight: '700', color: COLORS.muted, letterSpacing: 0.5 },
//         headerCartBtn: {
//             backgroundColor: COLORS.glassBg,
//             borderWidth: 1, borderColor: COLORS.glassBorder,
//             borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7,
//         },
//         headerCartText: { fontSize: 13, fontWeight: '600', color: COLORS.text },

//         // ── Hero ──
//         heroPad: { paddingHorizontal: 20, marginBottom: 20 },
//         heroBox: {
//             height: 240,
//             backgroundColor: COLORS.glassBg,
//             borderRadius: 20,
//             borderWidth: 1,
//             alignItems: 'center', justifyContent: 'center',
//             overflow: 'hidden', position: 'relative',
//         },
//         heroGlow: { position: 'absolute', width: 200, height: 200, borderRadius: 100, opacity: 0.45 },
//         heroEmoji: { fontSize: 90, zIndex: 1 },
//         heroBadge: {
//             position: 'absolute', top: 12, right: 12,
//             paddingHorizontal: 10, paddingVertical: 4,
//             borderRadius: 8, borderWidth: 1,
//         },
//         heroBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },

//         // ── Content ──
//         content: { paddingHorizontal: 20 },
//         catTag: {
//             backgroundColor: COLORS.primaryBg,
//             borderWidth: 1, borderColor: COLORS.primaryBorder,
//             borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3,
//             alignSelf: 'flex-start', marginBottom: 10,
//         },
//         catTagText: { fontSize: 10, fontWeight: '700', color: COLORS.primary, letterSpacing: 1.5 },
//         productName: { fontSize: 32, fontWeight: '900', color: COLORS.text, lineHeight: 34, letterSpacing: 0.5, marginBottom: 4 },
//         productSku: { fontSize: 10, color: COLORS.muted2, letterSpacing: 1, marginBottom: 16 },

//         // ── Price ──
//         priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 16 },
//         price: { fontSize: 34, fontWeight: '900', color: COLORS.text, letterSpacing: 0.5 },
//         originalPrice: { fontSize: 16, color: COLORS.muted2, textDecorationLine: 'line-through' },
//         discTag: {
//             backgroundColor: COLORS.accentBg,
//             borderWidth: 1, borderColor: COLORS.accentBorder,
//             paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
//         },
//         discTagText: { fontSize: 11, fontWeight: '700', color: COLORS.accent },

//         // ── Description ──
//         desc: { fontSize: 14, color: COLORS.muted, lineHeight: 22, marginBottom: 20 },

//         // ── Sizes ──
//         sizesWrap: { marginBottom: 20 },
//         sizesLabel: { fontSize: 10, letterSpacing: 1.5, color: COLORS.muted, fontWeight: '700', marginBottom: 10 },
//         sizesRow: { gap: 8, flexDirection: 'row' },
//         sizeBtn: {
//             minWidth: 52, height: 48, paddingHorizontal: 10,
//             borderRadius: 10, borderWidth: 1,
//             borderColor: COLORS.glassBorder,
//             backgroundColor: COLORS.glassBg,
//             alignItems: 'center', justifyContent: 'center',
//         },
//         sizeBtnActive: {
//             backgroundColor: COLORS.primaryBg,
//             borderColor: COLORS.primaryBorder,
//             shadowColor: COLORS.primary,
//             shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
//         },
//         sizeBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.muted },
//         sizeBtnTextActive: { color: COLORS.primary },

//         // ── Specs (glass card) ──
//         specsBox: {
//             backgroundColor: COLORS.glassBg,
//             borderWidth: 1, borderColor: COLORS.glassBorder,
//             borderRadius: 14, padding: 14, marginBottom: 20,
//         },
//         specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
//         specRowBorder: { borderBottomWidth: 0.5, borderBottomColor: COLORS.glassBorder },
//         specKey: { fontSize: 12, color: COLORS.muted, fontWeight: '500' },
//         specVal: { fontSize: 12, color: COLORS.text, fontWeight: '700' },

//         // ── Tags ──
//         tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
//         tag: {
//             backgroundColor: COLORS.glassBg,
//             borderWidth: 1, borderColor: COLORS.glassBorder,
//             borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
//         },
//         tagText: { fontSize: 11, color: COLORS.muted, fontWeight: '500' },

//         // ── Bottom bar (glass) ──
//         bottomBar: {
//             position: 'absolute', bottom: 0, left: 0, right: 0,
//             backgroundColor: COLORS.glassBg,
//             borderTopWidth: 1, borderTopColor: COLORS.glassBorder,
//             flexDirection: 'row', alignItems: 'center', gap: 12,
//             paddingHorizontal: 20, paddingTop: 14,
//         },
//         addBtnWrap: { flex: 1 },
//         addToCartBtn: {
//             backgroundColor: COLORS.primaryBg,
//             borderWidth: 1.5, borderColor: COLORS.primaryBorder,
//             borderRadius: 14, paddingVertical: 16,
//             alignItems: 'center', justifyContent: 'center',
//         },
//         addToCartBtnAdded: {
//             backgroundColor: 'rgba(78,207,128,0.15)',
//             borderColor: 'rgba(78,207,128,0.4)',
//         },
//         addToCartText: { fontSize: 15, fontWeight: '800', color: COLORS.primary, letterSpacing: 1.5 },
//         addToCartTextAdded: { color: COLORS.green },
//         wishBtn: {
//             width: 52, height: 52,
//             backgroundColor: COLORS.glassBg,
//             borderWidth: 1, borderColor: COLORS.glassBorder,
//             borderRadius: 13, alignItems: 'center', justifyContent: 'center',
//         },
//         wishBtnActive: { backgroundColor: 'rgba(224,85,85,0.12)', borderColor: 'rgba(224,85,85,0.4)' },
//         wishIcon: { fontSize: 22, color: COLORS.muted },
//         wishIconActive: { color: COLORS.red },
//     }), [COLORS]);

//     return (
//         <View style={[S.container, { paddingTop: insets.top }]}>
//             {/* Background ambient orbs */}
//             <View style={[S.orb, { width: 280, height: 280, top: -80, right: -80, backgroundColor: COLORS.orb1 }]} />
//             <View style={[S.orb, { width: 200, height: 200, top: 350, left: -70, backgroundColor: COLORS.orb2 }]} />
//             <View style={[S.orb, { width: 160, height: 160, bottom: 150, right: -40, backgroundColor: COLORS.orb1 }]} />

//             <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

//             {/* Header */}
//             <View style={S.header}>
//                 <TouchableOpacity style={S.backBtn} onPress={() => navigation.goBack()}>
//                     <Text style={S.backArrow}>←</Text>
//                     <Text style={S.backText}>Back</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={S.headerCartBtn} onPress={handleGoToCart}>
//                     <Text style={S.headerCartText}>🛒 Cart</Text>
//                 </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

//                 {/* Hero Image Area */}
//                 <View style={S.heroPad}>
//                     <View style={[S.heroBox, { borderColor: product.glowColor + '35' }]}>
//                         <View style={[S.heroGlow, { backgroundColor: product.glowColor }]} />
//                         <Text style={S.heroEmoji}>{product.emoji}</Text>
//                         {badge && (
//                             <View style={[S.heroBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
//                                 <Text style={[S.heroBadgeText, { color: badge.color }]}>{badge.label}</Text>
//                             </View>
//                         )}
//                     </View>
//                 </View>

//                 <View style={S.content}>
//                     {/* Category tag */}
//                     <View style={S.catTag}>
//                         <Text style={S.catTagText}>{catLabel}</Text>
//                     </View>

//                     {/* Name + SKU */}
//                     <Text style={S.productName}>{product.name}</Text>
//                     <Text style={S.productSku}>
//                         SKU: VG-{product.id.toUpperCase()} · {product.sub.toUpperCase()}
//                     </Text>

//                     {/* Price row */}
//                     <View style={S.priceRow}>
//                         <Text style={S.price}>₹{product.price.toLocaleString()}</Text>
//                         {product.originalPrice && (
//                             <>
//                                 <Text style={S.originalPrice}>₹{product.originalPrice.toLocaleString()}</Text>
//                                 <View style={S.discTag}>
//                                     <Text style={S.discTagText}>-{discount}% OFF</Text>
//                                 </View>
//                             </>
//                         )}
//                     </View>

//                     {/* Description */}
//                     <Text style={S.desc}>{product.desc}</Text>

//                     {/* Sizes */}
//                     <View style={S.sizesWrap}>
//                         <Text style={S.sizesLabel}>SIZE</Text>
//                         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.sizesRow}>
//                             {product.sizes.map(size => (
//                                 <SizeButton
//                                     key={size}
//                                     size={size}
//                                     active={selectedSize === size}
//                                     onPress={() => setSelectedSize(size)}
//                                 />
//                             ))}
//                         </ScrollView>
//                     </View>

//                     {/* Specs */}
//                     <View style={S.specsBox}>
//                         {product.specs.map((spec, i) => (
//                             <SpecRow key={spec.key} spec={spec} isLast={i === product.specs.length - 1} />
//                         ))}
//                     </View>

//                     {/* Tags row */}
//                     <View style={S.tagsRow}>
//                         {['Free Shipping', 'Easy Returns', 'Authentic'].map(tag => (
//                             <View key={tag} style={S.tag}>
//                                 <Text style={S.tagText}>✦ {tag}</Text>
//                             </View>
//                         ))}
//                     </View>
//                 </View>
//             </ScrollView>

//             {/* Bottom CTA */}
//             <View style={[S.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
//                 <Animated.View style={[S.addBtnWrap, { transform: [{ scale: addBtnScale }] }]}>
//                     <TouchableOpacity
//                         style={[S.addToCartBtn, addedToCart && S.addToCartBtnAdded]}
//                         onPress={addedToCart ? handleGoToCart : handleAddToCart}
//                         activeOpacity={0.85}
//                     >
//                         <Text style={[S.addToCartText, addedToCart && S.addToCartTextAdded]}>
//                             {addedToCart ? '✓  VIEW CART' : 'ADD TO CART'}
//                         </Text>
//                     </TouchableOpacity>
//                 </Animated.View>

//                 <Animated.View style={{ transform: [{ scale: heartScale }] }}>
//                     <TouchableOpacity style={[S.wishBtn, wishlisted && S.wishBtnActive]} onPress={handleWishlist}>
//                         <Text style={[S.wishIcon, wishlisted && S.wishIconActive]}>
//                             {wishlisted ? '♥' : '♡'}
//                         </Text>
//                     </TouchableOpacity>
//                 </Animated.View>
//             </View>
//         </View>
//     );
// };

// export default EcomProductDetailScreen;



import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, StyleSheet,
    StatusBar, Dimensions, Animated, Image, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { THEMES } from '../../redux/reducer/theme';
import { apiGet, apiPost } from '../../utils/Apis';

export const BADGE_CONFIG = {
    new:  { label: 'NEW', bg: 'rgba(180,200,255,0.25)', color: '#c8d8ff', border: 'rgba(180,200,255,0.4)' },
    hot:  { label: 'HOT', bg: 'rgba(255,160,100,0.22)', color: '#ffbf8a', border: 'rgba(255,160,100,0.4)' },
    ltd:  { label: 'LTD', bg: 'rgba(255,220,130,0.22)', color: '#ffe5a0', border: 'rgba(255,220,130,0.4)' },
};

const { width } = Dimensions.get('window');

const EcomProductDetailScreen = ({ route, navigation }) => {
    const { product: routeProduct, cart, setCart } = route.params;
    const insets = useSafeAreaInsets();
    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    const currentTheme = THEMES[selectedColorTheme] || THEMES.default;

    // ── State ───────────────────────────────────────────────────────────────
    const [product,      setProduct]      = useState(routeProduct ?? null);
    const [loading,      setLoading]      = useState(!routeProduct);
    const [selectedSize, setSelectedSize] = useState(null);
    const [activeImg,    setActiveImg]    = useState(0);
    const [wishlisted,   setWishlisted]   = useState(false);
    const [addedToCart,  setAddedToCart]  = useState(false);
    const [cartLoading,  setCartLoading]  = useState(false);

    const heartScale  = useRef(new Animated.Value(1)).current;
    const addBtnScale = useRef(new Animated.Value(1)).current;

    // ── COLORS ──────────────────────────────────────────────────────────────
    const COLORS = useMemo(() => ({
        bg:          isDarkMode ? '#08080f' : '#f0f2fa',
        card:        isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.55)',
        cardBorder:  isDarkMode ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.75)',
        glassBg:     isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.45)',
        glassBorder: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.8)',
        primary:        isDarkMode ? '#a8c4ff' : '#4a7eff',
        primaryBg:      isDarkMode ? 'rgba(168,196,255,0.15)' : 'rgba(74,126,255,0.12)',
        primaryBorder:  isDarkMode ? 'rgba(168,196,255,0.35)' : 'rgba(74,126,255,0.35)',
        accent:      isDarkMode ? '#ffbf8a' : '#e07030',
        accentBg:    isDarkMode ? 'rgba(255,160,100,0.15)' : 'rgba(224,112,48,0.1)',
        accentBorder:isDarkMode ? 'rgba(255,160,100,0.35)' : 'rgba(224,112,48,0.3)',
        gold:        '#d4a843',
        goldBg:      'rgba(212,168,67,0.14)',
        text:        isDarkMode ? '#eeeef8' : '#0a0a18',
        muted:       isDarkMode ? '#8888aa' : '#6666aa',
        muted2:      isDarkMode ? '#4a4a70' : '#9090c0',
        red:         '#e05555',
        green:       '#4ecf80',
        orb1:        isDarkMode ? 'rgba(100,140,255,0.18)' : 'rgba(100,140,255,0.25)',
        orb2:        isDarkMode ? 'rgba(255,160,80,0.12)'  : 'rgba(255,160,80,0.18)',
    }), [isDarkMode, currentTheme]);

    // ── Fetch product detail ─────────────────────────────────────────────────
    useEffect(() => {
        const id = routeProduct?._id ?? routeProduct?.id;
        if (!id) return;
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await apiGet(`/api/shop/GetAdminAProduct/${id}`);
                if (res?.data) {
                    setProduct(res.data);
                    setSelectedSize(res.data.Sizes?.[0] ?? null);
                }
            } catch (err) {
                console.log('Product detail fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, []);

    // ── Derived ──────────────────────────────────────────────────────────────
    const discount = useMemo(() => {
        if (!product?.DiscountPrice || !product?.Price) return null;
        return Math.round((1 - product.DiscountPrice / product.Price) * 100);
    }, [product]);

    const displayPrice    = product?.DiscountPrice ?? product?.Price ?? 0;
    const originalPrice   = product?.DiscountPrice ? product.Price : null;
    const images          = product?.Images ?? [];
    const sizes           = product?.Sizes  ?? [];
    const tags            = product?.Tags   ?? [];

    const specs = useMemo(() => {
        if (!product) return [];
        return [
            product.Brand    && { key: 'Brand',    value: product.Brand    },
            product.SKU      && { key: 'SKU',       value: product.SKU      },
            product.Stock !== undefined && { key: 'Stock', value: String(product.Stock) },
            product.Colors?.length && { key: 'Colors', value: product.Colors.join(', ') },
        ].filter(Boolean);
    }, [product]);

    // ── Cart ─────────────────────────────────────────────────────────────────
    const handleAddToCart = useCallback(async () => {
        if (!product?._id) return;
        Animated.sequence([
            Animated.timing(addBtnScale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
            Animated.spring(addBtnScale, { toValue: 1, useNativeDriver: true, damping: 10 }),
        ]).start();
        try {
            setCartLoading(true);
            await apiPost('/api/shop/AddToCart', {
                ProductId: product._id,
                Quantity: '1',
            });
            if (setCart) {
                setCart(prev => {
                    const id = product._id;
                    const existing = prev[id];
                    return { ...prev, [id]: (existing || 0) + 1 };
                });
            }
            setAddedToCart(true);
        } catch (err) {
            console.log('Add to cart error:', err);
        } finally {
            setCartLoading(false);
        }
    }, [product, selectedSize, setCart]);

    const handleWishlist = useCallback(() => {
        Animated.sequence([
            Animated.timing(heartScale, { toValue: 1.4, duration: 120, useNativeDriver: true }),
            Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, damping: 8 }),
        ]).start();
        setWishlisted(w => !w);
    }, []);

    const handleGoToCart = useCallback(() => {
        navigation.navigate('CartScreen', { cart, setCart });
    }, [navigation, cart, setCart]);

    // ── Styles ────────────────────────────────────────────────────────────────
    const S = useMemo(() => StyleSheet.create({
        container:   { flex: 1, backgroundColor: COLORS.bg },
        orb:         { position: 'absolute', borderRadius: 999 },

        loaderWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center' },

        // ── Header ──
        header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: COLORS.glassBg, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
        backBtn:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
        backArrow:     { fontSize: 20, color: COLORS.muted },
        backText:      { fontSize: 13, fontWeight: '700', color: COLORS.muted, letterSpacing: 0.5 },
        headerCartBtn: { backgroundColor: COLORS.glassBg, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
        headerCartText:{ fontSize: 13, fontWeight: '600', color: COLORS.text },

        // ── Image Carousel ──
        imgCarousel:   { paddingHorizontal: 20, marginBottom: 12, marginTop: 16 },
        imgMain:       { width: '100%', height: 260, borderRadius: 20, backgroundColor: COLORS.glassBg, borderWidth: 1, borderColor: COLORS.glassBorder, overflow: 'hidden' },
        imgMainImg:    { width: '100%', height: '100%', resizeMode: 'cover' },
        imgPlaceholder:{ flex: 1, alignItems: 'center', justifyContent: 'center' },
        imgPlaceholderText: { fontSize: 64 },
        thumbRow:      { flexDirection: 'row', gap: 8, marginTop: 10 },
        thumb:         { width: 60, height: 60, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: COLORS.glassBorder },
        thumbActive:   { borderColor: COLORS.primary },
        thumbImg:      { width: '100%', height: '100%', resizeMode: 'cover' },

        // ── Featured badge ──
        featuredBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, backgroundColor: BADGE_CONFIG.hot.bg, borderColor: BADGE_CONFIG.hot.border },
        featuredText:  { fontSize: 10, fontWeight: '800', color: BADGE_CONFIG.hot.color, letterSpacing: 1 },

        // ── Content ──
        content:       { paddingHorizontal: 20 },
        catTag:        { backgroundColor: COLORS.primaryBg, borderWidth: 1, borderColor: COLORS.primaryBorder, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 10 },
        catTagText:    { fontSize: 10, fontWeight: '700', color: COLORS.primary, letterSpacing: 1.5 },
        productName:   { fontSize: 28, fontWeight: '900', color: COLORS.text, lineHeight: 32, letterSpacing: 0.5, marginBottom: 4 },
        productSku:    { fontSize: 10, color: COLORS.muted2, letterSpacing: 1, marginBottom: 16 },

        // ── Price ──
        priceRow:      { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
        price:         { fontSize: 32, fontWeight: '900', color: COLORS.text, letterSpacing: 0.5 },
        originalPriceTxt: { fontSize: 16, color: COLORS.muted2, textDecorationLine: 'line-through' },
        discTag:       { backgroundColor: COLORS.accentBg, borderWidth: 1, borderColor: COLORS.accentBorder, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
        discTagText:   { fontSize: 11, fontWeight: '700', color: COLORS.accent },

        // ── Stock badge ──
        stockRow:      { flexDirection: 'row', gap: 8, marginBottom: 16 },
        stockBadge:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
        stockText:     { fontSize: 11, fontWeight: '700' },

        // ── Description ──
        sectionLabel:  { fontSize: 10, letterSpacing: 1.5, color: COLORS.muted, fontWeight: '700', marginBottom: 8 },
        desc:          { fontSize: 14, color: COLORS.muted, lineHeight: 22, marginBottom: 20 },
        shortDesc:     { fontSize: 13, color: COLORS.muted, lineHeight: 20, marginBottom: 6 },

        // ── Sizes ──
        sizesWrap:     { marginBottom: 20 },
        sizesRow:      { gap: 8, flexDirection: 'row' },
        sizeBtn:       { minWidth: 52, height: 44, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.glassBorder, backgroundColor: COLORS.glassBg, alignItems: 'center', justifyContent: 'center' },
        sizeBtnActive: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primaryBorder },
        sizeBtnText:   { fontSize: 12, fontWeight: '700', color: COLORS.muted },
        sizeBtnTextActive: { color: COLORS.primary },

        // ── Colors ──
        colorsWrap:    { marginBottom: 20 },
        colorsRow:     { gap: 8, flexDirection: 'row', flexWrap: 'wrap' },
        colorChip:     { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.glassBorder, backgroundColor: COLORS.glassBg },
        colorChipText: { fontSize: 12, color: COLORS.muted, fontWeight: '600' },

        // ── Specs ──
        specsBox:      { backgroundColor: COLORS.glassBg, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: 14, padding: 14, marginBottom: 20 },
        specRow:       { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
        specRowBorder: { borderBottomWidth: 0.5, borderBottomColor: COLORS.glassBorder },
        specKey:       { fontSize: 12, color: COLORS.muted, fontWeight: '500' },
        specVal:       { fontSize: 12, color: COLORS.text, fontWeight: '700' },

        // ── Tags ──
        tagsRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
        tag:           { backgroundColor: COLORS.glassBg, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
        tagText:       { fontSize: 11, color: COLORS.muted, fontWeight: '500' },

        // ── Bottom bar ──
        bottomBar:     { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.glassBg, borderTopWidth: 1, borderTopColor: COLORS.glassBorder, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 14 },
        addBtnWrap:    { flex: 1 },
        addToCartBtn:  { backgroundColor: COLORS.primaryBg, borderWidth: 1.5, borderColor: COLORS.primaryBorder, borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
        addToCartBtnAdded: { backgroundColor: 'rgba(78,207,128,0.15)', borderColor: 'rgba(78,207,128,0.4)' },
        addToCartText: { fontSize: 15, fontWeight: '800', color: COLORS.primary, letterSpacing: 1.5 },
        addToCartTextAdded: { color: COLORS.green },
        wishBtn:       { width: 52, height: 52, backgroundColor: COLORS.glassBg, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
        wishBtnActive: { backgroundColor: 'rgba(224,85,85,0.12)', borderColor: 'rgba(224,85,85,0.4)' },
        wishIcon:      { fontSize: 22, color: COLORS.muted },
        wishIconActive:{ color: COLORS.red },
    }), [COLORS]);

    // ── Sub-components ────────────────────────────────────────────────────────
    const SizeButton = useCallback(({ size, active, onPress }) => (
        <TouchableOpacity style={[S.sizeBtn, active && S.sizeBtnActive]} onPress={onPress} activeOpacity={0.7}>
            <Text style={[S.sizeBtnText, active && S.sizeBtnTextActive]}>{size}</Text>
        </TouchableOpacity>
    ), [S]);

    const SpecRow = useCallback(({ spec, isLast }) => (
        <View style={[S.specRow, !isLast && S.specRowBorder]}>
            <Text style={S.specKey}>{spec.key}</Text>
            <Text style={S.specVal}>{spec.value}</Text>
        </View>
    ), [S]);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View style={[S.container, S.loaderWrap, { paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={[S.container, S.loaderWrap, { paddingTop: insets.top }]}>
                <Text style={{ color: COLORS.muted, fontSize: 14 }}>Product not found</Text>
            </View>
        );
    }

    const stockOk = (product.Stock ?? 0) > 0;

    return (
        <View style={[S.container, { paddingTop: insets.top }]}>
            {/* Ambient orbs */}
            <View style={[S.orb, { width: 280, height: 280, top: -80, right: -80, backgroundColor: COLORS.orb1 }]} />
            <View style={[S.orb, { width: 200, height: 200, top: 350, left: -70, backgroundColor: COLORS.orb2 }]} />

            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

            {/* Header */}
            <View style={S.header}>
                <TouchableOpacity style={S.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={S.backArrow}>←</Text>
                    <Text style={S.backText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={S.headerCartBtn} onPress={handleGoToCart}>
                    <Text style={S.headerCartText}>🛒 Cart</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

                {/* ── Image Carousel ── */}
                <View style={S.imgCarousel}>
                    <View style={S.imgMain}>
                        {images.length > 0 ? (
                            <Image
                                source={{ uri: images[activeImg] }}
                                style={S.imgMainImg}
                            />
                        ) : (
                            <View style={S.imgPlaceholder}>
                                <Text style={S.imgPlaceholderText}>🛍️</Text>
                            </View>
                        )}
                        {product.IsFeatured && (
                            <View style={S.featuredBadge}>
                                <Text style={S.featuredText}>FEATURED</Text>
                            </View>
                        )}
                    </View>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.thumbRow}>
                            {images.map((uri, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={[S.thumb, activeImg === idx && S.thumbActive]}
                                    onPress={() => setActiveImg(idx)}
                                    activeOpacity={0.8}
                                >
                                    <Image source={{ uri }} style={S.thumbImg} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <View style={S.content}>

                    {/* Category / Brand tag */}
                    <View style={S.catTag}>
                        <Text style={S.catTagText}>{product.Brand ?? 'PRODUCT'}</Text>
                    </View>

                    {/* Name + SKU */}
                    <Text style={S.productName}>{product.ProductName}</Text>
                    <Text style={S.productSku}>
                        SKU: {product.SKU ?? '—'} · {product.Slug?.toUpperCase() ?? ''}
                    </Text>

                    {/* Price row */}
                    <View style={S.priceRow}>
                        <Text style={S.price}>₹{displayPrice?.toLocaleString()}</Text>
                        {originalPrice && (
                            <>
                                <Text style={S.originalPriceTxt}>₹{originalPrice?.toLocaleString()}</Text>
                                {discount > 0 && (
                                    <View style={S.discTag}>
                                        <Text style={S.discTagText}>-{discount}% OFF</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>

                    {/* Stock badge */}
                    <View style={S.stockRow}>
                        <View style={[
                            S.stockBadge,
                            { backgroundColor: stockOk ? 'rgba(78,207,128,0.12)' : 'rgba(224,85,85,0.12)', borderColor: stockOk ? 'rgba(78,207,128,0.4)' : 'rgba(224,85,85,0.4)' },
                        ]}>
                            <Text style={[S.stockText, { color: stockOk ? COLORS.green : COLORS.red }]}>
                                {stockOk ? `✓ In Stock (${product.Stock})` : '✕ Out of Stock'}
                            </Text>
                        </View>
                    </View>

                    {/* Short Description */}
                    {product.ShortDescription && (
                        <>
                            <Text style={S.sectionLabel}>OVERVIEW</Text>
                            <Text style={S.shortDesc}>{product.ShortDescription}</Text>
                        </>
                    )}

                    {/* Full Description */}
                    {product.Description && product.Description !== product.ShortDescription && (
                        <>
                            <Text style={[S.sectionLabel, { marginTop: 8 }]}>DESCRIPTION</Text>
                            <Text style={S.desc}>{product.Description}</Text>
                        </>
                    )}

                    {/* Sizes */}
                    {sizes.length > 0 && (
                        <View style={S.sizesWrap}>
                            <Text style={S.sectionLabel}>SIZE</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.sizesRow}>
                                {sizes.map(size => (
                                    <SizeButton
                                        key={size}
                                        size={size}
                                        active={selectedSize === size}
                                        onPress={() => setSelectedSize(size)}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Colors */}
                    {product.Colors?.length > 0 && (
                        <View style={S.colorsWrap}>
                            <Text style={S.sectionLabel}>COLORS</Text>
                            <View style={S.colorsRow}>
                                {product.Colors.map((color, idx) => (
                                    <View key={idx} style={S.colorChip}>
                                        <Text style={S.colorChipText}>{color}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Specs */}
                    {specs.length > 0 && (
                        <View style={S.specsBox}>
                            {specs.map((spec, i) => (
                                <SpecRow key={spec.key} spec={spec} isLast={i === specs.length - 1} />
                            ))}
                        </View>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                        <View style={S.tagsRow}>
                            {tags.map((tag, idx) => (
                                <View key={idx} style={S.tag}>
                                    <Text style={S.tagText}>✦ {tag}</Text>
                                </View>
                            ))}
                            {['Free Shipping', 'Easy Returns'].map(tag => (
                                <View key={tag} style={S.tag}>
                                    <Text style={S.tagText}>✦ {tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View style={[S.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
                <Animated.View style={[S.addBtnWrap, { transform: [{ scale: addBtnScale }] }]}>
                    <TouchableOpacity
                        style={[S.addToCartBtn, addedToCart && S.addToCartBtnAdded]}
                        onPress={addedToCart ? handleGoToCart : handleAddToCart}
                        disabled={!stockOk || cartLoading}
                        activeOpacity={0.85}
                    >
                        {cartLoading ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <Text style={[S.addToCartText, addedToCart && S.addToCartTextAdded]}>
                                {!stockOk ? 'OUT OF STOCK' : addedToCart ? '✓  VIEW CART' : 'ADD TO CART'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                    <TouchableOpacity style={[S.wishBtn, wishlisted && S.wishBtnActive]} onPress={handleWishlist}>
                        <Text style={[S.wishIcon, wishlisted && S.wishIconActive]}>
                            {wishlisted ? '♥' : '♡'}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
};

export default EcomProductDetailScreen;