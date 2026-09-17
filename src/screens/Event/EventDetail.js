import React, { useCallback, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Linking,
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

// Event Detail — matches web's Pages/Event/EventDetail.jsx
// (same api/user/GetEventDetail/:id endpoint, same fields).
const EventDetail = ({ navigation, route }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const insets = useSafeAreaInsets();
    const eventId = route?.params?.eventId;

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const res = await apiGet(`${urls.eventDetail}/${eventId}`);
            setEvent(res?.data || null);
        } catch (error) {
            console.log('EventDetail fetch error', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchEvent();
        }, [eventId])
    );

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#fff', paddingTop: insets.top },
        header: { paddingHorizontal: 20, paddingVertical: 14 },
        headerTitle: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginLeft: 14 },
        body: { paddingBottom: 60 },
        imageWrap: { position: 'relative' },
        image: { width: '100%', height: 260 },
        costBadge: {
            position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.7)',
            paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
        },
        costBadgeText: { color: white, fontSize: 17, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        ageBadge: {
            position: 'absolute', top: 16, left: 16, backgroundColor: primaryColor,
            paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
        },
        ageBadgeText: { color: white, fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
        content: { padding: 20 },
        name: { fontSize: 24, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        genre: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: primaryColor, marginTop: 4 },
        infoRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
        infoCard: {
            flex: 1, flexDirection: 'row', gap: 10, padding: 14, borderRadius: 14,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F7F7F7',
        },
        infoIconWrap: {
            width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
            backgroundColor: isDarkMode ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
        },
        infoLabel: { fontSize: 11, color: isDarkMode ? '#9CA3AF' : '#6B7280', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
        infoValue: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, marginTop: 2 },
        infoSub: { fontSize: 12, color: isDarkMode ? '#9CA3AF' : '#6B7280', fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginTop: 2 },
        promoterRow: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            padding: 14, borderRadius: 14, backgroundColor: isDarkMode ? '#1E1E1E' : '#F7F7F7', marginTop: 16,
        },
        promoterLabel: { fontSize: 11, color: isDarkMode ? '#9CA3AF' : '#6B7280', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
        promoterName: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, marginTop: 2 },
        promoBtn: {
            flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9,
            borderRadius: 20, backgroundColor: isDarkMode ? 'rgba(236,72,153,0.15)' : 'rgba(236,72,153,0.1)',
        },
        promoBtnText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: '#EC4899' },
        sectionTitle: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginTop: 20, marginBottom: 8 },
        detailText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#D1D5DB' : '#374151', lineHeight: 21 },
        organizerRow: {
            flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20, paddingTop: 20,
            borderTopWidth: 1, borderTopColor: isDarkMode ? '#2A2A2A' : '#EEE',
        },
        organizerIconWrap: {
            width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center',
            backgroundColor: isDarkMode ? '#2A2A2A' : '#F3F4F6',
        },
        organizerLabel: { fontSize: 11, color: isDarkMode ? '#9CA3AF' : '#6B7280', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
        organizerName: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
        organizerUsername: { fontSize: 12, color: isDarkMode ? '#9CA3AF' : '#6B7280', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
        createdAt: { fontSize: 11, color: isDarkMode ? '#6B7280' : '#9CA3AF', fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginTop: 16 },
        notFoundWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
        notFoundText: { fontSize: 15, color: isDarkMode ? '#9CA3AF' : '#6B7280', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
    });

    const renderHeader = () => (
        <Row style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={22} color={isDarkMode ? white : '#111'} />
            </TouchableOpacity>
            <CustomText style={styles.headerTitle}>Event Details</CustomText>
        </Row>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
                {renderHeader()}
                <View style={styles.notFoundWrap}>
                    <ActivityIndicator color={primaryColor} size="large" />
                </View>
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
                {renderHeader()}
                <View style={styles.notFoundWrap}>
                    <CustomText style={styles.notFoundText}>Event not found</CustomText>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            {renderHeader()}
            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                <View style={styles.imageWrap}>
                    <SafeImage uri={event?.Image} style={styles.image} />
                    {!!event?.Cost && (
                        <View style={styles.costBadge}>
                            <CustomText style={styles.costBadgeText}>₹{event.Cost}</CustomText>
                        </View>
                    )}
                    {!!event?.MinAge && (
                        <View style={styles.ageBadge}>
                            <CustomText style={styles.ageBadgeText}>{event.MinAge}+</CustomText>
                        </View>
                    )}
                </View>

                <View style={styles.content}>
                    <CustomText style={styles.name}>{event?.Name}</CustomText>
                    {!!event?.Genre && <CustomText style={styles.genre}>{event.Genre}</CustomText>}

                    <View style={styles.infoRow}>
                        <View style={styles.infoCard}>
                            <View style={styles.infoIconWrap}>
                                <Icon name="calendar" size={18} color="#6366F1" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomText style={styles.infoLabel}>Date & Time</CustomText>
                                <CustomText style={styles.infoValue}>{event?.Date}</CustomText>
                                <CustomText style={styles.infoSub}>{event?.TimeFrom} – {event?.TimeTo}</CustomText>
                            </View>
                        </View>
                        <View style={styles.infoCard}>
                            <View style={[styles.infoIconWrap, { backgroundColor: isDarkMode ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)' }]}>
                                <Icon name="map-pin" size={18} color="#22C55E" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomText style={styles.infoLabel}>Venue</CustomText>
                                <CustomText numberOfLines={1} style={styles.infoValue}>{event?.VenuePlace}</CustomText>
                                <CustomText numberOfLines={2} style={styles.infoSub}>{event?.VenueAddress}, {event?.City}</CustomText>
                            </View>
                        </View>
                    </View>

                    <View style={styles.promoterRow}>
                        <View>
                            <CustomText style={styles.promoterLabel}>Promoter</CustomText>
                            <CustomText style={styles.promoterName}>{event?.Promoter || '—'}</CustomText>
                        </View>
                        {!!event?.Promotionallinks && (
                            <TouchableOpacity
                                style={styles.promoBtn}
                                onPress={() => Linking.openURL(event.Promotionallinks).catch((err) => console.log('EventDetail link error', err))}
                            >
                                <Icon name="external-link" size={13} color="#EC4899" />
                                <CustomText style={styles.promoBtnText}>Promotional Link</CustomText>
                            </TouchableOpacity>
                        )}
                    </View>

                    {!!event?.EventDetail && (
                        <>
                            <CustomText style={styles.sectionTitle}>About the Event</CustomText>
                            <CustomText style={styles.detailText}>{event.EventDetail}</CustomText>
                        </>
                    )}

                    {!!event?.User && (
                        <View style={styles.organizerRow}>
                            <View style={styles.organizerIconWrap}>
                                <Icon name="user" size={20} color={isDarkMode ? '#D1D5DB' : '#374151'} />
                            </View>
                            <View>
                                <CustomText style={styles.organizerLabel}>Organized by</CustomText>
                                <CustomText style={styles.organizerName}>
                                    {event.User.FullName || event.User.UserName}
                                </CustomText>
                                {!!(event.User.UserName && event.User.FullName) && (
                                    <CustomText style={styles.organizerUsername}>@{event.User.UserName}</CustomText>
                                )}
                            </View>
                        </View>
                    )}

                    {!!event?.createdAt && (
                        <CustomText style={styles.createdAt}>
                            Created on {new Date(event.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </CustomText>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default EventDetail;
