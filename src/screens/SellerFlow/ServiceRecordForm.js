import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import FormScreen, { FormSection } from '../../components/FormScreen';
import FormField from '../../components/FormField';
import FormButton from '../../components/FormButton';
import OptionChips from '../../components/OptionChips';
import ChipInput from '../../components/ChipInput';
import DateTimeField, { toDateStr } from '../../components/DateTimeField';
import MultiImagePicker from '../../components/MultiImagePicker';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { THEMES } from '../../redux/reducer/theme';
import { profilePalette } from '../UserDetail/profileTheme';
import { BASE_URL, apiGet, getItem } from '../../utils/Apis';
import urls from '../../config/urls';
import { ToastMsg } from '../../utils/helperFunctions';
import {
  WORK_TYPES, MOD_GROUPS, SPEC_NUMBER_FIELDS, SPEC_TEXT_FIELDS,
} from '../../utils/serviceRecords';

const emptyPart = () => ({ Name: '', Brand: '', Quantity: '1' });
const emptyMods = () => Object.fromEntries(MOD_GROUPS.map(g => [g.key, []]));

// Add / edit a service record (web: AddVehicleServiceRecordModel + UpdateVehicleServiceRecord).
//   route.params.carId  → add for that car
//   route.params.record → edit (a rejected record goes back to pending on save)
const ServiceRecordForm = ({ navigation, route }) => {
  const record = route?.params?.record || null;
  const carId = route?.params?.carId || record?.Car?._id || record?.Car;
  const isEdit = !!record;

  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);

  const [shops, setShops] = useState([]);
  const [shopId, setShopId] = useState(record?.SellerShop?._id || record?.SellerShop || '');
  const [workType, setWorkType] = useState(record?.WorkType || 'service');
  const [title, setTitle] = useState(record?.Title || '');
  const [description, setDescription] = useState(record?.Description || '');
  const [cost, setCost] = useState(record?.Cost ? String(record.Cost) : '');
  const [mileage, setMileage] = useState(record?.MileageAtWork ? String(record.MileageAtWork) : '');
  const [workDate, setWorkDate] = useState(record?.WorkDate ? String(record.WorkDate).slice(0, 10) : toDateStr(new Date()));
  const [parts, setParts] = useState(
    record?.PartsUsed?.length
      ? record.PartsUsed.map(p => ({ Name: p?.Name || '', Brand: p?.Brand || '', Quantity: String(p?.Quantity || 1) }))
      : [emptyPart()],
  );
  const [existingImages, setExistingImages] = useState(record?.Images || []);
  const [images, setImages] = useState([]);
  const [spec, setSpec] = useState({ ...(record?.SpecUpdates || {}) });
  const [mods, setMods] = useState(() => {
    const m = emptyMods();
    MOD_GROUPS.forEach(g => { m[g.key] = record?.AddModifications?.[g.key] || []; });
    return m;
  });
  const [showSpec, setShowSpec] = useState(Object.keys(record?.SpecUpdates || {}).length > 0);
  const [showMods, setShowMods] = useState(MOD_GROUPS.some(g => record?.AddModifications?.[g.key]?.length));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet(urls.sellerAllShop);
        const list = res?.data || [];
        setShops(list);
        if (!isEdit && list.length === 1) setShopId(list[0]._id);
      } catch (e) {
        console.log('ServiceRecordForm shops error', e);
      }
    })();
  }, [isEdit]);

  const updatePart = (i, key, val) => setParts(p => p.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  const removePart = i => setParts(p => (p.length === 1 ? [emptyPart()] : p.filter((_, idx) => idx !== i)));

  const onSubmit = useCallback(async () => {
    const errs = {};
    if (!isEdit && !carId) return ToastMsg('Car ID is missing');
    if (!isEdit && shops.length > 0 && !shopId) errs.shop = 'Please select a shop';
    if (!title.trim()) errs.title = 'Title is required';
    if (cost !== '' && Number(cost) < 0) errs.cost = 'Cost cannot be negative';
    if (mileage !== '' && Number(mileage) < 0) errs.mileage = 'Mileage cannot be negative';
    setErrors(errs);
    const first = Object.values(errs)[0];
    if (first) return ToastMsg(first);

    const partsUsed = parts
      .filter(p => p.Name.trim())
      .map(p => ({ Name: p.Name.trim(), Brand: p.Brand.trim(), Quantity: Math.max(1, Number(p.Quantity) || 1) }));

    const specUpdates = {};
    SPEC_NUMBER_FIELDS.forEach(({ key }) => {
      if (spec[key] !== undefined && spec[key] !== '' && spec[key] !== null) specUpdates[key] = Number(spec[key]);
    });
    SPEC_TEXT_FIELDS.forEach(({ key }) => {
      if (String(spec[key] ?? '').trim()) specUpdates[key] = String(spec[key]).trim();
    });
    const addMods = {};
    MOD_GROUPS.forEach(({ key }) => { if (mods[key].length) addMods[key] = mods[key]; });

    try {
      setSaving(true);
      const token = await getItem('token');
      const fd = new FormData();
      if (isEdit) fd.append('ExistingImages', JSON.stringify(existingImages));
      else fd.append('carId', carId);
      if (shopId) fd.append('SellerShop', shopId);
      fd.append('WorkType', workType);
      fd.append('Title', title.trim());
      fd.append('Description', description.trim());
      fd.append('PartsUsed', JSON.stringify(partsUsed));
      fd.append('Cost', cost === '' ? 0 : Number(cost));
      fd.append('MileageAtWork', mileage === '' ? 0 : Number(mileage));
      fd.append('WorkDate', workDate || toDateStr(new Date()));
      fd.append('SpecUpdates', JSON.stringify(specUpdates));
      fd.append('AddModifications', JSON.stringify(addMods));
      images.forEach((img, i) => {
        fd.append('Images', {
          uri: Platform.OS === 'android' ? img.uri : img.uri.replace('file://', ''),
          type: img.type || 'image/jpeg',
          name: img.name || `service_${i}.jpg`,
        });
      });

      const url = isEdit ? `${urls.sellerUpdateServiceRecord}/${record._id}` : urls.sellerAddServiceRecord;
      const res = await fetch(`${BASE_URL}${url}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const result = await res.json();
      ToastMsg(result?.message || (isEdit ? 'Service record updated' : 'Service record added'));
      if (res.ok) {
        route?.params?.onSuccess?.();
        navigation.goBack();
      }
    } catch (err) {
      console.log('ServiceRecordForm submit error', err);
      ToastMsg('Something went wrong, please try again');
    } finally {
      setSaving(false);
    }
  }, [isEdit, carId, shops, shopId, title, cost, mileage, parts, spec, mods, existingImages, images, workType, description, workDate, record, navigation, route]);

  const Toggle = ({ label, hint, open, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.toggle}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.toggleTitle, { color: c.text }]}>{label}</Text>
        <Text style={[styles.toggleHint, { color: c.muted }]}>{hint}</Text>
      </View>
      <Feather name={open ? 'chevron-up' : 'chevron-down'} size={20} color={c.muted} />
    </TouchableOpacity>
  );

  const shopNames = shops.map(s => s.Name);
  const selectedShop = shops.find(s => s._id === shopId)?.Name || '';

  return (
    <FormScreen
      title={isEdit ? 'Edit Service Record' : 'Add Service Record'}
      subtitle={isEdit ? 'Saving sends a rejected record back to pending' : 'Pending until the vehicle owner approves'}
      onBack={() => navigation.goBack()}
      footer={<FormButton label={isEdit ? 'Save Changes' : 'Add Record'} onPress={onSubmit} loading={saving} />}>

      <FormSection title="Work details">
        {shops.length > 0 && (
          <OptionChips
            label="Shop" required={!isEdit} options={shopNames} value={selectedShop} allowClear={false}
            error={errors.shop} onChange={name => { setShopId(shops.find(s => s.Name === name)?._id || ''); setErrors(e => ({ ...e, shop: null })); }}
          />
        )}
        <OptionChips
          label="Work type" required options={WORK_TYPES.map(w => w.label)}
          value={WORK_TYPES.find(w => w.value === workType)?.label} allowClear={false}
          onChange={l => setWorkType(WORK_TYPES.find(w => w.label === l)?.value || 'service')}
        />
        <DateTimeField label="Work date" value={workDate} onChange={setWorkDate} />
        <FormField
          label="Title" required value={title} onChangeText={t => { setTitle(t); setErrors(e => ({ ...e, title: null })); }}
          error={errors.title} maxLength={120} showCounter placeholder="e.g. Stage 2 tune and exhaust" autoCapitalize="sentences"
        />
        <FormField
          label="Description" value={description} onChangeText={setDescription} multiline
          placeholder="What was done?" autoCapitalize="sentences"
        />
        <FormField label="Cost (₹)" value={cost} onChangeText={setCost} keyboardType="decimal-pad" error={errors.cost} placeholder="0" />
        <FormField label="Mileage at work (km)" value={mileage} onChangeText={setMileage} keyboardType="number-pad" error={errors.mileage} placeholder="0" />
      </FormSection>

      <FormSection title="Parts used">
        {parts.map((p, i) => (
          <View key={i} style={[styles.partBox, { borderColor: c.divider }]}>
            <FormField label="Part name" value={p.Name} onChangeText={t => updatePart(i, 'Name', t)} placeholder="Part name" autoCapitalize="sentences" />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <FormField containerStyle={{ flex: 1 }} label="Brand" value={p.Brand} onChangeText={t => updatePart(i, 'Brand', t)} placeholder="Brand" autoCapitalize="words" />
              <FormField containerStyle={{ width: 90 }} label="Qty" value={p.Quantity} onChangeText={t => updatePart(i, 'Quantity', t.replace(/[^0-9]/g, ''))} keyboardType="number-pad" />
            </View>
            <TouchableOpacity onPress={() => removePart(i)} style={styles.removePart}>
              <Feather name="trash-2" size={14} color={c.danger} />
              <Text style={{ color: c.danger, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, fontSize: 13 }}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={() => setParts(p => [...p, emptyPart()])} style={styles.addPart}>
          <Feather name="plus" size={16} color={accent} />
          <Text style={{ color: accent, fontFamily: FONTS_FAMILY.SourceSans3_Bold }}>Add part</Text>
        </TouchableOpacity>
      </FormSection>

      <FormSection title="Photos" hint="Up to 5 images, 10 MB each">
        <MultiImagePicker
          existing={existingImages} images={images} max={5}
          onChangeExisting={setExistingImages} onChangeImages={setImages}
        />
      </FormSection>

      <FormSection>
        <Toggle label="Spec updates" hint="Optional · updates the car's specs" open={showSpec} onPress={() => setShowSpec(o => !o)} />
        {showSpec && (
          <View style={{ marginTop: 12 }}>
            {SPEC_NUMBER_FIELDS.map(({ key, label }) => (
              <FormField key={key} label={label} keyboardType="number-pad" value={spec[key] === undefined || spec[key] === null ? '' : String(spec[key])} onChangeText={t => setSpec(s => ({ ...s, [key]: t }))} />
            ))}
            {SPEC_TEXT_FIELDS.map(({ key, label }) => (
              <FormField key={key} label={label} autoCapitalize="sentences" value={spec[key] ?? ''} onChangeText={t => setSpec(s => ({ ...s, [key]: t }))} />
            ))}
          </View>
        )}
      </FormSection>

      <FormSection>
        <Toggle label="Add modifications" hint="Optional · added to the car's mod list" open={showMods} onPress={() => setShowMods(o => !o)} />
        {showMods && (
          <View style={{ marginTop: 12 }}>
            {MOD_GROUPS.map(({ key, label }) => (
              <ChipInput key={key} label={label} items={mods[key]} onChange={arr => setMods(m => ({ ...m, [key]: arr }))} />
            ))}
          </View>
        )}
      </FormSection>
    </FormScreen>
  );
};

const styles = StyleSheet.create({
  toggle: { flexDirection: 'row', alignItems: 'center' },
  toggleTitle: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  toggleHint: { fontSize: 12, marginTop: 2, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  partBox: { borderWidth: 1, borderRadius: 14, padding: 10, marginBottom: 10 },
  removePart: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-end', paddingVertical: 4 },
  addPart: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 },
});

export default ServiceRecordForm;
