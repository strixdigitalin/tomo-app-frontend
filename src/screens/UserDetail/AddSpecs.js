import React, { useCallback, useMemo, useState } from 'react';
import { Platform, Switch, Text, View, StyleSheet } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import FormScreen, { FormSection } from '../../components/FormScreen';
import FormField from '../../components/FormField';
import FormButton from '../../components/FormButton';
import OptionChips from '../../components/OptionChips';
import ChipInput from '../../components/ChipInput';
import ImageUploadBox from '../../components/ImageUploadBox';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { BASE_URL, getItem } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import useForm from '../../utils/useForm';
import { compose, required, maxLength, number, year as yearRule } from '../../utils/validators';
import { THEMES } from '../../redux/reducer/theme';
import { profilePalette } from './profileTheme';

const BUILD_STAGES = ['Stock', 'Modified', 'Under Build'];
const DRIVETRAINS = ['FWD', 'RWD', 'AWD', '4WD'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'CVT', 'DCT'];

// Fields mirror web's AddCurrentCar.jsx. Web only insists on the photo; on mobile the
// basic identity (name, make, model, year) is required too.
const SCHEMA = {
    vehicleName: compose(required('Vehicle name'), maxLength(60, 'Vehicle name')),
    make: required('Make'),
    model: required('Model'),
    year: compose(required('Year'), yearRule),
    horsepower: number('Horsepower', { min: 1, max: 3000, integer: true }),
    torque: number('Torque', { min: 1, max: 5000, integer: true }),
    zeroToSixty: number('0–60 time', { min: 0.1, max: 60 }),
    quarterMile: number('Quarter mile', { min: 1, max: 60 }),
    mileage: number('Mileage', { min: 0, max: 10000000, integer: true }),
    currentPrice: number('Price', { min: 0 }),
    ownerNote: maxLength(500, 'Owner note'),
};

const str = v => (v === undefined || v === null ? '' : String(v));
const arr = v => (Array.isArray(v) ? v : []);

const AddVehicleSpecs = ({ navigation, route }) => {
    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
    const c = profilePalette(isDarkMode, accent);

    const existing = route?.params?.vehicleData || null;
    const isEditMode = !!existing;
    const vehicleId = existing?._id || null;

    const initial = useMemo(() => ({
        vehicleName: str(existing?.vehicleName),
        make: str(existing?.make),
        model: str(existing?.model),
        year: str(existing?.year),
        bodyType: str(existing?.bodyType),
        buildStage: str(existing?.buildStage),
        engine: str(existing?.engine),
        horsepower: str(existing?.horsepower),
        torque: str(existing?.torque),
        drivetrain: str(existing?.drivetrain),
        transmission: str(existing?.transmission),
        performance: arr(existing?.performance),
        suspension: arr(existing?.suspension),
        brakes: arr(existing?.brakes),
        paintWrap: str(existing?.paintWrap),
        exteriorMods: arr(existing?.exteriorMods),
        interiorMods: arr(existing?.interiorMods),
        mileage: str(existing?.mileage),
        zeroToSixty: str(existing?.zeroToSixty),
        quarterMile: str(existing?.quarterMile),
        currentPrice: str(existing?.currentPrice),
        ownerNote: str(existing?.ownerNote),
        PrimaryCar: !!existing?.PrimaryCar,
    }), [existing]);

    const form = useForm(initial, SCHEMA);
    const { values: v, errors: e } = form;

    const existingImage = existing?.image || existing?.images?.[0] || null;
    const [image, setImage] = useState(existingImage ? { uri: existingImage, isExisting: true } : null);
    const [imageError, setImageError] = useState(null);
    const [saving, setSaving] = useState(false);

    // text field helper: value + inline error + live validation after first blur
    const field = useCallback(name => ({
        value: v[name],
        error: e[name],
        onChangeText: t => form.set(name, t),
        onBlur: () => form.blur(name),
    }), [v, e, form]);

    const numeric = useCallback((name, maxLen) => ({
        ...field(name),
        keyboardType: 'number-pad',
        maxLength: maxLen,
        onChangeText: t => form.set(name, t.replace(/\D/g, '')),
    }), [field, form]);

    const decimal = useCallback(name => ({
        ...field(name),
        keyboardType: 'decimal-pad',
        maxLength: 6,
        onChangeText: t => form.set(name, t.replace(/[^0-9.]/g, '')),
    }), [field, form]);

    const onSubmit = useCallback(async () => {
        const { ok, firstError } = form.validateAll();
        if (!image) setImageError('Please upload a car image');
        if (!ok) return ToastMsg(firstError);
        if (!image) return ToastMsg('Please upload a car image');

        try {
            setSaving(true);
            const token = await getItem('token');
            const fd = new FormData();
            const put = (k, val) => { if (val !== undefined && val !== null && String(val).trim() !== '') fd.append(k, val); };

            fd.append('vehicleName', v.vehicleName.trim());
            fd.append('PrimaryCar', v.PrimaryCar ? 'true' : 'false');
            fd.append('make', v.make.trim());
            fd.append('model', v.model.trim());
            fd.append('year', parseInt(v.year, 10));
            put('bodyType', v.bodyType.trim());

            put('engine', v.engine.trim());
            put('horsepower', v.horsepower && parseInt(v.horsepower, 10));
            put('torque', v.torque && parseInt(v.torque, 10));
            put('drivetrain', v.drivetrain);
            put('transmission', v.transmission);

            fd.append('performance', JSON.stringify(v.performance));
            fd.append('suspension', JSON.stringify(v.suspension));
            fd.append('brakes', JSON.stringify(v.brakes));

            put('paintWrap', v.paintWrap.trim());
            fd.append('exteriorMods', JSON.stringify(v.exteriorMods));
            fd.append('interiorMods', JSON.stringify(v.interiorMods));

            put('mileage', v.mileage && parseInt(v.mileage, 10));
            put('buildStage', v.buildStage);
            put('zeroToSixty', v.zeroToSixty.trim());
            put('quarterMile', v.quarterMile.trim());
            put('ownerNote', v.ownerNote.trim());
            put('currentPrice', v.currentPrice && parseInt(v.currentPrice, 10));

            if (!image.isExisting) {
                fd.append('Image', {
                    uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
                    type: image.type || 'image/jpeg',
                    name: image.name || 'vehicle_image.jpg',
                });
            }

            const url = isEditMode ? `${BASE_URL}/api/user/UpdateUserCurrentCar/${vehicleId}` : `${BASE_URL}/api/user/UserAddCurrentCar`;
            await axios[isEditMode ? 'put' : 'post'](url, fd, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
            });
            ToastMsg(isEditMode ? 'Vehicle updated successfully!' : 'Vehicle added successfully!');
            navigation.goBack();
        } catch (error) {
            ToastMsg(error?.response?.data?.message || 'Failed to save vehicle');
        } finally {
            setSaving(false);
        }
    }, [form, image, v, isEditMode, vehicleId, navigation]);

    return (
        <FormScreen
            title={isEditMode ? 'Update Vehicle' : 'Add Your Car'}
            subtitle="Share your ride with the community"
            onBack={() => navigation.goBack()}
            footer={<FormButton label={isEditMode ? 'Save Changes' : 'Add Vehicle'} onPress={onSubmit} loading={saving} />}>

            <FormSection title="Photo">
                <ImageUploadBox
                    label="Car image" required image={image} error={imageError}
                    onChange={img => { setImage(img); setImageError(null); }}
                />
            </FormSection>

            <FormSection title="Vehicle info">
                <View style={[styles.switchRow, { backgroundColor: c.chip }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.switchTitle, { color: c.text }]}>Primary car</Text>
                        <Text style={[styles.switchSub, { color: c.muted }]}>Show this car first on your profile</Text>
                    </View>
                    <Switch
                        value={v.PrimaryCar}
                        onValueChange={val => form.set('PrimaryCar', val)}
                        trackColor={{ false: c.divider, true: accent }}
                        thumbColor="#fff"
                    />
                </View>

                <FormField label="Vehicle name" required placeholder="e.g. My Daily Beast" autoCapitalize="words" maxLength={60} {...field('vehicleName')} />
                <FormField label="Make" required placeholder="e.g. Toyota" autoCapitalize="words" {...field('make')} />
                <FormField label="Model" required placeholder="e.g. Supra" autoCapitalize="words" {...field('model')} />
                <FormField label="Year" required placeholder="e.g. 2021" {...numeric('year', 4)} />
                <FormField label="Body type" placeholder="e.g. Coupe, SUV, Sedan" autoCapitalize="words" {...field('bodyType')} />
                <OptionChips label="Build stage" options={BUILD_STAGES} value={v.buildStage} onChange={val => form.set('buildStage', val)} />
            </FormSection>

            <FormSection title="Power">
                <FormField label="Engine" placeholder="e.g. 3.0L Twin-Turbo I6" {...field('engine')} />
                <FormField label="Horsepower (HP)" placeholder="e.g. 382" {...numeric('horsepower', 4)} />
                <FormField label="Torque (lb-ft)" placeholder="e.g. 368" {...numeric('torque', 4)} />
                <OptionChips label="Drivetrain" options={DRIVETRAINS} value={v.drivetrain} onChange={val => form.set('drivetrain', val)} />
                <OptionChips label="Transmission" options={TRANSMISSIONS} value={v.transmission} onChange={val => form.set('transmission', val)} />
            </FormSection>

            <FormSection title="Performance & status">
                <FormField label="0–60 time (sec)" placeholder="e.g. 4.1" {...decimal('zeroToSixty')} />
                <FormField label="Quarter mile (sec)" placeholder="e.g. 12.3" {...decimal('quarterMile')} />
                <FormField label="Mileage" placeholder="e.g. 25000" {...numeric('mileage', 8)} />
                <FormField label="Current price (₹)" placeholder="e.g. 3500000" {...numeric('currentPrice', 10)} />
            </FormSection>

            <FormSection title="Modifications" hint="Type a mod and tap + (or use commas)">
                <ChipInput label="Performance mods" items={v.performance} onChange={val => form.set('performance', val)} placeholder="e.g. Stage 2 tune" />
                <ChipInput label="Suspension" items={v.suspension} onChange={val => form.set('suspension', val)} placeholder="e.g. Coilovers" />
                <ChipInput label="Brakes" items={v.brakes} onChange={val => form.set('brakes', val)} placeholder="e.g. Big brake kit" />
            </FormSection>

            <FormSection title="Style">
                <FormField label="Paint / Wrap" placeholder="e.g. Matte black wrap" {...field('paintWrap')} />
                <ChipInput label="Exterior mods" items={v.exteriorMods} onChange={val => form.set('exteriorMods', val)} placeholder="e.g. Carbon spoiler" />
                <ChipInput label="Interior mods" items={v.interiorMods} onChange={val => form.set('interiorMods', val)} placeholder="e.g. Bucket seats" />
            </FormSection>

            <FormSection title="Owner note">
                <FormField
                    placeholder="Tell people about your build..." multiline maxLength={500} showCounter
                    autoCapitalize="sentences" {...field('ownerNote')}
                />
            </FormSection>
        </FormScreen>
    );
};

const styles = StyleSheet.create({
    switchRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, marginBottom: 14 },
    switchTitle: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    switchSub: { fontSize: 12, marginTop: 1, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default AddVehicleSpecs;
