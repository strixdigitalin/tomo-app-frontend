import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from './TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';
import { App_Primary_color } from '../common/Colors/colors';

// A proper bottom-sheet action menu — replaces native Alert.alert action sheets
// everywhere in the app. options: [{ label, icon, destructive, onPress }]
export const ActionMenu = ({ visible, onClose, title, options = [] }) => {
    const { isDarkMode } = useSelector(state => state.theme);

    const styles = StyleSheet.create({
        overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
        sheet: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            paddingTop: 10,
            paddingBottom: 30,
        },
        grabber: {
            width: 40, height: 4, borderRadius: 2, alignSelf: 'center',
            backgroundColor: isDarkMode ? '#3A3A3A' : '#E0E0E0', marginBottom: 12,
        },
        title: {
            fontSize: 13,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
            marginBottom: 8,
        },
        option: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingVertical: 15,
            paddingHorizontal: 22,
        },
        optionLabel: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
        divider: { height: 1, backgroundColor: isDarkMode ? '#2A2A2A' : '#F0F0F0', marginHorizontal: 22 },
        cancel: {
            marginTop: 10,
            marginHorizontal: 16,
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#2A2A2A' : '#F3F4F6',
        },
        cancelText: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: isDarkMode ? '#fff' : '#111' },
    });

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={() => {}}>
                    <View style={styles.grabber} />
                    {!!title && <CustomText style={styles.title} numberOfLines={1}>{title}</CustomText>}
                    {options.map((opt, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <View style={styles.divider} />}
                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => {
                                    onClose();
                                    setTimeout(() => opt.onPress?.(), 200);
                                }}
                            >
                                {!!opt.icon && (
                                    <Icon
                                        name={opt.icon}
                                        size={18}
                                        color={opt.destructive ? '#EF4136' : App_Primary_color}
                                    />
                                )}
                                <CustomText
                                    style={[
                                        styles.optionLabel,
                                        { color: opt.destructive ? '#EF4136' : (isDarkMode ? '#fff' : '#111') },
                                    ]}
                                >
                                    {opt.label}
                                </CustomText>
                            </TouchableOpacity>
                        </React.Fragment>
                    ))}
                    <TouchableOpacity style={styles.cancel} onPress={onClose}>
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
    const { isDarkMode } = useSelector(state => state.theme);

    const styles = StyleSheet.create({
        overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 30 },
        card: {
            width: '100%',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
            borderRadius: 20,
            padding: 22,
        },
        title: { fontSize: 17, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textAlign: 'center' },
        message: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 20,
        },
        row: { flexDirection: 'row', gap: 12, marginTop: 22 },
        btn: { flex: 1, paddingVertical: 13, borderRadius: 14, alignItems: 'center' },
        cancelBtn: { backgroundColor: isDarkMode ? '#2A2A2A' : '#F3F4F6' },
        cancelText: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: isDarkMode ? '#fff' : '#111' },
        confirmBtn: { backgroundColor: '#EF4136' },
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
