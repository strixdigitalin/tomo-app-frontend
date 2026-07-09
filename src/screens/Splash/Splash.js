


// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, Image, ImageBackground, StatusBar, StyleSheet, View } from "react-native";
// import CustomText from "../../components/TextComponent";
// import IMG from "../../assets/Images";
// import { initializeTheme } from "../../redux/actions/themeActions";
// import { apiGet, apiPut, getItem } from "../../utils/Apis";
// import { setUser } from "../../redux/reducer/user";
// import { useDispatch } from "react-redux";
// import urls from "../../config/urls";
// import { ToastMsg } from "../../utils/helperFunctions";
// import ReactNativeBiometrics from 'react-native-biometrics';

// const Splash = ({ navigation }) => {
//     const dispatch = useDispatch();
//     const [loading, setLoading] = useState(false);
//     const rnBiometrics = new ReactNativeBiometrics();

//     useEffect(() => {
//         initializeTheme();
//         fetchData();
//         // updateLocation();
//         // initializeLocation()
//     }, []);

//     const initializeLocation = async () => {
//         try {
//             setLocationStatus('updating');
//             await LocationManager.initializeLocationTracking();

//             // Reset status after 2 seconds
//         } catch (error) {
//             console.log('Location initialization failed:', error);
//         }
//     }

//     const verifyBiometricBeforeLogin = async () => {
//         try {
//             const biometricEnabled = await getItem('user_biometric_enabled');
//             console.log('Biometric enabled:', biometricEnabled);

//             if (biometricEnabled !== 'true') {
//                 console.log('Biometric not enabled, skipping verification');
//                 return true;
//             }

//             const { available, biometryType } = await rnBiometrics.isSensorAvailable();
//             console.log('Biometric sensor available:', available, 'Type:', biometryType);

//             if (!available) {
//                 console.log('Biometric sensor not available');
//                 return true;
//             }

//             console.log('Showing biometric prompt...');
//             const { success, error } = await rnBiometrics.simplePrompt({
//                 promptMessage: 'Place your finger on the sensor to access your account',
//                 cancelButtonText: 'Cancel',
//             });

//             console.log('Biometric result:', { success, error });

//             if (success) {
//                 console.log('Biometric authentication successful');
//                 return true;
//             } else {
//                 console.log('Biometric authentication failed:', error);
//                 ToastMsg(error || 'Biometric authentication failed');
//                 navigation.replace('Onboarding');
//                 return false;
//             }
//         } catch (error) {
//             console.log('Biometric verification error:', error);
//             return true; // Allow login if biometric fails due to error
//         }
//     };

//     const navigateToUserDashboard = async (userData) => {
//         // Add a small delay to ensure UI is ready
//         setTimeout(async () => {
//             const biometricVerified = await verifyBiometricBeforeLogin();

//             if (!biometricVerified) {
//                 return;
//             }

//             dispatch(setUser(JSON.stringify(userData)));
//             ToastMsg('Successfully logged in');
//             navigation.navigate('Tab');
//         }, 1000); // 1 second delay
//     };

//     const fetchData = async () => {
//         const token = await getItem('token');
//         setLoading(true);

//         try {
//             if (token) {
//                 const getUserDetails = await apiGet(urls.userProfile);
//                 // console.log(getUserDetails?.data, '---------------');

//                 if (getUserDetails?.statusCode === 200 || getUserDetails?.data) {
//                     await navigateToUserDashboard(getUserDetails?.data);
//                 } else {
//                     navigation.replace('Onboarding');
//                 }
//                 setLoading(false);
//             } else {
//                 navigation.replace('Onboarding');
//                 setLoading(false);
//             }
//         } catch (error) {
//             console.log('Fetch data error:', error);
//             navigation.replace('Onboarding');
//             setLoading(false);
//         }
//     };

//     const updateLocation = async () => {
//         const token = await getItem('token');
//         const data = {
//             "Location": {
//                 "type": "Point",
//                 "coordinates": [
//                     75.8577,
//                     22.7196
//                 ]
//             }
//         };

//         if (token) {
//             try {
//                 const update = await apiPut(urls.updateLocation, data);
//                 console.log(update);
//             } catch (error) {
//                 console.log('Update location error:', error);
//             }
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <StatusBar
//                 translucent={true}
//                 backgroundColor="transparent"
//                 barStyle="light-content"
//             />
//             <Image
//                 source={IMG.TomoLogo}
//                 style={{
//                     width: '60%',
//                     height: '30%',
//                     // resizeMode: 'contain',
//                     borderRadius: 20,
//                     // position: 'absolute',
//                     // top: 0,
//                     // left: 0,
//                     alignSelf: 'center',
//                 }}
//             />
//             <ActivityIndicator
//                 color={'white'}
//                 size='large'
//                 style={{
//                     position: 'absolute',
//                     bottom: 40,
//                     alignSelf: 'center'
//                 }}
//             />
//         </View>
//     );
// };

// export default Splash;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
// backgroundColor: '#09152A'  
// // backgroundColor:'#0b0738ff'
//   }
// });



import React, { useEffect, useState, useRef } from "react";
import { 
    ActivityIndicator, 
    Image, 
    StatusBar, 
    StyleSheet, 
    View, 
    Animated 
} from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import { initializeTheme } from "../../redux/actions/themeActions";
import { apiGet, apiPut, getItem } from "../../utils/Apis";
import { setUser } from "../../redux/reducer/user";
import { useDispatch } from "react-redux";
import urls from "../../config/urls";
import { ToastMsg } from "../../utils/helperFunctions";
import ReactNativeBiometrics from 'react-native-biometrics';
import { deflate } from "@shopify/react-native-skia";

const Splash = ({ navigation }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showLogo, setShowLogo] = useState(false);
    const rnBiometrics = new ReactNativeBiometrics();

    // Animation values
    const bubbleScale = useRef(new Animated.Value(0)).current;
    const bubbleOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const bgColorAnim = useRef(new Animated.Value(0)).current;
    const loginNavigationTimerRef = useRef(null);

    useEffect(() => {
        startAnimationSequence();

        return () => {
            if (loginNavigationTimerRef.current) {
                clearTimeout(loginNavigationTimerRef.current);
            }
        };
    }, []);

    const startAnimationSequence = () => {
        // Step 1: Background color fade in
        Animated.timing(bgColorAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
        }).start(() => {
            // Step 2: Bubble appears and grows
            setShowLogo(true);
            Animated.parallel([
                Animated.timing(bubbleOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(bubbleScale, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Step 3: Bubble burst - scale up and fade out
                Animated.parallel([
                    Animated.timing(bubbleScale, {
                        toValue: 1.5,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bubbleOpacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    // Step 4: Logo appears with bounce
                    Animated.parallel([
                        Animated.spring(logoScale, {
                            toValue: 1,
                            friction: 8,
                            tension: 40,
                            useNativeDriver: true,
                        }),
                        Animated.timing(logoOpacity, {
                            toValue: 1,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                    ]).start(() => {
                        // Animation complete, proceed with app initialization
                        initializeApp();
                    });
                });
            });
        });
    };

    const initializeApp = () => {
        initializeTheme();
        fetchData();
    };

    const verifyBiometricBeforeLogin = async () => {
        try {
            const biometricEnabled = await getItem('user_biometric_enabled');
            // console.log('Biometric enabled:', biometricEnabled);

            if (biometricEnabled !== 'true') {
                // console.log('Biometric not enabled, skipping verification');
                return true;
            }

            const { available, biometryType } = await rnBiometrics.isSensorAvailable();
            // console.log('Biometric sensor available:', available, 'Type:', biometryType);

            if (!available) {
                // console.log('Biometric sensor not available');
                return true;
            }

            console.log('Showing biometric prompt...');
            const { success, error } = await rnBiometrics.simplePrompt({
                promptMessage: 'Place your finger on the sensor to access your account',
                cancelButtonText: 'Cancel',
            });

            // console.log('Biometric result:', { success, error });

            if (success) {
                // console.log('Biometric authentication successful');
                return true;
            } else {
                // console.log('Biometric authentication failed:', error);
                ToastMsg(error || 'Biometric authentication failed');
                navigation.replace('Onboarding');
                return false;
            }
        } catch (error) {
            // console.log('Biometric verification error:', error);
            return true;
        }
    };

    const navigateToUserDashboard = async (userData) => {
        if (loginNavigationTimerRef.current) {
            clearTimeout(loginNavigationTimerRef.current);
        }

        loginNavigationTimerRef.current = setTimeout(async () => {
            const biometricVerified = await verifyBiometricBeforeLogin();

            if (!biometricVerified) {
                return;
            }

            dispatch(setUser(JSON.stringify(userData)));
            ToastMsg('Successfully logged in');
            navigation.navigate('Tab');
        }, 1000);
    };

    const fetchData = async () => {
        const token = await getItem('token');
        setLoading(true);

        try {
            if (token) {
        
                const updateLastSeen = await apiGet('/api/user/UserUpdateLastActive');
                if(updateLastSeen?.statusCode==200){

                    const getUserDetails = await apiGet(urls.userProfile);
    
                    if (getUserDetails?.statusCode === 200 || getUserDetails?.data) {
                        await navigateToUserDashboard(getUserDetails?.data);
                    } else {
                        navigation.replace('Onboarding');
                    }
                    setLoading(false);
                }

            } else {
                navigation.replace('Onboarding');
                setLoading(false);
            }
        } catch (error) {
            console.log('Fetch data error:', error);
            navigation.replace('Onboarding');
            setLoading(false);
        }
    };

    const updateLocation = async () => {
        const token = await getItem('token');
        const data = {
            "Location": {
                "type": "Point",
                "coordinates": [75.8577, 22.7196]
            }
        };

        if (token) {
            try {
                const update = await apiPut(urls.updateLocation, data);
                console.log(update);
            } catch (error) {
                console.log('Update location error:', error);
            }
        }
    };

    // Interpolate background color
    const backgroundColor = bgColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#000000', '#09152A'],
    });

    return (
        <Animated.View style={[styles.container, { backgroundColor }]}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="light-content"
            />

            {/* Bubble Effect */}
            {showLogo && (
                <Animated.View
                    style={[
                        styles.bubbleContainer,
                        {
                            opacity: bubbleOpacity,
                            transform: [{ scale: bubbleScale }],
                        },
                    ]}
                >
                    <View style={styles.bubble} />
                </Animated.View>
            )}

            {/* Logo with Animation */}
            {showLogo && (
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: logoOpacity,
                            transform: [{ scale: logoScale }],
                        },
                    ]}
                >
                    <Image
                        source={IMG.TomoLogo}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>
            )}

            {/* Loading Indicator */}
            {loading && (
                <ActivityIndicator
                    color={'white'}
                    size='large'
                    style={styles.loader}
                />
            )}
        </Animated.View>
    );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bubbleContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bubble: {
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 250,
        height: 250,
        borderRadius: 20,
    },
    loader: {
        position: 'absolute',
        bottom: 40,
    },
});

// export default Splash