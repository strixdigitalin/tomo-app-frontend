import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeIn,
  ZoomIn,
} from 'react-native-reanimated';
import { FONTS_FAMILY } from '../../assets/Fonts';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { THEMES } from '../../redux/reducer/theme';
import LinearGradient from 'react-native-linear-gradient';

const ChooseMusicScreen = ({ navigation, route }) => {
  // ✅ GET THEME STATE
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  
  // ✅ GET CURRENT THEME COLORS
  const currentTheme = THEMES[selectedColorTheme] || THEMES.default;
  const primaryColor = currentTheme.primary;
  const secondaryColor = currentTheme.secondary;

  const [activeTab, setActiveTab] = useState('foryou'); // foryou, trending, saved
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ DUMMY MUSIC DATA (Replace with your API data)
  const [musicData, setMusicData] = useState({
    foryou: [
      {
        id: '1',
        title: 'Mere Raghuvar Tu Hi Sahara Hai',
        artist: 'RJ Shivam',
        duration: '3:58',
        cover: 'https://i.scdn.co/image/ab67616d0000b273e5e5e5e5e5e5e5e5e5e5e5e5',
        isSaved: false,
      },
      {
        id: '2',
        title: 'Zindagi Ek Safar Hai Suhana',
        artist: 'Rahul Jain',
        duration: '2:11',
        cover: 'https://i.scdn.co/image/ab67616d0000b273f1f1f1f1f1f1f1f1f1f1f1f1',
        isSaved: false,
      },
      {
        id: '3',
        title: 'Aesi Kripa Karo-Lofi',
        artist: 'Pawan Brijwasi',
        duration: '6:59',
        cover: 'https://i.scdn.co/image/ab67616d0000b273a1a1a1a1a1a1a1a1a1a1a1a1',
        isSaved: false,
      },
      {
        id: '4',
        title: 'Mangal Bhavan Amangal Haari',
        artist: 'medi tuner',
        duration: '2:28',
        cover: 'https://i.scdn.co/image/ab67616d0000b273b2b2b2b2b2b2b2b2b2b2b2b2',
        isSaved: false,
      },
      {
        id: '5',
        title: 'Udaarian',
        artist: 'Satinder Maan',
        duration: '4:52',
        cover: 'https://i.scdn.co/image/ab67616d0000b273c3c3c3c3c3c3c3c3c3c3c3c3',
        isSaved: false,
      },
    ],
    trending: [
      {
        id: '6',
        title: 'Veer Hanumana-Lofi',
        artist: 'Pawan Brijwasi',
        duration: '3:57',
        cover: 'https://i.scdn.co/image/ab67616d0000b273d4d4d4d4d4d4d4d4d4d4d4d4',
        isSaved: false,
      },
      {
        id: '7',
        title: 'Radha Naam Jap',
        artist: 'Om Namoh Bhagwate',
        duration: '14:11',
        cover: 'https://i.scdn.co/image/ab67616d0000b273e6e6e6e6e6e6e6e6e6e6e6e6',
        isSaved: false,
      },
    ],
    saved: [],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    },
    header: {
      paddingTop: 50,
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: FONTS_FAMILY.Poppins_SemiBold,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1A1A1A' : '#F5F5F5',
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 46,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      fontFamily: FONTS_FAMILY.Poppins_Regular,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginLeft: 8,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 12,
      marginBottom: 16,
    },
    tabButton: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDarkMode ? '#1A1A1A' : '#F5F5F5',
    },
    activeTabButton: {
      backgroundColor: isDarkMode ? '#FFFFFF' : '#000000',
    },
    tabText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.Poppins_Medium,
      color: isDarkMode ? '#999999' : '#666666',
    },
    activeTabText: {
      color: isDarkMode ? '#000000' : '#FFFFFF',
    },
    spotifyBanner: {
      backgroundColor: isDarkMode ? '#1A1A1A' : '#F5F5F5',
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    spotifyIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDarkMode ? '#2A2A2A' : '#E5E5E5',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    spotifyTextContainer: {
      flex: 1,
    },
    spotifyTitle: {
      fontSize: 15,
      fontFamily: FONTS_FAMILY.Poppins_SemiBold,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 4,
    },
    spotifySubtitle: {
      fontSize: 12,
      fontFamily: FONTS_FAMILY.Poppins_Regular,
      color: isDarkMode ? '#999999' : '#666666',
    },
    spotifyLink: {
      fontSize: 12,
      fontFamily: FONTS_FAMILY.Poppins_Medium,
      color: primaryColor,
    },
    closeButton: {
      padding: 4,
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 100,
    },
    songItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#1A1A1A' : '#F0F0F0',
    },
    songCover: {
      width: 56,
      height: 56,
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#2A2A2A' : '#E5E5E5',
      marginRight: 12,
    },
    songInfo: {
      flex: 1,
    },
    songTitle: {
      fontSize: 15,
      fontFamily: FONTS_FAMILY.Poppins_Medium,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 4,
    },
    songMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    trendingIcon: {
      marginRight: 4,
    },
    songArtist: {
      fontSize: 13,
      fontFamily: FONTS_FAMILY.Poppins_Regular,
      color: isDarkMode ? '#999999' : '#666666',
    },
    songDuration: {
      fontSize: 13,
      fontFamily: FONTS_FAMILY.Poppins_Regular,
      color: isDarkMode ? '#999999' : '#666666',
    },
    saveButton: {
      padding: 8,
      marginLeft: 8,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    emptyStateText: {
      fontSize: 15,
      fontFamily: FONTS_FAMILY.Poppins_Regular,
      color: isDarkMode ? '#666666' : '#999999',
      marginTop: 12,
    },
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#1A1A1A' : '#F0F0F0',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: 24,
    },
    selectedSongContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    selectedSongCover: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#2A2A2A' : '#E5E5E5',
      marginRight: 12,
    },
    selectedSongInfo: {
      flex: 1,
    },
    selectedSongTitle: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.Poppins_Medium,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 2,
    },
    selectedSongArtist: {
      fontSize: 12,
      fontFamily: FONTS_FAMILY.Poppins_Regular,
      color: isDarkMode ? '#999999' : '#666666',
    },
    addButton: {
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButtonText: {
      fontSize: 15,
      fontFamily: FONTS_FAMILY.Poppins_SemiBold,
      color: '#FFFFFF',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  // ✅ HANDLE SONG SELECTION
  const handleSelectSong = (song) => {
    setSelectedSong(song);
  };

  // ✅ HANDLE SAVE/UNSAVE SONG
  const handleToggleSave = (songId) => {
    setMusicData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(song => 
        song.id === songId 
          ? { ...song, isSaved: !song.isSaved }
          : song
      ),
    }));

    // Also update saved list
    const song = musicData[activeTab].find(s => s.id === songId);
    if (song) {
      setMusicData(prev => {
        const isAlreadySaved = prev.saved.some(s => s.id === songId);
        return {
          ...prev,
          saved: isAlreadySaved
            ? prev.saved.filter(s => s.id !== songId)
            : [...prev.saved, { ...song, isSaved: true }],
        };
      });
    }
  };

  // ✅ HANDLE ADD SONG AS SONG OF THE DAY
  const handleAddSong = () => {
    if (selectedSong) {
      // Navigate back or perform action (e.g., set song of day in profile)
      console.log('Song of the Day:', selectedSong);
      navigation.goBack();
      // You can pass the selected song back to the profile screen via route params
      // route.params?.onSelectSong?.(selectedSong);
    }
  };

  // ✅ FILTER SONGS BASED ON SEARCH
  const filteredSongs = musicData[activeTab].filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ RENDER SONG ITEM
  const renderSongItem = ({ item, index }) => (
    <Animated.View entering={FadeInDown.duration(300).delay(index * 50)}>
      <TouchableOpacity
        style={[
          styles.songItem,
          selectedSong?.id === item.id && {
            backgroundColor: isDarkMode ? '#1A1A1A' : '#F5F5F5',
            borderRadius: 12,
            marginVertical: 4,
            paddingHorizontal: 12,
          }
        ]}
        onPress={() => handleSelectSong(item)}
        activeOpacity={0.7}
      >
        <Image 
          source={{ uri: item.cover }} 
          style={styles.songCover}
        />
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.songMeta}>
            {activeTab === 'trending' && (
              <Ionicons 
                name="trending-up" 
                size={14} 
                color={primaryColor} 
                style={styles.trendingIcon}
              />
            )}
            <Text style={styles.songArtist} numberOfLines={1}>
              {item.artist} • {item.duration}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleToggleSave(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={item.isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={item.isSaved ? primaryColor : (isDarkMode ? '#666666' : '#999999')}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={false}
        backgroundColor={isDarkMode ? '#000000' : '#FFFFFF'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDarkMode ? '#FFFFFF' : '#000000'}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Music</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather 
            name="search" 
            size={18} 
            color={isDarkMode ? '#666666' : '#999999'} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={isDarkMode ? '#666666' : '#999999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      {/* Tabs */}
      <Animated.View entering={FadeInDown.duration(300).delay(100)}>
        <View style={styles.tabContainer}>
          {['foryou', 'trending', 'saved'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab === 'foryou' ? 'For you' : tab === 'trending' ? 'Trending' : 'Saved'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Spotify Link Banner (Only on "For you" tab) */}
     

      {/* Song List */}
      <FlatList
        data={filteredSongs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons
              name="music-note"
              size={64}
              color={isDarkMode ? '#2A2A2A' : '#E5E5E5'}
            />
            <Text style={styles.emptyStateText}>
              {activeTab === 'saved' 
                ? 'No saved songs yet' 
                : searchQuery 
                ? 'No songs found' 
                : 'No songs available'}
            </Text>
          </View>
        }
      />

      {/* Bottom Bar with Selected Song */}
      {selectedSong && (
        <Animated.View 
          entering={ZoomIn.duration(300).springify()}
          style={styles.bottomBar}
        >
          <View style={styles.selectedSongContainer}>
            <Image 
              source={{ uri: selectedSong.cover }} 
              style={styles.selectedSongCover}
            />
            <View style={styles.selectedSongInfo}>
              <Text style={styles.selectedSongTitle} numberOfLines={1}>
                {selectedSong.title}
              </Text>
              <Text style={styles.selectedSongArtist} numberOfLines={1}>
                {selectedSong.artist}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleAddSong}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[primaryColor, secondaryColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Add as Song of the Day</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default ChooseMusicScreen;