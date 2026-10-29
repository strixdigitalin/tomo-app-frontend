import React, { useCallback, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    TextInput,
    Modal,
    FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import StarRating from 'react-native-star-rating-widget';
import RatingBar from '../../components/RatingBar';
import CustomText from '../../components/TextComponent';
import SafeImage from '../../components/SafeImage';
import { ConfirmDialog } from '../../components/ActionMenu';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { apiGet, apiPost, apiDelete } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import urls from '../../config/urls';
import { white } from '../../common/Colors/colors';
import useThemeColor from '../../utils/useThemeColor';
import { productTitle } from '../../utils/productFields';
import ProductSpecRows from '../../components/ProductSpecRows';

const { width } = Dimensions.get('window');

// Matches web's Pages/MarketPlace/Product/Productdetails.jsx — a "Listing"
// product's own detail + reviews page (separate endpoint from the Marketplace
// browsing flow's SellerProductdetails.jsx).
const ListingProductDetail = ({ navigation, route }) => {
    const { productId } = route?.params || {};
    const { isDarkMode, primaryColor } = useThemeColor();
    const insets = useSafeAreaInsets();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewData, setReviewData] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmDeleteReview, setConfirmDeleteReview] = useState(null);

    const fetchDetail = async () => {
        try {
            const res = await apiGet(`${urls.listingProductDetail}/${productId}`);
            setProduct(res?.data || null);
        } catch (error) {
            console.log('ListingProductDetail fetch error', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await apiGet(`${urls.listingProductReviews}/${productId}`);
            setReviewData(res?.data || null);
        } catch (error) {
            console.log('ListingProductDetail reviews error', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDetail();
            fetchReviews();
        }, [productId])
    );

    const deleteReview = async (review) => {
        try {
            const res = await apiDelete(`${urls.deleteProductReview}/${review?._id}`);
            ToastMsg(res?.message || 'Review deleted');
            fetchReviews();
        } catch (error) {
            ToastMsg(error?.message || 'Failed to delete review');
        }
    };

    const submitReview = async () => {
        if (rating === 0) return ToastMsg('Please select a rating');
        if (!reviewText.trim()) return ToastMsg('Please write a review');

        try {
            setSubmitting(true);
            await apiPost(urls.createProductReview, {
                productId,
                Rating: rating,
                Review: reviewText,
            });
            ToastMsg('Review added successfully');
            setRating(0);
            setReviewText('');
            setShowReviewModal(false);
            fetchReviews();
        } catch (error) {
            ToastMsg(error?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#0B1220' : '#EEF1F6' },
        image: { width, height: width * 0.8 },
        backBtn: {
            position: 'absolute', top: insets.top + 10, left: 16, zIndex: 10,
            width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        body: { padding: 20 },
        name: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        price: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: primaryColor, marginTop: 6 },
        sectionTitle: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginTop: 20, marginBottom: 8 },
        text: {
            fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#D1D5DB' : '#374151', lineHeight: 20,
        },
        shopChip: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
        shopChipText: { fontSize: 13, color: isDarkMode ? '#94A3B8' : '#64748B' },
        reviewsCard: {
            backgroundColor: isDarkMode ? '#131B2B' : '#FFFFFF', borderRadius: 16, padding: 18, marginTop: 10, alignItems: 'center',
        },
        avgRating: { fontSize: 40, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        outOf: { fontSize: 13, color: isDarkMode ? '#94A3B8' : '#64748B', marginTop: -4 },
        totalReviews: { fontSize: 13, color: isDarkMode ? '#94A3B8' : '#64748B', marginTop: 6 },
        writeReviewBtn: {
            marginTop: 14, backgroundColor: primaryColor, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12,
        },
        writeReviewBtnText: { color: white, fontFamily: FONTS_FAMILY.SourceSans3_Bold, fontSize: 14 },
        reviewCard: {
            backgroundColor: isDarkMode ? '#131B2B' : '#FFFFFF', borderRadius: 14, padding: 14, marginTop: 10,
        },
        reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
        reviewAvatar: { width: 36, height: 36, borderRadius: 18 },
        reviewName: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
        reviewText: {
            fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#D1D5DB' : '#374151', marginTop: 8, lineHeight: 19,
        },
        emptyReviews: {
            fontSize: 13, color: isDarkMode ? '#94A3B8' : '#64748B', textAlign: 'center', marginTop: 14,
        },
        modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
        modalContent: {
            backgroundColor: isDarkMode ? '#131B2B' : '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20,
        },
        modalTitle: { fontSize: 17, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginBottom: 14 },
        reviewInput: {
            backgroundColor: isDarkMode ? '#1B2538' : '#F1F5F9', borderRadius: 12, padding: 14, minHeight: 100,
            textAlignVertical: 'top', color: isDarkMode ? white : '#111', fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            fontSize: 14, marginTop: 14,
        },
        submitBtn: {
            marginTop: 16, backgroundColor: primaryColor, paddingVertical: 14, borderRadius: 14, alignItems: 'center',
        },
    });

    const images = Array.isArray(product?.Images) && product.Images.length > 0 ? product.Images : null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
                <Icon name="arrow-left" size={20} color={white} />
            </TouchableOpacity>

            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={primaryColor} size="large" />
                </View>
            ) : (
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    <SafeImage uri={images ? images[0] : null} style={styles.image} />
                    <View style={styles.body}>
                        <CustomText style={styles.name}>{productTitle(product)}</CustomText>
                        {!!product?.Price && <CustomText style={styles.price}>₹{Number(product.Price).toLocaleString()}</CustomText>}

                        {!!product?.Shop?.Name && (
                            <View style={styles.shopChip}>
                                <Icon name="shopping-bag" size={13} color={isDarkMode ? '#94A3B8' : '#64748B'} />
                                <CustomText style={[styles.shopChipText, { marginLeft: 6 }]}>{product.Shop.Name}</CustomText>
                            </View>
                        )}

                        <ProductSpecRows product={product} />

                        {!!product?.ProductDetails && (
                            <>
                                <CustomText style={styles.sectionTitle}>Product Details</CustomText>
                                <CustomText style={styles.text}>{product.ProductDetails}</CustomText>
                            </>
                        )}

                        {!!product?.Description && (
                            <>
                                <CustomText style={styles.sectionTitle}>Description</CustomText>
                                <CustomText style={styles.text}>{product.Description}</CustomText>
                            </>
                        )}

                        <CustomText style={styles.sectionTitle}>Reviews & Ratings</CustomText>
                        <View style={styles.reviewsCard}>
                            <CustomText style={styles.avgRating}>{reviewData?.averageRating || 0}</CustomText>
                            <CustomText style={styles.outOf}>out of 5</CustomText>
                            <StarRating
                                rating={parseFloat(reviewData?.averageRating) || 0}
                                onChange={() => {}}
                                starSize={20}
                                color="#FFD700"
                                enableHalfStar
                                disabled
                                style={{ marginTop: 6 }}
                            />
                            <CustomText style={styles.totalReviews}>
                                {reviewData?.totalReviews || 0} {reviewData?.totalReviews === 1 ? 'review' : 'reviews'}
                            </CustomText>
                            <TouchableOpacity style={styles.writeReviewBtn} onPress={() => setShowReviewModal(true)}>
                                <CustomText style={styles.writeReviewBtnText}>✍️ Write a Review</CustomText>
                            </TouchableOpacity>
                        </View>

                        {reviewData?.reviews?.length > 0 ? (
                            <FlatList
                                data={reviewData.reviews}
                                keyExtractor={(item) => item?._id}
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                    <View style={styles.reviewCard}>
                                        <View style={styles.reviewHeader}>
                                            <SafeImage uri={item?.User?.Image} style={styles.reviewAvatar} />
                                            <View style={{ flex: 1 }}>
                                                <CustomText style={styles.reviewName}>
                                                    {item?.User?.FullName || item?.User?.UserName}
                                                </CustomText>
                                                <StarRating
                                                    rating={item?.Rating || 0}
                                                    onChange={() => {}}
                                                    starSize={14}
                                                    color="#FFD700"
                                                    enableHalfStar
                                                    disabled
                                                />
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => setConfirmDeleteReview(item)}
                                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                            >
                                                <Icon name="trash-2" size={16} color="#EF4136" />
                                            </TouchableOpacity>
                                        </View>
                                        <CustomText style={styles.reviewText}>{item?.Review}</CustomText>
                                    </View>
                                )}
                            />
                        ) : (
                            <CustomText style={styles.emptyReviews}>No reviews yet</CustomText>
                        )}
                    </View>
                </ScrollView>
            )}

            <Modal visible={showReviewModal} transparent animationType="slide" onRequestClose={() => setShowReviewModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <CustomText style={styles.modalTitle}>Write a Review</CustomText>
                        <RatingBar value={rating} onChange={setRating} />
                        <TextInput
                            style={styles.reviewInput}
                            placeholder="Share your experience..."
                            maxLength={500}
                            placeholderTextColor={isDarkMode ? '#9CA3AF' : '#9CA3AF'}
                            value={reviewText}
                            onChangeText={setReviewText}
                            multiline
                        />
                        <TouchableOpacity style={styles.submitBtn} onPress={submitReview} disabled={submitting}>
                            <CustomText style={{ color: white, fontFamily: FONTS_FAMILY.SourceSans3_Bold, fontSize: 15 }}>
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: 12, alignItems: 'center' }} onPress={() => setShowReviewModal(false)}>
                            <CustomText style={{ color: isDarkMode ? '#94A3B8' : '#64748B' }}>Cancel</CustomText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ConfirmDialog
                visible={!!confirmDeleteReview}
                onClose={() => setConfirmDeleteReview(null)}
                title="Delete Review"
                message="Are you sure you want to delete this review? This cannot be undone."
                onConfirm={() => deleteReview(confirmDeleteReview)}
            />
        </View>
    );
};

export default ListingProductDetail;
