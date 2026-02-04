

// import React, { useCallback, useEffect, useState } from 'react'
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   StatusBar,
//   ScrollView,
//   Alert,
//   TextInput,
//   Modal,
// } from 'react-native'
// import { launchImageLibrary } from 'react-native-image-picker'
// import SpaceBetweenRow from '../../components/wrapper/spacebetween'
// import {
//   AddUserIcon,
//   Menu,
//   OtionsButtons,
//   PrimaryBackArrow,
//   PrimaryBackWhite,
//   ThreeDotIcon,
// } from '../../assets/SVGs'
// import Row from '../../components/wrapper/row'
// import { FONTS_FAMILY } from '../../assets/Fonts'
// import CustomText from '../../components/TextComponent'
// import LinearGradient from 'react-native-linear-gradient'
// import CustomDrawer from '../../components/DrawerModal'
// import { useSelector } from 'react-redux'
// import IMG from '../../assets/Images'
// import { apiGet, apiPost, getItem } from '../../utils/Apis'
// import urls from '../../config/urls'
// import { useFocusEffect, useIsFocused } from '@react-navigation/native'
// import useLoader from '../../utils/LoaderHook'

// import Feather from 'react-native-vector-icons/Feather'

// import { ToastMsg } from '../../utils/helperFunctions'
// import { white } from '../../common/Colors/colors'
// import ProfileShimmer from '../../components/Skeletons/ProfilePageShimmer'
// import GradientIcon from '../../components/GradientIcon'
// import GlowWrapper from '../../components/GlowWrapper/GlowWrapper'

// const OtherUserDetail = ({ navigation, route }) => {
//   const [isDrawerVisible, setDrawerVisible] = useState(false)
//   const [isBioModalVisible, setBioModalVisible] = useState(false)
//   const [activeTab, setActiveTab] = useState('all') // 'all' or 'saved'
//   const { isDarkMode } = useSelector(state => state.theme)
//   const [UserDetails, setUserDetails] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [allPosts, setAllPosts] = useState([])
//   const [savedPosts, setSavedPosts] = useState([]) // For saved posts
//   const [bioText, setBioText] = useState('')
//   const { showLoader, hideLoader } = useLoader()
//   const [allProducts, setAllProducts] = useState([])

//   const isFocused = useIsFocused()

//   console.log('++++++++++++++++++UserId', route?.params?.userId)

//   useFocusEffect(
//     useCallback(() => {
//       // Clear params when leaving the screen
//       return () => {
//         navigation.setParams({ userId: undefined })
//         setUserDetails(null)
//         setAllPosts([])
//         setSavedPosts([])
//       }
//     }, [navigation]),
//   )

//   let selector = useSelector(state => state?.user?.userData)
//   if (Object.keys(selector).length != 0) {
//     selector = JSON.parse(selector)
//   }

//   useEffect(() => {
//     fetchData()
//     fetchMyPost()
//     fetchSavedPosts()
//     fetchAllProducts()
//   }, [isFocused])

//   const fetchData = async () => {
//     setLoading(true)
//     const endPoint = route?.params?.userId
//       ? `${urls.getUserById}/${route?.params?.userId}`
//       : urls.userProfile
//     const res = await apiGet(endPoint)
//     setUserDetails(res?.data)
//     setBioText(res?.data?.Bio || '')
//     console.log(res?.data, 'UserDetails from api')
//     setLoading(false)
//   }

//   const fetchMyPost = async () => {
//     setLoading(true)
//     const res = await apiGet(
//       `${urls.getAllPostsOfAUser}/${route?.params?.userId || selector?._id}`,
//     )
//     setAllPosts(res?.data)
//     console.log(res?.data, 'AllMy Posts from api')
//     setLoading(false)
//   }

//   const fetchSavedPosts = async () => {
//     // For now, using same posts - you can change this API endpoint later

//     const res = await apiGet(
//       // `${urls.getAllPostsOfAUser}/${route?.params?.userId || selector?._id}`,
//       `${urls.getAllSavedPosts}`
//     )
//     setSavedPosts(res?.data || [])
//   }

//   const fetchAllProducts = async () => {
//     // For now, using same posts - you can change this API endpoint later

//     const res = await apiGet(
//       // `${urls.getAllPostsOfAUser}/${route?.params?.userId || selector?._id}`,
//       `/api/admin/AllProducts`
//     )
//     setAllProducts(res?.data || [])
//     // console.log('res?.data::::::', res?.data);

//   }

//   const sendFollowRequest = async id => {
//     console.log(id)
//     const res = await apiPost(
//       `${urls.sendFollowRequest}/${route?.params?.userId}`,
//     )
//     console.log(res, '+++++++++++++++++res from follow request')
//   }

//   // Image picker options
//   const imagePickerOptions = {
//     mediaType: 'photo',
//     includeBase64: false,
//     maxHeight: 2000,
//     maxWidth: 2000,
//     quality: 0.8,
//   }

//   // Update user profile function
//   const updateUserProfile = async (imageType, imageUri, bio = null) => {
//     try {
//       showLoader()

//       const formData = new FormData()

//       if (imageUri) {
//         formData.append(imageType, {
//           uri: imageUri,
//           type: 'image/jpeg',
//           name: `${imageType.toLowerCase()}.jpg`,
//         })
//       }

//       if (bio !== null) {
//         formData.append('bio', bio)
//       }

//       const token = await getItem('token')
//       const response = await fetch(
//         'https://tomo-backend-app.vercel.app/api/user/UpdateUser',
//         {
//           method: 'PUT',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//           body: formData,
//         },
//       )

//       const result = await response.json()
//       console.log('Update result:', result)

//       if (response.ok) {
//         ToastMsg('Profile updated successfully!')
//         fetchData() // Refresh user data
//       } else {
//         ToastMsg('Failed to update profile')
//       }
//     } catch (error) {
//       console.error('Update error:', error)
//       ToastMsg('Failed to update profile')
//     } finally {
//       hideLoader()
//     }
//   }

//   // Handle profile image update
//   const handleProfileImageUpdate = () => {
//     Alert.alert('Update Profile Picture', 'Choose an option', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Choose from Gallery',
//         onPress: () => {
//           launchImageLibrary(imagePickerOptions, response => {
//             if (response.didCancel || response.error) {
//               return
//             }

//             if (response.assets && response.assets[0]) {
//               updateUserProfile('Image', response.assets[0].uri)
//             }
//           })
//         },
//       },
//     ])
//   }

//   // Handle cover image update
//   const handleCoverImageUpdate = () => {
//     Alert.alert('Update Cover Photo', 'Choose an option', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Choose from Gallery',
//         onPress: () => {
//           launchImageLibrary(imagePickerOptions, response => {
//             if (response.didCancel || response.error) {
//               return
//             }

//             if (response.assets && response.assets[0]) {
//               updateUserProfile('CoverImage', response.assets[0].uri)
//             }
//           })
//         },
//       },
//     ])
//   }

//   // Handle bio update
//   const handleBioUpdate = () => {
//     setBioModalVisible(true)
//   }

//   const saveBio = () => {
//     updateUserProfile(null, null, bioText)
//     setBioModalVisible(false)
//   }

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? '#1b1b1b' : '#f3f2ef',
//     },
//     header: {
//       paddingTop: 50,
//       paddingHorizontal: 20,
//       backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//       elevation: 2,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 2,
//       paddingBottom: 16,
//     },
//     headerText: {
//       fontSize: 20,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : 'black',
//     },
//     // Cover Photo Section
//     coverPhotoContainer: {
//       height: 200,
//       backgroundColor: isDarkMode ? '#333' : '#ddd',
//       position: 'relative',
//     },
//     coverPhoto: {
//       width: '100%',
//       height: '100%',
//       resizeMode: 'cover',
//     },
//     editProfileButton: {
//       //   position: 'absolute',
//       bottom: 15,
//       right: 15,
//       // backgroundColor: '#FC14CB',
//       backgroundColor:'#21B7FF',
//       paddingHorizontal: 16,
//       paddingVertical: 8,
//       borderRadius: 10,
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
//     },
//     editProfileButtonText: {
//       color: 'white',
//       fontSize: 12,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     // Profile Image Section
//     profileImageContainer: {
//       position: 'absolute',
//       bottom: -50,
//       left: 20,
//       alignItems: 'center',
//     },
//     profileImage: {
//       width: 100,
//       height: 100,
//       borderRadius: 50,
//       borderWidth: 4,
//       borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
//     },
//     editImageButton: {
//       position: 'absolute',
//       bottom: 5,
//       right: 5,
//       backgroundColor: '#4F52FE',
//       width: 28,
//       height: 28,
//       borderRadius: 14,
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
//     },
//     // Profile Info Section
//     profileInfoSection: {
//       paddingHorizontal: 20,
//       paddingTop: 60,
//       paddingBottom: 20,
//     },
//     profileName: {
//       fontSize: 24,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       color: isDarkMode ? 'white' : '#000',
//       //   marginBottom: 5,
//     },
//     profileUsername: {
//       fontSize: 16,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//       marginBottom: 15,
//     },
//     // Stats Section
//     statsContainer: {
//       flexDirection: 'row',
//       //   paddingHorizontal: 20,
//       marginBottom: 9,
//     },
//     statItem: {
//       marginRight: 30,
//     },
//     statNumber: {
//       fontSize: 18,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : '#000',
//     },
//     statLabel: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//     },
//     // Status Section
//     statusContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       //   paddingHorizontal: 20,
//       marginBottom: 20,
//     },
//     statusDot: {
//       width: 8,
//       height: 8,
//       borderRadius: 4,
//       backgroundColor: '#00D4AA',
//       marginRight: 8,
//     },
//     statusText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//     },
//     joinedText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//       marginLeft: 15,
//     },
//     // Action Buttons (for other users)
//     actionButtons: {
//       flexDirection: 'row',
//       justifyContent: 'center',
//       gap: 12,
//       paddingHorizontal: 20,
//       marginBottom: 20,
//     },
//     followButton: {
//       backgroundColor: '#0073b1',
//       paddingVertical: 10,
//       paddingHorizontal: 24,
//       borderRadius: 25,
//       minWidth: 100,
//       alignItems: 'center',
//     },
//     messageButton: {
//       backgroundColor: 'transparent',
//       borderWidth: 1,
//       borderColor: '#0073b1',
//       paddingVertical: 10,
//       paddingHorizontal: 24,
//       borderRadius: 25,
//       minWidth: 100,
//       alignItems: 'center',
//     },
//     moreButton: {
//       backgroundColor: 'transparent',
//       borderWidth: 1,
//       borderColor: isDarkMode ? '#666' : '#ddd',
//       paddingVertical: 10,
//       paddingHorizontal: 16,
//       borderRadius: 25,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     followButtonText: {
//       color: 'white',
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     messageButtonText: {
//       color: '#0073b1',
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     // Tab Section
//     tabContainer: {
//       flexDirection: 'row',
//       borderBottomWidth: 1,
//       borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
//       marginHorizontal: 10,
//       marginBottom: 20,
//     },
//     tabButton: {
//       paddingVertical: 15,
//       paddingHorizontal: 15,
//       // marginRight: 30,
//     },
//     activeTabButton: {
//       // borderBottomWidth: 2,
//       borderBottomColor: isDarkMode ? 'white' : '#000',
//     },
//     tabText: {
//       fontSize: 16,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//     },
//     activeTabText: {
//       color: isDarkMode ? 'white' : '#000',
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     // Posts Grid Section
//     postsContainer: {
//       paddingHorizontal: 16,
//       paddingBottom: 100,
//     },
//     postItem: {
//       width: '47%',
//       height: 120,
//       margin: '1%',
//       borderRadius: 8,
//       overflow: 'hidden',
//       alignItems: 'center'
//     },
//     postImage: {
//       width: '100%',
//       height: '100%',
//       resizeMode: 'cover',
//       // padding:1,
//       borderRadius:8
//     },
//     emptyState: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       paddingTop: 50,
//     },
//     emptyStateText: {
//       fontSize: 16,
//       color: isDarkMode ? '#888' : '#666',
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       textAlign: 'center',
//     },
//     // Modal Styles
//     modalOverlay: {
//       flex: 1,
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     modalContent: {
//       backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//       margin: 20,
//       borderRadius: 12,
//       padding: 20,
//       width: '90%',
//     },
//     modalTitle: {
//       fontSize: 18,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : '#000',
//       marginBottom: 15,
//     },
//     bioInput: {
//       borderWidth: 1,
//       borderColor: isDarkMode ? '#444' : '#ddd',
//       borderRadius: 8,
//       padding: 12,
//       color: isDarkMode ? 'white' : '#000',
//       minHeight: 100,
//       textAlignVertical: 'top',
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//     },
//     modalButtons: {
//       flexDirection: 'row',
//       justifyContent: 'flex-end',
//       gap: 10,
//       marginTop: 15,
//     },
//     modalButton: {
//       paddingVertical: 10,
//       paddingHorizontal: 20,
//       borderRadius: 8,
//     },
//     cancelButton: {
//       backgroundColor: isDarkMode ? '#444' : '#ddd',
//     },
//     saveButton: {
//       backgroundColor: '#0073b1',
//     },
//     modalButtonText: {
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       fontSize: 14,
//     },
//     cancelButtonText: {
//       color: isDarkMode ? 'white' : '#000',
//     },
//     saveButtonText: {
//       color: 'white',
//     },
//   })

//   const renderHeader = () => (
//     <SpaceBetweenRow style={styles.header}>
//       <TouchableOpacity
//         onPress={() => navigation.navigate('Tab', { screen: 'Home' })}>
//         {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
//       </TouchableOpacity>
//       <Text style={styles.headerText}>
//         {UserDetails?.UserName || UserDetails?.FullName}
//       </Text>
//       <TouchableOpacity onPress={() => setDrawerVisible(true)}>
//         {/* <Feather
//           name={'settings'}
//           size={24}
//           color={isDarkMode ? white : '#000'}
//         /> */}
//         <GradientIcon
//           // colors={['#4F52FE', '#FC14CB']}
//           colors={['#21B7FF', '#0084F8']}
//           size={18}
//           iconType='Feather'
//           name={'settings'}
//         />
//       </TouchableOpacity>
//     </SpaceBetweenRow>
//   )

//   const renderCoverPhoto = () => (
//     <View style={styles.coverPhotoContainer}>
//       {/* <TouchableOpacity
//         onPress={handleCoverImageUpdate}
//         disabled={route?.params?.userId}
//         > */}
//       <Image
//         source={{
//           uri:
//             UserDetails?.CoverImage ||
//             'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
//         }}
//         style={styles.coverPhoto}
//       />
//       {/* </TouchableOpacity> */}

//       {/* Profile Image */}
//       <View style={styles.profileImageContainer}>
//         <Image
//           source={{
//             uri: UserDetails?.Image || 'https://picsum.photos/id/237/200/300',
//           }}
//           style={styles.profileImage}
//         />
//         {!route?.params?.userId && (
//           <TouchableOpacity
//             style={styles.editImageButton}
//             // onPress={handleProfileImageUpdate}
//             onPress={handleCoverImageUpdate}
//             disabled={route?.params?.userId}

//           >
//             <Feather name='camera' size={14} color='white' />
//           </TouchableOpacity>
//         )}
//       </View>
//       <TouchableOpacity
//         style={{ ...styles.editImageButton, right: 20, bottom: 10 }}
//         onPress={handleProfileImageUpdate}>
//         <Feather name='camera' size={14} color='white' />
//       </TouchableOpacity>
//       {/* Edit Profile Button (only for own profile) */}
//     </View>
//   )

//   const renderProfileInfo = () => (
//     <View style={styles.profileInfoSection}>
//       <SpaceBetweenRow>
//         <View>
//           <Text style={styles.profileName}>{UserDetails?.FullName}</Text>
//           <Text style={styles.profileUsername}>{UserDetails?.UserName}</Text>
//         </View>
//         {!route?.params?.userId && (
//           <TouchableOpacity
//             style={styles.editProfileButton}
//             onPress={handleBioUpdate}>
//             <Text style={styles.editProfileButtonText}>Edit profile</Text>
//           </TouchableOpacity>
//         )}
//       </SpaceBetweenRow>
//       {/* Stats */}
//       <View style={styles.statsContainer}>
//         <TouchableOpacity
//           style={styles.statItem}
//           onPress={() => navigation.navigate('Followers')}>
//           <Text style={styles.statNumber}>
//             {UserDetails?.Follower?.length || 0}
//           </Text>
//           <Text style={styles.statLabel}>Followers</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.statItem}
//           onPress={() => navigation.navigate('Followings')}>
//           <Text style={styles.statNumber}>
//             {UserDetails?.Following?.length || 0}
//           </Text>
//           <Text style={styles.statLabel}>Following</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Status and Join Date */}
//       <View style={styles.statusContainer}>
//         <View style={styles.statusDot} />
//         <Text style={styles.statusText}>just now</Text>
//         <Text style={styles.joinedText}>📅 Joined Aug 5, 2025</Text>
//       </View>

//       {/* Action Buttons for other users */}
//       {route?.params?.userId && (
//         <View style={styles.actionButtons}>
//           <TouchableOpacity
//             style={styles.followButton}
//             onPress={() => sendFollowRequest(UserDetails?._id)}>
//             <Text style={styles.followButtonText}>Follow</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.messageButton}
//             onPress={() => navigation.navigate('Chat')}>
//             <Text style={styles.messageButtonText}>Message</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.moreButton}>
//             <Text style={{ color: isDarkMode ? '#ccc' : '#666' }}>•••</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   )

//   const renderTabs = () => (
//     <View style={styles.tabContainer}>
//       <TouchableOpacity
//         style={[
//           styles.tabButton,
//           activeTab === 'all' && styles.activeTabButton,
//         ]}
//         onPress={() => setActiveTab('all')}>
//         <Text
//           style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
//           All posts
//         </Text>
//         {activeTab === 'all' && <LinearGradient
//           // colors={['#FF00FF', '#4B6BFF']} 
//           colors={['#21B7FF', '#0084F8']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={{
//             height: 2,
//             width: 50,
//             borderRadius: 5,
//             top: 18
//           }}
//         />}
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={[
//           styles.tabButton,
//           activeTab === 'saved' && styles.activeTabButton,
//         ]}
//         onPress={() => setActiveTab('saved')}>
//         <Text
//           style={[
//             styles.tabText,
//             activeTab === 'saved' && styles.activeTabText,
//           ]}>
//           Saved
//         </Text>
//         {activeTab === 'saved' && <LinearGradient
//           // colors={['#FF00FF', '#4B6BFF']} 
//           colors={['#21B7FF', '#0084F8']}

//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={{
//             height: 2,
//             width: 50,
//             borderRadius: 5,
//             top: 18
//           }}
//         />}
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[
//           styles.tabButton,
//           activeTab === 'Marketplace' && styles.activeTabButton,
//         ]}
//         onPress={() => setActiveTab('Marketplace')}>
//         <Text
//           style={[
//             styles.tabText,
//             activeTab === 'Marketplace' && styles.activeTabText,
//           ]}>
//           Marketplace Products
//         </Text>
//         {activeTab === 'Marketplace' && <LinearGradient
//           // colors={['#FF00FF', '#4B6BFF']} 
//           colors={['#21B7FF', '#0084F8']}

//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={{
//             height: 2,
//             width: 150,
//             borderRadius: 5,
//             top: 18
//           }}
//         />}
//       </TouchableOpacity>



//     </View>
//   )

//   const renderPost = ({ item }) => (
//     <GlowWrapper 
//     containerStyle={{
//       width:'48%',
//       margin:'1%',
//          height: 120,
//       margin: '1%',
//     }}
//     borderRadius={8}
//     >
//     <TouchableOpacity
//       onPress={() =>
//         navigation.navigate(activeTab === 'all' ? 'AllPostOfAUser' : activeTab === 'saved' ? 'SavedPosts' : 'ProductDetail', { userId: item?.User?._id })
//       }
//       // style={styles.postItem}
//       >

//       <Image source={{ uri: activeTab === 'all' ? item?.media : activeTab === 'saved' ? item?.Post?.media : item?.Image }} style={styles.postImage} />
//     </TouchableOpacity>

//     </GlowWrapper>
//   )

//   const renderPostsGrid = () => {
//     const currentPosts = activeTab === 'all' ? allPosts : activeTab == 'saved' ? savedPosts : allProducts;

//     if (currentPosts.length === 0) {
//       return (
//         <View style={styles.emptyState}>
//           <Text style={styles.emptyStateText}>
//             {activeTab === 'all' ? 'No posts yet' : activeTab == 'saved' ? 'No saved posts' : 'No products found'}
//           </Text>
//         </View>
//       )
//     }

//     return (
//       <FlatList
//         // data={currentPosts}
//         data={activeTab == 'all' ? currentPosts.filter(item =>
//           item?.media && !item?.media.toLowerCase().includes('.mp4')
//         ) :
//           activeTab == 'saved' ?
//             currentPosts.filter(item =>
//               item?.Post?.media && !item?.Post?.media.toLowerCase().includes('.mp4')
//             ) :
//             currentPosts.filter(item =>
//               item?.Image && !item?.Image.toLowerCase().includes('.mp4')
//             )

//         }
//         numColumns={2}
//         renderItem={renderPost}
//         keyExtractor={item => item?._id}
//         showsVerticalScrollIndicator={false}
//         scrollEnabled={false}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     )
//   }

//   if (loading) {
//     return <ProfileShimmer />
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent={true}
//         backgroundColor='transparent'
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//       />

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* HEADER SECTION */}
//         {renderHeader()}

//         {/* COVER PHOTO & PROFILE IMAGE */}
//         {renderCoverPhoto()}

//         {/* PROFILE INFO */}
//         {renderProfileInfo()}

//         {/* TABS */}
//         {renderTabs()}

//         {/* POSTS GRID */}
//         <View style={styles.postsContainer}>{renderPostsGrid()}</View>
//       </ScrollView>

//       {/* Bio Edit Modal */}
//       <Modal
//         visible={isBioModalVisible}
//         transparent={true}
//         animationType='fade'
//         onRequestClose={() => setBioModalVisible(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Edit Bio</Text>
//             <TextInput
//               style={styles.bioInput}
//               value={bioText}
//               onChangeText={setBioText}
//               placeholder='Write your bio...'
//               placeholderTextColor={isDarkMode ? '#999' : '#666'}
//               multiline
//               maxLength={500}
//             />
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => setBioModalVisible(false)}>
//                 <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.saveButton]}
//                 onPress={saveBio}>
//                 <Text style={[styles.modalButtonText, styles.saveButtonText]}>
//                   Save
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <CustomDrawer
//         isVisible={isDrawerVisible}
//         onClose={() => setDrawerVisible(false)}
//         navigation={navigation}
//       />
//     </View>
//   )
// }

// // export default 
// export default React.memo(OtherUserDetail);


// import React, { useCallback, useEffect, useState } from 'react'
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   StatusBar,
//   ScrollView,
//   Alert,
//   TextInput,
//   Modal,
// } from 'react-native'
// import Animated, {
//   FadeInDown,
//   FadeInUp,
//   FadeIn,
//   ZoomIn,
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
// } from 'react-native-reanimated'
// import { launchImageLibrary } from 'react-native-image-picker'
// import SpaceBetweenRow from '../../components/wrapper/spacebetween'
// import {
//   PrimaryBackArrow,
//   PrimaryBackWhite,
// } from '../../assets/SVGs'
// import { FONTS_FAMILY } from '../../assets/Fonts'
// import LinearGradient from 'react-native-linear-gradient'
// import CustomDrawer from '../../components/DrawerModal'
// import { useSelector } from 'react-redux'
// import { apiGet, apiPost, getItem } from '../../utils/Apis'
// import urls from '../../config/urls'
// import { useFocusEffect, useIsFocused } from '@react-navigation/native'
// import useLoader from '../../utils/LoaderHook'
// import Feather from 'react-native-vector-icons/Feather'
// import { ToastMsg } from '../../utils/helperFunctions'
// import ProfileShimmer from '../../components/Skeletons/ProfilePageShimmer'
// import GradientIcon from '../../components/GradientIcon'
// import GlowWrapper from '../../components/GlowWrapper/GlowWrapper'

// // Simple Animated Post Card
// const PostCard = React.memo(({ item, activeTab, navigation, index, isDarkMode }) => {
//   const scale = useSharedValue(1);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//   }));

//   const handlePressIn = () => {
//     scale.value = withSpring(0.95);
//   };

//   const handlePressOut = () => {
//     scale.value = withSpring(1);
//   };

//   return (
//     <Animated.View
//       entering={FadeInUp.duration(400).delay(index * 40)}
//       style={[{ width: '48%', margin: '1%' }, animatedStyle]}
//     >
//       <GlowWrapper 
//         containerStyle={{ height: 120 }}
//         borderRadius={8}
//         showStars={false}
//         showShinePatches={false}
//         intensity="low"
//         isDarkMode={isDarkMode}
//       >
//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate(
//               activeTab === 'all' ? 'AllPostOfAUser' : 
//               activeTab === 'saved' ? 'SavedPosts' : 
//               'ProductDetail', 
//               { userId: item?.User?._id }
//             )
//           }
//           onPressIn={handlePressIn}
//           onPressOut={handlePressOut}
//           activeOpacity={0.9}
//           style={{ height: '100%' }}
//         >
//           <Image 
//             source={{ 
//               uri: activeTab === 'all' ? item?.media : 
//                    activeTab === 'saved' ? item?.Post?.media : 
//                    item?.Image 
//             }} 
//             style={{
//               width: '100%',
//               height: '100%',
//               borderRadius: 8,
//             }}
//             resizeMode="cover"
//           />
//         </TouchableOpacity>
//       </GlowWrapper>
//     </Animated.View>
//   );
// });

// PostCard.displayName = 'PostCard';

// const OtherUserDetail = ({ navigation, route }) => {
//   const [isDrawerVisible, setDrawerVisible] = useState(false)
//   const [isBioModalVisible, setBioModalVisible] = useState(false)
//   const [activeTab, setActiveTab] = useState('all')
//   const { isDarkMode } = useSelector(state => state.theme)
//   const [UserDetails, setUserDetails] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [allPosts, setAllPosts] = useState([])
//   const [savedPosts, setSavedPosts] = useState([])
//   const [bioText, setBioText] = useState('')
//   const { showLoader, hideLoader } = useLoader()
//   const [allProducts, setAllProducts] = useState([])

//   const isFocused = useIsFocused()

//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         navigation.setParams({ userId: undefined })
//         setUserDetails(null)
//         setAllPosts([])
//         setSavedPosts([])
//       }
//     }, [navigation]),
//   )

//   let selector = useSelector(state => state?.user?.userData)
//   if (Object.keys(selector).length != 0) {
//     selector = JSON.parse(selector)
//   }

//   useEffect(() => {
//     fetchData()
//     fetchMyPost()
//     fetchSavedPosts()
//     fetchAllProducts()
//   }, [isFocused])

//   const fetchData = async () => {
//     setLoading(true)
//     const endPoint = route?.params?.userId
//       ? `${urls.getUserById}/${route?.params?.userId}`
//       : urls.userProfile
//     const res = await apiGet(endPoint)
//     setUserDetails(res?.data)
//     setBioText(res?.data?.Bio || '')
//     setLoading(false)
//   }

//   const fetchMyPost = async () => {
//     setLoading(true)
//     const res = await apiGet(
//       `${urls.getAllPostsOfAUser}/${route?.params?.userId || selector?._id}`,
//     )
//     setAllPosts(res?.data)
//     setLoading(false)
//   }

//   const fetchSavedPosts = async () => {
//     const res = await apiGet(`${urls.getAllSavedPosts}`)
//     setSavedPosts(res?.data || [])
//   }

//   const fetchAllProducts = async () => {
//     const res = await apiGet(`/api/admin/AllProducts`)
//     setAllProducts(res?.data || [])
//   }

//   const sendFollowRequest = async id => {
//     const res = await apiPost(
//       `${urls.sendFollowRequest}/${route?.params?.userId}`,
//     )
//   }

//   const imagePickerOptions = {
//     mediaType: 'photo',
//     includeBase64: false,
//     maxHeight: 2000,
//     maxWidth: 2000,
//     quality: 0.8,
//   }

//   const updateUserProfile = async (imageType, imageUri, bio = null) => {
//     try {
//       showLoader()
//       const formData = new FormData()

//       if (imageUri) {
//         formData.append(imageType, {
//           uri: imageUri,
//           type: 'image/jpeg',
//           name: `${imageType.toLowerCase()}.jpg`,
//         })
//       }

//       if (bio !== null) {
//         formData.append('bio', bio)
//       }

//       const token = await getItem('token')
//       const response = await fetch(
//         'https://tomo-backend-app.vercel.app/api/user/UpdateUser',
//         {
//           method: 'PUT',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//           body: formData,
//         },
//       )

//       const result = await response.json()

//       if (response.ok) {
//         ToastMsg('Profile updated successfully!')
//         fetchData()
//       } else {
//         ToastMsg('Failed to update profile')
//       }
//     } catch (error) {
//       ToastMsg('Failed to update profile')
//     } finally {
//       hideLoader()
//     }
//   }

//   const handleProfileImageUpdate = () => {
//     Alert.alert('Update Profile Picture', 'Choose an option', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Choose from Gallery',
//         onPress: () => {
//           launchImageLibrary(imagePickerOptions, response => {
//             if (response.didCancel || response.error) return
//             if (response.assets && response.assets[0]) {
//               updateUserProfile('Image', response.assets[0].uri)
//             }
//           })
//         },
//       },
//     ])
//   }

//   const handleCoverImageUpdate = () => {
//     Alert.alert('Update Cover Photo', 'Choose an option', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Choose from Gallery',
//         onPress: () => {
//           launchImageLibrary(imagePickerOptions, response => {
//             if (response.didCancel || response.error) return
//             if (response.assets && response.assets[0]) {
//               updateUserProfile('CoverImage', response.assets[0].uri)
//             }
//           })
//         },
//       },
//     ])
//   }

//   const handleBioUpdate = () => {
//     setBioModalVisible(true)
//   }

//   const saveBio = () => {
//     updateUserProfile(null, null, bioText)
//     setBioModalVisible(false)
//   }

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? '#1b1b1b' : '#f3f2ef',
//     },
//     header: {
//       paddingTop: 50,
//       paddingHorizontal: 20,
//       backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//       elevation: 2,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 2,
//       paddingBottom: 16,
//     },
//     headerText: {
//       fontSize: 20,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : 'black',
//     },
//     coverPhotoContainer: {
//       height: 200,
//       backgroundColor: isDarkMode ? '#333' : '#ddd',
//       position: 'relative',
//     },
//     coverPhoto: {
//       width: '100%',
//       height: '100%',
//       resizeMode: 'cover',
//     },
//     editProfileButton: {
//       bottom: 15,
//       right: 15,
//       backgroundColor: '#21B7FF',
//       paddingHorizontal: 16,
//       paddingVertical: 8,
//       borderRadius: 10,
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
//     },
//     editProfileButtonText: {
//       color: 'white',
//       fontSize: 12,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     profileImageContainer: {
//       position: 'absolute',
//       bottom: -50,
//       left: 20,
//       alignItems: 'center',
//     },
//     profileImage: {
//       width: 100,
//       height: 100,
//       borderRadius: 50,
//       borderWidth: 4,
//       borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
//     },
//     editImageButton: {
//       position: 'absolute',
//       bottom: 5,
//       right: 5,
//       backgroundColor: '#4F52FE',
//       width: 28,
//       height: 28,
//       borderRadius: 14,
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
//     },
//     profileInfoSection: {
//       paddingHorizontal: 20,
//       paddingTop: 60,
//       paddingBottom: 20,
//     },
//     profileName: {
//       fontSize: 24,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       color: isDarkMode ? 'white' : '#000',
//     },
//     profileUsername: {
//       fontSize: 16,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//       marginBottom: 15,
//     },
//     statsContainer: {
//       flexDirection: 'row',
//       marginBottom: 9,
//     },
//     statItem: {
//       marginRight: 30,
//     },
//     statNumber: {
//       fontSize: 18,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : '#000',
//     },
//     statLabel: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//     },
//     statusContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 20,
//     },
//     statusDot: {
//       width: 8,
//       height: 8,
//       borderRadius: 4,
//       backgroundColor: '#00D4AA',
//       marginRight: 8,
//     },
//     statusText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//     },
//     joinedText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//       marginLeft: 15,
//     },
//     actionButtons: {
//       flexDirection: 'row',
//       justifyContent: 'center',
//       gap: 12,
//       paddingHorizontal: 20,
//       marginBottom: 20,
//     },
//     followButton: {
//       backgroundColor: '#0073b1',
//       paddingVertical: 10,
//       paddingHorizontal: 24,
//       borderRadius: 25,
//       minWidth: 100,
//       alignItems: 'center',
//     },
//     messageButton: {
//       backgroundColor: 'transparent',
//       borderWidth: 1,
//       borderColor: '#0073b1',
//       paddingVertical: 10,
//       paddingHorizontal: 24,
//       borderRadius: 25,
//       minWidth: 100,
//       alignItems: 'center',
//     },
//     moreButton: {
//       backgroundColor: 'transparent',
//       borderWidth: 1,
//       borderColor: isDarkMode ? '#666' : '#ddd',
//       paddingVertical: 10,
//       paddingHorizontal: 16,
//       borderRadius: 25,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     followButtonText: {
//       color: 'white',
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     messageButtonText: {
//       color: '#0073b1',
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     tabContainer: {
//       flexDirection: 'row',
//       borderBottomWidth: 1,
//       borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
//       marginHorizontal: 10,
//       marginBottom: 20,
//     },
//     tabButton: {
//       paddingVertical: 15,
//       paddingHorizontal: 15,
//     },
//     tabText: {
//       fontSize: 16,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//     },
//     activeTabText: {
//       color: isDarkMode ? 'white' : '#000',
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     postsContainer: {
//       paddingHorizontal: 16,
//       paddingBottom: 100,
//     },
//     emptyState: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       paddingTop: 50,
//     },
//     emptyStateText: {
//       fontSize: 16,
//       color: isDarkMode ? '#888' : '#666',
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       textAlign: 'center',
//     },
//     modalOverlay: {
//       flex: 1,
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     modalContent: {
//       backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//       margin: 20,
//       borderRadius: 12,
//       padding: 20,
//       width: '90%',
//     },
//     modalTitle: {
//       fontSize: 18,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : '#000',
//       marginBottom: 15,
//     },
//     bioInput: {
//       borderWidth: 1,
//       borderColor: isDarkMode ? '#444' : '#ddd',
//       borderRadius: 8,
//       padding: 12,
//       color: isDarkMode ? 'white' : '#000',
//       minHeight: 100,
//       textAlignVertical: 'top',
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//     },
//     modalButtons: {
//       flexDirection: 'row',
//       justifyContent: 'flex-end',
//       gap: 10,
//       marginTop: 15,
//     },
//     modalButton: {
//       paddingVertical: 10,
//       paddingHorizontal: 20,
//       borderRadius: 8,
//     },
//     cancelButton: {
//       backgroundColor: isDarkMode ? '#444' : '#ddd',
//     },
//     saveButton: {
//       backgroundColor: '#0073b1',
//     },
//     modalButtonText: {
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       fontSize: 14,
//     },
//     cancelButtonText: {
//       color: isDarkMode ? 'white' : '#000',
//     },
//     saveButtonText: {
//       color: 'white',
//     },
//   })

//   const renderHeader = () => (
//     <Animated.View entering={FadeInDown.duration(400)}>
//       <SpaceBetweenRow style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('Tab', { screen: 'Home' })}>
//           {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
//         </TouchableOpacity>
//         <Text style={styles.headerText}>
//           {UserDetails?.UserName || UserDetails?.FullName}
//         </Text>
//         <TouchableOpacity onPress={
//           // () => setDrawerVisible(true)}
//         ()=>  navigation.navigate('SettingsDrawer')
//         }
//           >
//           <GradientIcon
//             colors={['#21B7FF', '#0084F8']}
//             size={18}
//             iconType='Feather'
//             name={'settings'}
//           />
//         </TouchableOpacity>
//       </SpaceBetweenRow>
//     </Animated.View>
//   )

//   const renderCoverPhoto = () => (
//     <Animated.View 
//       entering={FadeIn.duration(500)}
//       style={styles.coverPhotoContainer}
//     >
//       <Image
//         source={{
//           uri: UserDetails?.CoverImage ||
//             'https://images.unsplash.com/photo-1497366216548-37526070297c',
//         }}
//         style={styles.coverPhoto}
//       />

//       <Animated.View 
//         entering={ZoomIn.duration(400).delay(300)}
//         style={styles.profileImageContainer}
//       >
//         <Image
//           source={{
//             uri: UserDetails?.Image || 'https://picsum.photos/id/237/200/300',
//           }}
//           style={styles.profileImage}
//         />
//         {!route?.params?.userId && (
//           <TouchableOpacity
//             style={styles.editImageButton}
//             onPress={handleCoverImageUpdate}
//           >
//             <Feather name='camera' size={14} color='white' />
//           </TouchableOpacity>
//         )}
//       </Animated.View>

//       {!route?.params?.userId && (
//         <TouchableOpacity
//           style={{ ...styles.editImageButton, right: 20, bottom: 10 }}
//           onPress={handleProfileImageUpdate}
//         >
//           <Feather name='camera' size={14} color='white' />
//         </TouchableOpacity>
//       )}
//     </Animated.View>
//   )

//   const renderProfileInfo = () => (
//     <Animated.View 
//       entering={FadeInUp.duration(400).delay(400)}
//       style={styles.profileInfoSection}
//     >
//       <SpaceBetweenRow>
//         <View>
//           <Text style={styles.profileName}>{UserDetails?.FullName}</Text>
//           <Text style={styles.profileUsername}>{UserDetails?.UserName}</Text>
//         </View>
//         {!route?.params?.userId && (
//           <TouchableOpacity
//             style={styles.editProfileButton}
//             onPress={handleBioUpdate}
//           >
//             <Text style={styles.editProfileButtonText}>Edit profile</Text>
//           </TouchableOpacity>
//         )}
//       </SpaceBetweenRow>

//       <View style={styles.statsContainer}>
//         <TouchableOpacity
//           style={styles.statItem}
//           onPress={() => navigation.navigate('Followers')}
//         >
//           <Text style={styles.statNumber}>
//             {UserDetails?.Follower?.length || 0}
//           </Text>
//           <Text style={styles.statLabel}>Followers</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.statItem}
//           onPress={() => navigation.navigate('Followings')}
//         >
//           <Text style={styles.statNumber}>
//             {UserDetails?.Following?.length || 0}
//           </Text>
//           <Text style={styles.statLabel}>Following</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.statusContainer}>
//         <View style={styles.statusDot} />
//         <Text style={styles.statusText}>just now</Text>
//         <Text style={styles.joinedText}>📅 Joined Aug 5, 2025</Text>
//       </View>

//       {route?.params?.userId && (
//         <Animated.View 
//           entering={FadeInUp.duration(300).delay(500)}
//           style={styles.actionButtons}
//         >
//           <TouchableOpacity
//             style={styles.followButton}
//             onPress={() => sendFollowRequest(UserDetails?._id)}
//           >
//             <Text style={styles.followButtonText}>Follow</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.messageButton}
//             onPress={() => navigation.navigate('Chat')}
//           >
//             <Text style={styles.messageButtonText}>Message</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.moreButton}>
//             <Text style={{ color: isDarkMode ? '#ccc' : '#666' }}>•••</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       )}
//     </Animated.View>
//   )

//   const renderTabs = () => (
//     <Animated.View 
//       entering={FadeIn.duration(300).delay(600)}
//       style={styles.tabContainer}
//     >
//       {[
//         { key: 'all', label: 'All posts', width: 50 },
//         { key: 'saved', label: 'Saved', width: 50 },
//         { key: 'Marketplace', label: 'Marketplace Products', width: 150 }
//       ].map((tab) => (
//         <TouchableOpacity
//           key={tab.key}
//           style={styles.tabButton}
//           onPress={() => setActiveTab(tab.key)}
//         >
//           <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
//             {tab.label}
//           </Text>
//           {activeTab === tab.key && (
//             <Animated.View entering={ZoomIn.duration(200)}>
//               <LinearGradient
//                 colors={['#21B7FF', '#0084F8']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 style={{
//                   height: 2,
//                   width: tab.width,
//                   borderRadius: 5,
//                   marginTop: 18,
//                 }}
//               />
//             </Animated.View>
//           )}
//         </TouchableOpacity>
//       ))}
//     </Animated.View>
//   )

//   const renderPostsGrid = () => {
//     const currentPosts = activeTab === 'all' ? allPosts : 
//                         activeTab === 'saved' ? savedPosts : 
//                         allProducts

//     const filteredPosts = activeTab === 'all' 
//       ? currentPosts.filter(item => item?.media && !item?.media.toLowerCase().includes('.mp4'))
//       : activeTab === 'saved'
//       ? currentPosts.filter(item => item?.Post?.media && !item?.Post?.media.toLowerCase().includes('.mp4'))
//       : currentPosts.filter(item => item?.Image && !item?.Image.toLowerCase().includes('.mp4'))

//     if (filteredPosts.length === 0) {
//       return (
//         <Animated.View 
//           entering={FadeIn.duration(400)}
//           style={styles.emptyState}
//         >
//           <Text style={styles.emptyStateText}>
//             {activeTab === 'all' ? 'No posts yet' : 
//              activeTab === 'saved' ? 'No saved posts' : 
//              'No products found'}
//           </Text>
//         </Animated.View>
//       )
//     }

//     return (
//       <FlatList
//         data={filteredPosts}
//         numColumns={2}
//         renderItem={({ item, index }) => (
//           <PostCard
//             item={item}
//             activeTab={activeTab}
//             navigation={navigation}
//             index={index}
//             isDarkMode={isDarkMode}
//           />
//         )}
//         keyExtractor={item => item?._id}
//         showsVerticalScrollIndicator={false}
//         scrollEnabled={false}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     )
//   }

//   if (loading) {
//     return <ProfileShimmer />
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent={true}
//         backgroundColor='transparent'
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//       />

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {renderHeader()}
//         {renderCoverPhoto()}
//         {renderProfileInfo()}
//         {renderTabs()}
//         <View style={styles.postsContainer}>{renderPostsGrid()}</View>
//       </ScrollView>

// {isBioModalVisible && (
//         <Animated.View 
//           entering={FadeIn.duration(200)}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             zIndex: 999,
//           }}
//         >
//           <TouchableOpacity 
//             activeOpacity={1}
//             onPress={() => setBioModalVisible(false)}
//             style={styles.modalOverlay}
//           >
//             <Animated.View 
//               entering={ZoomIn.duration(300).springify()}
//               style={styles.modalContent}
//             >
//               <TouchableOpacity activeOpacity={1}>
//                 <Text style={styles.modalTitle}>Edit Bio</Text>
//                 <TextInput
//                   style={styles.bioInput}
//                   value={bioText}
//                   onChangeText={setBioText}
//                   placeholder='Write your bio...'
//                   placeholderTextColor={isDarkMode ? '#999' : '#666'}
//                   multiline
//                   maxLength={500}
//                 />
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity
//                     style={[styles.modalButton, styles.cancelButton]}
//                     onPress={() => setBioModalVisible(false)}
//                   >
//                     <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
//                       Cancel
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.modalButton, styles.saveButton]}
//                     onPress={saveBio}
//                   >
//                     <Text style={[styles.modalButtonText, styles.saveButtonText]}>
//                       Save
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </TouchableOpacity>
//             </Animated.View>
//           </TouchableOpacity>
//         </Animated.View>
//       )}

//       <CustomDrawer
//         isVisible={isDrawerVisible}
//         onClose={() => setDrawerVisible(false)}
//         navigation={navigation}
//       />
//     </View>
//   )
// }

// export default React.memo(OtherUserDetail)


// import React, { useCallback, useEffect, useState } from 'react'
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   StatusBar,
//   ScrollView,
//   Alert,
//   TextInput,
//   Modal,
// } from 'react-native'
// import Animated, {
//   FadeInDown,
//   FadeInUp,
//   FadeIn,
//   ZoomIn,
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
// } from 'react-native-reanimated'
// import { launchImageLibrary } from 'react-native-image-picker'
// import SpaceBetweenRow from '../../components/wrapper/spacebetween'
// import {
//   PrimaryBackArrow,
//   PrimaryBackWhite,
// } from '../../assets/SVGs'
// import { FONTS_FAMILY } from '../../assets/Fonts'
// import LinearGradient from 'react-native-linear-gradient'
// import CustomDrawer from '../../components/DrawerModal'
// import { useSelector } from 'react-redux'
// import { apiGet, apiPost, getItem } from '../../utils/Apis'
// import urls from '../../config/urls'
// import { useFocusEffect, useIsFocused } from '@react-navigation/native'
// import useLoader from '../../utils/LoaderHook'
// import Feather from 'react-native-vector-icons/Feather'
// import AntDesign from 'react-native-vector-icons/AntDesign'

// import Ionicons from 'react-native-vector-icons/Ionicons'
// import { ToastMsg } from '../../utils/helperFunctions'
// import ProfileShimmer from '../../components/Skeletons/ProfilePageShimmer'
// import GradientIcon from '../../components/GradientIcon'
// import GlowWrapper from '../../components/GlowWrapper/GlowWrapper'

// // Simple Animated Post Card
// const PostCard = React.memo(({ item, activeTab, navigation, index, isDarkMode }) => {
//   const scale = useSharedValue(1);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//   }));

//   const handlePressIn = () => {
//     scale.value = withSpring(0.95);
//   };

//   const handlePressOut = () => {
//     scale.value = withSpring(1);
//   };

//   return (
//     <Animated.View
//       entering={FadeInUp.duration(400).delay(index * 40)}
//       style={[{ width: '48%', margin: '1%' }, animatedStyle]}
//     >
//       <GlowWrapper 
//         containerStyle={{ height: 120 }}
//         borderRadius={8}
//         showStars={false}
//         showShinePatches={false}
//         intensity="low"
//         isDarkMode={isDarkMode}
//       >
//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate(
//               activeTab === 'all' ? 'AllPostOfAUser' : 
//               activeTab === 'saved' ? 'SavedPosts' : 
//               activeTab === 'tagged' ? 'AllPostOfAUser' :
//               'ProductDetail', 
//               { userId: item?.User?._id }
//             )
//           }
//           onPressIn={handlePressIn}
//           onPressOut={handlePressOut}
//           activeOpacity={0.9}
//           style={{ height: '100%' }}
//         >
//           <Image 
//             source={{ 
//               uri: activeTab === 'all' ? item?.media : 
//                    activeTab === 'saved' ? item?.Post?.media : 
//                    activeTab === 'tagged' ? item?.media :
//                    item?.Image 
//             }} 
//             style={{
//               width: '100%',
//               height: '100%',
//               borderRadius: 8,
//             }}
//             resizeMode="cover"
//           />
//         </TouchableOpacity>
//       </GlowWrapper>
//     </Animated.View>
//   );
// });

// PostCard.displayName = 'PostCard';

// const OtherUserDetail = ({ navigation, route }) => {
//   const [isDrawerVisible, setDrawerVisible] = useState(false)
//   const [isBioModalVisible, setBioModalVisible] = useState(false)
//   const [activeTab, setActiveTab] = useState('all')
//   const { isDarkMode } = useSelector(state => state.theme)
//   const [UserDetails, setUserDetails] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [allPosts, setAllPosts] = useState([])
//   const [savedPosts, setSavedPosts] = useState([])
//   const [taggedPosts, setTaggedPosts] = useState([]) // ✅ NEW STATE
//   const [bioText, setBioText] = useState('')
//   const { showLoader, hideLoader } = useLoader()
//   const [allProducts, setAllProducts] = useState([])

//   const isFocused = useIsFocused()

//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         navigation.setParams({ userId: undefined })
//         setUserDetails(null)
//         setAllPosts([])
//         setSavedPosts([])
//         setTaggedPosts([]) // ✅ RESET TAGGED POSTS
//       }
//     }, [navigation]),
//   )

//   let selector = useSelector(state => state?.user?.userData)
//   if (Object.keys(selector).length != 0) {
//     selector = JSON.parse(selector)
//   }

//   useEffect(() => {
//     fetchData()
//     fetchMyPost()
//     fetchSavedPosts()
//     fetchTaggedPosts() // ✅ FETCH TAGGED POSTS
//     fetchAllProducts()
//   }, [isFocused])

//   const fetchData = async () => {
//     setLoading(true)
//     const endPoint = route?.params?.userId
//       ? `${urls.getUserById}/${route?.params?.userId}`
//       : urls.userProfile
//     const res = await apiGet(endPoint)
//     setUserDetails(res?.data)
//     setBioText(res?.data?.Bio || '')
//     setLoading(false)
//   }

//   const fetchMyPost = async () => {
//     setLoading(true)
//     const res = await apiGet(
//       `${urls.getAllPostsOfAUser}/${route?.params?.userId || selector?._id}`,
//     )
//     setAllPosts(res?.data)
//     setLoading(false)
//   }

//   const fetchSavedPosts = async () => {
//     const res = await apiGet(`${urls.getAllSavedPosts}`)
//     setSavedPosts(res?.data || [])
//   }

//   // ✅ NEW FUNCTION: Fetch Tagged Posts
//   const fetchTaggedPosts = async () => {
//     try {
//       const res = await apiGet('/api/user/GetAllMyTaggedPosts')
//       setTaggedPosts(res?.data || [])
//     } catch (error) {
//       console.log('Error fetching tagged posts:', error)
//       setTaggedPosts([])
//     }
//   }

//   const fetchAllProducts = async () => {
//     const res = await apiGet(`/api/admin/AllProducts`)
//     setAllProducts(res?.data || [])
//   }

//   const sendFollowRequest = async id => {
//     const res = await apiPost(
//       `${urls.sendFollowRequest}/${route?.params?.userId}`,
//     )
//   }

//   const imagePickerOptions = {
//     mediaType: 'photo',
//     includeBase64: false,
//     maxHeight: 2000,
//     maxWidth: 2000,
//     quality: 0.8,
//   }

//   const updateUserProfile = async (imageType, imageUri, bio = null) => {
//     try {
//       showLoader()
//       const formData = new FormData()

//       if (imageUri) {
//         formData.append(imageType, {
//           uri: imageUri,
//           type: 'image/jpeg',
//           name: `${imageType.toLowerCase()}.jpg`,
//         })
//       }

//       if (bio !== null) {
//         formData.append('bio', bio)
//       }

//       const token = await getItem('token')
//       const response = await fetch(
//         'https://tomo-backend-app.vercel.app/api/user/UpdateUser',
//         {
//           method: 'PUT',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//           body: formData,
//         },
//       )

//       const result = await response.json()

//       if (response.ok) {
//         ToastMsg('Profile updated successfully!')
//         fetchData()
//       } else {
//         ToastMsg('Failed to update profile')
//       }
//     } catch (error) {
//       ToastMsg('Failed to update profile')
//     } finally {
//       hideLoader()
//     }
//   }

//   const handleProfileImageUpdate = () => {
//     Alert.alert('Update Profile Picture', 'Choose an option', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Choose from Gallery',
//         onPress: () => {
//           launchImageLibrary(imagePickerOptions, response => {
//             if (response.didCancel || response.error) return
//             if (response.assets && response.assets[0]) {
//               updateUserProfile('Image', response.assets[0].uri)
//             }
//           })
//         },
//       },
//     ])
//   }

//   const handleCoverImageUpdate = () => {
//     Alert.alert('Update Cover Photo', 'Choose an option', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Choose from Gallery',
//         onPress: () => {
//           launchImageLibrary(imagePickerOptions, response => {
//             if (response.didCancel || response.error) return
//             if (response.assets && response.assets[0]) {
//               updateUserProfile('CoverImage', response.assets[0].uri)
//             }
//           })
//         },
//       },
//     ])
//   }

//   const handleBioUpdate = () => {
//     setBioModalVisible(true)
//   }

//   const saveBio = () => {
//     updateUserProfile(null, null, bioText)
//     setBioModalVisible(false)
//   }

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? '#1b1b1b' : '#f3f2ef',
//     },
//     header: {
//       paddingTop: 50,
//       paddingHorizontal: 20,
//       backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//       elevation: 2,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 2,
//       paddingBottom: 16,
//     },
//     headerText: {
//       fontSize: 20,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : 'black',
//     },
//     coverPhotoContainer: {
//       height: 200,
//       backgroundColor: isDarkMode ? '#333' : '#ddd',
//       position: 'relative',
//     },
//     coverPhoto: {
//       width: '100%',
//       height: '100%',
//       resizeMode: 'cover',
//     },
//     editProfileButton: {
//       bottom: 15,
//       right: 15,
//       backgroundColor: '#21B7FF',
//       paddingHorizontal: 16,
//       paddingVertical: 8,
//       borderRadius: 10,
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
//     },
//     editProfileButtonText: {
//       color: 'white',
//       fontSize: 12,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     profileImageContainer: {
//       position: 'absolute',
//       bottom: -50,
//       left: 20,
//       alignItems: 'center',
//     },
//     profileImage: {
//       width: 100,
//       height: 100,
//       borderRadius: 50,
//       borderWidth: 4,
//       borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
//     },
//     editImageButton: {
//       position: 'absolute',
//       bottom: 5,
//       right: 5,
//       backgroundColor: '#4F52FE',
//       width: 28,
//       height: 28,
//       borderRadius: 14,
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
//     },
//     profileInfoSection: {
//       paddingHorizontal: 20,
//       paddingTop: 60,
//       paddingBottom: 20,
//     },
//     profileName: {
//       fontSize: 24,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       color: isDarkMode ? 'white' : '#000',
//     },
//     profileUsername: {
//       fontSize: 16,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//       marginBottom: 15,
//     },
//     statsContainer: {
//       flexDirection: 'row',
//       marginBottom: 9,
//     },
//     statItem: {
//       marginRight: 30,
//     },
//     statNumber: {
//       fontSize: 18,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : '#000',
//     },
//     statLabel: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//     },
//     statusContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 20,
//     },
//     statusDot: {
//       width: 8,
//       height: 8,
//       borderRadius: 4,
//       backgroundColor: '#00D4AA',
//       marginRight: 8,
//     },
//     statusText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//     },
//     joinedText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//       marginLeft: 15,
//     },
//     actionButtons: {
//       flexDirection: 'row',
//       justifyContent: 'center',
//       gap: 12,
//       paddingHorizontal: 20,
//       marginBottom: 20,
//     },
//     followButton: {
//       backgroundColor: '#0073b1',
//       paddingVertical: 10,
//       paddingHorizontal: 24,
//       borderRadius: 25,
//       minWidth: 100,
//       alignItems: 'center',
//     },
//     messageButton: {
//       backgroundColor: 'transparent',
//       borderWidth: 1,
//       borderColor: '#0073b1',
//       paddingVertical: 10,
//       paddingHorizontal: 24,
//       borderRadius: 25,
//       minWidth: 100,
//       alignItems: 'center',
//     },
//     moreButton: {
//       backgroundColor: 'transparent',
//       borderWidth: 1,
//       borderColor: isDarkMode ? '#666' : '#ddd',
//       paddingVertical: 10,
//       paddingHorizontal: 16,
//       borderRadius: 25,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     followButtonText: {
//       color: 'white',
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     messageButtonText: {
//       color: '#0073b1',
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     tabContainer: {
//       flexDirection: 'row',
//       borderBottomWidth: 1,
//       borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
//       marginHorizontal: 10,
//       marginBottom: 20,
//       justifyContent:'space-between'
//     },
//     tabButton: {
//       paddingVertical: 15,
//       paddingHorizontal: 12,
//       // flexDirection: 'row', 
//       alignItems: 'center',
//       gap: 6,
//     },
//     tabText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//     },
//     activeTabText: {
//       color: isDarkMode ? 'white' : '#000',
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     postsContainer: {
//       paddingHorizontal: 10,
//       paddingBottom: 100,
//     },
//     emptyState: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       paddingTop: 50,
//     },
//     emptyStateText: {
//       fontSize: 16,
//       color: isDarkMode ? '#888' : '#666',
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       textAlign: 'center',
//     },
//     modalOverlay: {
//       flex: 1,
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     modalContent: {
//       backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//       margin: 20,
//       borderRadius: 12,
//       padding: 20,
//       width: '90%',
//     },
//     modalTitle: {
//       fontSize: 18,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : '#000',
//       marginBottom: 15,
//     },
//     bioInput: {
//       borderWidth: 1,
//       borderColor: isDarkMode ? '#444' : '#ddd',
//       borderRadius: 8,
//       padding: 12,
//       color: isDarkMode ? 'white' : '#000',
//       minHeight: 100,
//       textAlignVertical: 'top',
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//     },
//     modalButtons: {
//       flexDirection: 'row',
//       justifyContent: 'flex-end',
//       gap: 10,
//       marginTop: 15,
//     },
//     modalButton: {
//       paddingVertical: 10,
//       paddingHorizontal: 20,
//       borderRadius: 8,
//     },
//     cancelButton: {
//       backgroundColor: isDarkMode ? '#444' : '#ddd',
//     },
//     saveButton: {
//       backgroundColor: '#0073b1',
//     },
//     modalButtonText: {
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       fontSize: 14,
//     },
//     cancelButtonText: {
//       color: isDarkMode ? 'white' : '#000',
//     },
//     saveButtonText: {
//       color: 'white',
//     },
//   })

//   const renderHeader = () => (
//     <Animated.View entering={FadeInDown.duration(400)}>
//       <SpaceBetweenRow style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('Tab', { screen: 'Home' })}>
//           {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
//         </TouchableOpacity>
//         <Text style={styles.headerText}>
//           {UserDetails?.UserName || UserDetails?.FullName}
//         </Text>
//         <TouchableOpacity onPress={() => navigation.navigate('SettingsDrawer')}>
//           <GradientIcon
//             colors={['#21B7FF', '#0084F8']}
//             size={18}
//             iconType='Feather'
//             name={'settings'}
//           />
//         </TouchableOpacity>
//       </SpaceBetweenRow>
//     </Animated.View>
//   )

//   const renderCoverPhoto = () => (
//     <Animated.View 
//       entering={FadeIn.duration(500)}
//       style={styles.coverPhotoContainer}
//     >
//       <Image
//         source={{
//           uri: UserDetails?.CoverImage ||
//             'https://images.unsplash.com/photo-1497366216548-37526070297c',
//         }}
//         style={styles.coverPhoto}
//       />

//       <Animated.View 
//         entering={ZoomIn.duration(400).delay(300)}
//         style={styles.profileImageContainer}
//       >
//         <Image
//           source={{
//             uri: UserDetails?.Image || 'https://picsum.photos/id/237/200/300',
//           }}
//           style={styles.profileImage}
//         />
//         {!route?.params?.userId && (
//           <TouchableOpacity
//             style={styles.editImageButton}
//             onPress={handleCoverImageUpdate}
//           >
//             <Feather name='camera' size={14} color='white' />
//           </TouchableOpacity>
//         )}
//       </Animated.View>

//       {!route?.params?.userId && (
//         <TouchableOpacity
//           style={{ ...styles.editImageButton, right: 20, bottom: 10 }}
//           onPress={handleProfileImageUpdate}
//         >
//           <Feather name='camera' size={14} color='white' />
//         </TouchableOpacity>
//       )}
//     </Animated.View>
//   )

//   const renderProfileInfo = () => (
//     <Animated.View 
//       entering={FadeInUp.duration(400).delay(400)}
//       style={styles.profileInfoSection}
//     >
//       <SpaceBetweenRow>
//         <View>
//           <Text style={styles.profileName}>{UserDetails?.FullName}</Text>
//           <Text style={styles.profileUsername}>{UserDetails?.UserName}</Text>
//         </View>
//         {!route?.params?.userId && (
//           <TouchableOpacity
//             style={styles.editProfileButton}
//             onPress={handleBioUpdate}
//           >
//             <Text style={styles.editProfileButtonText}>Edit profile</Text>
//           </TouchableOpacity>
//         )}
//       </SpaceBetweenRow>

//       <View style={styles.statsContainer}>
//         <TouchableOpacity
//           style={styles.statItem}
//           onPress={() => navigation.navigate('Followers')}
//         >
//           <Text style={styles.statNumber}>
//             {UserDetails?.Follower?.length || 0}
//           </Text>
//           <Text style={styles.statLabel}>Followers</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.statItem}
//           onPress={() => navigation.navigate('Followings')}
//         >
//           <Text style={styles.statNumber}>
//             {UserDetails?.Following?.length || 0}
//           </Text>
//           <Text style={styles.statLabel}>Following</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.statusContainer}>
//         <View style={styles.statusDot} />
//         <Text style={styles.statusText}>just now</Text>
//         <Text style={styles.joinedText}>📅 Joined Aug 5, 2025</Text>
//       </View>

//       {route?.params?.userId && (
//         <Animated.View 
//           entering={FadeInUp.duration(300).delay(500)}
//           style={styles.actionButtons}
//         >
//           <TouchableOpacity
//             style={styles.followButton}
//             onPress={() => sendFollowRequest(UserDetails?._id)}
//           >
//             <Text style={styles.followButtonText}>Follow</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.messageButton}
//             onPress={() => navigation.navigate('Chat')}
//           >
//             <Text style={styles.messageButtonText}>Message</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.moreButton}>
//             <Text style={{ color: isDarkMode ? '#ccc' : '#666' }}>•••</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       )}
//     </Animated.View>
//   )

//   // ✅ UPDATED TABS WITH ICONS
//   const renderTabs = () => (
//     <Animated.View 
//       entering={FadeIn.duration(300).delay(600)}
//       style={styles.tabContainer}
//     >
//       {[
//         { key: 'all', label: 'All posts', icon: 'grid', iconType: 'Feather', width: 75 },
//         { key: 'saved', label: 'Saved', icon: 'bookmark', iconType: 'Feather', width: 60 },
//         { key: 'tagged', label: 'Tagged', icon: 'user', iconType: 'AntDesign', width: 65 },
//         { key: 'Marketplace', label: 'Products', icon: 'storefront', iconType: 'Ionicons', width: 80 }
//       ].map((tab) => {
//         const isActive = activeTab === tab.key
//         const iconColor = isActive 
//           ? (isDarkMode ? '#fff' : '#000') 
//           : (isDarkMode ? '#888' : '#666')
        
//         return (
//           <TouchableOpacity
//             key={tab.key}
//             style={styles.tabButton}
//             onPress={() => setActiveTab(tab.key)}
//           >
//             {tab.iconType === 'Feather' && (
//               <Feather name={tab.icon} size={16} color={iconColor} />
//             )}
//             {tab.iconType === 'AntDesign' && (
//               <AntDesign name={tab.icon} size={16} color={iconColor} />
//             )}
//             {tab.iconType === 'Ionicons' && (
//               <Ionicons name={tab.icon} size={16} color={iconColor} />
//             )}
//             <Text style={[styles.tabText, isActive && styles.activeTabText]}>
//               {tab.label}
//             </Text>
//             {isActive && (
//               <Animated.View 
//                 entering={ZoomIn.duration(200)}
//                 style={{
//                   position: 'absolute',
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                 }}
//               >
//                 <LinearGradient
//                   colors={['#21B7FF', '#0084F8']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={{
//                     height: 2,
//                     width: tab.width,
//                     borderRadius: 5,
//                   }}
//                 />
//               </Animated.View>
//             )}
//           </TouchableOpacity>
//         )
//       })}
//     </Animated.View>
//   )

//   const renderPostsGrid = () => {
//     const currentPosts = activeTab === 'all' ? allPosts : 
//                         activeTab === 'saved' ? savedPosts : 
//                         activeTab === 'tagged' ? taggedPosts : // ✅ HANDLE TAGGED POSTS
//                         allProducts

//     const filteredPosts = activeTab === 'all' 
//       ? currentPosts.filter(item => item?.media && !item?.media.toLowerCase().includes('.mp4'))
//       : activeTab === 'saved'
//       ? currentPosts.filter(item => item?.Post?.media && !item?.Post?.media.toLowerCase().includes('.mp4'))
//       : activeTab === 'tagged'
//       ? currentPosts.filter(item => item?.media && !item?.media.toLowerCase().includes('.mp4')) // ✅ FILTER TAGGED POSTS
//       : currentPosts.filter(item => item?.Image && !item?.Image.toLowerCase().includes('.mp4'))

//     if (filteredPosts.length === 0) {
//       return (
//         <Animated.View 
//           entering={FadeIn.duration(400)}
//           style={styles.emptyState}
//         >
//           <Text style={styles.emptyStateText}>
//             {activeTab === 'all' ? 'No posts yet' : 
//              activeTab === 'saved' ? 'No saved posts' : 
//              activeTab === 'tagged' ? 'No tagged posts' : // ✅ TAGGED EMPTY STATE
//              'No products found'}
//           </Text>
//         </Animated.View>
//       )
//     }

//     return (
//       <FlatList
//         data={filteredPosts}
//         numColumns={2}
//         renderItem={({ item, index }) => (
//           <PostCard
//             item={item}
//             activeTab={activeTab}
//             navigation={navigation}
//             index={index}
//             isDarkMode={isDarkMode}
//           />
//         )}
//         keyExtractor={item => item?._id}
//         showsVerticalScrollIndicator={false}
//         scrollEnabled={false}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     )
//   }

//   if (loading) {
//     return <ProfileShimmer />
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent={true}
//         backgroundColor='transparent'
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//       />

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {renderHeader()}
//         {renderCoverPhoto()}
//         {renderProfileInfo()}
//         {renderTabs()}
//         <View style={styles.postsContainer}>{renderPostsGrid()}</View>
//       </ScrollView>

//       {isBioModalVisible && (
//         <Animated.View 
//           entering={FadeIn.duration(200)}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             zIndex: 999,
//           }}
//         >
//           <TouchableOpacity 
//             activeOpacity={1}
//             onPress={() => setBioModalVisible(false)}
//             style={styles.modalOverlay}
//           >
//             <Animated.View 
//               entering={ZoomIn.duration(300).springify()}
//               style={styles.modalContent}
//             >
//               <TouchableOpacity activeOpacity={1}>
//                 <Text style={styles.modalTitle}>Edit Bio</Text>
//                 <TextInput
//                   style={styles.bioInput}
//                   value={bioText}
//                   onChangeText={setBioText}
//                   placeholder='Write your bio...'
//                   placeholderTextColor={isDarkMode ? '#999' : '#666'}
//                   multiline
//                   maxLength={500}
//                 />
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity
//                     style={[styles.modalButton, styles.cancelButton]}
//                     onPress={() => setBioModalVisible(false)}
//                   >
//                     <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
//                       Cancel
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.modalButton, styles.saveButton]}
//                     onPress={saveBio}
//                   >
//                     <Text style={[styles.modalButtonText, styles.saveButtonText]}>
//                       Save
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </TouchableOpacity>
//             </Animated.View>
//           </TouchableOpacity>
//         </Animated.View>
//       )}

//       <CustomDrawer
//         isVisible={isDrawerVisible}
//         onClose={() => setDrawerVisible(false)}
//         navigation={navigation}
//       />
//     </View>
//   )
// }

// export default React.memo(OtherUserDetail)


// import React, { useCallback, useEffect, useState } from 'react'
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   StatusBar,
//   ScrollView,
//   Alert,
//   TextInput,
//   Modal,
// } from 'react-native'
// import Animated, {
//   FadeInDown,
//   FadeInUp,
//   FadeIn,
//   ZoomIn,
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
// } from 'react-native-reanimated'
// import { launchImageLibrary } from 'react-native-image-picker'
// import SpaceBetweenRow from '../../components/wrapper/spacebetween'
// import {
//   PrimaryBackArrow,
//   PrimaryBackWhite,
// } from '../../assets/SVGs'
// import { FONTS_FAMILY } from '../../assets/Fonts'
// import LinearGradient from 'react-native-linear-gradient'
// import CustomDrawer from '../../components/DrawerModal'
// import { useSelector } from 'react-redux'
// import { apiGet, apiPost, getItem } from '../../utils/Apis'
// import urls from '../../config/urls'
// import { useFocusEffect, useIsFocused } from '@react-navigation/native'
// import useLoader from '../../utils/LoaderHook'
// import Feather from 'react-native-vector-icons/Feather'
// import AntDesign from 'react-native-vector-icons/AntDesign'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import { ToastMsg } from '../../utils/helperFunctions'
// import ProfileShimmer from '../../components/Skeletons/ProfilePageShimmer'
// import GradientIcon from '../../components/GradientIcon'
// import GlowWrapper from '../../components/GlowWrapper/GlowWrapper'

// // Simple Animated Post Card
// const PostCard = React.memo(({ item, activeTab, navigation, index, isDarkMode }) => {
//   const scale = useSharedValue(1);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//   }));

//   const handlePressIn = () => {
//     scale.value = withSpring(0.95);
//   };

//   const handlePressOut = () => {
//     scale.value = withSpring(1);
//   };

//   return (
//     <View
//       // entering={FadeInUp.duration(400).delay(index * 40)}
//       style={[{ width: '48%', margin: '1%' },]}
//     >
//       <GlowWrapper 
//         containerStyle={{ height: 120 }}
//         borderRadius={8}
//         showStars={false}
//         showShinePatches={false}
//         intensity="low"
//         isDarkMode={isDarkMode}
//       >
//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate(
//               activeTab === 'all' ? 'AllPostOfAUser' : 
//               activeTab === 'saved' ? 'SavedPosts' : 
//               activeTab === 'tagged' ? 'AllPostOfAUser' :
//               'ProductDetail', 
//               { userId: item?.User?._id }
//             )
//           }
//           onPressIn={handlePressIn}
//           onPressOut={handlePressOut}
//           activeOpacity={0.9}
//           style={{ height: '100%' }}
//         >
//           <Image 
//             source={{ 
//               uri: activeTab === 'all' ? item?.media : 
//                    activeTab === 'saved' ? item?.Post?.media : 
//                    activeTab === 'tagged' ? item?.media :
//                    item?.Image 
//             }} 
//             style={{
//               width: '100%',
//               height: '100%',
//               borderRadius: 8,
//             }}
//             resizeMode="cover"
//           />
//         </TouchableOpacity>
//       </GlowWrapper>
//     </View>
//   );
// });

// PostCard.displayName = 'PostCard';

// const OtherUserDetail = ({ navigation, route }) => {
//   const [isDrawerVisible, setDrawerVisible] = useState(false)
//   const [isBioModalVisible, setBioModalVisible] = useState(false)
//   const [activeTab, setActiveTab] = useState('all')
//   const { isDarkMode } = useSelector(state => state.theme)
//   const [UserDetails, setUserDetails] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [allPosts, setAllPosts] = useState([])
//   const [savedPosts, setSavedPosts] = useState([])
//   const [taggedPosts, setTaggedPosts] = useState([])
//   const [bioText, setBioText] = useState('')
//   const { showLoader, hideLoader } = useLoader()
//   const [allProducts, setAllProducts] = useState([])
  
//   // ✅ NEW STATES FOR MY SPEC & SETTINGS
//   const [showActivityStatus, setShowActivityStatus] = useState(true) // Toggle for activity
//   const [showJoinDate, setShowJoinDate] = useState(true) // Toggle for join date
//   const [isSpecExpanded, setIsSpecExpanded] = useState(false) // See More toggle
  
//   // ✅ STATIC CAR SPEC DATA (Replace with API later)
//   const [carSpec, setCarSpec] = useState({
//     vehicle: '2023 BMW M4',
//     make: 'BMW',
//     model: 'M4 Competition',
//     year: '2023',
//     bodyType: 'Coupe',
//     // Extended specs
//     engine: '3.0L Twin-Turbo I6',
//     hp: '503 HP',
//     torque: '479 lb-ft',
//     drivetrain: 'RWD',
//     transmission: '8-Speed Automatic',
//     // Modifications
//     performanceMods: 'Stage 2 Tune, Downpipes',
//     suspensionMods: 'Coilovers, Adjustable Arms',
//     brakesMods: 'Brembo GT Kit',
//     // Style
//     paintWrap: 'Frozen Black Metallic',
//     exteriorMods: 'Carbon Fiber Splitter, Spoiler',
//     interiorMods: 'Alcantara Steering Wheel',
//     // Status
//     mileage: '12,500 miles',
//     buildStage: 'Modified',
//     ownerNote: 'Daily driven beast! Love the power and handling. Best car Ive ever owned. 🔥',
//     // Optional
//     performanceStats: '0-60: 3.8s | 1/4 Mile: 11.9s',
//     budgetPrice: '$85,000'
//   })

//   const isFocused = useIsFocused()

//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         navigation.setParams({ userId: undefined })
//         setUserDetails(null)
//         setAllPosts([])
//         setSavedPosts([])
//         setTaggedPosts([])
//       }
//     }, [navigation]),
//   )

//   let selector = useSelector(state => state?.user?.userData)
//   if (Object.keys(selector).length != 0) {
//     selector = JSON.parse(selector)
//   }

//   console.log('Show Lat Actve::::::::::', selector);
  

//   useEffect(() => {
//     fetchData()
//     fetchMyPost()
//     fetchSavedPosts()
//     fetchTaggedPosts()
//     fetchAllProducts()
//   }, [isFocused])

//   const fetchData = async () => {
//     setLoading(true)
//     const endPoint = route?.params?.userId
//       ? `${urls.getUserById}/${route?.params?.userId}`
//       : urls.userProfile
//     const res = await apiGet(endPoint)
//     setUserDetails(res?.data)
//     setBioText(res?.data?.Bio || '')
//     setLoading(false)
//   }

  

//   const fetchMyPost = async () => {
//     setLoading(true)
//     const res = await apiGet(
//       `${urls.getAllPostsOfAUser}/${route?.params?.userId || selector?._id}`,
//     )
//     setAllPosts(res?.data)
//     setLoading(false)
//   }

//   const fetchSavedPosts = async () => {
//     const res = await apiGet(`${urls.getAllSavedPosts}`)
//     setSavedPosts(res?.data || [])
//   }

//   const fetchTaggedPosts = async () => {
//     try {
//       const res = await apiGet('/api/user/GetAllMyTaggedPosts')
//       setTaggedPosts(res?.data || [])
//     } catch (error) {
//       console.log('Error fetching tagged posts:', error)
//       setTaggedPosts([])
//     }
//   }

//   const fetchAllProducts = async () => {
//     const res = await apiGet(`/api/admin/AllProducts`)
//     setAllProducts(res?.data || [])
//   }

//   const sendFollowRequest = async id => {
//     const res = await apiPost(
//       `${urls.sendFollowRequest}/${route?.params?.userId}`,
//     )
//   }

//   const imagePickerOptions = {
//     mediaType: 'photo',
//     includeBase64: false,
//     maxHeight: 2000,
//     maxWidth: 2000,
//     quality: 0.8,
//   }

//   const updateUserProfile = async (imageType, imageUri, bio = null) => {
//     try {
//       showLoader()
//       const formData = new FormData()

//       if (imageUri) {
//         formData.append(imageType, {
//           uri: imageUri,
//           type: 'image/jpeg',
//           name: `${imageType.toLowerCase()}.jpg`,
//         })
//       }

//       if (bio !== null) {
//         formData.append('bio', bio)
//       }

//       const token = await getItem('token')
//       const response = await fetch(
//         'https://tomo-backend-app.vercel.app/api/user/UpdateUser',
//         {
//           method: 'PUT',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//           body: formData,
//         },
//       )

//       const result = await response.json()

//       if (response.ok) {
//         ToastMsg('Profile updated successfully!')
//         fetchData()
//       } else {
//         ToastMsg('Failed to update profile')
//       }
//     } catch (error) {
//       ToastMsg('Failed to update profile')
//     } finally {
//       hideLoader()
//     }
//   }

//   const handleProfileImageUpdate = () => {
//     Alert.alert('Update Profile Picture', 'Choose an option', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Choose from Gallery',
//         onPress: () => {
//           launchImageLibrary(imagePickerOptions, response => {
//             if (response.didCancel || response.error) return
//             if (response.assets && response.assets[0]) {
//               updateUserProfile('Image', response.assets[0].uri)
//             }
//           })
//         },
//       },
//     ])
//   }

//   const handleCoverImageUpdate = () => {
//     Alert.alert('Update Cover Photo', 'Choose an option', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Choose from Gallery',
//         onPress: () => {
//           launchImageLibrary(imagePickerOptions, response => {
//             if (response.didCancel || response.error) return
//             if (response.assets && response.assets[0]) {
//               updateUserProfile('CoverImage', response.assets[0].uri)
//             }
//           })
//         },
//       },
//     ])
//   }

//   const handleBioUpdate = () => {
//     setBioModalVisible(true)
//   }

//   const saveBio = () => {
//     updateUserProfile(null, null, bioText)
//     setBioModalVisible(false)
//   }

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? '#1b1b1b' : '#f3f2ef',
//     },
//     header: {
//       paddingTop: 50,
//       paddingHorizontal: 20,
//       backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//       elevation: 2,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 2,
//       paddingBottom: 16,
//     },
//     headerText: {
//       fontSize: 20,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : 'black',
//     },
//     coverPhotoContainer: {
//       height: 200,
//       backgroundColor: isDarkMode ? '#333' : '#ddd',
//       position: 'relative',
//     },
//     coverPhoto: {
//       width: '100%',
//       height: '100%',
//       resizeMode: 'cover',
//     },
//     editProfileButton: {
//       bottom: 15,
//       // right: 15,
//       backgroundColor: '#21B7FF',
//       paddingHorizontal: 16,
//       paddingVertical: 8,
//       borderRadius: 10,
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
//     },
//     editProfileButtonText: {
//       color: 'white',
//       fontSize: 12,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     profileImageContainer: {
//       position: 'absolute',
//       bottom: -50,
//       left: 20,
//       alignItems: 'center',
//     },
//     profileImage: {
//       width: 100,
//       height: 100,
//       borderRadius: 50,
//       borderWidth: 4,
//       borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
//     },
//     editImageButton: {
//       position: 'absolute',
//       bottom: 5,
//       right: 5,
//       backgroundColor: '#4F52FE',
//       width: 28,
//       height: 28,
//       borderRadius: 14,
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
//     },
//     profileInfoSection: {
//       paddingHorizontal: 20,
//       paddingTop: 60,
//       paddingBottom: 20,
//     },
//     profileName: {
//       fontSize: 24,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       color: isDarkMode ? 'white' : '#000',
//     },
//     profileUsername: {
//       fontSize: 16,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//       marginBottom: 15,
//     },
//     statsContainer: {
//       flexDirection: 'row',
//       marginBottom: 9,
//     },
//     statItem: {
//       marginRight: 30,
//     },
//     statNumber: {
//       fontSize: 18,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : '#000',
//     },
//     statLabel: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//     },
//     statusContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 20,
//     },
//     statusDot: {
//       width: 8,
//       height: 8,
//       borderRadius: 4,
//       backgroundColor: '#00D4AA',
//       marginRight: 8,
//     },
//     statusText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//     },
//     joinedText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//       marginLeft: 15,
//     },
//     // ✅ NEW STYLES FOR MY SPEC SECTION
//     mySpecContainer: {
//       backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//       marginHorizontal: 20,
//       marginBottom: 20,
//       borderRadius: 12,
//       padding: 16,
//       elevation: 2,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//     },
//     mySpecHeader: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: 16,
//     },
//     mySpecTitle: {
//       fontSize: 18,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : '#000',
//     },
//     editSpecButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 4,
//     },
//     editSpecText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       color: '#21B7FF',
//     },
//     specRow: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       marginBottom: 12,
//     },
//     specLabel: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#999' : '#666',
//       flex: 1,
//     },
//     specValue: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       color: isDarkMode ? 'white' : '#000',
//       flex: 1,
//       textAlign: 'right',
//     },
//     seeMoreButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'center',
//       marginTop: 8,
//       paddingVertical: 8,
//     },
//     seeMoreText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       color: '#21B7FF',
//       marginRight: 4,
//     },
//     specSectionTitle: {
//       fontSize: 16,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : '#000',
//       marginTop: 16,
//       marginBottom: 8,
//     },
//     ownerNoteContainer: {
//       backgroundColor: isDarkMode ? '#1f1f1f' : '#f9f9f9',
//       padding: 12,
//       borderRadius: 8,
//       marginTop: 12,
//     },
//     ownerNoteText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#ccc' : '#333',
//       lineHeight: 20,
//     },
//     actionButtons: {
//       flexDirection: 'row',
//       justifyContent: 'center',
//       gap: 12,
//       paddingHorizontal: 20,
//       marginBottom: 20,
//     },
//     followButton: {
//       backgroundColor: '#0073b1',
//       paddingVertical: 10,
//       paddingHorizontal: 24,
//       borderRadius: 25,
//       minWidth: 100,
//       alignItems: 'center',
//     },
//     messageButton: {
//       backgroundColor: 'transparent',
//       borderWidth: 1,
//       borderColor: '#0073b1',
//       paddingVertical: 10,
//       paddingHorizontal: 24,
//       borderRadius: 25,
//       minWidth: 100,
//       alignItems: 'center',
//     },
//     moreButton: {
//       backgroundColor: 'transparent',
//       borderWidth: 1,
//       borderColor: isDarkMode ? '#666' : '#ddd',
//       paddingVertical: 10,
//       paddingHorizontal: 16,
//       borderRadius: 25,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     followButtonText: {
//       color: 'white',
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     messageButtonText: {
//       color: '#0073b1',
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     tabContainer: {
//       flexDirection: 'row',
//       borderBottomWidth: 1,
//       borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
//       marginHorizontal: 10,
//       marginBottom: 20,
//       justifyContent:'space-between'
//     },
//     tabButton: {
//       paddingVertical: 15,
//       paddingHorizontal: 12,
//       alignItems: 'center',
//       gap: 6,
//     },
//     tabText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#888' : '#666',
//     },
//     activeTabText: {
//       color: isDarkMode ? 'white' : '#000',
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     postsContainer: {
//       paddingHorizontal: 10,
//       paddingBottom: 100,
//     },
//     emptyState: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       paddingTop: 50,
//     },
//     emptyStateText: {
//       fontSize: 16,
//       color: isDarkMode ? '#888' : '#666',
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       textAlign: 'center',
//     },
//     modalOverlay: {
//       flex: 1,
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     modalContent: {
//       backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//       margin: 20,
//       borderRadius: 12,
//       padding: 20,
//       width: '90%',
//     },
//     modalTitle: {
//       fontSize: 18,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : '#000',
//       marginBottom: 15,
//     },
//     bioInput: {
//       borderWidth: 1,
//       borderColor: isDarkMode ? '#444' : '#ddd',
//       borderRadius: 8,
//       padding: 12,
//       color: isDarkMode ? 'white' : '#000',
//       minHeight: 100,
//       textAlignVertical: 'top',
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//     },
//     modalButtons: {
//       flexDirection: 'row',
//       justifyContent: 'flex-end',
//       gap: 10,
//       marginTop: 15,
//     },
//     modalButton: {
//       paddingVertical: 10,
//       paddingHorizontal: 20,
//       borderRadius: 8,
//     },
//     cancelButton: {
//       backgroundColor: isDarkMode ? '#444' : '#ddd',
//     },
//     saveButton: {
//       backgroundColor: '#0073b1',
//     },
//     modalButtonText: {
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       fontSize: 14,
//     },
//     cancelButtonText: {
//       color: isDarkMode ? 'white' : '#000',
//     },
//     saveButtonText: {
//       color: 'white',
//     },
//   })

//   const renderHeader = () => (
//     <Animated.View entering={FadeInDown.duration(400)}>
//       {/* {console.log(UserDetails,'-----------------------------')
//       } */}
//       <SpaceBetweenRow style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('Tab', { screen: 'Home' })}>
//           {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
//         </TouchableOpacity>
//         <Text style={styles.headerText}>
//           {UserDetails?.UserName || UserDetails?.FullName}
//         </Text>
//         <TouchableOpacity onPress={() => navigation.navigate('SettingsDrawer')}>
//           <GradientIcon
//             colors={['#21B7FF', '#0084F8']}
//             size={18}
//             iconType='Feather'
//             name={'settings'}
//           />
//         </TouchableOpacity>
//       </SpaceBetweenRow>
//     </Animated.View>
//   )

//   const renderCoverPhoto = () => (
//     <Animated.View 
//       entering={FadeIn.duration(500)}
//       style={styles.coverPhotoContainer}
//     >
//       <Image
//         source={{
//           uri: UserDetails?.CoverImage ||
//             'https://images.unsplash.com/photo-1497366216548-37526070297c',
//         }}
//         style={styles.coverPhoto}
//       />

//       <Animated.View 
//         entering={ZoomIn.duration(400).delay(300)}
//         style={styles.profileImageContainer}
//       >
//         {/* ✅ Profile Image is now user's CAR */}
//         <Image
//           source={{
//             uri: UserDetails?.CarImage || 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068',
//           }}
//           style={styles.profileImage}
//         />
//         {!route?.params?.userId && (
//           <TouchableOpacity
//             style={styles.editImageButton}
//             onPress={handleCoverImageUpdate}
//           >
//             <Feather name='camera' size={14} color='white' />
//           </TouchableOpacity>
//         )}
//       </Animated.View>

//       {!route?.params?.userId && (
//         <TouchableOpacity
//           style={{ ...styles.editImageButton, right: 20, bottom: 10 }}
//           onPress={handleProfileImageUpdate}
//         >
//           <Feather name='camera' size={14} color='white' />
//         </TouchableOpacity>
//       )}
//     </Animated.View>
//   )
//   const renderProfileInfo = () => (
//     <Animated.View 
//       entering={FadeInUp.duration(400).delay(400)}
//       style={styles.profileInfoSection}
//     >
//       <SpaceBetweenRow>
//         <View>
//           <Text style={styles.profileName}>{UserDetails?.FullName}</Text>
//           <Text style={styles.profileUsername}>{UserDetails?.UserName}</Text>
//         </View>
//         {!route?.params?.userId && (
//           <TouchableOpacity
//             style={styles.editProfileButton}
//             onPress={handleBioUpdate}
//           >
//             <Text style={styles.editProfileButtonText}>Edit profile</Text>
//           </TouchableOpacity>
//         )}
//          {!route?.params?.userId && (
//           <TouchableOpacity
//             style={styles.editProfileButton}
//             onPress={()=>navigation.navigate('AddVehicleSpecs')}
//           >
//             <Text style={styles.editProfileButtonText}>Add Specs</Text>
//           </TouchableOpacity>
//         )}
//       </SpaceBetweenRow>

//       <View style={styles.statsContainer}>
//         <TouchableOpacity
//           style={styles.statItem}
//           onPress={() => navigation.navigate('Followers')}
//         >
//           <Text style={styles.statNumber}>
//             {UserDetails?.Follower?.length || 0}
//           </Text>
//           <Text style={styles.statLabel}>Followers</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.statItem}
//           onPress={() => navigation.navigate('Followings')}
//         >
//           <Text style={styles.statNumber}>
//             {UserDetails?.Following?.length || 0}
//           </Text>
//           <Text style={styles.statLabel}>Following</Text>
//         </TouchableOpacity>
//       </View>

//       {/* ✅ ACTIVITY STATUS & JOIN DATE WITH TOGGLES */}
//       {/* <View style={styles.statusContainer}>
//         {UserDetails?.ShowLastActive && (
//           <>
//             <View style={styles.statusDot} />
//             <Text style={styles.statusText}>just now</Text>
//           </>
//         )}
//         {UserDetails?.ShowJoinedDate && (
//           <Text style={styles.joinedText}>📅 Joined Aug 5, 2025</Text>
//         )}
//       </View> */}

//       {/* ✅ ACTIVITY STATUS & JOIN DATE WITH TOGGLES */}
// <View style={styles.statusContainer}>
//   { selector?.ShowLastActive && (
//     <>
//       <View style={styles.statusDot} />
//       <Text style={styles.statusText}>
//         {(() => {
//           const now = new Date();
//           const lastActive = new Date(selector?.LastActiveAt);
//           const diffMs = now - lastActive;
//           const diffMins = Math.floor(diffMs / 60000);
//           const diffHours = Math.floor(diffMs / 3600000);
//           const diffDays = Math.floor(diffMs / 86400000);
          
//           if (diffMins < 1) return 'just now';
//           if (diffMins < 60) return `${diffMins}m ago`;
//           if (diffHours < 24) return `${diffHours}h ago`;
//           if (diffDays < 7) return `${diffDays}d ago`;
//           return `${Math.floor(diffDays / 7)}w ago`;
//         })()}
//       </Text>
//     </>
//   )}
//   {selector?.ShowJoinedDate
//  && (
//     <Text style={styles.joinedText}>
//       📅 Joined {(() => {
//         const joinDate = new Date(selector?.createdAt || '2025-08-05');
//         const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//         return `${months[joinDate.getMonth()]} ${joinDate.getDate()}, ${joinDate.getFullYear()}`;
//       })()}
//     </Text>
//   )}
// </View>

//       {route?.params?.userId && (
//         <Animated.View 
//           entering={FadeInUp.duration(300).delay(500)}
//           style={styles.actionButtons}
//         >
//           <TouchableOpacity
//             style={styles.followButton}
//             onPress={() => sendFollowRequest(UserDetails?._id)}
//           >
//             <Text style={styles.followButtonText}>Follow</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.messageButton}
//             onPress={() => navigation.navigate('Chat')}
//           >
//             <Text style={styles.messageButtonText}>Message</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.moreButton}>
//             <Text style={{ color: isDarkMode ? '#ccc' : '#666' }}>•••</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       )}
//     </Animated.View>
//   )

//   // ✅ NEW COMPONENT: MY SPEC SECTION
//   const renderMySpec = () => (
//     <Animated.View 
//       entering={FadeInUp.duration(400).delay(600)}
//       style={styles.mySpecContainer}
//     >
//       {/* Header */}
//       <View style={styles.mySpecHeader}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//           <MaterialCommunityIcons 
//             name="car-sports" 
//             size={20} 
//             color={isDarkMode ? '#21B7FF' : '#0084F8'} 
//           />
//           <Text style={styles.mySpecTitle}>My Spec</Text>
//         </View>
//         {!route?.params?.userId && (
//           <TouchableOpacity style={styles.editSpecButton}>
//             <Feather name="edit-2" size={14} color="#21B7FF" />
//             <Text style={styles.editSpecText}>Edit</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Main Specs (Always Visible) */}
//       <View style={styles.specRow}>
//         <Text style={styles.specLabel}>Vehicle</Text>
//         <Text style={styles.specValue}>{carSpec.vehicle}</Text>
//       </View>
//       <View style={styles.specRow}>
//         <Text style={styles.specLabel}>Make</Text>
//         <Text style={styles.specValue}>{carSpec.make}</Text>
//       </View>
//       <View style={styles.specRow}>
//         <Text style={styles.specLabel}>Model</Text>
//         <Text style={styles.specValue}>{carSpec.model}</Text>
//       </View>
//       <View style={styles.specRow}>
//         <Text style={styles.specLabel}>Year</Text>
//         <Text style={styles.specValue}>{carSpec.year}</Text>
//       </View>
//       <View style={styles.specRow}>
//         <Text style={styles.specLabel}>Body Type</Text>
//         <Text style={styles.specValue}>{carSpec.bodyType}</Text>
//       </View>

//       {/* Extended Specs (Show on toggle) */}
//       {isSpecExpanded && (
//         <Animated.View entering={FadeIn.duration(300)}>
//           {/* Power Section */}
//           <Text style={styles.specSectionTitle}>⚡ Power</Text>
//           <View style={styles.specRow}>
//             <Text style={styles.specLabel}>Engine</Text>
//             <Text style={styles.specValue}>{carSpec.engine}</Text>
//           </View>
//           <View style={styles.specRow}>
//             <Text style={styles.specLabel}>HP / Torque</Text>
//             <Text style={styles.specValue}>{carSpec.hp} / {carSpec.torque}</Text>
//           </View>
//           <View style={styles.specRow}>
//             <Text style={styles.specLabel}>Drivetrain</Text>
//             <Text style={styles.specValue}>{carSpec.drivetrain}</Text>
//           </View>
//           <View style={styles.specRow}>
//             <Text style={styles.specLabel}>Transmission</Text>
//             <Text style={styles.specValue}>{carSpec.transmission}</Text>
//           </View>

//           {/* Modifications Section */}
//           <Text style={styles.specSectionTitle}>🔧 Modifications</Text>
//           <View style={styles.specRow}>
//             <Text style={styles.specLabel}>Performance</Text>
//             <Text style={styles.specValue}>{carSpec.performanceMods}</Text>
//           </View>
//           <View style={styles.specRow}>
//             <Text style={styles.specLabel}>Suspension</Text>
//             <Text style={styles.specValue}>{carSpec.suspensionMods}</Text>
//           </View>
//           <View style={styles.specRow}>
//             <Text style={styles.specLabel}>Brakes</Text>
//             <Text style={styles.specValue}>{carSpec.brakesMods}</Text>
//           </View>

//           {/* Style Section */}
//           <Text style={styles.specSectionTitle}>🎨 Style</Text>
//           <View style={styles.specRow}>
//             <Text style={styles.specLabel}>Paint/Wrap</Text>
//             <Text style={styles.specValue}>{carSpec.paintWrap}</Text>
//           </View>
//           <View style={styles.specRow}>
//             <Text style={styles.specLabel}>Exterior Mods</Text>
//             <Text style={styles.specValue}>{carSpec.exteriorMods}</Text>
//           </View>
//           <View style={styles.specRow}>
//             <Text style={styles.specLabel}>Interior Mods</Text>
//             <Text style={styles.specValue}>{carSpec.interiorMods}</Text>
//           </View>

//           {/* Status Section */}
//           <Text style={styles.specSectionTitle}>📊 Status</Text>
//           <View style={styles.specRow}>
//             <Text style={styles.specLabel}>Mileage</Text>
//             <Text style={styles.specValue}>{carSpec.mileage}</Text>
//           </View>
//           <View style={styles.specRow}>
//             <Text style={styles.specLabel}>Build Stage</Text>
//             <Text style={styles.specValue}>{carSpec.buildStage}</Text>
//           </View>

//           {/* Owner Note */}
//           <Text style={styles.specSectionTitle}>📝 Owner Note</Text>
//           <View style={styles.ownerNoteContainer}>
//             <Text style={styles.ownerNoteText}>{carSpec.ownerNote}</Text>
//           </View>

//           {/* Optional Stats */}
//           {carSpec.performanceStats && (
//             <>
//               <Text style={styles.specSectionTitle}>🏁 Performance Stats</Text>
//               <View style={styles.specRow}>
//                 <Text style={styles.specValue}>{carSpec.performanceStats}</Text>
//               </View>
//             </>
//           )}

//           {carSpec.budgetPrice && (
//             <>
//               <Text style={styles.specSectionTitle}>💰 Budget/Current Price</Text>
//               <View style={styles.specRow}>
//                 <Text style={styles.specValue}>{carSpec.budgetPrice}</Text>
//               </View>
//             </>
//           )}
//         </Animated.View>
//       )}

//       {/* See More / See Less Button */}
//       <TouchableOpacity 
//         style={styles.seeMoreButton}
//         onPress={() => setIsSpecExpanded(!isSpecExpanded)}
//       >
//         <Text style={styles.seeMoreText}>
//           {isSpecExpanded ? 'See Less' : 'See More'}
//         </Text>
//         <Feather 
//           name={isSpecExpanded ? 'chevron-up' : 'chevron-down'} 
//           size={16} 
//           color="#21B7FF" 
//         />
//       </TouchableOpacity>
//     </Animated.View>
//   )

//   const renderTabs = () => (
//     <Animated.View 
//       entering={FadeIn.duration(300).delay(600)}
//       style={styles.tabContainer}
//     >
//       {[
//         { key: 'all', label: 'All posts', icon: 'grid', iconType: 'Feather', width: 75 },
//         { key: 'saved', label: 'Saved', icon: 'bookmark', iconType: 'Feather', width: 60 },
//         { key: 'tagged', label: 'Tagged', icon: 'user', iconType: 'AntDesign', width: 65 },
//         { key: 'Marketplace', label: 'Products', icon: 'storefront', iconType: 'Ionicons', width: 80 }
//       ].map((tab) => {
//         const isActive = activeTab === tab.key
//         const iconColor = isActive 
//           ? (isDarkMode ? '#fff' : '#000') 
//           : (isDarkMode ? '#888' : '#666')
        
//         return (
//           <TouchableOpacity
//             key={tab.key}
//             style={styles.tabButton}
//             onPress={() => setActiveTab(tab.key)}
//           >
//             {tab.iconType === 'Feather' && (
//               <Feather name={tab.icon} size={16} color={iconColor} />
//             )}
//             {tab.iconType === 'AntDesign' && (
//               <AntDesign name={tab.icon} size={16} color={iconColor} />
//             )}
//             {tab.iconType === 'Ionicons' && (
//               <Ionicons name={tab.icon} size={16} color={iconColor} />
//             )}
//             <Text style={[styles.tabText, isActive && styles.activeTabText]}>
//               {tab.label}
//             </Text>
//             {isActive && (
//               <Animated.View 
//                 entering={ZoomIn.duration(200)}
//                 style={{
//                   position: 'absolute',
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                 }}
//               >
//                 <LinearGradient
//                   colors={['#21B7FF', '#0084F8']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={{
//                     height: 2,
//                     width: tab.width,
//                     borderRadius: 5,
//                   }}
//                 />
//               </Animated.View>
//             )}
//           </TouchableOpacity>
//         )
//       })}
//     </Animated.View>
//   )

//   const renderPostsGrid = () => {
//     const currentPosts = activeTab === 'all' ? allPosts : 
//                         activeTab === 'saved' ? savedPosts : 
//                         activeTab === 'tagged' ? taggedPosts :
//                         allProducts

//     const filteredPosts = activeTab === 'all' 
//       ? currentPosts.filter(item => item?.media && !item?.media.toLowerCase().includes('.mp4'))
//       : activeTab === 'saved'
//       ? currentPosts.filter(item => item?.Post?.media && !item?.Post?.media.toLowerCase().includes('.mp4'))
//       : activeTab === 'tagged'
//       ? currentPosts.filter(item => item?.media && !item?.media.toLowerCase().includes('.mp4'))
//       : currentPosts.filter(item => item?.Image && !item?.Image.toLowerCase().includes('.mp4'))

//     if (filteredPosts.length === 0) {
//       return (
//         <Animated.View 
//           entering={FadeIn.duration(400)}
//           style={styles.emptyState}
//         >
//           <Text style={styles.emptyStateText}>
//             {activeTab === 'all' ? 'No posts yet' : 
//              activeTab === 'saved' ? 'No saved posts' : 
//              activeTab === 'tagged' ? 'No tagged posts' :
//              'No products found'}
//           </Text>
//         </Animated.View>
//       )
//     }

//     return (
//       <FlatList
//         data={filteredPosts}
//         numColumns={2}
//         renderItem={({ item, index }) => (
//           <PostCard
//             item={item}
//             activeTab={activeTab}
//             navigation={navigation}
//             index={index}
//             isDarkMode={isDarkMode}
//           />
//         )}
//         keyExtractor={item => item?._id}
//         showsVerticalScrollIndicator={false}
//         scrollEnabled={false}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     )
//   }

//   if (loading) {
//     return <ProfileShimmer />
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent={true}
//         backgroundColor='transparent'
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//       />

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {renderHeader()}
//         {renderCoverPhoto()}
//         {renderProfileInfo()}
//         {/* ✅ MY SPEC SECTION ADDED HERE */}
//         {renderMySpec()}
//         {renderTabs()}
//         <View style={styles.postsContainer}>{renderPostsGrid()}</View>
//       </ScrollView>

//       {/* Bio Edit Modal */}
//       {isBioModalVisible && (
//         <Animated.View 
//           entering={FadeIn.duration(200)}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             zIndex: 999,
//           }}
//         >
//           <TouchableOpacity 
//             activeOpacity={1}
//             onPress={() => setBioModalVisible(false)}
//             style={styles.modalOverlay}
//           >
//             <Animated.View 
//               entering={ZoomIn.duration(300).springify()}
//               style={styles.modalContent}
//             >
//               <TouchableOpacity activeOpacity={1}>
//                 <Text style={styles.modalTitle}>Edit Bio</Text>
//                 <TextInput
//                   style={styles.bioInput}
//                   value={bioText}
//                   onChangeText={setBioText}
//                   placeholder='Write your bio...'
//                   placeholderTextColor={isDarkMode ? '#999' : '#666'}
//                   multiline
//                   maxLength={500}
//                 />
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity
//                     style={[styles.modalButton, styles.cancelButton]}
//                     onPress={() => setBioModalVisible(false)}
//                   >
//                     <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
//                       Cancel
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.modalButton, styles.saveButton]}
//                     onPress={saveBio}
//                   >
//                     <Text style={[styles.modalButtonText, styles.saveButtonText]}>
//                       Save
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </TouchableOpacity>
//             </Animated.View>
//           </TouchableOpacity>
//         </Animated.View>
//       )}

//       <CustomDrawer
//         isVisible={isDrawerVisible}
//         onClose={() => setDrawerVisible(false)}
//         navigation={navigation}
//       />
//     </View>
//   )
// }

// export default React.memo(OtherUserDetail)



import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native'
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { launchImageLibrary } from 'react-native-image-picker'
import SpaceBetweenRow from '../../components/wrapper/spacebetween'
import {
  PrimaryBackArrow,
  PrimaryBackWhite,
} from '../../assets/SVGs'
import { FONTS_FAMILY } from '../../assets/Fonts'
import LinearGradient from 'react-native-linear-gradient'
import CustomDrawer from '../../components/DrawerModal'
import { useSelector } from 'react-redux'
import { apiGet, apiPost, getItem } from '../../utils/Apis'
import urls from '../../config/urls'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import useLoader from '../../utils/LoaderHook'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ToastMsg } from '../../utils/helperFunctions'
import ProfileShimmer from '../../components/Skeletons/ProfilePageShimmer'
import GradientIcon from '../../components/GradientIcon'
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper'

// Simple Animated Post Card
const PostCard = React.memo(({ item, activeTab, navigation, index, isDarkMode }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <View
      // entering={FadeInUp.duration(400).delay(index * 40)}
      style={[{ width: '48%', margin: '1%' },]}
    >
      <GlowWrapper 
        containerStyle={{ height: 120 }}
        borderRadius={8}
        showStars={false}
        showShinePatches={false}
        intensity="low"
        isDarkMode={isDarkMode}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              activeTab === 'all' ? 'AllPostOfAUser' : 
              activeTab === 'saved' ? 'SavedPosts' : 
              activeTab === 'tagged' ? 'AllPostOfAUser' :
              'ProductDetail', 
              { userId: item?.User?._id }
            )
          }
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          style={{ height: '100%' }}
        >
          <Image 
            source={{ 
              uri: activeTab === 'all' ? item?.media : 
                   activeTab === 'saved' ? item?.Post?.media : 
                   activeTab === 'tagged' ? item?.media :
                   item?.Image 
            }} 
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </GlowWrapper>
    </View>
  );
});

PostCard.displayName = 'PostCard';

const OtherUserDetail = ({ navigation, route }) => {
  const [isDrawerVisible, setDrawerVisible] = useState(false)
  const [isBioModalVisible, setBioModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const { isDarkMode } = useSelector(state => state.theme)
  const [UserDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [taggedPosts, setTaggedPosts] = useState([])
  const [bioText, setBioText] = useState('')
  const { showLoader, hideLoader } = useLoader()
  const [allProducts, setAllProducts] = useState([])
  
  // ✅ NEW STATES FOR MY SPEC & SETTINGS
  const [showActivityStatus, setShowActivityStatus] = useState(true)
  const [showJoinDate, setShowJoinDate] = useState(true)
  const [isSpecExpanded, setIsSpecExpanded] = useState(false)
  
  // ✅ DYNAMIC CAR SPEC DATA FROM API
  const [carSpec, setCarSpec] = useState(null)
  const [hasCarSpec, setHasCarSpec] = useState(false)

  const isFocused = useIsFocused()

  useFocusEffect(
    useCallback(() => {
      return () => {
        navigation.setParams({ userId: undefined })
        setUserDetails(null)
        setAllPosts([])
        setSavedPosts([])
        setTaggedPosts([])
        setCarSpec(null)
        setHasCarSpec(false)
      }
    }, [navigation]),
  )

  let selector = useSelector(state => state?.user?.userData)
  if (Object.keys(selector).length != 0) {
    selector = JSON.parse(selector)
  }

  console.log('Show Lat Actve::::::::::', selector);
  

  useEffect(() => {
    fetchData()
    fetchMyPost()
    fetchSavedPosts()
    fetchTaggedPosts()
    fetchAllProducts()
    fetchCarSpecs() // ✅ Fetch car specs
  }, [isFocused])

  const fetchData = async () => {
    setLoading(true)
    const endPoint = route?.params?.userId
      ? `${urls.getUserById}/${route?.params?.userId}`
      : urls.userProfile
    const res = await apiGet(endPoint)
    setUserDetails(res?.data)
    setBioText(res?.data?.Bio || '')
    setLoading(false)
  }

  // ✅ NEW FUNCTION: Fetch Car Specs from API
  const fetchCarSpecs = async () => {
    try {
      const res = await apiGet('/api/user/GetUserCurrentCar')
      if (res?.data && res?.data?.length > 0) {
        const carData = res.data[0] // Get first car
        
        // Transform API data to match component structure
        const transformedSpec = {
          _id: carData._id,
          vehicle: carData.VehicleInfo?.vehicleName || 'N/A',
          make: carData.VehicleInfo?.make || 'N/A',
          model: carData.VehicleInfo?.model || 'N/A',
          year: carData.VehicleInfo?.year?.toString() || 'N/A',
          bodyType: carData.VehicleInfo?.bodyType || 'N/A',
          // Power
          engine: carData.Power?.engine || 'N/A',
          hp: carData.Power?.horsepower ? `${carData.Power.horsepower} HP` : 'N/A',
          torque: carData.Power?.torque ? `${carData.Power.torque} lb-ft` : 'N/A',
          drivetrain: carData.Power?.drivetrain || 'N/A',
          transmission: carData.Power?.transmission || 'N/A',
          // Modifications
          performanceMods: Array.isArray(carData.Modifications?.performance) 
            ? carData.Modifications.performance.join(', ') 
            : 'N/A',
          suspensionMods: Array.isArray(carData.Modifications?.suspension)
            ? carData.Modifications.suspension.join(', ')
            : 'N/A',
          brakesMods: Array.isArray(carData.Modifications?.brakes)
            ? carData.Modifications.brakes.join(', ')
            : 'N/A',
          // Style
          paintWrap: carData.Style?.paintWrap || 'N/A',
          exteriorMods: Array.isArray(carData.Style?.exteriorMods)
            ? carData.Style.exteriorMods.join(', ')
            : 'N/A',
          interiorMods: Array.isArray(carData.Style?.interiorMods)
            ? carData.Style.interiorMods.join(', ')
            : 'N/A',
          // Status
          mileage: carData.Status?.mileage ? `${carData.Status.mileage.toLocaleString()} miles` : 'N/A',
          buildStage: carData.Status?.buildStage || 'N/A',
          ownerNote: carData.OwnerNote || 'No notes added',
          // Optional
          performanceStats: carData.PerformanceStats?.zeroToSixty && carData.PerformanceStats?.quarterMile
            ? `0-60: ${carData.PerformanceStats.zeroToSixty} | 1/4 Mile: ${carData.PerformanceStats.quarterMile}`
            : null,
          budgetPrice: carData.CurrentPrice ? `$${carData.CurrentPrice.toLocaleString()}` : null,
          image: carData.Image || null
        }
        
        setCarSpec(transformedSpec)
        setHasCarSpec(true)
      } else {
        setHasCarSpec(false)
      }
    } catch (error) {
      console.log('Error fetching car specs:', error)
      setHasCarSpec(false)
    }
  }

  const fetchMyPost = async () => {
    setLoading(true)
    const res = await apiGet(
      `${urls.getAllPostsOfAUser}/${route?.params?.userId || selector?._id}`,
    )
    setAllPosts(res?.data)
    setLoading(false)
  }

  const fetchSavedPosts = async () => {
    const res = await apiGet(`${urls.getAllSavedPosts}`)
    setSavedPosts(res?.data || [])
  }

  const fetchTaggedPosts = async () => {
    try {
      const res = await apiGet('/api/user/GetAllMyTaggedPosts')
      setTaggedPosts(res?.data || [])
    } catch (error) {
      console.log('Error fetching tagged posts:', error)
      setTaggedPosts([])
    }
  }

  const fetchAllProducts = async () => {
    const res = await apiGet(`/api/admin/AllProducts`)
    setAllProducts(res?.data || [])
  }

  const sendFollowRequest = async id => {
    const res = await apiPost(
      `${urls.sendFollowRequest}/${route?.params?.userId}`,
    )
  }

  const imagePickerOptions = {
    mediaType: 'photo',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
    quality: 0.8,
  }

  const updateUserProfile = async (imageType, imageUri, bio = null) => {
    try {
      showLoader()
      const formData = new FormData()

      if (imageUri) {
        formData.append(imageType, {
          uri: imageUri,
          type: 'image/jpeg',
          name: `${imageType.toLowerCase()}.jpg`,
        })
      }

      if (bio !== null) {
        formData.append('bio', bio)
      }

      const token = await getItem('token')
      const response = await fetch(
        'https://tomo-backend-app.vercel.app/api/user/UpdateUser',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      )

      const result = await response.json()

      if (response.ok) {
        ToastMsg('Profile updated successfully!')
        fetchData()
      } else {
        ToastMsg('Failed to update profile')
      }
    } catch (error) {
      ToastMsg('Failed to update profile')
    } finally {
      hideLoader()
    }
  }

  const handleProfileImageUpdate = () => {
    Alert.alert('Update Profile Picture', 'Choose an option', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Choose from Gallery',
        onPress: () => {
          launchImageLibrary(imagePickerOptions, response => {
            if (response.didCancel || response.error) return
            if (response.assets && response.assets[0]) {
              updateUserProfile('Image', response.assets[0].uri)
            }
          })
        },
      },
    ])
  }

  const handleCoverImageUpdate = () => {
    Alert.alert('Update Cover Photo', 'Choose an option', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Choose from Gallery',
        onPress: () => {
          launchImageLibrary(imagePickerOptions, response => {
            if (response.didCancel || response.error) return
            if (response.assets && response.assets[0]) {
              updateUserProfile('CoverImage', response.assets[0].uri)
            }
          })
        },
      },
    ])
  }

  const handleBioUpdate = () => {
    setBioModalVisible(true)
  }

  const saveBio = () => {
    updateUserProfile(null, null, bioText)
    setBioModalVisible(false)
  }

  // ✅ NEW FUNCTION: Handle Edit Car Specs
  const handleEditCarSpecs = () => {
    if (carSpec) {
      navigation.navigate('AddVehicleSpecs', {
        vehicleData: {
          _id: carSpec._id,
          vehicleName: carSpec.vehicle,
          make: carSpec.make,
          model: carSpec.model,
          year: parseInt(carSpec.year),
          bodyType: carSpec.bodyType,
          engine: carSpec.engine,
          horsepower: parseInt(carSpec.hp.replace(' HP', '')),
          torque: parseInt(carSpec.torque.replace(' lb-ft', '')),
          drivetrain: carSpec.drivetrain,
          transmission: carSpec.transmission,
          performance: carSpec.performanceMods.split(', '),
          suspension: carSpec.suspensionMods.split(', '),
          brakes: carSpec.brakesMods.split(', '),
          paintWrap: carSpec.paintWrap,
          exteriorMods: carSpec.exteriorMods.split(', '),
          interiorMods: carSpec.interiorMods.split(', '),
          mileage: parseInt(carSpec.mileage.replace(/[^0-9]/g, '')),
          buildStage: carSpec.buildStage,
          ownerNote: carSpec.ownerNote,
          zeroToSixty: carSpec.performanceStats?.split(' | ')[0]?.replace('0-60: ', ''),
          quarterMile: carSpec.performanceStats?.split(' | ')[1]?.replace('1/4 Mile: ', ''),
          currentPrice: parseInt(carSpec.budgetPrice?.replace(/[^0-9]/g, '') || 0),
          images: carSpec.image ? [carSpec.image] : []
        }
      })
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1b1b1b' : '#f3f2ef',
    },
    header: {
      paddingTop: 50,
      paddingHorizontal: 20,
      backgroundColor: isDarkMode ? '#252525' : '#ffffff',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      paddingBottom: 16,
    },
    headerText: {
      fontSize: 20,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : 'black',
    },
    coverPhotoContainer: {
      height: 200,
      backgroundColor: isDarkMode ? '#333' : '#ddd',
      position: 'relative',
    },
    coverPhoto: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    editProfileButton: {
      bottom: 15,
      backgroundColor: '#21B7FF',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
    },
    editProfileButtonText: {
      color: 'white',
      fontSize: 12,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    profileImageContainer: {
      position: 'absolute',
      bottom: -50,
      left: 20,
      alignItems: 'center',
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 4,
      borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
    },
    editImageButton: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      backgroundColor: '#4F52FE',
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
    },
    profileInfoSection: {
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
    },
    profileName: {
      fontSize: 24,
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      color: isDarkMode ? 'white' : '#000',
    },
    profileUsername: {
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
      marginBottom: 15,
    },
    statsContainer: {
      flexDirection: 'row',
      marginBottom: 9,
    },
    statItem: {
      marginRight: 30,
    },
    statNumber: {
      fontSize: 18,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : '#000',
    },
    statLabel: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00D4AA',
      marginRight: 8,
    },
    statusText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
    },
    joinedText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
      marginLeft: 15,
    },
    // ✅ MY SPEC STYLES
    mySpecContainer: {
      backgroundColor: isDarkMode ? '#252525' : '#ffffff',
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 12,
      padding: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    mySpecHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    mySpecTitle: {
      fontSize: 18,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : '#000',
    },
    editSpecButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    editSpecText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      color: '#21B7FF',
    },
    specRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    specLabel: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#999' : '#666',
      flex: 1,
    },
    specValue: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      color: isDarkMode ? 'white' : '#000',
      flex: 1,
      textAlign: 'right',
    },
    seeMoreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      paddingVertical: 8,
    },
    seeMoreText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      color: '#21B7FF',
      marginRight: 4,
    },
    specSectionTitle: {
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : '#000',
      marginTop: 16,
      marginBottom: 8,
    },
    ownerNoteContainer: {
      backgroundColor: isDarkMode ? '#1f1f1f' : '#f9f9f9',
      padding: 12,
      borderRadius: 8,
      marginTop: 12,
    },
    ownerNoteText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#ccc' : '#333',
      lineHeight: 20,
    },
    addSpecButton: {
      backgroundColor: isDarkMode ? '#1f1f1f' : '#f9f9f9',
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: isDarkMode ? '#404040' : '#ddd',
    },
    addSpecText: {
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      color: isDarkMode ? '#999' : '#666',
      marginTop: 8,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    followButton: {
      backgroundColor: '#0073b1',
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 25,
      minWidth: 100,
      alignItems: 'center',
    },
    messageButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#0073b1',
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 25,
      minWidth: 100,
      alignItems: 'center',
    },
    moreButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isDarkMode ? '#666' : '#ddd',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    followButtonText: {
      color: 'white',
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    messageButtonText: {
      color: '#0073b1',
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    tabContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
      marginHorizontal: 10,
      marginBottom: 20,
      justifyContent:'space-between'
    },
    tabButton: {
      paddingVertical: 15,
      paddingHorizontal: 12,
      alignItems: 'center',
      gap: 6,
    },
    tabText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
    },
    activeTabText: {
      color: isDarkMode ? 'white' : '#000',
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    postsContainer: {
      paddingHorizontal: 10,
      paddingBottom: 100,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
    },
    emptyStateText: {
      fontSize: 16,
      color: isDarkMode ? '#888' : '#666',
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#252525' : '#ffffff',
      margin: 20,
      borderRadius: 12,
      padding: 20,
      width: '90%',
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : '#000',
      marginBottom: 15,
    },
    bioInput: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ddd',
      borderRadius: 8,
      padding: 12,
      color: isDarkMode ? 'white' : '#000',
      minHeight: 100,
      textAlignVertical: 'top',
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 15,
    },
    modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    cancelButton: {
      backgroundColor: isDarkMode ? '#444' : '#ddd',
    },
    saveButton: {
      backgroundColor: '#0073b1',
    },
    modalButtonText: {
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      fontSize: 14,
    },
    cancelButtonText: {
      color: isDarkMode ? 'white' : '#000',
    },
    saveButtonText: {
      color: 'white',
    },
  })

  const renderHeader = () => (
    <Animated.View entering={FadeInDown.duration(400)}>
      <SpaceBetweenRow style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Tab', { screen: 'Home' })}>
          {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {UserDetails?.UserName || UserDetails?.FullName}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsDrawer')}>
          <GradientIcon
            colors={['#21B7FF', '#0084F8']}
            size={18}
            iconType='Feather'
            name={'settings'}
          />
        </TouchableOpacity>
      </SpaceBetweenRow>
    </Animated.View>
  )

  const renderCoverPhoto = () => (
    <Animated.View 
      entering={FadeIn.duration(500)}
      style={styles.coverPhotoContainer}
    >
      <Image
        source={{
          uri: UserDetails?.CoverImage ||
            'https://images.unsplash.com/photo-1497366216548-37526070297c',
        }}
        style={styles.coverPhoto}
      />

      <Animated.View 
        entering={ZoomIn.duration(400).delay(300)}
        style={styles.profileImageContainer}
      >
        {/* ✅ Profile Image is now user's CAR */}
        <Image
          source={{
            uri: carSpec?.image || UserDetails?.CarImage || 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068',
          }}
          style={styles.profileImage}
        />
        {!route?.params?.userId && (
          <TouchableOpacity
            style={styles.editImageButton}
            onPress={handleCoverImageUpdate}
          >
            <Feather name='camera' size={14} color='white' />
          </TouchableOpacity>
        )}
      </Animated.View>

      {!route?.params?.userId && (
        <TouchableOpacity
          style={{ ...styles.editImageButton, right: 20, bottom: 10 }}
          onPress={handleProfileImageUpdate}
        >
          <Feather name='camera' size={14} color='white' />
        </TouchableOpacity>
      )}
    </Animated.View>
  )
  
  const renderProfileInfo = () => (
    <Animated.View 
      entering={FadeInUp.duration(400).delay(400)}
      style={styles.profileInfoSection}
    >
      <SpaceBetweenRow>
        <View>
          <Text style={styles.profileName}>{UserDetails?.FullName}</Text>
          <Text style={styles.profileUsername}>{UserDetails?.UserName}</Text>
        </View>
        {!route?.params?.userId && (
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleBioUpdate}
          >
            <Text style={styles.editProfileButtonText}>Edit profile</Text>
          </TouchableOpacity>
        )}
         {!route?.params?.userId && (
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={()=>navigation.navigate('AddVehicleSpecs')}
          >
            <Text style={styles.editProfileButtonText}>Add Specs</Text>
          </TouchableOpacity>
        )}
      </SpaceBetweenRow>

      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.statItem}
          onPress={() => navigation.navigate('Followers')}
        >
          <Text style={styles.statNumber}>
            {UserDetails?.Follower?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statItem}
          onPress={() => navigation.navigate('Followings')}
        >
          <Text style={styles.statNumber}>
            {UserDetails?.Following?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Following</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ ACTIVITY STATUS & JOIN DATE WITH TOGGLES */}
      <View style={styles.statusContainer}>
        {selector?.ShowLastActive && (
          <>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              {(() => {
                const now = new Date();
                const lastActive = new Date(selector?.LastActiveAt);
                const diffMs = now - lastActive;
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);
                
                if (diffMins < 1) return 'just now';
                if (diffMins < 60) return `${diffMins}m ago`;
                if (diffHours < 24) return `${diffHours}h ago`;
                if (diffDays < 7) return `${diffDays}d ago`;
                return `${Math.floor(diffDays / 7)}w ago`;
              })()}
            </Text>
          </>
        )}
        {selector?.ShowJoinedDate && (
          <Text style={styles.joinedText}>
            📅 Joined {(() => {
              const joinDate = new Date(selector?.createdAt || '2025-08-05');
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${months[joinDate.getMonth()]} ${joinDate.getDate()}, ${joinDate.getFullYear()}`;
            })()}
          </Text>
        )}
      </View>

      {route?.params?.userId && (
        <Animated.View 
          entering={FadeInUp.duration(300).delay(500)}
          style={styles.actionButtons}
        >
          <TouchableOpacity
            style={styles.followButton}
            onPress={() => sendFollowRequest(UserDetails?._id)}
          >
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={{ color: isDarkMode ? '#ccc' : '#666' }}>•••</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  )

  // ✅ UPDATED: MY SPEC SECTION WITH DYNAMIC DATA
  const renderMySpec = () => {
    // If no car spec exists, show "Add Specs" button
    if (!hasCarSpec || !carSpec) {
      return (
        <Animated.View 
          entering={FadeInUp.duration(400).delay(600)}
          style={styles.mySpecContainer}
        >
          <TouchableOpacity 
            style={styles.addSpecButton}
            onPress={() => navigation.navigate('AddVehicleSpecs')}
          >
            <MaterialCommunityIcons 
              name="car-sports" 
              size={40} 
              color={isDarkMode ? '#404040' : '#ddd'} 
            />
            <Text style={styles.addSpecText}>Add Your Vehicle Specs</Text>
          </TouchableOpacity>
        </Animated.View>
      )
    }

    // If car spec exists, show full details
    return (
      <Animated.View 
        entering={FadeInUp.duration(400).delay(600)}
        style={styles.mySpecContainer}
      >
        {/* Header */}
        <View style={styles.mySpecHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialCommunityIcons 
              name="car-sports" 
              size={20} 
              color={isDarkMode ? '#21B7FF' : '#0084F8'} 
            />
            <Text style={styles.mySpecTitle}>My Spec</Text>
          </View>
          {!route?.params?.userId && (
            <TouchableOpacity 
              style={styles.editSpecButton}
              onPress={handleEditCarSpecs}
            >
              <Feather name="edit-2" size={14} color="#21B7FF" />
              <Text style={styles.editSpecText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Main Specs (Always Visible) */}
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Vehicle</Text>
          <Text style={styles.specValue}>{carSpec.vehicle}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Make</Text>
          <Text style={styles.specValue}>{carSpec.make}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Model</Text>
          <Text style={styles.specValue}>{carSpec.model}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Year</Text>
          <Text style={styles.specValue}>{carSpec.year}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Body Type</Text>
          <Text style={styles.specValue}>{carSpec.bodyType}</Text>
        </View>

        {/* Extended Specs (Show on toggle) */}
        {isSpecExpanded && (
          <Animated.View entering={FadeIn.duration(300)}>
            {/* Power Section */}
            <Text style={styles.specSectionTitle}>⚡ Power</Text>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Engine</Text>
              <Text style={styles.specValue}>{carSpec.engine}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>HP / Torque</Text>
              <Text style={styles.specValue}>{carSpec.hp} / {carSpec.torque}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Drivetrain</Text>
              <Text style={styles.specValue}>{carSpec.drivetrain}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Transmission</Text>
              <Text style={styles.specValue}>{carSpec.transmission}</Text>
            </View>

            {/* Modifications Section */}
            <Text style={styles.specSectionTitle}>🔧 Modifications</Text>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Performance</Text>
              <Text style={styles.specValue}>{carSpec.performanceMods}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Suspension</Text>
              <Text style={styles.specValue}>{carSpec.suspensionMods}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Brakes</Text>
              <Text style={styles.specValue}>{carSpec.brakesMods}</Text>
            </View>

            {/* Style Section */}
            <Text style={styles.specSectionTitle}>🎨 Style</Text>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Paint/Wrap</Text>
              <Text style={styles.specValue}>{carSpec.paintWrap}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Exterior Mods</Text>
              <Text style={styles.specValue}>{carSpec.exteriorMods}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Interior Mods</Text>
              <Text style={styles.specValue}>{carSpec.interiorMods}</Text>
            </View>

            {/* Status Section */}
            <Text style={styles.specSectionTitle}>📊 Status</Text>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Mileage</Text>
              <Text style={styles.specValue}>{carSpec.mileage}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Build Stage</Text>
              <Text style={styles.specValue}>{carSpec.buildStage}</Text>
            </View>

            {/* Owner Note */}
            <Text style={styles.specSectionTitle}>📝 Owner Note</Text>
            <View style={styles.ownerNoteContainer}>
              <Text style={styles.ownerNoteText}>{carSpec.ownerNote}</Text>
            </View>

            {/* Optional Stats */}
            {carSpec.performanceStats && (
              <>
                <Text style={styles.specSectionTitle}>🏁 Performance Stats</Text>
                <View style={styles.specRow}>
                  <Text style={styles.specValue}>{carSpec.performanceStats}</Text>
                </View>
              </>
            )}

            {carSpec.budgetPrice && (
              <>
                <Text style={styles.specSectionTitle}>💰 Budget/Current Price</Text>
                <View style={styles.specRow}>
                  <Text style={styles.specValue}>{carSpec.budgetPrice}</Text>
                </View>
              </>
            )}
          </Animated.View>
        )}

        {/* See More / See Less Button */}
        <TouchableOpacity 
          style={styles.seeMoreButton}
          onPress={() => setIsSpecExpanded(!isSpecExpanded)}
        >
          <Text style={styles.seeMoreText}>
            {isSpecExpanded ? 'See Less' : 'See More'}
          </Text>
          <Feather 
            name={isSpecExpanded ? 'chevron-up' : 'chevron-down'} 
            size={16} 
            color="#21B7FF" 
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const renderTabs = () => (
    <Animated.View 
      entering={FadeIn.duration(300).delay(600)}
      style={styles.tabContainer}
    >
      {[
        { key: 'all', label: 'All posts', icon: 'grid', iconType: 'Feather', width: 75 },
        { key: 'saved', label: 'Saved', icon: 'bookmark', iconType: 'Feather', width: 60 },
        { key: 'tagged', label: 'Tagged', icon: 'user', iconType: 'AntDesign', width: 65 },
        { key: 'Marketplace', label: 'Products', icon: 'storefront', iconType: 'Ionicons', width: 80 }
      ].map((tab) => {
        const isActive = activeTab === tab.key
        const iconColor = isActive 
          ? (isDarkMode ? '#fff' : '#000') 
          : (isDarkMode ? '#888' : '#666')
        
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab.key)}
          >
            {tab.iconType === 'Feather' && (
              <Feather name={tab.icon} size={16} color={iconColor} />
            )}
            {tab.iconType === 'AntDesign' && (
              <AntDesign name={tab.icon} size={16} color={iconColor} />
            )}
            {tab.iconType === 'Ionicons' && (
              <Ionicons name={tab.icon} size={16} color={iconColor} />
            )}
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
            {isActive && (
              <Animated.View 
                entering={ZoomIn.duration(200)}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
              >
                <LinearGradient
                  colors={['#21B7FF', '#0084F8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: 2,
                    width: tab.width,
                    borderRadius: 5,
                  }}
                />
              </Animated.View>
            )}
          </TouchableOpacity>
        )
      })}
    </Animated.View>
  )

  const renderPostsGrid = () => {
    const currentPosts = activeTab === 'all' ? allPosts : 
                        activeTab === 'saved' ? savedPosts : 
                        activeTab === 'tagged' ? taggedPosts :
                        allProducts

    const filteredPosts = activeTab === 'all' 
      ? currentPosts.filter(item => item?.media && !item?.media.toLowerCase().includes('.mp4'))
      : activeTab === 'saved'
      ? currentPosts.filter(item => item?.Post?.media && !item?.Post?.media.toLowerCase().includes('.mp4'))
      : activeTab === 'tagged'
      ? currentPosts.filter(item => item?.media && !item?.media.toLowerCase().includes('.mp4'))
      : currentPosts.filter(item => item?.Image && !item?.Image.toLowerCase().includes('.mp4'))

    if (filteredPosts.length === 0) {
      return (
        <Animated.View 
          entering={FadeIn.duration(400)}
          style={styles.emptyState}
        >
          <Text style={styles.emptyStateText}>
            {activeTab === 'all' ? 'No posts yet' : 
             activeTab === 'saved' ? 'No saved posts' : 
             activeTab === 'tagged' ? 'No tagged posts' :
             'No products found'}
          </Text>
        </Animated.View>
      )
    }

    return (
      <FlatList
        data={filteredPosts}
        numColumns={2}
        renderItem={({ item, index }) => (
          <PostCard
            item={item}
            activeTab={activeTab}
            navigation={navigation}
            index={index}
            isDarkMode={isDarkMode}
          />
        )}
        keyExtractor={item => item?._id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    )
  }

  if (loading) {
    return <ProfileShimmer />
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor='transparent'
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderCoverPhoto()}
        {renderProfileInfo()}
        {/* ✅ MY SPEC SECTION WITH DYNAMIC DATA */}
        {renderMySpec()}
        {renderTabs()}
        <View style={styles.postsContainer}>{renderPostsGrid()}</View>
      </ScrollView>

      {/* Bio Edit Modal */}
      {isBioModalVisible && (
        <Animated.View 
          entering={FadeIn.duration(200)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={() => setBioModalVisible(false)}
            style={styles.modalOverlay}
          >
            <Animated.View 
              entering={ZoomIn.duration(300).springify()}
              style={styles.modalContent}
            >
              <TouchableOpacity activeOpacity={1}>
                <Text style={styles.modalTitle}>Edit Bio</Text>
                <TextInput
                  style={styles.bioInput}
                  value={bioText}
                  onChangeText={setBioText}
                  placeholder='Write your bio...'
                  placeholderTextColor={isDarkMode ? '#999' : '#666'}
                  multiline
                  maxLength={500}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setBioModalVisible(false)}
                  >
                    <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={saveBio}
                  >
                    <Text style={[styles.modalButtonText, styles.saveButtonText]}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setDrawerVisible(false)}
        navigation={navigation}
      /> */}
    </View>
  )
}

export default React.memo(OtherUserDetail)