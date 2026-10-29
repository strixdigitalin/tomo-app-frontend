import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import FormScreen, { FormSection } from '../../components/FormScreen';
import FormButton from '../../components/FormButton';
import SafeImage from '../../components/SafeImage';
import PromotionFormFields, { PROMO_SCHEMA, PROMO_DEFAULTS, promoRange } from './PromotionFormFields';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { apiGet, apiPost } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import urls from '../../config/urls';
import useForm from '../../utils/useForm';
import { THEMES } from '../../redux/reducer/theme';
import { profilePalette } from '../UserDetail/profileTheme';

// Promote one of your posts (web: PaidPromotion/AddPostPromotion.jsx) or, with
// route.params.mode === 'shop', one of your shops (web: Seller/ShopPromotion/AddShopPromotion.jsx).
const AddPostPromotion = ({ navigation, route }) => {
    const isShop = route?.params?.mode === 'shop';
    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
    const c = profilePalette(isDarkMode, accent);

    const form = useForm(PROMO_DEFAULTS, PROMO_SCHEMA);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [selectError, setSelectError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await apiGet(isShop ? urls.sellerAllShop : urls.getAllMyPosts);
                setItems(res?.data || []);
            } catch (err) {
                ToastMsg(isShop ? 'Failed to load your shops' : 'Failed to load your posts');
            } finally {
                setLoading(false);
            }
        })();
    }, [isShop]);

    const onSubmit = useCallback(async () => {
        const { ok, firstError } = form.validateAll();
        if (!selected) setSelectError(isShop ? 'Please select a shop to promote' : 'Please select a post to promote');
        if (!selected) return ToastMsg(isShop ? 'Please select a shop to promote' : 'Please select a post to promote');
        if (!ok) return ToastMsg(firstError);

        const v = form.values;
        const { start, end } = promoRange(v.StartDate, v.DurationDays);
        const payload = {
            [isShop ? 'SellerShop' : 'Post']: selected._id,
            PromotionType: v.PromotionType,
            Goal: v.Goal,
            DurationDays: Number(v.DurationDays),
            StartDate: start.toISOString(),
            EndDate: end.toISOString(),
            Price: Number(v.Price),
            Currency: v.Currency,
            // shop promotions: PaymentId is optional on the backend; post promotions fall back to the currency
            ...(isShop ? (v.PaymentId.trim() ? { PaymentId: v.PaymentId.trim() } : {}) : { PaymentId: v.PaymentId.trim() || v.Currency }),
        };

        try {
            setSubmitting(true);
            const res = await apiPost(isShop ? urls.createShopPromotion : urls.createPostPromotion, payload);
            ToastMsg(res?.message || 'Promotion created successfully!');
            navigation.goBack();
        } catch (err) {
            ToastMsg(err?.message || 'Failed to create promotion');
        } finally {
            setSubmitting(false);
        }
    }, [form, selected, isShop, navigation]);

    return (
        <FormScreen
            title={isShop ? 'Promote a Shop' : 'Promote a Post'}
            subtitle={isShop ? 'Select one of your shops and set the details' : 'Select one of your posts and set the details'}
            onBack={() => navigation.goBack()}
            footer={<FormButton label="Create Promotion" onPress={onSubmit} loading={submitting} disabled={!selected} />}>

            <FormSection title={isShop ? 'Select shop' : 'Select post'}>
                {loading ? (
                    <ActivityIndicator color={accent} style={{ marginVertical: 20 }} />
                ) : items.length === 0 ? (
                    <Text style={[styles.empty, { color: c.muted }]}>
                        {isShop ? "You don't have any shops yet." : "You don't have any posts yet."}
                    </Text>
                ) : (
                    items.map(item => {
                        const active = selected?._id === item._id;
                        return (
                            <TouchableOpacity
                                key={item._id}
                                activeOpacity={0.85}
                                onPress={() => { setSelected(item); setSelectError(null); }}
                                style={[styles.card, { backgroundColor: c.chip, borderColor: active ? accent : c.divider }]}>
                                <SafeImage uri={isShop ? item?.Image : item?.media} style={styles.thumb} />
                                <View style={{ flex: 1 }}>
                                    <Text numberOfLines={2} style={[styles.name, { color: c.text }]}>
                                        {isShop ? (item?.Name || 'Shop') : (item?.caption || 'No caption')}
                                    </Text>
                                    <Text numberOfLines={1} style={[styles.meta, { color: c.muted }]}>
                                        {isShop ? (item?.Address?.[0]?.LocationName || item?.Services || '') : `❤️ ${item?.TotalLikes || 0}   💬 ${item?.TotalComents || 0}`}
                                    </Text>
                                </View>
                                {active && <Feather name="check-circle" size={22} color={accent} />}
                            </TouchableOpacity>
                        );
                    })
                )}
                {!!selectError && <Text style={[styles.error, { color: c.danger }]}>{selectError}</Text>}
            </FormSection>

            <FormSection title="Promotion details">
                <PromotionFormFields form={form} minDate={new Date()} />
            </FormSection>
        </FormScreen>
    );
};

const styles = StyleSheet.create({
    card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 16, borderWidth: 1.5, marginBottom: 10 },
    thumb: { width: 56, height: 56, borderRadius: 12 },
    name: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
    meta: { fontSize: 12, marginTop: 3, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
    empty: { textAlign: 'center', paddingVertical: 20, fontSize: 14 },
    error: { fontSize: 12, marginTop: 4, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default AddPostPromotion;
