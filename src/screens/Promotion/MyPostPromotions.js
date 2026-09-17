import React, { useCallback, useState, useMemo } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import SafeImage from '../../components/SafeImage';
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
import Row from '../../components/wrapper/row';
import { SpaceBetweenRow } from '../../components/wrapper/spacebetween';
import { ActionMenu, ConfirmDialog } from '../../components/ActionMenu';
import EditPostPromotionModal from './EditPostPromotionModal';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { white } from '../../common/Colors/colors';
import { apiGet, apiDelete } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import urls from '../../config/urls';
import useThemeColor from '../../utils/useThemeColor';

const STATUS_COLORS = {
    Approved: { bg: '#16A34A', text: white },
    Pending: { bg: '#EAB308', text: white },
    Rejected: { bg: '#EF4136', text: white },
};

// Matches web's Pages/PaidPromotion/AllMyPostPromotions.jsx — the user's own
// post promotions (a different thing from boosting a shop product).
const MyPostPromotions = ({ navigation }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const glowColors = useMemo(() => [primaryColor, primaryColor], [primaryColor]);
    const insets = useSafeAreaInsets();

    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [menuItem, setMenuItem] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [confirmItem, setConfirmItem] = useState(null);

    const fetchPromotions = async () => {
        try {
            const res = await apiGet(urls.getMyPostPromotions);
            setPromotions(res?.data || []);
        } catch (error) {
            console.log('MyPostPromotions fetch error', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPromotions();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchPromotions();
    };

    const deletePromotion = async (item) => {
        try {
            const res = await apiDelete(`${urls.deletePostPromotion}/${item?._id}`);
            ToastMsg(res?.message || 'Promotion deleted successfully');
            fetchPromotions();
        } catch (error) {
            ToastMsg(error?.message || 'Failed to delete promotion');
        }
    };

    const menuOptions = menuItem
        ? [
              { label: 'View Details', icon: 'eye', onPress: () => navigation.navigate('PostPromotionDetail', { id: menuItem._id }) },
              { label: 'Update Promotion', icon: 'edit-2', onPress: () => setEditItem(menuItem) },
              { label: 'Delete Promotion', icon: 'trash-2', destructive: true, onPress: () => setConfirmItem(menuItem) },
          ]
        : [];

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#fff', paddingTop: insets.top },
        header: { paddingHorizontal: 20, paddingVertical: 14 },
        headerTitle: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        addBtn: {
            width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
            backgroundColor: primaryColor,
        },
        list: { paddingHorizontal: 16, paddingBottom: 120 },
        card: {
            borderRadius: 18, overflow: 'hidden', marginBottom: 16,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F7F7F7',
            borderWidth: 1, borderColor: isDarkMode ? '#2A2A2A' : '#EFEFEF',
        },
        imageBox: { width: '100%', height: 170, position: 'relative' },
        image: { width: '100%', height: '100%' },
        statusBadge: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
        statusText: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
        runningBadge: {
            position: 'absolute', bottom: 10, left: 10, backgroundColor: '#4F46E5',
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
        },
        runningText: { fontSize: 11, color: white, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
        priceBadge: {
            position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.7)',
            paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
        },
        priceText: { fontSize: 13, color: white, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        body: { padding: 14 },
        caption: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
        chip: {
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
            backgroundColor: isDarkMode ? 'rgba(147,51,234,0.2)' : 'rgba(147,51,234,0.1)',
        },
        chipText: { fontSize: 11, color: '#9333EA', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
        goalChip: { backgroundColor: isDarkMode ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.1)' },
        goalChipText: { color: '#2563EB' },
        dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
        dateText: { fontSize: 12, color: isDarkMode ? '#9CA3AF' : '#6B7280' },
        menuBtn: {
            position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16,
            alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 5,
        },
        statsRow: {
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: isDarkMode ? '#2A2A2A' : '#EEE',
        },
        statText: { fontSize: 11, color: isDarkMode ? '#9CA3AF' : '#6B7280' },
        paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
        emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, paddingHorizontal: 30 },
        emptyIconWrap: {
            width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center',
            backgroundColor: primaryColor, marginBottom: 16,
        },
        emptyTitle: { fontSize: 17, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        emptySub: {
            fontSize: 13, color: isDarkMode ? '#9CA3AF' : '#6B7280', textAlign: 'center', marginTop: 6,
        },
    });

    const renderItem = ({ item }) => {
        const post = item?.Post;
        const statusStyle = STATUS_COLORS[item?.Status] || STATUS_COLORS.Pending;

        return (
            <GlowWrapper
                isDarkMode={isDarkMode}
                borderRadius={18}
                showStars={false}
                showShinePatches
                intensity="low"
                containerStyle={{ marginBottom: 16 }}
                glowColors={glowColors}
            >
            <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.card, { marginBottom: 0 }]}
                onPress={() => navigation.navigate('PostPromotionDetail', { id: item?._id })}
            >
                <View style={styles.imageBox}>
                    <SafeImage uri={post?.media} style={styles.image} />
                    <TouchableOpacity
                        style={styles.menuBtn}
                        onPress={() => setMenuItem(item)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Icon name="more-vertical" size={18} color={white} />
                    </TouchableOpacity>
                    {!!item?.Status && (
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                            <CustomText style={[styles.statusText, { color: statusStyle.text }]}>{item.Status}</CustomText>
                        </View>
                    )}
                    {!!item?.IsRunning && (
                        <View style={styles.runningBadge}>
                            <CustomText style={styles.runningText}>● Running</CustomText>
                        </View>
                    )}
                    {!!item?.Price && (
                        <View style={styles.priceBadge}>
                            <CustomText style={styles.priceText}>₹{item.Price}</CustomText>
                        </View>
                    )}
                </View>
                <View style={styles.body}>
                    <CustomText numberOfLines={2} style={styles.caption}>{post?.caption || 'No caption'}</CustomText>
                    <View style={styles.chipRow}>
                        {!!item?.PromotionType && (
                            <View style={styles.chip}>
                                <CustomText style={styles.chipText}>{item.PromotionType}</CustomText>
                            </View>
                        )}
                        {!!item?.Goal && (
                            <View style={[styles.chip, styles.goalChip]}>
                                <CustomText style={[styles.chipText, styles.goalChipText]}>{item.Goal}</CustomText>
                            </View>
                        )}
                    </View>
                    {!!item?.StartDate && (
                        <Row style={styles.dateRow}>
                            <Icon name="calendar" size={13} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                            <CustomText style={styles.dateText}>
                                {item?.DurationDays} Days • {new Date(item.StartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                {' - '}
                                {new Date(item.EndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </CustomText>
                        </Row>
                    )}
                    <SpaceBetweenRow style={styles.statsRow}>
                        <CustomText style={styles.statText}>
                            👁️ {item?.TotalViews || 0}   🖱️ {item?.TotalClicks || 0}   📈 {item?.TotalReach || 0}
                        </CustomText>
                        <CustomText style={styles.statText}>
                            ❤️ {post?.TotalLikes || 0}   💬 {post?.TotalComents || 0}
                        </CustomText>
                    </SpaceBetweenRow>
                    <SpaceBetweenRow style={styles.paymentRow}>
                        <CustomText
                            style={[
                                styles.statText,
                                { color: item?.PaymentStatus === 'Paid' ? '#16A34A' : '#EAB308', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
                            ]}
                        >
                            {item?.PaymentStatus}
                        </CustomText>
                        <CustomText style={styles.statText}>{item?.Currency}</CustomText>
                    </SpaceBetweenRow>
                </View>
            </TouchableOpacity>
            </GlowWrapper>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <SpaceBetweenRow style={styles.header}>
                <Row style={{ gap: 14 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={22} color={isDarkMode ? white : '#111'} />
                    </TouchableOpacity>
                    <CustomText style={styles.headerTitle}>My Promotions</CustomText>
                </Row>
                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddPostPromotion')}>
                    <Icon name="plus" size={20} color={white} />
                </TouchableOpacity>
            </SpaceBetweenRow>

            <FlatList
                data={promotions}
                keyExtractor={(item, index) => item?._id || String(index)}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyWrap}>
                            <View style={styles.emptyIconWrap}>
                                <Icon name="trending-up" size={30} color={white} />
                            </View>
                            <CustomText style={styles.emptyTitle}>No promotions found</CustomText>
                            <CustomText style={styles.emptySub}>You haven't promoted any posts yet.</CustomText>
                        </View>
                    )
                }
            />

            <ActionMenu
                visible={!!menuItem}
                onClose={() => setMenuItem(null)}
                title={menuItem?.Post?.caption || 'Promotion'}
                options={menuOptions}
            />
            <ConfirmDialog
                visible={!!confirmItem}
                onClose={() => setConfirmItem(null)}
                title="Delete Promotion"
                message="Are you sure you want to delete this promotion? This cannot be undone."
                onConfirm={() => deletePromotion(confirmItem)}
            />
            <EditPostPromotionModal
                visible={!!editItem}
                onClose={() => setEditItem(null)}
                promotion={editItem}
                onUpdated={fetchPromotions}
            />
        </View>
    );
};

export default MyPostPromotions;
