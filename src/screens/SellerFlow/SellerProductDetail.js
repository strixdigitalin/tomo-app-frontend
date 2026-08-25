import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import { App_Primary_color, white } from '../../common/Colors/colors';
import IMG from '../../assets/Images';

const { width } = Dimensions.get('window');

const SellerProductDetail = ({ navigation, route }) => {
    const { id } = route.params || {};
    const { isDarkMode } = useSelector(state => state.theme);
    const insets = useSafeAreaInsets();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        try {
            const res = await apiGet(`${urls.sellerProductDetail}/${id}`);
            setProduct(res?.data || null);
        } catch (error) {
            console.log('SellerProductDetail fetch error', error);
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#fff' },
        image: { width, height: width * 0.8 },
        backBtn: {
            position: 'absolute',
            top: insets.top + 10,
            left: 16,
            zIndex: 10,
            width: 38,
            height: 38,
            borderRadius: 19,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        body: { padding: 20 },
        name: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        price: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: App_Primary_color, marginTop: 6 },
        sectionTitle: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            marginTop: 20,
            marginBottom: 6,
        },
        text: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#D1D5DB' : '#374151',
            lineHeight: 20,
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
                <Icon name="arrow-left" size={20} color={white} />
            </TouchableOpacity>

            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={App_Primary_color} size="large" />
                </View>
            ) : (
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    <Image
                        source={
                            Array.isArray(product?.Images) && product.Images.length > 0
                                ? { uri: product.Images[0] }
                                : IMG.PostImage
                        }
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <View style={styles.body}>
                        <CustomText style={styles.name}>{product?.ProductName}</CustomText>
                        {!!product?.Price && <CustomText style={styles.price}>₹{Number(product.Price).toLocaleString()}</CustomText>}

                        {!!product?.ProductDetails && (
                            <>
                                <CustomText style={styles.sectionTitle}>Details</CustomText>
                                <CustomText style={styles.text}>{product.ProductDetails}</CustomText>
                            </>
                        )}

                        {!!product?.Description && (
                            <>
                                <CustomText style={styles.sectionTitle}>Description</CustomText>
                                <CustomText style={styles.text}>{product.Description}</CustomText>
                            </>
                        )}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default SellerProductDetail;
