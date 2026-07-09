


// import React, { useEffect, useRef, useState } from "react";
// import { Animated, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import CustomText from "../../components/TextComponent";
// import IMG from "../../assets/Images";
// import Row from "../../components/wrapper/row";
// import { Back, BackOuterWhite, BottomIndicator, EmailIcon, EmailWhite, EyeIcon, EyeIconWhite, LockIcon, LockWhite, SignUpbtn, SubmitBtn, Upload } from "../../assets/SVGs";
// import { FONTS_FAMILY } from "../../assets/Fonts";
// import CustomInputField from "../../components/CustomInputField";
// import { useSelector } from "react-redux";
// import { apiPost, BASE_URL, getItem } from "../../utils/Apis";
// import useLoader from "../../utils/LoaderHook";
// import urls from "../../config/urls";
// import { ToastMsg } from "../../utils/helperFunctions";
// import { inValidEmail, inValidPassword } from "../../utils/CheckValidation";
// import { launchImageLibrary } from 'react-native-image-picker';
// import { Platform, PermissionsAndroid } from 'react-native';
// import axios from "axios";
// import LinearGradient from "react-native-linear-gradient";

// const CreateProducts = ({ navigation, route }) => {
//     const { isDarkMode } = useSelector(state => state.theme);
//     const slideAnim = useRef(new Animated.Value(300)).current;

//     const [fileName, setFileName] = useState({});
//     const [productName, setproductName] = useState(null);
//     const [productDetails, setproductDetails] = useState(null);
//     const [shopServices, setShopServices] = useState(null);
//     const [location, setLocation] = useState(null);






//     useEffect(() => {
//         Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//         }).start();
//     }, []);

//     const [userInfo, setUserInfor] = useState({})


//     const { showLoader, hideLoader } = useLoader()


//     const onSubmit = async () => {
//         console.log('--------', fileName);

//         try {
//             const token = await getItem('token');
//             showLoader();

//             if (!fileName || !fileName.uri) {
//                 ToastMsg('No file selected');
//                 hideLoader();
//                 return;
//             }

//             const formData = new FormData();
//             formData.append("Image", {
//                 uri: Platform.OS === "android" ? fileName.uri : fileName.uri.replace('file://', ''),
//                 type: fileName.type || "application/octet-stream",
//                 name: fileName.fileName || fileName.name || "upload.pdf",
//             });

//             formData.append("ProductName", productName);
//             formData.append("Shop", route?.params?.shopId);
//             formData.append("ProductDetails", productDetails);
//             // formData.append("Location", '[75.8577,22.7196]"');




//             const response = await fetch(
//                 `${BASE_URL}/api/user/CreateProduct`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Authorization": `Bearer ${token}`,
//                     },
//                     body: formData,
//                 }
//             );
//             const result = await response.json();
//             ToastMsg(result?.message);
//             navigation.goBack()
//             hideLoader();

//         } catch (error) {
//             hideLoader();
//             console.log('Upload Failed:', error?.response?.data || error.message);
//         }
//     };





//     const handleFilePick = () => {
//         const options = {
//             mediaType: 'photo', // photo only
//             selectionLimit: 1,
//         };

//         launchImageLibrary(options, (response) => {
//             if (response.didCancel) {
//                 console.log('User cancelled image picker');
//             } else if (response.errorMessage) {
//                 console.error('Image Picker Error:', response.errorMessage);
//             } else {
//                 const asset = response.assets[0];
//                 setFileName({
//                     uri: asset.uri,
//                     type: asset.type,
//                     name: asset.fileName,
//                 });
//             }
//         });
//     };




//     const renderHeader = () => {
//         return (
//             <Row style={{ paddingTop: 50, paddingHorizontal: 20, gap: 70 }}>
//                 <Row>
//                     <TouchableOpacity onPress={() => navigation.goBack()}>
//                         {isDarkMode ? <BackOuterWhite /> : <Back />}
//                     </TouchableOpacity>
//                     <CustomText style={{ fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>Back</CustomText>
//                 </Row>
//                 <CustomText style={{
//                     fontSize: 18,
//                     fontFamily: FONTS_FAMILY.SourceSans3_Bold
//                 }}>Add Product</CustomText>
//             </Row>
//         )
//     }

//     const renderItems = () => {
//         return (
//             <Animated.View style={{
//                 transform: [{ translateX: slideAnim }],
//                 marginTop: 30,
//                 backgroundColor: isDarkMode ? '#252525' : 'rgba(255, 255, 255, 1)',
//                 flexGrow: 1,
//                 padding: 20,
//                 borderTopLeftRadius: 30,
//                 borderTopRightRadius: 30
//             }}>
//                 <ScrollView contentContainerStyle={{ paddingBottom: 100 }}
//                     showsVerticalScrollIndicator={false}
//                 >
//                     <View style={{ marginTop: 15, alignItems: 'center', gap: 10 }}>
//                         <CustomInputField
//                             placeholder={'Enter'}
//                             // icon={<Upload />}
//                             // editable={false}
//                             label={'Product Name'}
//                             value={productName}
//                             onChangeText={setproductName}
//                         />
//                         <CustomInputField
//                             placeholder={'Product Details'}
//                             // icon={<Upload />}
//                             // editable={false}
//                             label={'Product Details'}
//                             value={productDetails}
//                             onChangeText={setproductDetails}
//                         />
//                         {/* <CustomInputField
//                             placeholder={'Shop Service'}
//                             // icon={<Upload />}
//                             // editable={false}
//                             label={'Shop Service'}
//                             value={shopServices}
//                             onChangeText={setShopServices}
//                         /> */}
//                         <TouchableOpacity onPress={handleFilePick}
//                             style={{
//                                 marginTop: 10
//                             }}
//                         >
//                             <CustomInputField
//                                 placeholder={'Upload '}
//                                 icon={<Upload />}
//                                 editable={false}
//                                 label={'Product Image'}
//                                 lableStyle={true}

//                                 value={fileName?.uri}
//                             // onChangeText={(value) => handleInputChange('Confirm', value)}
//                             />
//                         </TouchableOpacity>



//                         {/* <TouchableOpacity style={{ top: 100 }}
//                             // onPress={() => navigation.navigate('Tab')}
//                             onPress={onSubmit}
//                         >
//                             <SubmitBtn width={380} height={65} />
//                         </TouchableOpacity> */}

//                         <TouchableOpacity
//                             onPress={onSubmit}
//                         >
//                             <LinearGradient
//                                 // colors={['#ff00ff', '#6a5acd']}
//                                 colors={['#21B7FF', '#0084F8']}
//                                 start={{ x: 1, y: 0 }}
//                                 end={{ x: 1, y: 1 }}
//                                 style={styles.followButton}
//                             >
//                                 <Text style={[
//                                     styles.followText,
//                                     { color: '#fff' }
//                                 ]}>
//                                     Add shop
//                                 </Text>
//                             </LinearGradient>
//                         </TouchableOpacity>
//                     </View>
//                 </ScrollView>

//                 {/* <BottomIndicator style={{ position: 'absolute', bottom: 10, alignSelf: 'center' }} /> */}
//             </Animated.View>
//         )
//     }

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: isDarkMode ? 'black' : 'white'
//         },
//         followButton: {
//             paddingVertical: 15,
//             paddingHorizontal: 16,
//             borderRadius: 8,
//             alignItems: 'center',
//             // marginHorizontal:30
//             width: 300,
//             marginTop: 30,
            
//         },
//         followText: {
//             fontSize: 16,
//             fontWeight: '600',
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//         },

//     });

//     return (
//         <ImageBackground source={IMG.bgShadow} style={styles.container}>
//             <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />
//             {renderHeader()}
//             {renderItems()}
//         </ImageBackground>
//     )
// }

// export default CreateProducts;


import React, { useEffect, useRef, useState } from "react";
import { Animated, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { Back, BackOuterWhite, BottomIndicator, EmailIcon, EmailWhite, EyeIcon, EyeIconWhite, LockIcon, LockWhite, SignUpbtn, SubmitBtn, Upload } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomInputField from "../../components/CustomInputField";
import { useSelector } from "react-redux";
import { apiPost, BASE_URL, getItem } from "../../utils/Apis";
import useLoader from "../../utils/LoaderHook";
import urls from "../../config/urls";
import { ToastMsg } from "../../utils/helperFunctions";
import { inValidEmail, inValidPassword } from "../../utils/CheckValidation";
import { launchImageLibrary } from 'react-native-image-picker';
import { Platform, PermissionsAndroid } from 'react-native';
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";

const CreateProducts = ({ navigation, route }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const slideAnim = useRef(new Animated.Value(300)).current;

    const [selectedImages, setSelectedImages] = useState([]);
    const [productName, setproductName] = useState('');
    const [productDetails, setproductDetails] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [services, setServices] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const { showLoader, hideLoader } = useLoader();

    const onSubmit = async () => {
              console.log('               ',
productName,productDetails,
description,
address,
services,
price

            );

            // return
        try {
            const token = await getItem('token');
            showLoader();

            if (!selectedImages || selectedImages.length === 0) {
                ToastMsg('Please select at least one image');
                hideLoader();
                return;
            }

      
            
            if (!productName || !productDetails || !price) {
                ToastMsg('Please fill all required fields');
                hideLoader();
                return;
            }

            const formData = new FormData();

            // Append multiple images
            selectedImages.forEach((image, index) => {
                formData.append("Images", {
                    uri: Platform.OS === "android" ? image.uri : image.uri.replace('file://', ''),
                    type: image.type || "image/jpeg",
                    name: image.name || `image_${index}.jpg`,
                });
            });

            formData.append("ProductName", productName);
            formData.append("Shop", route?.params?.shopId);
            formData.append("ProductDetails", productDetails);
            formData.append("Description", description);
            formData.append("Address", address);
            formData.append("Services", services);
            formData.append("Price", price);

            const response = await fetch(
                `${BASE_URL}/api/user/CreateProduct`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formData,
                }
            );
            const result = await response.json();
            ToastMsg(result?.message);
            navigation.goBack();
            hideLoader();

        } catch (error) {
            hideLoader();
            console.log('Upload Failed:', error?.response?.data || error.message);
        }
    };

    const handleFilePick = () => {
        const options = {
            mediaType: 'photo',
            selectionLimit: 0, // 0 means unlimited selection
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.error('Image Picker Error:', response.errorMessage);
            } else {
                const newImages = response.assets.map(asset => ({
                    uri: asset.uri,
                    type: asset.type,
                    name: asset.fileName,
                }));
                setSelectedImages([...selectedImages, ...newImages]);
            }
        });
    };

    const removeImage = (indexToRemove) => {
        setSelectedImages(selectedImages.filter((_, index) => index !== indexToRemove));
    };

    const renderHeader = () => {
        return (
            <Row style={{ paddingTop: 50, paddingHorizontal: 20, gap: 70 }}>
                <Row>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        {isDarkMode ? <BackOuterWhite /> : <Back />}
                    </TouchableOpacity>
                    <CustomText style={{ fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>Back</CustomText>
                </Row>
                <CustomText style={{
                    fontSize: 18,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>Add Product</CustomText>
            </Row>
        )
    }

    const renderSelectedImages = () => {
        if (selectedImages.length === 0) return null;

        return (
            <View style={styles.imageContainer}>
                <CustomText style={styles.imageLabel}>Selected Images ({selectedImages.length})</CustomText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {selectedImages.map((image, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeImage(index)}
                            >
                                <Text style={styles.removeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    };

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
                    <View style={{ marginTop: 15, alignItems: 'center', gap: 10 }}>
                        <CustomInputField
                            placeholder={'Enter Product Name'}
                            label={'Product Name *'}
                            value={productName}
                            onChangeText={setproductName}
                        />
                        
                        <CustomInputField
                            placeholder={'Enter Product Details'}
                            label={'Product Details *'}
                            value={productDetails}
                            onChangeText={setproductDetails}
                            multiline
                            numberOfLines={3}
                        />

                        <CustomInputField
                            placeholder={'Enter Description'}
                            label={'Description'}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                        />

                        <CustomInputField
                            placeholder={'Enter Address'}
                            label={'Address'}
                            value={address}
                            onChangeText={setAddress}
                        />

                        <CustomInputField
                            placeholder={'Enter Services'}
                            label={'Services'}
                            value={services}
                            onChangeText={setServices}
                        />

                        <CustomInputField
                            placeholder={'Enter Price'}
                            label={'Price *'}
                            value={price}
                            onChangeText={setPrice}
                            keyboardType={'numeric'}
                        />

                        <TouchableOpacity onPress={handleFilePick} style={{ marginTop: 10, width: '100%' }}>
                            <CustomInputField
                                placeholder={'Upload Images'}
                                icon={<Upload />}
                                editable={false}
                                label={'Product Images *'}
                                lableStyle={true}
                                value={selectedImages.length > 0 ? `${selectedImages.length} image(s) selected` : ''}
                            />
                        </TouchableOpacity>

                        {renderSelectedImages()}

                        <TouchableOpacity onPress={onSubmit}>
                            <LinearGradient
                                colors={['#21B7FF', '#0084F8']}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.followButton}
                            >
                                <Text style={styles.followText}>
                                    Add Product
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animated.View>
        )
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : 'white'
        },
        followButton: {
            // paddingVertical: 15,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignItems: 'center',
            width: 300,
            marginTop: 30,
            height: 30,
            justifyContent: 'center',
        },
        followText: {
            fontSize: 16,
            fontWeight: '600',
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: '#fff'
        },
        imageContainer: {
            width: '100%',
            marginTop: 15,
        },
        imageLabel: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            marginBottom: 10,
        },
        imageWrapper: {
            position: 'relative',
            marginRight: 10,
        },
        selectedImage: {
            width: 100,
            height: 100,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: isDarkMode ? '#444' : '#ddd',
        },
        removeButton: {
            position: 'absolute',
            top: 3,
            right:3,
            backgroundColor: '#FF3B30',
            borderRadius: 12,
            width: 19,
            height: 19,
            justifyContent: 'center',
            alignItems: 'center',
        },
        removeButtonText: {
            color: '#fff',
            fontSize: 10,
            fontWeight: 'bold',
        },
    });

    return (
        <ImageBackground source={IMG.bgShadow} style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />
            {renderHeader()}
            {renderItems()}
        </ImageBackground>
    )
}

export default CreateProducts;