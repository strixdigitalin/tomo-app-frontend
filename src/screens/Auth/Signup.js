import React, { useEffect, useRef, useState } from "react";
import { Animated, ImageBackground, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { Back, BackOuterWhite, BottomIndicator, EmailIcon, EmailWhite, EyeIcon, EyeIconWhite, LockIcon, LockWhite, SignUpbtn } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomInputField from "../../components/CustomInputField";
import { useSelector } from "react-redux";
import { apiPost } from "../../utils/Apis";
import useLoader from "../../utils/LoaderHook";
import urls from "../../config/urls";
import { ToastMsg } from "../../utils/helperFunctions";
import { inValidEmail, inValidPassword } from "../../utils/CheckValidation";

const SignUp = ({ navigation, route }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const slideAnim = useRef(new Animated.Value(300)).current; // Start off-screen

    const [signupAs, setSignupAs] = useState(route?.params?.signupAs === 'Seller' ? 'Seller' : 'User');

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const [userInfo, setUserInfor] = useState({})
    const handleInputChange = (name, value) => {
        setUserInfor({ ...userInfo, [name]: value });
    };

    const { showLoader, hideLoader } = useLoader()

    const onSignup = async () => {
        const emailError = inValidEmail(userInfo?.Email);
        if (emailError) {
            return ToastMsg(emailError);
        }

        if (!userInfo?.UserName) {
            return ToastMsg('UserName is required');
        }
        if (!userInfo?.FullName) {
            return ToastMsg('FullName is required');
        }
        if (signupAs === 'Seller' && !userInfo?.StoreName) {
            return ToastMsg('Store Name is required');
        }

        if (userInfo?.Password !== userInfo?.Confirm) {
            return ToastMsg('Password & Confirm password should be same');
        }

        const passwordError = inValidPassword(userInfo?.Password);
        if (passwordError) {
            return ToastMsg(passwordError);
        }
        try {
            showLoader();

            if (signupAs === 'Seller') {
                const data = {
                    UserName: userInfo?.UserName,
                    FullName: userInfo?.FullName,
                    Email: userInfo.Email,
                    MobileNumber: userInfo?.MobileNumber,
                    Password: userInfo?.Password,
                    StoreName: userInfo?.StoreName,
                };
                const response = await apiPost(urls.sellerSignup, data, {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response?.statusCode === 200) {
                    ToastMsg(response?.message);
                    hideLoader();
                    setUserInfor({});
                    navigation.goBack();
                }
                return;
            }

            const data = {
                UserName: userInfo?.UserName,
                FullName: userInfo?.FullName,
                Email: userInfo.Email,
                Password: userInfo?.Password
            };
            const response = await apiPost(urls.userSignup, data, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response?.statusCode === 200) {
                ToastMsg(response?.message)
                hideLoader();
                setUserInfor({})
                navigation.goBack()
            }
        } catch (error) {
            hideLoader();
            if (error?.message) {
                ToastMsg(error?.message);
            } else {
                ToastMsg('Network Error');
            }
        }
    };

    const renderHeader = () => {
        return (
            <Row style={{ paddingTop: 50, paddingHorizontal: 20, gap: 80 }}>
                <Row>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        {isDarkMode ? <BackOuterWhite /> : <Back />}
                    </TouchableOpacity>
                    <CustomText style={{ fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>Back</CustomText>
                </Row>
                <CustomText style={{
                    fontSize: 18,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>{signupAs === 'Seller' ? 'Seller Sign up' : 'Sign up'}</CustomText>
            </Row>
        )
    }

    const renderItems = () => {
        return (
            <Animated.View style={{
                transform: [{ translateX: slideAnim }],
                marginTop: 30,
                backgroundColor: isDarkMode ? '#252525' : 'rgba(255, 255, 255, 1)',
                flexGrow: 1,
                padding: 20,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30
            }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <CustomText style={{
                        fontFamily: FONTS_FAMILY.SourceSans3_Bold,
                        fontSize: 32
                    }}>Welcome</CustomText>

                    <CustomText style={{
                        fontSize: 16,
                        fontFamily: FONTS_FAMILY.SourceSans3_Regular,
                        color: 'rgba(137, 138, 131, 1)'
                    }}>
                        {signupAs === 'Seller'
                            ? 'Create a Seller account to start listing your shop & products!'
                            : 'Create Account to keep exploring amazing destinations around the world!'}
                    </CustomText>

                    <CustomText style={{
                        fontSize: 14,
                        fontFamily: FONTS_FAMILY.SourceSans3_Regular,
                        marginTop: 8,
                    }}>
                        {signupAs === 'Seller' ? 'Are you a User? ' : 'Are you a Seller? '}
                        <CustomText
                            style={{
                                fontSize: 14,
                                fontFamily: FONTS_FAMILY.SourceSans3_Medium,
                                color: 'green',
                            }}
                            onPress={() => setSignupAs(signupAs === 'Seller' ? 'User' : 'Seller')}
                        >
                            {signupAs === 'Seller' ? 'Sign up as User' : 'Sign up as Seller'}
                        </CustomText>
                    </CustomText>

                    <View style={{ marginTop: 15, alignItems: 'center', }}>
                        <CustomInputField
                            placeholder={'Enter User name'}
                            value={userInfo?.UserName}
                            onChangeText={(value) => handleInputChange('UserName', value)}
                        />
                        <CustomInputField
                            placeholder={'Enter your full name'}
                            value={userInfo?.FullName}
                            onChangeText={(value) => handleInputChange('FullName', value)}
                        />
                        <CustomInputField
                            placeholder={'Enter your Email address'}
                            Lefticon={isDarkMode ? <EmailWhite /> : <EmailIcon />}
                            value={userInfo?.Email}
                            onChangeText={(value) => handleInputChange('Email', value)}
                        />
                        {signupAs === 'Seller' && (
                            <>
                                <CustomInputField
                                    placeholder={'Enter your Mobile Number'}
                                    keyboardType={'number-pad'}
                                    value={userInfo?.MobileNumber}
                                    onChangeText={(value) => handleInputChange('MobileNumber', value)}
                                />
                                <CustomInputField
                                    placeholder={'Enter your Store Name'}
                                    value={userInfo?.StoreName}
                                    onChangeText={(value) => handleInputChange('StoreName', value)}
                                />
                            </>
                        )}
                        <CustomInputField
                            placeholder={'Enter Password '}
                              isPasswordField={true} 
                            Lefticon={isDarkMode ? <LockWhite /> : <LockIcon />}
                            icon={isDarkMode ? <EyeIconWhite /> : <EyeIcon />}
                            value={userInfo?.Password}
                            onChangeText={(value) => handleInputChange('Password', value)}
                        />
                        <CustomInputField
                            placeholder={'Enter confirm Password '}
                            Lefticon={<LockIcon />}
                              isPasswordField={true} 
                            icon={<EyeIcon />}
                            value={userInfo?.Confirm}
                            onChangeText={(value) => handleInputChange('Confirm', value)}
                        />
                        <TouchableOpacity style={{ marginTop: 30 }}
                            // onPress={() => navigation.navigate('Tab')}
                            onPress={onSignup}
                        >
                            <SignUpbtn width={380} height={65} />
                        </TouchableOpacity>

                        <CustomText style={{
                            fontSize: 16,
                            fontFamily: FONTS_FAMILY.SourceSans3_Regular
                        }}>
                            Already have an account?{" "}
                            
                            <CustomText style={{
                                fontSize: 16,
                                fontFamily: FONTS_FAMILY.SourceSans3_Medium,
                                color: 'green'
                            }} onPress={()=>navigation.goBack()}>
                                Sign In
                            </CustomText>
                        </CustomText>
                    </View>

                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <CustomText style={{
                            fontSize: 15,
                            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
                            textAlign: 'center'
                        }}>
                            By creating an account, you agree to our{" "}
                            <CustomText style={{
                                fontSize: 15,
                                fontFamily: FONTS_FAMILY.SourceSans3_Regular,
                                color: 'green'
                            }} onPress={()=>navigation.navigate('TermsAndConditions')}>
                                Terms & Conditions
                            </CustomText>{" "}and agree to{" "}

                            <CustomText style={{
                                fontSize: 15,
                                fontFamily: FONTS_FAMILY.SourceSans3_Regular,
                                color: 'green'
                            }}
                            onPress={()=>navigation.navigate('PrivacyPolicy')}
                            >
                                Privacy Policy
                            </CustomText>
                        </CustomText>
                    </View>
                </ScrollView>

                <BottomIndicator style={{ position: 'absolute', bottom: 10, alignSelf: 'center' }} />
            </Animated.View>
        )
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : 'white'
        }
    });

    return (
        <ImageBackground source={IMG.bgShadow} style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />
            {renderHeader()}
            {renderItems()}
        </ImageBackground>
    )
}

export default SignUp;
