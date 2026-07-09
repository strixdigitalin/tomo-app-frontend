import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { BackBlackSimple, BackIcon } from '../../assets/SVGs';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import GradientIcon from '../../components/GradientIcon';
import useLoader from '../../utils/LoaderHook';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import IMG from '../../assets/Images';

const MyPromotions = ({ navigation, route }) => {
    const [activePromotions, setActivePromotions] = useState([]);
    const [pastPromotions, setPastPromotions] = useState([]);
    const [showPast, setShowPast] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const { isDarkMode } = useSelector(state => state.theme);

    // TODO: Replace with actual API call
    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        showLoader();
        try {
            // TODO: Replace with actual API endpoint
            // const res = await apiGet(`${urls.getPromotions}/${route?.params?.shopId}`);
            
            // DUMMY DATA - Remove this when API is ready
            const dummyActive = [
                {
                    _id: '1',
                    productName: 'Summer Cotton T-Shirt',
                    productImage: null,
                    status: 'active',
                    spent: 156,
                    budget: 299,
                    daysLeft: 2,
                    reach: 624,
                    clicks: 34,
                    impressions: 1234,
                },
            ];

            const dummyPast = [
                {
                    _id: '2',
                    productName: 'Leather Wallet',
                    productImage: null,
                    status: 'completed',
                    spent: 599,
                    budget: 599,
                    reach: 2847,
                    clicks: 156,
                    impressions: 4923,
                },
            ];

            setActivePromotions(dummyActive);
            setPastPromotions(dummyPast);
        } catch (error) {
            console.error('Error fetching promotions:', error);
        } finally {
            hideLoader();
        }
    };

    const handlePausePromotion = (promotionId) => {
        // TODO: API call to pause promotion
        console.log('Pause promotion:', promotionId);
    };

    const handleViewDetails = (promotion) => {
        navigation.navigate('PromotionDetails', { promotion });
    };

    const renderPromotionCard = ({ item }) => {
        const isActive = item.status === 'active';
        const progressPercent = (item.spent / item.budget) * 100;

        return (
            <View
                style={[
                    styles.promotionCard,
                    { backgroundColor: isDarkMode ? '#252525' : '#fff' },
                ]}
            >
                <View style={styles.cardContent}>
                    <Image
                        source={item.productImage ? { uri: item.productImage } : IMG.PostImage}
                        style={styles.productThumb}
                        resizeMode="cover"
                    />
                    <View style={styles.cardInfo}>
                        <CustomText style={styles.productName} numberOfLines={1}>
                            {item.productName}
                        </CustomText>
                        
                        <View style={styles.statusBadge}>
                            {isActive ? (
                                <LinearGradient
                                    colors={['#4CAF50', '#45a049']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.badgeGradient}
                                >
                                    <CustomText style={styles.badgeText}>
                                        ● Running
                                    </CustomText>
                                </LinearGradient>
                            ) : (
                                <View
                                    style={[
                                        styles.badgeGradient,
                                        { backgroundColor: '#7d7d7d' },
                                    ]}
                                >
                                    <CustomText style={styles.badgeText}>
                                        ○ Completed
                                    </CustomText>
                                </View>
                            )}
                        </View>

                        {isActive && (
                            <>
                                <View style={styles.statRow}>
                                    <CustomText style={styles.statLabel}>Spent:</CustomText>
                                    <CustomText style={styles.statValue}>
                                        ₹{item.spent} of ₹{item.budget}
                                    </CustomText>
                                </View>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            { width: `${progressPercent}%` },
                                        ]}
                                    />
                                </View>
                                <View style={styles.statRow}>
                                    <CustomText style={styles.statLabel}>
                                        Time left:
                                    </CustomText>
                                    <CustomText style={styles.statValue}>
                                        {item.daysLeft} days
                                    </CustomText>
                                </View>
                            </>
                        )}

                        <View style={styles.statRow}>
                            <CustomText style={styles.statLabel}>Reach:</CustomText>
                            <CustomText style={styles.statValue}>
                                {item.reach.toLocaleString()} people
                            </CustomText>
                        </View>
                        <View style={styles.statRow}>
                            <CustomText style={styles.statLabel}>Clicks:</CustomText>
                            <CustomText style={styles.statValue}>
                                {item.clicks}
                            </CustomText>
                        </View>

                        <View style={styles.cardActions}>
                            <TouchableOpacity
                                style={[
                                    styles.actionButton,
                                    {
                                        borderColor: isDarkMode ? '#3a3a3a' : '#E4E4E4',
                                    },
                                ]}
                                onPress={() => handleViewDetails(item)}
                            >
                                <CustomText style={styles.actionButtonText}>
                                    View Details
                                </CustomText>
                            </TouchableOpacity>
                            {isActive && (
                                <TouchableOpacity
                                    style={[
                                        styles.actionButton,
                                        { borderColor: '#f44336' },
                                    ]}
                                    onPress={() => handlePausePromotion(item._id)}
                                >
                                    <CustomText
                                        style={[
                                            styles.actionButtonText,
                                            { color: '#f44336' },
                                        ]}
                                    >
                                        Pause
                                    </CustomText>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderHeader = () => (
        <SpaceBetweenRow
            style={[
                styles.header,
                { backgroundColor: isDarkMode ? '#252525' : 'white' },
            ]}
        >
            <TouchableOpacity onPress={() => navigation.goBack()}>
                {isDarkMode ? <BackIcon /> : <BackBlackSimple />}
            </TouchableOpacity>
            <CustomText style={styles.headerTitle}>My Promotions</CustomText>
            <View style={{ width: 24 }} />
        </SpaceBetweenRow>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : '#fff',
        },
        header: {
            paddingTop: 50,
            paddingHorizontal: 20,
            paddingBottom: 15,
        },
        headerTitle: {
            fontSize: 20,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        sectionHeader: {
            paddingHorizontal: 20,
            paddingVertical: 10,
        },
        sectionTitle: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            color: '#7d7d7d',
        },
        promotionCard: {
            marginHorizontal: 20,
            marginBottom: 15,
            borderRadius: 12,
            padding: 15,
            borderWidth: 1,
            borderColor: isDarkMode ? '#3a3a3a' : '#E4E4E4',
        },
        cardContent: {
            flexDirection: 'row',
            gap: 12,
        },
        productThumb: {
            width: 80,
            height: 80,
            borderRadius: 8,
        },
        cardInfo: {
            flex: 1,
        },
        productName: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            marginBottom: 8,
        },
        statusBadge: {
            alignSelf: 'flex-start',
            marginBottom: 10,
        },
        badgeGradient: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
        },
        badgeText: {
            fontSize: 11,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            color: '#fff',
        },
        statRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6,
        },
        statLabel: {
            fontSize: 13,
            color: '#7d7d7d',
        },
        statValue: {
            fontSize: 13,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
        },
        progressBar: {
            height: 6,
            backgroundColor: isDarkMode ? '#3a3a3a' : '#E4E4E4',
            borderRadius: 3,
            marginBottom: 8,
            overflow: 'hidden',
        },
        progressFill: {
            height: '100%',
            backgroundColor: '#21B7FF',
            borderRadius: 3,
        },
        cardActions: {
            flexDirection: 'row',
            gap: 10,
            marginTop: 12,
        },
        actionButton: {
            flex: 1,
            paddingVertical: 10,
            borderRadius: 8,
            borderWidth: 1,
            alignItems: 'center',
        },
        actionButtonText: {
            fontSize: 13,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
        },
        showPastButton: {
            marginHorizontal: 20,
            marginVertical: 10,
            paddingVertical: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: isDarkMode ? '#3a3a3a' : '#E4E4E4',
            alignItems: 'center',
        },
        showPastButtonText: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            color: '#21B7FF',
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 50,
        },
        emptyIcon: {
            marginBottom: 15,
        },
        emptyTitle: {
            fontSize: 18,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            marginBottom: 8,
        },
        emptyText: {
            fontSize: 14,
            color: '#7d7d7d',
            textAlign: 'center',
            marginBottom: 20,
        },
        createPromotionButton: {
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
        },
        createPromotionText: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: '#fff',
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            {renderHeader()}

            {activePromotions.length === 0 && pastPromotions.length === 0 ? (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                        <GradientIcon
                            colors={['#21B7FF', '#0084F8']}
                            size={64}
                            iconType="FontAwesome5"
                            name="chart-line"
                        />
                    </View>
                    <CustomText style={styles.emptyTitle}>
                        No Promotions Yet
                    </CustomText>
                    <CustomText style={styles.emptyText}>
                        Start promoting your products to reach more buyers
                    </CustomText>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <LinearGradient
                            colors={['#21B7FF', '#0084F8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.createPromotionButton}
                        >
                            <CustomText style={styles.createPromotionText}>
                                Create First Promotion
                            </CustomText>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    ListHeaderComponent={
                        <>
                            {activePromotions.length > 0 && (
                                <View style={styles.sectionHeader}>
                                    <CustomText style={styles.sectionTitle}>
                                        🟢 ACTIVE ({activePromotions.length})
                                    </CustomText>
                                </View>
                            )}
                        </>
                    }
                    data={activePromotions}
                    keyExtractor={(item) => item._id}
                    renderItem={renderPromotionCard}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        <>
                            {pastPromotions.length > 0 && (
                                <>
                                    <View style={styles.sectionHeader}>
                                        <CustomText style={styles.sectionTitle}>
                                            ⚪ PAST ({pastPromotions.length})
                                        </CustomText>
                                    </View>
                                    {showPast ? (
                                        <FlatList
                                            data={pastPromotions}
                                            keyExtractor={(item) => item._id}
                                            renderItem={renderPromotionCard}
                                            scrollEnabled={false}
                                        />
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.showPastButton}
                                            onPress={() => setShowPast(true)}
                                        >
                                            <CustomText style={styles.showPastButtonText}>
                                                Show Past Promotions
                                            </CustomText>
                                        </TouchableOpacity>
                                    )}
                                </>
                            )}
                            <View style={{ height: 50 }} />
                        </>
                    }
                />
            )}
        </View>
    );
};

export default MyPromotions;