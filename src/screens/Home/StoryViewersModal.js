import React, { useEffect, useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import { THEMES } from '../../redux/reducer/theme';
import { profilePalette } from '../UserDetail/profileTheme';

// Owner's view of a story: who viewed it, the reactions it got and the replies
// (web: StoryViewersModal + StoryReactionsModal + StoryRepliesModal, merged into one tabbed sheet)
//   viewers   → [{ _id, UserName, Image }]
//   reactions → [{ emoji, user: { UserName, Image } }]
//   replies   → [{ message, user: { UserName, Image } }]
const TABS = [
    { key: 'viewers', label: 'Viewers', icon: 'eye' },
    { key: 'reactions', label: 'Reactions', icon: 'smile' },
    { key: 'replies', label: 'Replies', icon: 'message-circle' },
];

const StoryViewModel = ({
    showViewers,
    closeViewersModal,
    storyViewers = [],
    reactions = [],
    replies = [],
    initialTab = 'viewers',
}) => {
    const insets = useSafeAreaInsets();
    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
    const c = profilePalette(isDarkMode, accent);
    const [tab, setTab] = useState(initialTab);

    useEffect(() => { if (showViewers) setTab(initialTab); }, [showViewers, initialTab]);

    const counts = { viewers: storyViewers.length, reactions: reactions.length, replies: replies.length };
    const data = tab === 'reactions' ? reactions : tab === 'replies' ? replies : storyViewers;

    const renderItem = ({ item }) => {
        const person = tab === 'viewers' ? item : item?.user;
        return (
            <View style={[styles.row, { backgroundColor: c.card, borderColor: c.border }]}>
                <Image source={person?.Image ? { uri: person.Image } : IMG.MessageProfile} style={[styles.avatar, { borderColor: accent }]} />
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={[styles.name, { color: c.text }]}>{person?.UserName || person?.FullName || 'User'}</Text>
                    {tab === 'replies' && <Text style={[styles.msg, { color: c.muted }]}>{item?.message}</Text>}
                </View>
                {tab === 'reactions' && <Text style={styles.emoji}>{item?.emoji}</Text>}
            </View>
        );
    };

    const empty = {
        viewers: ['No viewers yet', 'People who watch your story will show up here.'],
        reactions: ['No reactions yet', 'Reactions to your story will show up here.'],
        replies: ['No replies yet', 'Replies to your story will show up here.'],
    }[tab];

    return (
        <Modal visible={!!showViewers} transparent animationType="slide" onRequestClose={closeViewersModal} statusBarTranslucent>
            <View style={styles.overlay}>
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closeViewersModal} />
                <View style={[styles.sheet, { backgroundColor: c.screen, borderColor: c.border, paddingBottom: Math.max(insets.bottom, 12) }]}>
                    <View style={[styles.grabber, { backgroundColor: c.divider }]} />

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: c.text }]}>Story activity</Text>
                        <TouchableOpacity onPress={closeViewersModal} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Feather name="x" size={22} color={c.muted} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabs}>
                        {TABS.map(t => {
                            const active = t.key === tab;
                            return (
                                <TouchableOpacity
                                    key={t.key}
                                    onPress={() => setTab(t.key)}
                                    activeOpacity={0.85}
                                    style={[styles.tab, { backgroundColor: active ? accent : c.card, borderColor: active ? accent : c.border }]}>
                                    <Feather name={t.icon} size={14} color={active ? '#fff' : c.muted} />
                                    <Text style={[styles.tabText, { color: active ? '#fff' : c.text }]}>{t.label}</Text>
                                    <Text style={[styles.count, { color: active ? '#fff' : accent }]}>{counts[t.key]}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, i) => String(item?._id || item?.id || item?.user?._id || i)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 12, flexGrow: 1 }}
                        initialNumToRender={8}
                        windowSize={7}
                        ListEmptyComponent={
                            <View style={styles.empty}>
                                <Feather name={TABS.find(t => t.key === tab).icon} size={32} color={c.muted} />
                                <Text style={[styles.emptyTitle, { color: c.text }]}>{empty[0]}</Text>
                                <Text style={[styles.emptySub, { color: c.muted }]}>{empty[1]}</Text>
                            </View>
                        }
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.6)', justifyContent: 'flex-end' },
    sheet: { height: '70%', borderTopLeftRadius: 26, borderTopRightRadius: 26, borderTopWidth: 1 },
    grabber: { width: 44, height: 5, borderRadius: 3, alignSelf: 'center', marginTop: 10 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 12, paddingBottom: 8 },
    title: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 8 },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: 16, borderWidth: 1 },
    tabText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
    count: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
    avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 1.5 },
    name: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    msg: { fontSize: 13, marginTop: 2, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
    emoji: { fontSize: 24 },
    empty: { alignItems: 'center', paddingTop: 50, paddingHorizontal: 30 },
    emptyTitle: { fontSize: 16, marginTop: 12, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    emptySub: { fontSize: 13, marginTop: 4, textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default StoryViewModel;
