import React, { useEffect, useState } from 'react';
import { View, Modal, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { apiPut } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import urls from '../../config/urls';
import { white } from '../../common/Colors/colors';
import useThemeColor from '../../utils/useThemeColor';

const PROMOTION_TYPES = ['Advertisement', 'Boost Post'];
const GOALS = ['Brand Awareness', 'More Followers', 'More Likes', 'Website Traffic', 'Messages'];
const CURRENCIES = ['INR', 'USD'];

// Matches web's Pages/PaidPromotion/UpdatePostPromotionModal.jsx — locked
// (read-only) once the promotion IsRunning or is Approved, same as web.
const EditPostPromotionModal = ({ visible, onClose, promotion, onUpdated }) => {
    const { isDarkMode, primaryColor } = useThemeColor();

    const [promotionType, setPromotionType] = useState('Advertisement');
    const [goal, setGoal] = useState('Website Traffic');
    const [durationDays, setDurationDays] = useState('15');
    const [price, setPrice] = useState('1499');
    const [currency, setCurrency] = useState('INR');
    const [paymentId, setPaymentId] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!promotion) return;
        setPromotionType(promotion?.PromotionType || 'Advertisement');
        setGoal(promotion?.Goal || 'Website Traffic');
        setDurationDays(String(promotion?.DurationDays || 15));
        setPrice(String(promotion?.Price || 1499));
        setCurrency(promotion?.Currency || 'INR');
        setPaymentId(promotion?.PaymentId || '');
        setStartDate(promotion?.StartDate ? new Date(promotion.StartDate) : new Date());
    }, [promotion]);

    const isLocked = promotion?.IsRunning || promotion?.Status === 'Approved';

    const endDate = (() => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + Number(durationDays || 1) - 1);
        return d;
    })();

    const onSave = async () => {
        if (!durationDays || Number(durationDays) < 1) return ToastMsg('Duration must be at least 1 day');
        if (!price || Number(price) <= 0) return ToastMsg('Please enter a valid price');

        try {
            setSubmitting(true);
            const res = await apiPut(`${urls.updatePostPromotion}/${promotion?._id}`, {
                PromotionType: promotionType,
                Goal: goal,
                DurationDays: Number(durationDays),
                StartDate: startDate.toISOString(),
                EndDate: endDate.toISOString(),
                Price: Number(price),
                Currency: currency,
                PaymentId: paymentId || currency,
            });
            ToastMsg(res?.message || 'Promotion updated successfully!');
            onUpdated?.();
            onClose();
        } catch (error) {
            ToastMsg(error?.message || 'Failed to update promotion');
        } finally {
            setSubmitting(false);
        }
    };

    const styles = StyleSheet.create({
        overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
        sheet: {
            backgroundColor: isDarkMode ? '#1A1A1A' : '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
            maxHeight: '88%', paddingBottom: 20,
        },
        grabber: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 10, backgroundColor: isDarkMode ? '#3A3A3A' : '#E0E0E0' },
        header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
        title: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        body: { paddingHorizontal: 20 },
        lockNote: {
            fontSize: 12, color: '#B45309', backgroundColor: isDarkMode ? 'rgba(245,158,11,0.15)' : '#FFFBEB',
            padding: 10, borderRadius: 10, marginBottom: 14,
        },
        sectionLabel: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: isDarkMode ? '#D1D5DB' : '#374151', marginTop: 14, marginBottom: 8 },
        chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
        chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: primaryColor },
        chipActive: { backgroundColor: primaryColor },
        chipDisabled: { opacity: 0.5 },
        chipText: { fontSize: 13, color: primaryColor, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
        chipTextActive: { color: white },
        row2: { flexDirection: 'row', gap: 12 },
        inputBox: {
            flex: 1, borderWidth: 1, borderColor: isDarkMode ? '#2A2A2A' : '#E5E7EB', borderRadius: 12,
            paddingHorizontal: 14, paddingVertical: 11, color: isDarkMode ? white : '#111',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular, fontSize: 14,
            backgroundColor: isDarkMode ? '#242424' : '#FAFAFA',
        },
        inputDisabled: { opacity: 0.5 },
        dateBox: {
            flex: 1, borderWidth: 1, borderColor: isDarkMode ? '#2A2A2A' : '#E5E7EB', borderRadius: 12,
            paddingHorizontal: 14, paddingVertical: 12, backgroundColor: isDarkMode ? '#242424' : '#FAFAFA', justifyContent: 'center',
        },
        dateText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? white : '#111' },
        saveBtn: { marginTop: 22, backgroundColor: primaryColor, paddingVertical: 15, borderRadius: 16, alignItems: 'center' },
        saveBtnDisabled: { opacity: 0.6 },
        saveBtnText: { color: white, fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    });

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
                <View style={styles.sheet}>
                    <View style={styles.grabber} />
                    <View style={styles.header}>
                        <CustomText style={styles.title}>Update Promotion</CustomText>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="x" size={22} color={isDarkMode ? white : '#111'} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                        {isLocked && (
                            <CustomText style={styles.lockNote}>
                                This promotion is running or already approved, so it can't be edited.
                            </CustomText>
                        )}

                        <CustomText style={styles.sectionLabel}>Promotion Type</CustomText>
                        <View style={styles.chipRow}>
                            {PROMOTION_TYPES.map((t) => (
                                <TouchableOpacity
                                    key={t} disabled={isLocked}
                                    style={[styles.chip, promotionType === t && styles.chipActive, isLocked && styles.chipDisabled]}
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
                                    key={g} disabled={isLocked}
                                    style={[styles.chip, goal === g && styles.chipActive, isLocked && styles.chipDisabled]}
                                    onPress={() => setGoal(g)}
                                >
                                    <CustomText style={[styles.chipText, goal === g && styles.chipTextActive]}>{g}</CustomText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <CustomText style={styles.sectionLabel}>Duration & Price</CustomText>
                        <View style={styles.row2}>
                            <TextInput
                                style={[styles.inputBox, isLocked && styles.inputDisabled]}
                                editable={!isLocked}
                                placeholder="Duration (Days)"
                                placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                                keyboardType="number-pad"
                                value={durationDays}
                                onChangeText={setDurationDays}
                            />
                            <TextInput
                                style={[styles.inputBox, isLocked && styles.inputDisabled]}
                                editable={!isLocked}
                                placeholder="Price (₹)"
                                placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                                keyboardType="number-pad"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>

                        <CustomText style={styles.sectionLabel}>Schedule</CustomText>
                        <View style={styles.row2}>
                            <TouchableOpacity
                                style={styles.dateBox}
                                disabled={isLocked}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <CustomText style={styles.dateText}>{startDate.toLocaleDateString('en-IN')}</CustomText>
                            </TouchableOpacity>
                            <View style={[styles.dateBox, { opacity: 0.6 }]}>
                                <CustomText style={styles.dateText}>{endDate.toLocaleDateString('en-IN')}</CustomText>
                            </View>
                        </View>
                        {showDatePicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
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
                                    key={c} disabled={isLocked}
                                    style={[styles.chip, currency === c && styles.chipActive, isLocked && styles.chipDisabled]}
                                    onPress={() => setCurrency(c)}
                                >
                                    <CustomText style={[styles.chipText, currency === c && styles.chipTextActive]}>{c}</CustomText>
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
                            style={[styles.saveBtn, (submitting || isLocked) && styles.saveBtnDisabled]}
                            onPress={onSave}
                            disabled={submitting || isLocked}
                        >
                            <CustomText style={styles.saveBtnText}>{submitting ? 'Updating...' : 'Update Promotion'}</CustomText>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default EditPostPromotionModal;
