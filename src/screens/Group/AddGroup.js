import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import SafeImage from '../../components/SafeImage';
import Row from '../../components/wrapper/row';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { groupApiPostFormData } from '../../utils/GroupApi';
import { ToastMsg } from '../../utils/helperFunctions';
import { white } from '../../common/Colors/colors';
import useThemeColor from '../../utils/useThemeColor';

const TYPES = ['private', 'public'];
const CURRENCIES = ['INR', 'USD'];
const CYCLES = ['monthly', 'yearly'];

// Matches web's Pages/Chat/Group/AddGroup.jsx — same fields, same
// api/user/CreateGroup endpoint (on the local dev backend, see GroupApi.js).
const AddGroup = ({ navigation }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const insets = useSafeAreaInsets();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('private');
    const [isPaid, setIsPaid] = useState(false);
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handlePickImage = () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
            if (response.didCancel || response.errorMessage) return;
            const asset = response.assets?.[0];
            if (asset) {
                setFile({ uri: asset.uri, type: asset.type, name: asset.fileName });
                setPreview(asset.uri);
            }
        });
    };

    const onSubmit = async () => {
        if (!name.trim()) return ToastMsg('Group name is required');
        if (isPaid && (!price || Number(price) <= 0)) return ToastMsg('Please enter a valid price');

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append('Name', name.trim());
            formData.append('Description', description.trim());
            formData.append('Type', type);
            formData.append('IsPaid', isPaid ? 'true' : 'false');
            if (isPaid) {
                formData.append('Price', price);
                formData.append('Currency', currency);
                formData.append('BillingCycle', billingCycle);
            }
            if (file?.uri) {
                formData.append('Image', {
                    uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
                    type: file.type || 'image/jpeg',
                    name: file.name || 'group.jpg',
                });
            }

            const result = await groupApiPostFormData('/api/user/CreateGroup', formData);
            if (result?.statusCode === 200) {
                ToastMsg(result?.message || 'Group created successfully');
                // Dismiss the keyboard before unmounting — navigating away while a
                // TextInput still holds focus can crash RN's Fabric focus-search
                // (SIGSEGV null ShadowNode) on this RN version.
                Keyboard.dismiss();
                setTimeout(() => navigation.goBack(), 50);
            } else {
                ToastMsg(result?.message || 'Failed to create group');
            }
        } catch (error) {
            console.log('AddGroup submit error', error);
            ToastMsg('Could not reach local group backend — is it running?');
        } finally {
            setSubmitting(false);
        }
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#fff', paddingTop: insets.top },
        header: { paddingHorizontal: 20, paddingVertical: 14 },
        headerTitle: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginLeft: 14 },
        body: { padding: 20, paddingBottom: 60 },
        label: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: isDarkMode ? '#D1D5DB' : '#374151', marginBottom: 8, marginTop: 16 },
        required: { color: '#EF4136' },
        uploadBox: {
            width: '100%', height: 160, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed',
            borderColor: primaryColor, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FAFAFA',
        },
        uploadImage: { width: '100%', height: '100%' },
        uploadHint: { fontSize: 13, color: isDarkMode ? '#9CA3AF' : '#6B7280', marginTop: 8 },
        inputBox: {
            borderWidth: 1, borderColor: isDarkMode ? '#2A2A2A' : '#E5E7EB', borderRadius: 12,
            paddingHorizontal: 14, paddingVertical: 12, color: isDarkMode ? white : '#111',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular, fontSize: 14,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FAFAFA',
        },
        textArea: { minHeight: 90, textAlignVertical: 'top' },
        chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
        chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: primaryColor },
        chipActive: { backgroundColor: primaryColor },
        chipText: { fontSize: 13, color: primaryColor, fontFamily: FONTS_FAMILY.SourceSans3_Medium, textTransform: 'capitalize' },
        chipTextActive: { color: white },
        row2: { flexDirection: 'row', gap: 12 },
        flex1: { flex: 1 },
        toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
        toggle: { width: 48, height: 28, borderRadius: 14, padding: 3, justifyContent: 'center' },
        toggleOn: { backgroundColor: primaryColor, alignItems: 'flex-end' },
        toggleOff: { backgroundColor: isDarkMode ? '#3A3A3A' : '#D1D5DB', alignItems: 'flex-start' },
        toggleKnob: { width: 22, height: 22, borderRadius: 11, backgroundColor: white },
        submitBtn: { marginTop: 26, backgroundColor: primaryColor, paddingVertical: 15, borderRadius: 16, alignItems: 'center' },
        submitBtnDisabled: { opacity: 0.6 },
        submitBtnText: { color: white, fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    });

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <Row style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="x" size={22} color={isDarkMode ? white : '#111'} />
                </TouchableOpacity>
                <CustomText style={styles.headerTitle}>Create Group</CustomText>
            </Row>

            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <CustomText style={styles.label}>Group Image</CustomText>
                <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage} activeOpacity={0.85}>
                    {preview ? (
                        <SafeImage uri={preview} style={styles.uploadImage} />
                    ) : (
                        <>
                            <Icon name="image" size={26} color={primaryColor} />
                            <CustomText style={styles.uploadHint}>Tap to add a group image</CustomText>
                        </>
                    )}
                </TouchableOpacity>

                <CustomText style={styles.label}>Group Name <CustomText style={styles.required}>*</CustomText></CustomText>
                <TextInput
                    style={styles.inputBox}
                    placeholder="e.g. Weekend Car Meetups"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    value={name}
                    onChangeText={setName}
                />

                <CustomText style={styles.label}>Description</CustomText>
                <TextInput
                    style={[styles.inputBox, styles.textArea]}
                    placeholder="What's this group about?"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    multiline
                    maxLength={255}
                    value={description}
                    onChangeText={setDescription}
                />

                <CustomText style={styles.label}>Type</CustomText>
                <View style={styles.chipRow}>
                    {TYPES.map((t) => (
                        <TouchableOpacity key={t} style={[styles.chip, type === t && styles.chipActive]} onPress={() => setType(t)}>
                            <CustomText style={[styles.chipText, type === t && styles.chipTextActive]}>{t}</CustomText>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.toggleRow}>
                    <CustomText style={[styles.label, { marginTop: 0 }]}>Paid Group</CustomText>
                    <TouchableOpacity
                        style={[styles.toggle, isPaid ? styles.toggleOn : styles.toggleOff]}
                        onPress={() => setIsPaid((p) => !p)}
                    >
                        <View style={styles.toggleKnob} />
                    </TouchableOpacity>
                </View>

                {isPaid && (
                    <>
                        <View style={styles.row2}>
                            <View style={styles.flex1}>
                                <CustomText style={styles.label}>Price</CustomText>
                                <TextInput
                                    style={styles.inputBox}
                                    placeholder="e.g. 199"
                                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                                    keyboardType="number-pad"
                                    value={price}
                                    onChangeText={setPrice}
                                />
                            </View>
                            <View style={styles.flex1}>
                                <CustomText style={styles.label}>Currency</CustomText>
                                <View style={styles.chipRow}>
                                    {CURRENCIES.map((c) => (
                                        <TouchableOpacity key={c} style={[styles.chip, currency === c && styles.chipActive]} onPress={() => setCurrency(c)}>
                                            <CustomText style={[styles.chipText, currency === c && styles.chipTextActive]}>{c}</CustomText>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <CustomText style={styles.label}>Billing Cycle</CustomText>
                        <View style={styles.chipRow}>
                            {CYCLES.map((c) => (
                                <TouchableOpacity key={c} style={[styles.chip, billingCycle === c && styles.chipActive]} onPress={() => setBillingCycle(c)}>
                                    <CustomText style={[styles.chipText, billingCycle === c && styles.chipTextActive]}>{c}</CustomText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                <TouchableOpacity
                    style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                    onPress={onSubmit}
                    disabled={submitting}
                >
                    <CustomText style={styles.submitBtnText}>{submitting ? 'Creating...' : 'Create Group'}</CustomText>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddGroup;
