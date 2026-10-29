import React, { useState } from 'react';
import { View, Modal, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import RatingBar from '../../components/RatingBar';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { apiPost } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import urls from '../../config/urls';
import { white } from '../../common/Colors/colors';
import useThemeColor from '../../utils/useThemeColor';

// Matches web's Pages/AllUsers/CreateCarReviewModal.jsx — rate another user's
// car (1-5 stars + optional review text), same CreateCarRating endpoint.
const CarRatingModal = ({ visible, onClose, carId, onSubmitted }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async () => {
        if (!rating) return ToastMsg('Please select a rating');
        try {
            setSubmitting(true);
            const res = await apiPost(urls.createCarRating, { carId, Rating: rating, Review: review });
            ToastMsg(res?.message || 'Review created successfully');
            setRating(0);
            setReview('');
            onSubmitted?.();
            onClose();
        } catch (error) {
            ToastMsg(error?.message || 'Failed to add review');
        } finally {
            setSubmitting(false);
        }
    };

    const styles = StyleSheet.create({
        overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 30 },
        card: { width: '100%', backgroundColor: isDarkMode ? '#131B2B' : '#FFFFFF', borderRadius: 20, padding: 22 },
        title: { fontSize: 17, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textAlign: 'center' },
        starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 18 },
        ratingLabel: { fontSize: 13, textAlign: 'center', marginTop: 8, color: isDarkMode ? '#94A3B8' : '#64748B' },
        input: {
            borderWidth: 1, borderColor: isDarkMode ? '#1E293B' : '#E2E8F0', borderRadius: 12,
            paddingHorizontal: 14, paddingVertical: 12, color: isDarkMode ? white : '#111',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular, fontSize: 14, minHeight: 80, textAlignVertical: 'top',
            backgroundColor: isDarkMode ? '#131B2B' : '#FFFFFF', marginTop: 18,
        },
        row: { flexDirection: 'row', gap: 12, marginTop: 20 },
        btn: { flex: 1, paddingVertical: 13, borderRadius: 14, alignItems: 'center' },
        cancelBtn: { backgroundColor: isDarkMode ? '#1B2538' : '#F1F5F9' },
        cancelText: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: isDarkMode ? '#fff' : '#111' },
        submitBtn: { backgroundColor: primaryColor },
        submitText: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: white },
    });

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <CustomText style={styles.title}>Rate this Car</CustomText>
                    <RatingBar value={rating} onChange={setRating} />
                    <CustomText style={styles.ratingLabel}>{rating > 0 ? `${rating} out of 5` : 'Select rating'}</CustomText>
                    <TextInput
                        style={styles.input}
                        multiline
                        placeholder="Write your review about this car..."
                        placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                        value={review}
                        onChangeText={setReview}
                        maxLength={500}
                    />
                    <View style={styles.row}>
                        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
                            <CustomText style={styles.cancelText}>Cancel</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.submitBtn]} onPress={onSubmit} disabled={submitting}>
                            <CustomText style={styles.submitText}>{submitting ? 'Please Wait...' : 'Submit'}</CustomText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CarRatingModal;
