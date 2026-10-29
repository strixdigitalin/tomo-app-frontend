import React, { useCallback, useMemo, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import SafeImage from '../../components/SafeImage';
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
import Row from '../../components/wrapper/row';
import { SpaceBetweenRow } from '../../components/wrapper/spacebetween';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { white } from '../../common/Colors/colors';
import { groupApiGet } from '../../utils/GroupApi';
import { ToastMsg } from '../../utils/helperFunctions';
import useThemeColor from '../../utils/useThemeColor';

// "My Groups" — matches web's Pages/Chat/Group/AllMyGroup.jsx. Group chat
// is not live on the production backend yet, so this whole module (list,
// create, detail, chat, invite, members) talks to the local dev backend via
// GroupApi.js instead of the shared Apis.js/urls.js used everywhere else.
const AllMyGroups = ({ navigation }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const glowColors = useMemo(() => [primaryColor, primaryColor], [primaryColor]);
    const insets = useSafeAreaInsets();

    const rawUser = useSelector(state => state?.user?.userData);
    const selector = useMemo(() => {
        if (rawUser && Object.keys(rawUser).length !== 0) {
            try { return JSON.parse(rawUser) } catch { return {} }
        }
        return {}
    }, [rawUser]);
    const currentUserId = selector?._id;

    const [myGroups, setMyGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchGroups = async () => {
        try {
            const res = await groupApiGet('/api/user/GetAllMyGroups');
            setMyGroups(res?.data || []);
        } catch (error) {
            console.log('AllMyGroups fetch error', error);
            ToastMsg(error?.message || 'Could not load groups. Check your connection.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchGroups();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchGroups();
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#0B1220' : '#EEF1F6', paddingTop: insets.top },
        header: { paddingHorizontal: 20, paddingVertical: 14 },
        headerTitle: { fontSize: 22, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        headerBtns: { flexDirection: 'row', gap: 10 },
        iconBtn: {
            width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
            backgroundColor: primaryColor,
        },
        joinBtn: {
            width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
            borderWidth: 1.5, borderColor: primaryColor,
        },
        card: {
            flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18,
            backgroundColor: isDarkMode ? '#1B2538' : '#F1F5F9',
            borderWidth: 1, borderColor: isDarkMode ? '#1E293B' : '#E2E8F0',
        },
        avatar: { width: 56, height: 56, borderRadius: 28 },
        groupName: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        adminBadge: {
            paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: primaryColor, marginLeft: 8,
        },
        adminBadgeText: { fontSize: 10, color: white, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
        metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
        metaText: { fontSize: 12, color: isDarkMode ? '#94A3B8' : '#64748B', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
        chip: {
            paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
            backgroundColor: isDarkMode ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
        },
        chipText: { fontSize: 10, color: '#6366F1', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
        paidChip: { backgroundColor: isDarkMode ? 'rgba(234,179,8,0.15)' : 'rgba(234,179,8,0.12)' },
        paidChipText: { color: '#CA8A04' },
        emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, paddingHorizontal: 30 },
        emptyIconWrap: {
            width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center',
            backgroundColor: primaryColor, marginBottom: 16,
        },
        emptyTitle: { fontSize: 17, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        emptySub: {
            fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#94A3B8' : '#64748B', textAlign: 'center', marginTop: 6,
        },
    });

    const renderGroup = ({ item }) => {
        const g = item?.Group || {};
        return (
            <GlowWrapper
                isDarkMode={isDarkMode}
                borderRadius={18}
                showStars={false}
                showShinePatches
                intensity="low"
                containerStyle={{ marginHorizontal: 20, marginBottom: 14 }}
                glowColors={glowColors}
            >
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.card}
                    onPress={() => navigation.navigate('GroupDetail', { groupId: g?._id })}
                >
                    <SafeImage uri={g?.Avatar} style={styles.avatar} />
                    <View style={{ flex: 1 }}>
                        <Row style={{ alignItems: 'center' }}>
                            <CustomText numberOfLines={1} style={styles.groupName}>{g?.Name}</CustomText>
                            {item?.Role === 'admin' && (
                                <View style={styles.adminBadge}>
                                    <CustomText style={styles.adminBadgeText}>Admin</CustomText>
                                </View>
                            )}
                        </Row>
                        <View style={styles.metaRow}>
                            <Icon name="users" size={12} color={isDarkMode ? '#94A3B8' : '#64748B'} />
                            <CustomText style={styles.metaText}>{g?.MembersCount ?? 0} members</CustomText>
                            <View style={styles.chip}>
                                <CustomText style={styles.chipText}>{g?.Type}</CustomText>
                            </View>
                            {!!g?.IsPaid && (
                                <View style={[styles.chip, styles.paidChip]}>
                                    <CustomText style={[styles.chipText, styles.paidChipText]}>
                                        {g?.Currency === 'INR' ? '₹' : g?.Currency}{g?.Price}/{g?.BillingCycle === 'yearly' ? 'yr' : 'mo'}
                                    </CustomText>
                                </View>
                            )}
                        </View>
                    </View>
                    <Icon name="chevron-right" size={18} color={isDarkMode ? '#6B7280' : '#9CA3AF'} />
                </TouchableOpacity>
            </GlowWrapper>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <SpaceBetweenRow style={styles.header}>
                <Row style={{ gap: 12 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={22} color={isDarkMode ? white : '#111'} />
                    </TouchableOpacity>
                    <CustomText style={styles.headerTitle}>Groups</CustomText>
                </Row>
                <View style={styles.headerBtns}>
                    <TouchableOpacity style={styles.joinBtn} onPress={() => navigation.navigate('JoinGroup')}>
                        <Icon name="log-in" size={17} color={primaryColor} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('AddGroup')}>
                        <Icon name="plus" size={20} color={white} />
                    </TouchableOpacity>
                </View>
            </SpaceBetweenRow>

            {loading ? (
                <View style={styles.emptyWrap}>
                    <ActivityIndicator color={primaryColor} size="large" />
                </View>
            ) : (
                <FlatList
                    data={myGroups}
                    keyExtractor={(item, index) => item?._id || String(index)}
                    renderItem={renderGroup}
                    contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyWrap}>
                            <View style={styles.emptyIconWrap}>
                                <Icon name="users" size={30} color={white} />
                            </View>
                            <CustomText style={styles.emptyTitle}>No groups yet</CustomText>
                            <CustomText style={styles.emptySub}>
                                Create a group or join one using an invite code.
                            </CustomText>
                        </View>
                    }
                />
            )}
        </View>
    );
};

export default AllMyGroups;
