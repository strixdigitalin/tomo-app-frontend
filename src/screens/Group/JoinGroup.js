import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import Row from '../../components/wrapper/row';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { groupApiPost } from '../../utils/GroupApi';
import { ToastMsg } from '../../utils/helperFunctions';
import { white } from '../../common/Colors/colors';
import useThemeColor from '../../utils/useThemeColor';

// Matches web's Pages/Chat/Group/JoinGroupModel.jsx (paste-code path — QR
// scan skipped since it needs a new camera dependency not in this project).
const JoinGroup = ({ navigation }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const insets = useSafeAreaInsets();

    const [token, setToken] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const onJoin = async () => {
        if (!token.trim()) return ToastMsg('Please enter an invite code');

        try {
            setSubmitting(true);
            const result = await groupApiPost('/api/user/JoinGroupUsingInvite', { token: token.trim() });
            if (result?.statusCode === 200) {
                ToastMsg(result?.message || 'Joined successfully');
                Keyboard.dismiss();
                setTimeout(() => navigation.goBack(), 50);
            } else {
                ToastMsg(result?.message || 'Failed to join group');
            }
        } catch (error) {
            ToastMsg(error?.message || 'Failed to join group');
        } finally {
            setSubmitting(false);
        }
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#fff', paddingTop: insets.top },
        header: { paddingHorizontal: 20, paddingVertical: 14 },
        headerTitle: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginLeft: 14 },
        body: { padding: 20 },
        iconWrap: {
            width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center',
            backgroundColor: primaryColor, alignSelf: 'center', marginTop: 20, marginBottom: 20,
        },
        title: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textAlign: 'center' },
        sub: {
            fontSize: 13, color: isDarkMode ? '#9CA3AF' : '#6B7280', textAlign: 'center', marginTop: 6, marginBottom: 24,
        },
        inputBox: {
            borderWidth: 1, borderColor: isDarkMode ? '#2A2A2A' : '#E5E7EB', borderRadius: 12,
            paddingHorizontal: 14, paddingVertical: 14, color: isDarkMode ? white : '#111',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular, fontSize: 14,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FAFAFA',
        },
        joinBtn: { marginTop: 20, backgroundColor: primaryColor, paddingVertical: 15, borderRadius: 16, alignItems: 'center' },
        joinBtnDisabled: { opacity: 0.6 },
        joinBtnText: { color: white, fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    });

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <Row style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="x" size={22} color={isDarkMode ? white : '#111'} />
                </TouchableOpacity>
                <CustomText style={styles.headerTitle}>Join a Group</CustomText>
            </Row>

            <View style={styles.body}>
                <View style={styles.iconWrap}>
                    <Icon name="log-in" size={30} color={white} />
                </View>
                <CustomText style={styles.title}>Enter Invite Code</CustomText>
                <CustomText style={styles.sub}>Paste the invite code shared by the group admin</CustomText>

                <TextInput
                    style={styles.inputBox}
                    placeholder="Paste invite code here"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={token}
                    onChangeText={setToken}
                />

                <TouchableOpacity
                    style={[styles.joinBtn, submitting && styles.joinBtnDisabled]}
                    onPress={onJoin}
                    disabled={submitting}
                >
                    <CustomText style={styles.joinBtnText}>{submitting ? 'Joining...' : 'Join Group'}</CustomText>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default JoinGroup;
