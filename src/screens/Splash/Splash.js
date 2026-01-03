// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, ImageBackground, StatusBar, StyleSheet, View } from "react-native";
// import CustomText from "../../components/TextComponent";
// import IMG from "../../assets/Images";
// import { initializeTheme } from "../../redux/actions/themeActions";
// import { apiGet, apiPut, getItem } from "../../utils/Apis";
// import { setUser } from "../../redux/reducer/user";
// import { useDispatch } from "react-redux";
// import urls from "../../config/urls";


// const Splash = ({ navigation }) => {

//     useEffect(() => {
//         initializeTheme()
//         fetchData()
//         updateLocation()
//     }, [])




//     const dispatch = useDispatch()

//     const [loading, setLoading] = useState(false)
//     const fetchData = async () => {
//         const token = await getItem('token');
//         setLoading(true)
//         if (token) {
//             const getUserDetails = await apiGet(urls.userProfile)
//             // console.log(getUserDetails?.data, '---------------');
//             dispatch(setUser(JSON.stringify(getUserDetails?.data)));
//             navigation.navigate('Tab');
//             setLoading(false)
//         } else {
//             navigation.replace('Onboarding')
//             setLoading(false)
//         }
//     }

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
//         }
//         if (token) {
//             const update = await apiPut(urls.updateLocation, data)
//             console.log(update);


//         }


//     }





//     return (
//         <ImageBackground source={IMG.Splash} style={styles.container}>
//             <StatusBar
//                 translucent={true}
//                 backgroundColor="transparent"
//                 barStyle="light-content"
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
//         </ImageBackground>
//     )
// }

// export default Splash;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1
//     }
// })


import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, StatusBar, StyleSheet, View } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import { initializeTheme } from "../../redux/actions/themeActions";
import { apiGet, apiPut, getItem } from "../../utils/Apis";
import { setUser } from "../../redux/reducer/user";
import { useDispatch } from "react-redux";
import urls from "../../config/urls";
import { ToastMsg } from "../../utils/helperFunctions";
import ReactNativeBiometrics from 'react-native-biometrics';

const Splash = ({ navigation }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const rnBiometrics = new ReactNativeBiometrics();

    useEffect(() => {
        initializeTheme();
        fetchData();
        // updateLocation();
        // initializeLocation()
    }, []);

    const initializeLocation = async () => {
        try {
            setLocationStatus('updating');
            await LocationManager.initializeLocationTracking();

            // Reset status after 2 seconds
        } catch (error) {
            console.log('Location initialization failed:', error);
        }
    }

    const verifyBiometricBeforeLogin = async () => {
        try {
            const biometricEnabled = await getItem('user_biometric_enabled');
            console.log('Biometric enabled:', biometricEnabled);

            if (biometricEnabled !== 'true') {
                console.log('Biometric not enabled, skipping verification');
                return true;
            }

            const { available, biometryType } = await rnBiometrics.isSensorAvailable();
            console.log('Biometric sensor available:', available, 'Type:', biometryType);

            if (!available) {
                console.log('Biometric sensor not available');
                return true;
            }

            console.log('Showing biometric prompt...');
            const { success, error } = await rnBiometrics.simplePrompt({
                promptMessage: 'Place your finger on the sensor to access your account',
                cancelButtonText: 'Cancel',
            });

            console.log('Biometric result:', { success, error });

            if (success) {
                console.log('Biometric authentication successful');
                return true;
            } else {
                console.log('Biometric authentication failed:', error);
                ToastMsg(error || 'Biometric authentication failed');
                navigation.replace('Onboarding');
                return false;
            }
        } catch (error) {
            console.log('Biometric verification error:', error);
            return true; // Allow login if biometric fails due to error
        }
    };

    const navigateToUserDashboard = async (userData) => {
        // Add a small delay to ensure UI is ready
        setTimeout(async () => {
            const biometricVerified = await verifyBiometricBeforeLogin();

            if (!biometricVerified) {
                return;
            }

            dispatch(setUser(JSON.stringify(userData)));
            ToastMsg('Successfully logged in');
            navigation.navigate('Tab');
        }, 1000); // 1 second delay
    };

    const fetchData = async () => {
        const token = await getItem('token');
        setLoading(true);

        try {
            if (token) {
                const getUserDetails = await apiGet(urls.userProfile);
                // console.log(getUserDetails?.data, '---------------');

                if (getUserDetails?.statusCode === 200 || getUserDetails?.data) {
                    await navigateToUserDashboard(getUserDetails?.data);
                } else {
                    navigation.replace('Onboarding');
                }
                setLoading(false);
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
                "coordinates": [
                    75.8577,
                    22.7196
                ]
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

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <Image
                source={IMG.TomoLogo}
                style={{
                    width: '60%',
                    height: '30%',
                    // resizeMode: 'contain',
                    borderRadius: 20,
                    // position: 'absolute',
                    // top: 0,
                    // left: 0,
                    alignSelf: 'center',
                }}
            />
            <ActivityIndicator
                color={'white'}
                size='large'
                style={{
                    position: 'absolute',
                    bottom: 40,
                    alignSelf: 'center'
                }}
            />
        </View>
    );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
backgroundColor: '#09152A'  
// backgroundColor:'#0b0738ff'
  }
});



// ImageEditor.js
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
// import { Canvas, Image, useImage, ColorMatrix } from '@shopify/react-native-skia';
// import Slider from '@react-native-community/slider';
// import ImagePicker from 'react-native-image-crop-picker';

// const { width } = Dimensions.get('window');

// const ImageEditor = () => {
//     const [imageUri, setImageUri] = useState(null);
//     const [selectedFilter, setSelectedFilter] = useState('normal');
//     const [brightness, setBrightness] = useState(0);
//     const [contrast, setContrast] = useState(1);
//     const [saturation, setSaturation] = useState(1);
//     const [showAdjust, setShowAdjust] = useState(null);

//     const image = useImage(imageUri);

//     // Instagram filters
//     const filters = {
//         normal: [
//             1, 0, 0, 0, 0,
//             0, 1, 0, 0, 0,
//             0, 0, 1, 0, 0,
//             0, 0, 0, 1, 0
//         ],

//         clarendon: [
//             1.15, 0, 0, 0, 0,
//             0, 1.08, 0, 0, 0,
//             0, 0, 1.0, 0, 0,
//             0, 0, 0, 1, 0
//         ],

//         gingham: [
//             1.05, 0, 0, 0, 0,
//             0, 1.05, 0, 0, 0,
//             0, 0, 1.05, 0, 0,
//             0, 0, 0, 1, 0
//         ],

//         moon: [
//             0.95, 0, 0, 0, 0,
//             0, 0.95, 0, 0, 0,
//             0, 0, 0.95, 0, 0,
//             0, 0, 0, 1, 0
//         ],

//         lark: [
//             1.08, 0, 0, 0, 0,
//             0, 1.03, 0, 0, 0,
//             0, 0, 0.98, 0, 0,
//             0, 0, 0, 1, 0
//         ],

//         reyes: [
//             1.05, 0, 0, 0, 0,
//             0, 0.95, 0, 0, 0,
//             0, 0, 0.93, 0, 0,
//             0, 0, 0, 1, 0
//         ],

//         juno: [
//             1.1, 0, 0, 0, 0,
//             0, 1.05, 0, 0, 0,
//             0, 0, 0.95, 0, 0,
//             0, 0, 0, 1, 0
//         ],

//         slumber: [
//             1.02, 0, 0, 0, 0,
//             0, 0.98, 0, 0, 0,
//             0, 0, 1.0, 0, 0,
//             0, 0, 0, 1, 0
//         ],

//         aden: [
//             1.05, 0, 0, 0, 0,
//             0, 0.98, 0, 0, 0,
//             0, 0, 0.98, 0, 0,
//             0, 0, 0, 1, 0
//         ],

//         perpetua: [
//             1.03, 0, 0, 0, 0,
//             0, 1.03, 0, 0, 0,
//             0, 0, 0.99, 0, 0,
//             0, 0, 0, 1, 0
//         ],

//         nashville: [
//             1.1, 0, 0, 0, 0,
//             0, 1.0, 0, 0, 0,
//             0, 0, 1.05, 0, 0,
//             0, 0, 0, 1, 0
//         ],

//         valencia: [
//             1.08, 0, 0, 0, 0,
//             0, 1.03, 0, 0, 0,
//             0, 0, 0.95, 0, 0,
//             0, 0, 0, 1, 0
//         ],
//     };

//     const pickImage = async () => {
//         try {
//             const img = await ImagePicker.openPicker({
//                 width: 1080,
//                 height: 1080,
//                 cropping: true,
//                 cropperCircleOverlay: false,
//                 compressImageQuality: 0.8,
//             });
//             setImageUri(img.path);
//         } catch (error) {
//             console.log('ImagePicker Error:', error);
//         }
//     };

//     // Combine all adjustments
//     const getColorMatrix = () => {
//         const filter = filters[selectedFilter];
//         const b = brightness / 255;
//         const c = contrast;
//         const s = saturation;

//         // Apply brightness, contrast, saturation + filter
//         return [
//             filter[0] * c * s, filter[1], filter[2], filter[3], filter[4] + b * 255,
//             filter[5], filter[6] * c * s, filter[7], filter[8], filter[9] + b * 255,
//             filter[10], filter[11], filter[12] * c * s, filter[13], filter[14] + b * 255,
//             filter[15], filter[16], filter[17], filter[18], filter[19],
//         ];
//     };

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => { }}>
//                     <Text style={styles.headerButton}>Cancel</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Edit Photo</Text>
//                 <TouchableOpacity onPress={() => { }}>
//                     <Text style={[styles.headerButton, styles.doneButton]}>Done</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* Image Preview with Skia Canvas */}
//             <View style={styles.imageContainer}>
//                 {imageUri ? (
//                     <Canvas style={styles.canvas}>
//                         <Image
//                             image={image}
//                             x={0}
//                             y={0}
//                             width={width}
//                             height={width}
//                             fit="contain"
//                         >
//                             <ColorMatrix matrix={getColorMatrix()} />
//                         </Image>
//                     </Canvas>
//                 ) : (
//                     <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
//                         <Text style={styles.pickButtonText}>Pick an Image</Text>
//                     </TouchableOpacity>
//                 )}
//             </View>

//             {/* Filters */}
//             {imageUri && (
//                 <>
//                     <View style={styles.filtersSection}>
//                         <Text style={styles.sectionTitle}>FILTERS</Text>
//                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                             {Object.keys(filters).map((key) => (
//                                 <TouchableOpacity
//                                     key={key}
//                                     style={styles.filterItem}
//                                     onPress={() => setSelectedFilter(key)}
//                                 >
//                                     <View style={[
//                                         styles.filterThumb,
//                                         selectedFilter === key && styles.filterThumbActive
//                                     ]}>
//                                         <Text style={styles.filterThumbText}>{key[0].toUpperCase()}</Text>
//                                     </View>
//                                     <Text style={[
//                                         styles.filterName,
//                                         selectedFilter === key && styles.filterNameActive
//                                     ]}>
//                                         {key.charAt(0).toUpperCase() + key.slice(1)}
//                                     </Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </ScrollView>
//                     </View>

//                     {/* Adjustments */}
//                     <View style={styles.adjustmentsSection}>
//                         <Text style={styles.sectionTitle}>ADJUST</Text>
//                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                             <TouchableOpacity
//                                 style={styles.adjustButton}
//                                 onPress={() => setShowAdjust('brightness')}
//                             >
//                                 <View style={styles.adjustIcon}>
//                                     <Text style={styles.adjustIconText}>☀️</Text>
//                                 </View>
//                                 <Text style={styles.adjustLabel}>Brightness</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 style={styles.adjustButton}
//                                 onPress={() => setShowAdjust('contrast')}
//                             >
//                                 <View style={styles.adjustIcon}>
//                                     <Text style={styles.adjustIconText}>◐</Text>
//                                 </View>
//                                 <Text style={styles.adjustLabel}>Contrast</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 style={styles.adjustButton}
//                                 onPress={() => setShowAdjust('saturation')}
//                             >
//                                 <View style={styles.adjustIcon}>
//                                     <Text style={styles.adjustIconText}>🎨</Text>
//                                 </View>
//                                 <Text style={styles.adjustLabel}>Saturation</Text>
//                             </TouchableOpacity>
//                         </ScrollView>
//                     </View>

//                     {/* Slider */}
//                     {showAdjust && (
//                         <View style={styles.sliderContainer}>
//                             <View style={styles.sliderHeader}>
//                                 <Text style={styles.sliderTitle}>
//                                     {showAdjust.charAt(0).toUpperCase() + showAdjust.slice(1)}
//                                 </Text>
//                                 <TouchableOpacity onPress={() => setShowAdjust(null)}>
//                                     <Text style={styles.closeButton}>✕</Text>
//                                 </TouchableOpacity>
//                             </View>
//                             {showAdjust === 'brightness' && (
//                                 <Slider
//                                     value={brightness}
//                                     onValueChange={setBrightness}
//                                     minimumValue={-0.3}  // Pehle -50 tha, ab -0.3
//                                     maximumValue={0.3}
//                                     minimumTrackTintColor="#0095f6"
//                                     maximumTrackTintColor="#555"
//                                 />
//                             )}
//                             {showAdjust === 'contrast' && (
//                                 <Slider
//                                     value={contrast}
//                                     onValueChange={setContrast}
//                                     minimumValue={0.5}
//                                     maximumValue={2}
//                                     minimumTrackTintColor="#0095f6"
//                                     maximumTrackTintColor="#555"
//                                 />
//                             )}
//                             {showAdjust === 'saturation' && (
//                                 <Slider
//                                     value={saturation}
//                                     onValueChange={setSaturation}
//                                     minimumValue={0}
//                                     maximumValue={2}
//                                     minimumTrackTintColor="#0095f6"
//                                     maximumTrackTintColor="#555"
//                                 />
//                             )}
//                         </View>
//                     )}
//                 </>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#000',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         backgroundColor: '#1a1a1a',
//     },
//     headerButton: {
//         color: '#fff',
//         fontSize: 16,
//     },
//     doneButton: {
//         color: '#0095f6',
//         fontWeight: '600',
//     },
//     headerTitle: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: '600',
//     },
//     imageContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     canvas: {
//         width: width,
//         height: width,
//     },
//     pickButton: {
//         backgroundColor: '#0095f6',
//         paddingHorizontal: 32,
//         paddingVertical: 16,
//         borderRadius: 8,
//     },
//     pickButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     filtersSection: {
//         backgroundColor: '#1a1a1a',
//         paddingVertical: 12,
//     },
//     sectionTitle: {
//         color: '#888',
//         fontSize: 11,
//         fontWeight: '600',
//         paddingHorizontal: 16,
//         marginBottom: 8,
//     },
//     filterItem: {
//         alignItems: 'center',
//         marginHorizontal: 8,
//     },
//     filterThumb: {
//         width: 60,
//         height: 60,
//         borderRadius: 8,
//         backgroundColor: '#333',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderWidth: 2,
//         borderColor: 'transparent',
//     },
//     filterThumbActive: {
//         borderColor: '#0095f6',
//     },
//     filterThumbText: {
//         color: '#fff',
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
//     filterName: {
//         color: '#888',
//         fontSize: 11,
//         marginTop: 6,
//     },
//     filterNameActive: {
//         color: '#fff',
//         fontWeight: '600',
//     },
//     adjustmentsSection: {
//         backgroundColor: '#1a1a1a',
//         paddingVertical: 12,
//     },
//     adjustButton: {
//         alignItems: 'center',
//         marginHorizontal: 12,
//     },
//     adjustIcon: {
//         width: 44,
//         height: 44,
//         borderRadius: 22,
//         backgroundColor: '#2a2a2a',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     adjustIconText: {
//         fontSize: 20,
//     },
//     adjustLabel: {
//         color: '#fff',
//         fontSize: 11,
//         marginTop: 6,
//     },
//     sliderContainer: {
//         backgroundColor: '#1a1a1a',
//         padding: 16,
//     },
//     sliderHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 12,
//     },
//     sliderTitle: {
//         color: '#fff',
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     closeButton: {
//         color: '#fff',
//         fontSize: 20,
//     },
// });

// export default ImageEditor;