import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  Text,
  Alert,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Icon from 'react-native-vector-icons/Ionicons';
import { BASE_URL, getItem } from '../../utils/Apis';
import useLoader from '../../utils/LoaderHook';
import { ToastMsg } from '../../utils/helperFunctions';
import { MEDIA_RULES } from '../../utils/uploadHelpers';
import { ensureGalleryPermission, getGalleryAssets } from '../../utils/mediaPermission';
import PermissionNotice from '../../components/PermissionNotice';
import MusicSelector from '../../components/MusicSelector';
import MusicAudio from '../../components/MusicAudio';
import UploadProgressModal from '../../components/UploadProgressModal';
import { useUpload } from '../../utils/uploadWithProgress';
import Video from 'react-native-video';
import { SEGMENT_SECONDS, STORY_VIDEO, buildSegments, fmtTime, validateStoryVideo } from '../../utils/storyVideo';
import { useSelector } from 'react-redux';
import Row from '../../components/wrapper/row';
import { BackIcon, PrimaryBackArrow } from '../../assets/SVGs';
import { FONTS_FAMILY } from '../../assets/Fonts';
import CustomText from '../../components/TextComponent';
import { launchCamera } from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImageZoom from 'react-native-image-pan-zoom';
import ImagePicker from 'react-native-image-crop-picker';


const screenWidth = Dimensions.get('window').width;
const imageSize = screenWidth / 3 - 10;
const { width, height } = Dimensions.get('window');

const GalleryScreen = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  // optional music for the story: { music, start, duration } (web: AddStoryModel.jsx)
  const [music, setMusic] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('Photos');
  const [selectedImage, setSelectedImage] = useState(null);
  // video story: duration (s), playback position, whether it is playing, music sync point
  const [mediaType, setMediaType] = useState('image');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [musicSync, setMusicSync] = useState(0);
  const videoRef = useRef(null);
  const isVideo = mediaType === 'video';
  const segments = useMemo(() => (isVideo && videoDuration ? buildSegments(videoDuration) : []), [isVideo, videoDuration]);
  const activeSeg = segments.length ? Math.min(segments.length - 1, Math.floor(videoTime / SEGMENT_SECONDS)) : 0;
  const musicCoversSeg = i => !!music && i * SEGMENT_SECONDS < music.duration;
  const coveredStories = music ? segments.filter((_, i) => musicCoversSeg(i)).length : 0;
  const { isDarkMode } = useSelector(state => state.theme);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const upload = useUpload();

  useEffect(() => {
    const requestPermissionAndLoad = async () => {
      try {
        setErrorMsg('');
        // Ask for access, but don't trust the answer alone — some Android versions report
        // "denied" for partial access ("Select photos") even though reading works. Always try.
        const perm = await ensureGalleryPermission();
        try {
          const result = await getGalleryAssets(CameraRoll, { first: 50, assetType: 'Photos', include: ['fileSize'] });
          setPhotos(result.edges);
          let vids = [];
          try {
            const v = await getGalleryAssets(CameraRoll, { first: 50, assetType: 'Videos', include: ['fileSize', 'playableDuration'] });
            vids = v.edges;
            setVideos(vids);
          } catch (e) {
            console.log('Story videos load failed', e?.message);
          }
          if (result.edges.length === 0 && vids.length === 0) {
            if (!perm.granted) {
              setBlocked(perm.blocked);
              setErrorMsg('Allow gallery access to choose a photo or video for your story.');
            } else {
              setErrorMsg('No photos or videos found in gallery.');
            }
          }
        } catch (readError) {
          setBlocked(perm.blocked);
          setErrorMsg('Allow gallery access to choose a photo or video for your story.');
        }
      } catch (error) {
        setErrorMsg(error.message || 'Something went wrong');
      }
    };

    requestPermissionAndLoad();
  }, [retryKey]);

  const onSubmit = async (selectedImage) => {
    try {
      const token = await getItem('token');
      showLoader();

      if (!selectedImage) {
        ToastMsg('No image selected');
        hideLoader();
        return;
      }

      const fileName = selectedImage.split('/').pop();
      const formData = new FormData();
      formData.append('type', isVideo ? 'video' : 'image');
      const isMov = /\.mov$/i.test(fileName || '');
      formData.append('file', {
        uri: Platform.OS === 'android' ? selectedImage : selectedImage.replace('file://', ''),
        type: isVideo ? (isMov ? 'video/quicktime' : 'video/mp4') : 'image/jpeg',
        name: fileName || (isVideo ? 'upload.mp4' : 'upload.jpg'),
      });
      // the server cuts a long video into stories of this length (web: SegmentSeconds)
      if (isVideo) formData.append('SegmentSeconds', String(SEGMENT_SECONDS));
      if (music) {
        formData.append('MusicId', music.music._id);
        formData.append('MusicStart', String(music.start));
        formData.append('MusicDuration', String(music.duration));
      }

      // videos get the progress card (real % while uploading, then "splitting" while the server works);
      // photos are small, so they keep the plain loader
      if (isVideo) hideLoader();
      const { ok, status, data: result } = await upload.run({
        url: `${BASE_URL}/api/user/AddStory`,
        method: 'POST',
        token,
        formData,
        show: isVideo,
      });

      if (!ok) throw new Error(result?.message || `Server responded with status ${status}`);
      ToastMsg(result?.message || 'Story added');
      navigation.goBack();
    } catch (error) {
      if (error?.cancelled) ToastMsg('Upload cancelled');
      else {
        console.log('Upload failed:', error?.message || error);
        ToastMsg(error?.message || 'Something went wrong');
      }
    } finally {
      hideLoader();
    }
  };

  const resetVideoState = () => {
    setVideoDuration(0);
    setVideoTime(0);
    setVideoPlaying(false);
    setMusicSync(0);
  };

  const handleSelect = (uri, meta, type = 'image') => {
    if (type === 'video') {
      const err = validateStoryVideo({ name: uri, size: meta?.fileSize, duration: meta?.playableDuration });
      if (err) return ToastMsg(err);
    } else if (meta?.fileSize && meta.fileSize > MEDIA_RULES.storyImageMaxBytes) {
      return ToastMsg(`File too large. Max ${MEDIA_RULES.storyImageMaxBytes / 1024 / 1024} MB`);
    }
    resetVideoState();
    if (type === 'video' && meta?.playableDuration) setVideoDuration(meta.playableDuration);
    setMediaType(type);
    setSelectedImage(prev => (prev === uri ? null : uri));
    setIsPreviewVisible(true);
  };

  const closePreview = () => {
    setIsPreviewVisible(false);
    setVideoPlaying(false);
  };

  const handlePostStory = () => {
    onSubmit(selectedImage);
  };

  const handleOpenCamera = () => {
    const options = activeTab === 'Videos'
      ? { mediaType: 'video', cameraType: 'back', videoQuality: 'high', durationLimit: STORY_VIDEO.maxDuration }
      : { mediaType: 'photo', cameraType: 'back', quality: 0.8 };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error:', response.errorMessage);
        ToastMsg('Camera error: ' + response.errorMessage);
      } else {
        const asset = response?.assets?.[0];
        const uri = asset?.uri;
        if (!uri) return;
        if (activeTab === 'Videos') {
          // recorded video → review it (segments, music) before posting
          handleSelect(uri, { fileSize: asset.fileSize, playableDuration: asset.duration }, 'video');
        } else {
          onSubmit(uri);
        }
      }
    });
  };

  const handleCropImage = async () => {
    try {
      const cropped = await ImagePicker.openCropper({
        path: selectedImage,
        width: 300,
        height: 400,
        cropping: true,
        cropperCircleOverlay: false,
        freeStyleCropEnabled: true,
      });
  
      if (cropped?.path) {
        setSelectedImage(cropped.path);
      }
    } catch (err) {
      console.log('Crop cancelled or failed:', err?.message);
      ToastMsg('Crop cancelled');
    }
  };
  

  const renderItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <TouchableOpacity onPress={handleOpenCamera} activeOpacity={0.8}>
          <View style={styles.cameraTile}>
            <FontAwesome name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      );
    }

    const uri = item.node.image.uri;
    const isSelected = selectedImage === uri;
    const tileIsVideo = activeTab === 'Videos';
    const dur = item.node.image.playableDuration;

    return (
      <TouchableOpacity onPress={() => handleSelect(uri, item.node.image, tileIsVideo ? 'video' : 'image')} activeOpacity={0.8}>
        <View style={[styles.imageTile, isSelected && styles.selectedTile]}>
          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
          {tileIsVideo && (
            <View style={styles.durBadge}>
              <Icon name="play" size={10} color="#fff" />
              <Text style={styles.durText}>{dur ? fmtTime(dur) : ''}</Text>
            </View>
          )}
          {isSelected && (
            <View style={styles.checkIconContainer}>
              <Icon name="checkmark" size={16} color="#fff" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <Row style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {isDarkMode ? <BackIcon /> : <PrimaryBackArrow />}
      </TouchableOpacity>
      <CustomText style={styles.headerText}>Select Photo or Video</CustomText>
    </Row>
  );

  const renderTabs = () => (
    <View style={styles.tabs}>
      {['Photos', 'Videos'].map(tab => {
        const active = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.85}
            onPress={() => { setActiveTab(tab); setSelectedImage(null); resetVideoState(); setMediaType(tab === 'Videos' ? 'video' : 'image'); }}
            style={[styles.tab, active && styles.tabActive, { borderColor: active ? '#1e90ff' : (isDarkMode ? '#334155' : '#CBD5E1') }]}>
            <Icon name={tab === 'Videos' ? 'videocam' : 'image'} size={16} color={active ? '#fff' : (isDarkMode ? '#E2E8F0' : '#334155')} />
            <Text style={[styles.tabText, { color: active ? '#fff' : (isDarkMode ? '#E2E8F0' : '#334155') }]}>{tab}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#131B2B' : '#FFFFFF' }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      {renderHeader()}
      {!errorMsg && renderTabs()}

      {errorMsg ? (
        <PermissionNotice message={errorMsg} blocked={blocked} onRetry={() => setRetryKey(k => k + 1)} />
      ) : (
        <>
          <FlatList
            data={activeTab === 'Videos' ? videos : photos}
            key={activeTab}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          {selectedImage && (
            <View style={styles.musicDock}>
              <MusicSelector value={music} onChange={setMusic} suggestedDuration={isVideo && videoDuration ? Math.round(videoDuration) : null} />
            </View>
          )}

          {selectedImage && (
            <TouchableOpacity style={styles.postButton} onPress={handlePostStory}>
              <Icon name="arrow-up-circle-outline" size={20} color="#fff" />
              <Text style={styles.postButtonText}>{isVideo && segments.length > 1 ? `Post ${segments.length} Stories` : 'Post Story'}</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <UploadProgressModal
        {...upload.state}
        title={segments.length > 1 ? `Uploading video · ${segments.length} stories` : 'Uploading story video'}
        processingText={segments.length > 1 ? `Splitting into ${segments.length} stories…` : 'Processing video…'}
        hint="Large videos take a little while. Please keep the app open until it finishes."
        onCancel={upload.cancel}
      />

      {isPreviewVisible && selectedImage && !isVideo && (
        <View style={styles.previewContainer}>
          <ImageZoom cropWidth={width} cropHeight={height} imageWidth={width} imageHeight={height}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="contain" />
          </ImageZoom>

          <View style={styles.previewMusic}>
            <MusicSelector value={music} onChange={setMusic} />
          </View>

          <TouchableOpacity onPress={() => { handlePostStory(); setIsPreviewVisible(false); }} style={styles.postBtn}>
            <Text style={styles.postText}>Post Story</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={closePreview} style={styles.closeBtn}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCropImage}
            style={{
              position: 'absolute',
              top: 40,
              left: 20,
              backgroundColor: '#1e90ff',
              padding: 10,
              borderRadius: 30,
            }}
          >
            <Icon name="crop" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Video story: play it, see how it will be split into 15 s stories, add music */}
      {isPreviewVisible && selectedImage && isVideo && (
        <View style={styles.videoPreview}>
          <TouchableOpacity onPress={closePreview} style={styles.closeBtn}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <View style={styles.videoBox}>
            <Video
              ref={videoRef}
              source={{ uri: selectedImage }}
              style={StyleSheet.absoluteFill}
              resizeMode="contain"
              controls
              repeat={false}
              // with a song attached the video's own sound is muted (web: MUTE_VIDEO_WITH_MUSIC)
              muted={!!music}
              ignoreSilentSwitch="ignore"
              progressUpdateInterval={250}
              onLoad={e => { if (e?.duration) setVideoDuration(e.duration); }}
              onProgress={e => setVideoTime(e.currentTime)}
              onSeek={e => setMusicSync(e.currentTime)}
              onPlaybackStateChanged={e => setVideoPlaying(!!e?.isPlaying)}
              onEnd={() => setVideoPlaying(false)}
            />
          </View>

          {!!music && (
            <MusicAudio
              uri={music.music.File}
              start={music.start}
              end={music.start + music.duration}
              playing={videoPlaying && videoTime < music.duration}
              syncTo={musicSync}
            />
          )}

          <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            {segments.length > 0 && (
              <View style={styles.segBox}>
                <Text style={styles.segTitle}>
                  {segments.length > 1 ? `Will be posted as ${segments.length} stories` : 'Will be posted as 1 story'}
                  <Text style={styles.segSub}>  · {fmtTime(videoDuration)} total · up to {SEGMENT_SECONDS}s each</Text>
                </Text>
                <View style={styles.segRow}>
                  {segments.map((sg, i) => {
                    const on = i === activeSeg;
                    return (
                      <TouchableOpacity
                        key={i}
                        activeOpacity={0.85}
                        onPress={() => { videoRef.current?.seek(sg.start); setVideoTime(sg.start); setMusicSync(sg.start); }}
                        style={[styles.segChip, on && { backgroundColor: '#1e90ff', borderColor: '#1e90ff' }]}>
                        <Text style={styles.segChipText}>{i + 1} · {fmtTime(sg.start)}–{fmtTime(sg.end)}</Text>
                        {musicCoversSeg(i) && <Icon name="musical-notes" size={11} color="#fff" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {!!music && (
                  <Text style={styles.segNote}>
                    The song continues across the stories.
                    {coveredStories < segments.length
                      ? ` It covers the first ${coveredStories} of ${segments.length} — open Music and choose a longer clip to cover all.`
                      : ''}
                    {' '}Original video sound is muted.
                  </Text>
                )}
              </View>
            )}

            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <MusicSelector value={music} onChange={setMusic} suggestedDuration={videoDuration ? Math.round(videoDuration) : null} />
            </View>
          </ScrollView>

          <TouchableOpacity onPress={() => { closePreview(); handlePostStory(); }} style={styles.videoPostBtn}>
            <Icon name="arrow-up-circle-outline" size={20} color="#fff" />
            <Text style={styles.postText}>{segments.length > 1 ? `Post ${segments.length} Stories` : 'Post Story'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingBottom: 10 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 18, borderWidth: 1 },
  tabActive: { backgroundColor: '#1e90ff' },
  tabText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  durBadge: { position: 'absolute', left: 6, bottom: 6, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  durText: { color: '#fff', fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  videoPreview: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000', zIndex: 999, alignItems: 'center', paddingTop: 90 },
  videoBox: { width: '100%', height: height * 0.42, backgroundColor: '#000' },
  segBox: { marginHorizontal: 16, marginTop: 12, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#334155', backgroundColor: '#0F172A' },
  segTitle: { color: '#fff', fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  segSub: { color: '#94A3B8', fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  segRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  segChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#475569' },
  segChipText: { color: '#E2E8F0', fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  segNote: { color: '#94A3B8', fontSize: 12, marginTop: 10, lineHeight: 17, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  videoPostBtn: { position: 'absolute', bottom: 30, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1e90ff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, elevation: 5 },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    gap: 90,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: FONTS_FAMILY.SourceSans3_Bold,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  cameraTile: {
    width: imageSize,
    height: 170,
    margin: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageTile: {
    width: imageSize,
    height: 170,
    margin: 1,
    overflow: 'hidden',
  },
  selectedTile: {
    borderWidth: 3,
    borderColor: '#1e90ff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#1e90ff',
    borderRadius: 12,
    padding: 2,
  },
  musicDock: { position: 'absolute', left: 16, right: 16, bottom: 92 },
  previewMusic: { position: 'absolute', left: 20, right: 20, bottom: 162 },
  postButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  postButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  previewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    padding: 20,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  postBtn: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  postText: {
    color: '#fff',
    fontSize: 14,
    fontFamily:FONTS_FAMILY.OpenSans_Condensed_SemiBold
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});
