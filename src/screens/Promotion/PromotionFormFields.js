import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import FormField from '../../components/FormField';
import OptionChips from '../../components/OptionChips';
import DateTimeField from '../../components/DateTimeField';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { compose, required, number, price as priceRule } from '../../utils/validators';
import { profilePalette } from '../UserDetail/profileTheme';
import { THEMES } from '../../redux/reducer/theme';

export const PROMOTION_TYPES = ['Advertisement', 'Boost Post'];
export const GOALS = ['Brand Awareness', 'More Followers', 'More Likes', 'Website Traffic', 'Messages'];
export const CURRENCIES = ['INR', 'USD'];

// Same checks as web's AddPostPromotion / AddShopPromotion
export const PROMO_SCHEMA = {
    StartDate: required('Start date'),
    DurationDays: compose(required('Duration'), number('Duration', { min: 1, max: 365, integer: true })),
    Price: compose(required('Price'), priceRule('Price')),
};

export const PROMO_DEFAULTS = {
    PromotionType: 'Advertisement', Goal: 'Website Traffic', DurationDays: '15',
    Price: '1499', Currency: 'INR', PaymentId: '', StartDate: '',
};

const pad = n => String(n).padStart(2, '0');
const toStr = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const dateToField = d => (d ? toStr(new Date(d)) : '');

// start of the first day → end of the last day (like web: 00:00 … 23:59:59)
export const promoRange = (startStr, days) => {
    const [y, m, d] = startStr.split('-').map(Number);
    const start = new Date(y, m - 1, d, 0, 0, 0);
    const end = new Date(y, m - 1, d + Number(days) - 1, 23, 59, 59);
    return { start, end };
};

// Fields shared by the "add promotion" screen and the "edit promotion" sheet
const PromotionFormFields = ({ form, locked = false, minDate }) => {
    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
    const c = profilePalette(isDarkMode, accent);
    const { values: v, errors: e } = form;
    const end = v.StartDate && Number(v.DurationDays) >= 1 ? promoRange(v.StartDate, v.DurationDays).end : null;

    return (
        <View>
            <View pointerEvents={locked ? 'none' : 'auto'} style={{ opacity: locked ? 0.5 : 1 }}>
                <OptionChips label="Promotion type" options={PROMOTION_TYPES} value={v.PromotionType} allowClear={false} onChange={t => form.set('PromotionType', t)} />
                <OptionChips label="Goal" options={GOALS} value={v.Goal} allowClear={false} onChange={t => form.set('Goal', t)} />
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                    <FormField
                        label="Duration (days)" required placeholder="15" keyboardType="number-pad" maxLength={3}
                        value={v.DurationDays} error={e.DurationDays}
                        onChangeText={t => form.set('DurationDays', t.replace(/\D/g, ''))} onBlur={() => form.blur('DurationDays')}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <FormField
                        label="Price" required placeholder="1499" keyboardType="decimal-pad"
                        value={v.Price} error={e.Price}
                        onChangeText={t => form.set('Price', t.replace(/[^0-9.]/g, ''))} onBlur={() => form.blur('Price')}
                    />
                </View>
            </View>

            <OptionChips label="Currency" options={CURRENCIES} value={v.Currency} allowClear={false} onChange={t => form.set('Currency', t)} />

            <DateTimeField
                label="Start date" required mode="date" value={v.StartDate} error={e.StartDate} minimumDate={minDate}
                onChange={d => { form.set('StartDate', d); form.blur('StartDate'); }}
            />
            {!!end && (
                <Text style={{ color: c.muted, fontSize: 12, marginTop: -6, marginBottom: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular }}>
                    Ends on {toStr(end)}
                </Text>
            )}

            <FormField
                label="Payment ID" placeholder="Leave empty if not available"
                value={v.PaymentId} onChangeText={t => form.set('PaymentId', t)}
            />
        </View>
    );
};

export default PromotionFormFields;
