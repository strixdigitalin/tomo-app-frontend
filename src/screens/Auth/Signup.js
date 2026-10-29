import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, ImageBackground, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import Feather from "react-native-vector-icons/Feather";
import CustomText from "../../components/TextComponent";
import FormField from "../../components/FormField";
import FormButton from "../../components/FormButton";
import FormCheckbox from "../../components/FormCheckbox";
import IMG from "../../assets/Images";
import { FONTS_FAMILY } from "../../assets/Fonts";
import { apiPost } from "../../utils/Apis";
import useLoader from "../../utils/LoaderHook";
import urls from "../../config/urls";
import { ToastMsg } from "../../utils/helperFunctions";
import useForm from "../../utils/useForm";
import {
    compose, required, email as emailRule, password as passwordRule, matches,
    phone10, username as usernameRule, mustBeTrue,
} from "../../utils/validators";
import { THEMES } from "../../redux/reducer/theme";
import { profilePalette } from "../UserDetail/profileTheme";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const RESEND_SECONDS = 30;

const INITIAL = {
    UserName: '', FullName: '', Email: '', MobileNumber: '', StoreName: '',
    Password: '', Confirm: '', Agree: false,
};

// Field rules (same required fields / messages as web's SignUp + SellerSignUp).
// Password follows the new 6-character rule. Mobile + store name are seller-only.
const buildSchema = isSeller => ({
    UserName: compose(required('Username'), usernameRule),
    FullName: required('Full name'),
    Email: compose(required('Email'), emailRule),
    ...(isSeller ? { MobileNumber: compose(required('Mobile number'), phone10), StoreName: required('Store name') } : {}),
    Password: compose(required('Password'), passwordRule),
    Confirm: compose(required('Confirm password'), matches(v => v.Password, 'Password and Confirm Password do not match')),
    Agree: mustBeTrue('You must agree to the Terms & Conditions and Privacy Policy'),
});

const SignUp = ({ navigation, route }) => {
    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
    const c = profilePalette(isDarkMode, accent);
    const { showLoader, hideLoader } = useLoader();
    const slideAnim = useRef(new Animated.Value(300)).current;

    const [signupAs, setSignupAs] = useState(route?.params?.signupAs === 'Seller' ? 'Seller' : 'User');
    const isSeller = signupAs === 'Seller';
    const schema = useMemo(() => buildSchema(isSeller), [isSeller]);
    const form = useForm(INITIAL, schema);

    // ── Email OTP (same flow as web: client generates the code, backend mails it) ──
    const sentOtpRef = useRef(null);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState(null);
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    }, []);

    useEffect(() => {
        if (resendTimer <= 0) return;
        const t = setTimeout(() => setResendTimer(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [resendTimer]);

    const resetOtp = useCallback(() => {
        sentOtpRef.current = null;
        setIsOtpSent(false);
        setIsVerified(false);
        setOtp('');
        setOtpError(null);
        setResendTimer(0);
    }, []);

    // Changing the email invalidates any OTP flow in progress
    const onEmailChange = useCallback(v => {
        form.set('Email', v);
        if (isOtpSent || isVerified) resetOtp();
    }, [form, isOtpSent, isVerified, resetOtp]);

    // Switching User/Seller changes the API; start the OTP over
    const switchMode = useCallback(() => {
        setSignupAs(m => (m === 'Seller' ? 'User' : 'Seller'));
        resetOtp();
    }, [resetOtp]);

    const sendOtp = useCallback(async () => {
        const emailError = compose(required('Email'), emailRule)(form.values.Email);
        if (emailError) {
            form.blur('Email');
            return ToastMsg(emailError);
        }
        const code = String(Math.floor(10 ** (OTP_LENGTH - 1) + Math.random() * 9 * 10 ** (OTP_LENGTH - 1)));
        try {
            showLoader();
            const response = await apiPost(
                isSeller ? urls.sellerSendOtp : urls.userSendOtp,
                { Email: form.values.Email.trim(), OTP: code },
                { headers: { 'Content-Type': 'application/json' } },
            );
            if (response?.statusCode === 200) {
                sentOtpRef.current = { code, expiresAt: Date.now() + OTP_EXPIRY_MS };
                setOtp('');
                setOtpError(null);
                setIsOtpSent(true);
                setResendTimer(RESEND_SECONDS);
                ToastMsg(response?.message || 'OTP sent successfully');
            } else {
                ToastMsg(response?.message || 'Failed to send OTP');
            }
        } catch (error) {
            ToastMsg(error?.message || 'Failed to send OTP');
        } finally {
            hideLoader();
        }
    }, [form, isSeller, showLoader, hideLoader]);

    const verifyOtp = useCallback(() => {
        if (!otp) return setOtpError('Please enter the OTP');
        if (otp.length !== OTP_LENGTH) return setOtpError(`OTP must be ${OTP_LENGTH} digits`);
        const sent = sentOtpRef.current;
        if (!sent) return setOtpError('Please request a new OTP');
        if (Date.now() > sent.expiresAt) return setOtpError('OTP expired. Please resend a new one');
        if (otp !== sent.code) return setOtpError('Invalid OTP');
        sentOtpRef.current = null;
        setOtpError(null);
        setIsVerified(true);
        ToastMsg('Email verified');
    }, [otp]);

    // ── Submit ─────────────────────────────────────────────────────────────────
    const onSignup = useCallback(async () => {
        const { ok, firstError } = form.validateAll();
        if (!ok) return ToastMsg(firstError);
        if (!isVerified) {
            setOtpError('Please verify your email with the OTP first');
            return ToastMsg('Please verify your email with the OTP first');
        }

        const v = form.values;
        const payload = {
            UserName: v.UserName.trim(),
            FullName: v.FullName.trim(),
            Email: v.Email.trim(),
            Password: v.Password,
            ...(isSeller ? { MobileNumber: v.MobileNumber, StoreName: v.StoreName.trim() } : {}),
        };

        try {
            showLoader();
            const response = await apiPost(isSeller ? urls.sellerSignup : urls.userSignup, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response?.statusCode === 200) {
                ToastMsg(response?.message);
                form.reset(INITIAL);
                resetOtp();
                navigation.goBack();
            } else {
                ToastMsg(response?.message || 'Signup failed');
            }
        } catch (error) {
            ToastMsg(error?.message || 'Network Error');
        } finally {
            hideLoader();
        }
    }, [form, isVerified, isSeller, showLoader, hideLoader, resetOtp, navigation]);

    const { values, errors } = form;

    return (
        <ImageBackground source={IMG.bgShadow} style={[styles.container, { backgroundColor: c.screen }]}>
            <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: c.card }]}>
                    <Feather name="arrow-left" size={20} color={c.text} />
                </TouchableOpacity>
                <CustomText style={styles.headerTitle}>{isSeller ? 'Seller Sign up' : 'Sign up'}</CustomText>
                <View style={{ width: 38 }} />
            </View>

            <Animated.View style={[styles.card, { backgroundColor: c.card, transform: [{ translateX: slideAnim }] }]}>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    <CustomText style={styles.welcome}>Welcome</CustomText>
                    <CustomText style={[styles.desc, { color: c.muted }]}>
                        {isSeller
                            ? 'Create a Seller account to start listing your shop & products!'
                            : 'Create an account to keep exploring cars and communities!'}
                    </CustomText>
                    <CustomText style={styles.switchText}>
                        {isSeller ? 'Are you a User? ' : 'Are you a Seller? '}
                        <CustomText style={[styles.switchLink, { color: accent }]} onPress={switchMode}>
                            {isSeller ? 'Sign up as User' : 'Sign up as Seller'}
                        </CustomText>
                    </CustomText>

                    <View style={{ marginTop: 22 }}>
                        <FormField
                            label="Username" required leftIcon="at-sign" placeholder="Choose a username"
                            value={values.UserName} error={errors.UserName}
                            onChangeText={v => form.set('UserName', v)} onBlur={() => form.blur('UserName')}
                            maxLength={30}
                        />
                        <FormField
                            label="Full name" required leftIcon="user" placeholder="Enter your full name"
                            autoCapitalize="words"
                            value={values.FullName} error={errors.FullName}
                            onChangeText={v => form.set('FullName', v)} onBlur={() => form.blur('FullName')}
                        />

                        <FormField
                            label="Email" required leftIcon="mail" placeholder="Enter your email address"
                            keyboardType="email-address"
                            value={values.Email} error={errors.Email}
                            editable={!isVerified}
                            onChangeText={onEmailChange} onBlur={() => form.blur('Email')}
                            rightElement={isVerified ? <Feather name="check-circle" size={18} color="#16A34A" /> : null}
                        />

                        {isVerified ? (
                            <View style={[styles.verified, { backgroundColor: '#16A34A1A' }]}>
                                <Feather name="check" size={14} color="#16A34A" />
                                <CustomText style={styles.verifiedText}>Email verified</CustomText>
                                <TouchableOpacity onPress={resetOtp}>
                                    <CustomText style={[styles.link, { color: accent }]}>Change</CustomText>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{ marginTop: -4, marginBottom: 14 }}>
                                {isOtpSent && (
                                    <View style={styles.otpRow}>
                                        <FormField
                                            containerStyle={{ flex: 1, marginBottom: 0 }}
                                            placeholder={`Enter ${OTP_LENGTH}-digit OTP`} leftIcon="shield"
                                            keyboardType="number-pad" maxLength={OTP_LENGTH}
                                            value={otp} error={otpError}
                                            onChangeText={t => { setOtp(t.replace(/\D/g, '').slice(0, OTP_LENGTH)); if (otpError) setOtpError(null); }}
                                        />
                                        <TouchableOpacity style={[styles.verifyBtn, { backgroundColor: accent }]} onPress={verifyOtp}>
                                            <CustomText style={styles.verifyText}>Verify</CustomText>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                {!isOtpSent && !!otpError && <CustomText style={[styles.otpErr, { color: c.danger }]}>{otpError}</CustomText>}
                                <TouchableOpacity
                                    onPress={sendOtp}
                                    disabled={resendTimer > 0}
                                    style={[styles.sendOtp, { opacity: resendTimer > 0 ? 0.5 : 1 }]}>
                                    <CustomText style={[styles.link, { color: accent }]}>
                                        {isOtpSent ? (resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP') : 'Send OTP to verify email'}
                                    </CustomText>
                                </TouchableOpacity>
                            </View>
                        )}

                        {isSeller && (
                            <>
                                <FormField
                                    label="Mobile number" required leftIcon="phone" placeholder="10 digit mobile number"
                                    keyboardType="number-pad" maxLength={10}
                                    value={values.MobileNumber} error={errors.MobileNumber}
                                    onChangeText={v => form.set('MobileNumber', v.replace(/\D/g, ''))}
                                    onBlur={() => form.blur('MobileNumber')}
                                />
                                <FormField
                                    label="Store name" required leftIcon="shopping-bag" placeholder="Enter your store name"
                                    autoCapitalize="words"
                                    value={values.StoreName} error={errors.StoreName}
                                    onChangeText={v => form.set('StoreName', v)} onBlur={() => form.blur('StoreName')}
                                />
                            </>
                        )}

                        <FormField
                            label="Password" required leftIcon="lock" placeholder="At least 6 characters" secure
                            value={values.Password} error={errors.Password}
                            onChangeText={v => form.set('Password', v)} onBlur={() => form.blur('Password')}
                        />
                        <FormField
                            label="Confirm password" required leftIcon="lock" placeholder="Re-enter your password" secure
                            value={values.Confirm} error={errors.Confirm}
                            onChangeText={v => form.set('Confirm', v)} onBlur={() => form.blur('Confirm')}
                        />

                        <FormCheckbox checked={values.Agree} onChange={v => form.set('Agree', v)} error={errors.Agree}>
                            I agree to the{' '}
                            <CustomText style={[styles.link, { color: accent }]} onPress={() => navigation.navigate('TermsAndConditions')}>Terms & Conditions</CustomText>
                            {' '}and{' '}
                            <CustomText style={[styles.link, { color: accent }]} onPress={() => navigation.navigate('PrivacyPolicy')}>Privacy Policy</CustomText>
                        </FormCheckbox>

                        <FormButton label="Create Account" onPress={onSignup} style={{ marginTop: 4 }} />

                        <View style={styles.signinRow}>
                            <CustomText style={[styles.signinText, { color: c.muted }]}>Already have an account? </CustomText>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <CustomText style={[styles.signinLink, { color: accent }]}>Sign In</CustomText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </Animated.View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20 },
    backBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    card: { flex: 1, marginTop: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    scroll: { padding: 24, paddingBottom: 140 },
    welcome: { fontSize: 30, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    desc: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginTop: 2 },
    switchText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginTop: 8 },
    switchLink: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    link: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
    verified: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, marginTop: -4, marginBottom: 14 },
    verifiedText: { flex: 1, color: '#16A34A', fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
    otpRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    verifyBtn: { height: 50, paddingHorizontal: 18, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    verifyText: { color: '#fff', fontFamily: FONTS_FAMILY.SourceSans3_Bold, fontSize: 14 },
    otpErr: { fontSize: 12, marginBottom: 4 },
    sendOtp: { alignSelf: 'flex-end', marginTop: 8 },
    signinRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    signinText: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
    signinLink: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
});

export default SignUp;
