




import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { BackBlackSimple, BackIcon } from '../../assets/SVGs';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import useLoader from '../../utils/LoaderHook';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
import GradientIcon from '../../components/GradientIcon';
import { App_Primary_color } from '../../common/Colors/colors';
import { THEMES } from '../../redux/reducer/theme'; // ✅ IMPORT THEMES

const AllProductsOfAShops = ({ navigation, route }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const searchInputRef = useRef(null);
    const { showLoader, hideLoader } = useLoader();
    const isFocused = useIsFocused();
    
    // ✅ GET THEME STATE
    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    
    // ✅ GET CURRENT THEME COLORS
    const currentTheme = THEMES[selectedColorTheme] || THEMES.default;
    const primaryColor = currentTheme.primary;
    const secondaryColor = currentTheme.secondary;
    const glowColors = [primaryColor, secondaryColor];

    let selector = useSelector(state => state?.user?.userData);
    if (Object.keys(selector).length !== 0) {
        selector = JSON.parse(selector);
    }

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredProducts(allProducts);
        } else {
            const filtered = allProducts.filter(product => {
                const productName = product?.ProductName?.toLowerCase() || '';
                const productDetails = product?.ProductDetails?.toLowerCase() || '';
                const query = searchQuery.toLowerCase();
                return productName.includes(query) || productDetails.includes(query);
            });
            setFilteredProducts(filtered);
        }
    }, [searchQuery, allProducts]);

    const fetchData = async () => {
        showLoader();
        try {
            const res = await apiGet(`${urls.getAllProductsOfAShop}/${route?.params?.shopId}`);
            setAllProducts(res?.data || []);
            setFilteredProducts(res?.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            hideLoader();
        }
    };

    const handleSearch = useCallback((text) => {
        setSearchQuery(text);
    }, []);

    const handleProductPress = useCallback((productId) => {
        navigation.navigate('ProductDetail', { productId });
    }, [navigation]);

    const handleBoostPress = useCallback((product) => {
        navigation.navigate('BoostProduct', {
            product: product,
            shopId: route?.params?.shopId
        });
    }, [navigation, route?.params?.shopId]);

    const ProductCard = React.memo(({ item, onPress, onBoostPress }) => {
        return (
            <GlowWrapper
                isDarkMode={isDarkMode}
                borderRadius={10}
                showStars={true}
                starCount={6}
                showShinePatches={true}
                intensity="low"
                containerStyle={{
                    flex: 1,
                    margin: 5,
                }}
                glowColors={glowColors} // ✅ DYNAMIC GLOW COLORS
            >
                <TouchableOpacity
                    style={[
                        styles.cardContainer,
                        {
                            backgroundColor: isDarkMode ? '#252525' : '#fff',
                            borderColor: isDarkMode ? 'gray' : '#E4E4E4'
                        }
                    ]}
                    onPress={onPress}
                    activeOpacity={0.8}
                >
                    <Image
                        source={item?.Images[0] ? { uri: item?.Images[0] } : IMG.PostImage}
                        style={styles.productImage}
                        resizeMode="cover"
                    />

                    {/* Boost Badge if product is boosted */}
                    {item?.isBoosted && (
                        <View style={styles.boostBadge}>
                            <LinearGradient
                                colors={glowColors} // ✅ THEME COLOR
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.boostBadgeGradient}
                            >
                                <GradientIcon
                                    colors={['#fff', '#fff']}
                                    size={10}
                                    iconType='FontAwesome5'
                                    name={'bolt'}
                                />
                                <CustomText style={styles.boostBadgeText}>Boosted</CustomText>
                            </LinearGradient>
                        </View>
                    )}

                    <View style={styles.productInfo}>
                        <CustomText
                            style={styles.productName}
                            numberOfLines={1}
                        >
                            {item?.ProductName}
                        </CustomText>
                        <View style={styles.detailsRow}>
                            <GradientIcon
                                colors={glowColors} // ✅ THEME COLOR
                                size={12}
                                iconType='FontAwesome6'
                                name={'circle-info'}
                            />
                            <CustomText
                                style={[
                                    styles.productDetails,
                                    { color: isDarkMode ? 'white' : '#7d7d7d' }
                                ]}
                                numberOfLines={2}
                            >
                                {item?.ProductDetails}
                            </CustomText>
                        </View>

                        {/* Boost Button */}
                        <TouchableOpacity
                            style={styles.boostButton}
                            onPress={() => onBoostPress(item)}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={glowColors} // ✅ THEME COLOR
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.boostButtonGradient}
                            >
                                <GradientIcon
                                    colors={['#fff', '#fff']}
                                    size={12}
                                    iconType='FontAwesome5'
                                    name={'chart-line'}
                                />
                                <CustomText style={styles.boostButtonText}>
                                    {item?.isBoosted ? 'Manage Boost' : 'Boost'}
                                </CustomText>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </GlowWrapper>
        );
    });

    const renderHeader = () => {
        return (
            <SpaceBetweenRow
                style={[
                    styles.header,
                    { backgroundColor: isDarkMode ? '#252525' : 'white' }
                ]}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {isDarkMode ? <BackIcon /> : <BackBlackSimple />}
                </TouchableOpacity>
                <CustomText style={styles.headerTitle}>Products</CustomText>
                <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
                    <GradientIcon
                        colors={glowColors} // ✅ THEME COLOR
                        size={20}
                        iconType='FontAwesome5'
                        name={'bell'}
                    />
                </TouchableOpacity>
            </SpaceBetweenRow>
        );
    };

    const renderItem = useCallback(({ item }) => (
        <ProductCard
            item={item}
            isDarkMode={isDarkMode}
            onPress={() => handleProductPress(item?._id)}
            onBoostPress={handleBoostPress}
        />
    ), [isDarkMode, handleProductPress, handleBoostPress]);

    const keyExtractor = useCallback((item) => item?._id?.toString(), []);

    const getItemLayout = useCallback((data, index) => ({
        length: 200,
        offset: 200 * Math.floor(index / 2),
        index,
    }), []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : '#fff',
        },
        header: {
            paddingTop: 50,
            paddingHorizontal: 20,
            paddingBottom: 15,
        },
        headerTitle: {
            fontSize: 20,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#252525' : '#F0F0F0',
            borderRadius: 30,
            margin: 10,
            padding: 4,
            marginTop: 10,
            paddingHorizontal: 15,
            gap: 10,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: isDarkMode ? 'white' : 'black',
        },
        listContent: {
            paddingHorizontal: 5,
            paddingBottom: 20,
        },
        cardContainer: {
            borderRadius: 10,
            padding: 7,
            borderWidth: 1,
        },
        productImage: {
            height: 100,
            width: '100%',
            borderRadius: 10,
        },
        productInfo: {
            marginTop: 6,
        },
        productName: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            marginBottom: 5,
        },
        detailsRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 5,
        },
        productDetails: {
            fontSize: 10,
            flex: 1,
        },
        boostButton: {
            marginTop: 8,
            borderRadius: 6,
            overflow: 'hidden',
        },
        boostButtonGradient: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 6,
            paddingHorizontal: 10,
            gap: 5,
        },
        boostButtonText: {
            color: '#fff',
            fontSize: 11,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        boostBadge: {
            position: 'absolute',
            top: 12,
            right: 12,
            borderRadius: 12,
            overflow: 'hidden',
            zIndex: 1,
        },
        boostBadgeGradient: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 3,
            paddingHorizontal: 8,
            gap: 3,
        },
        boostBadgeText: {
            color: '#fff',
            fontSize: 9,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        emptyText: {
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            alignSelf: 'center',
            paddingVertical: 20,
        },
        createButtonWrapper: {
            marginHorizontal: 20,
        },
        followButton: {
            // paddingVertical: 15,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignItems: 'center',
            height: 40,
             justifyContent: 'center',
             alignItems: 'center',
        },
        followText: {
            fontSize: 16,
            fontWeight: '600',
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        promotionsLink: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginHorizontal: 10,
            marginBottom: 10,
            paddingVertical: 12,
            paddingHorizontal: 15,
            borderRadius: 8,
        },
        promotionsLinkText: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            color:'white'
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
            {renderHeader()}

            <View style={styles.searchContainer}>
                <GradientIcon
                    colors={glowColors} // ✅ THEME COLOR
                    size={18}
                    iconType='FontAwesome5'
                    name={'search'}
                />
                <TextInput
                    ref={searchInputRef}
                    style={styles.searchInput}
                    placeholder="Search products..."
                    placeholderTextColor="#A0A0A0"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    editable={true}
                    keyboardType="default"
                    autoCapitalize="none"
                    autoCorrect={true}
                    spellCheck={true}
                    contextMenuHidden={false}
                    selectTextOnFocus={false}
                    returnKeyType="search"
                />
            </View>

            <FlatList
                data={filteredProducts}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={5}
                initialNumToRender={6}
                getItemLayout={getItemLayout}
                ListEmptyComponent={
                    <CustomText style={styles.emptyText}>
                        No Products found!
                    </CustomText>
                }
            />

            {selector?.SellerStatus === 'Approved' && (
                <View style={styles.createButtonWrapper}>
                    <TouchableOpacity
                        onPress={() => navigation?.navigate('CreateProducts', {
                            shopId: route?.params?.shopId
                        })}
                    >
                        <LinearGradient
                            colors={glowColors} // ✅ THEME COLOR
                            start={{ x: 1, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.followButton}
                        >
                            <Text style={[styles.followText, { color: '#fff' }]}>
                                Create Product
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}

            <View style={{ height: 50 }} />
        </View>
    );
};

export default AllProductsOfAShops;
