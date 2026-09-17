import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import SafeImage from '../../components/SafeImage';
import Row from '../../components/wrapper/row';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { BASE_URL, getItem } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import urls from '../../config/urls';
import { white } from '../../common/Colors/colors';
import useThemeColor from '../../utils/useThemeColor';

// pad("5") -> "05" — used to build HH:MM the same way web's <input type="time"> does
const pad = (n) => String(n).padStart(2, '0');
const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toTimeStr = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

// Create/Update Event — matches web's Pages/Event/AddEvent.jsx + UpdateEventModel.jsx
// (same fields, same api/user/UserCreateEvent + api/user/UserUpdateEvent/:id).
const AddEvent = ({ navigation, route }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const insets = useSafeAreaInsets();

    const editingEvent = route?.params?.event || null;
    const isEditMode = !!editingEvent;

    const [name, setName] = useState(editingEvent?.Name || '');
    const [city, setCity] = useState(editingEvent?.City || '');
    const [venuePlace, setVenuePlace] = useState(editingEvent?.VenuePlace || '');
    const [venueAddress, setVenueAddress] = useState(editingEvent?.VenueAddress || '');
    const [date, setDate] = useState(editingEvent?.Date || '');
    const [timeFrom, setTimeFrom] = useState(editingEvent?.TimeFrom || '');
    const [timeTo, setTimeTo] = useState(editingEvent?.TimeTo || '');
    const [genre, setGenre] = useState(editingEvent?.Genre || '');
    const [promoter, setPromoter] = useState(editingEvent?.Promoter || '');
    const [promotionalLinks, setPromotionalLinks] = useState(editingEvent?.Promotionallinks || '');
    const [minAge, setMinAge] = useState(editingEvent?.MinAge ? String(editingEvent.MinAge) : '');
    const [cost, setCost] = useState(editingEvent?.Cost ? String(editingEvent.Cost) : '');
    const [eventDetail, setEventDetail] = useState(editingEvent?.EventDetail || '');

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(editingEvent?.Image || null);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimeFromPicker, setShowTimeFromPicker] = useState(false);
    const [showTimeToPicker, setShowTimeToPicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFilePick = () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
            if (response.didCancel) return;
            if (response.errorMessage) {
                console.log('Image Picker Error:', response.errorMessage);
                return;
            }
            const asset = response.assets?.[0];
            if (asset) {
                setFile({ uri: asset.uri, type: asset.type, name: asset.fileName });
                setPreview(asset.uri);
            }
        });
    };

    const removeImage = () => {
        setFile(null);
        setPreview(null);
    };

    const onSubmit = async () => {
        if (!name.trim()) return ToastMsg('Event name is required');
        if (!city.trim()) return ToastMsg('City is required');
        if (!venuePlace.trim()) return ToastMsg('Venue place is required');
        if (!venueAddress.trim()) return ToastMsg('Venue address is required');
        if (!date) return ToastMsg('Date is required');
        if (!timeFrom) return ToastMsg('Start time is required');
        if (!timeTo) return ToastMsg('End time is required');
        if (!genre.trim()) return ToastMsg('Genre is required');

        try {
            setIsSubmitting(true);
            const token = await getItem('token');

            const formData = new FormData();
            if (file?.uri) {
                formData.append('Image', {
                    uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
                    type: file.type || 'image/jpeg',
                    name: file.name || 'event.jpg',
                });
            }
            formData.append('Name', name.trim());
            formData.append('City', city.trim());
            formData.append('VenuePlace', venuePlace.trim());
            formData.append('VenueAddress', venueAddress.trim());
            formData.append('Date', date);
            formData.append('TimeFrom', timeFrom);
            formData.append('TimeTo', timeTo);
            formData.append('Genre', genre.trim());
            formData.append('Promoter', promoter.trim());
            formData.append('Promotionallinks', promotionalLinks.trim());
            formData.append('MinAge', minAge);
            formData.append('Cost', cost);
            formData.append('EventDetail', eventDetail.trim());

            const endpoint = isEditMode
                ? `${BASE_URL}${urls.updateEvent}/${editingEvent._id}`
                : `${BASE_URL}${urls.createEvent}`;

            const response = await fetch(endpoint, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const result = await response.json();
            // Backend quirk: Create/Update Event swap data & message — the success
            // string comes back in `data`, and the created/updated event object in
            // `message`. Only show whichever field is actually a string.
            const successText = typeof result?.data === 'string'
                ? result.data
                : typeof result?.message === 'string'
                    ? result.message
                    : (isEditMode ? 'Event updated successfully' : 'Event created successfully');
            ToastMsg(successText);
            if (response.ok) navigation.goBack();
        } catch (error) {
            console.log('AddEvent submit error', error);
            ToastMsg('Failed to submit event');
        } finally {
            setIsSubmitting(false);
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
            width: '100%', height: 180, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed',
            borderColor: primaryColor, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FAFAFA',
        },
        uploadImage: { width: '100%', height: '100%' },
        removeImgBtn: {
            position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: 15,
            backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center',
        },
        uploadHint: { fontSize: 13, color: isDarkMode ? '#9CA3AF' : '#6B7280', marginTop: 8 },
        inputBox: {
            borderWidth: 1, borderColor: isDarkMode ? '#2A2A2A' : '#E5E7EB', borderRadius: 12,
            paddingHorizontal: 14, paddingVertical: 12, color: isDarkMode ? white : '#111',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular, fontSize: 14,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FAFAFA',
        },
        textArea: { minHeight: 100, textAlignVertical: 'top' },
        row2: { flexDirection: 'row', gap: 12 },
        flex1: { flex: 1 },
        dateBox: {
            borderWidth: 1, borderColor: isDarkMode ? '#2A2A2A' : '#E5E7EB', borderRadius: 12,
            paddingHorizontal: 14, paddingVertical: 12, backgroundColor: isDarkMode ? '#1E1E1E' : '#FAFAFA', justifyContent: 'center',
        },
        dateText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? white : '#111' },
        charCount: { fontSize: 11, color: isDarkMode ? '#6B7280' : '#9CA3AF', textAlign: 'right', marginTop: 4 },
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
                <CustomText style={styles.headerTitle}>{isEditMode ? 'Update Event' : 'Add New Event'}</CustomText>
            </Row>

            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <CustomText style={styles.label}>Event Image</CustomText>
                <TouchableOpacity style={styles.uploadBox} onPress={handleFilePick} activeOpacity={0.85}>
                    {preview ? (
                        <>
                            <SafeImage uri={preview} style={styles.uploadImage} />
                            <TouchableOpacity style={styles.removeImgBtn} onPress={removeImage}>
                                <Icon name="x" size={16} color={white} />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Icon name="upload" size={28} color={primaryColor} />
                            <CustomText style={styles.uploadHint}>Click to upload image (PNG, JPG up to 10MB)</CustomText>
                        </>
                    )}
                </TouchableOpacity>

                <CustomText style={styles.label}>Event Name <CustomText style={styles.required}>*</CustomText></CustomText>
                <TextInput
                    style={styles.inputBox}
                    placeholder="e.g. Summer Music Festival"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    value={name}
                    onChangeText={setName}
                />

                <View style={styles.row2}>
                    <View style={styles.flex1}>
                        <CustomText style={styles.label}>City <CustomText style={styles.required}>*</CustomText></CustomText>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="e.g. Chandigarh"
                            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                            value={city}
                            onChangeText={setCity}
                        />
                    </View>
                    <View style={styles.flex1}>
                        <CustomText style={styles.label}>Genre <CustomText style={styles.required}>*</CustomText></CustomText>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="e.g. EDM, Rock"
                            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                            value={genre}
                            onChangeText={setGenre}
                        />
                    </View>
                </View>

                <CustomText style={styles.label}>Venue Place <CustomText style={styles.required}>*</CustomText></CustomText>
                <TextInput
                    style={styles.inputBox}
                    placeholder="e.g. Sector 17 Plaza"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    value={venuePlace}
                    onChangeText={setVenuePlace}
                />

                <CustomText style={styles.label}>Venue Address <CustomText style={styles.required}>*</CustomText></CustomText>
                <TextInput
                    style={styles.inputBox}
                    placeholder="Full address"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    value={venueAddress}
                    onChangeText={setVenueAddress}
                />

                <CustomText style={styles.label}>Date <CustomText style={styles.required}>*</CustomText></CustomText>
                <TouchableOpacity style={styles.dateBox} onPress={() => setShowDatePicker(true)}>
                    <CustomText style={styles.dateText}>{date || 'Select date'}</CustomText>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date ? new Date(date) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selected) => {
                            setShowDatePicker(false);
                            if (selected) setDate(toDateStr(selected));
                        }}
                    />
                )}

                <View style={styles.row2}>
                    <View style={styles.flex1}>
                        <CustomText style={styles.label}>Time From <CustomText style={styles.required}>*</CustomText></CustomText>
                        <TouchableOpacity style={styles.dateBox} onPress={() => setShowTimeFromPicker(true)}>
                            <CustomText style={styles.dateText}>{timeFrom || 'Start time'}</CustomText>
                        </TouchableOpacity>
                        {showTimeFromPicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, selected) => {
                                    setShowTimeFromPicker(false);
                                    if (selected) setTimeFrom(toTimeStr(selected));
                                }}
                            />
                        )}
                    </View>
                    <View style={styles.flex1}>
                        <CustomText style={styles.label}>Time To <CustomText style={styles.required}>*</CustomText></CustomText>
                        <TouchableOpacity style={styles.dateBox} onPress={() => setShowTimeToPicker(true)}>
                            <CustomText style={styles.dateText}>{timeTo || 'End time'}</CustomText>
                        </TouchableOpacity>
                        {showTimeToPicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, selected) => {
                                    setShowTimeToPicker(false);
                                    if (selected) setTimeTo(toTimeStr(selected));
                                }}
                            />
                        )}
                    </View>
                </View>

                <View style={styles.row2}>
                    <View style={styles.flex1}>
                        <CustomText style={styles.label}>Promoter</CustomText>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Promoter / Organizer name"
                            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                            value={promoter}
                            onChangeText={setPromoter}
                        />
                    </View>
                    <View style={styles.flex1}>
                        <CustomText style={styles.label}>Promotional Link</CustomText>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="https://..."
                            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                            autoCapitalize="none"
                            value={promotionalLinks}
                            onChangeText={setPromotionalLinks}
                        />
                    </View>
                </View>

                <View style={styles.row2}>
                    <View style={styles.flex1}>
                        <CustomText style={styles.label}>Minimum Age</CustomText>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="e.g. 18"
                            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                            keyboardType="number-pad"
                            value={minAge}
                            onChangeText={setMinAge}
                        />
                    </View>
                    <View style={styles.flex1}>
                        <CustomText style={styles.label}>Cost / Ticket Price</CustomText>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="e.g. 499 or Free"
                            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                            value={cost}
                            onChangeText={setCost}
                        />
                    </View>
                </View>

                <CustomText style={styles.label}>Event Details</CustomText>
                <TextInput
                    style={[styles.inputBox, styles.textArea]}
                    placeholder="Describe the event, lineup, special guests, etc."
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    multiline
                    maxLength={1000}
                    value={eventDetail}
                    onChangeText={setEventDetail}
                />
                <CustomText style={styles.charCount}>{eventDetail.length} / 1000</CustomText>

                <TouchableOpacity
                    style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                    onPress={onSubmit}
                    disabled={isSubmitting}
                >
                    <CustomText style={styles.submitBtnText}>
                        {isSubmitting ? 'Please Wait...' : isEditMode ? 'Update Event' : 'Create Event'}
                    </CustomText>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddEvent;
