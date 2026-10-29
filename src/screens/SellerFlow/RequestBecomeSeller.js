import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Platform, Text, View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import FormScreen, { FormSection } from '../../components/FormScreen';
import FormButton from '../../components/FormButton';
import ImageUploadBox from '../../components/ImageUploadBox';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { BASE_URL, apiGet, getItem } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import urls from '../../config/urls';
import { THEMES } from '../../redux/reducer/theme';
import { profilePalette } from '../UserDetail/profileTheme';

// Request to become a seller — web's Pages/More/BecomeSeller.jsx: one document (Aadhar card
// image) and a status panel (NotAdded / Pending / Approved / Rejected).
const RequestBecomSeller = ({ navigation }) => {
    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
    const c = profilePalette(isDarkMode, accent);

    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [imageError, setImageError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchProfile = useCallback(async () => {
        try {
            const res = await apiGet(urls.userProfile);
            setStatus(res?.data?.SellerStatus || 'NotAdded');
        } catch (error) {
            console.log('RequestBecomSeller profile fetch error', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { fetchProfile(); }, [fetchProfile]));

    const onSubmit = useCallback(async () => {
        if (!image?.uri) {
            setImageError('Please select your Aadhar Card image before submitting');
            return ToastMsg('Please select Aadhar Card image before submitting!');
        }
        try {
            setSubmitting(true);
            const token = await getItem('token');
            const fd = new FormData();
            fd.append('AadharCard', {
                uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
                type: image.type || 'image/jpeg',
                name: image.name || 'aadhar.jpg',
            });
            const res = await fetch(`${BASE_URL}/api/user/CreateBecomeSellerReq`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const result = await res.json();
            ToastMsg(result?.message || 'Request submitted');
            if (res.ok) {
                setImage(null);
                fetchProfile();
            }
        } catch (error) {
            console.log('RequestBecomSeller submit error', error);
            ToastMsg('Something went wrong, please try again');
        } finally {
            setSubmitting(false);
        }
    }, [image, fetchProfile]);

    const canSubmit = status === 'NotAdded' || status === 'Rejected';

    const banner = (icon, color, bg, text) => (
        <View style={[styles.banner, { borderColor: color, backgroundColor: bg }]}>
            <Feather name={icon} size={34} color={color} />
            <Text style={[styles.bannerText, { color }]}>{text}</Text>
        </View>
    );

    return (
        <FormScreen
            title="Become a Seller"
            subtitle="Verify your identity to start selling"
            onBack={() => navigation.goBack()}
            footer={canSubmit ? <FormButton label="Submit Request" onPress={onSubmit} loading={submitting} /> : null}>
            {loading ? (
                <ActivityIndicator color={accent} size="large" style={{ marginTop: 60 }} />
            ) : status === 'Pending' ? (
                banner('clock', '#D97706', '#F59E0B1A', 'Your request is in review. Please wait for approval.')
            ) : status === 'Approved' ? (
                banner('check-circle', '#16A34A', '#22C55E1A', 'Your request is approved! You are now a Seller.')
            ) : (
                <FormSection
                    title="Identity document"
                    hint={status === 'Rejected'
                        ? 'Your last request was rejected. Please verify and upload your Aadhar Card again.'
                        : 'Upload a clear photo of your Aadhar Card'}>
                    <ImageUploadBox
                        label="Aadhar card" required image={image} error={imageError} height={220}
                        hint="Tap to select your Aadhar Card"
                        onChange={img => { setImage(img); setImageError(null); }}
                    />
                </FormSection>
            )}
        </FormScreen>
    );
};

const styles = StyleSheet.create({
    banner: { alignItems: 'center', padding: 28, borderRadius: 22, borderWidth: 1.5, marginTop: 20 },
    bannerText: { fontSize: 15, marginTop: 12, textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
});

export default RequestBecomSeller;
