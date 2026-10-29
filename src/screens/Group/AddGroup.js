import React, { useCallback, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import FormScreen, { FormSection } from '../../components/FormScreen';
import FormField from '../../components/FormField';
import FormButton from '../../components/FormButton';
import FormSwitch from '../../components/FormSwitch';
import OptionChips from '../../components/OptionChips';
import ImageUploadBox from '../../components/ImageUploadBox';
import { groupApiPostFormData, groupApiPutFormData } from '../../utils/GroupApi';
import { ToastMsg } from '../../utils/helperFunctions';
import useForm from '../../utils/useForm';
import { compose, required, maxLength, number } from '../../utils/validators';

const TYPES = ['private', 'public'];
const CURRENCIES = ['INR', 'USD'];
const CYCLES = ['monthly', 'yearly'];

// Create / edit a group — web's Pages/Chat/Group/AddGroup.jsx + UpdateGroupModel.jsx
// (api/user/CreateGroup, api/user/UpdateGroup/:id).
const SCHEMA = {
    Name: compose(required('Group name'), maxLength(60, 'Group name')),
    Description: maxLength(255, 'Description'),
    Price: (v, vals) => (vals.IsPaid
        ? compose(required('Price'), number('Price'), x => (Number(x) > 0 ? null : 'Enter a valid price for a paid group'))(v)
        : null),
};

const AddGroup = ({ navigation, route }) => {
    const editing = route?.params?.group || null;   // opened from GroupDetail → edit mode
    const isEdit = !!editing;

    const form = useForm({
        Name: editing?.Name || '',
        Description: editing?.Description || '',
        Type: editing?.Type || 'private',
        IsPaid: !!editing?.IsPaid,
        IsChannel: !!editing?.IsChannel,
        IsActive: editing?.IsActive ?? true,
        Price: editing?.Price ? String(editing.Price) : '',
        Currency: editing?.Currency || 'INR',
        BillingCycle: editing?.BillingCycle || 'monthly',
    }, SCHEMA);
    const { values: v, errors: e } = form;

    const [image, setImage] = useState(editing?.Image ? { uri: editing.Image, isExisting: true } : null);
    const [saving, setSaving] = useState(false);

    const onSubmit = useCallback(async () => {
        const { ok, firstError } = form.validateAll();
        if (!ok) return ToastMsg(firstError);

        try {
            setSaving(true);
            const fd = new FormData();
            fd.append('Name', v.Name.trim());
            fd.append('Description', v.Description.trim());
            fd.append('Type', v.Type);
            fd.append('IsPaid', v.IsPaid ? 'true' : 'false');
            fd.append('IsChannel', v.IsChannel ? 'true' : 'false');
            if (isEdit) fd.append('IsActive', v.IsActive ? 'true' : 'false');
            if (v.IsPaid) {
                fd.append('Price', v.Price);
                fd.append('Currency', v.Currency);
                fd.append('BillingCycle', v.BillingCycle);
            } else {
                fd.append('Price', '0');
            }
            if (image && !image.isExisting) {
                fd.append('Image', {
                    uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
                    type: image.type || 'image/jpeg',
                    name: image.name || 'group.jpg',
                });
            }

            const result = isEdit
                ? await groupApiPutFormData(`/api/user/UpdateGroup/${editing._id}`, fd)
                : await groupApiPostFormData('/api/user/CreateGroup', fd);
            if (result?.statusCode === 200) {
                ToastMsg(result?.message || (isEdit ? 'Group updated' : 'Group created successfully'));
                // Dismiss the keyboard before leaving — navigating away while a TextInput still
                // holds focus can crash RN's Fabric focus-search on this RN version.
                Keyboard.dismiss();
                setTimeout(() => navigation.goBack(), 50);
            } else {
                ToastMsg(result?.message || 'Failed to save group');
            }
        } catch (err) {
            console.log('AddGroup submit error', err);
            ToastMsg(err?.message || 'Could not save the group. Check your connection.');
        } finally {
            setSaving(false);
        }
    }, [form, v, image, isEdit, editing, navigation]);

    return (
        <FormScreen
            title={isEdit ? 'Edit Group' : 'Create Group'}
            subtitle="Bring your community together"
            onBack={() => navigation.goBack()}
            footer={<FormButton label={isEdit ? 'Save Changes' : 'Create Group'} onPress={onSubmit} loading={saving} />}>

            <FormSection title="Group photo">
                <ImageUploadBox label="Group image" image={image} onChange={setImage} hint="Tap to add a group image" height={150} />
            </FormSection>

            <FormSection title="Details">
                <FormField label="Group name" required placeholder="e.g. Weekend Car Meetups" autoCapitalize="words" maxLength={60}
                    value={v.Name} error={e.Name} onChangeText={t => form.set('Name', t)} onBlur={() => form.blur('Name')} />
                <FormField label="Description" placeholder="What's this group about?" multiline maxLength={255} showCounter autoCapitalize="sentences"
                    value={v.Description} error={e.Description} onChangeText={t => form.set('Description', t)} onBlur={() => form.blur('Description')} />
                <OptionChips label="Type" options={TYPES} value={v.Type} allowClear={false} onChange={t => form.set('Type', t)} />
            </FormSection>

            <FormSection title="Settings">
                <FormSwitch label="Channel" hint="Only admins can send messages" value={v.IsChannel} onChange={val => form.set('IsChannel', val)} />
                {isEdit && <FormSwitch label="Active" hint="Inactive groups are hidden" value={v.IsActive} onChange={val => form.set('IsActive', val)} />}
                <FormSwitch label="Paid group" hint="Members pay to join" value={v.IsPaid} onChange={val => form.set('IsPaid', val)} />

                {v.IsPaid && (
                    <>
                        <FormField label="Price" required placeholder="e.g. 199" keyboardType="decimal-pad"
                            value={v.Price} error={e.Price}
                            onChangeText={t => form.set('Price', t.replace(/[^0-9.]/g, ''))} onBlur={() => form.blur('Price')} />
                        <OptionChips label="Currency" options={CURRENCIES} value={v.Currency} allowClear={false} onChange={t => form.set('Currency', t)} />
                        <OptionChips label="Billing cycle" options={CYCLES} value={v.BillingCycle} allowClear={false} onChange={t => form.set('BillingCycle', t)} />
                    </>
                )}
            </FormSection>
        </FormScreen>
    );
};

export default AddGroup;
