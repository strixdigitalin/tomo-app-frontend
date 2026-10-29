import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import { profilePalette } from './profileTheme';

const COVER_H = 190;

const Stat = ({ value, label, onPress, c }) => (
  <TouchableOpacity style={styles.stat} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
    <Text style={[styles.statValue, { color: c.text }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: c.muted }]}>{label}</Text>
  </TouchableOpacity>
);

const Chip = ({ icon, label, c }) =>
  label ? (
    <View style={[styles.chip, { backgroundColor: c.chip }]}>
      <Feather name={icon} size={12} color={c.muted} />
      <Text style={[styles.chipText, { color: c.muted }]} numberOfLines={1}>{label}</Text>
    </View>
  ) : null;

// Cover + avatar + identity + stats + actions for both own and other-user profiles
// (web: Pages/Profile/UserProfile.jsx and Pages/AllUsers/User.jsx).
const ProfileHeader = ({
  user, isOther, isDark, accent, secondary, postsCount,
  followState, // 'follow' | 'requested' | 'following'
  joined, activity, location, topInset,
  onBack, onSettings, onEditCover, onEditAvatar, onEditProfile, onUpdateLocation,
  onFollow, onMessage, onFollowers, onFollowing,
}) => {
  const c = profilePalette(isDark, accent);

  return (
    <View>
      {/* Cover */}
      <View style={{ height: COVER_H }}>
        {user?.CoverImage ? (
          <Image source={{ uri: user.CoverImage }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <LinearGradient colors={[accent, secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        )}
        <LinearGradient colors={['rgba(0,0,0,0.45)', 'transparent', 'rgba(0,0,0,0.25)']} style={StyleSheet.absoluteFill} />

        <View style={[styles.topBar, { paddingTop: topInset }]}>
          {onBack ? (
            <TouchableOpacity style={styles.roundBtn} onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
          ) : <View />}
          {!isOther ? (
            <TouchableOpacity style={styles.roundBtn} onPress={onSettings} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="settings" size={18} color="#fff" />
            </TouchableOpacity>
          ) : <View />}
        </View>

        {!isOther && (
          <TouchableOpacity style={[styles.coverEdit]} onPress={onEditCover}>
            <Feather name="camera" size={14} color="#fff" />
            <Text style={styles.coverEditText}>Cover</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Identity card (overlaps the cover) */}
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, shadowColor: accent }]}>
        <View style={styles.avatarRow}>
          <View style={[styles.avatarRing, { borderColor: accent, backgroundColor: c.card }]}>
            <Image source={user?.Image ? { uri: user.Image } : IMG.MessageProfile} style={styles.avatar} />
            {!isOther && (
              <TouchableOpacity style={[styles.avatarEdit, { backgroundColor: accent, borderColor: c.card }]} onPress={onEditAvatar}>
                <Feather name="camera" size={12} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.actions}>
            {isOther ? (
              <>
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: followState === 'follow' ? accent : c.chip }]}
                  onPress={onFollow}
                  disabled={followState !== 'follow'}
                  activeOpacity={0.85}>
                  <Feather
                    name={followState === 'following' ? 'check' : followState === 'requested' ? 'clock' : 'user-plus'}
                    size={14}
                    color={followState === 'follow' ? '#fff' : c.text}
                  />
                  <Text style={[styles.primaryBtnText, { color: followState === 'follow' ? '#fff' : c.text }]}>
                    {followState === 'following' ? 'Following' : followState === 'requested' ? 'Requested' : 'Follow'}
                  </Text>
                </TouchableOpacity>
                {!!onMessage && (
                  <TouchableOpacity style={[styles.ghostBtn, { borderColor: accent }]} onPress={onMessage} activeOpacity={0.85}>
                    <Feather name="message-circle" size={14} color={accent} />
                    <Text style={[styles.primaryBtnText, { color: accent }]}>Message</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: accent }]} onPress={onEditProfile} activeOpacity={0.85}>
                <Feather name="edit-2" size={14} color="#fff" />
                <Text style={[styles.primaryBtnText, { color: '#fff' }]}>Edit profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>{user?.FullName || user?.UserName}</Text>
          <View style={[styles.privacyPill, { backgroundColor: accent + '1A' }]}>
            <Feather name={user?.PrivateProfile ? 'lock' : 'globe'} size={10} color={accent} />
            <Text style={[styles.privacyText, { color: accent }]}>{user?.PrivateProfile ? 'Private' : 'Public'}</Text>
          </View>
        </View>
        <Text style={[styles.username, { color: c.muted }]}>@{user?.UserName}</Text>

        <Text style={[styles.bio, { color: user?.Bio ? c.text : c.muted }]}>
          {user?.Bio || (isOther ? 'No bio yet.' : 'Tell the community about yourself.')}
        </Text>

        <View style={styles.chips}>
          <Chip icon="calendar" label={joined && `Joined ${joined}`} c={c} />
          <Chip icon="clock" label={activity && `Active ${activity}`} c={c} />
          <Chip icon="map-pin" label={location} c={c} />
        </View>

        {!isOther && (
          <TouchableOpacity onPress={onUpdateLocation} style={styles.locLink} activeOpacity={0.7}>
            <Feather name="navigation" size={12} color={accent} />
            <Text style={[styles.locLinkText, { color: accent }]}>Update location</Text>
          </TouchableOpacity>
        )}

        <View style={[styles.statsRow, { borderTopColor: c.divider }]}>
          {postsCount !== null && postsCount !== undefined && (
            <>
              <Stat value={postsCount} label="Posts" c={c} />
              <View style={[styles.vDivider, { backgroundColor: c.divider }]} />
            </>
          )}
          <Stat value={user?.Follower?.length || 0} label="Followers" onPress={onFollowers} c={c} />
          <View style={[styles.vDivider, { backgroundColor: c.divider }]} />
          <Stat value={user?.Following?.length || 0} label="Following" onPress={onFollowing} c={c} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  roundBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  coverEdit: { position: 'absolute', right: 14, bottom: 52, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  coverEditText: { color: '#fff', fontSize: 12, marginLeft: 6, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  card: {
    marginHorizontal: 12, marginTop: -40, borderRadius: 24, borderWidth: 1, padding: 16,
    elevation: 4, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.14, shadowRadius: 14,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -52 },
  avatarRing: { padding: 3, borderRadius: 54, borderWidth: 2 },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  avatarEdit: { position: 'absolute', right: -2, bottom: 2, width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 4 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, gap: 6 },
  ghostBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, gap: 6 },
  primaryBtnText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  name: { fontSize: 22, fontFamily: FONTS_FAMILY.SourceSans3_Bold, flexShrink: 1 },
  privacyPill: { flexDirection: 'row', alignItems: 'center', marginLeft: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, gap: 4 },
  privacyText: { fontSize: 10, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textTransform: 'uppercase' },
  username: { fontSize: 14, marginTop: 1, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  bio: { fontSize: 14, lineHeight: 20, marginTop: 10, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, gap: 5, maxWidth: '100%' },
  chipText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  locLink: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 6 },
  locLinkText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  statLabel: { fontSize: 12, marginTop: 1, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  vDivider: { width: 1, height: 28 },
});

export default ProfileHeader;
