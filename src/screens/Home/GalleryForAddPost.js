

// // import React, { useEffect, useState } from 'react'
// // import {
// //   View,
// //   FlatList,
// //   Image,
// //   PermissionsAndroid,
// //   Platform,
// //   Text,
// //   Alert,
// //   TouchableOpacity,
// //   Dimensions,
// //   StatusBar,
// //   StyleSheet,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   ScrollView,
// //   TouchableWithoutFeedback,
// //   Keyboard,
// //   SafeAreaView,
// // } from 'react-native'
// // import { CameraRoll } from '@react-native-camera-roll/camera-roll'
// // import Icon from 'react-native-vector-icons/Ionicons'
// // import { BASE_URL, getItem } from '../../utils/Apis'
// // import useLoader from '../../utils/LoaderHook'
// // import { ToastMsg } from '../../utils/helperFunctions'
// // import { useSelector } from 'react-redux'
// // import Row from '../../components/wrapper/row'
// // import { BackIcon, PrimaryBackArrow } from '../../assets/SVGs'
// // import { FONTS_FAMILY } from '../../assets/Fonts'
// // import CustomText from '../../components/TextComponent'
// // import { launchCamera } from 'react-native-image-picker'
// // import FontAwesome from 'react-native-vector-icons/FontAwesome'
// // import ImageZoom from 'react-native-image-pan-zoom'
// // import ImagePicker from 'react-native-image-crop-picker'
// // import Video from 'react-native-video'
// // import LinearGradient from 'react-native-linear-gradient'
// // import { App_Primary_color } from '../../common/Colors/colors'

// // const screenWidth = Dimensions.get('window').width
// // const imageSize = screenWidth / 3 - 10
// // const { width, height } = Dimensions.get('window')

// // const GalleryForAddPost = ({ navigation }) => {
// //   const [photos, setPhotos] = useState([])
// //   const [videos, setVideos] = useState([])
// //   const [errorMsg, setErrorMsg] = useState('')
// //   const [selectedImage, setSelectedImage] = useState(null)
// //   const [caption, setCaption] = useState('')
// //   const [activeTab, setActiveTab] = useState('Images')
// //   const [selectedMediaType, setSelectedMediaType] = useState('image') // Track media type
// //   const { isDarkMode } = useSelector(state => state.theme)
// //   const [isPreviewVisible, setIsPreviewVisible] = useState(false)
// //   const { showLoader, hideLoader } = useLoader()

// //   useEffect(() => {
// //     const requestPermissionAndLoad = async () => {
// //       try {
// //         if (Platform.OS === 'android') {
// //           const permission = await PermissionsAndroid.request(
// //             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
// //             {
// //               title: 'Permission Required',
// //               message: 'App needs access to your gallery',
// //               buttonPositive: 'OK',
// //             },
// //           )

// //           const videoPermission = await PermissionsAndroid.request(
// //             PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
// //             {
// //               title: 'Video Permission Required',
// //               message: 'App needs access to your videos',
// //               buttonPositive: 'OK',
// //             },
// //           )

// //           const legacy = await PermissionsAndroid.request(
// //             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
// //           )

// //           if (
// //             permission !== PermissionsAndroid.RESULTS.GRANTED &&
// //             videoPermission !== PermissionsAndroid.RESULTS.GRANTED &&
// //             legacy !== PermissionsAndroid.RESULTS.GRANTED
// //           ) {
// //             setErrorMsg('Permission denied')
// //             return
// //           }
// //         }

// //         // Load images
// //         const imageResult = await CameraRoll.getPhotos({
// //           first: 50,
// //           assetType: 'Photos',
// //         })
// //         setPhotos(imageResult.edges)

// //         // Load videos
// //         const videoResult = await CameraRoll.getPhotos({
// //           first: 50,
// //           assetType: 'Videos',
// //         })
// //         setVideos(videoResult.edges)

// //         if (imageResult.edges.length === 0 && videoResult.edges.length === 0) {
// //           setErrorMsg('No media found in gallery.')
// //         }
// //       } catch (error) {
// //         setErrorMsg(error.message || 'Something went wrong')
// //         Alert.alert('Error', error.message || 'Something went wrong')
// //       }
// //     }

// //     requestPermissionAndLoad()
// //   }, [])

// //   const onSubmit = async selectedMedia => {
// //     try {
// //       const token = await getItem('token')
// //       showLoader()

// //       if (!selectedMedia) {
// //         ToastMsg('No media selected')
// //         hideLoader()
// //         return
// //       }

// //       const fileName = selectedMedia.split('/').pop()
// //       const formData = new FormData()

// //       // Set type based on selected media type
// //       formData.append('type', selectedMediaType)

// //       const fileObject = {
// //         uri:
// //           Platform.OS === 'android'
// //             ? selectedMedia
// //             : selectedMedia.replace('file://', ''),
// //         name:
// //           fileName || `upload.${selectedMediaType === 'video' ? 'mp4' : 'jpg'}`,
// //       }

// //       // Set appropriate MIME type based on media type
// //       if (selectedMediaType === 'video') {
// //         fileObject.type = 'video/mp4'
// //       } else {
// //         fileObject.type = 'image/jpeg'
// //       }

// //       formData.append('file', fileObject)
// //       formData.append('Caption', caption || 'No caption')

// //       const response = await fetch(`${BASE_URL}/api/user/AddPost`, {
// //         method: 'POST',
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: formData,
// //       })

// //       if (!response.ok)
// //         throw new Error(`Server responded with status ${response.status}`)
// //       const text = await response.text()

// //       try {
// //         const result = JSON.parse(text)
// //         ToastMsg(result?.message)
// //         navigation.navigate('Tab')
// //       } catch (err) {
// //         console.error('Error parsing response:', err)
// //         ToastMsg('Upload failed: Invalid server response')
// //       } finally {
// //         hideLoader()
// //       }
// //     } catch (error) {
// //       console.log('Upload failed:', error.message || error)
// //       ToastMsg('Something went wrong')
// //       hideLoader()
// //     }
// //   }

// //   const handleSelect = uri => {
// //     setSelectedImage(prev => (prev === uri ? null : uri))
// //     // Set media type based on active tab
// //     setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
// //     setIsPreviewVisible(true)
// //   }

// //   const handlePostStory = () => {
// //     onSubmit(selectedImage)
// //   }

// //   const handleOpenCamera = () => {
// //     const options = {
// //       mediaType: activeTab === 'Videos' ? 'video' : 'photo',
// //       cameraType: 'back',
// //       maxWidth: 100,
// //       maxHeight: 100,
// //       quality: 0.4,
// //       videoQuality: 'medium',
// //       durationLimit: 60,
// //     }

// //     launchCamera(options, response => {
// //       if (response.didCancel) {
// //         console.log('User cancelled camera')
// //       } else if (response.errorCode) {
// //         console.log('Camera error:', response.errorMessage)
// //         ToastMsg('Camera error: ' + response.errorMessage)
// //       } else {
// //         const uri = response?.assets?.[0]?.uri
// //         if (uri) {
// //           setSelectedImage(uri)
// //           setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
// //           setIsPreviewVisible(true)
// //         }
// //       }
// //     })
// //   }

// //   const handleCropImage = async () => {
// //     // Only allow cropping for images
// //     if (selectedMediaType !== 'image') {
// //       ToastMsg('Cropping is only available for images')
// //       return
// //     }

// //     try {
// //       const cropped = await ImagePicker.openCropper({
// //         path: selectedImage,
// //         width: 300,
// //         height: 200,
// //         cropping: true,
// //         cropperCircleOverlay: false,
// //         freeStyleCropEnabled: true,
// //         hideBottomControls: false,
// //         enableRotationGesture: true,
// //         statusBarTranslucent: false,
// //         cropperStatusBarColor: isDarkMode ? '#000000' : '#ffffff',
// //         cropperToolbarColor: isDarkMode ? '#1a1a1a' : '#ffffff',
// //         cropperActiveWidgetColor: '#1e90ff',
// //         cropperToolbarWidgetColor: isDarkMode ? '#ffffff' : '#000000',
// //         cropperToolbarTitle: 'Edit Photo',
// //         includeBase64: false,
// //         includeExif: false,
// //         avoidEmptySpaceAroundImage: true,
// //         showCropGuidelines: true,
// //         showCropFrame: true,
// //         compressImageQuality: 1,

// //         forceJpg: true,
// //         useFrontCamera: false,
// //         writeTempFile: true,
// //         ...(Platform.OS === 'android' && {
// //           mediaType: 'photo',
// //           smartAlbums: [
// //             'UserLibrary',
// //             'PhotoStream',
// //             'Panoramas',
// //             'Videos',
// //             'Bursts',
// //           ],
// //         }),
// //       })

// //       if (cropped?.path) {
// //         setSelectedImage(cropped.path)
// //       }
// //     } catch (err) {
// //       console.log('Crop cancelled or failed:', err?.message)
// //       ToastMsg('Crop cancelled')
// //     }
// //   }

// //   const handleVideoTrim = async () => {
// //     // Video trimming functionality can be added here
// //     // For now, just show a message
// //     ToastMsg('Video trimming feature coming soon')
// //   }

// //   const getCurrentData = () => {
// //     return activeTab === 'Images' ? photos : videos
// //   }

// //   const renderItem = ({ item, index }) => {
// //     if (index === 0) {
// //       return (
// //         <TouchableOpacity onPress={handleOpenCamera} activeOpacity={0.8}>
// //           <View style={styles.cameraTile}>
// //             <FontAwesome
// //               name={activeTab === 'Videos' ? 'video-camera' : 'camera'}
// //               size={20}
// //               color='#fff'
// //             />
// //             <Text style={styles.cameraText}>
// //               {activeTab === 'Videos' ? 'Record' : 'Camera'}
// //             </Text>
// //           </View>
// //         </TouchableOpacity>
// //       )
// //     }

// //     const uri = item.node.image.uri
// //     const isSelected = selectedImage === uri
// //     const isVideo = activeTab === 'Videos'

// //     return (
// //       <TouchableOpacity onPress={() => handleSelect(uri)} activeOpacity={0.8}>
// //         <View style={[styles.imageTile, isSelected && styles.selectedTile]}>
// //           <Image source={{ uri }} style={styles.image} resizeMode='cover' />
// //           {/* Video play icon overlay */}
// //           {isVideo && (
// //             <View style={styles.videoOverlay}>
// //               <Icon
// //                 name='play-circle'
// //                 size={24}
// //                 color='rgba(255,255,255,0.8)'
// //               />
// //             </View>
// //           )}
// //           {isSelected && (
// //             <View style={styles.checkIconContainer}>
// //               <Icon name='checkmark' size={16} color='#fff' />
// //             </View>
// //           )}
// //         </View>
// //       </TouchableOpacity>
// //     )
// //   }

// //   const renderTabBar = () => (
// //     <View
// //       style={[
// //         styles.tabContainer,
// //         // {backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa'},
// //       ]}>
// //       <TouchableOpacity
// //         style={[
// //           styles.tabButton,
// //           activeTab === 'Images' && styles.activeTab,
// //           // { backgroundColor: activeTab === 'Images' ? '#1e90ff' : 'transparent' }
// //         ]}
// //         onPress={() => setActiveTab('Images')}>
// //         <LinearGradient
// //           colors={['#FC14CB', '#4F52FE']}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={[styles.tabButton, { borderRadius: 8 }]}>
// //           <Icon
// //             name='image-outline'
// //             size={20}
// //             color={
// //               activeTab === 'Images' ? '#fff' : isDarkMode ? '#fff' : '#333'
// //             }
// //           />
// //           <Text
// //             style={[
// //               styles.tabText,
// //               {
// //                 color:
// //                   activeTab === 'Images'
// //                     ? '#fff'
// //                     : isDarkMode
// //                       ? '#fff'
// //                       : '#333',
// //               },
// //             ]}>
// //             Images
// //           </Text>
// //         </LinearGradient>
// //       </TouchableOpacity>

// //       <TouchableOpacity
// //         style={[
// //           styles.tabButton,
// //           activeTab === 'Videos' && styles.activeTab,
// //           // { backgroundColor: activeTab === 'Videos' ? '#1e90ff' : 'transparent' }
// //         ]}
// //         onPress={() => setActiveTab('Videos')}>
// //         <LinearGradient
// //           colors={['#FC14CB', '#4F52FE']}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={[styles.tabButton, { borderRadius: 8 }]}>
// //           <Icon
// //             name='videocam-outline'
// //             size={20}
// //             color={
// //               activeTab === 'Videos' ? '#fff' : isDarkMode ? '#fff' : '#333'
// //             }
// //           />
// //           <Text
// //             style={[
// //               styles.tabText,
// //               {
// //                 color:
// //                   activeTab === 'Videos'
// //                     ? '#fff'
// //                     : isDarkMode
// //                       ? '#fff'
// //                       : '#333',
// //               },
// //             ]}>
// //             Videos
// //           </Text>
// //         </LinearGradient>
// //       </TouchableOpacity>
// //     </View>
// //   )

// //   const renderHeader = () => (
// //     <Row style={styles.header}>
// //       <TouchableOpacity onPress={() => navigation.goBack()}>
// //         {isDarkMode ? <BackIcon /> : <PrimaryBackArrow />}
// //       </TouchableOpacity>
// //       <CustomText style={styles.headerText}>Select Media</CustomText>
// //     </Row>
// //   )

// //   const renderPreviewMedia = () => {
// //     if (selectedMediaType === 'video') {
// //       return (
// //         <View style={styles.videoPreviewContainer}>
// //           <Video
// //             source={{ uri: selectedImage }}
// //             style={styles.previewVideo}
// //             resizeMode='contain'
// //             controls={true}
// //             paused={false}
// //             repeat={true}
// //             muted={false}
// //             onError={error => {
// //               console.log('Video error:', error)
// //               ToastMsg('Error loading video')
// //             }}
// //           />
// //         </View>
// //       )
// //     } else {
// //       return (
// //         <View style={styles.imagePreviewContainer}>
// //           <View
// //             style={[
// //               styles.imageWrapper,
// //               { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
// //             ]}>
// //             <ImageZoom
// //               cropWidth={width}
// //               cropHeight={width}
// //               imageWidth={width}
// //               imageHeight={width}
// //               enableSwipeDown={false}
// //               enableDoubleClickZoom={true}
// //               minScale={0.8}
// //               maxScale={3}>
// //               <Image
// //                 source={{ uri: selectedImage }}
// //                 style={styles.previewImage}
// //                 resizeMode='contain'
// //               />
// //             </ImageZoom>
// //           </View>
// //         </View>
// //       )
// //     }
// //   }

// //   return (
// //     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
// //       <View style={{ flex: 1, backgroundColor: isDarkMode ? '#252525' : '#fff' }}>
// //         <StatusBar
// //           backgroundColor='transparent'
// //           translucent
// //           barStyle={isDarkMode ? 'light-content' : 'dark-content'}
// //         />
// //         {renderHeader()}
// //         {renderTabBar()}

// //         {errorMsg ? (
// //           <Text style={styles.errorText}>{errorMsg}</Text>
// //         ) : (
// //           <>
// //             <FlatList
// //               data={getCurrentData()}
// //               keyExtractor={(item, index) => index.toString()}
// //               numColumns={3}
// //               renderItem={renderItem}
// //               contentContainerStyle={{ paddingBottom: 100, alignSelf: 'center' }}
// //               key={activeTab} // Force re-render when tab changes
// //             />

// //             {selectedImage && !isPreviewVisible && (
// //               <TouchableOpacity
// //                 style={styles.postButton}
// //                 onPress={() => setIsPreviewVisible(true)}>
// //                 <Icon name='arrow-up-circle-outline' size={20} color='#fff' />
// //                 <Text style={styles.postButtonText}>Next</Text>
// //               </TouchableOpacity>
// //             )}
// //           </>
// //         )}

// //         {isPreviewVisible && selectedImage && (
// //           <View
// //             style={[
// //               styles.previewContainer,
// //               { backgroundColor: isDarkMode ? '#000' : '#fff' },
// //             ]}>
// //             <KeyboardAvoidingView
// //               style={{ flex: 1 }}
// //               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
// //               keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
// //               <View
// //                 style={[
// //                   styles.previewHeader,
// //                   { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
// //                 ]}>
// //                 <TouchableOpacity
// //                   onPress={() => {
// //                     setIsPreviewVisible(false)
// //                     setCaption('')
// //                   }}
// //                   style={styles.headerButton}>
// //                   <Icon
// //                     name='chevron-back'
// //                     size={24}
// //                     color={isDarkMode ? '#fff' : '#333'}
// //                   />
// //                   <Text
// //                     style={[
// //                       styles.headerButtonText,
// //                       { color: isDarkMode ? '#fff' : '#333' },
// //                     ]}>
// //                     Back
// //                   </Text>
// //                 </TouchableOpacity>

// //                 <Text
// //                   style={[
// //                     styles.previewTitle,
// //                     { color: isDarkMode ? '#fff' : '#333' },
// //                   ]}>
// //                   Create Post
// //                 </Text>

// //                 <TouchableOpacity
// //                   onPress={
// //                     selectedMediaType === 'video'
// //                       ? handleVideoTrim
// //                       : handleCropImage
// //                   }
// //                   style={styles.headerButton}>
// //                   <Icon
// //                     name={selectedMediaType === 'video' ? 'cut' : 'crop'}
// //                     size={20}
// //                     color={isDarkMode ? '#fff' : '#333'}
// //                   />
// //                   <Text
// //                     style={[
// //                       styles.headerButtonText,
// //                       { color: isDarkMode ? '#fff' : '#333' },
// //                     ]}>
// //                     {selectedMediaType === 'video' ? 'Trim' : 'Crop'}
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>

// //               <ScrollView
// //                 style={styles.previewContent}
// //                 showsVerticalScrollIndicator={false}
// //                 keyboardShouldPersistTaps='handled'
// //                 contentContainerStyle={{ paddingBottom: 200 }}>
// //                 {renderPreviewMedia()}

// //                 <View
// //                   style={[
// //                     styles.captionContainer,
// //                     { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
// //                   ]}>
// //                   <View style={styles.captionHeader}>
// //                     <Icon
// //                       name='create-outline'
// //                       size={20}
// //                       color={isDarkMode ? '#fff' : '#333'}
// //                     />
// //                     <Text
// //                       style={[
// //                         styles.captionTitle,
// //                         { color: isDarkMode ? '#fff' : '#333' },
// //                       ]}>
// //                       Write a caption
// //                     </Text>
// //                   </View>

// //                   <View
// //                     style={[
// //                       styles.captionInputContainer,

// //                       {
// //                         backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
// //                         borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9',
// //                       },
// //                     ]}>
// //                     <TextInput
// //                       style={[
// //                         styles.captionInput,
// //                         { color: isDarkMode ? '#fff' : '#333' },
// //                       ]}
// //                       placeholder="What's on your mind?"
// //                       placeholderTextColor={isDarkMode ? '#888' : '#666'}
// //                       value={caption}
// //                       onChangeText={setCaption}
// //                       multiline
// //                       maxLength={2200}
// //                       textAlignVertical='top'
// //                       autoCorrect={true}
// //                       spellCheck={true}
// //                     />
// //                   </View>

// //                   <View style={styles.captionFooter}>
// //                     <Text
// //                       style={[
// //                         styles.characterCount,
// //                         { color: isDarkMode ? '#888' : '#666' },
// //                       ]}>
// //                       {caption.length}/2200
// //                     </Text>
// //                     <View style={styles.captionActions}>
// //                       <TouchableOpacity style={styles.emojiButton}>
// //                         <Icon
// //                           name='happy-outline'
// //                           size={20}
// //                           color={isDarkMode ? '#888' : '#666'}
// //                         />
// //                       </TouchableOpacity>
// //                       <TouchableOpacity style={styles.tagButton}>
// //                         <Icon
// //                           name='pricetag-outline'
// //                           size={20}
// //                           color={isDarkMode ? '#888' : '#666'}
// //                         />
// //                       </TouchableOpacity>
// //                     </View>
// //                   </View>
// //                 </View>

// //                 <View
// //                   style={[
// //                     styles.captionContainer,
// //                     {
// //                       borderWidth: 1,
// //                       borderRadius: 12,
// //                       padding: 16,
// //                       minHeight: 80,
// //                       maxHeight: 120,
// //                     },
// //                     { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
// //                   ]}>
// //                   <View style={styles.captionHeader}>
// //                     <Icon
// //                       name='create-outline'
// //                       size={20}
// //                       color={isDarkMode ? '#fff' : '#333'}
// //                     />
// //                     <Text
// //                       style={[
// //                         styles.captionTitle,
// //                         { color: isDarkMode ? '#fff' : '#333' },
// //                       ]}>
// //                       Type hastag
// //                     </Text>
// //                   </View>
// //                   <Row style={{ width: '100%' , gap:10, alignItems:'center'}}>
// //                     <View
// //                       style={[
// //                         styles.captionInputContainer,
// //                         {
// //                           borderWidth: 1,
// //                           borderRadius: 12,
// //                           padding: 3,
// //                           minHeight: 48,
// //                           // maxHeight: 300,
// //                           flex: 1,
// //                         },
// //                         {
// //                           backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
// //                           borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9',
// //                         },
// //                       ]}>
// //                       <Row>
// //                         <TextInput
// //                           style={[
// //                             styles.captionInput,
// //                             { color: isDarkMode ? '#fff' : '#333' },
// //                           ]}
// //                           placeholder="Enter hastags?"
// //                           placeholderTextColor={isDarkMode ? '#888' : '#666'}
// //                           value={caption}
// //                           onChangeText={setCaption}
// //                           multiline
// //                           maxLength={100}
// //                           textAlignVertical='top'
// //                           autoCorrect={true}
// //                           spellCheck={true}
// //                         />


// //                       </Row>
// //                     </View>

// //                     <TouchableOpacity
// //                     style={{ 
// //                       backgroundColor: '#12208B',
// //                       paddingVertical:12,
// //                       paddingHorizontal:16,
// //                       borderRadius:8
// //                      }}
// //                     >
// //                       <CustomText
// //                       style={{
// //                         fontFamily:FONTS_FAMILY.SourceSans3_Medium
// //                       }}
// //                       >Add</CustomText>
// //                     </TouchableOpacity>

// //                   </Row>

// //                   <View style={styles.captionFooter}>
// //                     {/* <Text
// //                       style={[
// //                         styles.characterCount,
// //                         { color: isDarkMode ? '#888' : '#666' },
// //                       ]}>
// //                       {caption.length}/2200
// //                     </Text> */}
// //                     {/* <View style={styles.captionActions}>
// //                       <TouchableOpacity style={styles.emojiButton}>
// //                         <Icon
// //                           name='happy-outline'
// //                           size={20}
// //                           color={isDarkMode ? '#888' : '#666'}
// //                         />
// //                       </TouchableOpacity>
// //                       <TouchableOpacity style={styles.tagButton}>
// //                         <Icon
// //                           name='pricetag-outline'
// //                           size={20}
// //                           color={isDarkMode ? '#888' : '#666'}
// //                         />
// //                       </TouchableOpacity>
// //                     </View> */}
// //                   </View>
// //                 </View>
// //               </ScrollView>

// //               <View
// //                 style={[
// //                   styles.postButtonContainer,
// //                   {
// //                     backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
// //                     borderTopColor: isDarkMode ? '#333' : '#e1e5e9',
// //                   },
// //                 ]}>
// //                 <TouchableOpacity
// //                   onPress={handlePostStory}
// //                   // style={[styles.postBtn, {opacity: selectedImage ? 1 : 0.5}]}
// //                   disabled={!selectedImage}>
// //                   <LinearGradient
// //                     colors={['#FC14CB', '#4F52FE']}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 1 }}
// //                     style={[{ borderRadius: 8 }, styles.postBtn, { opacity: selectedImage ? 1 : 0.5 }]}>
// //                     <Icon
// //                       name='send'
// //                       size={18}
// //                       color='#fff'
// //                       style={styles.postIcon}
// //                     />
// //                     <Text style={styles.postText}>
// //                       Share {selectedMediaType === 'video' ? 'Video' : 'Post'}
// //                     </Text>
// //                   </LinearGradient>
// //                 </TouchableOpacity>
// //               </View>
// //             </KeyboardAvoidingView>
// //           </View>
// //         )}
// //       </View>
// //     </TouchableWithoutFeedback>
// //   )
// // }

// // export default GalleryForAddPost

// // const styles = StyleSheet.create({
// //   header: {
// //     paddingTop: 50,
// //     paddingHorizontal: 20,
// //     gap: 90,
// //     paddingBottom: 20,
// //   },
// //   headerText: {
// //     fontSize: 20,
// //     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
// //   },
// //   tabContainer: {
// //     flexDirection: 'row',
// //     paddingHorizontal: 10,
// //     // paddingVertical: 10,
// //     // borderBottomWidth: 1,
// //     borderBottomColor: 'rgba(255,255,255,0.1)',
// //     marginBottom: 10,
// //   },
// //   tabButton: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 12,
// //     paddingHorizontal: 10,
// //     borderRadius: 25,
// //     // marginBottom:10
// //     // marginHorizontal: 5,
// //   },
// //   activeTab: {
// //     elevation: 2,
// //     // shadowColor: '#1e90ff',
// //     // shadowOffset: {width: 0, height: 2},
// //     shadowOpacity: 0.2,
// //     shadowRadius: 4,
// //     borderWidth: 1,
// //     borderColor: '#4F52FE',
// //   },
// //   tabText: {
// //     fontSize: 16,
// //     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
// //     marginLeft: 8,
// //   },
// //   errorText: {
// //     textAlign: 'center',
// //     marginTop: 20,
// //     color: 'red',
// //   },
// //   cameraTile: {
// //     width: imageSize,
// //     height: 170,
// //     margin: 1,
// //     backgroundColor: 'black',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   cameraText: {
// //     color: '#fff',
// //     fontSize: 10,
// //     marginTop: 4,
// //     fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
// //   },
// //   imageTile: {
// //     width: imageSize,
// //     height: 170,
// //     margin: 1,
// //     overflow: 'hidden',
// //     position: 'relative',
// //   },
// //   selectedTile: {
// //     borderWidth: 3,
// //     borderColor: '#1e90ff',
// //   },
// //   image: {
// //     width: '100%',
// //     height: '100%',
// //   },
// //   videoOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: 'rgba(0,0,0,0.3)',
// //   },
// //   checkIconContainer: {
// //     position: 'absolute',
// //     top: 5,
// //     right: 5,
// //     backgroundColor: '#1e90ff',
// //     borderRadius: 12,
// //     padding: 2,
// //   },
// //   postButton: {
// //     position: 'absolute',
// //     bottom: 30,
// //     alignSelf: 'center',
// //     backgroundColor: '#1e90ff',
// //     paddingVertical: 12,
// //     paddingHorizontal: 30,
// //     borderRadius: 25,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     elevation: 5,
// //   },
// //   postButtonText: {
// //     color: '#fff',
// //     marginLeft: 8,
// //     fontSize: 16,
// //   },
// //   previewContainer: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     zIndex: 999,
// //     flex: 1,
// //   },
// //   previewHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     paddingTop: 50,
// //     borderBottomWidth: 1,
// //     borderBottomColor: 'rgba(255,255,255,0.1)',
// //   },
// //   headerButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 8,
// //     paddingHorizontal: 12,
// //     borderRadius: 20,
// //     minWidth: 60,
// //   },
// //   headerButtonText: {
// //     marginLeft: 4,
// //     fontSize: 14,
// //     fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
// //   },
// //   previewTitle: {
// //     fontSize: 18,
// //     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
// //     textAlign: 'center',
// //   },
// //   previewContent: {
// //     flex: 1,
// //   },
// //   imagePreviewContainer: {
// //     padding: 16,
// //   },
// //   imageWrapper: {
// //     borderRadius: 16,
// //     overflow: 'hidden',
// //     elevation: 3,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //   },
// //   previewImage: {
// //     width: width,
// //     height: width,
// //   },
// //   videoPreviewContainer: {
// //     padding: 16,
// //   },
// //   previewVideo: {
// //     width: width - 32,
// //     height: width - 32,
// //     borderRadius: 16,
// //     backgroundColor: '#000',
// //   },
// //   captionContainer: {
// //     margin: 16,
// //     marginTop: 0,
// //     borderRadius: 16,
// //     padding: 16,
// //     elevation: 2,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   captionHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   captionTitle: {
// //     fontSize: 16,
// //     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
// //     marginLeft: 8,
// //   },
// //   captionInputContainer: {
// //     borderWidth: 1,
// //     borderRadius: 12,
// //     padding: 16,
// //     minHeight: 120,
// //     maxHeight: 200,
// //   },
// //   captionInput: {
// //     fontSize: 16,
// //     fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
// //     lineHeight: 22,
// //     flex: 1,
// //     textAlignVertical: 'top',
// //   },
// //   captionFooter: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginTop: 12,
// //   },
// //   characterCount: {
// //     fontSize: 12,
// //     fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
// //   },
// //   captionActions: {
// //     flexDirection: 'row',
// //     gap: 16,
// //   },
// //   emojiButton: {
// //     padding: 8,
// //   },
// //   tagButton: {
// //     padding: 8,
// //   },
// //   postButtonContainer: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     borderTopWidth: 1,
// //     backgroundColor: 'transparent',
// //   },
// //   postBtn: {
// //     backgroundColor: '#1e90ff',
// //     paddingVertical: 16,
// //     paddingHorizontal: 24,
// //     borderRadius: 25,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     elevation: 4,
// //     shadowColor: '#1e90ff',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 6,
// //   },
// //   postIcon: {
// //     marginRight: 8,
// //   },
// //   postText: {
// //     color: '#fff',
// //     fontSize: 19,
// //     fontFamily: FONTS_FAMILY.SourceSans3_Medium,
// //     fontWeight: '600',
// //   },
// // })


// // import React, { useEffect, useState } from 'react'
// // import {
// //   View,
// //   FlatList,
// //   Image,
// //   PermissionsAndroid,
// //   Platform,
// //   Text,
// //   Alert,
// //   TouchableOpacity,
// //   Dimensions,
// //   StatusBar,
// //   StyleSheet,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   ScrollView,
// //   TouchableWithoutFeedback,
// //   Keyboard,
// //   SafeAreaView,
// // } from 'react-native'
// // import { CameraRoll } from '@react-native-camera-roll/camera-roll'
// // import Icon from 'react-native-vector-icons/Ionicons'
// // import { BASE_URL, getItem } from '../../utils/Apis'
// // import useLoader from '../../utils/LoaderHook'
// // import { ToastMsg } from '../../utils/helperFunctions'
// // import { useSelector } from 'react-redux'
// // import Row from '../../components/wrapper/row'
// // import { BackIcon, PrimaryBackArrow } from '../../assets/SVGs'
// // import { FONTS_FAMILY } from '../../assets/Fonts'
// // import CustomText from '../../components/TextComponent'
// // import { launchCamera } from 'react-native-image-picker'
// // import FontAwesome from 'react-native-vector-icons/FontAwesome'
// // import ImageZoom from 'react-native-image-pan-zoom'
// // import ImagePicker from 'react-native-image-crop-picker'
// // import Video from 'react-native-video'
// // import LinearGradient from 'react-native-linear-gradient'
// // import { App_Primary_color } from '../../common/Colors/colors'

// // const screenWidth = Dimensions.get('window').width
// // const imageSize = screenWidth / 3 - 10
// // const { width, height } = Dimensions.get('window')

// // const GalleryForAddPost = ({ navigation }) => {
// //   const [photos, setPhotos] = useState([])
// //   const [videos, setVideos] = useState([])
// //   const [errorMsg, setErrorMsg] = useState('')
// //   const [selectedImage, setSelectedImage] = useState(null)
// //   const [caption, setCaption] = useState('')
// //   const [activeTab, setActiveTab] = useState('Images')
// //   const [selectedMediaType, setSelectedMediaType] = useState('image')
// //   const { isDarkMode } = useSelector(state => state.theme)
// //   const [isPreviewVisible, setIsPreviewVisible] = useState(false)
// //   const { showLoader, hideLoader } = useLoader()
  
// //   // Hashtag states
// //   const [hashtagsInput, setHashtagsInput] = useState('')
// //   const [hashtags, setHashtags] = useState([])
// //   const [suggestions, setSuggestions] = useState([])
// //   const [tagLoading, setTagLoading] = useState(false)

// //   useEffect(() => {
// //     const requestPermissionAndLoad = async () => {
// //       try {
// //         if (Platform.OS === 'android') {
// //           const permission = await PermissionsAndroid.request(
// //             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
// //             {
// //               title: 'Permission Required',
// //               message: 'App needs access to your gallery',
// //               buttonPositive: 'OK',
// //             },
// //           )

// //           const videoPermission = await PermissionsAndroid.request(
// //             PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
// //             {
// //               title: 'Video Permission Required',
// //               message: 'App needs access to your videos',
// //               buttonPositive: 'OK',
// //             },
// //           )

// //           const legacy = await PermissionsAndroid.request(
// //             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
// //           )

// //           if (
// //             permission !== PermissionsAndroid.RESULTS.GRANTED &&
// //             videoPermission !== PermissionsAndroid.RESULTS.GRANTED &&
// //             legacy !== PermissionsAndroid.RESULTS.GRANTED
// //           ) {
// //             setErrorMsg('Permission denied')
// //             return
// //           }
// //         }

// //         const imageResult = await CameraRoll.getPhotos({
// //           first: 50,
// //           assetType: 'Photos',
// //         })
// //         setPhotos(imageResult.edges)

// //         const videoResult = await CameraRoll.getPhotos({
// //           first: 50,
// //           assetType: 'Videos',
// //         })
// //         setVideos(videoResult.edges)

// //         if (imageResult.edges.length === 0 && videoResult.edges.length === 0) {
// //           setErrorMsg('No media found in gallery.')
// //         }
// //       } catch (error) {
// //         setErrorMsg(error.message || 'Something went wrong')
// //         Alert.alert('Error', error.message || 'Something went wrong')
// //       }
// //     }

// //     requestPermissionAndLoad()
// //   }, [])

// //   // Search hashtags function
// //   const SearchTags = async (tag) => {
// //     try {
// //       if (!tag.trim()) {
// //         setSuggestions([])
// //         return
// //       }
// //       setTagLoading(true)
// //       const token = await getItem('token')
// //       const response = await fetch(`${BASE_URL}/api/admin/SearchHashtags?query=${tag}`, {
// //         method: 'GET',
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json',
// //         },
// //       })
// //       const result = await response.json()
// //       setSuggestions(result?.data || [])
// //       setTagLoading(false)
// //     } catch (error) {
// //       setTagLoading(false)
// //       console.error('Error fetching tags:', error)
// //     }
// //   }

// //   // Add hashtag
// //   const addHashtag = (tag) => {
// //     tag = tag.toLowerCase().trim()
// //     if (!tag || hashtags.includes(tag)) return
// //     setHashtags([...hashtags, tag])
// //     setHashtagsInput('')
// //     setSuggestions([])
// //   }

// //   // Remove hashtag
// //   const removeTag = (tag) => {
// //     setHashtags(hashtags.filter((t) => t !== tag))
// //   }

// //   const onSubmit = async selectedMedia => {
// //     try {
// //       const token = await getItem('token')
// //       showLoader()

// //       if (!selectedMedia) {
// //         ToastMsg('No media selected')
// //         hideLoader()
// //         return
// //       }

// //       const fileName = selectedMedia.split('/').pop()
// //       const formData = new FormData()

// //       formData.append('type', selectedMediaType)

// //       const fileObject = {
// //         uri:
// //           Platform.OS === 'android'
// //             ? selectedMedia
// //             : selectedMedia.replace('file://', ''),
// //         name:
// //           fileName || `upload.${selectedMediaType === 'video' ? 'mp4' : 'jpg'}`,
// //       }

// //       if (selectedMediaType === 'video') {
// //         fileObject.type = 'video/mp4'
// //       } else {
// //         fileObject.type = 'image/jpeg'
// //       }

// //       formData.append('file', fileObject)
// //       formData.append('Caption', caption || 'No caption')
// //       formData.append('Hashtags', JSON.stringify(hashtags))

// //       const response = await fetch(`${BASE_URL}/api/user/AddPost`, {
// //         method: 'POST',
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: formData,
// //       })

// //       if (!response.ok)
// //         throw new Error(`Server responded with status ${response.status}`)
// //       const text = await response.text()

// //       try {
// //         const result = JSON.parse(text)
// //         ToastMsg(result?.message)
// //         navigation.navigate('Tab')
// //       } catch (err) {
// //         console.error('Error parsing response:', err)
// //         ToastMsg('Upload failed: Invalid server response')
// //       } finally {
// //         hideLoader()
// //       }
// //     } catch (error) {
// //       console.log('Upload failed:', error.message || error)
// //       ToastMsg('Something went wrong')
// //       hideLoader()
// //     }
// //   }

// //   const handleSelect = uri => {
// //     setSelectedImage(prev => (prev === uri ? null : uri))
// //     setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
// //     setIsPreviewVisible(true)
// //   }

// //   const handlePostStory = () => {
// //     onSubmit(selectedImage)
// //   }

// //   const handleOpenCamera = () => {
// //     const options = {
// //       mediaType: activeTab === 'Videos' ? 'video' : 'photo',
// //       cameraType: 'back',
// //       maxWidth: 100,
// //       maxHeight: 100,
// //       quality: 0.4,
// //       videoQuality: 'medium',
// //       durationLimit: 60,
// //     }

// //     launchCamera(options, response => {
// //       if (response.didCancel) {
// //         console.log('User cancelled camera')
// //       } else if (response.errorCode) {
// //         console.log('Camera error:', response.errorMessage)
// //         ToastMsg('Camera error: ' + response.errorMessage)
// //       } else {
// //         const uri = response?.assets?.[0]?.uri
// //         if (uri) {
// //           setSelectedImage(uri)
// //           setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
// //           setIsPreviewVisible(true)
// //         }
// //       }
// //     })
// //   }

// //   const handleCropImage = async () => {
// //     if (selectedMediaType !== 'image') {
// //       ToastMsg('Cropping is only available for images')
// //       return
// //     }

// //     try {
// //       const cropped = await ImagePicker.openCropper({
// //         path: selectedImage,
// //         width: 300,
// //         height: 200,
// //         cropping: true,
// //         cropperCircleOverlay: false,
// //         freeStyleCropEnabled: true,
// //         hideBottomControls: false,
// //         enableRotationGesture: true,
// //         statusBarTranslucent: false,
// //         cropperStatusBarColor: isDarkMode ? '#000000' : '#ffffff',
// //         cropperToolbarColor: isDarkMode ? '#1a1a1a' : '#ffffff',
// //         cropperActiveWidgetColor: '#1e90ff',
// //         cropperToolbarWidgetColor: isDarkMode ? '#ffffff' : '#000000',
// //         cropperToolbarTitle: 'Edit Photo',
// //         includeBase64: false,
// //         includeExif: false,
// //         avoidEmptySpaceAroundImage: true,
// //         showCropGuidelines: true,
// //         showCropFrame: true,
// //         compressImageQuality: 1,
// //         forceJpg: true,
// //         useFrontCamera: false,
// //         writeTempFile: true,
// //         ...(Platform.OS === 'android' && {
// //           mediaType: 'photo',
// //           smartAlbums: [
// //             'UserLibrary',
// //             'PhotoStream',
// //             'Panoramas',
// //             'Videos',
// //             'Bursts',
// //           ],
// //         }),
// //       })

// //       if (cropped?.path) {
// //         setSelectedImage(cropped.path)
// //       }
// //     } catch (err) {
// //       console.log('Crop cancelled or failed:', err?.message)
// //       ToastMsg('Crop cancelled')
// //     }
// //   }

// //   const handleVideoTrim = async () => {
// //     ToastMsg('Video trimming feature coming soon')
// //   }

// //   const getCurrentData = () => {
// //     return activeTab === 'Images' ? photos : videos
// //   }

// //   const renderItem = ({ item, index }) => {
// //     if (index === 0) {
// //       return (
// //         <TouchableOpacity onPress={handleOpenCamera} activeOpacity={0.8}>
// //           <View style={styles.cameraTile}>
// //             <FontAwesome
// //               name={activeTab === 'Videos' ? 'video-camera' : 'camera'}
// //               size={20}
// //               color='#fff'
// //             />
// //             <Text style={styles.cameraText}>
// //               {activeTab === 'Videos' ? 'Record' : 'Camera'}
// //             </Text>
// //           </View>
// //         </TouchableOpacity>
// //       )
// //     }

// //     const uri = item.node.image.uri
// //     const isSelected = selectedImage === uri
// //     const isVideo = activeTab === 'Videos'

// //     return (
// //       <TouchableOpacity onPress={() => handleSelect(uri)} activeOpacity={0.8}>
// //         <View style={[styles.imageTile, isSelected && styles.selectedTile]}>
// //           <Image source={{ uri }} style={styles.image} resizeMode='cover' />
// //           {isVideo && (
// //             <View style={styles.videoOverlay}>
// //               <Icon
// //                 name='play-circle'
// //                 size={24}
// //                 color='rgba(255,255,255,0.8)'
// //               />
// //             </View>
// //           )}
// //           {isSelected && (
// //             <View style={styles.checkIconContainer}>
// //               <Icon name='checkmark' size={16} color='#fff' />
// //             </View>
// //           )}
// //         </View>
// //       </TouchableOpacity>
// //     )
// //   }

// //   const renderTabBar = () => (
// //     <View style={styles.tabContainer}>
// //       <TouchableOpacity
// //         style={[
// //           styles.tabButton,
// //           activeTab === 'Images' && styles.activeTab,
// //         ]}
// //         onPress={() => setActiveTab('Images')}>
// //         <LinearGradient
// //           // colors={['#FC14CB', '#4F52FE']}
// //           colors={['#21B7FF', '#0084F8']}

// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={[styles.tabButton, { borderRadius: 8 }]}>
// //           <Icon
// //             name='image-outline'
// //             size={20}
// //             color={
// //               activeTab === 'Images' ? '#fff' : isDarkMode ? '#fff' : '#333'
// //             }
// //           />
// //           <Text
// //             style={[
// //               styles.tabText,
// //               {
// //                 color:
// //                   activeTab === 'Images'
// //                     ? '#fff'
// //                     : isDarkMode
// //                       ? '#fff'
// //                       : '#333',
// //               },
// //             ]}>
// //             Images
// //           </Text>
// //         </LinearGradient>
// //       </TouchableOpacity>

// //       <TouchableOpacity
// //         style={[
// //           styles.tabButton,
// //           activeTab === 'Videos' && styles.activeTab,
// //         ]}
// //         onPress={() => setActiveTab('Videos')}>
// //         <LinearGradient
// //           // colors={['#FC14CB', '#4F52FE']}
// //           colors={['#21B7FF', '#0084F8']}

// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={[styles.tabButton, { borderRadius: 8 }]}>
// //           <Icon
// //             name='videocam-outline'
// //             size={20}
// //             color={
// //               activeTab === 'Videos' ? '#fff' : isDarkMode ? '#fff' : '#333'
// //             }
// //           />
// //           <Text
// //             style={[
// //               styles.tabText,
// //               {
// //                 color:
// //                   activeTab === 'Videos'
// //                     ? '#fff'
// //                     : isDarkMode
// //                       ? '#fff'
// //                       : '#333',
// //               },
// //             ]}>
// //             Videos
// //           </Text>
// //         </LinearGradient>
// //       </TouchableOpacity>
// //     </View>
// //   )

// //   const renderHeader = () => (
// //     <Row style={styles.header}>
// //       <TouchableOpacity onPress={() => navigation.goBack()}>
// //         {isDarkMode ? <BackIcon /> : <PrimaryBackArrow />}
// //       </TouchableOpacity>
// //       <CustomText style={styles.headerText}>Select Media</CustomText>
// //     </Row>
// //   )

// //   const renderPreviewMedia = () => {
// //     if (selectedMediaType === 'video') {
// //       return (
// //         <View style={styles.videoPreviewContainer}>
// //           <Video
// //             source={{ uri: selectedImage }}
// //             style={styles.previewVideo}
// //             resizeMode='contain'
// //             controls={true}
// //             paused={false}
// //             repeat={true}
// //             muted={false}
// //             onError={error => {
// //               console.log('Video error:', error)
// //               ToastMsg('Error loading video')
// //             }}
// //           />
// //         </View>
// //       )
// //     } else {
// //       return (
// //         <View style={styles.imagePreviewContainer}>
// //           <View
// //             style={[
// //               styles.imageWrapper,
// //               { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
// //             ]}>
// //             <ImageZoom
// //               cropWidth={width}
// //               cropHeight={width}
// //               imageWidth={width}
// //               imageHeight={width}
// //               enableSwipeDown={false}
// //               enableDoubleClickZoom={true}
// //               minScale={0.8}
// //               maxScale={3}>
// //               <Image
// //                 source={{ uri: selectedImage }}
// //                 style={styles.previewImage}
// //                 resizeMode='contain'
// //               />
// //             </ImageZoom>
// //           </View>
// //         </View>
// //       )
// //     }
// //   }

// //   return (
// //     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
// //       <View style={{ flex: 1, backgroundColor: isDarkMode ? '#252525' : '#fff' }}>
// //         <StatusBar
// //           backgroundColor='transparent'
// //           translucent
// //           barStyle={isDarkMode ? 'light-content' : 'dark-content'}
// //         />
// //         {renderHeader()}
// //         {renderTabBar()}

// //         {errorMsg ? (
// //           <Text style={styles.errorText}>{errorMsg}</Text>
// //         ) : (
// //           <>
// //             <FlatList
// //               data={getCurrentData()}
// //               keyExtractor={(item, index) => index.toString()}
// //               numColumns={3}
// //               renderItem={renderItem}
// //               contentContainerStyle={{ paddingBottom: 100, alignSelf: 'center' }}
// //               key={activeTab}
// //             />

// //             {selectedImage && !isPreviewVisible && (
// //               <TouchableOpacity
// //                 style={styles.postButton}
// //                 onPress={() => setIsPreviewVisible(true)}>
// //                 <Icon name='arrow-up-circle-outline' size={20} color='#fff' />
// //                 <Text style={styles.postButtonText}>Next</Text>
// //               </TouchableOpacity>
// //             )}
// //           </>
// //         )}

// //         {isPreviewVisible && selectedImage && (
// //           <View
// //             style={[
// //               styles.previewContainer,
// //               { backgroundColor: isDarkMode ? '#000' : '#fff' },
// //             ]}>
// //             <KeyboardAvoidingView
// //               style={{ flex: 1 }}
// //               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
// //               keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
// //               <View
// //                 style={[
// //                   styles.previewHeader,
// //                   { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
// //                 ]}>
// //                 <TouchableOpacity
// //                   onPress={() => {
// //                     setIsPreviewVisible(false)
// //                     setCaption('')
// //                     setHashtags([])
// //                     setHashtagsInput('')
// //                   }}
// //                   style={styles.headerButton}>
// //                   <Icon
// //                     name='chevron-back'
// //                     size={24}
// //                     color={isDarkMode ? '#fff' : '#333'}
// //                   />
// //                   <Text
// //                     style={[
// //                       styles.headerButtonText,
// //                       { color: isDarkMode ? '#fff' : '#333' },
// //                     ]}>
// //                     Back
// //                   </Text>
// //                 </TouchableOpacity>

// //                 <Text
// //                   style={[
// //                     styles.previewTitle,
// //                     { color: isDarkMode ? '#fff' : '#333' },
// //                   ]}>
// //                   Create Post
// //                 </Text>

// //                 <TouchableOpacity
// //                   onPress={
// //                     selectedMediaType === 'video'
// //                       ? handleVideoTrim
// //                       : handleCropImage
// //                   }
// //                   style={styles.headerButton}>
// //                   <Icon
// //                     name={selectedMediaType === 'video' ? 'cut' : 'crop'}
// //                     size={20}
// //                     color={isDarkMode ? '#fff' : '#333'}
// //                   />
// //                   <Text
// //                     style={[
// //                       styles.headerButtonText,
// //                       { color: isDarkMode ? '#fff' : '#333' },
// //                     ]}>
// //                     {selectedMediaType === 'video' ? 'Trim' : 'Crop'}
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>

// //               <ScrollView
// //                 style={styles.previewContent}
// //                 showsVerticalScrollIndicator={false}
// //                 keyboardShouldPersistTaps='handled'
// //                 contentContainerStyle={{ paddingBottom: 250 }}>
// //                 {renderPreviewMedia()}

// //                 <View
// //                   style={[
// //                     styles.captionContainer,
// //                     { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
// //                   ]}>
// //                   <View style={styles.captionHeader}>
// //                     <Icon
// //                       name='create-outline'
// //                       size={20}
// //                       color={isDarkMode ? '#fff' : '#333'}
// //                     />
// //                     <Text
// //                       style={[
// //                         styles.captionTitle,
// //                         { color: isDarkMode ? '#fff' : '#333' },
// //                       ]}>
// //                       Write a caption
// //                     </Text>
// //                   </View>

// //                   <View
// //                     style={[
// //                       styles.captionInputContainer,
// //                       {
// //                         backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
// //                         borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9',
// //                       },
// //                     ]}>
// //                     <TextInput
// //                       style={[
// //                         styles.captionInput,
// //                         { color: isDarkMode ? '#fff' : '#333' },
// //                       ]}
// //                       placeholder="What's on your mind?"
// //                       placeholderTextColor={isDarkMode ? '#888' : '#666'}
// //                       value={caption}
// //                       onChangeText={setCaption}
// //                       multiline
// //                       maxLength={2200}
// //                       textAlignVertical='top'
// //                       autoCorrect={true}
// //                       spellCheck={true}
// //                     />
// //                   </View>

// //                   <View style={styles.captionFooter}>
// //                     <Text
// //                       style={[
// //                         styles.characterCount,
// //                         { color: isDarkMode ? '#888' : '#666' },
// //                       ]}>
// //                       {caption.length}/2200
// //                     </Text>
// //                     <View style={styles.captionActions}>
// //                       <TouchableOpacity style={styles.emojiButton}>
// //                         <Icon
// //                           name='happy-outline'
// //                           size={20}
// //                           color={isDarkMode ? '#888' : '#666'}
// //                         />
// //                       </TouchableOpacity>
// //                       <TouchableOpacity style={styles.tagButton}>
// //                         <Icon
// //                           name='pricetag-outline'
// //                           size={20}
// //                           color={isDarkMode ? '#888' : '#666'}
// //                         />
// //                       </TouchableOpacity>
// //                     </View>
// //                   </View>
// //                 </View>

// //                 {/* Hashtag Section */}
// //                 <View
// //                   style={[
// //                     styles.captionContainer,
// //                     { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
// //                   ]}>
// //                   <View style={styles.captionHeader}>
// //                     <Icon
// //                       name='pricetag'
// //                       size={20}
// //                       color={isDarkMode ? '#fff' : '#333'}
// //                     />
// //                     <Text
// //                       style={[
// //                         styles.captionTitle,
// //                         { color: isDarkMode ? '#fff' : '#333' },
// //                       ]}>
// //                       Type hashtags
// //                     </Text>
// //                   </View>

// //                   {/* Display added hashtags */}
// //                   {hashtags.length > 0 && (
// //                     <View style={styles.hashtagsDisplay}>
// //                       {hashtags.map((tag, index) => (
// //                         <View
// //                           key={index}
// //                           style={[
// //                             styles.hashtagChip,
// //                             { backgroundColor: isDarkMode ? '#2a2a2a' : '#e8f4ff' },
// //                           ]}>
// //                           <Text
// //                             style={[
// //                               styles.hashtagText,
// //                               { color: isDarkMode ? '#fff' : '#1e90ff' },
// //                             ]}>
// //                             #{tag}
// //                           </Text>
// //                           <TouchableOpacity onPress={() => removeTag(tag)}>
// //                             <Icon name='close-circle' size={18} color='#ff4444' />
// //                           </TouchableOpacity>
// //                         </View>
// //                       ))}
// //                     </View>
// //                   )}

// //                   <Row style={{ width: '100%', gap: 10, alignItems: 'center' }}>
// //                     <View
// //                       style={[
// //                         styles.captionInputContainer,
// //                         {
// //                           borderWidth: 1,
// //                           borderRadius: 12,
// //                           padding: 3,
// //                           minHeight: 48,
// //                           flex: 1,
// //                         },
// //                         {
// //                           backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
// //                           borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9',
// //                         },
// //                       ]}>
// //                       <TextInput
// //                         style={[
// //                           styles.captionInput,
// //                           { color: isDarkMode ? '#fff' : '#333' },
// //                         ]}
// //                         placeholder="Enter hashtags"
// //                         placeholderTextColor={isDarkMode ? '#888' : '#666'}
// //                         value={hashtagsInput}
// //                         onChangeText={(text) => {
// //                           setHashtagsInput(text)
// //                           SearchTags(text)
// //                         }}
// //                         maxLength={100}
// //                         textAlignVertical='center'
// //                         autoCorrect={false}
// //                         spellCheck={false}
// //                       />
// //                     </View>

// //                     <TouchableOpacity
// //                       style={{
// //                         backgroundColor: '#12208B',
// //                         paddingVertical: 12,
// //                         paddingHorizontal: 16,
// //                         borderRadius: 8,
// //                       }}
// //                       onPress={() => addHashtag(hashtagsInput)}>
// //                       <CustomText
// //                         style={{
// //                           fontFamily: FONTS_FAMILY.SourceSans3_Medium,
// //                         }}>
// //                         Add
// //                       </CustomText>
// //                     </TouchableOpacity>
// //                   </Row>

// //                   {/* Suggestions dropdown */}
// //                   {suggestions.length > 0 && (
// //                     <View
// //                       style={[
// //                         styles.suggestionsContainer,
// //                         {
// //                           backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
// //                           borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9',
// //                         },
// //                       ]}>
// //                       <ScrollView
// //                         style={{ maxHeight: 150 }}
// //                         nestedScrollEnabled={true}>
// //                         {suggestions.map((item, index) => (
// //                           <TouchableOpacity
// //                             key={index}
// //                             style={styles.suggestionItem}
// //                             onPress={() => addHashtag(item.Tag)}>
// //                             <Text
// //                               style={[
// //                                 styles.suggestionText,
// //                                 { color: isDarkMode ? '#fff' : '#333' },
// //                               ]}>
// //                               #{item.Tag}
// //                             </Text>
// //                           </TouchableOpacity>
// //                         ))}
// //                       </ScrollView>
// //                     </View>
// //                   )}
// //                 </View>
// //               </ScrollView>

// //               <View
// //                 style={[
// //                   styles.postButtonContainer,
// //                   {
// //                     backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
// //                     borderTopColor: isDarkMode ? '#333' : '#e1e5e9',
// //                   },
// //                 ]}>
// //                 <TouchableOpacity
// //                   onPress={handlePostStory}
// //                   disabled={!selectedImage}>
// //                   <LinearGradient
// //                     // colors={['#FC14CB', '#4F52FE']}
// //                               colors={['#21B7FF', '#0084F8']}

// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 1 }}
// //                     style={[
// //                       { borderRadius: 8 },
// //                       styles.postBtn,
// //                       { opacity: selectedImage ? 1 : 0.5 },
// //                     ]}>
// //                     <Icon
// //                       name='send'
// //                       size={18}
// //                       color='#fff'
// //                       style={styles.postIcon}
// //                     />
// //                     <Text style={styles.postText}>
// //                       Share {selectedMediaType === 'video' ? 'Video' : 'Post'}
// //                     </Text>
// //                   </LinearGradient>
// //                 </TouchableOpacity>
// //               </View>
// //             </KeyboardAvoidingView>
// //           </View>
// //         )}
// //       </View>
// //     </TouchableWithoutFeedback>
// //   )
// // }

// // export default GalleryForAddPost

// // const styles = StyleSheet.create({
// //   header: {
// //     paddingTop: 50,
// //     paddingHorizontal: 20,
// //     gap: 90,
// //     paddingBottom: 20,
// //   },
// //   headerText: {
// //     fontSize: 20,
// //     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
// //   },
// //   tabContainer: {
// //     flexDirection: 'row',
// //     paddingHorizontal: 10,
// //     borderBottomColor: 'rgba(255,255,255,0.1)',
// //     marginBottom: 10,
// //   },
// //   tabButton: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 12,
// //     paddingHorizontal: 10,
// //     borderRadius: 25,
// //   },
// //   activeTab: {
// //     // elevation: 1,
// //     // shadowOpacity: 0.2,
// //     shadowRadius: 4,
// //     // borderWidth: 1,
// //     borderColor: '#4F52FE',
// //   },
// //   tabText: {
// //     fontSize: 16,
// //     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
// //     marginLeft: 8,
// //   },
// //   errorText: {
// //     textAlign: 'center',
// //     marginTop: 20,
// //     color: 'red',
// //   },
// //   cameraTile: {
// //     width: imageSize,
// //     height: 170,
// //     margin: 1,
// //     backgroundColor: 'black',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   cameraText: {
// //     color: '#fff',
// //     fontSize: 10,
// //     marginTop: 4,
// //     fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
// //   },
// //   imageTile: {
// //     width: imageSize,
// //     height: 170,
// //     margin: 1,
// //     overflow: 'hidden',
// //     position: 'relative',
// //   },
// //   selectedTile: {
// //     borderWidth: 3,
// //     borderColor: '#1e90ff',
// //   },
// //   image: {
// //     width: '100%',
// //     height: '100%',
// //   },
// //   videoOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: 'rgba(0,0,0,0.3)',
// //   },
// //   checkIconContainer: {
// //     position: 'absolute',
// //     top: 5,
// //     right: 5,
// //     backgroundColor: '#1e90ff',
// //     borderRadius: 12,
// //     padding: 2,
// //   },
// //   postButton: {
// //     position: 'absolute',
// //     bottom: 30,
// //     alignSelf: 'center',
// //     backgroundColor: '#1e90ff',
// //     paddingVertical: 12,
// //     paddingHorizontal: 30,
// //     borderRadius: 25,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     elevation: 5,
// //   },
// //   postButtonText: {
// //     color: '#fff',
// //     marginLeft: 8,
// //     fontSize: 16,
// //   },
// //   previewContainer: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     zIndex: 999,
// //     flex: 1,
// //   },
// //   previewHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     paddingTop: 50,
// //     borderBottomWidth: 1,
// //     borderBottomColor: 'rgba(255,255,255,0.1)',
// //   },
// //   headerButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 8,
// //     paddingHorizontal: 12,
// //     borderRadius: 20,
// //     minWidth: 60,
// //   },
// //   headerButtonText: {
// //     marginLeft: 4,
// //     fontSize: 14,
// //     fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
// //   },
// //   previewTitle: {
// //     fontSize: 18,
// //     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
// //     textAlign: 'center',
// //   },
// //   previewContent: {
// //     flex: 1,
// //   },
// //   imagePreviewContainer: {
// //     padding: 16,
// //   },
// //   imageWrapper: {
// //     borderRadius: 16,
// //     overflow: 'hidden',
// //     elevation: 3,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //   },
// //   previewImage: {
// //     width: width,
// //     height: width,
// //   },
// //   videoPreviewContainer: {
// //     padding: 16,
// //   },
// //   previewVideo: {
// //     width: width - 32,
// //     height: width - 32,
// //     borderRadius: 16,
// //     backgroundColor: '#000',
// //   },
// //   captionContainer: {
// //     margin: 16,
// //     marginTop: 0,
// //     borderRadius: 16,
// //     padding: 16,
// //     elevation: 2,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   captionHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   captionTitle: {
// //     fontSize: 16,
// //     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
// //     marginLeft: 8,
// //   },
// //   captionInputContainer: {
// //     borderWidth: 1,
// //     borderRadius: 12,
// //     padding: 16,
// //     minHeight: 120,
// //     maxHeight: 200,
// //   },
// //   captionInput: {
// //     fontSize: 16,
// //     fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
// //     lineHeight: 22,
// //     flex: 1,
// //     textAlignVertical: 'top',
// //   },
// //   captionFooter: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginTop: 12,
// //   },
// //   characterCount: {
// //     fontSize: 12,
// //     fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
// //   },
// //   captionActions: {
// //     flexDirection: 'row',
// //     gap: 16,
// //   },
// //   emojiButton: {
// //     padding: 8,
// //   },
// //   tagButton: {
// //     padding: 8,
// //   },
// //   hashtagsDisplay: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     gap: 8,
// //     marginBottom: 12,
// //   },
// //   hashtagChip: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 6,
// //     paddingHorizontal: 12,
// //     borderRadius: 20,
// //     gap: 6,
// //   },
// //   hashtagText: {
// //     fontSize: 14,
// //     fontFamily: FONTS_FAMILY.SourceSans3_Medium,
// //   },
// //   suggestionsContainer: {
// //     marginTop: 10,
// //     borderWidth: 1,
// //     borderRadius: 12,
// //     overflow: 'hidden',
// //   },
// //   suggestionItem: {
// //     paddingVertical: 12,
// //     paddingHorizontal: 16,
// //     borderBottomWidth: 1,
// //     borderBottomColor: 'rgba(255,255,255,0.05)',
// //   },
// //   suggestionText: {
// //     fontSize: 14,
// //     fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
// //   },
// //   postButtonContainer: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 10,
// //     borderTopWidth: 1,
// //     backgroundColor: 'transparent',
// //   },
// //   postBtn: {
// //     backgroundColor: '#1e90ff',
// //     paddingVertical: 13,
// //     paddingHorizontal: 24,
// //     borderRadius: 25,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     elevation: 4,
// //     shadowColor: '#1e90ff',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 6,
// //   },
// //   postIcon: {
// //     marginRight: 8,
// //   },
// //   postText: {
// //     color: '#fff',
// //     fontSize: 19,
// //     fontFamily: FONTS_FAMILY.SourceSans3_Medium,
// //     fontWeight: '600',
// //   },
// // })


// // PART 1 - Main Component Code
// // Copy this ENTIRE file - Replace your GalleryForAddPost.js with this

// import React, { useEffect, useState } from 'react'
// import {
//   View, FlatList, Image, PermissionsAndroid, Platform, Text, Alert,
//   TouchableOpacity, Dimensions, StatusBar, StyleSheet, TextInput,
//   KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard,
// } from 'react-native'
// import { CameraRoll } from '@react-native-camera-roll/camera-roll'
// import Icon from 'react-native-vector-icons/Ionicons'
// import { BASE_URL, getItem } from '../../utils/Apis'
// import useLoader from '../../utils/LoaderHook'
// import { ToastMsg } from '../../utils/helperFunctions'
// import { useSelector } from 'react-redux'
// import Row from '../../components/wrapper/row'
// import { BackIcon, PrimaryBackArrow } from '../../assets/SVGs'
// import { FONTS_FAMILY } from '../../assets/Fonts'
// import CustomText from '../../components/TextComponent'
// import { launchCamera } from 'react-native-image-picker'
// import FontAwesome from 'react-native-vector-icons/FontAwesome'
// import ImageZoom from 'react-native-image-pan-zoom'
// import ImagePicker from 'react-native-image-crop-picker'
// import Video from 'react-native-video'
// import LinearGradient from 'react-native-linear-gradient'
// import Slider from '@react-native-community/slider' // Install: npm i @react-native-community/slider

// const screenWidth = Dimensions.get('window').width
// const imageSize = screenWidth / 3 - 10
// const { width, height } = Dimensions.get('window')

// const GalleryForAddPost = ({ navigation }) => {
//   const [photos, setPhotos] = useState([])
//   const [videos, setVideos] = useState([])
//   const [errorMsg, setErrorMsg] = useState('')
//   const [selectedImage, setSelectedImage] = useState(null)
//   const [caption, setCaption] = useState('')
//   const [activeTab, setActiveTab] = useState('Images')
//   const [selectedMediaType, setSelectedMediaType] = useState('image')
//   const { isDarkMode } = useSelector(state => state.theme)
//   const [isPreviewVisible, setIsPreviewVisible] = useState(false)
//   const { showLoader, hideLoader } = useLoader()
  
//   const [hashtagsInput, setHashtagsInput] = useState('')
//   const [hashtags, setHashtags] = useState([])
//   const [suggestions, setSuggestions] = useState([])
//   const [tagLoading, setTagLoading] = useState(false)

//   // NEW: Filter states
//   const [showFilters, setShowFilters] = useState(false)
//   const [filterTab, setFilterTab] = useState('filters')
//   const [filters, setFilters] = useState({ brightness: 1, contrast: 1, saturation: 1 })
//   const [selectedFilter, setSelectedFilter] = useState('none')

//   const presetFilters = [
//     { name: 'None', brightness: 1, contrast: 1, saturation: 1 },
//     { name: 'Clarendon', brightness: 1.1, contrast: 1.2, saturation: 1.25 },
//     { name: 'Gingham', brightness: 1.05, contrast: 0.95, saturation: 0.9 },
//     { name: 'Moon', brightness: 1.1, contrast: 1.1, saturation: 0 },
//     { name: 'Lark', brightness: 1.1, contrast: 0.9, saturation: 1.1 },
//     { name: 'Reyes', brightness: 1.1, contrast: 0.85, saturation: 0.75 },
//     { name: 'Juno', brightness: 1.1, contrast: 1.1, saturation: 1.2 },
//     { name: 'Slumber', brightness: 1.05, contrast: 1.05, saturation: 0.75 },
//     { name: 'Crema', brightness: 1.1, contrast: 0.9, saturation: 0.9 },
//       { name: 'B&W', brightness: 1, contrast: 1.2, saturation: 0 },
//   { name: 'Noir', brightness: 0.9, contrast: 1.3, saturation: 0 }
//   ]

//   useEffect(() => {
//     const requestPermissionAndLoad = async () => {
//       try {
//         if (Platform.OS === 'android') {
//           await PermissionsAndroid.requestMultiple([
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           ])
//         }
//         const imageResult = await CameraRoll.getPhotos({ first: 50, assetType: 'Photos' })
//         setPhotos(imageResult.edges)
//         const videoResult = await CameraRoll.getPhotos({ first: 50, assetType: 'Videos' })
//         setVideos(videoResult.edges)
//       } catch (error) {
//         setErrorMsg(error.message || 'Something went wrong')
//       }
//     }
//     requestPermissionAndLoad()
//   }, [])

//   const SearchTags = async (tag) => {
//     try {
//       if (!tag.trim()) { setSuggestions([]); return }
//       setTagLoading(true)
//       const token = await getItem('token')
//       const response = await fetch(`${BASE_URL}/api/admin/SearchHashtags?query=${tag}`, {
//         method: 'GET',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//       })
//       const result = await response.json()
//       setSuggestions(result?.data || [])
//       setTagLoading(false)
//     } catch (error) {
//       setTagLoading(false)
//     }
//   }

//   const addHashtag = (tag) => {
//     tag = tag.toLowerCase().trim()
//     if (!tag || hashtags.includes(tag)) return
//     setHashtags([...hashtags, tag])
//     setHashtagsInput('')
//     setSuggestions([])
//   }

//   const removeTag = (tag) => setHashtags(hashtags.filter((t) => t !== tag))

//   const applyPresetFilter = (preset) => {
//     setSelectedFilter(preset.name)
//     setFilters({ brightness: preset.brightness, contrast: preset.contrast, saturation: preset.saturation })
//   }

//   const resetFilters = () => {
//     setFilters({ brightness: 1, contrast: 1, saturation: 1 })
//     setSelectedFilter('none')
//   }

//   const onSubmit = async selectedMedia => {
//     try {
//       const token = await getItem('token')
//       showLoader()
//       if (!selectedMedia) { ToastMsg('No media selected'); hideLoader(); return }

//       const fileName = selectedMedia.split('/').pop()
//       const formData = new FormData()
//       formData.append('type', selectedMediaType)
//       formData.append('file', {
//         uri: Platform.OS === 'android' ? selectedMedia : selectedMedia.replace('file://', ''),
//         name: fileName || `upload.${selectedMediaType === 'video' ? 'mp4' : 'jpg'}`,
//         type: selectedMediaType === 'video' ? 'video/mp4' : 'image/jpeg',
//       })
//       formData.append('Caption', caption || 'No caption')
//       formData.append('Hashtags', JSON.stringify(hashtags))
//       formData.append('Filter', selectedFilter)

//       const response = await fetch(`${BASE_URL}/api/user/AddPost`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       })
//       if (!response.ok) throw new Error(`Server responded with status ${response.status}`)
//       const result = JSON.parse(await response.text())
//       ToastMsg(result?.message)
//       navigation.navigate('Tab')
//     } catch (error) {
//       ToastMsg('Something went wrong')
//     } finally {
//       hideLoader()
//     }
//   }

//   const handleSelect = uri => {
//     setSelectedImage(prev => (prev === uri ? null : uri))
//     setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
//     setIsPreviewVisible(true)
//   }

//   const handleOpenCamera = () => {
//     launchCamera({
//       mediaType: activeTab === 'Videos' ? 'video' : 'photo',
//       cameraType: 'back', quality: 0.4,
//     }, response => {
//       if (!response.didCancel && !response.errorCode) {
//         const uri = response?.assets?.[0]?.uri
//         if (uri) {
//           setSelectedImage(uri)
//           setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
//           setIsPreviewVisible(true)
//         }
//       }
//     })
//   }

//   const handleCropImage = async () => {
//     if (selectedMediaType !== 'image') return ToastMsg('Cropping is only available for images')
//     try {
//       const cropped = await ImagePicker.openCropper({
//         path: selectedImage, width: 300, height: 200, cropping: true,
//       })
//       if (cropped?.path) setSelectedImage(cropped.path)
//     } catch (err) {
//       ToastMsg('Crop cancelled')
//     }
//   }

//   const renderItem = ({ item, index }) => {
//     if (index === 0) {
//       return (
//         <TouchableOpacity onPress={handleOpenCamera} activeOpacity={0.8}>
//           <View style={styles.cameraTile}>
//             <FontAwesome name={activeTab === 'Videos' ? 'video-camera' : 'camera'} size={20} color='#fff' />
//             <Text style={styles.cameraText}>{activeTab === 'Videos' ? 'Record' : 'Camera'}</Text>
//           </View>
//         </TouchableOpacity>
//       )
//     }
//     const uri = item.node.image.uri
//     const isSelected = selectedImage === uri
//     return (
//       <TouchableOpacity onPress={() => handleSelect(uri)} activeOpacity={0.8}>
//         <View style={[styles.imageTile, isSelected && styles.selectedTile]}>
//           <Image source={{ uri }} style={styles.image} resizeMode='cover' />
//           {activeTab === 'Videos' && (
//             <View style={styles.videoOverlay}>
//               <Icon name='play-circle' size={24} color='rgba(255,255,255,0.8)' />
//             </View>
//           )}
//           {isSelected && (
//             <View style={styles.checkIconContainer}>
//               <Icon name='checkmark' size={16} color='#fff' />
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     )
//   }

// // PART 2 - Add this code after the renderItem function in Part 1
// // This continues from where Part 1 ended

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={{ flex: 1, backgroundColor: isDarkMode ? '#252525' : '#fff' }}>
//         <StatusBar backgroundColor='transparent' translucent barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        
//         {/* Header */}
//         <Row style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             {isDarkMode ? <BackIcon /> : <PrimaryBackArrow />}
//           </TouchableOpacity>
//           <CustomText style={styles.headerText}>Select Media</CustomText>
//         </Row>

//         {/* Tabs */}
//         <View style={styles.tabContainer}>
//           {['Images', 'Videos'].map(tab => (
//             <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tab && styles.activeTab]}
//               onPress={() => setActiveTab(tab)}>
//               <LinearGradient colors={['#21B7FF', '#0084F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//                 style={[styles.tabButton, { borderRadius: 8 }]}>
//                 <Icon name={tab === 'Images' ? 'image-outline' : 'videocam-outline'} size={20} 
//                   color={activeTab === tab ? '#fff' : isDarkMode ? '#fff' : '#333'} />
//                 <Text style={[styles.tabText, { color: activeTab === tab ? '#fff' : isDarkMode ? '#fff' : '#333' }]}>
//                   {tab}
//                 </Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : (
//           <>
//             <FlatList data={activeTab === 'Images' ? photos : videos} keyExtractor={(item, index) => index.toString()}
//               numColumns={3} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 100, alignSelf: 'center' }}
//               key={activeTab} />
//             {selectedImage && !isPreviewVisible && (
//               <TouchableOpacity style={styles.postButton} onPress={() => setIsPreviewVisible(true)}>
//                 <Icon name='arrow-up-circle-outline' size={20} color='#fff' />
//                 <Text style={styles.postButtonText}>Next</Text>
//               </TouchableOpacity>
//             )}
//           </>
//         )}

//         {/* Preview Modal */}
//         {isPreviewVisible && selectedImage && (
//           <View style={[styles.previewContainer, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
//             <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              
//               {/* Preview Header */}
//               <View style={[styles.previewHeader, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
//                 <TouchableOpacity onPress={() => {
//                   setIsPreviewVisible(false); setCaption(''); setHashtags([]); setHashtagsInput('')
//                   setShowFilters(false); resetFilters()
//                 }} style={styles.headerButton}>
//                   <Icon name='chevron-back' size={24} color={isDarkMode ? '#fff' : '#333'} />
//                   <Text style={[styles.headerButtonText, { color: isDarkMode ? '#fff' : '#333' }]}>Back</Text>
//                 </TouchableOpacity>

//                 <Text style={[styles.previewTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Create Post</Text>

//                 <TouchableOpacity onPress={() => {
//                   if (selectedMediaType === 'image') setShowFilters(!showFilters)
//                   else ToastMsg('Video trimming coming soon')
//                 }} style={styles.headerButton}>
//                   <Icon name={selectedMediaType === 'video' ? 'cut' : 'color-filter'} size={20} 
//                     color={isDarkMode ? '#fff' : '#333'} />
//                   <Text style={[styles.headerButtonText, { color: isDarkMode ? '#fff' : '#333' }]}>
//                     {selectedMediaType === 'video' ? 'Trim' : 'Filters'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false} 
//                 keyboardShouldPersistTaps='handled' contentContainerStyle={{ paddingBottom: 250 }}>
                
//                 {/* Image/Video Preview */}
//                 {selectedMediaType === 'video' ? (
//                   <View style={styles.videoPreviewContainer}>
//                     <Video source={{ uri: selectedImage }} style={styles.previewVideo} resizeMode='contain' 
//                       controls paused={false} repeat muted={false} />
//                   </View>
//                 ) : (
//                   <View style={styles.imagePreviewContainer}>
//                     <View style={[styles.imageWrapper, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
//                       <ImageZoom cropWidth={width} cropHeight={width} imageWidth={width} imageHeight={width}>
//                         <Image source={{ uri: selectedImage }} style={[styles.previewImage, { opacity: filters.brightness }]} 
//                           resizeMode='contain' />
//                       </ImageZoom>
//                     </View>
//                   </View>
//                 )}

//                 {/* FILTERS SECTION - NEW */}
//                 {showFilters && selectedMediaType === 'image' && (
//                   <View style={[styles.filtersSection, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
//                     <View style={styles.filterTabsContainer}>
//                       <TouchableOpacity onPress={() => setFilterTab('filters')} 
//                         style={[styles.filterTabButton, filterTab === 'filters' && styles.activeFilterTab]}>
//                         <Icon name='sparkles' size={18} color={filterTab === 'filters' ? '#0084F8' : isDarkMode ? '#888' : '#666'} />
//                         <Text style={[styles.filterTabText, { color: filterTab === 'filters' ? '#0084F8' : isDarkMode ? '#888' : '#666' }]}>
//                           Filters
//                         </Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity onPress={() => setFilterTab('adjust')} 
//                         style={[styles.filterTabButton, filterTab === 'adjust' && styles.activeFilterTab]}>
//                         <Icon name='options' size={18} color={filterTab === 'adjust' ? '#0084F8' : isDarkMode ? '#888' : '#666'} />
//                         <Text style={[styles.filterTabText, { color: filterTab === 'adjust' ? '#0084F8' : isDarkMode ? '#888' : '#666' }]}>
//                           Adjust
//                         </Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity onPress={handleCropImage} style={styles.filterTabButton}>
//                         <Icon name='crop' size={18} color={isDarkMode ? '#888' : '#666'} />
//                         <Text style={[styles.filterTabText, { color: isDarkMode ? '#888' : '#666' }]}>Crop</Text>
//                       </TouchableOpacity>
//                     </View>

//                     {filterTab === 'filters' && (
//                       <View style={styles.filtersContent}>
//                         <View style={styles.filtersHeader}>
//                           <Text style={[styles.filtersTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Choose Filter</Text>
//                           <TouchableOpacity onPress={resetFilters}>
//                             <Text style={styles.resetButton}>Reset</Text>
//                           </TouchableOpacity>
//                         </View>
//                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                           {presetFilters.map((preset) => (
//                             <TouchableOpacity key={preset.name} onPress={() => applyPresetFilter(preset)} 
//                               style={styles.filterThumbnailContainer}>
//                               <View style={[styles.filterThumbnail, selectedFilter === preset.name && styles.selectedFilterThumbnail]}>
//                                 <Image source={{ uri: selectedImage }} style={styles.filterThumbnailImage} resizeMode='cover' />
//                               </View>
//                               <Text style={[styles.filterName, { color: isDarkMode ? '#fff' : '#333' }, 
//                                 selectedFilter === preset.name && { color: '#0084F8' }]}>
//                                 {preset.name}
//                               </Text>
//                             </TouchableOpacity>
//                           ))}
//                         </ScrollView>
//                       </View>
//                     )}

//                     {filterTab === 'adjust' && (
//                       <View style={styles.adjustContent}>
//                         <Text style={[styles.adjustTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Adjust Settings</Text>
//                         {[
//                           { label: 'Brightness', icon: 'sunny', key: 'brightness' },
//                           { label: 'Contrast', icon: 'contrast', key: 'contrast' },
//                           { label: 'Saturation', icon: 'color-palette', key: 'saturation' },
//                         ].map(({ label, icon, key }) => (
//                           <View key={key} style={styles.sliderContainer}>
//                             <View style={styles.sliderHeader}>
//                               <View style={styles.sliderLabelContainer}>
//                                 <Icon name={icon} size={18} color={isDarkMode ? '#fff' : '#333'} />
//                                 <Text style={[styles.sliderLabel, { color: isDarkMode ? '#fff' : '#333' }]}>{label}</Text>
//                               </View>
//                               <Text style={[styles.sliderValue, { color: isDarkMode ? '#888' : '#666' }]}>
//                                 {Math.round(filters[key] * 100)}%
//                               </Text>
//                             </View>
//                             <Slider style={styles.slider} minimumValue={0} maximumValue={2} value={filters[key]}
//                               onValueChange={value => setFilters({ ...filters, [key]: value })}
//                               minimumTrackTintColor='#0084F8' maximumTrackTintColor={isDarkMode ? '#444' : '#ddd'} />
//                           </View>
//                         ))}
//                       </View>
//                     )}
//                   </View>
//                 )}

//                 {/* Caption Section */}
//                 <View style={[styles.captionContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
//                   <View style={styles.captionHeader}>
//                     <Icon name='create-outline' size={20} color={isDarkMode ? '#fff' : '#333'} />
//                     <Text style={[styles.captionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Write a caption</Text>
//                   </View>
//                   <View style={[styles.captionInputContainer, { 
//                     backgroundColor: isDarkMode ? '#2a2a2a' : '#fff', borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9' }]}>
//                     <TextInput style={[styles.captionInput, { color: isDarkMode ? '#fff' : '#333' }]}
//                       placeholder="What's on your mind?" placeholderTextColor={isDarkMode ? '#888' : '#666'}
//                       value={caption} onChangeText={setCaption} multiline maxLength={2200} />
//                   </View>
//                   <View style={styles.captionFooter}>
//                     <Text style={[styles.characterCount, { color: isDarkMode ? '#888' : '#666' }]}>{caption.length}/2200</Text>
//                   </View>
//                 </View>

//                 {/* Hashtag Section */}
//                 <View style={[styles.captionContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
//                   <View style={styles.captionHeader}>
//                     <Icon name='pricetag' size={20} color={isDarkMode ? '#fff' : '#333'} />
//                     <Text style={[styles.captionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Type hashtags</Text>
//                   </View>
//                   {hashtags.length > 0 && (
//                     <View style={styles.hashtagsDisplay}>
//                       {hashtags.map((tag, index) => (
//                         <View key={index} style={[styles.hashtagChip, { backgroundColor: isDarkMode ? '#2a2a2a' : '#e8f4ff' }]}>
//                           <Text style={[styles.hashtagText, { color: isDarkMode ? '#fff' : '#1e90ff' }]}>#{tag}</Text>
//                           <TouchableOpacity onPress={() => removeTag(tag)}>
//                             <Icon name='close-circle' size={18} color='#ff4444' />
//                           </TouchableOpacity>
//                         </View>
//                       ))}
//                     </View>
//                   )}
//                   <Row style={{ width: '100%', gap: 10, alignItems: 'center' }}>
//                     <View style={[styles.captionInputContainer, { borderWidth: 1, borderRadius: 12, padding: 3, minHeight: 48, flex: 1,
//                       backgroundColor: isDarkMode ? '#2a2a2a' : '#fff', borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9' }]}>
//                       <TextInput style={[styles.captionInput, { color: isDarkMode ? '#fff' : '#333' }]}
//                         placeholder="Enter hashtags" placeholderTextColor={isDarkMode ? '#888' : '#666'}
//                         value={hashtagsInput} onChangeText={(text) => { setHashtagsInput(text); SearchTags(text) }}
//                         maxLength={100} autoCorrect={false} />
//                     </View>
//                     <TouchableOpacity style={{ backgroundColor: '#12208B', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 }}
//                       onPress={() => addHashtag(hashtagsInput)}>
//                       <CustomText style={{ fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>Add</CustomText>
//                     </TouchableOpacity>
//                   </Row>
//                   {suggestions.length > 0 && (
//                     <View style={[styles.suggestionsContainer, { 
//                       backgroundColor: isDarkMode ? '#2a2a2a' : '#fff', borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9' }]}>
//                       <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
//                         {suggestions.map((item, index) => (
//                           <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => addHashtag(item.Tag)}>
//                             <Text style={[styles.suggestionText, { color: isDarkMode ? '#fff' : '#333' }]}>#{item.Tag}</Text>
//                           </TouchableOpacity>
//                         ))}
//                       </ScrollView>
//                     </View>
//                   )}
//                 </View>
//               </ScrollView>

//               {/* Post Button */}
//               <View style={[styles.postButtonContainer, { 
//                 backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa', borderTopColor: isDarkMode ? '#333' : '#e1e5e9' }]}>
//                 <TouchableOpacity onPress={() => onSubmit(selectedImage)} disabled={!selectedImage}>
//                   <LinearGradient colors={['#21B7FF', '#0084F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//                     style={[{ borderRadius: 8 }, styles.postBtn, { opacity: selectedImage ? 1 : 0.5 }]}>
//                     <Icon name='send' size={18} color='#fff' style={styles.postIcon} />
//                     <Text style={styles.postText}>Share {selectedMediaType === 'video' ? 'Video' : 'Post'}</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>
//             </KeyboardAvoidingView>
//           </View>
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   )
// }

// export default GalleryForAddPost

// // STYLES
// const styles = StyleSheet.create({
//   header: { paddingTop: 50, paddingHorizontal: 20, gap: 90, paddingBottom: 20 },
//   headerText: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
//   tabContainer: { flexDirection: 'row', paddingHorizontal: 10, marginBottom: 10 },
//   tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 25 },
//   activeTab: { shadowRadius: 4 },
//   tabText: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginLeft: 8 },
//   errorText: { textAlign: 'center', marginTop: 20, color: 'red' },
//   cameraTile: { width: imageSize, height: 170, margin: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' },
//   cameraText: { color: '#fff', fontSize: 10, marginTop: 4, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
//   imageTile: { width: imageSize, height: 170, margin: 1, overflow: 'hidden', position: 'relative' },
//   selectedTile: { borderWidth: 3, borderColor: '#1e90ff' },
//   image: { width: '100%', height: '100%' },
//   videoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
//   checkIconContainer: { position: 'absolute', top: 5, right: 5, backgroundColor: '#1e90ff', borderRadius: 12, padding: 2 },
//   postButton: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#1e90ff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, flexDirection: 'row', alignItems: 'center', elevation: 5 },
//   postButtonText: { color: '#fff', marginLeft: 8, fontSize: 16 },
//   previewContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, flex: 1 },
//   previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
//   headerButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, minWidth: 60 },
//   headerButtonText: { marginLeft: 4, fontSize: 14, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
//   previewTitle: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textAlign: 'center' },
//   previewContent: { flex: 1 },
//   imagePreviewContainer: { padding: 16 },
//   imageWrapper: { borderRadius: 16, overflow: 'hidden', elevation: 3 },
//   previewImage: { width: width, height: width },
//   videoPreviewContainer: { padding: 16 },
//   previewVideo: { width: width - 32, height: width - 32, borderRadius: 16, backgroundColor: '#000' },
//   filtersSection: { margin: 16, marginTop: 0, borderRadius: 16, padding: 16, elevation: 2 },
//   filterTabsContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
//   filterTabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, gap: 6 },
//   activeFilterTab: { backgroundColor: 'rgba(0, 132, 248, 0.1)' },
//   filterTabText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   filtersContent: { marginTop: 8 },
//   filtersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   filtersTitle: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
//   resetButton: { color: '#0084F8', fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   filterThumbnailContainer: { marginRight: 12, alignItems: 'center' },
//   filterThumbnail: { width: 80, height: 80, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
//   selectedFilterThumbnail: { borderColor: '#0084F8' },
//   filterThumbnailImage: { width: '100%', height: '100%' },
//   filterName: { marginTop: 6, fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   adjustContent: { marginTop: 8 },
//   adjustTitle: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginBottom: 16 },
//   sliderContainer: { marginBottom: 20 },
//   sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//   sliderLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   sliderLabel: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   sliderValue: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   slider: { width: '100%', height: 40 },
//   captionContainer: { margin: 16, marginTop: 0, borderRadius: 16, padding: 16, elevation: 2 },
//   captionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   captionTitle: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginLeft: 8 },
//   captionInputContainer: { borderWidth: 1, borderRadius: 12, padding: 16, minHeight: 120, maxHeight: 200 },
//   captionInput: { fontSize: 16, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold, lineHeight: 22, flex: 1, textAlignVertical: 'top' },
//   captionFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
//   characterCount: { fontSize: 12, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
//   hashtagsDisplay: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
//   hashtagChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, gap: 6 },
//   hashtagText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   suggestionsContainer: { marginTop: 10, borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
//   suggestionItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
//   suggestionText: { fontSize: 14, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
//   postButtonContainer: { paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
//   postBtn: { paddingVertical: 13, paddingHorizontal: 24, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 4 },
//   postIcon: { marginRight: 8 },
//   postText: { color: '#fff', fontSize: 19, fontFamily: FONTS_FAMILY.SourceSans3_Medium, fontWeight: '600' },
// })






// import React, { useEffect, useState, useRef } from 'react'
// import {
//   View, FlatList, Image, PermissionsAndroid, Platform, Text,
//   TouchableOpacity, Dimensions, StatusBar, StyleSheet, TextInput,
//   KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard,
// } from 'react-native'
// import { CameraRoll } from '@react-native-camera-roll/camera-roll'
// import Icon from 'react-native-vector-icons/Ionicons'
// import FontAwesome from 'react-native-vector-icons/FontAwesome'
// import { launchCamera } from 'react-native-image-picker'
// import ImagePicker from 'react-native-image-crop-picker'
// import Video from 'react-native-video'
// import LinearGradient from 'react-native-linear-gradient'
// import Slider from '@react-native-community/slider'
// import { useSelector } from 'react-redux'
// import { captureRef } from 'react-native-view-shot'
// import { Canvas, Image as SkiaImage, useImage, ColorMatrix } from '@shopify/react-native-skia'

// import { BASE_URL, getItem } from '../../utils/Apis'
// import useLoader from '../../utils/LoaderHook'
// import { ToastMsg } from '../../utils/helperFunctions'
// import Row from '../../components/wrapper/row'
// import { BackIcon, PrimaryBackArrow } from '../../assets/SVGs'
// import { FONTS_FAMILY } from '../../assets/Fonts'
// import CustomText from '../../components/TextComponent'

// const screenWidth = Dimensions.get('window').width
// const imageSize = screenWidth / 3 - 10
// const { width } = Dimensions.get('window')

// const GalleryForAddPost = ({ navigation }) => {
//   const [photos, setPhotos] = useState([])
//   const [videos, setVideos] = useState([])
//   const [errorMsg, setErrorMsg] = useState('')
//   const [selectedImage, setSelectedImage] = useState(null)
//   const [caption, setCaption] = useState('')
//   const [activeTab, setActiveTab] = useState('Images')
//   const [selectedMediaType, setSelectedMediaType] = useState('image')
//   const { isDarkMode } = useSelector(state => state.theme)
//   const [isPreviewVisible, setIsPreviewVisible] = useState(false)
//   const { showLoader, hideLoader } = useLoader()
  
//   const [hashtagsInput, setHashtagsInput] = useState('')
//   const [hashtags, setHashtags] = useState([])
//   const [suggestions, setSuggestions] = useState([])

//   const [showFilters, setShowFilters] = useState(false)
//   const [filterTab, setFilterTab] = useState('filters')
//   const [brightness, setBrightness] = useState(0)
//   const [contrast, setContrast] = useState(1)
//   const [saturation, setSaturation] = useState(1)
//   const [selectedFilter, setSelectedFilter] = useState('normal')
//   const [showAdjust, setShowAdjust] = useState(null)
  
//   const canvasRef = useRef(null)
//   const skiaImage = useImage(selectedImage)

//   const filters = {
//     normal: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
//     clarendon: [1.15, 0, 0, 0, 0, 0, 1.08, 0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 0, 1, 0],
//     gingham: [1.05, 0, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 0, 1, 0],
//     moon: [0.95, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 1, 0],
//     lark: [1.08, 0, 0, 0, 0, 0, 1.03, 0, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 0, 1, 0],
//     reyes: [1.05, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 0.93, 0, 0, 0, 0, 0, 1, 0],
//     juno: [1.1, 0, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 1, 0],
//     slumber: [1.02, 0, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 0, 1, 0],
//     aden: [1.05, 0, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 0, 1, 0],
//     perpetua: [1.03, 0, 0, 0, 0, 0, 1.03, 0, 0, 0, 0, 0, 0.99, 0, 0, 0, 0, 0, 1, 0],
//   }

//   const presetFilters = [
//     { name: 'Normal', id: 'normal' },
//     { name: 'Clarendon', id: 'clarendon' },
//     { name: 'Gingham', id: 'gingham' },
//     { name: 'Moon', id: 'moon' },
//     { name: 'Lark', id: 'lark' },
//     { name: 'Reyes', id: 'reyes' },
//     { name: 'Juno', id: 'juno' },
//     { name: 'Slumber', id: 'slumber' },
//     { name: 'Aden', id: 'aden' },
//     { name: 'Perpetua', id: 'perpetua' },
//   ]

//   const getColorMatrix = () => {
//     const filter = filters[selectedFilter]
//     const b = brightness / 255
//     const c = contrast
//     const s = saturation
//     return [
//       filter[0] * c * s, filter[1], filter[2], filter[3], filter[4] + b * 255,
//       filter[5], filter[6] * c * s, filter[7], filter[8], filter[9] + b * 255,
//       filter[10], filter[11], filter[12] * c * s, filter[13], filter[14] + b * 255,
//       filter[15], filter[16], filter[17], filter[18], filter[19],
//     ]
//   }

//   useEffect(() => {
//     const requestPermissionAndLoad = async () => {
//       try {
//         if (Platform.OS === 'android') {
//           await PermissionsAndroid.requestMultiple([
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           ])
//         }
//         const imageResult = await CameraRoll.getPhotos({ first: 50, assetType: 'Photos' })
//         setPhotos(imageResult.edges)
//         const videoResult = await CameraRoll.getPhotos({ first: 50, assetType: 'Videos' })
//         setVideos(videoResult.edges)
//       } catch (error) {
//         setErrorMsg(error.message || 'Something went wrong')
//       }
//     }
//     requestPermissionAndLoad()
//   }, [])

//   const SearchTags = async (tag) => {
//     try {
//       if (!tag.trim()) { setSuggestions([]); return }
//       const token = await getItem('token')
//       const response = await fetch(`${BASE_URL}/api/admin/SearchHashtags?query=${tag}`, {
//         method: 'GET',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//       })
//       const result = await response.json()
//       setSuggestions(result?.data || [])
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const addHashtag = (tag) => {
//     tag = tag.toLowerCase().trim()
//     if (!tag || hashtags.includes(tag)) return
//     setHashtags([...hashtags, tag])
//     setHashtagsInput('')
//     setSuggestions([])
//   }

//   const removeTag = (tag) => setHashtags(hashtags.filter((t) => t !== tag))

//   const resetFilters = () => {
//     setBrightness(0)
//     setContrast(1)
//     setSaturation(1)
//     setSelectedFilter('normal')
//     setShowAdjust(null)
//   }

//   const exportEditedImage = async () => {
//     try {
//       if (!canvasRef.current) return selectedImage
//       const uri = await captureRef(canvasRef, {
//         format: 'jpg',
//         quality: 0.9,
//         result: 'tmpfile',
//       })
//       return uri
//     } catch (error) {
//       console.log('Export error:', error)
//       return selectedImage
//     }
//   }

//   const onSubmit = async () => {
//     try {
//       const token = await getItem('token')
//       showLoader()
      
//       let finalImageUri = selectedImage
//       if (selectedMediaType === 'image' && 
//           (selectedFilter !== 'normal' || brightness !== 0 || contrast !== 1 || saturation !== 1)) {
//         finalImageUri = await exportEditedImage()
//       }

//       if (!finalImageUri) {
//         ToastMsg('No media selected')
//         hideLoader()
//         return
//       }

//       const fileName = finalImageUri.split('/').pop()
//       const formData = new FormData()
//       formData.append('type', selectedMediaType)
//       formData.append('file', {
//         uri: Platform.OS === 'android' ? finalImageUri : finalImageUri.replace('file://', ''),
//         name: fileName || `upload.${selectedMediaType === 'video' ? 'mp4' : 'jpg'}`,
//         type: selectedMediaType === 'video' ? 'video/mp4' : 'image/jpeg',
//       })
//       formData.append('Caption', caption || 'No caption')
//       formData.append('Hashtags', JSON.stringify(hashtags))
//       formData.append('Filter', selectedFilter)

//       const response = await fetch(`${BASE_URL}/api/user/AddPost`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       })
      
//       if (!response.ok) throw new Error(`Server error ${response.status}`)
//       const result = JSON.parse(await response.text())
//       ToastMsg(result?.message)
//       navigation.navigate('Tab')
//     } catch (error) {
//       console.log('Submit error:', error)
//       ToastMsg('Something went wrong')
//     } finally {
//       hideLoader()
//     }
//   }

//   const handleSelect = uri => {
//     setSelectedImage(prev => (prev === uri ? null : uri))
//     setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
//     setIsPreviewVisible(true)
//   }

//   const handleOpenCamera = () => {
//     launchCamera({
//       mediaType: activeTab === 'Videos' ? 'video' : 'photo',
//       cameraType: 'back',
//       quality: 0.8,
//     }, response => {
//       if (!response.didCancel && !response.errorCode) {
//         const uri = response?.assets?.[0]?.uri
//         if (uri) {
//           setSelectedImage(uri)
//           setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
//           setIsPreviewVisible(true)
//         }
//       }
//     })
//   }

//   const handleCropImage = async () => {
//     if (selectedMediaType !== 'image') return ToastMsg('Cropping is only for images')
//     try {
//       const cropped = await ImagePicker.openCropper({
//         path: selectedImage,
//         width: 1080,
//         height: 1080,
//         cropping: true,
//       })
//       if (cropped?.path) setSelectedImage(cropped.path)
//     } catch (err) {
//       console.log('Crop cancelled')
//     }
//   }

//   const renderItem = ({ item, index }) => {
//     if (index === 0) {
//       return (
//         <TouchableOpacity onPress={handleOpenCamera} activeOpacity={0.8}>
//           <View style={styles.cameraTile}>
//             <FontAwesome name={activeTab === 'Videos' ? 'video-camera' : 'camera'} size={20} color='#fff' />
//             <Text style={styles.cameraText}>{activeTab === 'Videos' ? 'Record' : 'Camera'}</Text>
//           </View>
//         </TouchableOpacity>
//       )
//     }
//     const uri = item.node.image.uri
//     const isSelected = selectedImage === uri
//     return (
//       <TouchableOpacity onPress={() => handleSelect(uri)} activeOpacity={0.8}>
//         <View style={[styles.imageTile, isSelected && styles.selectedTile]}>
//           <Image source={{ uri }} style={styles.image} resizeMode='cover' />
//           {activeTab === 'Videos' && (
//             <View style={styles.videoOverlay}>
//               <Icon name='play-circle' size={24} color='rgba(255,255,255,0.8)' />
//             </View>
//           )}
//           {isSelected && (
//             <View style={styles.checkIconContainer}>
//               <Icon name='checkmark' size={16} color='#fff' />
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     )
//   }

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={{ flex: 1, backgroundColor: isDarkMode ? '#252525' : '#fff' }}>
//         <StatusBar backgroundColor='transparent' translucent barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        
//         <Row style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             {isDarkMode ? <BackIcon /> : <PrimaryBackArrow />}
//           </TouchableOpacity>
//           <CustomText style={styles.headerText}>Select Media</CustomText>
//         </Row>

//         <View style={styles.tabContainer}>
//           {['Images', 'Videos'].map(tab => (
//             <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tab && styles.activeTab]}
//               onPress={() => setActiveTab(tab)}>
//               <LinearGradient colors={['#21B7FF', '#0084F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//                 style={[styles.tabButton, { borderRadius: 8 }]}>
//                 <Icon name={tab === 'Images' ? 'image-outline' : 'videocam-outline'} size={20} 
//                   color={activeTab === tab ? '#fff' : isDarkMode ? '#fff' : '#333'} />
//                 <Text style={[styles.tabText, { color: activeTab === tab ? '#fff' : isDarkMode ? '#fff' : '#333' }]}>
//                   {tab}
//                 </Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : (
//           <>
//             <FlatList data={activeTab === 'Images' ? photos : videos} keyExtractor={(item, index) => index.toString()}
//               numColumns={3} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 100, alignSelf: 'center' }}
//               key={activeTab} />
//             {selectedImage && !isPreviewVisible && (
//               <TouchableOpacity style={styles.postButton} onPress={() => setIsPreviewVisible(true)}>
//                 <Icon name='arrow-up-circle-outline' size={20} color='#fff' />
//                 <Text style={styles.postButtonText}>Next</Text>
//               </TouchableOpacity>
//             )}
//           </>
//         )}

//         {isPreviewVisible && selectedImage && (
//           <View style={[styles.previewContainer, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
//             <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              
//               <View style={[styles.previewHeader, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
//                 <TouchableOpacity onPress={() => {
//                   setIsPreviewVisible(false)
//                   setCaption('')
//                   setHashtags([])
//                   setHashtagsInput('')
//                   setShowFilters(false)
//                   resetFilters()
//                 }} style={styles.headerButton}>
//                   <Icon name='chevron-back' size={24} color={isDarkMode ? '#fff' : '#333'} />
//                   <Text style={[styles.headerButtonText, { color: isDarkMode ? '#fff' : '#333' }]}>Back</Text>
//                 </TouchableOpacity>

//                 <Text style={[styles.previewTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Create Post</Text>

//                 <TouchableOpacity onPress={() => {
//                   if (selectedMediaType === 'image') setShowFilters(!showFilters)
//                   else ToastMsg('Video editing coming soon')
//                 }} style={styles.headerButton}>
//                   <Icon name={selectedMediaType === 'video' ? 'cut' : 'color-filter'} size={20} 
//                     color={isDarkMode ? '#fff' : '#333'} />
//                   <Text style={[styles.headerButtonText, { color: isDarkMode ? '#fff' : '#333' }]}>
//                     {selectedMediaType === 'video' ? 'Trim' : 'Filters'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false} 
//                 keyboardShouldPersistTaps='handled' contentContainerStyle={{ paddingBottom: 250 }}>
                
//                 {selectedMediaType === 'video' ? (
//                   <View style={styles.videoPreviewContainer}>
//                     <Video source={{ uri: selectedImage }} style={styles.previewVideo} resizeMode='contain' 
//                       controls paused={false} repeat muted={false} />
//                   </View>
//                 ) : (
//                   <View style={styles.imagePreviewContainer}>
//                     <View style={[styles.imageWrapper, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}
//                       ref={canvasRef} collapsable={false}>
//                       <Canvas style={{ width: width - 32, height: width - 32 }}>
//                         <SkiaImage image={skiaImage} x={0} y={0} width={width - 32} height={width - 32} fit="contain">
//                           <ColorMatrix matrix={getColorMatrix()} />
//                         </SkiaImage>
//                       </Canvas>
//                     </View>
//                   </View>
//                 )}

//                 {showFilters && selectedMediaType === 'image' && (
//                   <View style={[styles.filtersSection, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
//                     <View style={styles.filterTabsContainer}>
//                       <TouchableOpacity onPress={() => setFilterTab('filters')} 
//                         style={[styles.filterTabButton, filterTab === 'filters' && styles.activeFilterTab]}>
//                         <Icon name='sparkles' size={18} color={filterTab === 'filters' ? '#0084F8' : isDarkMode ? '#888' : '#666'} />
//                         <Text style={[styles.filterTabText, { color: filterTab === 'filters' ? '#0084F8' : isDarkMode ? '#888' : '#666' }]}>
//                           Filters
//                         </Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity onPress={() => setFilterTab('adjust')} 
//                         style={[styles.filterTabButton, filterTab === 'adjust' && styles.activeFilterTab]}>
//                         <Icon name='options' size={18} color={filterTab === 'adjust' ? '#0084F8' : isDarkMode ? '#888' : '#666'} />
//                         <Text style={[styles.filterTabText, { color: filterTab === 'adjust' ? '#0084F8' : isDarkMode ? '#888' : '#666' }]}>
//                           Adjust
//                         </Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity onPress={handleCropImage} style={styles.filterTabButton}>
//                         <Icon name='crop' size={18} color={isDarkMode ? '#888' : '#666'} />
//                         <Text style={[styles.filterTabText, { color: isDarkMode ? '#888' : '#666' }]}>Crop</Text>
//                       </TouchableOpacity>
//                     </View>

//                     {filterTab === 'filters' && (
//                       <View style={styles.filtersContent}>
//                         <View style={styles.filtersHeader}>
//                           <Text style={[styles.filtersTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Choose Filter</Text>
//                           <TouchableOpacity onPress={resetFilters}>
//                             <Text style={styles.resetButton}>Reset</Text>
//                           </TouchableOpacity>
//                         </View>
//                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                           {presetFilters.map((preset) => (
//                             <TouchableOpacity key={preset.id} onPress={() => setSelectedFilter(preset.id)} 
//                               style={styles.filterThumbnailContainer}>
//                               <View style={[styles.filterThumbnail, selectedFilter === preset.id && styles.selectedFilterThumbnail]}>
//                                 <Image source={{ uri: selectedImage }} style={styles.filterThumbnailImage} resizeMode='cover' />
//                               </View>
//                               <Text style={[styles.filterName, { color: isDarkMode ? '#fff' : '#333' }, 
//                                 selectedFilter === preset.id && { color: '#0084F8' }]}>
//                                 {preset.name}
//                               </Text>
//                             </TouchableOpacity>
//                           ))}
//                         </ScrollView>
//                       </View>
//                     )}

//                     {filterTab === 'adjust' && (
//                       <View style={styles.adjustContent}>
//                         <Text style={[styles.adjustTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Fine Tune</Text>
                        
//                         <View style={styles.adjustButtonsRow}>
//                           <TouchableOpacity style={[styles.adjustButton, showAdjust === 'brightness' && styles.adjustButtonActive]}
//                             onPress={() => setShowAdjust(showAdjust === 'brightness' ? null : 'brightness')}>
//                             <View style={styles.adjustIcon}>
//                               <Icon name='sunny' size={20} color={isDarkMode ? '#fff' : '#333'} />
//                             </View>
//                             <Text style={[styles.adjustLabel, { color: isDarkMode ? '#fff' : '#333' }]}>Brightness</Text>
//                           </TouchableOpacity>

//                           <TouchableOpacity style={[styles.adjustButton, showAdjust === 'contrast' && styles.adjustButtonActive]}
//                             onPress={() => setShowAdjust(showAdjust === 'contrast' ? null : 'contrast')}>
//                             <View style={styles.adjustIcon}>
//                               <Icon name='contrast' size={20} color={isDarkMode ? '#fff' : '#333'} />
//                             </View>
//                             <Text style={[styles.adjustLabel, { color: isDarkMode ? '#fff' : '#333' }]}>Contrast</Text>
//                           </TouchableOpacity>

//                           <TouchableOpacity style={[styles.adjustButton, showAdjust === 'saturation' && styles.adjustButtonActive]}
//                             onPress={() => setShowAdjust(showAdjust === 'saturation' ? null : 'saturation')}>
//                             <View style={styles.adjustIcon}>
//                               <Icon name='color-palette' size={20} color={isDarkMode ? '#fff' : '#333'} />
//                             </View>
//                             <Text style={[styles.adjustLabel, { color: isDarkMode ? '#fff' : '#333' }]}>Saturation</Text>
//                           </TouchableOpacity>
//                         </View>

//                         {showAdjust && (
//                           <View style={styles.sliderContainer}>
//                             <View style={styles.sliderHeader}>
//                               <Text style={[styles.sliderTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
//                                 {showAdjust.charAt(0).toUpperCase() + showAdjust.slice(1)}
//                               </Text>
//                               <Text style={[styles.sliderValue, { color: isDarkMode ? '#888' : '#666' }]}>
//                                 {showAdjust === 'brightness' && Math.round((brightness / 255) * 100)}
//                                 {showAdjust === 'contrast' && Math.round(contrast * 100)}
//                                 {showAdjust === 'saturation' && Math.round(saturation * 100)}
//                               </Text>
//                             </View>
                            
//                             {showAdjust === 'brightness' && (
//                               <Slider value={brightness} onValueChange={setBrightness} minimumValue={-50} maximumValue={50}
//                                 minimumTrackTintColor="#0084F8" maximumTrackTintColor={isDarkMode ? '#444' : '#ddd'} style={styles.slider} />
//                             )}
//                             {showAdjust === 'contrast' && (
//                               <Slider value={contrast} onValueChange={setContrast} minimumValue={0.5} maximumValue={2}
//                                 minimumTrackTintColor="#0084F8" maximumTrackTintColor={isDarkMode ? '#444' : '#ddd'} style={styles.slider} />
//                             )}
//                             {showAdjust === 'saturation' && (
//                               <Slider value={saturation} onValueChange={setSaturation} minimumValue={0} maximumValue={2}
//                                 minimumTrackTintColor="#0084F8" maximumTrackTintColor={isDarkMode ? '#444' : '#ddd'} style={styles.slider} />
//                             )}
//                           </View>
//                         )}
//                       </View>
//                     )}
//                   </View>
//                 )}

//                 <View style={[styles.captionContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
//                   <View style={styles.captionHeader}>
//                     <Icon name='create-outline' size={20} color={isDarkMode ? '#fff' : '#333'} />
//                     <Text style={[styles.captionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Write a caption</Text>
//                   </View>
//                   <View style={[styles.captionInputContainer, { 
//                     backgroundColor: isDarkMode ? '#2a2a2a' : '#fff', borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9' }]}>
//                     <TextInput style={[styles.captionInput, { color: isDarkMode ? '#fff' : '#333' }]}
//                       placeholder="What's on your mind?" placeholderTextColor={isDarkMode ? '#888' : '#666'}
//                       value={caption} onChangeText={setCaption} multiline maxLength={2200} />
//                   </View>
//                   <View style={styles.captionFooter}>
//                     <Text style={[styles.characterCount, { color: isDarkMode ? '#888' : '#666' }]}>{caption.length}/2200</Text>
//                   </View>
//                 </View>

//                 <View style={[styles.captionContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
//                   <View style={styles.captionHeader}>
//                     <Icon name='pricetag' size={20} color={isDarkMode ? '#fff' : '#333'} />
//                     <Text style={[styles.captionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Type hashtags</Text>
//                   </View>
//                   {hashtags.length > 0 && (
//                     <View style={styles.hashtagsDisplay}>
//                       {hashtags.map((tag, index) => (
//                         <View key={index} style={[styles.hashtagChip, { backgroundColor: isDarkMode ? '#2a2a2a' : '#e8f4ff' }]}>
//                           <Text style={[styles.hashtagText, { color: isDarkMode ? '#fff' : '#1e90ff' }]}>#{tag}</Text>
//                           <TouchableOpacity onPress={() => removeTag(tag)}>
//                             <Icon name='close-circle' size={18} color='#ff4444' />
//                           </TouchableOpacity>
//                         </View>
//                       ))}
//                     </View>
//                   )}
//                   <Row style={{ width: '100%', gap: 10, alignItems: 'center' }}>
//                     <View style={[styles.captionInputContainer, { borderWidth: 1, borderRadius: 12, padding: 3, minHeight: 48, flex: 1,
//                       backgroundColor: isDarkMode ? '#2a2a2a' : '#fff', borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9' }]}>
//                       <TextInput style={[styles.captionInput, { color: isDarkMode ? '#fff' : '#333' }]}
//                         placeholder="Enter hashtags" placeholderTextColor={isDarkMode ? '#888' : '#666'}
//                         value={hashtagsInput} onChangeText={(text) => { setHashtagsInput(text); SearchTags(text) }}
//                         maxLength={100} autoCorrect={false} />
//                     </View>
//                     <TouchableOpacity style={{ backgroundColor: '#12208B', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 }}
//                       onPress={() => addHashtag(hashtagsInput)}>
//                       <CustomText style={{ fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>Add</CustomText>
//                     </TouchableOpacity>
//                   </Row>
//                   {suggestions.length > 0 && (
//                     <View style={[styles.suggestionsContainer, {
//                       backgroundColor: isDarkMode ? '#2a2a2a' : '#fff', borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9' }]}>
//                       <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
//                         {suggestions.map((item, index) => (
//                           <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => addHashtag(item.Tag)}>
//                             <Text style={[styles.suggestionText, { color: isDarkMode ? '#fff' : '#333' }]}>#{item.Tag}</Text>
//                           </TouchableOpacity>
//                         ))}
//                       </ScrollView>
//                     </View>
//                   )}
//                 </View>
//               </ScrollView>

//               <View style={[styles.postButtonContainer, { 
//                 backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa', borderTopColor: isDarkMode ? '#333' : '#e1e5e9' }]}>
//                 <TouchableOpacity onPress={onSubmit} disabled={!selectedImage}>
//                   <LinearGradient colors={['#21B7FF', '#0084F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//                     style={[{ borderRadius: 8 }, styles.postBtn, { opacity: selectedImage ? 1 : 0.5 }]}>
//                     <Icon name='send' size={18} color='#fff' style={styles.postIcon} />
//                     <Text style={styles.postText}>Share {selectedMediaType === 'video' ? 'Video' : 'Post'}</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>
//             </KeyboardAvoidingView>
//           </View>
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   )
// }

// export default GalleryForAddPost

// const styles = StyleSheet.create({
//   header: { paddingTop: 50, paddingHorizontal: 20, gap: 90, paddingBottom: 20 },
//   headerText: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
//   tabContainer: { flexDirection: 'row', paddingHorizontal: 10, marginBottom: 10 },
//   tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 25 },
//   activeTab: { shadowRadius: 4 },
//   tabText: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginLeft: 8 },
//   errorText: { textAlign: 'center', marginTop: 20, color: 'red' },
//   cameraTile: { width: imageSize, height: 170, margin: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' },
//   cameraText: { color: '#fff', fontSize: 10, marginTop: 4, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
//   imageTile: { width: imageSize, height: 170, margin: 1, overflow: 'hidden', position: 'relative' },
//   selectedTile: { borderWidth: 3, borderColor: '#1e90ff' },
//   image: { width: '100%', height: '100%' },
//   videoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
//   checkIconContainer: { position: 'absolute', top: 5, right: 5, backgroundColor: '#1e90ff', borderRadius: 12, padding: 2 },
//   postButton: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#1e90ff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, flexDirection: 'row', alignItems: 'center', elevation: 5 },
//   postButtonText: { color: '#fff', marginLeft: 8, fontSize: 16 },
//   previewContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, flex: 1 },
//   previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
//   headerButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, minWidth: 60 },
//   headerButtonText: { marginLeft: 4, fontSize: 14, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
//   previewTitle: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textAlign: 'center' },
//   previewContent: { flex: 1 },
//   imagePreviewContainer: { padding: 16 },
//   imageWrapper: { borderRadius: 16, overflow: 'hidden', elevation: 3 },
//   videoPreviewContainer: { padding: 16 },
//   previewVideo: { width: width - 32, height: width - 32, borderRadius: 16, backgroundColor: '#000' },
//   filtersSection: { margin: 16, marginTop: 0, borderRadius: 16, padding: 16, elevation: 2 },
//   filterTabsContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
//   filterTabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, gap: 6 },
//   activeFilterTab: { backgroundColor: 'rgba(0, 132, 248, 0.1)' },
//   filterTabText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   filtersContent: { marginTop: 8 },
//   filtersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   filtersTitle: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
//   resetButton: { color: '#0084F8', fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   filterThumbnailContainer: { marginRight: 12, alignItems: 'center' },
//   filterThumbnail: { width: 80, height: 80, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
//   selectedFilterThumbnail: { borderColor: '#0084F8' },
//   filterThumbnailImage: { width: '100%', height: '100%' },
//   filterName: { marginTop: 6, fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   adjustContent: { marginTop: 8 },
//   adjustTitle: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginBottom: 16 },
//   adjustButtonsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
//   adjustButton: { alignItems: 'center', padding: 8, borderRadius: 8 },
//   adjustButtonActive: { backgroundColor: 'rgba(0, 132, 248, 0.1)' },
//   adjustIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
//   adjustLabel: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   sliderContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
//   sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//   sliderTitle: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   sliderValue: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   slider: { width: '100%', height: 40 },
//   captionContainer: { margin: 16, marginTop: 0, borderRadius: 16, padding: 16, elevation: 2 },
//   captionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   captionTitle: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginLeft: 8 },
//   captionInputContainer: { borderWidth: 1, borderRadius: 12, padding: 16, minHeight: 120, maxHeight: 200 },
//   captionInput: { fontSize: 16, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold, lineHeight: 22, flex: 1, textAlignVertical: 'top' },
//   captionFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
//   characterCount: { fontSize: 12, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
//   hashtagsDisplay: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
//   hashtagChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, gap: 6 },
//   hashtagText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   suggestionsContainer: { marginTop: 10, borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
//   suggestionItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
//   suggestionText: { fontSize: 14, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
//   postButtonContainer: { paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
//   postBtn: { paddingVertical: 13, paddingHorizontal: 24, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 4 },
//   postIcon: { marginRight: 8 },
//   postText: { color: '#fff', fontSize: 19, fontFamily: FONTS_FAMILY.SourceSans3_Medium, fontWeight: '600' },
// })



// import React, { useEffect, useState, useRef } from 'react'
// import {
//   View, FlatList, Image, PermissionsAndroid, Platform, Text,
//   TouchableOpacity, Dimensions, StatusBar, StyleSheet, TextInput,
//   KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard,
// } from 'react-native'
// import { CameraRoll } from '@react-native-camera-roll/camera-roll'
// import Icon from 'react-native-vector-icons/Ionicons'
// import FontAwesome from 'react-native-vector-icons/FontAwesome'
// import { launchCamera } from 'react-native-image-picker'
// import ImagePicker from 'react-native-image-crop-picker'
// import Video from 'react-native-video'
// import LinearGradient from 'react-native-linear-gradient'
// import Slider from '@react-native-community/slider'
// import { useSelector } from 'react-redux'
// import { captureRef } from 'react-native-view-shot'
// import { Canvas, Image as SkiaImage, useImage, ColorMatrix } from '@shopify/react-native-skia'
// import RNFS from 'react-native-fs'

// import { BASE_URL, getItem } from '../../utils/Apis'
// import useLoader from '../../utils/LoaderHook'
// import { ToastMsg } from '../../utils/helperFunctions'
// import Row from '../../components/wrapper/row'
// import { BackIcon, PrimaryBackArrow } from '../../assets/SVGs'
// import { FONTS_FAMILY } from '../../assets/Fonts'
// import CustomText from '../../components/TextComponent'

// const screenWidth = Dimensions.get('window').width
// const imageSize = screenWidth / 3 - 10
// const { width } = Dimensions.get('window')

// const GalleryForAddPost = ({ navigation }) => {
//   const [photos, setPhotos] = useState([])
//   const [videos, setVideos] = useState([])
//   const [errorMsg, setErrorMsg] = useState('')
//   const [selectedImage, setSelectedImage] = useState(null)
//   const [caption, setCaption] = useState('')
//   const [activeTab, setActiveTab] = useState('Images')
//   const [selectedMediaType, setSelectedMediaType] = useState('image')
//   const { isDarkMode } = useSelector(state => state.theme)
//   const [isPreviewVisible, setIsPreviewVisible] = useState(false)
//   const { showLoader, hideLoader } = useLoader()
  
//   const [hashtagsInput, setHashtagsInput] = useState('')
//   const [hashtags, setHashtags] = useState([])
//   const [suggestions, setSuggestions] = useState([])

//   const [showFilters, setShowFilters] = useState(false)
//   const [filterTab, setFilterTab] = useState('filters')
//   const [brightness, setBrightness] = useState(0)
//   const [contrast, setContrast] = useState(1)
//   const [saturation, setSaturation] = useState(1)
//   const [selectedFilter, setSelectedFilter] = useState('normal')
//   const [showAdjust, setShowAdjust] = useState(null)
  
//   const canvasRef = useRef(null)
  
//   // ✅ SIMPLE: Just load the image directly
//   const skiaImage = useImage(selectedImage)
  
//   // Debug
//   useEffect(() => {
//     if (selectedImage) {
//       console.log('===== SKIA DEBUG =====')
//       console.log('Selected Image URI:', selectedImage)
//       console.log('Skia Image Loaded:', !!skiaImage)
//       if (skiaImage) {
//         console.log('Skia Image Width:', skiaImage.width())
//         console.log('Skia Image Height:', skiaImage.height())
//       }
//       console.log('=====================')
//     }
//   }, [selectedImage, skiaImage])

//   // Log to check if image loads
//   useEffect(() => {
//     console.log('===== SKIA DEBUG =====')
//     console.log('Selected Image:', selectedImage)
//     console.log('Skia Image Object:', skiaImage)
//     console.log('Is Skia Loaded?', !!skiaImage)
//     console.log('=====================')
//   }, [selectedImage, skiaImage])

//   const filters = {
//     normal: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
//     clarendon: [1.15, 0, 0, 0, 0, 0, 1.08, 0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 0, 1, 0],
//     gingham: [1.05, 0, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 0, 1, 0],
//     moon: [0.95, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 1, 0],
//     lark: [1.08, 0, 0, 0, 0, 0, 1.03, 0, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 0, 1, 0],
//     reyes: [1.05, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 0.93, 0, 0, 0, 0, 0, 1, 0],
//     juno: [1.1, 0, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 1, 0],
//     slumber: [1.02, 0, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 0, 1, 0],
//     aden: [1.05, 0, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 0, 1, 0],
//     perpetua: [1.03, 0, 0, 0, 0, 0, 1.03, 0, 0, 0, 0, 0, 0.99, 0, 0, 0, 0, 0, 1, 0],
//     bw: [0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0],
//   }

//   const presetFilters = [
//     { name: 'Normal', id: 'normal' },
//     { name: 'Clarendon', id: 'clarendon' },
//     { name: 'Gingham', id: 'gingham' },
//     { name: 'Moon', id: 'moon' },
//     { name: 'Lark', id: 'lark' },
//     { name: 'Reyes', id: 'reyes' },
//     { name: 'Juno', id: 'juno' },
//     { name: 'Slumber', id: 'slumber' },
//     { name: 'Aden', id: 'aden' },
//     { name: 'Perpetua', id: 'perpetua' },
//     { name: 'B&W', id: 'bw' },
//   ]

//   const getColorMatrix = () => {
//     const filter = filters[selectedFilter]
//     const b = brightness / 255
//     const c = contrast
//     const s = saturation

//     console.log('🎨 Applying Filter:', selectedFilter)
//     console.log('📊 Values - Brightness:', brightness, 'Contrast:', contrast, 'Saturation:', saturation)

//     return [
//       filter[0] * c * s, filter[1], filter[2], filter[3], filter[4] + b * 255,
//       filter[5], filter[6] * c * s, filter[7], filter[8], filter[9] + b * 255,
//       filter[10], filter[11], filter[12] * c * s, filter[13], filter[14] + b * 255,
//       filter[15], filter[16], filter[17], filter[18], filter[19],
//     ]
//   }

//   useEffect(() => {
//     const requestPermissionAndLoad = async () => {
//       try {
//         if (Platform.OS === 'android') {
//           await PermissionsAndroid.requestMultiple([
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           ])
//         }
//         const imageResult = await CameraRoll.getPhotos({ first: 50, assetType: 'Photos' })
//         setPhotos(imageResult.edges)
//         const videoResult = await CameraRoll.getPhotos({ first: 50, assetType: 'Videos' })
//         setVideos(videoResult.edges)
//       } catch (error) {
//         setErrorMsg(error.message || 'Something went wrong')
//       }
//     }
//     requestPermissionAndLoad()
//   }, [])

//   const SearchTags = async (tag) => {
//     try {
//       if (!tag.trim()) { setSuggestions([]); return }
//       const token = await getItem('token')
//       const response = await fetch(`${BASE_URL}/api/admin/SearchHashtags?query=${tag}`, {
//         method: 'GET',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//       })
//       const result = await response.json()
//       setSuggestions(result?.data || [])
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const addHashtag = (tag) => {
//     tag = tag.toLowerCase().trim()
//     if (!tag || hashtags.includes(tag)) return
//     setHashtags([...hashtags, tag])
//     setHashtagsInput('')
//     setSuggestions([])
//   }

//   const removeTag = (tag) => setHashtags(hashtags.filter((t) => t !== tag))

//   const resetFilters = () => {
//     setBrightness(0)
//     setContrast(1)
//     setSaturation(1)
//     setSelectedFilter('normal')
//     setShowAdjust(null)
//   }

//   const exportEditedImage = async () => {
//     try {
//       if (!canvasRef.current) {
//         console.log('❌ Canvas ref not ready, using original')
//         return selectedImage
//       }

//       const hasFilters = selectedFilter !== 'normal' || brightness !== 0 || contrast !== 1 || saturation !== 1
//       if (!hasFilters) {
//         console.log('✅ No filters, using original')
//         return selectedImage
//       }

//       console.log('📸 Capturing canvas...')
//       const uri = await captureRef(canvasRef, {
//         format: 'jpg',
//         quality: 0.9,
//         result: 'tmpfile',
//       })
//       console.log('✅ Captured:', uri)
//       return uri
//     } catch (error) {
//       console.log('❌ Capture error:', error)
//       return selectedImage
//     }
//   }

//   const onSubmit = async () => {
//     try {
//       const token = await getItem('token')
//       showLoader()
      
//       let finalImageUri = selectedImage

//       if (selectedMediaType === 'image') {
//         finalImageUri = await exportEditedImage()
//       }

//       if (!finalImageUri) {
//         ToastMsg('No media selected')
//         hideLoader()
//         return
//       }

//       const fileName = finalImageUri.split('/').pop()
//       const formData = new FormData()
//       formData.append('type', selectedMediaType)
//       formData.append('file', {
//         uri: Platform.OS === 'android' ? finalImageUri : finalImageUri.replace('file://', ''),
//         name: fileName || `upload.${selectedMediaType === 'video' ? 'mp4' : 'jpg'}`,
//         type: selectedMediaType === 'video' ? 'video/mp4' : 'image/jpeg',
//       })
//       formData.append('Caption', caption || 'No caption')
//       formData.append('Hashtags', JSON.stringify(hashtags))
//       formData.append('Filter', selectedFilter)

//       const response = await fetch(`${BASE_URL}/api/user/AddPost`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       })
      
//       if (!response.ok) throw new Error(`Server error ${response.status}`)
//       const result = JSON.parse(await response.text())
//       ToastMsg(result?.message)
//       navigation.navigate('Tab')
//     } catch (error) {
//       console.log('❌ Submit error:', error)
//       ToastMsg('Something went wrong')
//     } finally {
//       hideLoader()
//     }
//   }

//   const handleSelect = async (uri) => {
//     console.log('📸 Original URI:', uri)
    
//     // ✅ For content:// URIs, use ImagePicker to get file path
//     if (uri.startsWith('content://')) {
//       try {
//         console.log('🔄 Converting content:// URI...')
//         const image = await ImagePicker.openPicker({
//           path: uri,
//           cropping: false,
//         })
//         console.log('✅ Converted URI:', image.path)
//         setSelectedImage(image.path)
//       } catch (err) {
//         console.log('❌ Conversion failed, using original')
//         setSelectedImage(uri)
//       }
//     } else {
//       setSelectedImage(uri)
//     }
    
//     setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
//     setIsPreviewVisible(true)
//   }

//   const handleOpenCamera = () => {
//     launchCamera({
//       mediaType: activeTab === 'Videos' ? 'video' : 'photo',
//       cameraType: 'back',
//       quality: 0.8,
//     }, response => {
//       if (!response.didCancel && !response.errorCode) {
//         const uri = response?.assets?.[0]?.uri
//         if (uri) {
//           setSelectedImage(uri)
//           setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
//           setIsPreviewVisible(true)
//         }
//       }
//     })
//   }

//   const handleCropImage = async () => {
//     if (selectedMediaType !== 'image') return ToastMsg('Cropping is only for images')
//     try {
//       const cropped = await ImagePicker.openCropper({
//         path: selectedImage,
//         width: 1080,
//         height: 1080,
//         cropping: true,
//       })
//       if (cropped?.path) setSelectedImage(cropped.path)
//     } catch (err) {
//       console.log('Crop cancelled')
//     }
//   }

//   const renderItem = ({ item, index }) => {
//     if (index === 0) {
//       return (
//         <TouchableOpacity onPress={handleOpenCamera} activeOpacity={0.8}>
//           <View style={styles.cameraTile}>
//             <FontAwesome name={activeTab === 'Videos' ? 'video-camera' : 'camera'} size={20} color='#fff' />
//             <Text style={styles.cameraText}>{activeTab === 'Videos' ? 'Record' : 'Camera'}</Text>
//           </View>
//         </TouchableOpacity>
//       )
//     }
//     const uri = item.node.image.uri
//     const isSelected = selectedImage === uri
//     return (
//       <TouchableOpacity onPress={() => handleSelect(uri)} activeOpacity={0.8}>
//         <View style={[styles.imageTile, isSelected && styles.selectedTile]}>
//           <Image source={{ uri }} style={styles.image} resizeMode='cover' />
//           {activeTab === 'Videos' && (
//             <View style={styles.videoOverlay}>
//               <Icon name='play-circle' size={24} color='rgba(255,255,255,0.8)' />
//             </View>
//           )}
//           {isSelected && (
//             <View style={styles.checkIconContainer}>
//               <Icon name='checkmark' size={16} color='#fff' />
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     )
//   }

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={{ flex: 1, backgroundColor: isDarkMode ? '#252525' : '#fff' }}>
//         <StatusBar backgroundColor='transparent' translucent barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        
//         <Row style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             {isDarkMode ? <BackIcon /> : <PrimaryBackArrow />}
//           </TouchableOpacity>
//           <CustomText style={styles.headerText}>Select Media</CustomText>
//         </Row>

//         <View style={styles.tabContainer}>
//           {['Images', 'Videos'].map(tab => (
//             <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tab && styles.activeTab]}
//               onPress={() => setActiveTab(tab)}>
//               <LinearGradient colors={['#21B7FF', '#0084F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//                 style={[styles.tabButton, { borderRadius: 8 }]}>
//                 <Icon name={tab === 'Images' ? 'image-outline' : 'videocam-outline'} size={20} 
//                   color={activeTab === tab ? '#fff' : isDarkMode ? '#fff' : '#333'} />
//                 <Text style={[styles.tabText, { color: activeTab === tab ? '#fff' : isDarkMode ? '#fff' : '#333' }]}>
//                   {tab}
//                 </Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : (
//           <>
//             <FlatList data={activeTab === 'Images' ? photos : videos} keyExtractor={(item, index) => index.toString()}
//               numColumns={3} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 100, alignSelf: 'center' }}
//               key={activeTab} />
//             {selectedImage && !isPreviewVisible && (
//               <TouchableOpacity style={styles.postButton} onPress={() => setIsPreviewVisible(true)}>
//                 <Icon name='arrow-up-circle-outline' size={20} color='#fff' />
//                 <Text style={styles.postButtonText}>Next</Text>
//               </TouchableOpacity>
//             )}
//           </>
//         )}

//         {isPreviewVisible && selectedImage && (
//           <View style={[styles.previewContainer, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
//             <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              
//               <View style={[styles.previewHeader, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
//                 <TouchableOpacity onPress={() => {
//                   setIsPreviewVisible(false)
//                   setCaption('')
//                   setHashtags([])
//                   setHashtagsInput('')
//                   setShowFilters(false)
//                   resetFilters()
//                 }} style={styles.headerButton}>
//                   <Icon name='chevron-back' size={24} color={isDarkMode ? '#fff' : '#333'} />
//                   <Text style={[styles.headerButtonText, { color: isDarkMode ? '#fff' : '#333' }]}>Back</Text>
//                 </TouchableOpacity>

//                 <Text style={[styles.previewTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Create Post</Text>

//                 <TouchableOpacity onPress={() => {
//                   if (selectedMediaType === 'image') setShowFilters(!showFilters)
//                   else ToastMsg('Video editing coming soon')
//                 }} style={styles.headerButton}>
//                   <Icon name={selectedMediaType === 'video' ? 'cut' : 'color-filter'} size={20} 
//                     color={isDarkMode ? '#fff' : '#333'} />
//                   <Text style={[styles.headerButtonText, { color: isDarkMode ? '#fff' : '#333' }]}>
//                     {selectedMediaType === 'video' ? 'Trim' : 'Filters'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false} 
//                 keyboardShouldPersistTaps='handled' contentContainerStyle={{ paddingBottom: 250 }}>
                
//                 {selectedMediaType === 'video' ? (
//                   <View style={styles.videoPreviewContainer}>
//                     <Video source={{ uri: selectedImage }} style={styles.previewVideo} resizeMode='contain' 
//                       controls paused={false} repeat muted={false} />
//                   </View>
//                 ) : (
//                   <View style={styles.imagePreviewContainer}>
//                     {/* ✅ Show actual working status */}
//                     <View style={[styles.imageWrapper, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}
//                       ref={canvasRef} collapsable={false}>
                      
//                       <Image 
//                         source={{ uri: selectedImage }} 
//                         style={{ width: width , height: width  }} 
//                         resizeMode='contain' 
//                       />
                      
//                       {/* ✅ Debug overlay */}
//                       {/* <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: skiaImage ? 'green' : 'red', padding: 8, borderRadius: 5 }}>
//                         <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
//                           {skiaImage ? '✅ Skia Ready' : '❌ Skia Failed'}
//                         </Text>
//                         <Text style={{ color: 'white', fontSize: 9, marginTop: 2 }}>
//                           Filter: {selectedFilter}
//                         </Text>
//                       </View> */}
                      
//                       {/* ✅ Try to render Skia IF loaded */}
//                       {skiaImage ? (
//                         <View style={{ position: 'absolute', top: 0, left: 0, width: width, height: width }}>
//                           <Canvas style={{ width: width, height: width }}>
//                             <SkiaImage 
//                               image={skiaImage} 
//                               x={0} 
//                               y={0} 
//                               width={width} 
//                               height={width} 
//                               fit="contain"
//                             >
//                               <ColorMatrix matrix={getColorMatrix()} />
//                             </SkiaImage>
//                           </Canvas>
//                         </View>
//                       ) : null}
//                     </View>
//                   </View>
//                 )}

//                 {showFilters && selectedMediaType === 'image' && (
//                   <View style={[styles.filtersSection, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
//                     <View style={styles.filterTabsContainer}>
//                       <TouchableOpacity onPress={() => setFilterTab('filters')} 
//                         style={[styles.filterTabButton, filterTab === 'filters' && styles.activeFilterTab]}>
//                         <Icon name='sparkles' size={18} color={filterTab === 'filters' ? '#0084F8' : isDarkMode ? '#888' : '#666'} />
//                         <Text style={[styles.filterTabText, { color: filterTab === 'filters' ? '#0084F8' : isDarkMode ? '#888' : '#666' }]}>
//                           Filters
//                         </Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity onPress={() => setFilterTab('adjust')} 
//                         style={[styles.filterTabButton, filterTab === 'adjust' && styles.activeFilterTab]}>
//                         <Icon name='options' size={18} color={filterTab === 'adjust' ? '#0084F8' : isDarkMode ? '#888' : '#666'} />
//                         <Text style={[styles.filterTabText, { color: filterTab === 'adjust' ? '#0084F8' : isDarkMode ? '#888' : '#666' }]}>
//                           Adjust
//                         </Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity onPress={handleCropImage} style={styles.filterTabButton}>
//                         <Icon name='crop' size={18} color={isDarkMode ? '#888' : '#666'} />
//                         <Text style={[styles.filterTabText, { color: isDarkMode ? '#888' : '#666' }]}>Crop</Text>
//                       </TouchableOpacity>
//                     </View>

//                     {filterTab === 'filters' && (
//                       <View style={styles.filtersContent}>
//                         <View style={styles.filtersHeader}>
//                           <Text style={[styles.filtersTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Choose Filter</Text>
//                           <TouchableOpacity onPress={resetFilters}>
//                             <Text style={styles.resetButton}>Reset</Text>
//                           </TouchableOpacity>
//                         </View>
//                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                           {presetFilters.map((preset) => (
//                             <TouchableOpacity key={preset.id} onPress={() => {
//                               console.log('🎨 Filter selected:', preset.id)
//                               setSelectedFilter(preset.id)
//                             }} 
//                               style={styles.filterThumbnailContainer}>
//                               <View style={[styles.filterThumbnail, selectedFilter === preset.id && styles.selectedFilterThumbnail]}>
//                                 <Image source={{ uri: selectedImage }} style={styles.filterThumbnailImage} resizeMode='cover' />
//                               </View>
//                               <Text style={[styles.filterName, { color: isDarkMode ? '#fff' : '#333' }, 
//                                 selectedFilter === preset.id && { color: '#0084F8', fontWeight: '600' }]}>
//                                 {preset.name}
//                               </Text>
//                             </TouchableOpacity>
//                           ))}
//                         </ScrollView>
//                       </View>
//                     )}

//                     {filterTab === 'adjust' && (
//                       <View style={styles.adjustContent}>
//                         <Text style={[styles.adjustTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Fine Tune</Text>
                        
//                         <View style={styles.adjustButtonsRow}>
//                           <TouchableOpacity style={[styles.adjustButton, showAdjust === 'brightness' && styles.adjustButtonActive]}
//                             onPress={() => setShowAdjust(showAdjust === 'brightness' ? null : 'brightness')}>
//                             <View style={styles.adjustIcon}>
//                               <Icon name='sunny' size={20} color={isDarkMode ? '#fff' : '#333'} />
//                             </View>
//                             <Text style={[styles.adjustLabel, { color: isDarkMode ? '#fff' : '#333' }]}>Brightness</Text>
//                           </TouchableOpacity>

//                           <TouchableOpacity style={[styles.adjustButton, showAdjust === 'contrast' && styles.adjustButtonActive]}
//                             onPress={() => setShowAdjust(showAdjust === 'contrast' ? null : 'contrast')}>
//                             <View style={styles.adjustIcon}>
//                               <Icon name='contrast' size={20} color={isDarkMode ? '#fff' : '#333'} />
//                             </View>
//                             <Text style={[styles.adjustLabel, { color: isDarkMode ? '#fff' : '#333' }]}>Contrast</Text>
//                           </TouchableOpacity>

//                           <TouchableOpacity style={[styles.adjustButton, showAdjust === 'saturation' && styles.adjustButtonActive]}
//                             onPress={() => setShowAdjust(showAdjust === 'saturation' ? null : 'saturation')}>
//                             <View style={styles.adjustIcon}>
//                               <Icon name='color-palette' size={20} color={isDarkMode ? '#fff' : '#333'} />
//                             </View>
//                             <Text style={[styles.adjustLabel, { color: isDarkMode ? '#fff' : '#333' }]}>Saturation</Text>
//                           </TouchableOpacity>
//                         </View>

//                         {showAdjust && (
//                           <View style={styles.sliderContainer}>
//                             <View style={styles.sliderHeader}>
//                               <Text style={[styles.sliderTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
//                                 {showAdjust.charAt(0).toUpperCase() + showAdjust.slice(1)}
//                               </Text>
//                               <Text style={[styles.sliderValue, { color: isDarkMode ? '#888' : '#666' }]}>
//                                 {showAdjust === 'brightness' && Math.round((brightness / 255) * 100)}
//                                 {showAdjust === 'contrast' && Math.round(contrast * 100)}
//                                 {showAdjust === 'saturation' && Math.round(saturation * 100)}
//                               </Text>
//                             </View>
                            
//                             {showAdjust === 'brightness' && (
//                               <Slider value={brightness} onValueChange={(val) => {
//                                 console.log('☀️ Brightness:', val)
//                                 setBrightness(val)
//                               }} 
//                                  minimumValue={-0.3}  // Pehle -50 tha, ab -0.3
//                                     maximumValue={0.3}
//                                 minimumTrackTintColor="#0084F8" maximumTrackTintColor={isDarkMode ? '#444' : '#ddd'} style={styles.slider} />
//                             )}
//                             {showAdjust === 'contrast' && (
//                               <Slider value={contrast} onValueChange={(val) => {
//                                 console.log('🌗 Contrast:', val)
//                                 setContrast(val)
//                               }} minimumValue={0.5} maximumValue={2}
//                                 minimumTrackTintColor="#0084F8" maximumTrackTintColor={isDarkMode ? '#444' : '#ddd'} style={styles.slider} />
//                             )}
//                             {showAdjust === 'saturation' && (
//                               <Slider value={saturation} onValueChange={(val) => {
//                                 console.log('🎨 Saturation:', val)
//                                 setSaturation(val)
//                               }} minimumValue={0} maximumValue={2}
//                                 minimumTrackTintColor="#0084F8" maximumTrackTintColor={isDarkMode ? '#444' : '#ddd'} style={styles.slider} />
//                             )}
//                           </View>
//                         )}
//                       </View>
//                     )}
//                   </View>
//                 )}

//                 <View style={[styles.captionContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
//                   <View style={styles.captionHeader}>
//                     <Icon name='create-outline' size={20} color={isDarkMode ? '#fff' : '#333'} />
//                     <Text style={[styles.captionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Write a caption</Text>
//                   </View>
//                   <View style={[styles.captionInputContainer, { 
//                     backgroundColor: isDarkMode ? '#2a2a2a' : '#fff', borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9' }]}>
//                     <TextInput style={[styles.captionInput, { color: isDarkMode ? '#fff' : '#333' }]}
//                       placeholder="What's on your mind?" placeholderTextColor={isDarkMode ? '#888' : '#666'}
//                       value={caption} onChangeText={setCaption} multiline maxLength={2200} />
//                   </View>
//                   <View style={styles.captionFooter}>
//                     <Text style={[styles.characterCount, { color: isDarkMode ? '#888' : '#666' }]}>{caption.length}/2200</Text>
//                   </View>
//                 </View>

//                 <View style={[styles.captionContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
//                   <View style={styles.captionHeader}>
//                     <Icon name='pricetag' size={20} color={isDarkMode ? '#fff' : '#333'} />
//                     <Text style={[styles.captionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Type hashtags</Text>
//                   </View>
//                   {hashtags.length > 0 && (
//                     <View style={styles.hashtagsDisplay}>
//                       {hashtags.map((tag, index) => (
//                         <View key={index} style={[styles.hashtagChip, { backgroundColor: isDarkMode ? '#2a2a2a' : '#e8f4ff' }]}>
//                           <Text style={[styles.hashtagText, { color: isDarkMode ? '#fff' : '#1e90ff' }]}>#{tag}</Text>
//                           <TouchableOpacity onPress={() => removeTag(tag)}>
//                             <Icon name='close-circle' size={18} color='#ff4444' />
//                           </TouchableOpacity>
//                         </View>
//                       ))}
//                     </View>
//                   )}
//                   <Row style={{ width: '100%', gap: 10, alignItems: 'center' }}>
//                     <View style={[styles.captionInputContainer, { borderWidth: 1, borderRadius: 12, padding: 3, minHeight: 48, flex: 1,
//                       backgroundColor: isDarkMode ? '#2a2a2a' : '#fff', borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9' }]}>
//                       <TextInput style={[styles.captionInput, { color: isDarkMode ? '#fff' : '#333' }]}
//                         placeholder="Enter hashtags" placeholderTextColor={isDarkMode ? '#888' : '#666'}
//                         value={hashtagsInput} onChangeText={(text) => { setHashtagsInput(text); SearchTags(text) }}
//                         maxLength={100} autoCorrect={false} />
//                     </View>
//                     <TouchableOpacity style={{ backgroundColor: '#12208B', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 }}
//                       onPress={() => addHashtag(hashtagsInput)}>
//                       <CustomText style={{ fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>Add</CustomText>
//                     </TouchableOpacity>
//                   </Row>
//                   {suggestions.length > 0 && (
//                     <View style={[styles.suggestionsContainer, {
//                       backgroundColor: isDarkMode ? '#2a2a2a' : '#fff', borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9' }]}>
//                       <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
//                         {suggestions.map((item, index) => (
//                           <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => addHashtag(item.Tag)}>
//                             <Text style={[styles.suggestionText, { color: isDarkMode ? '#fff' : '#333' }]}>#{item.Tag}</Text>
//                           </TouchableOpacity>
//                         ))}
//                       </ScrollView>
//                     </View>
//                   )}
//                 </View>
//               </ScrollView>

//               <View style={[styles.postButtonContainer, { 
//                 backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa', borderTopColor: isDarkMode ? '#333' : '#e1e5e9' }]}>
//                 <TouchableOpacity onPress={onSubmit} disabled={!selectedImage}>
//                   <LinearGradient colors={['#21B7FF', '#0084F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//                     style={[{ borderRadius: 8 }, styles.postBtn, { opacity: selectedImage ? 1 : 0.5 }]}>
//                     <Icon name='send' size={18} color='#fff' style={styles.postIcon} />
//                     <Text style={styles.postText}>Share {selectedMediaType === 'video' ? 'Video' : 'Post'}</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>
//             </KeyboardAvoidingView>
//           </View>
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   )
// }

// export default GalleryForAddPost

// const styles = StyleSheet.create({
//   header: { paddingTop: 50, paddingHorizontal: 20, gap: 90, paddingBottom: 20 },
//   headerText: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
//   tabContainer: { flexDirection: 'row', paddingHorizontal: 10, marginBottom: 10 },
//   tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 25 },
//   activeTab: { shadowRadius: 4 },
//   tabText: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginLeft: 8 },
//   errorText: { textAlign: 'center', marginTop: 20, color: 'red' },
//   cameraTile: { width: imageSize, height: 170, margin: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' },
//   cameraText: { color: '#fff', fontSize: 10, marginTop: 4, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
//   imageTile: { width: imageSize, height: 170, margin: 1, overflow: 'hidden', position: 'relative' },
//   selectedTile: { borderWidth: 3, borderColor: '#1e90ff' },
//   image: { width: '100%', height: '100%' },
//   videoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
//   checkIconContainer: { position: 'absolute', top: 5, right: 5, backgroundColor: '#1e90ff', borderRadius: 12, padding: 2 },
//   postButton: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#1e90ff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, flexDirection: 'row', alignItems: 'center', elevation: 5 },
//   postButtonText: { color: '#fff', marginLeft: 8, fontSize: 16 },
//   previewContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, flex: 1 },
//   previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
//   headerButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, minWidth: 60 },
//   headerButtonText: { marginLeft: 4, fontSize: 14, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
//   previewTitle: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textAlign: 'center' },
//   previewContent: { flex: 1 },
//   imagePreviewContainer: { padding: 16, alignItems:'center' },
//   imageWrapper: { borderRadius: 16, overflow: 'hidden', elevation: 3 },
//   videoPreviewContainer: { padding: 16 },
//   previewVideo: { width: width - 32, height: width - 32, borderRadius: 16, backgroundColor: '#000' },
//   filtersSection: { margin: 16, marginTop: 0, borderRadius: 16, padding: 16, elevation: 2 },
//   filterTabsContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
//   filterTabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, gap: 6 },
//   activeFilterTab: { backgroundColor: 'rgba(0, 132, 248, 0.1)' },
//   filterTabText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   filtersContent: { marginTop: 8 },
//   filtersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   filtersTitle: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
//   resetButton: { color: '#0084F8', fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   filterThumbnailContainer: { marginRight: 12, alignItems: 'center' },
//   filterThumbnail: { width: 80, height: 80, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
//   selectedFilterThumbnail: { borderColor: '#0084F8' },
//   filterThumbnailImage: { width: '100%', height: '100%' },
//   filterName: { marginTop: 6, fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   adjustContent: { marginTop: 8 },
//   adjustTitle: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginBottom: 16 },
//   adjustButtonsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
//   adjustButton: { alignItems: 'center', padding: 8, borderRadius: 8 },
//   adjustButtonActive: { backgroundColor: 'rgba(0, 132, 248, 0.1)' },
//   adjustIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
//   adjustLabel: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   sliderContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
//   sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//   sliderTitle: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   sliderValue: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   slider: { width: '100%', height: 40 },
//   captionContainer: { margin: 16, marginTop: 0, borderRadius: 16, padding: 16, elevation: 2 },
//   captionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   captionTitle: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginLeft: 8 },
//   captionInputContainer: { borderWidth: 1, borderRadius: 12, padding: 16, minHeight: 120, maxHeight: 200 },
//   captionInput: { fontSize: 16, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold, lineHeight: 22, flex: 1, textAlignVertical: 'top' },
//   captionFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
//   characterCount: { fontSize: 12, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
//   hashtagsDisplay: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
//   hashtagChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, gap: 6 },
//   hashtagText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   suggestionsContainer: { marginTop: 10, borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
//   suggestionItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
//   suggestionText: { fontSize: 14, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
//   postButtonContainer: { paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
//   postBtn: { paddingVertical: 13, paddingHorizontal: 24, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 4 },
//   postIcon: { marginRight: 8 },
//   postText: { color: '#fff', fontSize: 19, fontFamily: FONTS_FAMILY.SourceSans3_Medium, fontWeight: '600' },
// })


import React, { useEffect, useState, useRef } from 'react'
import {
  View, FlatList, Image, PermissionsAndroid, Platform, Text,
  TouchableOpacity, Dimensions, StatusBar, StyleSheet, TextInput,
  KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard,
  Modal, ActivityIndicator,
} from 'react-native'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { launchCamera } from 'react-native-image-picker'
import ImagePicker from 'react-native-image-crop-picker'
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient'
import Slider from '@react-native-community/slider'
import { useSelector } from 'react-redux'
import { captureRef } from 'react-native-view-shot'
import { Canvas, Image as SkiaImage, useImage, ColorMatrix } from '@shopify/react-native-skia'
import RNFS from 'react-native-fs'

import { BASE_URL, getItem } from '../../utils/Apis'
import useLoader from '../../utils/LoaderHook'
import { ToastMsg } from '../../utils/helperFunctions'
import Row from '../../components/wrapper/row'
import { BackIcon, PrimaryBackArrow } from '../../assets/SVGs'
import { FONTS_FAMILY } from '../../assets/Fonts'
import CustomText from '../../components/TextComponent'

const screenWidth = Dimensions.get('window').width
const imageSize = screenWidth / 3 - 10
const { width } = Dimensions.get('window')

const GalleryForAddPost = ({ navigation }) => {
  const [photos, setPhotos] = useState([])
  const [videos, setVideos] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [caption, setCaption] = useState('')
  const [activeTab, setActiveTab] = useState('Images')
  const [selectedMediaType, setSelectedMediaType] = useState('image')
  const { isDarkMode } = useSelector(state => state.theme)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const { showLoader, hideLoader } = useLoader()
  
  const [hashtagsInput, setHashtagsInput] = useState('')
  const [hashtags, setHashtags] = useState([])
  const [suggestions, setSuggestions] = useState([])
  
  // ✅ Collaborator/Tag Feature States
  const [taggedUsers, setTaggedUsers] = useState([])
  const [showTagModal, setShowTagModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // ✅ Dummy Users (Replace with API later)
  const dummyUsers = [
    { id: '1', name: 'John Doe', username: '@johndoe', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Jane Smith', username: '@janesmith', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Mike Wilson', username: '@mikewilson', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'Sarah Johnson', username: '@sarahjohn', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'David Brown', username: '@davidbrown', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '6', name: 'Emily Davis', username: '@emilydavis', avatar: 'https://i.pravatar.cc/150?img=6' },
    { id: '7', name: 'Chris Martin', username: '@chrismartin', avatar: 'https://i.pravatar.cc/150?img=7' },
    { id: '8', name: 'Lisa Anderson', username: '@lisaanderson', avatar: 'https://i.pravatar.cc/150?img=8' },
  ]
  
  const filteredUsers = dummyUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const [showFilters, setShowFilters] = useState(false)
  const [filterTab, setFilterTab] = useState('filters')
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(1)
  const [saturation, setSaturation] = useState(1)
  const [selectedFilter, setSelectedFilter] = useState('normal')
  const [showAdjust, setShowAdjust] = useState(null)
  
  const canvasRef = useRef(null)
  
  // ✅ SIMPLE: Just load the image directly
  const skiaImage = useImage(selectedImage)
  
  // Debug
  useEffect(() => {
    if (selectedImage) {
      console.log('===== SKIA DEBUG =====')
      console.log('Selected Image URI:', selectedImage)
      console.log('Skia Image Loaded:', !!skiaImage)
      if (skiaImage) {
        console.log('Skia Image Width:', skiaImage.width())
        console.log('Skia Image Height:', skiaImage.height())
      }
      console.log('=====================')
    }
  }, [selectedImage, skiaImage])

  // Log to check if image loads
  useEffect(() => {
    console.log('===== SKIA DEBUG =====')
    console.log('Selected Image:', selectedImage)
    console.log('Skia Image Object:', skiaImage)
    console.log('Is Skia Loaded?', !!skiaImage)
    console.log('=====================')
  }, [selectedImage, skiaImage])

  const filters = {
    normal: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    clarendon: [1.15, 0, 0, 0, 0, 0, 1.08, 0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 0, 1, 0],
    gingham: [1.05, 0, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 0, 1, 0],
    moon: [0.95, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 1, 0],
    lark: [1.08, 0, 0, 0, 0, 0, 1.03, 0, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 0, 1, 0],
    reyes: [1.05, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 0.93, 0, 0, 0, 0, 0, 1, 0],
    juno: [1.1, 0, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 1, 0],
    slumber: [1.02, 0, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 0, 1, 0],
    aden: [1.05, 0, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 0, 1, 0],
    perpetua: [1.03, 0, 0, 0, 0, 0, 1.03, 0, 0, 0, 0, 0, 0.99, 0, 0, 0, 0, 0, 1, 0],
    bw: [0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0],
  }

  const presetFilters = [
    { name: 'Normal', id: 'normal' },
    { name: 'Clarendon', id: 'clarendon' },
    { name: 'Gingham', id: 'gingham' },
    { name: 'Moon', id: 'moon' },
    { name: 'Lark', id: 'lark' },
    { name: 'Reyes', id: 'reyes' },
    { name: 'Juno', id: 'juno' },
    { name: 'Slumber', id: 'slumber' },
    { name: 'Aden', id: 'aden' },
    { name: 'Perpetua', id: 'perpetua' },
    { name: 'B&W', id: 'bw' },
  ]

  const getColorMatrix = () => {
    const filter = filters[selectedFilter]
    const b = brightness / 255
    const c = contrast
    const s = saturation

    console.log('🎨 Applying Filter:', selectedFilter)
    console.log('📊 Values - Brightness:', brightness, 'Contrast:', contrast, 'Saturation:', saturation)

    return [
      filter[0] * c * s, filter[1], filter[2], filter[3], filter[4] + b * 255,
      filter[5], filter[6] * c * s, filter[7], filter[8], filter[9] + b * 255,
      filter[10], filter[11], filter[12] * c * s, filter[13], filter[14] + b * 255,
      filter[15], filter[16], filter[17], filter[18], filter[19],
    ]
  }

  useEffect(() => {
    const requestPermissionAndLoad = async () => {
      try {
        if (Platform.OS === 'android') {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          ])
        }
        const imageResult = await CameraRoll.getPhotos({ first: 50, assetType: 'Photos' })
        setPhotos(imageResult.edges)
        const videoResult = await CameraRoll.getPhotos({ first: 50, assetType: 'Videos' })
        setVideos(videoResult.edges)
      } catch (error) {
        setErrorMsg(error.message || 'Something went wrong')
      }
    }
    requestPermissionAndLoad()
  }, [])

  const SearchTags = async (tag) => {
    try {
      if (!tag.trim()) { setSuggestions([]); return }
      const token = await getItem('token')
      const response = await fetch(`${BASE_URL}/api/admin/SearchHashtags?query=${tag}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      const result = await response.json()
      setSuggestions(result?.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  const addHashtag = (tag) => {
    tag = tag.toLowerCase().trim()
    if (!tag || hashtags.includes(tag)) return
    setHashtags([...hashtags, tag])
    setHashtagsInput('')
    setSuggestions([])
  }

  const removeTag = (tag) => setHashtags(hashtags.filter((t) => t !== tag))
  
  // ✅ Tag Users Functions
  const toggleTagUser = (user) => {
    const isTagged = taggedUsers.find(u => u.id === user.id)
    if (isTagged) {
      setTaggedUsers(taggedUsers.filter(u => u.id !== user.id))
    } else {
      setTaggedUsers([...taggedUsers, user])
    }
  }
  
  const removeTaggedUser = (userId) => {
    setTaggedUsers(taggedUsers.filter(u => u.id !== userId))
  }

  const resetFilters = () => {
    setBrightness(0)
    setContrast(1)
    setSaturation(1)
    setSelectedFilter('normal')
    setShowAdjust(null)
  }

  const exportEditedImage = async () => {
    try {
      if (!canvasRef.current) {
        console.log('❌ Canvas ref not ready, using original')
        return selectedImage
      }

      const hasFilters = selectedFilter !== 'normal' || brightness !== 0 || contrast !== 1 || saturation !== 1
      if (!hasFilters) {
        console.log('✅ No filters, using original')
        return selectedImage
      }

      console.log('📸 Capturing canvas...')
      const uri = await captureRef(canvasRef, {
        format: 'jpg',
        quality: 0.9,
        result: 'tmpfile',
      })
      console.log('✅ Captured:', uri)
      return uri
    } catch (error) {
      console.log('❌ Capture error:', error)
      return selectedImage
    }
  }

  const onSubmit = async () => {
    try {
      const token = await getItem('token')
      setIsSubmitting(true) // ✅ Start loading
      
      let finalImageUri = selectedImage

      if (selectedMediaType === 'image') {
        finalImageUri = await exportEditedImage()
      }

      if (!finalImageUri) {
        ToastMsg('No media selected')
        setIsSubmitting(false)
        return
      }

      const fileName = finalImageUri.split('/').pop()
      const formData = new FormData()
      formData.append('type', selectedMediaType)
      formData.append('file', {
        uri: Platform.OS === 'android' ? finalImageUri : finalImageUri.replace('file://', ''),
        name: fileName || `upload.${selectedMediaType === 'video' ? 'mp4' : 'jpg'}`,
        type: selectedMediaType === 'video' ? 'video/mp4' : 'image/jpeg',
      })
      formData.append('Caption', caption || 'No caption')
      formData.append('Hashtags', JSON.stringify(hashtags))
      formData.append('Filter', selectedFilter)
      formData.append('TaggedUsers', JSON.stringify(taggedUsers.map(u => u.id))) // ✅ Send tagged users

      console.log('📤 Submitting post with tagged users:', taggedUsers.length)

      const response = await fetch(`${BASE_URL}/api/user/AddPost`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      
      if (!response.ok) throw new Error(`Server error ${response.status}`)
      const result = JSON.parse(await response.text())
      ToastMsg(result?.message)
      navigation.navigate('Tab')
    } catch (error) {
      console.log('❌ Submit error:', error)
      ToastMsg('Something went wrong')
    } finally {
      setIsSubmitting(false) // ✅ Stop loading
    }
  }

  const handleSelect = async (uri) => {
    console.log('📸 Original URI:', uri)
    
    // ✅ For content:// URIs, use ImagePicker to get file path
    if (uri.startsWith('content://')) {
      try {
        console.log('🔄 Converting content:// URI...')
        const image = await ImagePicker.openPicker({
          path: uri,
          cropping: false,
        })
        console.log('✅ Converted URI:', image.path)
        setSelectedImage(image.path)
      } catch (err) {
        console.log('❌ Conversion failed, using original')
        setSelectedImage(uri)
      }
    } else {
      setSelectedImage(uri)
    }
    
    setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
    setIsPreviewVisible(true)
  }

  const handleOpenCamera = () => {
    launchCamera({
      mediaType: activeTab === 'Videos' ? 'video' : 'photo',
      cameraType: 'back',
      quality: 0.8,
    }, response => {
      if (!response.didCancel && !response.errorCode) {
        const uri = response?.assets?.[0]?.uri
        if (uri) {
          setSelectedImage(uri)
          setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
          setIsPreviewVisible(true)
        }
      }
    })
  }

  const handleCropImage = async () => {
    if (selectedMediaType !== 'image') return ToastMsg('Cropping is only for images')
    try {
      const cropped = await ImagePicker.openCropper({
        path: selectedImage,
        width: 1080,
        height: 1080,
        cropping: true,
      })
      if (cropped?.path) setSelectedImage(cropped.path)
    } catch (err) {
      console.log('Crop cancelled')
    }
  }

  const renderItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <TouchableOpacity onPress={handleOpenCamera} activeOpacity={0.8}>
          <View style={styles.cameraTile}>
            <FontAwesome name={activeTab === 'Videos' ? 'video-camera' : 'camera'} size={20} color='#fff' />
            <Text style={styles.cameraText}>{activeTab === 'Videos' ? 'Record' : 'Camera'}</Text>
          </View>
        </TouchableOpacity>
      )
    }
    const uri = item.node.image.uri
    const isSelected = selectedImage === uri
    return (
      <TouchableOpacity onPress={() => handleSelect(uri)} activeOpacity={0.8}>
        <View style={[styles.imageTile, isSelected && styles.selectedTile]}>
          <Image source={{ uri }} style={styles.image} resizeMode='cover' />
          {activeTab === 'Videos' && (
            <View style={styles.videoOverlay}>
              <Icon name='play-circle' size={24} color='rgba(255,255,255,0.8)' />
            </View>
          )}
          {isSelected && (
            <View style={styles.checkIconContainer}>
              <Icon name='checkmark' size={16} color='#fff' />
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: isDarkMode ? '#252525' : '#fff' }}>
        <StatusBar backgroundColor='transparent' translucent barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        
        <Row style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {isDarkMode ? <BackIcon /> : <PrimaryBackArrow />}
          </TouchableOpacity>
          <CustomText style={styles.headerText}>Select Media</CustomText>
        </Row>

        <View style={styles.tabContainer}>
          {['Images', 'Videos'].map(tab => (
            <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}>
              <LinearGradient colors={['#21B7FF', '#0084F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={[styles.tabButton, { borderRadius: 8 }]}>
                <Icon name={tab === 'Images' ? 'image-outline' : 'videocam-outline'} size={20} 
                  color={activeTab === tab ? '#fff' : isDarkMode ? '#fff' : '#333'} />
                <Text style={[styles.tabText, { color: activeTab === tab ? '#fff' : isDarkMode ? '#fff' : '#333' }]}>
                  {tab}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : (
          <>
            <FlatList data={activeTab === 'Images' ? photos : videos} keyExtractor={(item, index) => index.toString()}
              numColumns={3} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 100, alignSelf: 'center' }}
              key={activeTab} />
            {selectedImage && !isPreviewVisible && (
              <TouchableOpacity style={styles.postButton} onPress={() => setIsPreviewVisible(true)}>
                <Icon name='arrow-up-circle-outline' size={20} color='#fff' />
                <Text style={styles.postButtonText}>Next</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {isPreviewVisible && selectedImage && (
          <View style={[styles.previewContainer, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              
              <View style={[styles.previewHeader, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
                <TouchableOpacity onPress={() => {
                  setIsPreviewVisible(false)
                  setCaption('')
                  setHashtags([])
                  setHashtagsInput('')
                  setShowFilters(false)
                  resetFilters()
                }} style={styles.headerButton}>
                  <Icon name='chevron-back' size={24} color={isDarkMode ? '#fff' : '#333'} />
                  <Text style={[styles.headerButtonText, { color: isDarkMode ? '#fff' : '#333' }]}>Back</Text>
                </TouchableOpacity>

                <Text style={[styles.previewTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Create Post</Text>

                <TouchableOpacity onPress={() => {
                  if (selectedMediaType === 'image') setShowFilters(!showFilters)
                  else ToastMsg('Video editing coming soon')
                }} style={styles.headerButton}>
                  <Icon name={selectedMediaType === 'video' ? 'cut' : 'color-filter'} size={20} 
                    color={isDarkMode ? '#fff' : '#333'} />
                  <Text style={[styles.headerButtonText, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {selectedMediaType === 'video' ? 'Trim' : 'Filters'}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false} 
                keyboardShouldPersistTaps='handled' contentContainerStyle={{ paddingBottom: 250 }}>
                
                {selectedMediaType === 'video' ? (
                  <View style={styles.videoPreviewContainer}>
                    <Video source={{ uri: selectedImage }} style={styles.previewVideo} resizeMode='contain' 
                      controls paused={false} repeat muted={false} />
                  </View>
                ) : (
                  <View style={styles.imagePreviewContainer}>
                    {/* ✅ Show actual working status */}
                    <View style={[styles.imageWrapper, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}
                      ref={canvasRef} collapsable={false}>
                      
                      <Image 
                        source={{ uri: selectedImage }} 
                        style={{ width: width - 32, height: width - 32 }} 
                        resizeMode='contain' 
                      />
                      
                      {/* ✅ Debug overlay */}
                      {/* <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: skiaImage ? 'green' : 'red', padding: 8, borderRadius: 5 }}>
                        <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
                          {skiaImage ? '✅ Skia Ready' : '❌ Skia Failed'}
                        </Text>
                        <Text style={{ color: 'white', fontSize: 9, marginTop: 2 }}>
                          Filter: {selectedFilter}
                        </Text>
                      </View> */}
                      
                      {/* ✅ Try to render Skia IF loaded */}
                      {skiaImage ? (
                        <View style={{ position: 'absolute', top: 0, left: 0, width: width - 32, height: width - 32 }}>
                          <Canvas style={{ width: width - 32, height: width - 32 }}>
                            <SkiaImage 
                              image={skiaImage} 
                              x={0} 
                              y={0} 
                              width={width - 32} 
                              height={width - 32} 
                              fit="contain"
                            >
                              <ColorMatrix matrix={getColorMatrix()} />
                            </SkiaImage>
                          </Canvas>
                        </View>
                      ) : null}
                    </View>
                  </View>
                )}

                {showFilters && selectedMediaType === 'image' && (
                  <View style={[styles.filtersSection, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
                    <View style={styles.filterTabsContainer}>
                      <TouchableOpacity onPress={() => setFilterTab('filters')} 
                        style={[styles.filterTabButton, filterTab === 'filters' && styles.activeFilterTab]}>
                        <Icon name='sparkles' size={18} color={filterTab === 'filters' ? '#0084F8' : isDarkMode ? '#888' : '#666'} />
                        <Text style={[styles.filterTabText, { color: filterTab === 'filters' ? '#0084F8' : isDarkMode ? '#888' : '#666' }]}>
                          Filters
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setFilterTab('adjust')} 
                        style={[styles.filterTabButton, filterTab === 'adjust' && styles.activeFilterTab]}>
                        <Icon name='options' size={18} color={filterTab === 'adjust' ? '#0084F8' : isDarkMode ? '#888' : '#666'} />
                        <Text style={[styles.filterTabText, { color: filterTab === 'adjust' ? '#0084F8' : isDarkMode ? '#888' : '#666' }]}>
                          Adjust
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={handleCropImage} style={styles.filterTabButton}>
                        <Icon name='crop' size={18} color={isDarkMode ? '#888' : '#666'} />
                        <Text style={[styles.filterTabText, { color: isDarkMode ? '#888' : '#666' }]}>Crop</Text>
                      </TouchableOpacity>
                    </View>

                    {filterTab === 'filters' && (
                      <View style={styles.filtersContent}>
                        <View style={styles.filtersHeader}>
                          <Text style={[styles.filtersTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Choose Filter</Text>
                          <TouchableOpacity onPress={resetFilters}>
                            <Text style={styles.resetButton}>Reset</Text>
                          </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {presetFilters.map((preset) => (
                            <TouchableOpacity key={preset.id} onPress={() => {
                              console.log('🎨 Filter selected:', preset.id)
                              setSelectedFilter(preset.id)
                            }} 
                              style={styles.filterThumbnailContainer}>
                              <View style={[styles.filterThumbnail, selectedFilter === preset.id && styles.selectedFilterThumbnail]}>
                                <Image source={{ uri: selectedImage }} style={styles.filterThumbnailImage} resizeMode='cover' />
                              </View>
                              <Text style={[styles.filterName, { color: isDarkMode ? '#fff' : '#333' }, 
                                selectedFilter === preset.id && { color: '#0084F8', fontWeight: '600' }]}>
                                {preset.name}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {filterTab === 'adjust' && (
                      <View style={styles.adjustContent}>
                        <Text style={[styles.adjustTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Fine Tune</Text>
                        
                        <View style={styles.adjustButtonsRow}>
                          <TouchableOpacity style={[styles.adjustButton, showAdjust === 'brightness' && styles.adjustButtonActive]}
                            onPress={() => setShowAdjust(showAdjust === 'brightness' ? null : 'brightness')}>
                            <View style={styles.adjustIcon}>
                              <Icon name='sunny' size={20} color={isDarkMode ? '#fff' : '#333'} />
                            </View>
                            <Text style={[styles.adjustLabel, { color: isDarkMode ? '#fff' : '#333' }]}>Brightness</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={[styles.adjustButton, showAdjust === 'contrast' && styles.adjustButtonActive]}
                            onPress={() => setShowAdjust(showAdjust === 'contrast' ? null : 'contrast')}>
                            <View style={styles.adjustIcon}>
                              <Icon name='contrast' size={20} color={isDarkMode ? '#fff' : '#333'} />
                            </View>
                            <Text style={[styles.adjustLabel, { color: isDarkMode ? '#fff' : '#333' }]}>Contrast</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={[styles.adjustButton, showAdjust === 'saturation' && styles.adjustButtonActive]}
                            onPress={() => setShowAdjust(showAdjust === 'saturation' ? null : 'saturation')}>
                            <View style={styles.adjustIcon}>
                              <Icon name='color-palette' size={20} color={isDarkMode ? '#fff' : '#333'} />
                            </View>
                            <Text style={[styles.adjustLabel, { color: isDarkMode ? '#fff' : '#333' }]}>Saturation</Text>
                          </TouchableOpacity>
                        </View>

                        {showAdjust && (
                          <View style={styles.sliderContainer}>
                            <View style={styles.sliderHeader}>
                              <Text style={[styles.sliderTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                                {showAdjust.charAt(0).toUpperCase() + showAdjust.slice(1)}
                              </Text>
                              <Text style={[styles.sliderValue, { color: isDarkMode ? '#888' : '#666' }]}>
                                {showAdjust === 'brightness' && Math.round((brightness / 255) * 100)}
                                {showAdjust === 'contrast' && Math.round(contrast * 100)}
                                {showAdjust === 'saturation' && Math.round(saturation * 100)}
                              </Text>
                            </View>
                            
                            {showAdjust === 'brightness' && (
                              <Slider value={brightness} onValueChange={(val) => {
                                console.log('☀️ Brightness:', val)
                                setBrightness(val)
                              }}
                                 minimumValue={-0.3}  // Pehle -50 tha, ab -0.3
                                    maximumValue={0.3}
                                minimumTrackTintColor="#0084F8" maximumTrackTintColor={isDarkMode ? '#444' : '#ddd'} style={styles.slider} />
                            )}
                            {showAdjust === 'contrast' && (
                              <Slider value={contrast} onValueChange={(val) => {
                                console.log('🌗 Contrast:', val)
                                setContrast(val)
                              }} minimumValue={0.5} maximumValue={2}
                                minimumTrackTintColor="#0084F8" maximumTrackTintColor={isDarkMode ? '#444' : '#ddd'} style={styles.slider} />
                            )}
                            {showAdjust === 'saturation' && (
                              <Slider value={saturation} onValueChange={(val) => {
                                console.log('🎨 Saturation:', val)
                                setSaturation(val)
                              }} minimumValue={0} maximumValue={2}
                                minimumTrackTintColor="#0084F8" maximumTrackTintColor={isDarkMode ? '#444' : '#ddd'} style={styles.slider} />
                            )}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}

                <View style={[styles.captionContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
                  <View style={styles.captionHeader}>
                    <Icon name='create-outline' size={20} color={isDarkMode ? '#fff' : '#333'} />
                    <Text style={[styles.captionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Write a caption</Text>
                  </View>
                  <View style={[styles.captionInputContainer, { 
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#fff', borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9' }]}>
                    <TextInput style={[styles.captionInput, { color: isDarkMode ? '#fff' : '#333' }]}
                      placeholder="What's on your mind?" placeholderTextColor={isDarkMode ? '#888' : '#666'}
                      value={caption} onChangeText={setCaption} multiline maxLength={2200} />
                  </View>
                  <View style={styles.captionFooter}>
                    <Text style={[styles.characterCount, { color: isDarkMode ? '#888' : '#666' }]}>{caption.length}/2200</Text>
                  </View>
                </View>

                <View style={[styles.captionContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
                  <View style={styles.captionHeader}>
                    <Icon name='pricetag' size={20} color={isDarkMode ? '#fff' : '#333'} />
                    <Text style={[styles.captionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Type hashtags</Text>
                  </View>
                  {hashtags.length > 0 && (
                    <View style={styles.hashtagsDisplay}>
                      {hashtags.map((tag, index) => (
                        <View key={index} style={[styles.hashtagChip, { backgroundColor: isDarkMode ? '#2a2a2a' : '#e8f4ff' }]}>
                          <Text style={[styles.hashtagText, { color: isDarkMode ? '#fff' : '#1e90ff' }]}>#{tag}</Text>
                          <TouchableOpacity onPress={() => removeTag(tag)}>
                            <Icon name='close-circle' size={18} color='#ff4444' />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                  <Row style={{ width: '100%', gap: 10, alignItems: 'center' }}>
                    <View style={[styles.captionInputContainer, { borderWidth: 1, borderRadius: 12, padding: 3, minHeight: 48, flex: 1,
                      backgroundColor: isDarkMode ? '#2a2a2a' : '#fff', borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9' }]}>
                      <TextInput style={[styles.captionInput, { color: isDarkMode ? '#fff' : '#333' }]}
                        placeholder="Enter hashtags" placeholderTextColor={isDarkMode ? '#888' : '#666'}
                        value={hashtagsInput} onChangeText={(text) => { setHashtagsInput(text); SearchTags(text) }}
                        maxLength={100} autoCorrect={false} />
                    </View>
                    <TouchableOpacity style={{ backgroundColor: '#12208B', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 }}
                      onPress={() => addHashtag(hashtagsInput)}>
                      <CustomText style={{ fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>Add</CustomText>
                    </TouchableOpacity>
                  </Row>
                  {suggestions.length > 0 && (
                    <View style={[styles.suggestionsContainer, {
                      backgroundColor: isDarkMode ? '#2a2a2a' : '#fff', borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9' }]}>
                      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                        {suggestions.map((item, index) => (
                          <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => addHashtag(item.Tag)}>
                            <Text style={[styles.suggestionText, { color: isDarkMode ? '#fff' : '#333' }]}>#{item.Tag}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* ✅ TAG PEOPLE SECTION */}
                <View style={[styles.captionContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
                  <TouchableOpacity onPress={() => setShowTagModal(true)} style={styles.captionHeader}>
                    <Icon name='people' size={20} color={isDarkMode ? '#fff' : '#333'} />
                    <Text style={[styles.captionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                      Tag People {taggedUsers.length > 0 && `(${taggedUsers.length})`}
                    </Text>
                    <Icon name='chevron-forward' size={20} color={isDarkMode ? '#888' : '#666'} style={{ marginLeft: 'auto' }} />
                  </TouchableOpacity>
                  
                  {taggedUsers.length > 0 && (
                    <View style={styles.taggedUsersDisplay}>
                      {taggedUsers.map((user) => (
                        <View key={user.id} style={[styles.taggedUserChip, { backgroundColor: isDarkMode ? '#2a2a2a' : '#e8f4ff' }]}>
                          <Image source={{ uri: user.avatar }} style={styles.taggedUserAvatar} />
                          <Text style={[styles.taggedUserName, { color: isDarkMode ? '#fff' : '#1e90ff' }]}>{user.name}</Text>
                          <TouchableOpacity onPress={() => removeTaggedUser(user.id)}>
                            <Icon name='close-circle' size={18} color='#ff4444' />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Post Button */}
              <View style={[styles.postButtonContainer, { 
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa', borderTopColor: isDarkMode ? '#333' : '#e1e5e9' }]}>
                <TouchableOpacity onPress={onSubmit} disabled={!selectedImage || isSubmitting}>
                  <LinearGradient colors={['#21B7FF', '#0084F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={[{ borderRadius: 8 }, styles.postBtn, { opacity: (selectedImage && !isSubmitting) ? 1 : 0.5 }]}>
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                    ) : (
                      <Icon name='send' size={18} color='#fff' style={styles.postIcon} />
                    )}
                    <Text style={styles.postText}>
                      {isSubmitting ? 'Sharing...' : `Share ${selectedMediaType === 'video' ? 'Video' : 'Post'}`}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
            
            {/* ✅ TAG PEOPLE MODAL */}
            <Modal
              visible={showTagModal}
              animationType="slide"
              transparent={false}
              onRequestClose={() => setShowTagModal(false)}
            >
              <View style={{ flex: 1, backgroundColor: isDarkMode ? '#000' : '#fff' }}>
                <StatusBar backgroundColor={isDarkMode ? '#000' : '#fff'} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                
                {/* Modal Header */}
                <View style={[styles.modalHeader, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
                  <TouchableOpacity onPress={() => setShowTagModal(false)} style={styles.modalCloseBtn}>
                    <Icon name='close' size={28} color={isDarkMode ? '#fff' : '#333'} />
                  </TouchableOpacity>
                  <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Tag People</Text>
                  <TouchableOpacity onPress={() => setShowTagModal(false)} style={styles.modalDoneBtn}>
                    <Text style={styles.modalDoneText}>Done</Text>
                  </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
                  <View style={[styles.searchInputContainer, { 
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#fff', borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9' }]}>
                    <Icon name='search' size={20} color={isDarkMode ? '#888' : '#666'} />
                    <TextInput
                      style={[styles.searchInput, { color: isDarkMode ? '#fff' : '#333' }]}
                      placeholder="Search people..."
                      placeholderTextColor={isDarkMode ? '#888' : '#666'}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                </View>

                {/* Users List */}
                <ScrollView style={{ flex: 1 }}>
                  {filteredUsers.map((user) => {
                    const isTagged = taggedUsers.find(u => u.id === user.id)
                    return (
                      <TouchableOpacity
                        key={user.id}
                        onPress={() => toggleTagUser(user)}
                        style={[styles.userItem, { borderBottomColor: isDarkMode ? '#2a2a2a' : '#e1e5e9' }]}
                      >
                        <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                        <View style={styles.userInfo}>
                          <Text style={[styles.userName, { color: isDarkMode ? '#fff' : '#333' }]}>{user.name}</Text>
                          <Text style={[styles.userUsername, { color: isDarkMode ? '#888' : '#666' }]}>{user.username}</Text>
                        </View>
                        <View style={[styles.checkbox, isTagged && styles.checkboxSelected, 
                          { borderColor: isDarkMode ? '#888' : '#666' }]}>
                          {isTagged && <Icon name='checkmark' size={16} color='#fff' />}
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              </View>
            </Modal>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default GalleryForAddPost

const styles = StyleSheet.create({
  header: { paddingTop: 50, paddingHorizontal: 20, gap: 90, paddingBottom: 20 },
  headerText: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 10, marginBottom: 10 },
  tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 25 },
  activeTab: { shadowRadius: 4 },
  tabText: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginLeft: 8 },
  errorText: { textAlign: 'center', marginTop: 20, color: 'red' },
  cameraTile: { width: imageSize, height: 170, margin: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' },
  cameraText: { color: '#fff', fontSize: 10, marginTop: 4, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
  imageTile: { width: imageSize, height: 170, margin: 1, overflow: 'hidden', position: 'relative' },
  selectedTile: { borderWidth: 3, borderColor: '#1e90ff' },
  image: { width: '100%', height: '100%' },
  videoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  checkIconContainer: { position: 'absolute', top: 5, right: 5, backgroundColor: '#1e90ff', borderRadius: 12, padding: 2 },
  postButton: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#1e90ff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, flexDirection: 'row', alignItems: 'center', elevation: 5 },
  postButtonText: { color: '#fff', marginLeft: 8, fontSize: 16 },
  previewContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, flex: 1 },
  previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  headerButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, minWidth: 60 },
  headerButtonText: { marginLeft: 4, fontSize: 14, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
  previewTitle: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textAlign: 'center' },
  previewContent: { flex: 1 },
  imagePreviewContainer: { padding: 16 },
  imageWrapper: { borderRadius: 16, overflow: 'hidden', elevation: 3 },
  videoPreviewContainer: { padding: 16 },
  previewVideo: { width: width - 32, height: width - 32, borderRadius: 16, backgroundColor: '#000' },
  filtersSection: { margin: 16, marginTop: 0, borderRadius: 16, padding: 16, elevation: 2 },
  filterTabsContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterTabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, gap: 6 },
  activeFilterTab: { backgroundColor: 'rgba(0, 132, 248, 0.1)' },
  filterTabText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  filtersContent: { marginTop: 8 },
  filtersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  filtersTitle: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  resetButton: { color: '#0084F8', fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  filterThumbnailContainer: { marginRight: 12, alignItems: 'center' },
  filterThumbnail: { width: 80, height: 80, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  selectedFilterThumbnail: { borderColor: '#0084F8' },
  filterThumbnailImage: { width: '100%', height: '100%' },
  filterName: { marginTop: 6, fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  adjustContent: { marginTop: 8 },
  adjustTitle: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginBottom: 16 },
  adjustButtonsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  adjustButton: { alignItems: 'center', padding: 8, borderRadius: 8 },
  adjustButtonActive: { backgroundColor: 'rgba(0, 132, 248, 0.1)' },
  adjustIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  adjustLabel: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  sliderContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sliderTitle: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  sliderValue: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  slider: { width: '100%', height: 40 },
  captionContainer: { margin: 16, marginTop: 0, borderRadius: 16, padding: 16, elevation: 2 },
  captionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  captionTitle: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginLeft: 8 },
  captionInputContainer: { borderWidth: 1, borderRadius: 12, padding: 16, minHeight: 120, maxHeight: 200 },
  captionInput: { fontSize: 16, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold, lineHeight: 22, flex: 1, textAlignVertical: 'top' },
  captionFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  characterCount: { fontSize: 12, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
  hashtagsDisplay: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  hashtagChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, gap: 6 },
  hashtagText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  suggestionsContainer: { marginTop: 10, borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  suggestionItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  suggestionText: { fontSize: 14, fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold },
  postButtonContainer: { paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
  postBtn: { paddingVertical: 13, paddingHorizontal: 24, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  postIcon: { marginRight: 8 },
  postText: { color: '#fff', fontSize: 19, fontFamily: FONTS_FAMILY.SourceSans3_Medium, fontWeight: '600' },
  
  // ✅ Tag People Styles
  taggedUsersDisplay: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  taggedUserChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, gap: 6 },
  taggedUserAvatar: { width: 24, height: 24, borderRadius: 12 },
  taggedUserName: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  
  // Modal Styles
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  modalCloseBtn: { padding: 8 },
  modalTitle: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  modalDoneBtn: { padding: 8 },
  modalDoneText: { color: '#0084F8', fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  
  searchContainer: { padding: 16 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, gap: 10 },
  searchInput: { flex: 1, fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  
  userItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  userAvatar: { width: 48, height: 48, borderRadius: 24 },
  userInfo: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginBottom: 2 },
  userUsername: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: '#0084F8', borderColor: '#0084F8' },
})