// import React, { useCallback, useMemo } from 'react';
// import {
//   View, Text, FlatList, TouchableOpacity, StyleSheet,
//   StatusBar, Animated,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useSelector } from 'react-redux';
// import { THEMES } from '../../redux/reducer/theme';

// // ─── CartItem ─────────────────────────────────────────────────────────────────
// const CartItem = React.memo(({ item, onIncrease, onDecrease, onRemove, COLORS, S }) => {
//   const slideAnim = React.useRef(new Animated.Value(0)).current;

//   React.useEffect(() => {
//     Animated.timing(slideAnim, {
//       toValue: 1,
//       duration: 280,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   return (
//     <Animated.View
//       style={[
//         S.cartItem,
//         {
//           opacity: slideAnim,
//           transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
//         },
//       ]}
//     >
//       {/* Emoji thumb */}
//       <View style={S.itemThumb}>
//         <Text style={S.itemEmoji}>{item.emoji}</Text>
//       </View>

//       {/* Info */}
//       <View style={S.itemInfo}>
//         <Text style={S.itemName} numberOfLines={1}>{item.name}</Text>
//         <Text style={S.itemVar}>
//           Size: {item.selectedSize}  ·  {item.sub}
//         </Text>
//         <View style={S.itemBottom}>
//           <Text style={S.itemPrice}>
//             ₹{(item.price * item.qty).toLocaleString()}
//           </Text>
//           {/* Qty controls */}
//           <View style={S.qtyRow}>
//             <TouchableOpacity style={S.qtyBtn} onPress={onDecrease} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//               <Text style={S.qtyBtnText}>−</Text>
//             </TouchableOpacity>
//             <Text style={S.qtyNum}>{item.qty}</Text>
//             <TouchableOpacity style={S.qtyBtn} onPress={onIncrease} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//               <Text style={S.qtyBtnText}>+</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* Remove */}
//       <TouchableOpacity style={S.removeBtn} onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//         <Text style={S.removeBtnText}>✕</Text>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// });
// CartItem.displayName = 'CartItem';

// // ─── EmptyCart ────────────────────────────────────────────────────────────────
// const EmptyCart = React.memo(({ onShop, COLORS, S }) => (
//   <View style={S.emptyWrap}>
//     <Text style={S.emptyIcon}>🏁</Text>
//     <Text style={S.emptyTitle}>Your cart is empty</Text>
//     <Text style={S.emptySub}>Start your race day collection!</Text>
//     <TouchableOpacity style={S.emptyCta} onPress={onShop}>
//       <Text style={S.emptyCtaText}>SHOP NOW  ▶</Text>
//     </TouchableOpacity>
//   </View>
// ));

// // ─── CartScreen ───────────────────────────────────────────────────────────────
// const CartScreen = ({ route, navigation }) => {
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

//   const { cart = [], setCart } = route.params || {};

//   const cartItems = useMemo(() => cart, [cart]);

//   const totalItems = useMemo(() => cartItems.reduce((a, i) => a + i.qty, 0), [cartItems]);
//   const subtotal = useMemo(() => cartItems.reduce((a, i) => a + i.price * i.qty, 0), [cartItems]);
//   const shipping = cartItems.length > 0 ? 99 : 0;
//   const discount = subtotal > 2999 ? Math.round(subtotal * 0.05) : 0;
//   const total = subtotal + shipping - discount;

//   const handleIncrease = useCallback((id, size) => {
//     setCart(prev =>
//       prev.map(i => i.id === id && i.selectedSize === size ? { ...i, qty: i.qty + 1 } : i)
//     );
//   }, [setCart]);

//   const handleDecrease = useCallback((id, size) => {
//     setCart(prev => {
//       const item = prev.find(i => i.id === id && i.selectedSize === size);
//       if (item.qty <= 1) return prev.filter(i => !(i.id === id && i.selectedSize === size));
//       return prev.map(i => i.id === id && i.selectedSize === size ? { ...i, qty: i.qty - 1 } : i);
//     });
//   }, [setCart]);

//   const handleRemove = useCallback((id, size) => {
//     setCart(prev => prev.filter(i => !(i.id === id && i.selectedSize === size)));
//   }, [setCart]);

//   const keyExtractor = useCallback((item) => `${item.id}-${item.selectedSize}`, []);

//   const renderItem = useCallback(({ item }) => (
//     <CartItem
//       item={item}
//       onIncrease={() => handleIncrease(item.id, item.selectedSize)}
//       onDecrease={() => handleDecrease(item.id, item.selectedSize)}
//       onRemove={() => handleRemove(item.id, item.selectedSize)}
//       COLORS={COLORS}
//       S={S}
//     />
//   ), [handleIncrease, handleDecrease, handleRemove, COLORS, S]);

//   const S = useMemo(() => StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.bg },

//     // Header
//     header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
//     backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//     backArrow: { fontSize: 20, color: COLORS.muted },
//     backText: { fontSize: 13, fontWeight: '700', color: COLORS.muted, letterSpacing: 0.5 },
//     headerTitle: { fontSize: 20, fontWeight: '900', color: COLORS.text, letterSpacing: 1 },
//     headerRight: { width: 40 },

//     // Content
//     scrollContent: { paddingHorizontal: 20, paddingBottom: 200 },

//     // Section
//     sectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.muted, letterSpacing: 1.5, marginTop: 20, marginBottom: 12 },

//     // Cart Item
//     cartItem: { flexDirection: 'row', backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 14, alignItems: 'center', marginBottom: 12 },
//     itemThumb: { width: 64, height: 64, backgroundColor: COLORS.bg3, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
//     itemEmoji: { fontSize: 32 },
//     itemInfo: { flex: 1 },
//     itemName: { fontSize: 14, fontWeight: '700', color: COLORS.text, letterSpacing: 0.3, marginBottom: 2 },
//     itemVar: { fontSize: 11, color: COLORS.muted, marginBottom: 8 },
//     itemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//     itemPrice: { fontSize: 18, fontWeight: '900', color: COLORS.primary, letterSpacing: 0.5 },
//     qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//     qtyBtn: { width: 28, height: 28, borderRadius: 6, backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border2, alignItems: 'center', justifyContent: 'center' },
//     qtyBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.text },
//     qtyText: { fontSize: 13, fontWeight: '700', color: COLORS.text, minWidth: 20, textAlign: 'center' },
//     removeBtn: { width: 28, height: 28, borderRadius: 6, backgroundColor: 'rgba(255,50,50,0.1)', borderWidth: 1, borderColor: COLORS.red, alignItems: 'center', justifyContent: 'center' },
//     removeBtnText: { fontSize: 16, color: COLORS.red, fontWeight: '700' },

//     // Summary
//     summaryBox: { backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 16, marginTop: 20, marginBottom: 20 },
//     summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
//     summaryBorder: { borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
//     summaryLabel: { fontSize: 13, color: COLORS.muted, fontWeight: '500' },
//     summaryValue: { fontSize: 13, color: COLORS.text, fontWeight: '700' },
//     discountValue: { fontSize: 13, color: COLORS.green, fontWeight: '700' },
//     totalLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text },
//     totalValue: { fontSize: 28, fontWeight: '900', color: COLORS.primary, letterSpacing: 1 },

//     // Bottom
//     bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.bg2, borderTopWidth: 0.5, borderTopColor: COLORS.border, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
//     checkoutBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
//     checkoutText: { fontSize: 16, fontWeight: '800', color: '#000', letterSpacing: 1.5 },
//     continueShoppingBtn: { backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border2, borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
//     continueShoppingText: { fontSize: 14, fontWeight: '700', color: COLORS.text, letterSpacing: 0.5 },

//     // Empty
//     emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
//     emptyEmoji: { fontSize: 80, marginBottom: 20 },
//     emptyTitle: { fontSize: 20, fontWeight: '900', color: COLORS.text, textAlign: 'center', marginBottom: 8, letterSpacing: 0.5 },
//     emptySubtitle: { fontSize: 13, color: COLORS.muted, textAlign: 'center', lineHeight: 20, marginBottom: 30 },
//     emptyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
//     emptyBtnText: { fontSize: 13, fontWeight: '800', color: '#000', letterSpacing: 1 },
//   }), [COLORS]);

//   return (
//     <View style={[S.container, { paddingTop: insets.top }]}>
//       <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

//       {/* Header */}
//       <View style={S.header}>
//         <TouchableOpacity style={S.backBtn} onPress={() => navigation.goBack()}>
//           <Text style={S.backArrow}>←</Text>
//         </TouchableOpacity>
//         <View>
//           <Text style={S.headerTitle}>YOUR CART</Text>
//           <Text style={S.headerSub}>
//             {totalItems} ITEM{totalItems !== 1 ? 'S' : ''}
//           </Text>
//         </View>
//         <View style={{ width: 40 }} />
//       </View>

//       {/* Content */}
//       {cartItems.length === 0 ? (
//         <EmptyCart onShop={() => navigation.goBack()} COLORS={COLORS} S={S} />
//       ) : (
//         <>
//           <FlatList
//             data={cartItems}
//             keyExtractor={keyExtractor}
//             renderItem={renderItem}
//             contentContainerStyle={S.listContent}
//             showsVerticalScrollIndicator={false}
//             ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
//           />

//           {/* Summary */}
//           <View style={[S.summary, { paddingBottom: insets.bottom + 16 }]}>
//             {/* Promo note */}
//             {subtotal > 0 && subtotal <= 2999 && (
//               <View style={S.promoNote}>
//                 <Text style={S.promoNoteText}>
//                   🏎️  Add ₹{(3000 - subtotal).toLocaleString()} more for 5% off!
//                 </Text>
//               </View>
//             )}
//             {discount > 0 && (
//               <View style={[S.promoNote, { backgroundColor: 'rgba(232,255,0,0.06)', borderColor: 'rgba(232,255,0,0.2)' }]}>
//                 <Text style={[S.promoNoteText, { color: COLORS.primary }]}>
//                   ✦  5% discount applied!
//                 </Text>
//               </View>
//             )}

//             <View style={S.summaryRows}>
//               <View style={S.sumRow}>
//                 <Text style={S.sumKey}>Subtotal</Text>
//                 <Text style={S.sumVal}>₹{subtotal.toLocaleString()}</Text>
//               </View>
//               <View style={S.sumRow}>
//                 <Text style={S.sumKey}>Shipping</Text>
//                 <Text style={S.sumVal}>₹{shipping}</Text>
//               </View>
//               {discount > 0 && (
//                 <View style={S.sumRow}>
//                   <Text style={S.sumKey}>Discount</Text>
//                   <Text style={[S.sumVal, { color: COLORS.accent }]}>-₹{discount.toLocaleString()}</Text>
//                 </View>
//               )}
//               <View style={[S.sumRow, S.totalRow]}>
//                 <Text style={S.totalKey}>TOTAL</Text>
//                 <Text style={S.totalVal}>₹{total.toLocaleString()}</Text>
//               </View>
//             </View>

//             <TouchableOpacity style={S.checkoutBtn} activeOpacity={0.85}>
//               <Text style={S.checkoutText}>CHECKOUT  ▶</Text>
//             </TouchableOpacity>

//             <View style={S.secureRow}>
//               <Text style={S.secureText}>🔒  Secure payment  ·  Free returns</Text>
//             </View>
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// // ─── Styles ───────────────────────────────────────────────────────────────────
// // Moved inside component

// export default CartScreen;


// import React, { useCallback, useMemo } from 'react';
// import {
//   View, Text, FlatList, TouchableOpacity, StyleSheet,
//   StatusBar, Animated, ScrollView, Dimensions,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useSelector } from 'react-redux';
// import { THEMES } from '../../redux/reducer/theme';

// const { width } = Dimensions.get('window');

// // ─── CartItem ─────────────────────────────────────────────────────────────────
// const CartItem = React.memo(({ item, onIncrease, onDecrease, onRemove, S }) => {
//   const slideAnim = React.useRef(new Animated.Value(0)).current;

//   React.useEffect(() => {
//     Animated.timing(slideAnim, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   return (
//     <Animated.View
//       style={[
//         S.cartItem,
//         {
//           opacity: slideAnim,
//           transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
//         },
//       ]}
//     >
//       {/* Emoji thumb */}
//       <View style={[S.itemThumb, { backgroundColor: item.glowColor + '18' }]}>
//         <Text style={S.itemEmoji}>{item.emoji}</Text>
//       </View>

//       {/* Info */}
//       <View style={S.itemInfo}>
//         <View style={S.itemTopRow}>
//           <Text style={S.itemName} numberOfLines={1}>{item.name}</Text>
//           <TouchableOpacity style={S.removeBtn} onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//             <Text style={S.removeBtnText}>✕</Text>
//           </TouchableOpacity>
//         </View>

//         <Text style={S.itemVar}>Size: {item.selectedSize}  ·  {item.sub}</Text>

//         <View style={S.itemBottom}>
//           <Text style={S.itemPrice}>₹{(item.price * item.qty).toLocaleString()}</Text>
//           <View style={S.qtyRow}>
//             <TouchableOpacity style={S.qtyBtn} onPress={onDecrease} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//               <Text style={S.qtyBtnText}>−</Text>
//             </TouchableOpacity>
//             <Text style={S.qtyNum}>{item.qty}</Text>
//             <TouchableOpacity style={S.qtyBtn} onPress={onIncrease} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//               <Text style={S.qtyBtnText}>+</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Animated.View>
//   );
// });
// CartItem.displayName = 'CartItem';

// // ─── EmptyCart ────────────────────────────────────────────────────────────────
// const EmptyCart = React.memo(({ onShop, S }) => (
//   <View style={S.emptyWrap}>
//     <Text style={S.emptyIcon}>🏁</Text>
//     <Text style={S.emptyTitle}>Your cart is empty</Text>
//     <Text style={S.emptySub}>Start your race day collection!</Text>
//     <TouchableOpacity style={S.emptyCta} onPress={onShop} activeOpacity={0.85}>
//       <Text style={S.emptyCtaText}>SHOP NOW  ▶</Text>
//     </TouchableOpacity>
//   </View>
// ));

// // ─── CartScreen ───────────────────────────────────────────────────────────────
// const CartScreen = ({ route, navigation }) => {
//   const insets = useSafeAreaInsets();
//   const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
//   const currentTheme = THEMES[selectedColorTheme] || THEMES.default;

//   const COLORS = useMemo(() => ({
//     bg:          isDarkMode ? '#08080f' : '#f0f2fa',
//     glassBg:     isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.45)',
//     glassBorder: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.8)',
//     cardBg:      isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.55)',
//     cardBorder:  isDarkMode ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.75)',

//     primary:       isDarkMode ? '#a8c4ff' : '#4a7eff',
//     primaryBg:     isDarkMode ? 'rgba(168,196,255,0.15)' : 'rgba(74,126,255,0.12)',
//     primaryBorder: isDarkMode ? 'rgba(168,196,255,0.35)' : 'rgba(74,126,255,0.35)',

//     accent:       isDarkMode ? '#ffbf8a' : '#e07030',
//     accentBg:     isDarkMode ? 'rgba(255,160,100,0.15)' : 'rgba(224,112,48,0.10)',
//     accentBorder: isDarkMode ? 'rgba(255,160,100,0.35)' : 'rgba(224,112,48,0.30)',

//     green:       '#4ecf80',
//     greenBg:     'rgba(78,207,128,0.14)',
//     greenBorder: 'rgba(78,207,128,0.35)',

//     red:       '#e05555',
//     redBg:     'rgba(224,85,85,0.12)',
//     redBorder: 'rgba(224,85,85,0.35)',

//     text:   isDarkMode ? '#eeeef8' : '#0a0a18',
//     muted:  isDarkMode ? '#8888aa' : '#6666aa',
//     muted2: isDarkMode ? '#4a4a70' : '#9090c0',

//     orb1: isDarkMode ? 'rgba(100,140,255,0.18)' : 'rgba(100,140,255,0.25)',
//     orb2: isDarkMode ? 'rgba(255,160,80,0.12)'  : 'rgba(255,160,80,0.18)',
//   }), [isDarkMode, currentTheme]);

//   const { cart = [], setCart } = route.params || {};

//   const totalItems = useMemo(() => cart.reduce((a, i) => a + i.qty, 0), [cart]);
//   const subtotal   = useMemo(() => cart.reduce((a, i) => a + i.price * i.qty, 0), [cart]);
//   const shipping   = cart.length > 0 ? 99 : 0;
//   const discount   = subtotal > 2999 ? Math.round(subtotal * 0.05) : 0;
//   const total      = subtotal + shipping - discount;

//   const handleIncrease = useCallback((id, size) => {
//     setCart(prev =>
//       prev.map(i => i.id === id && i.selectedSize === size ? { ...i, qty: i.qty + 1 } : i)
//     );
//   }, [setCart]);

//   const handleDecrease = useCallback((id, size) => {
//     setCart(prev => {
//       const item = prev.find(i => i.id === id && i.selectedSize === size);
//       if (item?.qty <= 1) return prev.filter(i => !(i.id === id && i.selectedSize === size));
//       return prev.map(i => i.id === id && i.selectedSize === size ? { ...i, qty: i.qty - 1 } : i);
//     });
//   }, [setCart]);

//   const handleRemove = useCallback((id, size) => {
//     setCart(prev => prev.filter(i => !(i.id === id && i.selectedSize === size)));
//   }, [setCart]);

//   const keyExtractor = useCallback((item) => `${item.id}-${item.selectedSize}`, []);

//   const S = useMemo(() => StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.bg },

//     // Ambient orbs
//     orb: { position: 'absolute', borderRadius: 999 },

//     // ── Header ──
//     header: {
//       flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//       paddingHorizontal: 20, paddingVertical: 14,
//       backgroundColor: COLORS.glassBg,
//       borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder,
//     },
//     backBtn: {
//       width: 38, height: 38, borderRadius: 10,
//       backgroundColor: COLORS.glassBg,
//       borderWidth: 1, borderColor: COLORS.glassBorder,
//       alignItems: 'center', justifyContent: 'center',
//     },
//     backArrow: { fontSize: 18, color: COLORS.text },
//     headerCenter: { alignItems: 'center' },
//     headerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.text, letterSpacing: 2 },
//     headerSub: { fontSize: 10, color: COLORS.muted, letterSpacing: 2, marginTop: 1 },
//     headerRight: { width: 38 },

//     // ── Items list ──
//     listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },

//     // ── Cart Item card (glass) ──
//     cartItem: {
//       flexDirection: 'row',
//       backgroundColor: COLORS.cardBg,
//       borderWidth: 1, borderColor: COLORS.cardBorder,
//       borderRadius: 16, padding: 14,
//       alignItems: 'center', gap: 12,
//       marginBottom: 10,
//     },
//     itemThumb: {
//       width: 60, height: 60, borderRadius: 12,
//       borderWidth: 1, borderColor: COLORS.glassBorder,
//       alignItems: 'center', justifyContent: 'center',
//       flexShrink: 0,
//     },
//     itemEmoji: { fontSize: 28 },
//     itemInfo: { flex: 1, minWidth: 0 },
//     itemTopRow: {
//       flexDirection: 'row', alignItems: 'center',
//       justifyContent: 'space-between', marginBottom: 3,
//     },
//     itemName: {
//       fontSize: 13, fontWeight: '700', color: COLORS.text,
//       letterSpacing: 0.2, flex: 1, marginRight: 8,
//     },
//     itemVar: { fontSize: 11, color: COLORS.muted, marginBottom: 10 },
//     itemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//     itemPrice: { fontSize: 16, fontWeight: '900', color: COLORS.text, letterSpacing: 0.2 },

//     qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//     qtyBtn: {
//       width: 28, height: 28, borderRadius: 7,
//       backgroundColor: COLORS.glassBg,
//       borderWidth: 1, borderColor: COLORS.glassBorder,
//       alignItems: 'center', justifyContent: 'center',
//     },
//     qtyBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.text, lineHeight: 18 },
//     qtyNum: { fontSize: 14, fontWeight: '800', color: COLORS.text, minWidth: 20, textAlign: 'center' },

//     removeBtn: {
//       width: 24, height: 24, borderRadius: 6,
//       backgroundColor: COLORS.redBg,
//       borderWidth: 1, borderColor: COLORS.redBorder,
//       alignItems: 'center', justifyContent: 'center',
//     },
//     removeBtnText: { fontSize: 9, color: COLORS.red, fontWeight: '800' },

//     // ── Promo banners ──
//     promoNote: {
//       backgroundColor: COLORS.accentBg,
//       borderWidth: 1, borderColor: COLORS.accentBorder,
//       borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
//       marginHorizontal: 16, marginVertical: 4,
//     },
//     promoNoteText: { fontSize: 12, color: COLORS.accent, fontWeight: '600', textAlign: 'center' },
//     promoNoteGreen: { backgroundColor: COLORS.greenBg, borderColor: COLORS.greenBorder },
//     promoNoteTextGreen: { color: COLORS.green },

//     // ── Summary card (glass) ──
//     summaryWrap: { marginHorizontal: 16, marginTop: 10, marginBottom: 12 },
//     summaryBox: {
//       backgroundColor: COLORS.glassBg,
//       borderWidth: 1, borderColor: COLORS.glassBorder,
//       borderRadius: 16, overflow: 'hidden',
//     },
//     summaryHeader: {
//       paddingHorizontal: 16, paddingVertical: 11,
//       borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder,
//     },
//     summaryHeaderText: { fontSize: 10, fontWeight: '800', color: COLORS.muted, letterSpacing: 2 },
//     summaryRows: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10 },
//     sumRow: {
//       flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//       paddingVertical: 10,
//       borderBottomWidth: 0.5, borderBottomColor: COLORS.glassBorder,
//     },
//     totalRow: { borderBottomWidth: 0, paddingTop: 14, paddingBottom: 2 },
//     sumKey: { fontSize: 13, color: COLORS.muted, fontWeight: '500' },
//     sumVal: { fontSize: 13, color: COLORS.text, fontWeight: '700' },
//     discountVal: { color: COLORS.green },
//     totalKey: { fontSize: 11, fontWeight: '800', color: COLORS.muted, letterSpacing: 2 },
//     totalVal: { fontSize: 26, fontWeight: '900', color: COLORS.text, letterSpacing: 0.3 },

//     // ── Bottom bar (glass) ──
//     bottomBar: {
//       backgroundColor: COLORS.glassBg,
//       borderTopWidth: 1, borderTopColor: COLORS.glassBorder,
//       paddingHorizontal: 16, paddingTop: 14,
//     },
//     checkoutBtn: {
//       backgroundColor: COLORS.primaryBg,
//       borderWidth: 1.5, borderColor: COLORS.primaryBorder,
//       borderRadius: 14, paddingVertical: 16,
//       alignItems: 'center', justifyContent: 'center',
//       marginBottom: 10,
//     },
//     checkoutText: { fontSize: 15, fontWeight: '800', color: COLORS.primary, letterSpacing: 1.5 },
//     continueBtn: {
//       backgroundColor: COLORS.glassBg,
//       borderWidth: 1, borderColor: COLORS.glassBorder,
//       borderRadius: 12, paddingVertical: 13,
//       alignItems: 'center', justifyContent: 'center',
//       marginBottom: 8,
//     },
//     continueBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.muted, letterSpacing: 0.5 },
//     secureRow: { alignItems: 'center', paddingBottom: 4 },
//     secureText: { fontSize: 11, color: COLORS.muted2 },

//     // ── Empty state ──
//     emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
//     emptyIcon: { fontSize: 72, marginBottom: 18 },
//     emptyTitle: { fontSize: 22, fontWeight: '900', color: COLORS.text, textAlign: 'center', marginBottom: 8 },
//     emptySub: { fontSize: 13, color: COLORS.muted, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
//     emptyCta: {
//       backgroundColor: COLORS.primaryBg,
//       borderWidth: 1.5, borderColor: COLORS.primaryBorder,
//       paddingHorizontal: 28, paddingVertical: 13, borderRadius: 12,
//     },
//     emptyCtaText: { fontSize: 13, fontWeight: '800', color: COLORS.primary, letterSpacing: 1 },
//   }), [COLORS]);

//   const renderItem = useCallback(({ item }) => (
//     <CartItem
//       item={item}
//       onIncrease={() => handleIncrease(item.id, item.selectedSize)}
//       onDecrease={() => handleDecrease(item.id, item.selectedSize)}
//       onRemove={() => handleRemove(item.id, item.selectedSize)}
//       S={S}
//     />
//   ), [handleIncrease, handleDecrease, handleRemove, S]);

//   return (
//     <View style={[S.container, { paddingTop: insets.top }]}>
//       {/* Ambient orbs */}
//       <View style={[S.orb, { width: 260, height: 260, top: -70, right: -70, backgroundColor: COLORS.orb1 }]} />
//       <View style={[S.orb, { width: 200, height: 200, top: 380, left: -80, backgroundColor: COLORS.orb2 }]} />
//       <View style={[S.orb, { width: 150, height: 150, bottom: 180, right: -40, backgroundColor: COLORS.orb1 }]} />

//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor="transparent"
//         translucent
//       />

//       {/* Header */}
//       <View style={S.header}>
//         <TouchableOpacity style={S.backBtn} onPress={() => navigation.goBack()}>
//           <Text style={S.backArrow}>←</Text>
//         </TouchableOpacity>
//         <View style={S.headerCenter}>
//           <Text style={S.headerTitle}>YOUR CART</Text>
//           <Text style={S.headerSub}>{totalItems} ITEM{totalItems !== 1 ? 'S' : ''}</Text>
//         </View>
//         <View style={S.headerRight} />
//       </View>

//       {cart.length === 0 ? (
//         <EmptyCart onShop={() => navigation.goBack()} S={S} />
//       ) : (
//         <View style={{ flex: 1 }}>
//           {/* Scrollable: items + promo + summary */}
//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingBottom: 20 }}
//           >
//             <FlatList
//               data={cart}
//               keyExtractor={keyExtractor}
//               renderItem={renderItem}
//               scrollEnabled={false}
//               contentContainerStyle={S.listContent}
//             />

//             {subtotal > 0 && subtotal <= 2999 && (
//               <View style={S.promoNote}>
//                 <Text style={S.promoNoteText}>
//                   🏎️  Add ₹{(3000 - subtotal).toLocaleString()} more for 5% off!
//                 </Text>
//               </View>
//             )}
//             {discount > 0 && (
//               <View style={[S.promoNote, S.promoNoteGreen]}>
//                 <Text style={[S.promoNoteText, S.promoNoteTextGreen]}>
//                   ✦  5% discount applied — nice!
//                 </Text>
//               </View>
//             )}

//             {/* Summary */}
//             <View style={S.summaryWrap}>
//               <View style={S.summaryBox}>
//                 <View style={S.summaryHeader}>
//                   <Text style={S.summaryHeaderText}>ORDER SUMMARY</Text>
//                 </View>
//                 <View style={S.summaryRows}>
//                   <View style={S.sumRow}>
//                     <Text style={S.sumKey}>Subtotal</Text>
//                     <Text style={S.sumVal}>₹{subtotal.toLocaleString()}</Text>
//                   </View>
//                   <View style={S.sumRow}>
//                     <Text style={S.sumKey}>Shipping</Text>
//                     <Text style={S.sumVal}>₹{shipping}</Text>
//                   </View>
//                   {discount > 0 && (
//                     <View style={S.sumRow}>
//                       <Text style={S.sumKey}>Discount (5%)</Text>
//                       <Text style={[S.sumVal, S.discountVal]}>−₹{discount.toLocaleString()}</Text>
//                     </View>
//                   )}
//                   <View style={[S.sumRow, S.totalRow]}>
//                     <Text style={S.totalKey}>TOTAL</Text>
//                     <Text style={S.totalVal}>₹{total.toLocaleString()}</Text>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </ScrollView>

//           {/* Fixed bottom CTA */}
//           <View style={[S.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
//             <TouchableOpacity style={S.checkoutBtn} activeOpacity={0.85}>
//               <Text style={S.checkoutText}>CHECKOUT  ▶</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={S.continueBtn}
//               onPress={() => navigation.goBack()}
//               activeOpacity={0.75}
//             >
//               <Text style={S.continueBtnText}>Continue Shopping</Text>
//             </TouchableOpacity>
//             <View style={S.secureRow}>
//               <Text style={S.secureText}>🔒  Secure payment  ·  Free returns</Text>
//             </View>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// export default CartScreen;



import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  StatusBar, Animated, ScrollView, Dimensions, ActivityIndicator,
  Modal, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { THEMES } from '../../redux/reducer/theme';
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/Apis';

const { width } = Dimensions.get('window');

// ─── CartItem ─────────────────────────────────────────────────────────────────
const CartItem = React.memo(({ item, onIncrease, onDecrease, onRemove, S, COLORS, loadingId }) => {
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const product = item.ProductId;
  const isLoading = loadingId === item._id;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const discount = product?.DiscountPrice && product?.Price
    ? Math.round((1 - product.DiscountPrice / product.Price) * 100)
    : null;

  return (
    <Animated.View
      style={[
        S.cartItem,
        {
          opacity: slideAnim,
          transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
        },
      ]}
    >
      {/* Product Image / Placeholder */}
      <TouchableOpacity style={S.itemThumb} activeOpacity={0.85}>
        {product?.Images?.[0] ? (
          <Image
            source={{ uri: product.Images[0] }}
            style={S.itemThumbImg}
            resizeMode="cover"
          />
        ) : (
          <Text style={S.itemEmoji}>🛍️</Text>
        )}
        {discount > 0 && (
          <View style={S.discPill}>
            <Text style={S.discPillText}>-{discount}%</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Info */}
      <View style={S.itemInfo}>
        <View style={S.itemTopRow}>
          <Text style={S.itemName} numberOfLines={2}>{product?.ProductName ?? '—'}</Text>
          <TouchableOpacity
            style={S.removeBtn}
            onPress={onRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            disabled={isLoading}
          >
            <Text style={S.removeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={S.itemBrand}>{product?.Brand ?? product?.ShortDescription ?? ''}</Text>

        <View style={S.itemBottom}>
          <View>
            <Text style={S.itemPrice}>₹{item.TotalPrice?.toLocaleString()}</Text>
            {product?.Price && product?.DiscountPrice && product.Price !== product.DiscountPrice && (
              <Text style={S.itemOrigPrice}>₹{(product.Price * item.Quantity)?.toLocaleString()}</Text>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 6 }} />
          ) : (
            <View style={S.qtyRow}>
              <TouchableOpacity
                style={S.qtyBtn}
                onPress={onDecrease}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={S.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={S.qtyNum}>{item.Quantity}</Text>
              <TouchableOpacity
                style={[S.qtyBtn, S.qtyBtnAdd]}
                onPress={onIncrease}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={[S.qtyBtnText, S.qtyBtnAddText]}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
});
CartItem.displayName = 'CartItem';

// ─── Success Modal ────────────────────────────────────────────────────────────
const SuccessModal = React.memo(({ visible, onClose, S, COLORS }) => {
  const scaleAnim = React.useRef(new Animated.Value(0.7)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 160 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[S.modalOverlay, { opacity: opacityAnim }]}>
        <Animated.View style={[S.modalCard, { transform: [{ scale: scaleAnim }] }]}>
          {/* Glow orbs */}
          <View style={[S.modalOrb, { width: 140, height: 140, top: -40, right: -30, backgroundColor: COLORS.orb1 }]} />
          <View style={[S.modalOrb, { width: 100, height: 100, bottom: -20, left: -20, backgroundColor: COLORS.orb2 }]} />

          <View style={S.modalIconWrap}>
            <Text style={S.modalIcon}>🎉</Text>
          </View>

          <Text style={S.modalTitle}>Order Placed!</Text>
          <Text style={S.modalSub}>Your order has been placed{'\n'}successfully. We'll notify you soon.</Text>

          <View style={S.modalDivider} />

          <View style={S.modalTagRow}>
            {['📦 Processing', '🚚 Dispatch soon', '✦ Thank you!'].map(tag => (
              <View key={tag} style={S.modalTag}>
                <Text style={S.modalTagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={S.modalBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={S.modalBtnText}>CONTINUE SHOPPING  ▶</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
});

// ─── EmptyCart ────────────────────────────────────────────────────────────────
const EmptyCart = React.memo(({ onShop, S }) => (
  <View style={S.emptyWrap}>
    <Text style={S.emptyIcon}>🛍️</Text>
    <Text style={S.emptyTitle}>Your cart is empty</Text>
    <Text style={S.emptySub}>Browse products and add something you love!</Text>
    <TouchableOpacity style={S.emptyCta} onPress={onShop} activeOpacity={0.85}>
      <Text style={S.emptyCtaText}>SHOP NOW  ▶</Text>
    </TouchableOpacity>
  </View>
));

// ─── CartScreen ───────────────────────────────────────────────────────────────
const CartScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const currentTheme = THEMES[selectedColorTheme] || THEMES.default;

  const COLORS = useMemo(() => ({
    bg:          isDarkMode ? '#08080f' : '#f0f2fa',
    glassBg:     isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.45)',
    glassBorder: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.8)',
    cardBg:      isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.55)',
    cardBorder:  isDarkMode ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.75)',
    primary:       isDarkMode ? '#a8c4ff' : '#4a7eff',
    primaryBg:     isDarkMode ? 'rgba(168,196,255,0.15)' : 'rgba(74,126,255,0.12)',
    primaryBorder: isDarkMode ? 'rgba(168,196,255,0.35)' : 'rgba(74,126,255,0.35)',
    accent:       isDarkMode ? '#ffbf8a' : '#e07030',
    accentBg:     isDarkMode ? 'rgba(255,160,100,0.15)' : 'rgba(224,112,48,0.10)',
    accentBorder: isDarkMode ? 'rgba(255,160,100,0.35)' : 'rgba(224,112,48,0.30)',
    green:       '#4ecf80',
    greenBg:     'rgba(78,207,128,0.14)',
    greenBorder: 'rgba(78,207,128,0.35)',
    red:       '#e05555',
    redBg:     'rgba(224,85,85,0.12)',
    redBorder: 'rgba(224,85,85,0.35)',
    text:   isDarkMode ? '#eeeef8' : '#0a0a18',
    muted:  isDarkMode ? '#8888aa' : '#6666aa',
    muted2: isDarkMode ? '#4a4a70' : '#9090c0',
    orb1: isDarkMode ? 'rgba(100,140,255,0.18)' : 'rgba(100,140,255,0.25)',
    orb2: isDarkMode ? 'rgba(255,160,80,0.12)'  : 'rgba(255,160,80,0.18)',
  }), [isDarkMode, currentTheme]);

  // ── State ───────────────────────────────────────────────────────────────────
  const [cartItems,     setCartItems]     = useState([]);
  const [grandTotal,    setGrandTotal]    = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [loadingId,     setLoadingId]     = useState(null); // cartItem _id being mutated
  const [orderLoading,  setOrderLoading]  = useState(false);
  const [clearLoading,  setClearLoading]  = useState(false);
  const [showSuccess,   setShowSuccess]   = useState(false);

  // ── Fetch cart ──────────────────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiGet('/api/shop/GetUserCart');
      setCartItems(res?.data?.cartItems ?? []);
      setGrandTotal(res?.data?.grandTotal ?? 0);
    } catch (err) {
      console.log('Cart fetch error:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ── Update quantity ─────────────────────────────────────────────────────────
  const handleIncrease = useCallback(async (cartItem) => {
    const newQty = cartItem.Quantity + 1;
    try {
      setLoadingId(cartItem._id);
      await apiPut(`/api/shop/UserUpdateCart/${cartItem._id}`, { Quantity: newQty });
      setCartItems(prev =>
        prev.map(i =>
          i._id === cartItem._id
            ? { ...i, Quantity: newQty, TotalPrice: i.Price * newQty }
            : i
        )
      );
      setGrandTotal(prev => prev + cartItem.Price);
    } catch (err) {
      console.log('Increment error:', err);
    } finally {
      setLoadingId(null);
    }
  }, []);

  const handleDecrease = useCallback(async (cartItem) => {
    if (cartItem.Quantity <= 1) {
      // Remove item instead
      handleRemove(cartItem);
      return;
    }
    const newQty = cartItem.Quantity - 1;
    try {
      setLoadingId(cartItem._id);
      await apiPut(`/api/shop/UserUpdateCart/${cartItem._id}`, { Quantity: newQty });
      setCartItems(prev =>
        prev.map(i =>
          i._id === cartItem._id
            ? { ...i, Quantity: newQty, TotalPrice: i.Price * newQty }
            : i
        )
      );
      setGrandTotal(prev => prev - cartItem.Price);
    } catch (err) {
      console.log('Decrement error:', err);
    } finally {
      setLoadingId(null);
    }
  }, []);

  // ── Remove item ─────────────────────────────────────────────────────────────
  const handleRemove = useCallback(async (cartItem) => {
    try {
      setLoadingId(cartItem._id);
      await apiDelete(`/api/shop/DeleteCartItem/${cartItem._id}`);
      setCartItems(prev => prev.filter(i => i._id !== cartItem._id));
      setGrandTotal(prev => prev - cartItem.TotalPrice);
    } catch (err) {
      console.log('Remove error:', err);
    } finally {
      setLoadingId(null);
    }
  }, []);

  // ── Clear cart ──────────────────────────────────────────────────────────────
  const handleClearCart = useCallback(async () => {
    try {
      setClearLoading(true);
      await apiDelete('/api/shop/ClearCart');
      setCartItems([]);
      setGrandTotal(0);
    } catch (err) {
      console.log('Clear cart error:', err);
    } finally {
      setClearLoading(false);
    }
  }, []);

  // ── Place order ─────────────────────────────────────────────────────────────
  const handlePlaceOrder = useCallback(async () => {
    try {
      setOrderLoading(true);
      await apiPost('/api/shop/UserPlaceOrder', {});
      setShowSuccess(true);
      setCartItems([]);
      setGrandTotal(0);
    } catch (err) {
      console.log('Place order error:', err);
    } finally {
      setOrderLoading(false);
    }
  }, []);

  const handleSuccessClose = useCallback(() => {
    setShowSuccess(false);
    navigation.goBack();
  }, [navigation]);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const totalItems = cartItems.reduce((a, i) => a + i.Quantity, 0);
  const shipping   = cartItems.length > 0 ? 99 : 0;
  const discount   = grandTotal > 2999 ? Math.round(grandTotal * 0.05) : 0;
  const total      = grandTotal + shipping - discount;

  const keyExtractor = useCallback((item) => item._id, []);

  // ── Styles ──────────────────────────────────────────────────────────────────
  const S = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    orb: { position: 'absolute', borderRadius: 999 },

    // ── Header ──
    header: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingHorizontal: 20, paddingVertical: 14,
      backgroundColor: COLORS.glassBg,
      borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder,
    },
    backBtn: {
      width: 38, height: 38, borderRadius: 10,
      backgroundColor: COLORS.glassBg,
      borderWidth: 1, borderColor: COLORS.glassBorder,
      alignItems: 'center', justifyContent: 'center',
    },
    backArrow: { fontSize: 18, color: COLORS.text },
    headerCenter: { alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.text, letterSpacing: 2 },
    headerSub: { fontSize: 10, color: COLORS.muted, letterSpacing: 2, marginTop: 1 },
    clearBtn: {
      paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
      backgroundColor: COLORS.redBg,
      borderWidth: 1, borderColor: COLORS.redBorder,
    },
    clearBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.red },

    listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },

    // ── Cart Item ──
    cartItem: {
      flexDirection: 'row',
      backgroundColor: COLORS.cardBg,
      borderWidth: 1, borderColor: COLORS.cardBorder,
      borderRadius: 16, padding: 12,
      alignItems: 'flex-start', gap: 12,
      marginBottom: 10,
    },
    itemThumb: {
      width: 80, height: 80, borderRadius: 12,
      borderWidth: 1, borderColor: COLORS.glassBorder,
      overflow: 'hidden',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(74,126,255,0.07)',
      flexShrink: 0,
      position: 'relative',
    },
    itemThumbImg: { width: '100%', height: '100%' },
    itemEmoji: { fontSize: 32 },
    discPill: {
      position: 'absolute', bottom: 4, left: 4,
      backgroundColor: 'rgba(224,112,48,0.85)',
      borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1,
    },
    discPillText: { fontSize: 8, fontWeight: '800', color: '#fff' },

    itemInfo: { flex: 1, minWidth: 0 },
    itemTopRow: {
      flexDirection: 'row', alignItems: 'flex-start',
      justifyContent: 'space-between', marginBottom: 2,
    },
    itemName: {
      fontSize: 13, fontWeight: '700', color: COLORS.text,
      letterSpacing: 0.2, flex: 1, marginRight: 8, lineHeight: 18,
    },
    itemBrand: { fontSize: 11, color: COLORS.muted, marginBottom: 10 },
    itemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    itemPrice: { fontSize: 16, fontWeight: '900', color: COLORS.text, letterSpacing: 0.2 },
    itemOrigPrice: { fontSize: 10, color: COLORS.muted2, textDecorationLine: 'line-through' },

    qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    qtyBtn: {
      width: 28, height: 28, borderRadius: 7,
      backgroundColor: COLORS.glassBg,
      borderWidth: 1, borderColor: COLORS.glassBorder,
      alignItems: 'center', justifyContent: 'center',
    },
    qtyBtnAdd: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primaryBorder },
    qtyBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.muted, lineHeight: 18 },
    qtyBtnAddText: { color: COLORS.primary },
    qtyNum: { fontSize: 14, fontWeight: '800', color: COLORS.text, minWidth: 20, textAlign: 'center' },

    removeBtn: {
      width: 24, height: 24, borderRadius: 6,
      backgroundColor: COLORS.redBg,
      borderWidth: 1, borderColor: COLORS.redBorder,
      alignItems: 'center', justifyContent: 'center',
    },
    removeBtnText: { fontSize: 9, color: COLORS.red, fontWeight: '800' },

    // ── Promo banners ──
    promoNote: {
      backgroundColor: COLORS.accentBg,
      borderWidth: 1, borderColor: COLORS.accentBorder,
      borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
      marginHorizontal: 16, marginVertical: 4,
    },
    promoNoteText: { fontSize: 12, color: COLORS.accent, fontWeight: '600', textAlign: 'center' },
    promoNoteGreen: { backgroundColor: COLORS.greenBg, borderColor: COLORS.greenBorder },
    promoNoteTextGreen: { color: COLORS.green },

    // ── Summary card ──
    summaryWrap: { marginHorizontal: 16, marginTop: 10, marginBottom: 12 },
    summaryBox: {
      backgroundColor: COLORS.glassBg,
      borderWidth: 1, borderColor: COLORS.glassBorder,
      borderRadius: 16, overflow: 'hidden',
    },
    summaryHeader: {
      paddingHorizontal: 16, paddingVertical: 11,
      borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder,
    },
    summaryHeaderText: { fontSize: 10, fontWeight: '800', color: COLORS.muted, letterSpacing: 2 },
    summaryRows: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10 },
    sumRow: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 0.5, borderBottomColor: COLORS.glassBorder,
    },
    totalRow: { borderBottomWidth: 0, paddingTop: 14, paddingBottom: 2 },
    sumKey: { fontSize: 13, color: COLORS.muted, fontWeight: '500' },
    sumVal: { fontSize: 13, color: COLORS.text, fontWeight: '700' },
    discountVal: { color: COLORS.green },
    totalKey: { fontSize: 11, fontWeight: '800', color: COLORS.muted, letterSpacing: 2 },
    totalVal: { fontSize: 26, fontWeight: '900', color: COLORS.text, letterSpacing: 0.3 },

    // ── Bottom bar ──
    bottomBar: {
      backgroundColor: COLORS.glassBg,
      borderTopWidth: 1, borderTopColor: COLORS.glassBorder,
      paddingHorizontal: 16, paddingTop: 14,
    },
    checkoutBtn: {
      backgroundColor: COLORS.primaryBg,
      borderWidth: 1.5, borderColor: COLORS.primaryBorder,
      borderRadius: 14, paddingVertical: 16,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 10,
    },
    checkoutText: { fontSize: 15, fontWeight: '800', color: COLORS.primary, letterSpacing: 1.5 },
    continueBtn: {
      backgroundColor: COLORS.glassBg,
      borderWidth: 1, borderColor: COLORS.glassBorder,
      borderRadius: 12, paddingVertical: 13,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 8,
    },
    continueBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.muted, letterSpacing: 0.5 },
    secureRow: { alignItems: 'center', paddingBottom: 4 },
    secureText: { fontSize: 11, color: COLORS.muted2 },

    // ── Loader ──
    loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    // ── Empty state ──
    emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
    emptyIcon: { fontSize: 72, marginBottom: 18 },
    emptyTitle: { fontSize: 22, fontWeight: '900', color: COLORS.text, textAlign: 'center', marginBottom: 8 },
    emptySub: { fontSize: 13, color: COLORS.muted, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
    emptyCta: {
      backgroundColor: COLORS.primaryBg,
      borderWidth: 1.5, borderColor: COLORS.primaryBorder,
      paddingHorizontal: 28, paddingVertical: 13, borderRadius: 12,
    },
    emptyCtaText: { fontSize: 13, fontWeight: '800', color: COLORS.primary, letterSpacing: 1 },

    // ── Success Modal ──
    modalOverlay: {
      flex: 1, backgroundColor: 'rgba(0,0,0,0.65)',
      alignItems: 'center', justifyContent: 'center',
      paddingHorizontal: 24,
    },
    modalCard: {
      width: '100%', backgroundColor: isDarkMode ? '#12122a' : '#ffffff',
      borderWidth: 1, borderColor: COLORS.glassBorder,
      borderRadius: 24, padding: 28,
      overflow: 'hidden', alignItems: 'center',
    },
    modalOrb: { position: 'absolute', borderRadius: 999 },
    modalIconWrap: {
      width: 80, height: 80, borderRadius: 20,
      backgroundColor: COLORS.greenBg,
      borderWidth: 1, borderColor: COLORS.greenBorder,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 18,
    },
    modalIcon: { fontSize: 38 },
    modalTitle: { fontSize: 28, fontWeight: '900', color: COLORS.text, letterSpacing: 1, marginBottom: 8, textAlign: 'center' },
    modalSub: { fontSize: 13, color: COLORS.muted, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
    modalDivider: { width: '100%', height: 1, backgroundColor: COLORS.glassBorder, marginBottom: 16 },
    modalTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 24 },
    modalTag: {
      paddingHorizontal: 10, paddingVertical: 5,
      borderRadius: 8, borderWidth: 1,
      backgroundColor: COLORS.glassBg, borderColor: COLORS.glassBorder,
    },
    modalTagText: { fontSize: 11, color: COLORS.muted, fontWeight: '600' },
    modalBtn: {
      width: '100%', backgroundColor: COLORS.primaryBg,
      borderWidth: 1.5, borderColor: COLORS.primaryBorder,
      borderRadius: 14, paddingVertical: 15,
      alignItems: 'center',
    },
    modalBtnText: { fontSize: 14, fontWeight: '800', color: COLORS.primary, letterSpacing: 1.2 },
  }), [COLORS, isDarkMode]);

  const renderItem = useCallback(({ item }) => (
    <CartItem
      item={item}
      onIncrease={() => handleIncrease(item)}
      onDecrease={() => handleDecrease(item)}
      onRemove={() => handleRemove(item)}
      S={S}
      COLORS={COLORS}
      loadingId={loadingId}
    />
  ), [handleIncrease, handleDecrease, handleRemove, S, COLORS, loadingId]);

  return (
    <View style={[S.container, { paddingTop: insets.top }]}>
      {/* Ambient orbs */}
      <View style={[S.orb, { width: 260, height: 260, top: -70, right: -70, backgroundColor: COLORS.orb1 }]} />
      <View style={[S.orb, { width: 200, height: 200, top: 380, left: -80, backgroundColor: COLORS.orb2 }]} />
      <View style={[S.orb, { width: 150, height: 150, bottom: 180, right: -40, backgroundColor: COLORS.orb1 }]} />

      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity style={S.backBtn} onPress={() => navigation.goBack()}>
          <Text style={S.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={S.headerCenter}>
          <Text style={S.headerTitle}>YOUR CART</Text>
          <Text style={S.headerSub}>{totalItems} ITEM{totalItems !== 1 ? 'S' : ''}</Text>
        </View>
        {cartItems.length > 0 ? (
          <TouchableOpacity style={S.clearBtn} onPress={handleClearCart} disabled={clearLoading}>
            {clearLoading
              ? <ActivityIndicator size="small" color={COLORS.red} />
              : <Text style={S.clearBtnText}>Clear All</Text>
            }
          </TouchableOpacity>
        ) : (
          <View style={{ width: 64 }} />
        )}
      </View>

      {/* Body */}
      {loading ? (
        <View style={S.loaderWrap}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : cartItems.length === 0 ? (
        <EmptyCart onShop={() => navigation.goBack()} S={S} />
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <FlatList
              data={cartItems}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              scrollEnabled={false}
              contentContainerStyle={S.listContent}
            />

            {grandTotal > 0 && grandTotal <= 2999 && (
              <View style={S.promoNote}>
                <Text style={S.promoNoteText}>
                  🏷️  Add ₹{(3000 - grandTotal).toLocaleString()} more for 5% off!
                </Text>
              </View>
            )}
            {discount > 0 && (
              <View style={[S.promoNote, S.promoNoteGreen]}>
                <Text style={[S.promoNoteText, S.promoNoteTextGreen]}>
                  ✦  5% discount applied — nice!
                </Text>
              </View>
            )}

            {/* Summary */}
            <View style={S.summaryWrap}>
              <View style={S.summaryBox}>
                <View style={S.summaryHeader}>
                  <Text style={S.summaryHeaderText}>ORDER SUMMARY</Text>
                </View>
                <View style={S.summaryRows}>
                  <View style={S.sumRow}>
                    <Text style={S.sumKey}>Subtotal ({totalItems} items)</Text>
                    <Text style={S.sumVal}>₹{grandTotal.toLocaleString()}</Text>
                  </View>
                  <View style={S.sumRow}>
                    <Text style={S.sumKey}>Shipping</Text>
                    <Text style={S.sumVal}>₹{shipping}</Text>
                  </View>
                  {discount > 0 && (
                    <View style={S.sumRow}>
                      <Text style={S.sumKey}>Discount (5%)</Text>
                      <Text style={[S.sumVal, S.discountVal]}>−₹{discount.toLocaleString()}</Text>
                    </View>
                  )}
                  <View style={[S.sumRow, S.totalRow]}>
                    <Text style={S.totalKey}>TOTAL</Text>
                    <Text style={S.totalVal}>₹{total.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Fixed bottom CTA */}
          <View style={[S.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
            <TouchableOpacity
              style={S.checkoutBtn}
              onPress={handlePlaceOrder}
              activeOpacity={0.85}
              disabled={orderLoading}
            >
              {orderLoading
                ? <ActivityIndicator size="small" color={COLORS.primary} />
                : <Text style={S.checkoutText}>PLACE ORDER  ▶</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity
              style={S.continueBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.75}
            >
              <Text style={S.continueBtnText}>Continue Shopping</Text>
            </TouchableOpacity>
            <View style={S.secureRow}>
              <Text style={S.secureText}>🔒  Secure payment  ·  Free returns</Text>
            </View>
          </View>
        </View>
      )}

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccess}
        onClose={handleSuccessClose}
        S={S}
        COLORS={COLORS}
      />
    </View>
  );
};

export default CartScreen;