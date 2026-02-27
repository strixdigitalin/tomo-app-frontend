import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Dimensions,
    Animated,
    StatusBar,
} from 'react-native'
import { FONTS_FAMILY } from '../../assets/Fonts'
import { App_Primary_color } from '../../common/Colors/colors'
import { setItem, getItem } from '../../utils/Apis'

const { width: W, height: H } = Dimensions.get('window')

// ── Tutorial steps — tab positions hardcoded relative to bottom tab bar ──
// Adjust x/y values to match your actual tab positions
// Tab bar is typically at bottom, height ~65px
const TAB_BAR_HEIGHT = 65
const TAB_Y = H - TAB_BAR_HEIGHT + 12 // center of tab icon vertically
const TAB_ICON_SIZE = 28

const STEPS = [
    {
        id: 'home',
        title: '🏠 Home Feed',
        description: 'Discover posts, stories, and latest updates from people you follow.',
        // Tab 1 of 5 — x = 1/5 * W - W/10
        spotX: W * 0.1 - TAB_ICON_SIZE / 2,
        spotY: TAB_Y - TAB_ICON_SIZE / 2,
        spotW: TAB_ICON_SIZE * 2,
        spotH: TAB_ICON_SIZE * 2,
        tooltipPosition: 'top', // tooltip above spotlight
    },
    {
        id: 'Market place',
        title: 'Create Shops and products',
        description: 'Discover shops, browse products, and manage your own store easily.',
        spotX: W * 0.3 - TAB_ICON_SIZE / 2,
        spotY: TAB_Y - TAB_ICON_SIZE / 2,
        spotW: TAB_ICON_SIZE * 2,
        spotH: TAB_ICON_SIZE * 2,
        tooltipPosition: 'top',
    },
    {
        id: 'search',
        title: '🔍 Explore',
        description: 'Search for posts, hashtags, and discover new people.',
        spotX: W * 0.5 - TAB_ICON_SIZE / 2,
        spotY: TAB_Y - TAB_ICON_SIZE / 2,
        spotW: TAB_ICON_SIZE * 2,
        spotH: TAB_ICON_SIZE * 2,
        tooltipPosition: 'top',
    },

    {
        id: 'Messages',
        title: '🔔 Messages',
        description: 'See who wants to connect you',
        spotX: W * 0.7 - TAB_ICON_SIZE / 2,
        spotY: TAB_Y - TAB_ICON_SIZE / 2,
        spotW: TAB_ICON_SIZE * 2,
        spotH: TAB_ICON_SIZE * 2,
        tooltipPosition: 'top',
    },
    {
        id: 'profile',
        title: '👤 Your Profile',
        description: 'View your posts, edit your profile and manage your account.',
        spotX: W * 0.9 - TAB_ICON_SIZE / 2,
        spotY: TAB_Y - TAB_ICON_SIZE / 2,
        spotW: TAB_ICON_SIZE * 2,
        spotH: TAB_ICON_SIZE * 2,
        tooltipPosition: 'top',
    },
]

const ASYNC_KEY = 'tutorial_completed'

const TutorialOverlay = ({ visible, onDone }) => {
    const [step, setStep] = useState(0)
    const fadeAnim = useRef(new Animated.Value(0)).current
    const tooltipAnim = useRef(new Animated.Value(0)).current
    const spotlightAnim = useRef(new Animated.Value(0)).current
    const pulseAnim = useRef(new Animated.Value(1)).current
    const pulseLoop = useRef(null)

    const current = STEPS[step]

    useEffect(() => {
        if (visible) {
            // Fade in overlay
            Animated.timing(fadeAnim, {
                toValue: 1, duration: 400, useNativeDriver: true,
            }).start()
            animateStep()
        }
    }, [visible])

    useEffect(() => {
        if (visible) animateStep()
    }, [step])

    const animateStep = () => {
        // Reset tooltip
        tooltipAnim.setValue(0)
        spotlightAnim.setValue(0.8)

        // Stop previous pulse
        if (pulseLoop.current) pulseLoop.current.stop()

        // Animate spotlight + tooltip in
        Animated.parallel([
            Animated.spring(spotlightAnim, {
                toValue: 1, tension: 60, friction: 7, useNativeDriver: true,
            }),
            Animated.spring(tooltipAnim, {
                toValue: 1, tension: 50, friction: 8, delay: 150, useNativeDriver: true,
            }),
        ]).start()

        // Pulsing ring
        pulseLoop.current = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.25, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        )
        pulseLoop.current.start()
    }

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(step + 1)
        } else {
            handleDone()
        }
    }

    const handleSkip = () => handleDone()

    const handleDone = async () => {
        if (pulseLoop.current) pulseLoop.current.stop()

        Animated.timing(fadeAnim, {
            toValue: 0, duration: 300, useNativeDriver: true,
        }).start(async () => {
            await setItem(ASYNC_KEY, 'true')
            setStep(0)
            onDone?.()
        })
    }

    if (!visible) return null

    // ── Spotlight box ───────────────────────────────────────────────────
    const spotPad = 4
    const sx = current.spotX - spotPad
    const sy = current.spotY - spotPad
    const sw = current.spotW + spotPad * 2
    const sh = current.spotH + spotPad * 2

    // ── Tooltip position ────────────────────────────────────────────────
    const tooltipWidth = W - 48
    const tooltipLeft = 24
    // Always show above tab bar (tooltipPosition: 'top')
    const tooltipBottom = TAB_BAR_HEIGHT + 80
    const arrowLeft = current.spotX + current.spotW / 2 - 10

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
        >
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>

                {/* ── Dark overlay with spotlight cutout using 4 rectangles ── */}
                {/* Top */}
                <View style={[styles.mask, { top: 0, left: 0, right: 0, height: Math.max(sy, 0) }]} />
                {/* Bottom */}
                <View style={[styles.mask, { top: sy + sh, left: 0, right: 0, bottom: 0 }]} />
                {/* Left */}
                <View style={[styles.mask, { top: sy, left: 0, width: Math.max(sx, 0), height: sh }]} />
                {/* Right */}
                <View style={[styles.mask, { top: sy, left: sx + sw, right: 0, height: sh }]} />

                {/* ── Spotlight border ring ── */}
                <Animated.View
                    style={[
                        styles.spotlightRing,
                        {
                            left: sx, top: sy, width: sw, height: sh,
                            borderRadius: sh / 2,
                            transform: [{ scale: spotlightAnim }],
                        }
                    ]}
                />

                {/* ── Pulse ring ── */}
                <Animated.View
                    style={[
                        styles.pulseRing,
                        {
                            left: sx - 6, top: sy - 6,
                            width: sw + 12, height: sh + 12,
                            borderRadius: (sh + 12) / 2,
                            transform: [{ scale: pulseAnim }],
                        }
                    ]}
                />

                {/* ── Tooltip ── */}
                <Animated.View
                    style={[
                        styles.tooltipContainer,
                        {
                            bottom: tooltipBottom,
                            left: tooltipLeft,
                            width: tooltipWidth,
                            transform: [
                                { scale: tooltipAnim },
                                { translateY: tooltipAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                            ],
                            opacity: tooltipAnim,
                        }
                    ]}
                >
                    {/* Step dots */}
                    <View style={styles.dotsRow}>
                        {STEPS.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    i === step && styles.dotActive,
                                ]}
                            />
                        ))}
                    </View>

                    <Text style={styles.tooltipTitle}>{current.title}</Text>
                    <Text style={styles.tooltipDesc}>{current.description}</Text>

                    {/* Buttons */}
                    <View style={styles.btnRow}>
                        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn} activeOpacity={0.7}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleNext} style={styles.nextBtn} activeOpacity={0.8}>
                            <Text style={styles.nextText}>
                                {step === STEPS.length - 1 ? "Let's Go 🚀" : 'Next →'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* ── Arrow pointing to spotlight ── */}
                <Animated.View
                    style={[
                        styles.arrow,
                        {
                            left: arrowLeft,
                            bottom: tooltipBottom - 14,
                            opacity: tooltipAnim,
                        }
                    ]}
                />

            </Animated.View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
    },
    mask: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.80)',
    },
    spotlightRing: {
        position: 'absolute',
        borderWidth: 2.5,
        borderColor: App_Primary_color,
    },
    pulseRing: {
        position: 'absolute',
        borderWidth: 1.5,
        borderColor: `${App_Primary_color}60`,
    },
    tooltipContainer: {
        position: 'absolute',
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 14,
        alignSelf: 'center',
    },
    dot: {
        width: 6, height: 6, borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    dotActive: {
        width: 20, height: 6, borderRadius: 3,
        backgroundColor: App_Primary_color,
    },
    tooltipTitle: {
        fontSize: 18,
        fontFamily: FONTS_FAMILY.sfPro_Bold,
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    tooltipDesc: {
        fontSize: 14,
        fontFamily: FONTS_FAMILY.sfPro_Regular,
        color: 'rgba(255,255,255,0.70)',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 20,
    },
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    skipBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    skipText: {
        fontSize: 14,
        fontFamily: FONTS_FAMILY.sfPro_Medium,
        color: 'rgba(255,255,255,0.45)',
    },
    nextBtn: {
        flex: 1,
        backgroundColor: App_Primary_color,
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center',
    },
    nextText: {
        fontSize: 15,
        fontFamily: FONTS_FAMILY.sfPro_Bold,
        color: '#FFFFFF',
    },
    arrow: {
        position: 'absolute',
        width: 0, height: 0,
        borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 14,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderTopColor: '#1C1C1E',
    },
})

// ── Hook: check if tutorial should show ──────────────────────────────────
export const useTutorial = () => {
    const [showTutorial, setShowTutorial] = useState(false)

    useEffect(() => {
        checkTutorial()
    }, [])

    const checkTutorial = async () => {
        try {
            const done = await getItem(ASYNC_KEY)
            if (done !== 'true') setShowTutorial(true)
        } catch (e) {
            setShowTutorial(true)
        }
    }

    const dismissTutorial = () => setShowTutorial(false)

    return { showTutorial, dismissTutorial }
}

export default TutorialOverlay


