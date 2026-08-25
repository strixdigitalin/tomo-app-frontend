import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    KeyboardAvoidingView,
} from "react-native";
import CustomText from "../../components/TextComponent";
import Row from "../../components/wrapper/row";
import { Back, BackOuterWhite } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomInputField from "../../components/CustomInputField";
import { useSelector } from "react-redux";
import { BASE_URL, getItem, apiGet } from "../../utils/Apis";
import useLoader from "../../utils/LoaderHook";
import { ToastMsg } from "../../utils/helperFunctions";
import { launchImageLibrary } from 'react-native-image-picker';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { App_Primary_color, white } from "../../common/Colors/colors";
import urls from "../../config/urls";

const SellerAddProduct = ({ navigation, route }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const { showLoader, hideLoader } = useLoader();

    const editingProduct = route?.params?.product || null;
    const isEditMode = !!editingProduct;

    const [shops, setShops] = useState([]);
    const [selectedShopId, setSelectedShopId] = useState(
        route?.params?.shopId || editingProduct?.SellerShop?._id || editingProduct?.SellerShop || null
    );

    // New images picked from the device, and existing remote images (edit mode)
    // that the seller can choose to keep or remove — kept separate since one is
    // uploaded as files and the other is sent back as plain URLs.
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState(editingProduct?.Images || []);
    const [productName, setProductName] = useState(editingProduct?.ProductName || '');
    const [productDetails, setProductDetails] = useState(editingProduct?.ProductDetails || '');
    const [price, setPrice] = useState(editingProduct?.Price ? String(editingProduct.Price) : '');
    const [description, setDescription] = useState(editingProduct?.Description || '');

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            const res = await apiGet(urls.sellerAllShop);
            setShops(res?.data || []);
            if (!selectedShopId && res?.data?.length === 1) {
                setSelectedShopId(res.data[0]._id);
            }
        } catch (error) {
            console.log('SellerAddProduct fetchShops error', error);
        }
    };

    const pickImages = () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, (response) => {
            if (response.didCancel) return;
            if (response.errorMessage) {
                console.log('Image Picker Error:', response.errorMessage);
                return;
            }
            const assets = response.assets || [];
            setImages(prev => [...prev, ...assets.map(a => ({ uri: a.uri, type: a.type, name: a.fileName }))]);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async () => {
        if (!isEditMode && !selectedShopId) return ToastMsg('Please select a shop');
        if (!productName) return ToastMsg('Product name is required');
        if (!price) return ToastMsg('Price is required');
        if (!productDetails) return ToastMsg('Product details are required');
        if (!description) return ToastMsg('Description is required');

        try {
            showLoader();
            const token = await getItem('token');

            const formData = new FormData();
            if (!isEditMode) {
                formData.append("SellerShop", selectedShopId);
            } else {
                formData.append("ExistingImages", JSON.stringify(existingImages));
            }
            formData.append("ProductName", productName);
            formData.append("ProductDetails", productDetails);
            formData.append("Price", price);
            formData.append("Description", description);
            formData.append("OwnerNote", '');
            formData.append("VehicleInfo", JSON.stringify({}));
            formData.append("Power", JSON.stringify({}));
            formData.append("Modifications", JSON.stringify({}));
            formData.append("Style", JSON.stringify({}));
            formData.append("Status", JSON.stringify({}));
            formData.append("PerformanceStats", JSON.stringify({}));

            images.forEach((img) => {
                formData.append("Images", {
                    uri: Platform.OS === "android" ? img.uri : img.uri.replace('file://', ''),
                    type: img.type || "image/jpeg",
                    name: img.name || `product_${Date.now()}.jpg`,
                });
            });

            const endpoint = isEditMode
                ? `${BASE_URL}${urls.sellerUpdateProduct}/${editingProduct._id}`
                : `${BASE_URL}${urls.sellerCreateProduct}`;

            const response = await fetch(endpoint, {
                method: isEditMode ? "PUT" : "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            });
            const result = await response.json();
            hideLoader();
            ToastMsg(result?.message || (isEditMode ? 'Product updated' : 'Product added'));
            if (response.ok) {
                navigation.goBack();
            }
        } catch (error) {
            hideLoader();
            console.log('SellerAddProduct submit error', error);
            ToastMsg('Something went wrong, please try again');
        }
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#fff' },
        body: { padding: 20, paddingBottom: 60 },
        label: {
            fontSize: 13,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            marginTop: 18,
            marginBottom: 8,
            color: isDarkMode ? '#D1D5DB' : '#374151',
        },
        fieldsGroup: {
            marginTop: 22,
            gap: 12,
        },
        shopChip: {
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: App_Primary_color,
            marginRight: 8,
            marginBottom: 8,
        },
        shopChipActive: {
            backgroundColor: App_Primary_color,
        },
        imageRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
        },
        imageThumb: {
            width: 80,
            height: 80,
            borderRadius: 12,
        },
        imageRemove: {
            position: 'absolute',
            top: -6,
            right: -6,
            backgroundColor: '#EF4136',
            width: 20,
            height: 20,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
        addImageBox: {
            width: 80,
            height: 80,
            borderRadius: 12,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: App_Primary_color,
            alignItems: 'center',
            justifyContent: 'center',
        },
        submitBtn: {
            marginTop: 30,
            backgroundColor: App_Primary_color,
            paddingVertical: 15,
            borderRadius: 16,
            alignItems: 'center',
        },
    });

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <Row style={{ paddingTop: 50, paddingHorizontal: 20, gap: 60 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {isDarkMode ? <BackOuterWhite /> : <Back />}
                </TouchableOpacity>
                <CustomText style={{ fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold }}>
                    {isEditMode ? 'Update Product' : 'Add Product'}
                </CustomText>
            </Row>

            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {isEditMode ? (
                    <>
                        <CustomText style={styles.label}>Shop</CustomText>
                        <View style={[styles.shopChip, styles.shopChipActive, { alignSelf: 'flex-start' }]}>
                            <CustomText style={{ fontSize: 13, color: white }}>
                                {editingProduct?.SellerShop?.Name || route?.params?.shopName || 'Your shop'}
                            </CustomText>
                        </View>
                    </>
                ) : (
                    <>
                        <CustomText style={styles.label}>Select Shop</CustomText>
                        {shops.length === 0 ? (
                            <CustomText style={{ fontSize: 13, color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                                You need to create a shop first.
                            </CustomText>
                        ) : (
                            <Row style={{ flexWrap: 'wrap' }}>
                                {shops.map((shop) => (
                                    <TouchableOpacity
                                        key={shop._id}
                                        style={[styles.shopChip, selectedShopId === shop._id && styles.shopChipActive]}
                                        onPress={() => setSelectedShopId(shop._id)}
                                    >
                                        <CustomText style={{ fontSize: 13, color: selectedShopId === shop._id ? white : App_Primary_color }}>
                                            {shop.Name}
                                        </CustomText>
                                    </TouchableOpacity>
                                ))}
                            </Row>
                        )}
                    </>
                )}

                <CustomText style={styles.label}>Product Images</CustomText>
                <View style={styles.imageRow}>
                    {existingImages.map((uri, index) => (
                        <View key={`existing-${index}`}>
                            <Image source={{ uri }} style={styles.imageThumb} />
                            <TouchableOpacity style={styles.imageRemove} onPress={() => removeExistingImage(index)}>
                                <Icon name="x" size={12} color={white} />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {images.map((img, index) => (
                        <View key={`new-${index}`}>
                            <Image source={{ uri: img.uri }} style={styles.imageThumb} />
                            <TouchableOpacity style={styles.imageRemove} onPress={() => removeImage(index)}>
                                <Icon name="x" size={12} color={white} />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addImageBox} onPress={pickImages}>
                        <Icon name="plus" size={22} color={App_Primary_color} />
                    </TouchableOpacity>
                </View>

                <View style={styles.fieldsGroup}>
                    <CustomInputField
                        label="Product Name"
                        placeholder="Enter product name"
                        value={productName}
                        onChangeText={setProductName}
                    />
                    <CustomInputField
                        label="Price"
                        placeholder="Enter price"
                        keyboardType="number-pad"
                        value={price}
                        onChangeText={setPrice}
                    />
                    <CustomInputField
                        label="Product Details"
                        placeholder="Short highlights / specs"
                        value={productDetails}
                        onChangeText={setProductDetails}
                    />
                    <CustomInputField
                        label="Description"
                        placeholder="Describe the product"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
                    <CustomText style={{ color: white, fontFamily: FONTS_FAMILY.SourceSans3_Bold, fontSize: 15 }}>
                        {isEditMode ? 'Update Product' : 'Add Product'}
                    </CustomText>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SellerAddProduct;
