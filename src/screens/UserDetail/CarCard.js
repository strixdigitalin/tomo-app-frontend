import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { profilePalette } from './profileTheme';

const list = v => (Array.isArray(v) && v.length ? v.join(', ') : null);

const Row = ({ label, value, c }) =>
  value ? (
    <View style={styles.specRow}>
      <Text style={[styles.specLabel, { color: c.muted }]}>{label}</Text>
      <Text style={[styles.specValue, { color: c.text }]}>{String(value)}</Text>
    </View>
  ) : null;

const Section = ({ title, children, c }) => (
  <View style={{ marginTop: 14 }}>
    <Text style={[styles.sectionTitle, { color: c.text }]}>{title}</Text>
    {children}
  </View>
);

// A user's car (web: Profile/Car/CurrentCar.jsx): photo, PRIMARY badge, rating bar,
// build stage + price, "Show more" specs, and Update / Delete (own) or Rate (others).
const CarCard = ({ car, isOther, isDark, accent, onEdit, onDelete, onRate }) => {
  const c = profilePalette(isDark, accent);
  const [open, setOpen] = useState(false);
  const v = car?.VehicleInfo || {};
  const p = car?.Power || {};
  const m = car?.Modifications || {};
  const s = car?.Style || {};
  const st = car?.Status || {};
  const perf = car?.PerformanceStats || {};
  const rating = Math.min(Math.max(Number(car?.avgRating) || 0, 0), 5);

  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, shadowColor: accent }]}>
      <View style={styles.imageWrap}>
        {car?.Image ? (
          <Image source={{ uri: car.Image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.noImage, { backgroundColor: c.chip }]}>
            <MaterialCommunityIcons name="car-sports" size={56} color={c.muted} />
          </View>
        )}
        {!!car?.PrimaryCar && (
          <View style={[styles.primaryBadge, { backgroundColor: accent }]}>
            <Feather name="star" size={11} color="#fff" />
            <Text style={styles.primaryText}>Primary</Text>
          </View>
        )}
      </View>

      <View style={{ padding: 14 }}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>{v.vehicleName || 'My car'}</Text>
          {isOther ? (
            <TouchableOpacity style={[styles.smallBtn, { borderColor: accent }]} onPress={() => onRate(car)}>
              <Feather name="star" size={13} color={accent} />
              <Text style={[styles.smallBtnText, { color: accent }]}>Rate</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={[styles.iconBtn, { backgroundColor: accent + '1A' }]} onPress={() => onEdit(car)}>
                <Feather name="edit-2" size={15} color={accent} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconBtn, { backgroundColor: c.danger + '1A' }]} onPress={() => onDelete(car)}>
                <Feather name="trash-2" size={15} color={c.danger} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.ratingRow}>
          <View style={[styles.ratingTrack, { backgroundColor: c.chip }]}>
            <View style={[styles.ratingFill, { width: `${(rating / 5) * 100}%`, backgroundColor: '#0EA5E9' }]} />
          </View>
          <Text style={[styles.ratingText, { color: c.muted }]}>{rating ? rating.toFixed(1) : 'New'}</Text>
        </View>

        <Text style={[styles.sub, { color: c.muted }]}>
          {[v.make, v.model].filter(Boolean).join(' ')}{v.year ? ` • ${v.year}` : ''}
        </Text>

        <View style={styles.metaRow}>
          {!!st.buildStage && (
            <View style={[styles.metaChip, { backgroundColor: c.chip }]}>
              <Text style={[styles.metaText, { color: c.text }]}>Build: {st.buildStage}</Text>
            </View>
          )}
          {!!car?.CurrentPrice && (
            <View style={[styles.metaChip, { backgroundColor: accent + '1A' }]}>
              <Text style={[styles.metaText, { color: accent }]}>₹{Number(car.CurrentPrice).toLocaleString('en-IN')}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={() => setOpen(o => !o)} style={styles.moreBtn} activeOpacity={0.7}>
          <Text style={[styles.moreText, { color: accent }]}>{open ? 'Show less' : 'Show more'}</Text>
          <Feather name={open ? 'chevron-up' : 'chevron-down'} size={16} color={accent} />
        </TouchableOpacity>

        {open && (
          <View>
            <Section title="Vehicle" c={c}>
              <Row label="Vehicle" value={v.vehicleName} c={c} />
              <Row label="Make" value={v.make} c={c} />
              <Row label="Model" value={v.model} c={c} />
              <Row label="Year" value={v.year} c={c} />
              <Row label="Body type" value={v.bodyType} c={c} />
            </Section>
            <Section title="Power" c={c}>
              <Row label="Engine" value={p.engine} c={c} />
              <Row label="HP / Torque" value={p.horsepower || p.torque ? `${p.horsepower ?? '-'} HP / ${p.torque ?? '-'} lb-ft` : null} c={c} />
              <Row label="Drivetrain" value={p.drivetrain} c={c} />
              <Row label="Transmission" value={p.transmission} c={c} />
            </Section>
            <Section title="Modifications" c={c}>
              <Row label="Performance" value={list(m.performance)} c={c} />
              <Row label="Suspension" value={list(m.suspension)} c={c} />
              <Row label="Brakes" value={list(m.brakes)} c={c} />
            </Section>
            <Section title="Style" c={c}>
              <Row label="Paint / Wrap" value={s.paintWrap} c={c} />
              <Row label="Exterior" value={list(s.exteriorMods)} c={c} />
              <Row label="Interior" value={list(s.interiorMods)} c={c} />
            </Section>
            <Section title="Status" c={c}>
              <Row label="Mileage" value={st.mileage ? `${Number(st.mileage).toLocaleString()} miles` : null} c={c} />
              <Row label="Build stage" value={st.buildStage} c={c} />
              <Row label="0–60" value={perf.zeroToSixty} c={c} />
              <Row label="1/4 mile" value={perf.quarterMile} c={c} />
            </Section>
            {!!car?.OwnerNote && (
              <Section title="Owner note" c={c}>
                <View style={[styles.note, { backgroundColor: c.chip }]}>
                  <Text style={[styles.noteText, { color: c.text }]}>{car.OwnerNote}</Text>
                </View>
              </Section>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { marginHorizontal: 12, marginBottom: 14, borderRadius: 22, borderWidth: 1, overflow: 'hidden', elevation: 3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10 },
  imageWrap: { height: 190, backgroundColor: '#1F2937' },
  noImage: { alignItems: 'center', justifyContent: 'center' },
  primaryBadge: { position: 'absolute', left: 12, top: 12, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  primaryText: { color: '#fff', fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textTransform: 'uppercase' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { flex: 1, fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginRight: 8 },
  iconBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  smallBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  smallBtnText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  ratingTrack: { width: 110, height: 8, borderRadius: 4, overflow: 'hidden' },
  ratingFill: { height: '100%', borderRadius: 4 },
  ratingText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  sub: { fontSize: 14, marginTop: 8, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  metaChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  metaText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  moreBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 12, gap: 4 },
  moreText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  sectionTitle: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginBottom: 6 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  specLabel: { flex: 1, fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  specValue: { flex: 1.4, fontSize: 13, textAlign: 'right', fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  note: { padding: 12, borderRadius: 12 },
  noteText: { fontSize: 14, lineHeight: 20, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default CarCard;
