import React, { useCallback, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import SafeImage from '../../components/SafeImage';
import Row from '../../components/wrapper/row';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import { white } from '../../common/Colors/colors';
import useThemeColor from '../../utils/useThemeColor';

const STATUS_COLORS = {
    Approved: { bg: '#16A34A', text: white },
    Pending: { bg: '#EAB308', text: white },
    Rejected: { bg: '#EF4136', text: white },
};

const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

// Matches web's Pages/PaidPromotion/PostPromostionDetail.jsx — same endpoint,
// same fields (performance stats, post engagement, payment, admin remark).
const PostPromotionDetail = ({ navigation, route }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const insets = useSafeAreaInsets();
    const id = route?.params?.id;
    const isShop = route?.params?.mode === 'shop';

    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const res = await apiGet(`${isShop ? urls.shopPromotionDetail : urls.postPromotionDetail}/${id}`);
            setPromotion(res?.data || null);
        } catch (error) {
            console.log('PostPromotionDetail fetch error', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDetail();
        }, [id])
    );

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#0B1220' : '#EEF1F6', paddingTop: insets.top },
        header: { paddingHorizontal: 20, paddingVertical: 14 },
        headerTitle: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginLeft: 14 },
        body: { paddingBottom: 60 },
        imageWrap: { position: 'relative' },
        image: { width: '100%', height: 260 },
        statusBadge: { position: 'absolute', top: 16, left: 16, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
        statusText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
        runningBadge: {
            position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.7)',
            paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6,
        },
        runningDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ADE80' },
        runningText: { color: white, fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
        content: { padding: 20 },
        caption: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        hashtagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
        hashtag: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: primaryColor },
        infoRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
        infoCard: {
            flex: 1, flexDirection: 'row', gap: 10, padding: 14, borderRadius: 14,
            backgroundColor: isDarkMode ? '#1B2538' : '#F1F5F9',
        },
        infoIconWrap: {
            width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
            backgroundColor: isDarkMode ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
        },
        infoLabel: { fontSize: 11, color: isDarkMode ? '#94A3B8' : '#64748B', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
        infoValue: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, marginTop: 2 },
        infoSub: { fontSize: 12, color: isDarkMode ? '#94A3B8' : '#64748B', fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginTop: 2 },
        sectionTitle: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginTop: 24, marginBottom: 12 },
        statsRow: { flexDirection: 'row', gap: 12 },
        statBox: { flex: 1, alignItems: 'center', padding: 14, borderRadius: 14, backgroundColor: isDarkMode ? '#1B2538' : '#F1F5F9' },
        statValue: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginTop: 6 },
        statLabel: { fontSize: 11, color: isDarkMode ? '#94A3B8' : '#64748B', marginTop: 2 },
        remarkBox: { padding: 14, borderRadius: 14, backgroundColor: isDarkMode ? '#1B2538' : '#F1F5F9', marginTop: 12 },
        remarkText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#D1D5DB' : '#374151', lineHeight: 20 },
        footerRow: {
            flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, paddingTop: 16,
            borderTopWidth: 1, borderTopColor: isDarkMode ? '#1E293B' : '#E2E8F0',
        },
        footerText: { fontSize: 11, color: isDarkMode ? '#6B7280' : '#9CA3AF', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
        centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    });

    const renderHeader = () => (
        <Row style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={22} color={isDarkMode ? white : '#111'} />
            </TouchableOpacity>
            <CustomText style={styles.headerTitle}>Promotion Details</CustomText>
        </Row>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
                {renderHeader()}
                <View style={styles.centerWrap}>
                    <ActivityIndicator color={primaryColor} size="large" />
                </View>
            </View>
        );
    }

    if (!promotion) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
                {renderHeader()}
                <View style={styles.centerWrap}>
                    <CustomText style={{ color: isDarkMode ? '#94A3B8' : '#64748B' }}>Promotion not found</CustomText>
                </View>
            </View>
        );
    }

    const post = (isShop ? promotion?.SellerShop : promotion?.Post) || {};
    const statusStyle = STATUS_COLORS[promotion?.Status] || STATUS_COLORS.Pending;

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            {renderHeader()}
            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                <View style={styles.imageWrap}>
                    <SafeImage uri={isShop ? post?.Image : post?.media} style={styles.image} />
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <CustomText style={[styles.statusText, { color: statusStyle.text }]}>{promotion?.Status}</CustomText>
                    </View>
                    {!!promotion?.IsRunning && (
                        <View style={styles.runningBadge}>
                            <View style={styles.runningDot} />
                            <CustomText style={styles.runningText}>Running</CustomText>
                        </View>
                    )}
                </View>

                <View style={styles.content}>
                    <CustomText style={styles.caption}>{isShop ? (post?.Name || 'Shop') : (post?.caption || 'Untitled Post')}</CustomText>
                    {Array.isArray(post?.Hashtags) && post.Hashtags.length > 0 && (
                        <View style={styles.hashtagRow}>
                            {post.Hashtags.map((tag, i) => (
                                <CustomText key={i} style={styles.hashtag}>#{tag}</CustomText>
                            ))}
                        </View>
                    )}

                    <View style={styles.infoRow}>
                        <View style={styles.infoCard}>
                            <View style={styles.infoIconWrap}>
                                <Icon name="tag" size={18} color="#6366F1" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomText style={styles.infoLabel}>Promotion Type</CustomText>
                                <CustomText style={styles.infoValue}>{promotion?.PromotionType || '—'}</CustomText>
                            </View>
                        </View>
                        <View style={styles.infoCard}>
                            <View style={[styles.infoIconWrap, { backgroundColor: isDarkMode ? 'rgba(147,51,234,0.15)' : 'rgba(147,51,234,0.1)' }]}>
                                <Icon name="target" size={18} color="#9333EA" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomText style={styles.infoLabel}>Goal</CustomText>
                                <CustomText style={styles.infoValue}>{promotion?.Goal || '—'}</CustomText>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoCard}>
                            <View style={[styles.infoIconWrap, { backgroundColor: isDarkMode ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)' }]}>
                                <Icon name="calendar" size={18} color="#3B82F6" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomText style={styles.infoLabel}>Duration</CustomText>
                                <CustomText numberOfLines={1} style={styles.infoValue}>
                                    {formatDate(promotion?.StartDate)} – {formatDate(promotion?.EndDate)}
                                </CustomText>
                                <CustomText style={styles.infoSub}>{promotion?.DurationDays} days</CustomText>
                            </View>
                        </View>
                        <View style={styles.infoCard}>
                            <View style={[styles.infoIconWrap, { backgroundColor: isDarkMode ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)' }]}>
                                <Icon name="credit-card" size={18} color="#22C55E" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomText style={styles.infoLabel}>Payment</CustomText>
                                <CustomText style={styles.infoValue}>
                                    {promotion?.Currency === 'INR' ? '₹' : promotion?.Currency}{promotion?.Price}
                                </CustomText>
                                <CustomText style={styles.infoSub}>{promotion?.PaymentStatus}</CustomText>
                            </View>
                        </View>
                    </View>

                    <CustomText style={styles.sectionTitle}>Performance</CustomText>
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Icon name="eye" size={18} color={isDarkMode ? '#94A3B8' : '#64748B'} />
                            <CustomText style={styles.statValue}>{promotion?.TotalViews ?? 0}</CustomText>
                            <CustomText style={styles.statLabel}>Views</CustomText>
                        </View>
                        <View style={styles.statBox}>
                            <Icon name="mouse-pointer" size={18} color={isDarkMode ? '#94A3B8' : '#64748B'} />
                            <CustomText style={styles.statValue}>{promotion?.TotalClicks ?? 0}</CustomText>
                            <CustomText style={styles.statLabel}>Clicks</CustomText>
                        </View>
                        <View style={styles.statBox}>
                            <Icon name="users" size={18} color={isDarkMode ? '#94A3B8' : '#64748B'} />
                            <CustomText style={styles.statValue}>{promotion?.TotalReach ?? 0}</CustomText>
                            <CustomText style={styles.statLabel}>Reach</CustomText>
                        </View>
                    </View>

                    {!isShop && (
                        <>
                    <CustomText style={styles.sectionTitle}>Post Engagement</CustomText>
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Icon name="heart" size={18} color="#EC4899" />
                            <CustomText style={styles.statValue}>{post?.TotalLikes ?? 0}</CustomText>
                            <CustomText style={styles.statLabel}>Likes</CustomText>
                        </View>
                        <View style={styles.statBox}>
                            <Icon name="thumbs-down" size={18} color={isDarkMode ? '#94A3B8' : '#64748B'} />
                            <CustomText style={styles.statValue}>{post?.TotalUnLikes ?? 0}</CustomText>
                            <CustomText style={styles.statLabel}>Unlikes</CustomText>
                        </View>
                        <View style={styles.statBox}>
                            <Icon name="message-circle" size={18} color="#60A5FA" />
                            <CustomText style={styles.statValue}>{post?.TotalComents ?? 0}</CustomText>
                            <CustomText style={styles.statLabel}>Comments</CustomText>
                        </View>
                    </View>

                        </>
                    )}

                    {!!promotion?.AdminRemark && (
                        <>
                            <CustomText style={styles.sectionTitle}>Admin Remark</CustomText>
                            <View style={styles.remarkBox}>
                                <CustomText style={styles.remarkText}>{promotion.AdminRemark}</CustomText>
                            </View>
                        </>
                    )}

                    <View style={styles.footerRow}>
                        <CustomText style={styles.footerText}>Created on {formatDate(promotion?.createdAt)}</CustomText>
                        {!!promotion?.ApprovedAt && (
                            <CustomText style={styles.footerText}>Approved on {formatDate(promotion?.ApprovedAt)}</CustomText>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default PostPromotionDetail;
