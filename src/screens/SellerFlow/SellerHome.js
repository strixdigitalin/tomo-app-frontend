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
import urls from '../../config/urls';
import { ToastMsg } from '../../utils/helperFunctions';
import IMG from '../../assets/Images';

const SellerHome = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const insets = useSafeAreaInsets();

    let seller = useSelector(state => state?.user?.userData);
    if (Object.keys(seller || {}).length !== 0) {
        try { seller = JSON.parse(seller); } catch (e) { }
    }

    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [menuShop, setMenuShop] = useState(null);
    const [confirmShop, setConfirmShop] = useState(null);

    const fetchShops = async () => {
        try {
            const res = await apiGet(urls.sellerAllShop);
            setShops(res?.data || []);
        } catch (error) {
            console.log('SellerHome fetchShops error', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchShops();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchShops();
    };

    const deleteShop = async (shop) => {
        try {
            const res = await apiDelete(`${urls.sellerDeleteShop}/${shop?._id}`);
            ToastMsg(res?.message || 'Shop deleted');
            fetchShops();
        } catch (error) {
            ToastMsg(error?.message || 'Failed to delete shop');
        }
    };

    const menuOptions = menuShop
        ? [
              { label: 'Update Shop', icon: 'edit-2', onPress: () => navigation.navigate('SellerAddShop', { shop: menuShop }) },
              { label: 'Delete Shop', icon: 'trash-2', destructive: true, onPress: () => setConfirmShop(menuShop) },
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
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: App_Primary_color,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 14,
        },
        addBtnText: {
            color: white,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold || FONTS_FAMILY.SourceSans3_Medium,
            fontSize: 13,
        },
        card: {
            marginHorizontal: 20,
            marginBottom: 16,
            borderRadius: 18,
            overflow: 'hidden',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F7F7F7',
            borderWidth: 1,
            borderColor: isDarkMode ? '#2A2A2A' : '#EFEFEF',
        },
        cardImage: {
            width: '100%',
            height: 150,
        },
        menuBtn: {
            position: 'absolute',
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        cardBody: {
            padding: 14,
        },
        shopName: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        shopMeta: {
            fontSize: 13,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            marginTop: 4,
        },
        chipRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
            marginTop: 10,
        },
        chip: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            backgroundColor: isDarkMode ? 'rgba(46,125,50,0.2)' : 'rgba(46,125,50,0.1)',
        },
        chipText: {
            fontSize: 11,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            color: App_Primary_color,
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
        emptyBtn: {
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: App_Primary_color,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 16,
        },
    });

    const renderShop = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.85}
            style={styles.card}
            onPress={() => navigation.navigate('SellerAddProduct', { shopId: item?._id, shopName: item?.Name })}
        >
            <Image
                source={item?.Image ? { uri: item.Image } : IMG.PostImage}
                style={styles.cardImage}
                resizeMode="cover"
            />
            <TouchableOpacity
                style={styles.menuBtn}
                onPress={() => setMenuShop(item)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Icon name="more-vertical" size={18} color={white} />
            </TouchableOpacity>
            <View style={styles.cardBody}>
                <CustomText style={styles.shopName}>{item?.Name}</CustomText>
                {!!item?.Services && (
                    <CustomText numberOfLines={1} style={styles.shopMeta}>{item?.Services}</CustomText>
                )}
                {Array.isArray(item?.ShopCategory) && item.ShopCategory.length > 0 && (
                    <View style={styles.chipRow}>
                        {item.ShopCategory.slice(0, 4).map((cat, i) => (
                            <View key={i} style={styles.chip}>
                                <CustomText style={styles.chipText}>{cat}</CustomText>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />
            <SpaceBetweenRow style={styles.header}>
                <View>
                    <CustomText style={styles.headerTitle}>My Shops</CustomText>
                    <CustomText style={styles.headerSub}>
                        {seller?.StoreName || seller?.FullName || 'Seller Dashboard'}
                    </CustomText>
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('SellerAddShop')}>
                    <Icon name="plus" size={16} color={white} />
                    <CustomText style={styles.addBtnText}>Add Shop</CustomText>
                </TouchableOpacity>
            </SpaceBetweenRow>

            <FlatList
                data={shops}
                keyExtractor={(item, index) => item?._id || String(index)}
                renderItem={renderShop}
                contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={App_Primary_color} />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyWrap}>
                            <View style={styles.emptyIconWrap}>
                                <Icon name="shopping-bag" size={30} color={white} />
                            </View>
                            <CustomText style={styles.emptyTitle}>No shops yet</CustomText>
                            <CustomText style={styles.emptySub}>
                                Create your first shop to start listing products and reach customers.
                            </CustomText>
                            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('SellerAddShop')}>
                                <Icon name="plus" size={16} color={white} />
                                <CustomText style={{ color: white, fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>
                                    Add New Shop
                                </CustomText>
                            </TouchableOpacity>
                        </View>
                    )
                }
            />

            <ActionMenu
                visible={!!menuShop}
                onClose={() => setMenuShop(null)}
                title={menuShop?.Name}
                options={menuOptions}
            />
            <ConfirmDialog
                visible={!!confirmShop}
                onClose={() => setConfirmShop(null)}
                title="Delete Shop"
                message="Are you sure you want to delete this shop? This cannot be undone."
                onConfirm={() => deleteShop(confirmShop)}
            />
        </View>
    );
};

export default SellerHome;
