import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from './TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';
import useThemeColor from '../utils/useThemeColor';

// Bottom-sheet action menu used across the app (post ⋮ menu, group menu, product menu...).
// options: [{ label, icon, destructive, onPress }]
export const ActionMenu = ({ visible, onClose, title, options = [] }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const insets = useSafeAreaInsets();

    const sheetBg = isDarkMode ? '#131B2B' : '#FFFFFF';
    const text = isDarkMode ? '#F3F4F6' : '#0F172A';
    const muted = isDarkMode ? '#94A3B8' : '#64748B';
    const danger = '#EF4444';

    const styles = StyleSheet.create({
        overlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.55)', justifyContent: 'flex-end' },
        sheet: {
            backgroundColor: sheetBg,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTopWidth: 1,
            borderColor: primaryColor + '40',
            paddingTop: 10,
            paddingHorizontal: 16,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
        },
        grabber: {
            width: 44, height: 5, borderRadius: 3, alignSelf: 'center',
            backgroundColor: isDarkMode ? '#334155' : '#CBD5E1', marginBottom: 14,
        },
        title: {
            fontSize: 17,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: text,
            textAlign: 'center',
            marginBottom: 14,
        },
        group: {
            borderRadius: 18,
            backgroundColor: isDarkMode ? '#1B2538' : '#F8FAFC',
            overflow: 'hidden',
        },
        option: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
            minHeight: 58,
        },
        iconWrap: {
            width: 38, height: 38, borderRadius: 19,
            alignItems: 'center', justifyContent: 'center', marginRight: 14,
        },
        optionLabel: { flex: 1, fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
        divider: { height: StyleSheet.hairlineWidth, backgroundColor: isDarkMode ? '#2B3A55' : '#E2E8F0', marginLeft: 68 },
        cancel: {
            marginTop: 12,
            paddingVertical: 15,
            borderRadius: 18,
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#1B2538' : '#F1F5F9',
        },
        cancelText: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: text },
    });

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={() => {}}>
                    <View style={styles.grabber} />
                    {!!title && <CustomText style={styles.title} numberOfLines={1}>{title}</CustomText>}
                    <View style={styles.group}>
                        {options.map((opt, index) => {
                            const tint = opt.destructive ? danger : primaryColor;
                            return (
                                <React.Fragment key={index}>
                                    {index > 0 && <View style={styles.divider} />}
                                    <TouchableOpacity
                                        style={styles.option}
                                        activeOpacity={0.6}
                                        onPress={() => {
                                            onClose();
                                            setTimeout(() => opt.onPress?.(), 200);
                                        }}
                                    >
                                        {!!opt.icon && (
                                            <View style={[styles.iconWrap, { backgroundColor: tint + '1F' }]}>
                                                <Icon name={opt.icon} size={18} color={tint} />
                                            </View>
                                        )}
                                        <CustomText style={[styles.optionLabel, { color: opt.destructive ? danger : text }]}>
                                            {opt.label}
                                        </CustomText>
                                        <Icon name="chevron-right" size={18} color={muted} />
                                    </TouchableOpacity>
                                </React.Fragment>
                            );
                        })}
                    </View>
                    <TouchableOpacity style={styles.cancel} activeOpacity={0.7} onPress={onClose}>
                        <CustomText style={styles.cancelText}>Cancel</CustomText>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

// A small centered confirm dialog — replaces native Alert.alert confirmations
// (e.g. "are you sure you want to delete this?").
export const ConfirmDialog = ({ visible, onClose, title, message, confirmLabel = 'Delete', onConfirm }) => {
    const { isDarkMode, primaryColor } = useThemeColor();

    const styles = StyleSheet.create({
        overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 30 },
        card: {
            width: '100%',
            backgroundColor: isDarkMode ? '#131B2B' : '#fff',
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: primaryColor + '40',
        },
        title: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textAlign: 'center', color: isDarkMode ? '#F3F4F6' : '#0F172A' },
        message: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#94A3B8' : '#64748B',
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 20,
        },
        row: { flexDirection: 'row', gap: 12, marginTop: 22 },
        btn: { flex: 1, paddingVertical: 13, borderRadius: 14, alignItems: 'center' },
        cancelBtn: { backgroundColor: isDarkMode ? '#1B2538' : '#F1F5F9' },
        cancelText: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: isDarkMode ? '#fff' : '#111' },
        confirmBtn: { backgroundColor: '#EF4444' },
        confirmText: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: '#fff' },
    });

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    {!!title && <CustomText style={styles.title}>{title}</CustomText>}
                    {!!message && <CustomText style={styles.message}>{message}</CustomText>}
                    <View style={styles.row}>
                        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
                            <CustomText style={styles.cancelText}>Cancel</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, styles.confirmBtn]}
                            onPress={() => {
                                onClose();
                                setTimeout(() => onConfirm?.(), 200);
                            }}
                        >
                            <CustomText style={styles.confirmText}>{confirmLabel}</CustomText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
