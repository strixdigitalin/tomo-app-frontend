import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import FormButton from '../../components/FormButton';
import PromotionFormFields, { PROMO_SCHEMA, PROMO_DEFAULTS, promoRange, dateToField } from './PromotionFormFields';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { apiPut } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import urls from '../../config/urls';
import useForm from '../../utils/useForm';
import { THEMES } from '../../redux/reducer/theme';
import { profilePalette } from '../UserDetail/profileTheme';

// Edit sheet for an existing promotion (web: UpdatePostPromotionModal / UpdateShopPromotionModal).
// Type and goal are locked once the promotion is running or approved.
const EditPostPromotionModal = ({ visible, onClose, promotion, onUpdated, isShop }) => {
    const insets = useSafeAreaInsets();
    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
    const c = profilePalette(isDarkMode, accent);

    const form = useForm(PROMO_DEFAULTS, PROMO_SCHEMA);
    const [submitting, setSubmitting] = useState(false);
    const locked = !!(promotion?.IsRunning || promotion?.Status === 'Approved');

    useEffect(() => {
        if (!promotion) return;
        form.reset({
            PromotionType: promotion?.PromotionType || 'Advertisement',
            Goal: promotion?.Goal || 'Website Traffic',
            DurationDays: String(promotion?.DurationDays || 15),
            Price: String(promotion?.Price || 1499),
            Currency: promotion?.Currency || 'INR',
            PaymentId: promotion?.PaymentId || '',
            StartDate: dateToField(promotion?.StartDate) || dateToField(new Date()),
        });
    }, [promotion]);

    const onSave = useCallback(async () => {
        const { ok, firstError } = form.validateAll();
        if (!ok) return ToastMsg(firstError);
        const v = form.values;
        const { start, end } = promoRange(v.StartDate, v.DurationDays);
        try {
            setSubmitting(true);
            const res = await apiPut(`${isShop ? urls.updateShopPromotion : urls.updatePostPromotion}/${promotion?._id}`, {
                PromotionType: v.PromotionType,
                Goal: v.Goal,
                DurationDays: Number(v.DurationDays),
                StartDate: start.toISOString(),
                EndDate: end.toISOString(),
                Price: Number(v.Price),
                Currency: v.Currency,
                PaymentId: v.PaymentId.trim() || v.Currency,
            });
            ToastMsg(res?.message || 'Promotion updated successfully!');
            onUpdated?.();
            onClose();
        } catch (err) {
            ToastMsg(err?.message || 'Failed to update promotion');
        } finally {
            setSubmitting(false);
        }
    }, [form, isShop, promotion, onUpdated, onClose]);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView behavior="padding" style={styles.overlay}>
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
                <View style={[styles.sheet, { backgroundColor: c.card, borderColor: c.border }]}>
                    <View style={[styles.grabber, { backgroundColor: c.divider }]} />
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: c.text }]}>Edit Promotion</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Feather name="x" size={22} color={c.muted} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                        {locked && (
                            <Text style={styles.lock}>
                                This promotion is approved / running, so its type and goal can no longer be changed.
                            </Text>
                        )}
                        <PromotionFormFields form={form} locked={locked} />
                    </ScrollView>

                    <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 14) }}>
                        <FormButton label="Save Changes" onPress={onSave} loading={submitting} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.6)', justifyContent: 'flex-end' },
    sheet: { maxHeight: '90%', borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1 },
    grabber: { width: 44, height: 5, borderRadius: 3, alignSelf: 'center', marginTop: 10 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
    title: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    body: { paddingHorizontal: 20 },
    lock: { fontSize: 12, color: '#B45309', backgroundColor: 'rgba(245,158,11,0.15)', padding: 10, borderRadius: 10, marginBottom: 14 },
});

export default EditPostPromotionModal;
