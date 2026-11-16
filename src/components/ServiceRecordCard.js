import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';
import FormField from './FormField';
import ConfirmModal from './ConfirmModal';
import { ToastMsg } from '../utils/helperFunctions';
import {
  MOD_GROUPS, SPEC_LABELS, STATUS_COLORS, fmtDate, fmtMoney, capitalize, carName,
} from '../utils/serviceRecords';

const Chips = ({ label, items, accent }) =>
  items?.length ? (
    <View style={{ marginTop: 6 }}>
      <Text style={styles.chipLabel}>{label}</Text>
      <View style={styles.chipRow}>
        {items.map((it, i) => (
          <View key={`${it}-${i}`} style={[styles.chip, { backgroundColor: accent + '1A' }]}>
            <Text style={[styles.chipText, { color: accent }]}>{it}</Text>
          </View>
        ))}
      </View>
    </View>
  ) : null;

// One service record. Used in two places:
//   seller list  (showCar + onEdit / onDelete — approved records are locked)
//   owner history (onApprove / onReject while the record is pending)
const ServiceRecordCard = ({ record, showCar = false, onEdit, onDelete, onApprove, onReject, busy = false }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null); // null | 'approve' | 'reject'
  const [reason, setReason] = useState('');
  const [preview, setPreview] = useState(null);

  const info = record?.Car?.VehicleInfo || {};
  const status = record?.Status || 'pending';
  const tone = STATUS_COLORS[status] || c.muted;
  const specEntries = Object.entries(record?.SpecUpdates || {}).filter(
    ([k, v]) => SPEC_LABELS[k] && v !== undefined && v !== null && v !== '',
  );
  const hasMods = MOD_GROUPS.some(g => record?.AddModifications?.[g.key]?.length);
  const modifiable = status !== 'approved';
  const canOwnerAct = status === 'pending' && (onApprove || onReject);

  const closeMode = () => { setMode(null); setReason(''); };
  const submitReject = () => {
    if (!reason.trim()) return ToastMsg('Please enter a reason');
    onReject?.(record._id, reason.trim());
    closeMode();
  };

  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, shadowColor: accent }]}>
      <View style={styles.top}>
        {showCar && (
          record?.Car?.Image ? (
            <Image source={{ uri: record.Car.Image }} style={styles.carImg} />
          ) : (
            <View style={[styles.carImg, styles.carImgEmpty, { backgroundColor: c.chip }]}>
              <Feather name="tool" size={20} color={c.muted} />
            </View>
          )
        )}
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>{record?.Title}</Text>
            <View style={[styles.status, { backgroundColor: tone + '22' }]}>
              <Text style={[styles.statusText, { color: tone }]}>{status}</Text>
            </View>
          </View>
          {showCar && (
            <Text style={[styles.sub, { color: c.muted }]} numberOfLines={1}>
              {carName(record?.Car)}{info.year ? ` · ${info.year}` : ''}
            </Text>
          )}
          <View style={styles.metaRow}>
            <View style={[styles.chip, { backgroundColor: accent + '1A' }]}>
              <Text style={[styles.chipText, { color: accent }]}>{capitalize(record?.WorkType)}</Text>
            </View>
            <Text style={[styles.meta, { color: c.muted }]}>{fmtDate(record?.WorkDate)}</Text>
            {record?.Cost > 0 && <Text style={[styles.meta, { color: c.text, fontFamily: FONTS_FAMILY.SourceSans3_Bold }]}>{fmtMoney(record.Cost)}</Text>}
            {record?.MileageAtWork > 0 && <Text style={[styles.meta, { color: c.muted }]}>{Number(record.MileageAtWork).toLocaleString('en-IN')} km</Text>}
          </View>
        </View>
      </View>

      {!showCar && !!record?.Description && (
        <Text style={[styles.desc, { color: c.text }]}>{record.Description}</Text>
      )}

      {status === 'rejected' && !!record?.RejectionReason && (
        <View style={[styles.reject, { backgroundColor: c.danger + '14' }]}>
          <Feather name="alert-circle" size={15} color={c.danger} />
          <Text style={[styles.rejectText, { color: c.danger }]}>Rejected: {record.RejectionReason}</Text>
        </View>
      )}

      <View style={[styles.footer, { borderTopColor: c.divider }]}>
        <TouchableOpacity onPress={() => setOpen(o => !o)} style={styles.detailsBtn} activeOpacity={0.7}>
          <Text style={[styles.detailsText, { color: c.muted }]}>{open ? 'Hide details' : 'View details'}</Text>
          <Feather name={open ? 'chevron-up' : 'chevron-down'} size={16} color={c.muted} />
        </TouchableOpacity>

        {(onEdit || onDelete) && (
          modifiable ? (
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {!!onEdit && (
                <TouchableOpacity style={[styles.act, { backgroundColor: accent + '1A' }]} onPress={() => onEdit(record)}>
                  <Feather name="edit-2" size={14} color={accent} />
                  <Text style={[styles.actText, { color: accent }]}>Edit</Text>
                </TouchableOpacity>
              )}
              {!!onDelete && (
                <TouchableOpacity style={[styles.act, { backgroundColor: c.danger + '1A' }]} onPress={() => onDelete(record)}>
                  <Feather name="trash-2" size={14} color={c.danger} />
                  <Text style={[styles.actText, { color: c.danger }]}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Text style={[styles.meta, { color: c.muted }]}>Approved records are locked</Text>
          )
        )}
      </View>

      {open && (
        <View style={[styles.details, { borderTopColor: c.divider }]}>
          {showCar && !!record?.Description && <Text style={[styles.desc, { color: c.text, paddingHorizontal: 0 }]}>{record.Description}</Text>}

          {record?.PartsUsed?.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.h, { color: c.text }]}>Parts used</Text>
              {record.PartsUsed.map((p, i) => (
                <View key={p?._id || i} style={[styles.partRow, { borderBottomColor: c.divider }]}>
                  <Text style={[styles.partName, { color: c.text }]} numberOfLines={1}>
                    {p?.Name}{p?.Brand ? <Text style={{ color: c.muted }}> · {p.Brand}</Text> : null}
                  </Text>
                  <Text style={{ color: c.muted, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold }}>× {p?.Quantity}</Text>
                </View>
              ))}
            </View>
          )}

          {specEntries.length > 0 && (
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.h, { color: c.text }]}>Spec updates</Text>
              <View style={styles.specGrid}>
                {specEntries.map(([k, v]) => (
                  <View key={k} style={[styles.specBox, { backgroundColor: c.chip }]}>
                    <Text style={[styles.specLabel, { color: c.muted }]}>{SPEC_LABELS[k][0]}</Text>
                    <Text style={[styles.specValue, { color: c.text }]}>
                      {typeof v === 'number' ? v.toLocaleString('en-IN') : v}{SPEC_LABELS[k][1]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {hasMods && (
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.h, { color: c.text }]}>Modifications</Text>
              {MOD_GROUPS.map(g => <Chips key={g.key} label={g.label} items={record?.AddModifications?.[g.key]} accent={accent} />)}
            </View>
          )}

          {record?.Images?.length > 0 && (
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.h, { color: c.text }]}>Photos</Text>
              <View style={styles.chipRow}>
                {record.Images.map(url => (
                  <TouchableOpacity key={url} onPress={() => setPreview(url)} activeOpacity={0.85}>
                    <Image source={{ uri: url }} style={styles.photo} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <Text style={[styles.meta, { color: c.muted, marginTop: 12 }]}>
            Added {fmtDate(record?.createdAt)}{record?.ApprovedAt ? ` · Approved ${fmtDate(record.ApprovedAt)}` : ''}
          </Text>
        </View>
      )}

      {canOwnerAct && (
        <View style={[styles.ownerBar, { backgroundColor: c.chip, borderTopColor: c.divider }]}>
          {mode === 'reject' ? (
            <View>
              <FormField
                value={reason} onChangeText={setReason} multiline maxLength={300} showCounter
                placeholder="Reason for rejection (required)" autoCapitalize="sentences"
              />
              <View style={styles.ownerBtns}>
                <TouchableOpacity style={[styles.ownerBtn, { borderColor: c.divider, borderWidth: 1 }]} onPress={closeMode} disabled={busy}>
                  <Text style={[styles.ownerBtnText, { color: c.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.ownerBtn, { backgroundColor: c.danger, opacity: busy ? 0.6 : 1 }]} onPress={submitReject} disabled={busy}>
                  <Text style={[styles.ownerBtnText, { color: '#fff' }]}>{busy ? 'Rejecting...' : 'Confirm reject'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.waitRow}>
              <View style={styles.waiting}>
                <Feather name="clock" size={14} color="#F59E0B" />
                <Text style={styles.waitingText}>Waiting for your approval</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={[styles.ownerBtn, { borderColor: c.danger, borderWidth: 1 }]} onPress={() => setMode('reject')} disabled={busy}>
                  <Feather name="x" size={14} color={c.danger} />
                  <Text style={[styles.ownerBtnText, { color: c.danger }]}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.ownerBtn, { backgroundColor: '#16A34A' }]} onPress={() => setMode('approve')} disabled={busy}>
                  <Feather name="check" size={14} color="#fff" />
                  <Text style={[styles.ownerBtnText, { color: '#fff' }]}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      <ConfirmModal
        visible={mode === 'approve'}
        onClose={closeMode}
        onConfirm={() => { onApprove?.(record._id); closeMode(); }}
        title="Approve this record?"
        message="Any spec changes and modifications in it will be applied to your car."
        icon="check-circle"
        confirmLabel="Approve"
        destructive={false}
        loading={busy}
      />

      <Modal visible={!!preview} transparent animationType="fade" onRequestClose={() => setPreview(null)} statusBarTranslucent>
        <TouchableOpacity style={styles.previewWrap} activeOpacity={1} onPress={() => setPreview(null)}>
          {!!preview && <Image source={{ uri: preview }} style={styles.previewImg} resizeMode="contain" />}
          <View style={styles.previewClose}><Feather name="x" size={22} color="#fff" /></View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { marginHorizontal: 12, marginBottom: 12, borderRadius: 20, borderWidth: 1, overflow: 'hidden', elevation: 2, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8 },
  top: { flexDirection: 'row', gap: 12, padding: 14 },
  carImg: { width: 62, height: 62, borderRadius: 14 },
  carImgEmpty: { alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { flex: 1, fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  status: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  sub: { fontSize: 13, marginTop: 2, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 8 },
  meta: { fontSize: 12.5, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  desc: { fontSize: 14, lineHeight: 20, paddingHorizontal: 14, paddingBottom: 12, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  chip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  chipText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  chipLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: '#94A3B8', marginBottom: 5, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reject: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginHorizontal: 14, marginBottom: 12, padding: 10, borderRadius: 12 },
  rejectText: { flex: 1, fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1 },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  detailsText: { fontSize: 13.5, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  act: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12 },
  actText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  details: { paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1 },
  h: { fontSize: 14.5, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginBottom: 6 },
  partRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: StyleSheet.hairlineWidth },
  partName: { flex: 1, marginRight: 10, fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  specGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  specBox: { width: '48%', padding: 10, borderRadius: 12 },
  specLabel: { fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 0.4, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  specValue: { fontSize: 14, marginTop: 2, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  photo: { width: 74, height: 74, borderRadius: 12 },
  ownerBar: { padding: 12, borderTopWidth: 1 },
  waitRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  waiting: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  waitingText: { fontSize: 12.5, color: '#D97706', fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  ownerBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  ownerBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  ownerBtnText: { fontSize: 13.5, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  previewWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' },
  previewImg: { width: '100%', height: '80%' },
  previewClose: { position: 'absolute', top: 50, right: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
});

export default ServiceRecordCard;
