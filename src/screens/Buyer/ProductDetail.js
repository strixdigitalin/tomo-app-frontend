import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    FlatList,
    Dimensions,
    Modal
} from 'react-native';
import { useSelector } from 'react-redux';
import { BackIcon, Search } from '../../assets/SVGs/index';
import IMG from '../../assets/Images';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import Row from '../../components/wrapper/row';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { App_Primary_color } from '../../common/Colors/colors';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { apiGet, apiPost } from '../../utils/Apis';
import useLoader from '../../utils/LoaderHook';
import urls from '../../config/urls';
import StarRating from 'react-native-star-rating-widget';
import { ToastMsg } from '../../utils/helperFunctions';

// Small label/value row used across the spec sections below (Power, Modifications,
// Style, Status & Performance, Seller) — mirrors the web's <DetailRow />.
const SpecRow = ({ label, value, last }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    if (!value) return null;
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 8,
                borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
                borderBottomColor: isDarkMode ? '#2a2a2a' : '#eee',
            }}
        >
            <Text style={{ fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                {label}
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    fontFamily: FONTS_FAMILY.SourceSans3_Medium,
                    color: isDarkMode ? 'white' : '#111827',
                    flexShrink: 1,
                    textAlign: 'right',
                    maxWidth: '60%',
                    marginLeft: 12,
                }}
                numberOfLines={2}
            >
                {value}
            </Text>
        </View>
    );
};

const windowWidth = Dimensions.get('window').width;

const ProductDetail = ({ navigation, route }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const [message, setMessage] = useState('Is this still available? 😊');
    const isFocused = useIsFocused();
    const [productData, setProductData] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const { showLoader, hideLoader } = useLoader();
    const [reviewData, setReviewData]=useState(null)

    useEffect(() => {
        fetchData();
        fetchReviewData()
    }, [isFocused]);

    const fetchData = async () => {
        try {
            showLoader();
            const res = await apiGet(`${urls.productDetails}/${route?.params?.productId}`);

            setProductData(res?.data);
            hideLoader();
        } catch (error) {
            hideLoader();
            console.error('Error fetching product:', error);
        }
    };

     const fetchReviewData = async () => {
        try {
            showLoader();
            const res = await apiGet(`/api/user/GetAllReviewofaProduct/${route?.params?.productId}`);

            setReviewData(res?.data);
            hideLoader();
        } catch (error) {
            hideLoader();
            console.error('Error fetching product:', error);
        }
    };

    const submitReview = async() => {
 if (rating === 0) {
            ToastMsg('Please select a rating');
            return;
        }
        if (!reviewText.trim()) {
            ToastMsg('Please write a review');
            return;
        }
        try {
          const  res= await  apiPost('/api/user/CreateProductReview', {
                "productId": productData?._id,
                "Rating": rating,
                "Review": reviewText
            })
            ToastMsg('Review Added Succesfully')
            fetchReviewData()
            
        } catch (error) {

        }


       

        setRating(0);
        setReviewText('');
        setShowReviewModal(false);
    };

    // ✅ Extract images from API response — a single local placeholder when there's none, same as web
    const productImages = productData?.Images || [];
    const displayImages = productImages.length > 0 ? productImages : [];

    // ✅ Extract shop/seller data
    const shopData = productData?.SellerShop || productData?.Shop || {};
    const shopName = shopData?.Name || 'Unknown Shop';
    const shopImage = shopData?.Image || null;
    const shopLocation = shopData?.Address?.[0]?.LocationName || 'Unknown Location';

    // ✅ Product details
    const productName = productData?.ProductName || 'Product Name';
    const productPrice = productData?.Price ? `₹${productData.Price}` : '₹0';
    const productDescription = productData?.Description || 'No description available';
    const productDetails = productData?.ProductDetails || '';

    // ✅ Seller (product owner) — used to open a chat, same as the web "Message" button
    const sellerUser = productData?.Seller || shopData?.Seller || null;

    // ✅ Extra spec sections — same fields the web product-detail page shows
    const vehicleInfo = productData?.VehicleInfo || null;
    const ownerNote = productData?.OwnerNote || '';
    const power = productData?.Power || null;
    const modifications = productData?.Modifications || null;
    const style = productData?.Style || null;
    const status = productData?.Status || null;
    const performanceStats = productData?.PerformanceStats || null;
    const shopCategories = shopData?.ShopCategory || [];

    const handleMessageSeller = () => {
        if (!sellerUser?._id) {
            ToastMsg('Seller info not available right now');
            return;
        }
        navigation.navigate('BuyerSellerChatScreen', { userForChat: sellerUser });
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? 'black' : '#f0f2f5' },
        headerContainer: { backgroundColor: isDarkMode ? '#252525' : 'white', paddingTop: 50, paddingBottom: 10 },
        imageGrid: { width: '100%', height: windowWidth * 0.8 },
        imageContainer: { flexDirection: 'row', flexWrap: 'wrap', height: '100%' },
        mainImage: { width: '50%', height: '66.7%', padding: 1 },
        secondaryImage: { width: '50%', height: '66.7%', padding: 1 },
        smallImage: { width: '33.3%', height: '33.3%', padding: 1 },
        plusOverlay: { position: 'absolute', right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
        plusText: { color: 'white', fontSize: 24, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        productDetailsContainer: { padding: 16, backgroundColor: isDarkMode ? '#121212' : 'white' },
        title: { fontSize: 24, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: isDarkMode ? 'white' : 'black' },
        price: { fontSize: 26, fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: isDarkMode ? 'white' : 'black', marginTop: 5 },
        listedInfo: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#b0b3b8' : '#65676b', marginTop: 5 },
        buildStageBadge: { backgroundColor: App_Primary_color, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
        buildStageBadgeText: { color: 'white', fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, fontSize: 12 },
        specSection: { backgroundColor: isDarkMode ? '#121212' : 'white', padding: 16, marginTop: 8 },
        specSectionTitle: { fontSize: 17, fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: isDarkMode ? 'white' : 'black', marginBottom: 10 },
        specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#2a2a2a' : '#eee' },
        specRowLast: { borderBottomWidth: 0 },
        specLabel: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#9CA3AF' : '#6B7280' },
        specValue: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: isDarkMode ? 'white' : 'black', flexShrink: 1, textAlign: 'right', maxWidth: '60%' },
        ownerNoteText: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Regular, fontStyle: 'italic', color: isDarkMode ? '#e4e6eb' : '#374151', lineHeight: 22 },
        shopCategoryChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: isDarkMode ? 'rgba(46,125,50,0.2)' : 'rgba(46,125,50,0.1)', marginRight: 6, marginBottom: 6 },
        shopCategoryChipText: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: App_Primary_color },
        sellerCard: { backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa', borderRadius: 12, padding: 16 },
        verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
        verifiedBadgeText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: '#1877f2' },
        messageContainer: { padding: 16, backgroundColor: isDarkMode ? '#121212' : 'white', marginVertical: 8, borderRadius: 12 },
        messageInput: { padding: 12, backgroundColor: isDarkMode ? '#3a3b3c' : '#f0f2f5', borderRadius: 20, color: isDarkMode ? 'white' : 'black', fontFamily: FONTS_FAMILY.SourceSans3_Regular, fontSize: 16, marginBottom: 10 },
        sendButton: { backgroundColor: App_Primary_color, borderRadius: 6, padding: 14, alignItems: 'center' },
        sendButtonText: { color: 'white', fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, fontSize: 16 },
        actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, backgroundColor: isDarkMode ? '#121212' : 'white', borderTopWidth: 1, borderBottomWidth: 1, borderColor: isDarkMode ? '#3a3b3c' : '#e4e6eb' },
        actionButton: { alignItems: 'center' },
        actionCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb', justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
        actionText: { fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#e4e6eb' : '#050505', fontSize: 14 },
        sectionTitle: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: isDarkMode ? 'white' : 'black', marginBottom: 12 },
        descriptionText: { fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#e4e6eb' : '#050505', fontSize: 16, lineHeight: 24, marginBottom: 4 },
        sellerContainer: { backgroundColor: isDarkMode ? '#121212' : 'white', padding: 16, marginTop: 8 },
        sellerInfoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
        sellerProfileContainer: { flexDirection: 'row', alignItems: 'center' },
        sellerImage: { width: 44, height: 44, borderRadius: 22 },
        sellerName: { fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, fontSize: 16, color: isDarkMode ? 'white' : 'black', marginLeft: 10 },
        followButton: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8 },
        followText: { fontSize: 14, fontWeight: '600' },
        mapContainer: { backgroundColor: isDarkMode ? '#121212' : '#e4e6eb', borderRadius: 8, marginVertical: 8, justifyContent: 'center', alignItems: 'center' },
        mapText: { fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: 'black', fontSize: 16, position: 'absolute' },
        groupsContainer: { backgroundColor: isDarkMode ? '#121212' : 'white', padding: 16, marginTop: 8 },
        groupItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
        groupInfoContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
        groupImage: { width: 50, height: 50, borderRadius: 4 },
        groupTextContainer: { marginLeft: 12, flex: 1 },
        groupName: { fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, fontSize: 16, color: isDarkMode ? 'white' : 'black' },
        groupMembers: { fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#b0b3b8' : '#65676b', fontSize: 14 },
        joinButton: { borderWidth: 1, borderColor: '#1877f2', borderRadius: 6, paddingHorizontal: 20, paddingVertical: 6 },
        joinText: { fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: '#1877f2', fontSize: 14 },
        backButton: { flexDirection: 'row', alignItems: 'center' },
        headerTitle: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: isDarkMode ? 'white' : 'black', marginLeft: 10 },

        // PART 2 - Continue from Part 1

        reviewsContainer: { backgroundColor: isDarkMode ? '#121212' : 'white', padding: 16, marginTop: 8 },
        reviewsHeaderCard: { backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa', borderRadius: 12, padding: 16, marginBottom: 16 },
        ratingOverviewContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        leftRatingSection: { alignItems: 'center' },
        averageRatingText: { fontSize: 48, fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: isDarkMode ? 'white' : 'black' },
        outOfText: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#b0b3b8' : '#65676b', marginTop: -5 },
        totalReviewsText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#b0b3b8' : '#65676b', marginTop: 4 },
        rightRatingSection: { flex: 1, marginLeft: 20 },
        ratingBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
        ratingBarLabel: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: isDarkMode ? '#e4e6eb' : '#050505', width: 20 },
        ratingBarContainer: { flex: 1, height: 8, backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb', borderRadius: 4, marginHorizontal: 8, overflow: 'hidden' },
        ratingBarFill: { height: '100%', backgroundColor: '#FFD700', borderRadius: 4 },
        ratingBarCount: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#b0b3b8' : '#65676b', width: 25, textAlign: 'right' },
        writeReviewButton: { backgroundColor: App_Primary_color, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginBottom: 16 },
        writeReviewButtonText: { color: 'white', fontFamily: FONTS_FAMILY.SourceSans3_Bold, fontSize: 16 },
        filterContainer: { flexDirection: 'row', marginBottom: 16 },
        filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb', marginRight: 8 },
        filterChipActive: { backgroundColor: App_Primary_color },
        filterChipText: { fontFamily: FONTS_FAMILY.SourceSans3_Medium, fontSize: 14, color: isDarkMode ? '#e4e6eb' : '#050505' },
        filterChipTextActive: { color: 'white' },
        reviewsList: { marginTop: 8 },
        reviewCard: { backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa', borderRadius: 12, padding: 16, marginBottom: 12 },
        reviewHeader: { flexDirection: 'row', marginBottom: 12 },
        reviewUserImage: { width: 48, height: 48, borderRadius: 24 },
        reviewUserInfo: { marginLeft: 12, flex: 1 },
        reviewUserName: { fontFamily: FONTS_FAMILY.SourceSans3_Bold, fontSize: 16, color: isDarkMode ? 'white' : 'black', marginBottom: 4 },
        reviewRatingRow: { flexDirection: 'row', alignItems: 'center' },
        reviewDate: { fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#b0b3b8' : '#65676b', fontSize: 13, marginLeft: 8 },
        reviewComment: { fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#e4e6eb' : '#050505', fontSize: 15, lineHeight: 22, marginBottom: 12 },
        reviewFooter: { flexDirection: 'row', alignItems: 'center' },
        helpfulButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
        helpfulText: { fontFamily: FONTS_FAMILY.SourceSans3_Medium, fontSize: 13, color: isDarkMode ? '#e4e6eb' : '#050505', marginLeft: 4 },
        emptyReviewsContainer: { alignItems: 'center', paddingVertical: 40 },
        emptyReviewsText: { fontFamily: FONTS_FAMILY.SourceSans3_Regular, fontSize: 16, color: isDarkMode ? '#b0b3b8' : '#65676b', textAlign: 'center' },
        modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
        modalContent: { backgroundColor: isDarkMode ? '#252525' : 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
        modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
        modalTitle: { fontSize: 24, fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: isDarkMode ? 'white' : 'black' },
        closeButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb', justifyContent: 'center', alignItems: 'center' },
        ratingSection: { alignItems: 'center', backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa', borderRadius: 12, padding: 20, marginBottom: 20 },
        ratingLabel: { fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: isDarkMode ? 'white' : 'black', fontSize: 18, marginBottom: 12 },
        selectedRatingText: { fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: isDarkMode ? '#b0b3b8' : '#65676b', fontSize: 14, marginTop: 8 },
        reviewInputContainer: { marginBottom: 20 },
        reviewInputLabel: { fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: isDarkMode ? 'white' : 'black', fontSize: 16, marginBottom: 10 },
        reviewTextInput: { backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa', borderRadius: 12, padding: 16, color: isDarkMode ? 'white' : 'black', fontFamily: FONTS_FAMILY.SourceSans3_Regular, fontSize: 15, minHeight: 140, textAlignVertical: 'top', borderWidth: 1, borderColor: isDarkMode ? '#3a3b3c' : '#e4e6eb' },
        characterCount: { textAlign: 'right', fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#b0b3b8' : '#65676b', fontSize: 12, marginTop: 6, },
        submitReviewButton: { backgroundColor: App_Primary_color, borderRadius: 12, paddingVertical: 16, alignItems: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
        submitReviewButtonText: { color: 'white', fontFamily: FONTS_FAMILY.SourceSans3_Bold, fontSize: 17 },
    });

    const renderReviewItem = ({ item }) => (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <Image source={item.User?.Image ? { uri: item.User.Image } : IMG.ProfileImagePost} style={styles.reviewUserImage} />
                <View style={styles.reviewUserInfo}>
                    <CustomText style={styles.reviewUserName}>{item.User?.FullName || item.User?.UserName}</CustomText>
                    <View style={styles.reviewRatingRow}>
                        <StarRating rating={item.Rating} onChange={() => { }} starSize={16} color="#FFD700" enableHalfStar={true} disabled={true} />
                        {!!item?.createdAt && (
                            <CustomText style={styles.reviewDate}>• {new Date(item.createdAt).toLocaleDateString()}</CustomText>
                        )}
                    </View>
                </View>
            </View>
            <CustomText style={styles.reviewComment}>{item?.Review}</CustomText>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />
            <View style={styles.headerContainer}>
                <SpaceBetweenRow style={{ paddingHorizontal: 20 }}>
                    <View style={styles.backButton}>
                        <TouchableOpacity onPress={() => navigation.goBack()}><BackIcon /></TouchableOpacity>
                        <CustomText style={styles.headerTitle}>{productName}</CustomText>
                    </View>
                    <TouchableOpacity><Search /></TouchableOpacity>
                </SpaceBetweenRow>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ✅ IMAGES SECTION - From API */}
                <View style={styles.imageGrid}>
                    <View style={styles.imageContainer}>
                        {displayImages.length === 0 && (
                            <Image source={IMG.PostImage} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                        )}
                        {displayImages.length >= 1 && (
                            <Image source={{ uri: displayImages[0] }} style={styles.mainImage} />
                        )}
                        {displayImages.length >= 2 && (
                            <Image source={{ uri: displayImages[1] }} style={styles.secondaryImage} />
                        )}
                        {displayImages.length >= 3 && (
                            <Image source={{ uri: displayImages[2] }} style={styles.smallImage} />
                        )}
                        {displayImages.length >= 4 && (
                            <Image source={{ uri: displayImages[3] }} style={styles.smallImage} />
                        )}
                        {displayImages.length >= 5 && (
                            <View style={styles.smallImage}>
                                <Image source={{ uri: displayImages[4] }} style={{ width: '100%', height: '100%' }} />
                                {displayImages.length > 5 && (
                                    <View style={styles.plusOverlay}>
                                        <CustomText style={styles.plusText}>+{displayImages.length - 5}</CustomText>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </View>

                {/* ✅ PRODUCT DETAILS - From API */}
                <View style={styles.productDetailsContainer}>
                    <SpaceBetweenRow>
                        <CustomText style={[styles.title, { flex: 1 }]}>{productName}</CustomText>
                        {!!status?.buildStage && (
                            <View style={styles.buildStageBadge}>
                                <CustomText style={styles.buildStageBadgeText}>{status.buildStage}</CustomText>
                            </View>
                        )}
                    </SpaceBetweenRow>
                    <CustomText style={styles.price}>{productPrice}</CustomText>
                    <CustomText style={styles.listedInfo}>
                        Listed in {shopLocation}
                    </CustomText>
                    {!!vehicleInfo && (
                        <CustomText style={[styles.listedInfo, { marginTop: 4 }]}>
                            {[vehicleInfo?.make, vehicleInfo?.model, vehicleInfo?.year, vehicleInfo?.bodyType]
                                .filter(Boolean)
                                .join(' • ')}
                        </CustomText>
                    )}
                </View>

                {/* MESSAGE SECTION */}
                <View style={styles.messageContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Image source={shopImage ? { uri: shopImage } : IMG.PostImage} style={{ width: 24, height: 24, borderRadius: 12 }} />
                        <CustomText style={{ marginLeft: 8, color: isDarkMode ? 'white' : 'black', fontFamily: FONTS_FAMILY.SourceSans3_SemiBold }}>
                            Send seller a message
                        </CustomText>
                    </View>
                    <TextInput
                        style={styles.messageInput}
                        value={message}
                        onChangeText={setMessage}
                        placeholderTextColor={isDarkMode ? '#b0b3b8' : '#65676b'}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleMessageSeller}>
                        <CustomText style={styles.sendButtonText}>Send</CustomText>
                    </TouchableOpacity>
                </View>

                {/* ✅ DESCRIPTION - From API */}
                <View style={[styles.productDetailsContainer, { marginTop: 8 }]}>
                    <CustomText style={styles.sectionTitle}>Description</CustomText>
                    <CustomText style={styles.descriptionText}>{productDescription}</CustomText>
                    {productDetails ? (
                        <CustomText style={[styles.descriptionText, { marginTop: 8 }]}>
                            {productDetails}
                        </CustomText>
                    ) : null}
                </View>

                {/* ✅ OWNER NOTE - From API */}
                {!!ownerNote && (
                    <View style={[styles.productDetailsContainer, { marginTop: 8 }]}>
                        <CustomText style={styles.sectionTitle}>Owner Note</CustomText>
                        <CustomText style={styles.ownerNoteText}>"{ownerNote}"</CustomText>
                    </View>
                )}

                {/* ⚡ POWER - From API */}
                {!!power && (
                    <View style={styles.specSection}>
                        <CustomText style={styles.specSectionTitle}>⚡ Power</CustomText>
                        <SpecRow label="Engine" value={power?.engine} />
                        <SpecRow label="HP / Torque" value={power?.horsepower ? `${power.horsepower} HP / ${power.torque} Nm` : null} />
                        <SpecRow label="Drivetrain" value={power?.drivetrain} />
                        <SpecRow label="Transmission" value={power?.transmission} last />
                    </View>
                )}

                {/* 🛠️ MODIFICATIONS - From API */}
                {!!modifications && (
                    <View style={styles.specSection}>
                        <CustomText style={styles.specSectionTitle}>🛠️ Modifications</CustomText>
                        <SpecRow label="Performance" value={modifications?.performance?.join(', ') || 'Stock'} />
                        <SpecRow label="Suspension" value={modifications?.suspension?.join(', ') || 'Stock'} />
                        <SpecRow label="Brakes" value={modifications?.brakes?.join(', ') || 'Stock'} last />
                    </View>
                )}

                {/* 🎨 STYLE - From API */}
                {!!style && (
                    <View style={styles.specSection}>
                        <CustomText style={styles.specSectionTitle}>🎨 Style</CustomText>
                        <SpecRow label="Paint / Wrap" value={style?.paintWrap || 'None'} />
                        <SpecRow label="Exterior Mods" value={style?.exteriorMods?.join(', ') || 'None'} />
                        <SpecRow label="Interior Mods" value={style?.interiorMods?.join(', ') || 'None'} last />
                    </View>
                )}

                {/* 📊 STATUS & PERFORMANCE - From API */}
                {(!!status || !!performanceStats) && (
                    <View style={styles.specSection}>
                        <CustomText style={styles.specSectionTitle}>📊 Status & Performance</CustomText>
                        <SpecRow label="Mileage" value={status?.mileage ? `${Number(status.mileage).toLocaleString()} km` : null} />
                        <SpecRow label="Build Stage" value={status?.buildStage} />
                        <SpecRow label="0-60" value={performanceStats?.zeroToSixty} />
                        <SpecRow label="Quarter Mile" value={performanceStats?.quarterMile} last />
                    </View>
                )}

                {/* ✅ SELLER SHOP INFO - From API */}
                <View style={styles.sellerContainer}>
                    <SpaceBetweenRow style={styles.sellerInfoContainer}>
                        <View style={styles.sellerProfileContainer}>
                            <Image source={shopImage ? { uri: shopImage } : IMG.PostImage} style={styles.sellerImage} />
                            <CustomText style={styles.sellerName}>{shopName}</CustomText>
                        </View>
                    </SpaceBetweenRow>
                    {!!shopLocation && (
                        <CustomText style={[styles.listedInfo, { marginTop: -8 }]}>{shopLocation}</CustomText>
                    )}
                    {shopCategories.length > 0 && (
                        <Row style={{ flexWrap: 'wrap', marginTop: 10 }}>
                            {shopCategories.map((cat, idx) => (
                                <View key={idx} style={styles.shopCategoryChip}>
                                    <CustomText style={styles.shopCategoryChipText}>{cat}</CustomText>
                                </View>
                            ))}
                        </Row>
                    )}
                </View>

                {/* 👤 SELLER (person) INFO - From API */}
                {!!sellerUser && (
                    <View style={[styles.specSection]}>
                        <SpaceBetweenRow style={{ marginBottom: 4 }}>
                            <CustomText style={styles.specSectionTitle}>👤 Seller</CustomText>
                            {!!sellerUser?.IsVerified && (
                                <Row style={styles.verifiedBadge}>
                                    <CustomText style={styles.verifiedBadgeText}>✔ Verified</CustomText>
                                </Row>
                            )}
                        </SpaceBetweenRow>
                        <View style={styles.sellerCard}>
                            <SpecRow label="Name" value={sellerUser?.FullName} />
                            <SpecRow label="Store" value={sellerUser?.StoreName} />
                            {!!sellerUser?.ShowEmail && <SpecRow label="Email" value={sellerUser?.Email} />}
                            {!!sellerUser?.ShowMobile && <SpecRow label="Mobile" value={sellerUser?.MobileNumber} />}
                            {!!sellerUser?.ShowAddress && <SpecRow label="Location" value={sellerUser?.Location?.City} />}
                            <SpecRow label="Website" value={sellerUser?.Website} last />
                        </View>
                    </View>
                )}

                {/* REVIEWS SECTION */}
                <View style={styles.reviewsContainer}>
                    <CustomText style={styles.sectionTitle}>Reviews & Ratings</CustomText>
                    <View style={styles.reviewsHeaderCard}>
                        <View style={styles.leftRatingSection}>
                            <CustomText style={styles.averageRatingText}>{reviewData?.averageRating || 0}</CustomText>
                            <CustomText style={styles.outOfText}>out of 5</CustomText>
                            <StarRating
                                rating={parseFloat(reviewData?.averageRating) || 0}
                                onChange={() => { }}
                                starSize={24}
                                color="#FFD700"
                                enableHalfStar
                                disabled
                                style={{ marginTop: 8 }}
                            />
                            <CustomText style={styles.totalReviewsText}>
                                {reviewData?.totalReviews || 0} {reviewData?.totalReviews === 1 ? 'review' : 'reviews'}
                            </CustomText>
                            <TouchableOpacity
                                style={styles.writeReviewButton}
                                onPress={() => setShowReviewModal(true)}
                            >
                                <CustomText style={styles.writeReviewButtonText}>✍️ Write a Review</CustomText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {reviewData?.reviews?.length > 0 ? (
                        <FlatList
                            data={reviewData.reviews}
                            renderItem={renderReviewItem}
                            keyExtractor={(item) => item?._id}
                            scrollEnabled={false}
                            style={styles.reviewsList}
                        />
                    ) : (
                        <View style={styles.emptyReviewsContainer}>
                            <CustomText style={styles.emptyReviewsText}>
                                No reviews yet
                            </CustomText>
                        </View>
                    )}
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>

            {/* REVIEW MODAL */}
            <Modal
                visible={showReviewModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowReviewModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <CustomText style={styles.modalTitle}>Write a Review</CustomText>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => {
                                    setShowReviewModal(false);
                                    setRating(0);
                                    setReviewText('');
                                }}
                            >
                                <CustomText style={{ fontSize: 18 }}>✕</CustomText>
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.ratingSection}>
                                <CustomText style={styles.ratingLabel}>Rate this product</CustomText>
                                <StarRating
                                    rating={rating}
                                    onChange={setRating}
                                    starSize={44}
                                    color="#FFD700"
                                    enableHalfStar={false}
                                />
                                {rating > 0 && (
                                    <CustomText style={styles.selectedRatingText}>
                                        {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good!' : rating === 3 ? 'Good!' : rating === 2 ? 'Fair' : 'Poor'}
                                    </CustomText>
                                )}
                            </View>
                            <View style={styles.reviewInputContainer}>
                                <CustomText style={styles.reviewInputLabel}>Share your experience</CustomText>
                                <TextInput
                                    style={styles.reviewTextInput}
                                    placeholder="Tell us what you think about this product..."
                                    placeholderTextColor={isDarkMode ? '#b0b3b8' : '#65676b'}
                                    value={reviewText}
                                    onChangeText={setReviewText}
                                    multiline
                                    maxLength={500}
                                />
                                <CustomText style={styles.characterCount}>
                                    {reviewText.length}/500
                                </CustomText>
                            </View>
                            <TouchableOpacity style={styles.submitReviewButton} onPress={submitReview}>
                                <CustomText style={styles.submitReviewButtonText}>Submit Review</CustomText>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ProductDetail;