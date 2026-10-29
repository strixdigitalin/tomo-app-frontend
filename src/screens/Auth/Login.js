import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Easing,
    ImageBackground,
    KeyboardAvoidingView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ReactNativeBiometrics from 'react-native-biometrics';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomText from "../../components/TextComponent";
import FormField from "../../components/FormField";
import FormButton from "../../components/FormButton";
import IMG from "../../assets/Images";
import { FONTS_FAMILY } from "../../assets/Fonts";
import { ToastMsg } from "../../utils/helperFunctions";
import { apiGet, apiPost, getItem, setItem, removeItem } from "../../utils/Apis";
import { compose, required, email as emailRule } from "../../utils/validators";
import useForm from "../../utils/useForm";
import urls from "../../config/urls";
import useLoader from "../../utils/LoaderHook";
import { setUser, setSeller } from "../../redux/reducer/user";
import useKeyboardStatus from "../../utils/KeyBoardHook";
import { THEMES } from "../../redux/reducer/theme";
import { profilePalette } from "../UserDetail/profileTheme";

// Login only checks that a password was entered. The 6-character rule applies to NEW
// passwords (signup) — older accounts may have shorter ones and must still be able to log in.
const SCHEMA = {
    Email: compose(required('Email'), emailRule),
    Password: required('Password'),
};

// AsyncStorage keys used by "Login with fingerprint"
const BIO_ENABLED = 'user_biometric_enabled';
const BIO_EMAIL = 'user_saved_email';
const BIO_PASSWORD = 'user_saved_password';
const BIO_TYPE = 'user_biometric_type'; // 'User' | 'Seller' — which account the saved login belongs to

const Login = ({ navigation }) => {
    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
    const c = profilePalette(isDarkMode, accent);
    const { showLoader, hideLoader } = useLoader();
    const dispatch = useDispatch();
    const { isKeyboardOpen } = useKeyboardStatus();

    const slideAnim = useRef(new Animated.Value(100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const rnBiometrics = useRef(new ReactNativeBiometrics()).current;
    const autoPrompted = useRef(false);
    const passwordRef = useRef(null);

    const form = useForm({ Email: '', Password: '' }, SCHEMA);
    const [loginAs, setLoginAs] = useState('User'); // 'User' | 'Seller'
    const [biometricAvailable, setBiometricAvailable] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);

    // ── Biometric helpers ──────────────────────────────────────────────────────
    const clearBiometric = useCallback(async () => {
        await Promise.all([BIO_EMAIL, BIO_PASSWORD, BIO_TYPE].map(k => removeItem(k).catch(() => {})));
        await setItem(BIO_ENABLED, 'false');
        setBiometricEnabled(false);
    }, []);

    const checkBiometricStatus = useCallback(async () => {
        try {
            const { available } = await rnBiometrics.isSensorAvailable();
            const enabled = (await getItem(BIO_ENABLED)) === 'true';
            const hasCreds = !!(await getItem(BIO_EMAIL)) && !!(await getItem(BIO_PASSWORD));
            setBiometricAvailable(!!available);
            // "enabled" with no saved login is a broken state — treat it as off
            setBiometricEnabled(!!available && enabled && hasCreds);
        } catch (error) {
            console.log('Biometric check error:', error);
        }
    }, [rnBiometrics]);

    const askToEnableBiometric = useCallback((emailValue, passwordValue, type) => {
        Alert.alert(
            'Enable fingerprint login?',
            'Next time you can sign in with your fingerprint instead of typing your password.',
            [
                { text: 'Not now', style: 'cancel' },
                {
                    text: 'Enable',
                    onPress: async () => {
                        try {
                            const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Confirm your fingerprint' });
                            if (!success) return ToastMsg('Fingerprint setup cancelled');
                            await setItem(BIO_EMAIL, emailValue);
                            await setItem(BIO_PASSWORD, passwordValue);
                            await setItem(BIO_TYPE, type);
                            await setItem(BIO_ENABLED, 'true');
                            setBiometricEnabled(true);
                            ToastMsg('Fingerprint login enabled');
                        } catch (error) {
                            console.log('Biometric setup error:', error);
                            ToastMsg('Fingerprint setup failed');
                        }
                    },
                },
            ],
        );
    }, [rnBiometrics]);

    // ── Login ──────────────────────────────────────────────────────────────────
    // `fromBiometric` = logging in with saved credentials (no setup prompt, and a rejected
    // password means the saved login is stale, so it is cleared).
    const performLogin = useCallback(async (emailValue, passwordValue, type, fromBiometric = false) => {
        const isSeller = type === 'Seller';
        try {
            showLoader();
            const response = await apiPost(
                isSeller ? urls.sellerLogin : urls.userLogin,
                { Email: emailValue.trim(), Password: passwordValue },
                { headers: { 'Content-Type': 'application/json' } },
            );

            if (response?.statusCode !== 200) {
                ToastMsg(response?.message || 'Login failed');
                return;
            }

            ToastMsg(response?.message);
            await setItem('token', response?.data?.token);
            await setItem('accountType', type);

            if (isSeller) {
                dispatch(setSeller(JSON.stringify(response?.data?.Seller || response?.data)));
            } else {
                const profile = await apiGet(urls.userProfile);
                if (profile?.statusCode !== 200) {
                    ToastMsg('Could not load your profile. Please try again.');
                    return;
                }
                dispatch(setUser(JSON.stringify(profile?.data)));
            }

            form.reset({ Email: '', Password: '' });
            if (!fromBiometric && biometricAvailable && !biometricEnabled) {
                askToEnableBiometric(emailValue.trim(), passwordValue, type);
            }
            navigation.reset({ index: 0, routes: [{ name: isSeller ? 'SellerTab' : 'Tab' }] });
        } catch (error) {
            const message = error?.message;
            if (fromBiometric && message) {
                // saved password no longer works (e.g. changed on another device)
                await clearBiometric();
                ToastMsg('Your saved fingerprint login is out of date. Please sign in with your password.');
            } else {
                ToastMsg(message || 'Network Error');
            }
        } finally {
            hideLoader();
        }
    }, [showLoader, hideLoader, dispatch, navigation, form, biometricAvailable, biometricEnabled, askToEnableBiometric, clearBiometric]);

    const handleBiometricLogin = useCallback(async () => {
        try {
            const { success, error } = await rnBiometrics.simplePrompt({
                promptMessage: 'Place your finger on the sensor to login',
                cancelButtonText: 'Use password',
            });
            if (!success) {
                // user cancelling is normal — only mention real failures
                if (error && !/cancel/i.test(error)) ToastMsg('Fingerprint not recognised');
                return;
            }
            const savedEmail = await getItem(BIO_EMAIL);
            const savedPassword = await getItem(BIO_PASSWORD);
            const savedType = (await getItem(BIO_TYPE)) || 'User';
            if (!savedEmail || !savedPassword) {
                await clearBiometric();
                return ToastMsg('Fingerprint login is not set up. Please sign in with your password.');
            }
            setLoginAs(savedType);
            await performLogin(savedEmail, savedPassword, savedType, true);
        } catch (error) {
            console.log('Biometric authentication error:', error);
            ToastMsg('Biometric authentication failed');
        }
    }, [rnBiometrics, performLogin, clearBiometric]);

    const onLogin = useCallback(() => {
        const { ok, firstError } = form.validateAll();
        if (!ok) return ToastMsg(firstError);
        performLogin(form.values.Email, form.values.Password, loginAs);
    }, [form, performLogin, loginAs]);

    // ── Effects ────────────────────────────────────────────────────────────────
    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]).start();
        checkBiometricStatus();
    }, []);

    // Offer the fingerprint prompt once when the screen opens (not on every re-render)
    useEffect(() => {
        if (biometricAvailable && biometricEnabled && !autoPrompted.current) {
            autoPrompted.current = true;
            handleBiometricLogin();
        }
    }, [biometricAvailable, biometricEnabled, handleBiometricLogin]);

    const isSeller = loginAs === 'Seller';

    return (
        <ImageBackground source={IMG.bgShadow} style={[styles.container, { backgroundColor: c.screen }]}>
            <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
                <CustomText style={styles.signInText}>{isSeller ? 'Seller Sign In' : 'Sign In'}</CustomText>
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={[styles.card, { backgroundColor: c.card, transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}>
                <CustomText style={styles.welcomeText}>Welcome</CustomText>
                <CustomText style={[styles.descriptionText, { color: c.muted }]}>
                    {isSeller
                        ? 'Login to your Seller account to manage your shop'
                        : 'Sign in to keep exploring cars, communities and more!'}
                </CustomText>

                <CustomText style={styles.switchModeText}>
                    {isSeller ? 'Are you a User? ' : 'Are you a Seller? '}
                    <CustomText style={[styles.switchModeLink, { color: accent }]} onPress={() => setLoginAs(isSeller ? 'User' : 'Seller')}>
                        {isSeller ? 'Login as User' : 'Login as Seller'}
                    </CustomText>
                </CustomText>

                <View style={styles.form}>
                    <FormField
                        label="Email"
                        required
                        leftIcon="mail"
                        placeholder="Enter your email address"
                        keyboardType="email-address"
                        value={form.values.Email}
                        error={form.errors.Email}
                        onChangeText={v => form.set('Email', v)}
                        onBlur={() => form.blur('Email')}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                    <FormField
                        ref={passwordRef}
                        label="Password"
                        required
                        leftIcon="lock"
                        placeholder="Enter your password"
                        secure
                        value={form.values.Password}
                        error={form.errors.Password}
                        onChangeText={v => form.set('Password', v)}
                        onBlur={() => form.blur('Password')}
                        returnKeyType="done"
                        onSubmitEditing={onLogin}
                    />

                    <FormButton label="Sign In" onPress={onLogin} style={{ marginTop: 6 }} />

                    {biometricAvailable && biometricEnabled && (
                        <TouchableOpacity
                            onPress={handleBiometricLogin}
                            activeOpacity={0.8}
                            style={[styles.biometricButton, { borderColor: accent, backgroundColor: accent + '14' }]}>
                            <Entypo name="fingerprint" size={24} color={accent} />
                            <CustomText style={[styles.biometricText, { color: accent }]}>Login with Fingerprint</CustomText>
                        </TouchableOpacity>
                    )}

                    <View style={styles.signupRow}>
                        <CustomText style={[styles.signupText, { color: c.muted }]}>Don't have an account? </CustomText>
                        <TouchableOpacity onPress={() => navigation.navigate('Singnup', { signupAs: loginAs })}>
                            <CustomText style={[styles.signupLink, { color: accent }]}>Sign up</CustomText>
                        </TouchableOpacity>
                    </View>
                </View>

                {!isKeyboardOpen && (
                    <CustomText style={[styles.termsText, { color: c.muted }]}>
                        By continuing, you agree to our{' '}
                        <CustomText style={[styles.linkText, { color: accent }]} onPress={() => navigation.navigate('TermsAndConditions')}>Terms & Conditions</CustomText>
                        {' '}and{' '}
                        <CustomText style={[styles.linkText, { color: accent }]} onPress={() => navigation.navigate('PrivacyPolicy')}>Privacy Policy</CustomText>
                    </CustomText>
                )}
            </Animated.ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContainer: { paddingTop: 50, paddingHorizontal: 20, alignItems: 'center' },
    signInText: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    card: { marginTop: 30, flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    scrollContent: { padding: 26, paddingBottom: 120 },
    welcomeText: { fontFamily: FONTS_FAMILY.SourceSans3_Bold, fontSize: 32 },
    descriptionText: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginTop: 2 },
    switchModeText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginTop: 10 },
    switchModeLink: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    form: { marginTop: 28 },
    biometricButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 13, borderWidth: 1.5, borderRadius: 16, marginTop: 14,
    },
    biometricText: { fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, fontSize: 14, marginLeft: 8 },
    signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 22 },
    signupText: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
    signupLink: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    termsText: { fontSize: 12, textAlign: 'center', marginTop: 28, lineHeight: 18, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
    linkText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
});

export default Login;
