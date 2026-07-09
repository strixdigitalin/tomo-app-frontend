// ============================================
// 3. BoostSuccess.js (Success Screen)
// ============================================

import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import GradientIcon from '../../components/GradientIcon';

const BoostSuccess = ({ navigation, route }) => {
    const { product, plan } = route.params;
    const { isDarkMode } = useSelector(state => state.theme);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        iconWrapper: {
            marginBottom: 20,
        },
        title: {
            fontSize: 24,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            textAlign: 'center',
            marginBottom: 10,
        },
        subtitle: {
            fontSize: 16,
            color: '#7d7d7d',
            textAlign: 'center',
            marginBottom: 30,
        },
        infoBox: {
            width: '100%',
            backgroundColor: isDarkMode ? '#252525' : '#F8F8F8',
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
        },
        infoTitle: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            marginBottom: 12,
        },
        infoItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 8,
            gap: 8,
        },
        infoText: {
            fontSize: 14,
            color: '#7d7d7d',
            flex: 1,
        },
        buttonWrapper: {
            width: '100%',
            gap: 12,
        },
        button: {
            paddingVertical: 15,
            borderRadius: 10,
            alignItems: 'center',
        },
        buttonText: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: '#fff',
        },
        secondaryButton: {
            paddingVertical: 15,
            borderRadius: 10,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: isDarkMode ? '#3a3a3a' : '#E4E4E4',
        },
        secondaryButtonText: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />

            <View style={styles.iconWrapper}>
                <GradientIcon
                    colors={['#4CAF50', '#45a049']}
                    size={64}
                    iconType="FontAwesome5"
                    name="check-circle"
                />
            </View>

            <CustomText style={styles.title}>
                Promotion Created! 🎉
            </CustomText>

            <CustomText style={styles.subtitle}>
                Your product is now being promoted to more buyers
            </CustomText>

            <View style={styles.infoBox}>
                <CustomText style={styles.infoTitle}>
                    What happens next?
                </CustomText>
                <View style={styles.infoItem}>
                    <CustomText style={styles.infoText}>✓</CustomText>
                    <CustomText style={styles.infoText}>
                        Your promotion will be reviewed (usually within 30 minutes)
                    </CustomText>
                </View>
                <View style={styles.infoItem}>
                    <CustomText style={styles.infoText}>✓</CustomText>
                    <CustomText style={styles.infoText}>
                        Once approved, it will start showing to your target audience
                    </CustomText>
                </View>
                <View style={styles.infoItem}>
                    <CustomText style={styles.infoText}>✓</CustomText>
                    <CustomText style={styles.infoText}>
                        Track performance in "My Promotions" tab
                    </CustomText>
                </View>
            </View>

            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('MyPromotions')}
                >
                    <LinearGradient
                        colors={['#21B7FF', '#0084F8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.button}
                    >
                        <CustomText style={styles.buttonText}>
                            View My Promotions
                        </CustomText>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.goBack()}
                >
                    <CustomText style={styles.secondaryButtonText}>
                        Back to Products
                    </CustomText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BoostSuccess;


