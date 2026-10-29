import React, { useEffect, useRef, useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, TextInput, Clipboard } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import QRCode from 'react-native-qrcode-svg';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { groupApiGet } from '../../utils/GroupApi';
import { ToastMsg } from '../../utils/helperFunctions';
import { white } from '../../common/Colors/colors';
import useThemeColor from '../../utils/useThemeColor';

// Matches web's Pages/Chat/Group/InviteLinkModel.jsx — generates a fresh
// invite token on demand (never auto-generates on open, matching web), shows
// a live "expires in" countdown, and a QR code encoding the raw token (same
// as web's QRCodeCanvas — not a URL, just the token string; JoinGroup.js
// still only supports paste-code, not scan, since that needs a camera lib).
const InviteLinkModal = ({ visible, onClose, groupId }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const [token, setToken] = useState(null);
    const [expireAt, setExpireAt] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [remaining, setRemaining] = useState('');
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!visible) {
            setToken(null);
            setExpireAt(null);
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, [visible]);

    useEffect(() => {
        if (!expireAt) return;
        const tick = () => {
            const diff = new Date(expireAt).getTime() - Date.now();
            if (diff <= 0) {
                setRemaining('Expired');
                clearInterval(intervalRef.current);
                return;
            }
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            setRemaining(`${h}h ${m}m`);
        };
        tick();
        intervalRef.current = setInterval(tick, 1000);
        return () => clearInterval(intervalRef.current);
    }, [expireAt]);

    const copyToken = () => {
        if (!token) return;
        Clipboard.setString(token);
        ToastMsg('Invite code copied');
    };

    const generate = async () => {
        try {
            setGenerating(true);
            const res = await groupApiGet(`/api/user/GenerateInviteLink/${groupId}`);
            if (res?.statusCode === 200) {
                setToken(res?.data?.Token);
                setExpireAt(res?.data?.ExpireAt);
            } else {
                ToastMsg(res?.message || 'Failed to generate invite link');
            }
        } catch (error) {
            ToastMsg(error?.message || 'Failed to generate invite link');
        } finally {
            setGenerating(false);
        }
    };

    const styles = StyleSheet.create({
        overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 30 },
        card: { width: '100%', backgroundColor: isDarkMode ? '#131B2B' : '#FFFFFF', borderRadius: 20, padding: 22 },
        headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        title: { fontSize: 17, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        sub: { fontSize: 13, color: isDarkMode ? '#94A3B8' : '#64748B', marginTop: 6, lineHeight: 19 },
        qrWrap: {
            alignItems: 'center', justifyContent: 'center', marginTop: 18,
            padding: 16, borderRadius: 16, backgroundColor: white, alignSelf: 'center',
        },
        tokenBox: {
            marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 10,
            borderWidth: 1, borderColor: isDarkMode ? '#1E293B' : '#E2E8F0', borderRadius: 12,
            padding: 14, backgroundColor: isDarkMode ? '#131B2B' : '#FFFFFF',
        },
        tokenText: { flex: 1, fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: isDarkMode ? white : '#111' },
        copyBtn: { padding: 8, borderRadius: 10, backgroundColor: primaryColor },
        hint: { fontSize: 11, color: isDarkMode ? '#6B7280' : '#9CA3AF', marginTop: 6 },
        expiryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
        expiryText: { fontSize: 13, color: '#CA8A04', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
        genBtn: { marginTop: 20, backgroundColor: primaryColor, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
        genBtnText: { color: white, fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
    });

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.headerRow}>
                        <CustomText style={styles.title}>Invite to Group</CustomText>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="x" size={22} color={isDarkMode ? white : '#111'} />
                        </TouchableOpacity>
                    </View>
                    <CustomText style={styles.sub}>Share this code — anyone with it can join within 24 hours.</CustomText>

                    {token ? (
                        <>
                            <View style={styles.qrWrap}>
                                <QRCode value={token} size={180} />
                            </View>
                            <View style={styles.tokenBox}>
                                <TextInput
                                    style={styles.tokenText}
                                    value={token}
                                    editable={false}
                                    selectTextOnFocus
                                    multiline
                                />
                                <TouchableOpacity style={styles.copyBtn} onPress={copyToken}>
                                    <Icon name="copy" size={16} color={white} />
                                </TouchableOpacity>
                            </View>
                            <CustomText style={styles.hint}>Tap the copy icon to copy the code</CustomText>
                            <View style={styles.expiryRow}>
                                <Icon name="clock" size={13} color="#CA8A04" />
                                <CustomText style={styles.expiryText}>Expires in {remaining}</CustomText>
                            </View>
                        </>
                    ) : null}

                    <TouchableOpacity style={styles.genBtn} onPress={generate} disabled={generating}>
                        <CustomText style={styles.genBtnText}>
                            {generating ? 'Generating...' : token ? 'Generate New Code' : 'Generate Invite Code'}
                        </CustomText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default InviteLinkModal;
