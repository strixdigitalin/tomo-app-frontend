import React, { useEffect, useState } from 'react';
import {
    View,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import Row from '../../components/wrapper/row';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { apiGet, apiPost } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import urls from '../../config/urls';
import { App_Primary_color, white } from '../../common/Colors/colors';
import IMG from '../../assets/Images';

const PROMOTION_TYPES = ['Advertisement', 'Boost Post'];
const GOALS = ['Brand Awareness', 'More Followers', 'More Likes', 'Website Traffic', 'Messages'];
const CURRENCIES = ['INR', 'USD'];

// Matches web's Pages/PaidPromotion/AddPostPromotion.jsx — promotes one of the
// user's own POSTS (not a shop product), same fields, same endpoint.
const AddPostPromotion = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const insets = useSafeAreaInsets();

    const [allPosts, setAllPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);

    const [promotionType, setPromotionType] = useState('Advertisement');
    const [goal, setGoal] = useState('Website Traffic');
    const [durationDays, setDurationDays] = useState('15');
    const [price, setPrice] = useState('1499');
    const [currency, setCurrency] = useState('INR');
    const [paymentId, setPaymentId] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const fetchMyPosts = async () => {
        try {
            const res = await apiGet(urls.getAllMyPosts);
            setAllPosts(res?.data || []);
        } catch (error) {
            console.log('AddPostPromotion posts fetch error', error);
        } finally {
            setLoadingPosts(false);
        }
    };

    const endDate = (() => {
        if (!startDate || !durationDays) return null;
        const d = new Date(startDate);
        d.setDate(d.getDate() + Number(durationDays) - 1);
        return d;
    })();

    const onSubmit = async () => {
        if (!selectedPost) return ToastMsg('Please select a post to promote');
        if (!startDate) return ToastMsg('Please select a start date');
        if (!durationDays || Number(durationDays) < 1) return ToastMsg('Duration must be at least 1 day');
        if (!price || Number(price) <= 0) return ToastMsg('Please enter a valid price');

        try {
            setSubmitting(true);
            const res = await apiPost(urls.createPostPromotion, {
                Post: selectedPost._id,
                PromotionType: promotionType,
                Goal: goal,
                DurationDays: Number(durationDays),
                StartDate: startDate.toISOString(),
                EndDate: endDate.toISOString(),
                Price: Number(price),
                Currency: currency,
                PaymentId: paymentId || currency,
            });
            ToastMsg(res?.message || 'Promotion created successfully!');
            navigation.goBack();
        } catch (error) {
            ToastMsg(error?.message || 'Failed to create promotion');
        } finally {
            setSubmitting(false);
        }
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#fff', paddingTop: insets.top },
        header: { paddingHorizontal: 20, paddingVertical: 14 },
        headerTitle: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        headerSub: { fontSize: 13, color: isDarkMode ? '#9CA3AF' : '#6B7280', marginTop: 2 },
        body: { padding: 20, paddingBottom: 60 },
        sectionLabel: {
            fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            color: isDarkMode ? '#D1D5DB' : '#374151', marginTop: 20, marginBottom: 10,
        },
        postCard: {
            flexDirection: 'row', gap: 12, padding: 10, borderRadius: 14, marginBottom: 10,
            borderWidth: 2, alignItems: 'center',
        },
        postImage: { width: 56, height: 56, borderRadius: 10 },
        postCaption: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium, flex: 1 },
        postMeta: { fontSize: 11, color: isDarkMode ? '#9CA3AF' : '#6B7280', marginTop: 4 },
        chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
        chip: {
            paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1,
            borderColor: App_Primary_color,
        },
        chipActive: { backgroundColor: App_Primary_color },
        chipText: { fontSize: 13, color: App_Primary_color, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
        chipTextActive: { color: white },
        row2: { flexDirection: 'row', gap: 12 },
        inputBox: {
            flex: 1, borderWidth: 1, borderColor: isDarkMode ? '#2A2A2A' : '#E5E7EB', borderRadius: 12,
            paddingHorizontal: 14, paddingVertical: 12, color: isDarkMode ? white : '#111',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular, fontSize: 14,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FAFAFA',
        },
        dateBox: {
            flex: 1, borderWidth: 1, borderColor: isDarkMode ? '#2A2A2A' : '#E5E7EB', borderRadius: 12,
            paddingHorizontal: 14, paddingVertical: 12,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FAFAFA', justifyContent: 'center',
        },
        dateBoxDisabled: { opacity: 0.6 },
        dateText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? white : '#111' },
        submitBtn: {
            marginTop: 26, backgroundColor: App_Primary_color, paddingVertical: 15, borderRadius: 16, alignItems: 'center',
        },
        submitBtnDisabled: { opacity: 0.6 },
    });

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <Row style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="x" size={22} color={isDarkMode ? white : '#111'} />
                </TouchableOpacity>
                <View style={{ marginLeft: 14 }}>
                    <CustomText style={styles.headerTitle}>Promote a Post</CustomText>
                    <CustomText style={styles.headerSub}>Select one of your posts and set promotion details</CustomText>
                </View>
            </Row>

            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <CustomText style={styles.sectionLabel}>Select Post</CustomText>
                {allPosts.length === 0 && !loadingPosts && (
                    <CustomText style={{ fontSize: 13, color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                        You don't have any posts yet.
                    </CustomText>
                )}
                {allPosts.map((post) => {
                    const active = selectedPost?._id === post._id;
                    return (
                        <TouchableOpacity
                            key={post._id}
                            style={[
                                styles.postCard,
                                { borderColor: active ? App_Primary_color : (isDarkMode ? '#2A2A2A' : '#EEE') },
                            ]}
                            onPress={() => setSelectedPost(post)}
                        >
                            <Image source={post?.media ? { uri: post.media } : IMG.PostImage} style={styles.postImage} />
                            <View style={{ flex: 1 }}>
                                <CustomText numberOfLines={2} style={styles.postCaption}>
                                    {post?.caption || 'No caption'}
                                </CustomText>
                                <CustomText style={styles.postMeta}>
                                    ❤️ {post?.TotalLikes || 0}   💬 {post?.TotalComents || 0}
                                </CustomText>
                            </View>
                            {active && <Icon name="check-circle" size={20} color={App_Primary_color} />}
                        </TouchableOpacity>
                    );
                })}

                <CustomText style={styles.sectionLabel}>Promotion Type</CustomText>
                <View style={styles.chipRow}>
                    {PROMOTION_TYPES.map((t) => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.chip, promotionType === t && styles.chipActive]}
                            onPress={() => setPromotionType(t)}
                        >
                            <CustomText style={[styles.chipText, promotionType === t && styles.chipTextActive]}>{t}</CustomText>
                        </TouchableOpacity>
                    ))}
                </View>

                <CustomText style={styles.sectionLabel}>Goal</CustomText>
                <View style={styles.chipRow}>
                    {GOALS.map((g) => (
                        <TouchableOpacity
                            key={g}
                            style={[styles.chip, goal === g && styles.chipActive]}
                            onPress={() => setGoal(g)}
                        >
                            <CustomText style={[styles.chipText, goal === g && styles.chipTextActive]}>{g}</CustomText>
                        </TouchableOpacity>
                    ))}
                </View>

                <CustomText style={styles.sectionLabel}>Duration & Price</CustomText>
                <View style={styles.row2}>
                    <TextInput
                        style={styles.inputBox}
                        placeholder="Duration (Days)"
                        placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                        keyboardType="number-pad"
                        value={durationDays}
                        onChangeText={setDurationDays}
                    />
                    <TextInput
                        style={styles.inputBox}
                        placeholder="Price (₹)"
                        placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                        keyboardType="number-pad"
                        value={price}
                        onChangeText={setPrice}
                    />
                </View>

                <CustomText style={styles.sectionLabel}>Schedule</CustomText>
                <View style={styles.row2}>
                    <TouchableOpacity style={styles.dateBox} onPress={() => setShowDatePicker(true)}>
                        <CustomText style={styles.dateText}>
                            {startDate ? startDate.toLocaleDateString('en-IN') : 'Start Date'}
                        </CustomText>
                    </TouchableOpacity>
                    <View style={[styles.dateBox, styles.dateBoxDisabled]}>
                        <CustomText style={styles.dateText}>
                            {endDate ? endDate.toLocaleDateString('en-IN') : 'End Date'}
                        </CustomText>
                    </View>
                </View>
                {showDatePicker && (
                    <DateTimePicker
                        value={startDate || new Date()}
                        mode="date"
                        minimumDate={new Date()}
                        display="default"
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            if (date) setStartDate(date);
                        }}
                    />
                )}

                <CustomText style={styles.sectionLabel}>Currency</CustomText>
                <View style={styles.chipRow}>
                    {CURRENCIES.map((c) => (
                        <TouchableOpacity
                            key={c}
                            style={[styles.chip, currency === c && styles.chipActive]}
                            onPress={() => setCurrency(c)}
                        >
                            <CustomText style={[styles.chipText, currency === c && styles.chipTextActive]}>
                                {c === 'INR' ? 'INR (₹)' : 'USD ($)'}
                            </CustomText>
                        </TouchableOpacity>
                    ))}
                </View>

                <CustomText style={styles.sectionLabel}>Payment ID (optional)</CustomText>
                <TextInput
                    style={styles.inputBox}
                    placeholder="Leave empty if not available"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    value={paymentId}
                    onChangeText={setPaymentId}
                />

                <TouchableOpacity
                    style={[styles.submitBtn, (submitting || !selectedPost) && styles.submitBtnDisabled]}
                    onPress={onSubmit}
                    disabled={submitting || !selectedPost}
                >
                    <CustomText style={{ color: white, fontFamily: FONTS_FAMILY.SourceSans3_Bold, fontSize: 15 }}>
                        {submitting ? 'Creating Promotion...' : 'Create Promotion'}
                    </CustomText>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddPostPromotion;
