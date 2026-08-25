import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import CustomText from "../../components/TextComponent";
import Row from "../../components/wrapper/row";
import { Back, BackOuterWhite } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import { apiGet, BASE_URL, getItem } from "../../utils/Apis";
import useLoader from "../../utils/LoaderHook";
import urls from "../../config/urls";
import { ToastMsg } from "../../utils/helperFunctions";
import { launchImageLibrary } from "react-native-image-picker";
import { Platform } from "react-native";
import { App_Primary_color, white } from "../../common/Colors/colors";

// Matches web's Pages/More/BecomeSeller.jsx — same statuses (NotAdded/Rejected →
// upload form, Pending → in-review message, Approved → success message), same
// single field (Aadhar Card image), same endpoint.
const RequestBecomSeller = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const insets = useSafeAreaInsets();
    const { showLoader, hideLoader } = useLoader();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileName, setFileName] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await apiGet(urls.userProfile);
            setUserData(res?.data || null);
        } catch (error) {
            console.log("RequestBecomSeller profile fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    const handleFilePick = () => {
        launchImageLibrary({ mediaType: "photo", selectionLimit: 1 }, (response) => {
            if (response.didCancel) return;
            if (response.errorMessage) {
                console.log("Image Picker Error:", response.errorMessage);
                return;
            }
            const asset = response.assets?.[0];
            if (asset) {
                setFileName({ uri: asset.uri, type: asset.type, name: asset.fileName });
            }
        });
    };

    const onSubmit = async () => {
        if (!fileName?.uri) {
            ToastMsg("Please select Aadhar Card image before submitting!");
            return;
        }

        try {
            setIsSubmitting(true);
            showLoader();
            const token = await getItem("token");

            const formData = new FormData();
            formData.append("AadharCard", {
                uri: Platform.OS === "android" ? fileName.uri : fileName.uri.replace("file://", ""),
                type: fileName.type || "image/jpeg",
                name: fileName.name || "aadhar.jpg",
            });

            const response = await fetch(`${BASE_URL}/api/user/CreateBecomeSellerReq`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const result = await response.json();
            hideLoader();
            setIsSubmitting(false);
            ToastMsg(result?.message || "Request submitted");
            if (response.ok) {
                setFileName({});
                fetchProfile();
            }
        } catch (error) {
            hideLoader();
            setIsSubmitting(false);
            console.log("RequestBecomSeller submit error", error);
            ToastMsg("Something went wrong, please try again");
        }
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? "#121212" : "#fff", paddingTop: insets.top },
        body: { padding: 20, paddingBottom: 60 },
        title: {
            fontSize: 22,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            textAlign: "center",
            marginTop: 10,
            marginBottom: 24,
            color: App_Primary_color,
        },
        uploadBox: {
            width: "100%",
            height: 280,
            borderRadius: 20,
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: App_Primary_color,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: isDarkMode ? "#1E1E1E" : "#FAFAFA",
        },
        uploadImage: { width: "100%", height: "100%" },
        uploadHint: {
            fontSize: 15,
            color: isDarkMode ? "#9CA3AF" : "#6B7280",
            textAlign: "center",
            marginTop: 10,
            paddingHorizontal: 20,
        },
        uploadLink: {
            fontSize: 15,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            color: App_Primary_color,
            marginTop: 12,
        },
        submitBtn: {
            marginTop: 24,
            backgroundColor: App_Primary_color,
            paddingVertical: 15,
            borderRadius: 16,
            alignItems: "center",
        },
        submitBtnDisabled: { opacity: 0.6 },
        statusBox: {
            width: "100%",
            minHeight: 280,
            borderRadius: 20,
            borderWidth: 2,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
        },
        statusText: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium, textAlign: "center" },
    });

    const renderBody = () => {
        if (loading) {
            return (
                <View style={{ paddingTop: 100, alignItems: "center" }}>
                    <ActivityIndicator color={App_Primary_color} size="large" />
                </View>
            );
        }

        const status = userData?.SellerStatus;

        if (status === "Pending") {
            return (
                <View style={[styles.statusBox, { borderColor: "#F59E0B", backgroundColor: isDarkMode ? "rgba(245,158,11,0.1)" : "#FFFBEB" }]}>
                    <Icon name="clock" size={32} color="#F59E0B" />
                    <CustomText style={[styles.statusText, { color: "#B45309", marginTop: 12 }]}>
                        Your request is in review. Please wait for approval.
                    </CustomText>
                </View>
            );
        }

        if (status === "Approved") {
            return (
                <View style={[styles.statusBox, { borderColor: "#22C55E", backgroundColor: isDarkMode ? "rgba(34,197,94,0.1)" : "#F0FDF4" }]}>
                    <Icon name="check-circle" size={32} color="#22C55E" />
                    <CustomText style={[styles.statusText, { color: "#15803D", marginTop: 12 }]}>
                        Your request is approved! You are now a Seller.
                    </CustomText>
                </View>
            );
        }

        // NotAdded or Rejected — show the upload form
        return (
            <>
                <TouchableOpacity style={styles.uploadBox} onPress={handleFilePick} activeOpacity={0.85}>
                    {fileName?.uri ? (
                        <Image source={{ uri: fileName.uri }} style={styles.uploadImage} resizeMode="cover" />
                    ) : (
                        <>
                            <Icon name="credit-card" size={32} color={App_Primary_color} />
                            <CustomText style={styles.uploadHint}>
                                {status === "Rejected"
                                    ? "Your request was rejected. Please verify and upload your Aadhar Card again."
                                    : "Click to select your Aadhar Card"}
                            </CustomText>
                            <CustomText style={styles.uploadLink}>Select Aadhar Card</CustomText>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                    onPress={onSubmit}
                    disabled={isSubmitting}
                >
                    <CustomText style={{ color: white, fontFamily: FONTS_FAMILY.SourceSans3_Bold, fontSize: 15 }}>
                        {isSubmitting ? "Please Wait..." : "Submit Request"}
                    </CustomText>
                </TouchableOpacity>
            </>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
            <Row style={{ paddingHorizontal: 20, paddingVertical: 14 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {isDarkMode ? <BackOuterWhite /> : <Back />}
                </TouchableOpacity>
            </Row>

            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                <CustomText style={styles.title}>Request for Become Seller</CustomText>
                {renderBody()}
            </ScrollView>
        </View>
    );
};

export default RequestBecomSeller;
