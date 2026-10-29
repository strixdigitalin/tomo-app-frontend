import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import FormScreen, { FormSection } from '../../components/FormScreen';
import FormField from '../../components/FormField';
import FormButton from '../../components/FormButton';
import ImageUploadBox from '../../components/ImageUploadBox';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { BASE_URL, getItem } from '../../utils/Apis';
import urls from '../../config/urls';
import { ToastMsg } from '../../utils/helperFunctions';
import useForm from '../../utils/useForm';
import { compose, required, maxLength } from '../../utils/validators';
import { THEMES } from '../../redux/reducer/theme';
import { profilePalette } from '../UserDetail/profileTheme';

// One add / edit shop form for both flows (web: MarketPlace/Shop/AddShop.jsx and
// Seller/Shop/SellerAddShop.jsx). Fields: image, name, services, up to 5 addresses,
// one or more categories.  No map/geocoding yet, so every address uses the default coordinates
// (same fallback web uses).
//   variant 'listing' → user's own shop (image required)
//   variant 'seller'  → seller's shop    (image optional, like web)
const DEFAULT_COORDS = [76.7794, 30.7333];
const MAX_ADDRESSES = 5;

const SCHEMA = {
    Name: compose(required('Shop name'), maxLength(80, 'Shop name')),
    Services: maxLength(300, 'Services'),
};

const ShopFormScreen = ({ navigation, route, variant }) => {
    const isSeller = variant === 'seller';
    const editing = route?.params?.shop || null;
    const isEdit = !!editing;

    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
    const c = profilePalette(isDarkMode, accent);

    const form = useForm({ Name: editing?.Name || '', Services: editing?.Services || '' }, SCHEMA);
    const { values: v, errors: e } = form;

    const [image, setImage] = useState(editing?.Image ? { uri: editing.Image, isExisting: true } : null);
    const [imageError, setImageError] = useState(null);

    const [addresses, setAddresses] = useState(
        editing?.Address?.length
            ? editing.Address.map(a => ({ locationName: a?.LocationName || '', coordinates: a?.coordinates || DEFAULT_COORDS }))
            : [{ locationName: '', coordinates: DEFAULT_COORDS }],
    );
    const [addressError, setAddressError] = useState(null);

    const [allCategories, setAllCategories] = useState([]);
    const [selected, setSelected] = useState(Array.isArray(editing?.ShopCategory) ? editing.ShopCategory : []); // names
    const [categoryError, setCategoryError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/admin/GetAllShopCategory`);
                const json = await res.json();
                setAllCategories(json?.data || []);
            } catch (err) {
                ToastMsg('Failed to load categories');
            }
        })();
    }, []);

    const toggleCategory = useCallback(name => {
        setSelected(prev => (prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]));
        setCategoryError(null);
    }, []);

    const updateAddress = (i, text) => {
        setAddresses(prev => prev.map((a, idx) => (idx === i ? { ...a, locationName: text } : a)));
        setAddressError(null);
    };

    const onSubmit = useCallback(async () => {
        const { ok, firstError } = form.validateAll();
        const validAddresses = addresses.filter(a => a.locationName.trim() !== '');
        const needImage = !isSeller && !image;
        if (needImage) setImageError('Shop image is required');
        if (validAddresses.length === 0) setAddressError('At least one address is required');
        if (selected.length === 0) setCategoryError('Please select at least one category');

        if (!ok) return ToastMsg(firstError);
        if (needImage) return ToastMsg('Shop image is required');
        if (validAddresses.length === 0) return ToastMsg('At least one address is required');
        if (selected.length === 0) return ToastMsg('Please select at least one category');

        try {
            setSaving(true);
            const token = await getItem('token');
            const fd = new FormData();
            if (image && !image.isExisting) {
                fd.append('Image', {
                    uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
                    type: image.type || 'image/jpeg',
                    name: image.name || 'shop.jpg',
                });
            }
            fd.append('Name', v.Name.trim());
            fd.append('Address', JSON.stringify(validAddresses.map(a => ({
                LocationName: a.locationName.trim(), type: 'Point', coordinates: a.coordinates,
            }))));
            fd.append('Services', v.Services.trim());
            fd.append('ShopCategory', JSON.stringify(selected));

            const path = isSeller
                ? (isEdit ? `${urls.sellerUpdateShop}/${editing._id}` : urls.sellerCreateShop)
                : (isEdit ? `${urls.updateMyShop}/${editing._id}` : urls.createMyShop);
            const res = await fetch(`${BASE_URL}${path}`, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const result = await res.json();
            ToastMsg(result?.message || (isEdit ? 'Shop updated' : 'Shop created'));
            if (res.ok) navigation.goBack();
        } catch (err) {
            console.log('ShopForm submit error', err);
            ToastMsg('Something went wrong, please try again');
        } finally {
            setSaving(false);
        }
    }, [form, addresses, image, selected, isSeller, isEdit, v, editing, navigation]);

    const title = isEdit ? (isSeller ? 'Update Shop' : 'Update Listing') : (isSeller ? 'Add Shop' : 'Add Listing');

    return (
        <FormScreen
            title={title}
            subtitle={isSeller ? 'Tell customers about your shop' : 'Set up your shop listing'}
            onBack={() => navigation.goBack()}
            footer={<FormButton label={isEdit ? 'Save Changes' : title} onPress={onSubmit} loading={saving} />}>

            <FormSection title="Shop photo">
                <ImageUploadBox
                    label={isSeller ? 'Shop image' : 'Shop image'} required={!isSeller} image={image} error={imageError}
                    onChange={img => { setImage(img); setImageError(null); }}
                />
            </FormSection>

            <FormSection title="Shop details">
                <FormField label="Shop name" required placeholder="Enter shop name" autoCapitalize="words" maxLength={80}
                    value={v.Name} error={e.Name} onChangeText={t => form.set('Name', t)} onBlur={() => form.blur('Name')} />
                <FormField label="Services" placeholder="What do you offer? e.g. Detailing, Repair, Parts" multiline maxLength={300} showCounter autoCapitalize="sentences"
                    value={v.Services} error={e.Services} onChangeText={t => form.set('Services', t)} onBlur={() => form.blur('Services')} />
            </FormSection>

            <FormSection title="Addresses" hint={`Add up to ${MAX_ADDRESSES} locations`}>
                {addresses.map((a, i) => (
                    <FormField
                        key={i}
                        label={addresses.length > 1 ? `Address ${i + 1}` : 'Address'}
                        required={i === 0}
                        leftIcon="map-pin"
                        placeholder="Area, city"
                        autoCapitalize="words"
                        value={a.locationName}
                        error={i === 0 ? addressError : null}
                        onChangeText={t => updateAddress(i, t)}
                        rightElement={addresses.length > 1 ? (
                            <TouchableOpacity onPress={() => setAddresses(prev => prev.filter((_, idx) => idx !== i))} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                <Feather name="trash-2" size={17} color={c.danger} />
                            </TouchableOpacity>
                        ) : null}
                    />
                ))}
                {addresses.length < MAX_ADDRESSES && (
                    <TouchableOpacity
                        style={[styles.addRow, { borderColor: accent, backgroundColor: accent + '12' }]}
                        onPress={() => setAddresses(prev => [...prev, { locationName: '', coordinates: DEFAULT_COORDS }])}>
                        <Feather name="plus" size={16} color={accent} />
                        <Text style={[styles.addText, { color: accent }]}>Add another address</Text>
                    </TouchableOpacity>
                )}
            </FormSection>

            <FormSection title="Categories" hint="Select all that apply">
                <View style={styles.chips}>
                    {allCategories.map(cat => {
                        const active = selected.includes(cat.Name);
                        return (
                            <TouchableOpacity
                                key={cat._id}
                                activeOpacity={0.8}
                                onPress={() => toggleCategory(cat.Name)}
                                style={[styles.chip, { backgroundColor: active ? accent : c.chip, borderColor: active ? accent : categoryError ? c.danger : c.divider }]}>
                                {active && <Feather name="check" size={13} color="#fff" />}
                                <Text style={[styles.chipText, { color: active ? '#fff' : c.text }]}>{cat.Name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                    {allCategories.length === 0 && <Text style={{ color: c.muted, fontSize: 13 }}>Loading categories…</Text>}
                </View>
                {!!categoryError && <Text style={[styles.error, { color: c.danger }]}>{categoryError}</Text>}
            </FormSection>
        </FormScreen>
    );
};

const styles = StyleSheet.create({
    addRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed' },
    addText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1.5 },
    chipText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
    error: { fontSize: 12, marginTop: 8, marginLeft: 2, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default ShopFormScreen;
