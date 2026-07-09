import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { BackBlackSimple, BackIcon } from '../../assets/SVGs';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
import GradientIcon from '../../components/GradientIcon';
import IMG from '../../assets/Images';

const BoostProduct = ({ navigation, route }) => {
    const { product, shopId } = route.params;
    const { isDarkMode } = useSelector(state => state.theme);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [step, setStep] = useState(1); // 1: Goals, 2: Plans, 3: Review
    const goalStepTimerRef = useRef(null);

    const goals = [
        {
            id: 'profile',
            icon: 'user',
            title: 'More Profile Visits',
            desc: 'Get people to visit your shop profile',
        },
        {
            id: 'product',
            icon: 'eye',
            title: 'More Product Views',
            desc: 'Increase views on this product',
        },
        {
            id: 'sales',
            icon: 'shopping-cart',
            title: 'More Sales',
            desc: 'Drive direct purchases',
        },
    ];

    const plans = [
        {
            id: 1,
            price: 299,
            days: 3,
            reach: '500-1,000',
            impressions: 1500,
            clicks: '20-40',
        },
        {
            id: 2,
            price: 599,
            days: 7,
            reach: '1,500-3,000',
            impressions: 5000,
            clicks: '50-100',
            popular: true,
        },
        {
            id: 3,
            price: 999,
            days: 15,
            reach: '5,000-10,000',
            impressions: 15000,
            clicks: '150-300',
        },
    ];

    useEffect(() => {
        return () => {
            if (goalStepTimerRef.current) {
                clearTimeout(goalStepTimerRef.current);
            }
        };
    }, []);

    const handleGoalSelect = (goalId) => {
        setSelectedGoal(goalId);
        if (goalStepTimerRef.current) {
            clearTimeout(goalStepTimerRef.current);
        }
        goalStepTimerRef.current = setTimeout(() => setStep(2), 300);
    };

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
    };

    const handleContinue = () => {
        if (step === 2 && selectedPlan) {
            setStep(3);
        }
    };

    const handleCreatePromotion = () => {
        // TODO: API call to create promotion
        // For now, navigate to success screen
        navigation.navigate('BoostSuccess', {
            product,
            plan: plans.find(p => p.id === selectedPlan),
        });
    };

    const renderHeader = () => (
        <SpaceBetweenRow
            style={[
                styles.header,
                { backgroundColor: isDarkMode ? '#252525' : 'white' },
            ]}
        >
            <TouchableOpacity onPress={() => step === 1 ? navigation.goBack() : setStep(step - 1)}>
                {isDarkMode ? <BackIcon /> : <BackBlackSimple />}
            </TouchableOpacity>
            <CustomText style={styles.headerTitle}>
                {step === 1 && 'Choose Goal'}
                {step === 2 && 'Select Plan'}
                {step === 3 && 'Review'}
            </CustomText>
            <View style={{ width: 24 }} />
        </SpaceBetweenRow>
    );

    const renderProductPreview = () => (
        <View
            style={[
                styles.productPreview,
                { backgroundColor: isDarkMode ? '#252525' : '#F8F8F8' },
            ]}
        >
            <Image
                source={product?.Image ? { uri: product.Image } : IMG.PostImage}
                style={styles.previewImage}
                resizeMode="cover"
            />
            <View style={styles.previewInfo}>
                <CustomText style={styles.previewName} numberOfLines={1}>
                    {product?.ProductName}
                </CustomText>
                <CustomText style={styles.previewDetails} numberOfLines={2}>
                    {product?.ProductDetails}
                </CustomText>
            </View>
        </View>
    );

    const renderGoalSelection = () => (
        <View style={styles.section}>
            <CustomText style={styles.sectionTitle}>
                What do you want to achieve?
            </CustomText>
            <View style={styles.goalsContainer}>
                {goals.map(goal => (
                    <TouchableOpacity
                        key={goal.id}
                        style={[
                            styles.goalCard,
                            {
                                backgroundColor: isDarkMode ? '#252525' : '#fff',
                                borderColor:
                                    selectedGoal === goal.id
                                        ? '#21B7FF'
                                        : isDarkMode
                                        ? '#3a3a3a'
                                        : '#E4E4E4',
                            },
                        ]}
                        onPress={() => handleGoalSelect(goal.id)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.goalIconWrapper}>
                            <GradientIcon
                                colors={['#21B7FF', '#0084F8']}
                                size={24}
                                iconType="FontAwesome5"
                                name={goal.icon}
                            />
                        </View>
                        <CustomText style={styles.goalTitle}>{goal.title}</CustomText>
                        <CustomText style={styles.goalDesc}>{goal.desc}</CustomText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderPlanSelection = () => (
        <View style={styles.section}>
            <CustomText style={styles.sectionTitle}>
                Choose your promotion plan
            </CustomText>
            <View style={styles.plansContainer}>
                {plans.map(plan => (
                    <TouchableOpacity
                        key={plan.id}
                        style={[
                            styles.planCard,
                            {
                                backgroundColor: isDarkMode ? '#252525' : '#fff',
                                borderColor:
                                    selectedPlan === plan.id
                                        ? '#21B7FF'
                                        : isDarkMode
                                        ? '#3a3a3a'
                                        : '#E4E4E4',
                                borderWidth: selectedPlan === plan.id ? 2 : 1,
                            },
                        ]}
                        onPress={() => handlePlanSelect(plan.id)}
                        activeOpacity={0.7}
                    >
                        {plan.popular && (
                            <View style={styles.popularBadge}>
                                <LinearGradient
                                    colors={['#FFD700', '#FFA500']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.popularBadgeGradient}
                                >
                                    <CustomText style={styles.popularText}>
                                        POPULAR
                                    </CustomText>
                                </LinearGradient>
                            </View>
                        )}
                        <View style={styles.planHeader}>
                            <View>
                                <CustomText style={styles.planPrice}>
                                    ₹{plan.price}
                                </CustomText>
                                <CustomText style={styles.planDays}>
                                    {plan.days} days
                                </CustomText>
                            </View>
                            <View style={styles.planReach}>
                                <CustomText style={styles.planReachLabel}>
                                    Est. Reach
                                </CustomText>
                                <CustomText style={styles.planReachValue}>
                                    {plan.reach}
                                </CustomText>
                            </View>
                        </View>
                        <View style={styles.planStats}>
                            <View style={styles.statItem}>
                                <GradientIcon
                                    colors={['#21B7FF', '#0084F8']}
                                    size={14}
                                    iconType="FontAwesome5"
                                    name="eye"
                                />
                                <CustomText style={styles.statText}>
                                    {plan.impressions.toLocaleString()} impressions
                                </CustomText>
                            </View>
                            <View style={styles.statItem}>
                                <GradientIcon
                                    colors={['#21B7FF', '#0084F8']}
                                    size={14}
                                    iconType="FontAwesome5"
                                    name="mouse-pointer"
                                />
                                <CustomText style={styles.statText}>
                                    {plan.clicks} clicks
                                </CustomText>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {selectedPlan && (
                <TouchableOpacity onPress={handleContinue}>
                    <LinearGradient
                        colors={['#21B7FF', '#0084F8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.continueButton}
                    >
                        <CustomText style={styles.continueButtonText}>
                            Continue to Review
                        </CustomText>
                    </LinearGradient>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderReview = () => {
        const selectedPlanData = plans.find(p => p.id === selectedPlan);
        const selectedGoalData = goals.find(g => g.id === selectedGoal);

        return (
            <View style={styles.section}>
                <CustomText style={styles.sectionTitle}>
                    Review Your Promotion
                </CustomText>

                <View
                    style={[
                        styles.reviewCard,
                        { backgroundColor: isDarkMode ? '#252525' : '#fff' },
                    ]}
                >
                    <View style={styles.reviewItem}>
                        <CustomText style={styles.reviewLabel}>Goal:</CustomText>
                        <CustomText style={styles.reviewValue}>
                            {selectedGoalData?.title}
                        </CustomText>
                    </View>
                    <View style={styles.reviewItem}>
                        <CustomText style={styles.reviewLabel}>Duration:</CustomText>
                        <CustomText style={styles.reviewValue}>
                            {selectedPlanData?.days} days
                        </CustomText>
                    </View>
                    <View style={styles.reviewItem}>
                        <CustomText style={styles.reviewLabel}>Budget:</CustomText>
                        <CustomText style={styles.reviewValue}>
                            ₹{selectedPlanData?.price}
                        </CustomText>
                    </View>
                    <View style={styles.reviewItem}>
                        <CustomText style={styles.reviewLabel}>
                            Audience:
                        </CustomText>
                        <CustomText style={styles.reviewValue}>
                            Automatic (18-65+)
                        </CustomText>
                    </View>
                </View>

                <View
                    style={[
                        styles.expectedResults,
                        { backgroundColor: isDarkMode ? '#1a3a1a' : '#E8F5E9' },
                    ]}
                >
                    <CustomText style={styles.expectedTitle}>
                        📊 Expected Results
                    </CustomText>
                    <CustomText style={styles.expectedText}>
                        • Reach: {selectedPlanData?.reach} people
                    </CustomText>
                    <CustomText style={styles.expectedText}>
                        • Impressions: {selectedPlanData?.impressions.toLocaleString()}
                    </CustomText>
                    <CustomText style={styles.expectedText}>
                        • Clicks: {selectedPlanData?.clicks}
                    </CustomText>
                </View>

                <View style={styles.disclaimer}>
                    <CustomText style={styles.disclaimerText}>
                        By creating this promotion, you agree to our advertising
                        terms and policies.
                    </CustomText>
                </View>

                <TouchableOpacity onPress={handleCreatePromotion}>
                    <LinearGradient
                        colors={['#21B7FF', '#0084F8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.createButton}
                    >
                        <CustomText style={styles.createButtonText}>
                            Create Promotion - ₹{selectedPlanData?.price}
                        </CustomText>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    };

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
        productPreview: {
            margin: 15,
            padding: 12,
            borderRadius: 12,
            flexDirection: 'row',
            gap: 12,
        },
        previewImage: {
            width: 80,
            height: 80,
            borderRadius: 8,
        },
        previewInfo: {
            flex: 1,
            justifyContent: 'center',
        },
        previewName: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            marginBottom: 4,
        },
        previewDetails: {
            fontSize: 12,
            color: '#7d7d7d',
        },
        section: {
            padding: 15,
        },
        sectionTitle: {
            fontSize: 18,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            marginBottom: 15,
        },
        goalsContainer: {
            gap: 12,
        },
        goalCard: {
            padding: 16,
            borderRadius: 12,
            borderWidth: 2,
            alignItems: 'center',
        },
        goalIconWrapper: {
            marginBottom: 10,
        },
        goalTitle: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            marginBottom: 5,
        },
        goalDesc: {
            fontSize: 12,
            color: '#7d7d7d',
            textAlign: 'center',
        },
        plansContainer: {
            gap: 12,
            marginBottom: 20,
        },
        planCard: {
            padding: 16,
            borderRadius: 12,
            position: 'relative',
        },
        popularBadge: {
            position: 'absolute',
            top: -8,
            right: 16,
            borderRadius: 12,
            overflow: 'hidden',
        },
        popularBadgeGradient: {
            paddingHorizontal: 12,
            paddingVertical: 4,
        },
        popularText: {
            fontSize: 10,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: '#fff',
        },
        planHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        planPrice: {
            fontSize: 24,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        planDays: {
            fontSize: 12,
            color: '#7d7d7d',
        },
        planReach: {
            alignItems: 'flex-end',
        },
        planReachLabel: {
            fontSize: 11,
            color: '#7d7d7d',
        },
        planReachValue: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
        },
        planStats: {
            gap: 8,
        },
        statItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        statText: {
            fontSize: 12,
            color: '#7d7d7d',
        },
        continueButton: {
            paddingVertical: 15,
            borderRadius: 10,
            alignItems: 'center',
        },
        continueButtonText: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: '#fff',
        },
        reviewCard: {
            padding: 16,
            borderRadius: 12,
            gap: 12,
            marginBottom: 15,
        },
        reviewItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        reviewLabel: {
            fontSize: 14,
            color: '#7d7d7d',
        },
        reviewValue: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
        },
        expectedResults: {
            padding: 16,
            borderRadius: 12,
            marginBottom: 15,
        },
        expectedTitle: {
            fontSize: 15,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            marginBottom: 8,
        },
        expectedText: {
            fontSize: 13,
            marginBottom: 4,
        },
        disclaimer: {
            marginBottom: 15,
        },
        disclaimerText: {
            fontSize: 11,
            color: '#7d7d7d',
            textAlign: 'center',
        },
        createButton: {
            paddingVertical: 15,
            borderRadius: 10,
            alignItems: 'center',
        },
        createButtonText: {
            fontSize: 16,
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
            <ScrollView showsVerticalScrollIndicator={false}>
                {renderProductPreview()}
                {step === 1 && renderGoalSelection()}
                {step === 2 && renderPlanSelection()}
                {step === 3 && renderReview()}
                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
};

export default BoostProduct;