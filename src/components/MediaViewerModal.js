import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import CustomText from './TextComponent';
import { ToastMsg } from '../utils/helperFunctions';
import { white } from '../common/Colors/colors';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Full-screen photo preview — pinch-to-zoom + pan (react-native-gesture-handler
// + reanimated, both already in this project, no new native deps), close (X)
// and download-to-gallery. Shared by every chat screen (social, seller,
// buyer-seller) so sent/received photos all open the same way.
const MediaViewerModal = ({ visible, onClose, uri }) => {
    const [downloading, setDownloading] = useState(false);

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const resetTransform = () => {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
    };

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = Math.max(1, Math.min(savedScale.value * e.scale, 5));
        })
        .onEnd(() => {
            savedScale.value = scale.value;
            if (scale.value <= 1) {
                scale.value = withSpring(1);
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                savedScale.value = 1;
                savedTranslateX.value = 0;
                savedTranslateY.value = 0;
            }
        });

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (savedScale.value <= 1) return;
            translateX.value = savedTranslateX.value + e.translationX;
            translateY.value = savedTranslateY.value + e.translationY;
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            if (scale.value > 1) {
                resetTransform();
            } else {
                scale.value = withSpring(2.5);
                savedScale.value = 2.5;
            }
        });

    const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    const handleClose = () => {
        resetTransform();
        onClose();
    };

    const handleDownload = async () => {
        if (!uri) return;
        try {
            setDownloading(true);
            // CameraRoll.saveAsset needs a local file — download the remote
            // image first, then hand the local path to the gallery.
            const localPath = `${RNFS.CachesDirectoryPath}/chat_photo_${Date.now()}.jpg`;
            const { promise } = RNFS.downloadFile({ fromUrl: uri, toFile: localPath });
            await promise;
            await CameraRoll.saveAsset(localPath, { type: 'photo' });
            ToastMsg('Photo saved to gallery');
        } catch (error) {
            ToastMsg('Could not save photo — check gallery permission');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
            {/* A Modal renders in its own native window, outside the app-level root view, so the
                gesture handlers need their own GestureHandlerRootView in here (else: crash) */}
            <GestureHandlerRootView style={styles.overlay}>
                <TouchableOpacity style={styles.closeBtn} onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="x" size={26} color={white} />
                </TouchableOpacity>

                <GestureDetector gesture={composedGesture}>
                    <Animated.Image
                        source={{ uri }}
                        style={[styles.image, animatedStyle]}
                        resizeMode="contain"
                    />
                </GestureDetector>

                <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload} disabled={downloading}>
                    {downloading ? (
                        <ActivityIndicator color={white} size="small" />
                    ) : (
                        <Icon name="download" size={18} color={white} />
                    )}
                    <CustomText style={styles.downloadText}>{downloading ? 'Saving...' : 'Download'}</CustomText>
                </TouchableOpacity>
            </GestureHandlerRootView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', alignItems: 'center', justifyContent: 'center' },
    closeBtn: {
        position: 'absolute', top: 50, right: 20, zIndex: 10,
        width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    image: { width: SCREEN_W, height: SCREEN_H * 0.75 },
    downloadBtn: {
        position: 'absolute', bottom: 50, flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24,
    },
    downloadText: { color: white, fontSize: 14, fontWeight: '600' },
});

export default MediaViewerModal;
