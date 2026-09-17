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