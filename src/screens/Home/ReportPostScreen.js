import React, { useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StatusBar,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native'
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { FONTS_FAMILY } from '../../assets/Fonts'
import { apiPost } from '../../utils/Apis'
import urls from '../../config/urls'
import useLoader from '../../utils/LoaderHook'
import { useSelector } from 'react-redux'
import { ToastMsg } from '../../utils/helperFunctions'

const ReportScreen = ({ route, navigation }) => {
    const { postId, postUserId, postType } = route.params
    const { isDarkMode } = useSelector(state => state.theme)

    const [step, setStep] = useState(1)
    const [selectedReason, setSelectedReason] = useState(null)
    const [selectedSubReason, setSelectedSubReason] = useState(null)
    const [additionalInfo, setAdditionalInfo] = useState('')
    const { showLoader, hideLoader } = useLoader()

    const reportReasons = [
        {
            id: 1,
            title: "It's spam",
            icon: 'block',
            subReasons: [
                'Scam or fraud',
                'Fake account',
                'Posting spam or misleading content',
            ],
        },
        {
            id: 2,
            title: 'Nudity or sexual activity',
            icon: 'remove-circle-outline',
            subReasons: [
                'Nudity',
                'Sexual activity',
                'Sexual exploitation',
                'Involves a child',
            ],
        },
        {
            id: 3,
            title: 'Hate speech or symbols',
            icon: 'warning',
            subReasons: [
                'Hateful speech or symbols',
                'Promotes terrorism',
                'Attacks a protected group',
            ],
        },
        {
            id: 4,
            title: 'Violence or dangerous organizations',
            icon: 'dangerous',
            subReasons: [
                'Violence or threat of violence',
                'Dangerous organizations or individuals',
                'Promotes dangerous acts',
            ],
        },
        {
            id: 5,
            title: 'Bullying or harassment',
            icon: 'person-remove',
            subReasons: [
                'Harassing me',
                'Harassing someone I know',
                'Harassing someone else',
            ],
        },
        {
            id: 6,
            title: 'Selling or promoting restricted items',
            icon: 'shopping-cart',
            subReasons: [
                'Drugs',
                'Firearms',
                'Endangered species',
                'Other regulated goods',
            ],
        },
        {
            id: 7,
            title: 'Suicide, self-injury or eating disorders',
            icon: 'healing',
            subReasons: [
                'Suicide or self-injury',
                'Eating disorders',
                'Promoting dangerous behavior',
            ],
        },
        {
            id: 8,
            title: 'False information',
            icon: 'info',
            subReasons: [
                'Health misinformation',
                'Politics',
                'Social issues',
                'Altered or fabricated content',
            ],
        },
        {
            id: 9,
            title: 'Intellectual property violation',
            icon: 'copyright',
            subReasons: [
                'Copyright violation',
                'Trademark violation',
                'Counterfeit product',
            ],
        },
        {
            id: 10,
            title: "I just don't like it",
            icon: 'thumb-down',
            subReasons: [],
        },
    ]

    const handleReasonSelect = (reason) => {
        setSelectedReason(reason)
        if (reason.subReasons && reason.subReasons.length > 0) {
            setStep(2)
        } else {
            setStep(3)
        }
    }

    const handleSubReasonSelect = (subReason) => {
        setSelectedSubReason(subReason)
        setStep(3)
    }

    const handleSubmit = async () => {
        try {
            showLoader()

            const reportData = {
                postId,
                // postUserId,
                reason: selectedReason?.title,

                additionalInfo: additionalInfo.trim(),
            }

            // Update with your actual API endpoint
            await apiPost(urls.reportPost, reportData)

            hideLoader()

            ToastMsg('Report Submitte,Thank you for reporting. We will review this post and take appropriate action.',)
            navigation.goBack()
            //   Alert.alert(
            //     'Report Submitted',
            //     'Thank you for reporting. We will review this post and take appropriate action.',
            //     [
            //       {
            //         text: 'OK',
            //         onPress: () => ,
            //       },
            //     ]
            //   )
        } catch (error) {
            hideLoader()
            console.error('Error submitting report:', error)
            ToastMsg(error?.message)
            navigation.goBack()

            // Alert.alert('Error', 'Failed to submit report. Please try again.')
        }
    }

    const handleBack = () => {
        if (step === 3) {
            if (selectedReason?.subReasons?.length > 0) {
                setStep(2)
                setSelectedSubReason(null)
            } else {
                setStep(1)
                setSelectedReason(null)
            }
        } else if (step === 2) {
            setStep(1)
            setSelectedReason(null)
            setSelectedSubReason(null)
        } else {
            navigation.goBack()
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            paddingTop: 50,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? '#333' : '#eee',
        },
        backButton: {
            padding: 4,
            marginRight: 16,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: isDarkMode ? '#fff' : '#000',
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        scrollContainer: {
            flex: 1,
        },
        contentContainer: {
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 40,
        },
        infoSection: {
            marginBottom: 32,
        },
        infoTitle: {
            fontSize: 24,
            fontWeight: '700',
            color: isDarkMode ? '#fff' : '#000',
            marginBottom: 12,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        infoText: {
            fontSize: 15,
            lineHeight: 22,
            color: isDarkMode ? '#aaa' : '#666',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
        },
        reasonsSection: {
            gap: 8,
        },
        reasonOption: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fafafa',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isDarkMode ? '#2a2a2a' : '#f0f0f0',
        },
        reasonIconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDarkMode ? '#2a2a2a' : '#f5f5f5',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        reasonTextContainer: {
            flex: 1,
        },
        reasonTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: isDarkMode ? '#fff' : '#000',
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
        },
        chevronIcon: {
            marginLeft: 8,
        },
        subReasonOption: {
            paddingVertical: 18,
            paddingHorizontal: 16,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fafafa',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isDarkMode ? '#2a2a2a' : '#f0f0f0',
        },
        subReasonText: {
            fontSize: 16,
            color: isDarkMode ? '#fff' : '#000',
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
        },
        additionalInfoSection: {
            marginTop: 24,
        },
        label: {
            fontSize: 16,
            fontWeight: '600',
            color: isDarkMode ? '#fff' : '#000',
            marginBottom: 12,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
        },
        textInput: {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fafafa',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isDarkMode ? '#2a2a2a' : '#f0f0f0',
            padding: 16,
            fontSize: 15,
            color: isDarkMode ? '#fff' : '#000',
            minHeight: 120,
            textAlignVertical: 'top',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
        },
        helperText: {
            fontSize: 13,
            color: isDarkMode ? '#888' : '#999',
            marginTop: 8,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
        },
        submitButton: {
            backgroundColor: '#0095f6',
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 24,
        },
        submitButtonDisabled: {
            backgroundColor: isDarkMode ? '#2a2a2a' : '#ddd',
        },
        submitButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        submitButtonTextDisabled: {
            color: isDarkMode ? '#666' : '#999',
        },
        selectedReasonCard: {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fafafa',
            padding: 16,
            borderRadius: 12,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: isDarkMode ? '#2a2a2a' : '#f0f0f0',
        },
        selectedReasonTitle: {
            fontSize: 14,
            color: isDarkMode ? '#888' : '#666',
            marginBottom: 4,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
        },
        selectedReasonText: {
            fontSize: 16,
            fontWeight: '600',
            color: isDarkMode ? '#fff' : '#000',
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
        },
    })

    const renderStepOne = () => (
        <Animated.View entering={FadeIn.duration(300)}>
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Why are you reporting this post?</Text>
                <Text style={styles.infoText}>
                    Your report is anonymous. If someone is in immediate danger, call local emergency services.
                </Text>
            </View>

            <View style={styles.reasonsSection}>
                {reportReasons.map((reason, index) => (
                    <Animated.View
                        key={reason.id}
                        entering={FadeInRight.delay(index * 50).duration(400)}
                    >
                        <TouchableOpacity
                            style={styles.reasonOption}
                            onPress={() => handleReasonSelect(reason)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.reasonIconContainer}>
                                <MaterialIcons
                                    name={reason.icon}
                                    size={22}
                                    color={isDarkMode ? '#fff' : '#000'}
                                />
                            </View>
                            <View style={styles.reasonTextContainer}>
                                <Text style={styles.reasonTitle}>{reason.title}</Text>
                            </View>
                            <MaterialIcons
                                name="chevron-right"
                                size={24}
                                color={isDarkMode ? '#666' : '#999'}
                                style={styles.chevronIcon}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </Animated.View>
    )

    const renderStepTwo = () => (
        <Animated.View entering={FadeIn.duration(300)}>
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>
                    {selectedReason?.title}
                </Text>
                <Text style={styles.infoText}>
                    Please select a more specific reason for your report.
                </Text>
            </View>

            <View style={styles.reasonsSection}>
                {selectedReason?.subReasons?.map((subReason, index) => (
                    <Animated.View
                        key={index}
                        entering={FadeInRight.delay(index * 50).duration(400)}
                    >
                        <TouchableOpacity
                            style={styles.subReasonOption}
                            onPress={() => handleSubReasonSelect(subReason)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.subReasonText}>{subReason}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </Animated.View>
    )

    const renderStepThree = () => (
        <Animated.View entering={FadeIn.duration(300)}>
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Additional information</Text>
                <Text style={styles.infoText}>
                    Help us understand the problem. You can provide more details below.
                </Text>
            </View>

            <View style={styles.selectedReasonCard}>
                <Text style={styles.selectedReasonTitle}>Selected reason:</Text>
                <Text style={styles.selectedReasonText}>
                    {selectedReason?.title}
                    {selectedSubReason && ` - ${selectedSubReason}`}
                </Text>
            </View>

            <View style={styles.additionalInfoSection}>
                <Text style={styles.label}>
                    Describe the issue (Optional)
                </Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Tell us more about why you're reporting this post..."
                    placeholderTextColor={isDarkMode ? '#666' : '#999'}
                    value={additionalInfo}
                    onChangeText={setAdditionalInfo}
                    multiline
                    maxLength={500}
                />
                <Text style={styles.helperText}>
                    {additionalInfo.length}/500 characters
                </Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.submitButton,
                    !selectedReason && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!selectedReason}
                activeOpacity={0.8}
            >
                <Text
                    style={[
                        styles.submitButtonText,
                        !selectedReason && styles.submitButtonTextDisabled,
                    ]}
                >
                    Submit Report
                </Text>
            </TouchableOpacity>
        </Animated.View>
    )

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={isDarkMode ? '#000000' : '#ffffff'}
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={styles.backButton}
                >
                    <MaterialIcons
                        name="arrow-back"
                        size={24}
                        color={isDarkMode ? '#fff' : '#000'}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report Post</Text>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {step === 1 && renderStepOne()}
                    {step === 2 && renderStepTwo()}
                    {step === 3 && renderStepThree()}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default ReportScreen