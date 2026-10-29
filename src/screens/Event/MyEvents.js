import React, { useCallback, useState, useMemo } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import SafeImage from '../../components/SafeImage';
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
import Row from '../../components/wrapper/row';
import { SpaceBetweenRow } from '../../components/wrapper/spacebetween';
import { ActionMenu, ConfirmDialog } from '../../components/ActionMenu';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { white } from '../../common/Colors/colors';
import { apiGet, apiDelete } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import urls from '../../config/urls';
import useThemeColor from '../../utils/useThemeColor';

// "My Events" — the user's own events (create/update/delete), matches web's
// Pages/Event/AllMyEvents.jsx (api/user/UserGetMyEvents, same 3-dot menu).
const MyEvents = ({ navigation }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const glowColors = useMemo(() => [primaryColor, primaryColor], [primaryColor]);
    const insets = useSafeAreaInsets();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [menuEvent, setMenuEvent] = useState(null);
    const [confirmEvent, setConfirmEvent] = useState(null);

    const fetchMyEvents = async () => {
        try {
            const res = await apiGet(urls.myEvents);
            setEvents(res?.data || []);
        } catch (error) {
            console.log('MyEvents fetch error', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMyEvents();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchMyEvents();
    };

    const deleteEvent = async (event) => {
        try {
            const res = await apiDelete(`${urls.deleteEvent}/${event?._id}`);
            ToastMsg(res?.message || 'Event deleted successfully');
            fetchMyEvents();
        } catch (error) {
            ToastMsg(error?.message || 'Failed to delete Event');
        }
    };

    const menuOptions = menuEvent
        ? [
              { label: 'Update Event', icon: 'edit-2', onPress: () => navigation.navigate('AddEvent', { event: menuEvent }) },
              { label: 'Delete Event', icon: 'trash-2', destructive: true, onPress: () => setConfirmEvent(menuEvent) },
          ]
        : [];

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#0B1220' : '#EEF1F6', paddingTop: insets.top },
        header: { paddingHorizontal: 20, paddingVertical: 14 },
        headerTitle: { fontSize: 22, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        addBtn: {
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: primaryColor, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14,
        },
        addBtnText: { color: white, fontFamily: FONTS_FAMILY.SourceSans3_Medium, fontSize: 13 },
        card: {
            marginHorizontal: 20, marginBottom: 16, borderRadius: 18, overflow: 'hidden',
            backgroundColor: isDarkMode ? '#1B2538' : '#F1F5F9',
            borderWidth: 1, borderColor: isDarkMode ? '#1E293B' : '#E2E8F0',
        },
        cardImageWrap: { position: 'relative' },
        cardImage: { width: '100%', height: 160 },
        costBadge: {
            position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.7)',
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
        },
        costBadgeText: { color: white, fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        ageBadge: {
            position: 'absolute', bottom: 10, left: 10, backgroundColor: primaryColor,
            paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20,
        },
        ageBadgeText: { color: white, fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
        menuBtn: {
            position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16,
            alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 5,
        },
        cardBody: { padding: 14 },
        eventName: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        eventGenre: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: primaryColor, marginTop: 2 },
        metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
        metaText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#94A3B8' : '#64748B', flexShrink: 1 },
        venueName: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: isDarkMode ? white : '#111' },
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
        emptyBtn: {
            marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: primaryColor, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16,
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
                <TouchableOpacity
                    style={styles.menuBtn}
                    onPress={() => setMenuEvent(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Icon name="more-vertical" size={18} color={white} />
                </TouchableOpacity>
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
                    <CustomText style={styles.headerTitle}>My Events</CustomText>
                </Row>
                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddEvent')}>
                    <Icon name="plus" size={16} color={white} />
                    <CustomText style={styles.addBtnText}>Add Event</CustomText>
                </TouchableOpacity>
            </SpaceBetweenRow>

            {loading && events.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <ActivityIndicator color={primaryColor} size="large" />
                </View>
            ) : (
            <FlatList
                data={events}
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
                            <CustomText style={styles.emptyTitle}>No events yet</CustomText>
                            <CustomText style={styles.emptySub}>
                                Create your first event to bring people together.
                            </CustomText>
                            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('AddEvent')}>
                                <Icon name="plus" size={16} color={white} />
                                <CustomText style={{ color: white, fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>
                                    Add New Event
                                </CustomText>
                            </TouchableOpacity>
                        </View>
                    )
                }
            />
            )}

            <ActionMenu
                visible={!!menuEvent}
                onClose={() => setMenuEvent(null)}
                title={menuEvent?.Name}
                options={menuOptions}
            />
            <ConfirmDialog
                visible={!!confirmEvent}
                onClose={() => setConfirmEvent(null)}
                title="Delete Event"
                message="Are you sure you want to delete this event? This cannot be undone."
                onConfirm={() => deleteEvent(confirmEvent)}
            />
        </View>
    );
};

export default MyEvents;
