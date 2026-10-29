import React, { useCallback, useState } from 'react';
import { Keyboard, Platform, View } from 'react-native';
import FormScreen, { FormSection } from '../../components/FormScreen';
import FormField from '../../components/FormField';
import FormButton from '../../components/FormButton';
import ImageUploadBox from '../../components/ImageUploadBox';
import DateTimeField from '../../components/DateTimeField';
import { BASE_URL, getItem } from '../../utils/Apis';
import urls from '../../config/urls';
import { ToastMsg } from '../../utils/helperFunctions';
import useForm from '../../utils/useForm';
import { compose, required, maxLength, number, url } from '../../utils/validators';

// Create / update event — web's Pages/Event/AddEvent.jsx + UpdateEventModel.jsx
// (same fields, api/user/UserCreateEvent and api/user/UserUpdateEvent/:id).
const SCHEMA = {
    Name: compose(required('Event name'), maxLength(100, 'Event name')),
    City: required('City'),
    VenuePlace: required('Venue place'),
    VenueAddress: required('Venue address'),
    Date: required('Date'),
    TimeFrom: required('Start time'),
    TimeTo: compose(required('End time'), (v, vals) => (vals.TimeFrom && v && v <= vals.TimeFrom ? 'End time must be after the start time' : null)),
    Genre: required('Genre'),
    Promoter: maxLength(80, 'Promoter'),
    Promotionallinks: url,
    MinAge: number('Minimum age', { min: 0, max: 120, integer: true }),
    Cost: number('Cost', { min: 0 }),
    EventDetail: maxLength(1500, 'Event details'),
};

const str = v => (v === undefined || v === null ? '' : String(v));

const AddEvent = ({ navigation, route }) => {
    const editing = route?.params?.event || null;
    const isEdit = !!editing;

    const form = useForm({
        Name: str(editing?.Name), City: str(editing?.City), VenuePlace: str(editing?.VenuePlace),
        VenueAddress: str(editing?.VenueAddress), Date: str(editing?.Date).slice(0, 10), TimeFrom: str(editing?.TimeFrom),
        TimeTo: str(editing?.TimeTo), Genre: str(editing?.Genre), Promoter: str(editing?.Promoter),
        Promotionallinks: str(editing?.Promotionallinks), MinAge: str(editing?.MinAge), Cost: str(editing?.Cost),
        EventDetail: str(editing?.EventDetail),
    }, SCHEMA);
    const { values: v, errors: e } = form;

    const [image, setImage] = useState(editing?.Image ? { uri: editing.Image, isExisting: true } : null);
    const [saving, setSaving] = useState(false);

    const text = name => ({
        value: v[name], error: e[name],
        onChangeText: t => form.set(name, t), onBlur: () => form.blur(name),
    });

    const onSubmit = useCallback(async () => {
        const { ok, firstError } = form.validateAll();
        if (!ok) return ToastMsg(firstError);

        try {
            setSaving(true);
            const token = await getItem('token');
            const fd = new FormData();
            if (image && !image.isExisting) {
                fd.append('Image', {
                    uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
                    type: image.type || 'image/jpeg',
                    name: image.name || 'event.jpg',
                });
            }
            ['Name', 'City', 'VenuePlace', 'VenueAddress', 'Genre', 'Promoter', 'Promotionallinks', 'EventDetail']
                .forEach(k => fd.append(k, v[k].trim()));
            ['Date', 'TimeFrom', 'TimeTo', 'MinAge', 'Cost'].forEach(k => fd.append(k, v[k]));

            const endpoint = isEdit ? `${BASE_URL}${urls.updateEvent}/${editing._id}` : `${BASE_URL}${urls.createEvent}`;
            const res = await fetch(endpoint, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const result = await res.json();
            // Backend quirk: create/update swap `data` and `message` — the success text can be in
            // `data`. Only show whichever is actually a string.
            const successText = typeof result?.data === 'string'
                ? result.data
                : typeof result?.message === 'string'
                    ? result.message
                    : (isEdit ? 'Event updated successfully' : 'Event created successfully');
            ToastMsg(successText);
            if (res.ok) {
                Keyboard.dismiss();
                setTimeout(() => navigation.goBack(), 50);
            }
        } catch (err) {
            console.log('AddEvent submit error', err);
            ToastMsg('Failed to submit event');
        } finally {
            setSaving(false);
        }
    }, [form, image, v, isEdit, editing, navigation]);

    return (
        <FormScreen
            title={isEdit ? 'Update Event' : 'Create Event'}
            subtitle="Tell people what, when and where"
            onBack={() => navigation.goBack()}
            footer={<FormButton label={isEdit ? 'Save Changes' : 'Create Event'} onPress={onSubmit} loading={saving} />}>

            <FormSection title="Event poster">
                <ImageUploadBox label="Event image" image={image} onChange={setImage} />
            </FormSection>

            <FormSection title="Basics">
                <FormField label="Event name" required placeholder="e.g. Sunday Cars & Coffee" autoCapitalize="words" maxLength={100} {...text('Name')} />
                <FormField label="Genre" required placeholder="e.g. Meetup, Track day, Auto show" autoCapitalize="words" {...text('Genre')} />
                <FormField label="Event details" placeholder="What is this event about?" multiline maxLength={1500} showCounter autoCapitalize="sentences" {...text('EventDetail')} />
            </FormSection>

            <FormSection title="When">
                <DateTimeField
                    label="Date" required mode="date" value={v.Date} error={e.Date}
                    minimumDate={isEdit ? undefined : new Date()}
                    onChange={d => { form.set('Date', d); form.blur('Date'); }}
                />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                        <DateTimeField label="From" required mode="time" value={v.TimeFrom} error={e.TimeFrom}
                            onChange={t => { form.set('TimeFrom', t); form.blur('TimeFrom'); }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <DateTimeField label="To" required mode="time" value={v.TimeTo} error={e.TimeTo}
                            onChange={t => { form.set('TimeTo', t); form.blur('TimeTo'); }} />
                    </View>
                </View>
            </FormSection>

            <FormSection title="Where">
                <FormField label="City" required leftIcon="map-pin" placeholder="e.g. Indore" autoCapitalize="words" {...text('City')} />
                <FormField label="Venue place" required placeholder="e.g. Meghdoot Garden" autoCapitalize="words" {...text('VenuePlace')} />
                <FormField label="Venue address" required placeholder="Full address" multiline autoCapitalize="sentences" {...text('VenueAddress')} />
            </FormSection>

            <FormSection title="More info">
                <FormField label="Promoter / Organizer" placeholder="Promoter or organizer name" autoCapitalize="words" maxLength={80} {...text('Promoter')} />
                <FormField label="Promotional link" placeholder="https://..." keyboardType="url" {...text('Promotionallinks')} />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                        <FormField label="Min age" placeholder="e.g. 18" keyboardType="number-pad" maxLength={3} {...text('MinAge')}
                            onChangeText={t => form.set('MinAge', t.replace(/\D/g, ''))} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormField label="Cost (₹)" placeholder="0 = free" keyboardType="decimal-pad" {...text('Cost')}
                            onChangeText={t => form.set('Cost', t.replace(/[^0-9.]/g, ''))} />
                    </View>
                </View>
            </FormSection>
        </FormScreen>
    );
};

export default AddEvent;
