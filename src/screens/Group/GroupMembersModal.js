import React, { useState } from 'react';
import { View, Modal, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import { ConfirmDialog } from '../../components/ActionMenu';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { groupApiDelete, groupApiPut } from '../../utils/GroupApi';
import { ToastMsg } from '../../utils/helperFunctions';
import { white } from '../../common/Colors/colors';
import useThemeColor from '../../utils/useThemeColor';
import IMG from '../../assets/Images';

// Member list bottom sheet — matches web's member panel inside GroupDetail.jsx
// + AdminRemoveMemberModel.jsx's confirm-remove flow.
const GroupMembersModal = ({ visible, onClose, groupId, members, isAdmin, currentUserId, onMemberRemoved, onMemberPromoted }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const [confirmMember, setConfirmMember] = useState(null);
    const [removing, setRemoving] = useState(false);
    const [adminTarget, setAdminTarget] = useState(null);

    const makeAdmin = async () => {
        if (!adminTarget) return;
        try {
            const res = await groupApiPut(`/api/user/MakeGroupAdmin/${groupId}/${adminTarget.User?._id}`, {});
            if (res?.statusCode === 200) {
                ToastMsg(res?.message || 'Member is now an admin');
                onMemberPromoted?.(adminTarget);
            } else {
                ToastMsg(res?.message || 'Failed to make admin');
            }
        } catch (error) {
            ToastMsg(error?.message || 'Failed to make admin');
        } finally {
            setAdminTarget(null);
        }
    };

    const removeMember = async () => {
        if (!confirmMember) return;
        try {
            setRemoving(true);
            const res = await groupApiDelete(`/api/user/AdminRemoveMember/${groupId}/${confirmMember.User?._id}`);
            if (res?.statusCode === 200) {
                ToastMsg(res?.message || 'Member removed');
                onMemberRemoved?.(confirmMember);
            } else {
                ToastMsg(res?.message || 'Failed to remove member');
            }
        } catch (error) {
            ToastMsg(error?.message || 'Failed to remove member');
        } finally {
            setRemoving(false);
            setConfirmMember(null);
        }
    };

    const styles = StyleSheet.create({
        overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
        sheet: {
            backgroundColor: isDarkMode ? '#131B2B' : '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
            maxHeight: '75%', paddingBottom: 20,
        },
        grabber: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 10, backgroundColor: isDarkMode ? '#3A3A3A' : '#E0E0E0' },
        headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
        title: { fontSize: 17, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
        avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
        name: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
        username: { fontSize: 12, color: isDarkMode ? '#94A3B8' : '#64748B', marginTop: 1 },
        adminBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: primaryColor, marginLeft: 8 },
        adminBadgeText: { fontSize: 10, color: white, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
        removeBtn: { padding: 8 },
        emptyText: { textAlign: 'center', paddingVertical: 30, color: isDarkMode ? '#94A3B8' : '#64748B' },
    });

    return (
        <>
            <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
                <View style={styles.overlay}>
                    <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
                    <View style={styles.sheet}>
                        <View style={styles.grabber} />
                        <View style={styles.headerRow}>
                            <CustomText style={styles.title}>Members ({members?.length || 0})</CustomText>
                            <TouchableOpacity onPress={onClose}>
                                <Icon name="x" size={22} color={isDarkMode ? white : '#111'} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={members || []}
                            keyExtractor={(item, index) => item?._id || String(index)}
                            renderItem={({ item }) => {
                                const isSelf = item?.User?._id === currentUserId;
                                const canRemove = isAdmin && item?.Role !== 'admin' && !isSelf;
                                return (
                                    <View style={styles.row}>
                                        <Image
                                            source={item?.User?.Image ? { uri: item.User.Image } : IMG.MessageProfile}
                                            style={styles.avatar}
                                        />
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <View>
                                                <CustomText style={styles.name}>{item?.User?.FullName || item?.User?.UserName}</CustomText>
                                                <CustomText style={styles.username}>@{item?.User?.UserName}</CustomText>
                                            </View>
                                            {item?.Role === 'admin' && (
                                                <View style={styles.adminBadge}>
                                                    <CustomText style={styles.adminBadgeText}>Admin</CustomText>
                                                </View>
                                            )}
                                        </View>
                                        {canRemove && (
                                            <TouchableOpacity style={styles.removeBtn} onPress={() => setAdminTarget(item)}>
                                                <Icon name="shield" size={18} color={primaryColor} />
                                            </TouchableOpacity>
                                        )}
                                        {canRemove && (
                                            <TouchableOpacity style={styles.removeBtn} onPress={() => setConfirmMember(item)}>
                                                <Icon name="user-x" size={18} color="#EF4136" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                );
                            }}
                            ListEmptyComponent={<CustomText style={styles.emptyText}>No members yet</CustomText>}
                        />
                    </View>
                </View>
            </Modal>

            <ConfirmDialog
                visible={!!adminTarget}
                onClose={() => setAdminTarget(null)}
                title="Make Admin"
                message={`Make ${adminTarget?.User?.FullName || adminTarget?.User?.UserName || 'this member'} an admin of this group?`}
                onConfirm={makeAdmin}
            />
            <ConfirmDialog
                visible={!!confirmMember}
                onClose={() => setConfirmMember(null)}
                title="Remove Member"
                message={`Remove ${confirmMember?.User?.FullName || confirmMember?.User?.UserName || 'this member'} from the group?`}
                onConfirm={removeMember}
            />
        </>
    );
};

export default GroupMembersModal;
