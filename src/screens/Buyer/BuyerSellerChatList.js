import React, { useCallback, useState } from 'react';
import {
    View,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import Row from '../../components/wrapper/row';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { white } from '../../common/Colors/colors';
import useThemeColor from '../../utils/useThemeColor';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import IMG from '../../assets/Images';

// The buyer's inbox of chats with sellers — matches web's SellerChat.jsx
// sidebar (api/user/GetAllChatedSeller). Separate from social DMs and from
// the seller-side inbox (SellerFlow/SellerChatList.js).
const BuyerSellerChatList = ({ navigation }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const insets = useSafeAreaInsets();

    const [sellers, setSellers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchChatedSellers = async () => {
        try {
            const res = await apiGet(urls.getAllChatedSellers);
            setSellers(res?.data || []);
        } catch (error) {
            console.log('BuyerSellerChatList fetch error', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchChatedSellers();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchChatedSellers();
    };

    const filteredSellers = sellers.filter(
        (s) =>
            s?.UserName?.toLowerCase().includes(search.toLowerCase()) ||
            s?.FullName?.toLowerCase().includes(search.toLowerCase()) ||
            s?.StoreName?.toLowerCase().includes(search.toLowerCase())
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#121212' : '#fff',
            paddingTop: insets.top,
        },
        header: { paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
        headerTitle: { fontSize: 22, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        searchWrap: {
            marginHorizontal: 20,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F3F4F6',
            borderRadius: 14,
            paddingHorizontal: 14,
            height: 44,
        },
        searchInput: {
            flex: 1,
            marginLeft: 8,
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#fff' : '#111827',
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 12,
        },
        avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
        userName: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
        fullName: {
            fontSize: 13,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            marginTop: 2,
        },
        emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
        emptyText: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <Row style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={22} color={isDarkMode ? white : '#111'} />
                </TouchableOpacity>
                <CustomText style={styles.headerTitle}>Seller Chats</CustomText>
            </Row>

            <View style={styles.searchWrap}>
                <Icon name="search" size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filteredSellers}
                keyExtractor={(item, index) => item?._id || String(index)}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => navigation.navigate('BuyerSellerChatScreen', { userForChat: item })}
                    >
                        <Image source={item?.Image ? { uri: item.Image } : IMG.MessageProfile} style={styles.avatar} />
                        <View>
                            <CustomText style={styles.userName}>{item?.StoreName || item?.UserName}</CustomText>
                            <CustomText style={styles.fullName}>{item?.FullName}</CustomText>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyWrap}>
                            <Icon name="message-circle" size={30} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                            <CustomText style={[styles.emptyText, { marginTop: 10 }]}>No seller chats found</CustomText>
                        </View>
                    )
                }
            />
        </View>
    );
};

export default BuyerSellerChatList;
