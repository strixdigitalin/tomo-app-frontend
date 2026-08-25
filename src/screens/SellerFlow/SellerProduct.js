import React, { useCallback, useState } from 'react';
import {
    View,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import { SpaceBetweenRow } from '../../components/wrapper/spacebetween';
import { ActionMenu, ConfirmDialog } from '../../components/ActionMenu';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { App_Primary_color, white } from '../../common/Colors/colors';
import { apiGet, apiDelete } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import urls from '../../config/urls';
import IMG from '../../assets/Images';

const SellerProduct = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const insets = useSafeAreaInsets();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [menuProduct, setMenuProduct] = useState(null);
    const [confirmProduct, setConfirmProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await apiGet(urls.sellerAllProducts);
            setProducts(res?.data || []);
        } catch (error) {
            console.log('SellerProduct fetchProducts error', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProducts();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    const deleteProduct = async (product) => {
        try {
            const res = await apiDelete(`${urls.sellerDeleteProduct}/${product?._id}`);
            ToastMsg(res?.message || 'Product deleted');
            fetchProducts();
        } catch (error) {
            ToastMsg(error?.message || 'Failed to delete product');
        }
    };

    const menuOptions = menuProduct
        ? [
              { label: 'Update Product', icon: 'edit-2', onPress: () => navigation.navigate('SellerAddProduct', { product: menuProduct }) },
              { label: 'Delete Product', icon: 'trash-2', destructive: true, onPress: () => setConfirmProduct(menuProduct) },
          ]
        : [];

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#121212' : '#fff',
            paddingTop: insets.top,
        },
        header: {
            paddingHorizontal: 20,
            paddingVertical: 14,
        },
        headerTitle: {
            fontSize: 22,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        headerSub: {
            fontSize: 13,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            marginTop: 2,
        },
        addBtn: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: App_Primary_color,
        },
        grid: {
            paddingHorizontal: 14,
            paddingBottom: 120,
        },
        card: {
            flex: 1,
            margin: 6,
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F7F7F7',
            borderWidth: 1,
            borderColor: isDarkMode ? '#2A2A2A' : '#EFEFEF',
        },
        cardImage: {
            width: '100%',
            height: 130,
        },
        menuBtn: {
            position: 'absolute',
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        cardBody: {
            padding: 10,
        },
        productName: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
        },
        productPrice: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: App_Primary_color,
            marginTop: 4,
        },
        emptyWrap: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 100,
            paddingHorizontal: 30,
        },
        emptyIconWrap: {
            width: 72,
            height: 72,
            borderRadius: 36,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: App_Primary_color,
            marginBottom: 16,
        },
        emptyTitle: {
            fontSize: 17,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        emptySub: {
            fontSize: 13,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
            marginTop: 6,
        },
    });

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.85}
            style={styles.card}
            onPress={() => navigation.navigate('SellerProductDetail', { id: item?._id })}
        >
            <Image
                source={Array.isArray(item?.Images) && item.Images.length > 0 ? { uri: item.Images[0] } : IMG.PostImage}
                style={styles.cardImage}
                resizeMode="cover"
            />
            <TouchableOpacity
                style={styles.menuBtn}
                onPress={() => setMenuProduct(item)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Icon name="more-vertical" size={16} color={white} />
            </TouchableOpacity>
            <View style={styles.cardBody}>
                <CustomText numberOfLines={1} style={styles.productName}>{item?.ProductName}</CustomText>
                {!!item?.Price && <CustomText style={styles.productPrice}>₹{Number(item.Price).toLocaleString()}</CustomText>}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <SpaceBetweenRow style={styles.header}>
                <View>
                    <CustomText style={styles.headerTitle}>Products</CustomText>
                    <CustomText style={styles.headerSub}>{products?.length || 0} items listed</CustomText>
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('SellerAddProduct')}>
                    <Icon name="plus" size={20} color={white} />
                </TouchableOpacity>
            </SpaceBetweenRow>

            <FlatList
                data={products}
                keyExtractor={(item, index) => item?._id || String(index)}
                renderItem={renderProduct}
                numColumns={2}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={App_Primary_color} />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyWrap}>
                            <View style={styles.emptyIconWrap}>
                                <Icon name="package" size={30} color={white} />
                            </View>
                            <CustomText style={styles.emptyTitle}>No products yet</CustomText>
                            <CustomText style={styles.emptySub}>
                                Tap the + button to add your first product to a shop.
                            </CustomText>
                        </View>
                    )
                }
            />

            <ActionMenu
                visible={!!menuProduct}
                onClose={() => setMenuProduct(null)}
                title={menuProduct?.ProductName}
                options={menuOptions}
            />
            <ConfirmDialog
                visible={!!confirmProduct}
                onClose={() => setConfirmProduct(null)}
                title="Delete Product"
                message="Are you sure you want to delete this product? This cannot be undone."
                onConfirm={() => deleteProduct(confirmProduct)}
            />
        </View>
    );
};

export default SellerProduct;
