import React, { useCallback, useMemo, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import SafeImage from '../../components/SafeImage';
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
import Row from '../../components/wrapper/row';
import { SpaceBetweenRow } from '../../components/wrapper/spacebetween';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { white } from '../../common/Colors/colors';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import useThemeColor from '../../utils/useThemeColor';

// "All Events" — public event feed, matches web's Pages/Event/AllEvents.jsx
// (same api/user/AllUserGetAllEvents endpoint, same card fields).
const AllEvents = ({ navigation }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const glowColors = useMemo(() => [primaryColor, primaryColor], [primaryColor]);
    const insets = useSafeAreaInsets();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');

    const fetchEvents = async () => {
        try {
            const res = await apiGet(urls.allEvents);
            setEvents(res?.data || []);
        } catch (error) {
            console.log('AllEvents fetch error', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchEvents();
    };

    const filteredEvents = useMemo(() => {
        if (!search.trim()) return events;
        const q = search.trim().toLowerCase();
        return events.filter((e) =>
            e?.Name?.toLowerCase().includes(q) ||
            e?.Genre?.toLowerCase().includes(q) ||
            e?.City?.toLowerCase().includes(q)
        );
    }, [events, search]);

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#fff', paddingTop: insets.top },
        header: { paddingHorizontal: 20, paddingVertical: 14 },
        headerTitle: { fontSize: 22, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        myEventsBtn: {
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: primaryColor, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14,
        },
        myEventsBtnText: { color: white, fontFamily: FONTS_FAMILY.SourceSans3_Medium, fontSize: 13 },
        searchWrap: { paddingHorizontal: 20, marginBottom: 10 },
        searchInput: {
            borderWidth: 1, borderColor: isDarkMode ? '#2A2A2A' : '#E5E7EB', borderRadius: 14,
            paddingHorizontal: 16, paddingVertical: 11, fontSize: 14,
            color: isDarkMode ? white : '#111', fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FAFAFA',
        },
        card: {
            marginHorizontal: 20, marginBottom: 16, borderRadius: 18, overflow: 'hidden',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F7F7F7',
            borderWidth: 1, borderColor: isDarkMode ? '#2A2A2A' : '#EFEFEF',
        },
        cardImageWrap: { position: 'relative' },
        cardImage: { width: '100%', height: 160 },
        costBadge: {
            position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.7)',
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
        },
        costBadgeText: { color: white, fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        ageBadge: {
            position: 'absolute', top: 10, left: 10, backgroundColor: primaryColor,
            paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20,
        },
        ageBadgeText: { color: white, fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
        cardBody: { padding: 14 },
        eventName: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        eventGenre: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: primaryColor, marginTop: 2 },
        metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
        metaText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#9CA3AF' : '#6B7280', flexShrink: 1 },
        venueName: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: isDarkMode ? white : '#111' },
        footer: {
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: isDarkMode ? '#2A2A2A' : '#EEE',
        },
        organizerLabel: { fontSize: 11, color: isDarkMode ? '#9CA3AF' : '#6B7280', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
        organizerName: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
        promoChip: {
            paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
            backgroundColor: isDarkMode ? 'rgba(236,72,153,0.15)' : 'rgba(236,72,153,0.1)',
        },
        promoChipText: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: '#EC4899' },
        emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, paddingHorizontal: 30 },
        emptyIconWrap: {
            width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center',
            backgroundColor: primaryColor, marginBottom: 16,
        },
        emptyTitle: { fontSize: 17, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        emptySub: {
            fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#9CA3AF' : '#6B7280', textAlign: 'center', marginTop: 6,
        },
    });

    const renderEvent = ({ item }) => (
        <GlowWrapper
            isDarkMode={isDarkMode}
            borderRadius={18}
            showStars={false}
            showShinePatches
            intensity="low"
            containerStyle={{ marginHorizontal: 20, marginBottom: 16 }}
            glowColors={glowColors}
        >
            <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.card, { marginHorizontal: 0, marginBottom: 0 }]}
                onPress={() => navigation.navigate('EventDetail', { eventId: item?._id })}
            >
                <View style={styles.cardImageWrap}>
                    <SafeImage uri={item?.Image} style={styles.cardImage} />
                    {!!item?.Cost && (
                        <View style={styles.costBadge}>
                            <CustomText style={styles.costBadgeText}>₹{item.Cost}</CustomText>
                        </View>
                    )}
                    {!!item?.MinAge && (
                        <View style={styles.ageBadge}>
                            <CustomText style={styles.ageBadgeText}>{item.MinAge}+</CustomText>
                        </View>
                    )}
                </View>
                <View style={styles.cardBody}>
                    <CustomText numberOfLines={1} style={styles.eventName}>{item?.Name}</CustomText>
                    {!!item?.Genre && <CustomText style={styles.eventGenre}>{item.Genre}</CustomText>}

                    <View style={styles.metaRow}>
                        <CustomText>📅</CustomText>
                        <CustomText numberOfLines={1} style={styles.metaText}>
                            {item?.Date} • {item?.TimeFrom} - {item?.TimeTo}
                        </CustomText>
                    </View>

                    <View style={styles.metaRow}>
                        <CustomText>📍</CustomText>
                        <View style={{ flex: 1 }}>
                            <CustomText numberOfLines={1} style={styles.venueName}>{item?.VenuePlace}</CustomText>
                            <CustomText numberOfLines={1} style={styles.metaText}>
                                {item?.VenueAddress}, {item?.City}
                            </CustomText>
                        </View>
                    </View>

                    {!!item?.Promoter && (
                        <View style={styles.metaRow}>
                            <CustomText>🎤</CustomText>
                            <CustomText numberOfLines={1} style={styles.metaText}>Promoter: {item.Promoter}</CustomText>
                        </View>
                    )}

                    {(item?.User || item?.Promotionallinks) && (
                        <View style={styles.footer}>
                            {item?.User ? (
                                <View>
                                    <CustomText style={styles.organizerLabel}>Organized by</CustomText>
                                    <CustomText style={styles.organizerName}>
                                        {item.User.FullName || item.User.UserName}
                                    </CustomText>
                                </View>
                            ) : <View />}
                            {!!item?.Promotionallinks && (
                                <View style={styles.promoChip}>
                                    <CustomText style={styles.promoChipText}>Promo</CustomText>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </GlowWrapper>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <SpaceBetweenRow style={styles.header}>
                <Row style={{ gap: 12 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Icon name="arrow-left" size={22} color={isDarkMode ? white : '#111'} />
                    </TouchableOpacity>
                    <CustomText style={styles.headerTitle}>Events</CustomText>
                </Row>
                <TouchableOpacity style={styles.myEventsBtn} onPress={() => navigation.navigate('MyEvents')}>
                    <Icon name="calendar" size={16} color={white} />
                    <CustomText style={styles.myEventsBtnText}>My Events</CustomText>
                </TouchableOpacity>
            </SpaceBetweenRow>

            <View style={styles.searchWrap}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search events..."
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {loading && events.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <ActivityIndicator color={primaryColor} size="large" />
                </View>
            ) : (
            <FlatList
                data={filteredEvents}
                keyExtractor={(item, index) => item?._id || String(index)}
                renderItem={renderEvent}
                contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyWrap}>
                            <View style={styles.emptyIconWrap}>
                                <Icon name="calendar" size={30} color={white} />
                            </View>
                            <CustomText style={styles.emptyTitle}>
                                {search ? 'No matching events' : 'No events found'}
                            </CustomText>
                            <CustomText style={styles.emptySub}>
                                {search
                                    ? `No events found matching "${search}"`
                                    : 'There are no events available at the moment.'}
                            </CustomText>
                        </View>
                    )
                }
            />
            )}
        </View>
    );
};

export default AllEvents;
