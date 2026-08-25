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
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { App_Primary_color } from '../../common/Colors/colors';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import IMG from '../../assets/Images';

const SellerChatList = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const insets = useSafeAreaInsets();

    const [chatUsers, setChatUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchChatUsers = async () => {
        try {
            const res = await apiGet(urls.sellerChatUsers);
            setChatUsers(res?.data || []);
        } catch (error) {
            console.log('SellerChatList fetch error', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchChatUsers();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchChatUsers();
    };

    const filteredUsers = chatUsers.filter(
        (u) =>
            u?.UserName?.toLowerCase().includes(search.toLowerCase()) ||
            u?.FullName?.toLowerCase().includes(search.toLowerCase())
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#121212' : '#fff',
            paddingTop: insets.top,
        },
        header: { paddingHorizontal: 20, paddingVertical: 14 },
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
            <View style={styles.header}>
                <CustomText style={styles.headerTitle}>Chats</CustomText>
            </View>

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
                data={filteredUsers}
                keyExtractor={(item, index) => item?._id || String(index)}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={App_Primary_color} />
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => navigation.navigate('SellerChatScreen', { userId: item?._id, userForChat: item })}
                    >
                        <Image source={item?.Image ? { uri: item.Image } : IMG.MessageProfile} style={styles.avatar} />
                        <View>
                            <CustomText style={styles.userName}>{item?.UserName}</CustomText>
                            <CustomText style={styles.fullName}>{item?.FullName}</CustomText>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyWrap}>
                            <Icon name="message-circle" size={30} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                            <CustomText style={[styles.emptyText, { marginTop: 10 }]}>No chats found</CustomText>
                        </View>
                    )
                }
            />
        </View>
    );
};

export default SellerChatList;
