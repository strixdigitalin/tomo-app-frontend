import React, { useEffect, useState } from "react";
import {
    Animated,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Modal,
    FlatList,
    KeyboardAvoidingView,
} from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { Back, BackOuterWhite } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomInputField from "../../components/CustomInputField";
import { useSelector } from "react-redux";
import { BASE_URL, getItem } from "../../utils/Apis";
import useLoader from "../../utils/LoaderHook";
import { ToastMsg } from "../../utils/helperFunctions";
import { launchImageLibrary } from 'react-native-image-picker';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { App_Primary_color, white } from "../../common/Colors/colors";
import urls from "../../config/urls";

const SellerAddShop = ({ navigation, route }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const { showLoader, hideLoader } = useLoader();

    const editingShop = route?.params?.shop || null;
    const isEditMode = !!editingShop;

    const [fileName, setFileName] = useState({});
    const [existingImageUrl, setExistingImageUrl] = useState(editingShop?.Image || null);
    const [shopName, setShopName] = useState(editingShop?.Name || '');
    const [shopServices, setShopServices] = useState(editingShop?.Services || '');
    const [locationName, setLocationName] = useState(editingShop?.Address?.[0]?.LocationName || '');

    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Once the category list loads, resolve the shop's saved category names
    // (plain strings from the API) back into the {_id, Name} objects the UI needs.
    useEffect(() => {
        if (isEditMode && allCategories.length > 0 && Array.isArray(editingShop?.ShopCategory)) {
            const matched = allCategories.filter(cat => editingShop.ShopCategory.includes(cat.Name));
            setSelectedCategories(matched);
        }
    }, [allCategories]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/admin/GetAllShopCategory`, {
                method: "GET",
                redirect: "follow"
            });
            const result = await response.json();
            setAllCategories(result?.data || []);
        } catch (error) {
            console.log('Error fetching categories:', error);
        }
    };

    const toggleCategory = (category) => {
        const isSelected = selectedCategories.some(cat => cat._id === category._id);
        if (isSelected) {
            setSelectedCategories(selectedCategories.filter(cat => cat._id !== category._id));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleFilePick = () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
            if (response.didCancel) return;
            if (response.errorMessage) {
                console.log('Image Picker Error:', response.errorMessage);
                return;
            }
            const asset = response.assets?.[0];
            if (asset) {
                setFileName({ uri: asset.uri, type: asset.type, name: asset.fileName });
            }
        });
    };

    const onSubmit = async () => {
        try {
            if (!shopName) return ToastMsg('Shop name is required');
            if (!isEditMode && !fileName?.uri) return ToastMsg('Shop image is required');
            if (!locationName.trim()) return ToastMsg('Location is required');
            if (selectedCategories.length === 0) return ToastMsg('Please select at least one category');

            showLoader();
            const token = await getItem('token');

            const addressData = [{
                LocationName: locationName,
                type: 'Point',
                coordinates: editingShop?.Address?.[0]?.coordinates || [76.7794, 30.7333],
            }];
            const categoryNames = selectedCategories.map(cat => cat.Name);

            const formData = new FormData();
            if (fileName?.uri) {
                formData.append("Image", {
                    uri: Platform.OS === "android" ? fileName.uri : fileName.uri.replace('file://', ''),
                    type: fileName.type || "image/jpeg",
                    name: fileName.name || "shop.jpg",
                });
            }
            formData.append("Name", shopName);
            formData.append("Address", JSON.stringify(addressData));
            formData.append("Services", shopServices);
            formData.append("ShopCategory", JSON.stringify(categoryNames));

            const endpoint = isEditMode
                ? `${BASE_URL}${urls.sellerUpdateShop}/${editingShop._id}`
                : `${BASE_URL}${urls.sellerCreateShop}`;

            const response = await fetch(endpoint, {
                method: isEditMode ? "PUT" : "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            });
            const result = await response.json();
            hideLoader();
            ToastMsg(result?.message || (isEditMode ? 'Shop updated' : 'Shop created'));
            if (response.ok) {
                navigation.goBack();
            }
        } catch (error) {
            hideLoader();
            console.log('SellerAddShop submit error', error);
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
            marginTop: 6,
            gap: 12,
        },
        uploadBox: {
            width: '100%',
            height: 150,
            borderRadius: 16,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: App_Primary_color,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FAFAFA',
        },
        uploadImage: { width: '100%', height: '100%' },
        categoryChip: {
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: App_Primary_color,
            marginRight: 8,
            marginBottom: 8,
        },
        submitBtn: {
            marginTop: 30,
            backgroundColor: App_Primary_color,
            paddingVertical: 15,
            borderRadius: 16,
            alignItems: 'center',
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            maxHeight: '70%',
        },
    });

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <Row style={{ paddingTop: 50, paddingHorizontal: 20, gap: 70 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {isDarkMode ? <BackOuterWhite /> : <Back />}
                </TouchableOpacity>
                <CustomText style={{ fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold }}>
                    {isEditMode ? 'Update Shop' : 'Add Shop'}
                </CustomText>
            </Row>

            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <CustomText style={styles.label}>Shop Image</CustomText>
                <TouchableOpacity style={styles.uploadBox} onPress={handleFilePick}>
                    {fileName?.uri || existingImageUrl ? (
                        <Image source={{ uri: fileName?.uri || existingImageUrl }} style={styles.uploadImage} resizeMode="cover" />
                    ) : (
                        <>
                            <Icon name="upload-cloud" size={26} color={App_Primary_color} />
                            <CustomText style={{ marginTop: 8, fontSize: 13, color: App_Primary_color }}>Upload shop image</CustomText>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.fieldsGroup}>
                    <CustomInputField label="Shop Name" placeholder="Enter shop name" value={shopName} onChangeText={setShopName} />
                    <CustomInputField
                        label="Services"
                        placeholder="e.g. Detailing, Repairs, Custom Parts"
                        value={shopServices}
                        onChangeText={setShopServices}
                    />
                    <CustomInputField label="Location" placeholder="Enter shop location" value={locationName} onChangeText={setLocationName} />
                </View>

                <CustomText style={styles.label}>Category</CustomText>
                <TouchableOpacity
                    style={[styles.categoryChip, { alignSelf: 'flex-start' }]}
                    onPress={() => setShowCategoryModal(true)}
                >
                    <CustomText style={{ color: App_Primary_color, fontSize: 13 }}>
                        {selectedCategories.length > 0 ? `${selectedCategories.length} selected` : 'Select categories'}
                    </CustomText>
                </TouchableOpacity>
                {selectedCategories.length > 0 && (
                    <Row style={{ flexWrap: 'wrap', marginTop: 10 }}>
                        {selectedCategories.map((cat) => (
                            <View key={cat._id} style={styles.categoryChip}>
                                <CustomText style={{ fontSize: 12 }}>{cat.Name}</CustomText>
                            </View>
                        ))}
                    </Row>
                )}

                <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
                    <CustomText style={{ color: white, fontFamily: FONTS_FAMILY.SourceSans3_Bold, fontSize: 15 }}>
                        {isEditMode ? 'Update Shop' : 'Create Shop'}
                    </CustomText>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={showCategoryModal} transparent animationType="slide" onRequestClose={() => setShowCategoryModal(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCategoryModal(false)}>
                    <View style={styles.modalContent}>
                        <CustomText style={{ fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginBottom: 12 }}>
                            Select Categories
                        </CustomText>
                        <FlatList
                            data={allCategories}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => {
                                const isSelected = selectedCategories.some(cat => cat._id === item._id);
                                return (
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingVertical: 12,
                                            borderBottomWidth: 1,
                                            borderBottomColor: isDarkMode ? '#2A2A2A' : '#F0F0F0',
                                        }}
                                        onPress={() => toggleCategory(item)}
                                    >
                                        <CustomText>{item.Name}</CustomText>
                                        {isSelected && <Icon name="check" size={18} color={App_Primary_color} />}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        <TouchableOpacity style={styles.submitBtn} onPress={() => setShowCategoryModal(false)}>
                            <CustomText style={{ color: white, fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>Done</CustomText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default SellerAddShop;
