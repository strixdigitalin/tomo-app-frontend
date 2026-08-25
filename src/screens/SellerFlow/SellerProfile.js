import React, { useCallback, useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Alert,
    Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import Row from '../../components/wrapper/row';
import { SpaceBetweenRow } from '../../components/wrapper/spacebetween';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { App_Primary_color, white } from '../../common/Colors/colors';
import { apiGet, apiPut, removeItem } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import urls from '../../config/urls';
import { removeUser } from '../../redux/reducer/user';
import IMG from '../../assets/Images';

const SellerProfile = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [privacy, setPrivacy] = useState({ ShowEmail: false, ShowMobile: false, ShowAddress: false });
    const [savingKey, setSavingKey] = useState(null);

    const fetchProfile = async () => {
        try {
            const res = await apiGet(urls.sellerProfile);
            setSeller(res?.data || null);
            setPrivacy({
                ShowEmail: !!res?.data?.ShowEmail,
                ShowMobile: !!res?.data?.ShowMobile,
                ShowAddress: !!res?.data?.ShowAddress,
            });
        } catch (error) {
            console.log('SellerProfile fetch error', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    const togglePrivacy = async (key) => {
        const updated = { ...privacy, [key]: !privacy[key] };
        setPrivacy(updated);
        setSavingKey(key);
        try {
            await apiPut(urls.sellerToggleShowData, updated);
        } catch (error) {
            // revert on failure
            setPrivacy(privacy);
            ToastMsg(error?.message || 'Failed to update setting');
        } finally {
            setSavingKey(null);
        }
    };

    const onLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await removeItem('token');
                    await removeItem('accountType');
                    dispatch(removeUser());
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                },
            },
        ]);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#121212' : '#fff',
            paddingTop: insets.top,
        },
        header: { paddingHorizontal: 20, paddingVertical: 14 },
        headerTitle: { fontSize: 22, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        profileCard: {
            marginHorizontal: 20,
            marginTop: 6,
            padding: 18,
            borderRadius: 20,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F7F7F7',
            alignItems: 'center',
        },
        avatar: { width: 84, height: 84, borderRadius: 42, marginBottom: 12 },
        storeName: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        fullName: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            marginTop: 2,
        },
        infoRow: {
            marginHorizontal: 20,
            marginTop: 16,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 16,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F7F7F7',
        },
        infoLabel: {
            fontSize: 12,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
        },
        infoValue: {
            fontSize: 15,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            marginTop: 4,
        },
        infoValueHidden: {
            fontSize: 15,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            marginTop: 4,
            fontStyle: 'italic',
            color: isDarkMode ? '#6B7280' : '#9CA3AF',
        },
        sectionTitle: {
            fontSize: 12,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            marginHorizontal: 20,
            marginTop: 22,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        privacyGroup: {
            marginHorizontal: 20,
            borderRadius: 16,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F7F7F7',
            overflow: 'hidden',
        },
        privacyRow: {
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? '#2A2A2A' : '#EDEDED',
        },
        privacyLabel: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
        },
        privacySub: {
            fontSize: 12,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            marginTop: 2,
        },
        actionRow: {
            marginHorizontal: 20,
            marginTop: 14,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 16,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F7F7F7',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        actionLabel: {
            fontSize: 15,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
        },
        logoutBtn: {
            marginHorizontal: 20,
            marginTop: 24,
            marginBottom: 40,
            paddingVertical: 14,
            borderRadius: 16,
            alignItems: 'center',
            backgroundColor: '#EF4136',
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <View style={styles.header}>
                <CustomText style={styles.headerTitle}>Profile</CustomText>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.profileCard}>
                    <Image
                        source={seller?.Image ? { uri: seller.Image } : IMG.ProfileImagePost}
                        style={styles.avatar}
                    />
                    <CustomText style={styles.storeName}>{seller?.StoreName || 'My Store'}</CustomText>
                    <CustomText style={styles.fullName}>{seller?.FullName}</CustomText>
                </View>

                <View style={styles.infoRow}>
                    <SpaceBetweenRow>
                        <CustomText style={styles.infoLabel}>Email</CustomText>
                        <Icon
                            name={privacy.ShowEmail ? 'eye' : 'eye-off'}
                            size={13}
                            color={isDarkMode ? '#9CA3AF' : '#6B7280'}
                        />
                    </SpaceBetweenRow>
                    <CustomText style={privacy.ShowEmail ? styles.infoValue : styles.infoValueHidden}>
                        {privacy.ShowEmail ? (seller?.Email || '-') : 'Hidden from others'}
                    </CustomText>
                </View>
                <View style={styles.infoRow}>
                    <SpaceBetweenRow>
                        <CustomText style={styles.infoLabel}>Mobile Number</CustomText>
                        <Icon
                            name={privacy.ShowMobile ? 'eye' : 'eye-off'}
                            size={13}
                            color={isDarkMode ? '#9CA3AF' : '#6B7280'}
                        />
                    </SpaceBetweenRow>
                    <CustomText style={privacy.ShowMobile ? styles.infoValue : styles.infoValueHidden}>
                        {privacy.ShowMobile ? (seller?.MobileNumber || '-') : 'Hidden from others'}
                    </CustomText>
                </View>
                <View style={styles.infoRow}>
                    <CustomText style={styles.infoLabel}>Username</CustomText>
                    <CustomText style={styles.infoValue}>{seller?.UserName || '-'}</CustomText>
                </View>

                <CustomText style={styles.sectionTitle}>Privacy</CustomText>
                <View style={styles.privacyGroup}>
                    <View style={styles.privacyRow}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                            <CustomText style={styles.privacyLabel}>Show Email</CustomText>
                            <CustomText style={styles.privacySub}>Allow others to see your email</CustomText>
                        </View>
                        <Switch
                            value={privacy.ShowEmail}
                            onValueChange={() => togglePrivacy('ShowEmail')}
                            disabled={savingKey === 'ShowEmail'}
                            trackColor={{ false: isDarkMode ? '#3A3A3A' : '#D1D5DB', true: App_Primary_color }}
                            thumbColor={white}
                            ios_backgroundColor={isDarkMode ? '#3A3A3A' : '#D1D5DB'}
                        />
                    </View>
                    <View style={styles.privacyRow}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                            <CustomText style={styles.privacyLabel}>Show Mobile</CustomText>
                            <CustomText style={styles.privacySub}>Let people see your mobile number</CustomText>
                        </View>
                        <Switch
                            value={privacy.ShowMobile}
                            onValueChange={() => togglePrivacy('ShowMobile')}
                            disabled={savingKey === 'ShowMobile'}
                            trackColor={{ false: isDarkMode ? '#3A3A3A' : '#D1D5DB', true: App_Primary_color }}
                            thumbColor={white}
                            ios_backgroundColor={isDarkMode ? '#3A3A3A' : '#D1D5DB'}
                        />
                    </View>
                    <View style={[styles.privacyRow, { borderBottomWidth: 0 }]}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                            <CustomText style={styles.privacyLabel}>Show Address</CustomText>
                            <CustomText style={styles.privacySub}>Let people see your shop address</CustomText>
                        </View>
                        <Switch
                            value={privacy.ShowAddress}
                            onValueChange={() => togglePrivacy('ShowAddress')}
                            disabled={savingKey === 'ShowAddress'}
                            trackColor={{ false: isDarkMode ? '#3A3A3A' : '#D1D5DB', true: App_Primary_color }}
                            thumbColor={white}
                            ios_backgroundColor={isDarkMode ? '#3A3A3A' : '#D1D5DB'}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('SellerHome')}>
                    <Row style={{ gap: 12 }}>
                        <Icon name="shopping-bag" size={18} color={App_Primary_color} />
                        <CustomText style={styles.actionLabel}>My Shops</CustomText>
                    </Row>
                    <Icon name="chevron-right" size={18} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('SellerProduct')}>
                    <Row style={{ gap: 12 }}>
                        <Icon name="package" size={18} color={App_Primary_color} />
                        <CustomText style={styles.actionLabel}>My Products</CustomText>
                    </Row>
                    <Icon name="chevron-right" size={18} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('ThemeSettings')}>
                    <Row style={{ gap: 12 }}>
                        <Icon name="sliders" size={18} color={App_Primary_color} />
                        <CustomText style={styles.actionLabel}>Theme Settings</CustomText>
                    </Row>
                    <Icon name="chevron-right" size={18} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                    <CustomText style={{ color: white, fontFamily: FONTS_FAMILY.SourceSans3_Bold, fontSize: 15 }}>
                        Logout
                    </CustomText>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default SellerProfile;
