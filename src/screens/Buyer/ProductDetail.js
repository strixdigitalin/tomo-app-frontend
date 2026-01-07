

// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     TextInput,
//     Image,
//     StyleSheet,
//     TouchableOpacity,
//     StatusBar,
//     ScrollView,
//     FlatList,
//     Dimensions
// } from 'react-native';

// import { useSelector } from 'react-redux';
// import { BackIcon, Search } from '../../assets/SVGs/index';
// import SpaceBetweenRow from '../../components/wrapper/spacebetween';
// import CustomText from '../../components/TextComponent';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import { App_Primary_color } from '../../common/Colors/colors';
// import LinearGradient from 'react-native-linear-gradient';
// import { Text } from 'react-native';
// import { useIsFocused } from '@react-navigation/native';
// import { apiGet } from '../../utils/Apis';
// import useLoader from '../../utils/LoaderHook';
// import urls from '../../config/urls';

// // Sample car images
// const carImages = [
//     { id: '1', image: 'https://picsum.photos/id/111/800/600' }, // dashboard
//     { id: '2', image: 'https://picsum.photos/id/112/800/600' }, // seats
//     { id: '3', image: 'https://picsum.photos/id/133/800/600' }, // speedometer
//     { id: '4', image: 'https://picsum.photos/id/114/800/600' }, // steering wheel
//     { id: '5', image: 'https://picsum.photos/id/115/800/600' }, // full car view
// ];

// // Sample suggested groups
// const suggestedGroups = [
//     {
//         id: '1',
//         name: 'Used Cars for Sale at Hyderabad',
//         members: '163,104 members',
//         image: 'https://picsum.photos/id/133/200/200',
//     },
//     {
//         id: '2',
//         name: 'Deal For Property',
//         members: '22,754 members',
//         image: 'https://picsum.photos/id/134/200/200',
//     },
//     {
//         id: '3',
//         name: 'USED CARS & BIKES',
//         members: '18,911 members',
//         image: 'https://picsum.photos/id/135/200/200',
//     },
// ];

// const windowWidth = Dimensions.get('window').width;

// const ProductDetail = ({ navigation, route }) => {
//     const { isDarkMode } = useSelector(state => state.theme);
//     const [message, setMessage] = useState('Is this still available? 😊');
//     const isFocused = useIsFocused()
//     const [allProducts, setAllProducts] = useState(null)

//     const { showLoader, hideLoader } = useLoader()

//     useEffect(() => {
//         fetchData()
//     }, [isFocused])



//     const fetchData = async () => {
//         try {
//             showLoader()
//             const res = await apiGet(`${urls.productDetails}/${route?.params?.productId}`)
//             console.log("------------Producat detaulsssss-----", res.data);
//             setAllProducts(res?.data)
//             hideLoader()
//         } catch (error) {
//             hideLoader()
//         }


//     }


//     // Sample car data
//     const carData = {
//         title: 'New car lena hai',
//         price: '₹180,000',
//         location: 'Indore, MP',
//         listedTime: 'Listed over a week ago in',
//         description: [
//             'Hyundai Eon 2012',
//             'second owner',
//             '4 tayre good condition',
//             'Touch screen lagi Hui hai',
//             'Pioneer speaker',
//             '2 power window front',
//             'Gear oil engine oil coolant recently change',
//             'Jise Lena Ho vahi message Karen time pass wale dur rahe180,000 final price'
//         ],
//         seller: {
//             name: 'Iqbal Patel',
//             image: 'https://picsum.photos/id/1012/200/200',
//             location: 'Indore'
//         }
//     };

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: isDarkMode ? 'black' : '#f0f2f5',
//         },
//         headerContainer: {
//             backgroundColor: isDarkMode ? '#252525' : 'white',
//             paddingTop: 50,
//             paddingBottom: 10,
//         },
//         searchContainer: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             backgroundColor: isDarkMode ? '#3a3b3c' : '#F0F0F0',
//             borderRadius: 30,
//             margin: 10,
//             paddingVertical: 8,
//             paddingHorizontal: 15,
//         },
//         imageGrid: {
//             width: '100%',
//             height: windowWidth * 0.8,
//         },
//         imageContainer: {
//             flexDirection: 'row',
//             flexWrap: 'wrap',
//             height: '100%',
//         },
//         mainImage: {
//             width: '50%',
//             height: '66.7%',
//             padding: 1,
//         },
//         secondaryImage: {
//             width: '50%',
//             height: '66.7%',
//             padding: 1,
//         },
//         smallImage: {
//             width: '33.3%',
//             height: '33.3%',
//             padding: 1,
//         },
//         plusOverlay: {
//             position: 'absolute',
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0,0,0,0.6)',
//             width: '100%',
//             height: '100%',
//             justifyContent: 'center',
//             alignItems: 'center',
//         },
//         plusText: {
//             color: 'white',
//             fontSize: 24,
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//         },
//         productDetailsContainer: {
//             padding: 16,
//             backgroundColor: isDarkMode ? '#121212' : 'white',
//         },
//         title: {
//             fontSize: 24,
//             fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//             color: isDarkMode ? 'white' : 'black',
//         },
//         price: {
//             fontSize: 26,
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//             color: isDarkMode ? 'white' : 'black',
//             marginTop: 5,
//         },
//         listedInfo: {
//             fontSize: 14,
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             color: isDarkMode ? '#b0b3b8' : '#65676b',
//             marginTop: 5,
//         },
//         messageContainer: {
//             padding: 16,
//             backgroundColor: isDarkMode ? '#121212' : 'white',
//             marginVertical: 8,
//             borderRadius: 12,
//         },
//         messageInput: {
//             padding: 12,
//             backgroundColor: isDarkMode ? '#3a3b3c' : '#f0f2f5',
//             borderRadius: 20,
//             color: isDarkMode ? 'white' : 'black',
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             fontSize: 16,
//             marginBottom: 10,
//         },
//         sendButton: {
//             backgroundColor: App_Primary_color,
//             borderRadius: 6,
//             padding: 14,
//             alignItems: 'center',
//         },
//         sendButtonText: {
//             color: 'white',
//             fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//             fontSize: 16,
//         },
//         actionsContainer: {
//             flexDirection: 'row',
//             justifyContent: 'space-around',
//             paddingVertical: 16,
//             backgroundColor: isDarkMode ? '#121212' : 'white',
//             borderTopWidth: 1,
//             borderBottomWidth: 1,
//             borderColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
//         },
//         actionButton: {
//             alignItems: 'center',
//         },
//         actionCircle: {
//             width: 44,
//             height: 44,
//             borderRadius: 22,
//             backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
//             justifyContent: 'center',
//             alignItems: 'center',
//             marginBottom: 5,
//         },
//         actionText: {
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             color: isDarkMode ? '#e4e6eb' : '#050505',
//             fontSize: 14,
//         },
//         sectionTitle: {
//             fontSize: 20,
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//             color: isDarkMode ? 'white' : 'black',
//             marginVertical: 12,
//         },
//         descriptionText: {
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             color: isDarkMode ? '#e4e6eb' : '#050505',
//             fontSize: 16,
//             lineHeight: 24,
//             marginBottom: 4,
//         },
//         sellerContainer: {
//             backgroundColor: isDarkMode ? '#121212' : 'white',
//             padding: 16,
//             marginTop: 8,
//         },
//         sellerInfoContainer: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             marginBottom: 16,
//         },
//         sellerProfileContainer: {
//             flexDirection: 'row',
//             alignItems: 'center',
//         },
//         sellerImage: {
//             width: 44,
//             height: 44,
//             borderRadius: 22,
//         },
//         sellerName: {
//             fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//             fontSize: 16,
//             color: isDarkMode ? 'white' : 'black',
//             marginLeft: 10,
//         },
//         followButton: {
//             backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
//             paddingHorizontal: 12,
//             paddingVertical: 8,
//             borderRadius: 6,
//             flexDirection: 'row',
//             alignItems: 'center',
//         },
//         followText: {
//             fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//             color: isDarkMode ? 'white' : 'black',
//             marginLeft: 5,
//         },
//         mapContainer: {
//             backgroundColor: isDarkMode ? '#121212' : '#e4e6eb',
//             //   height: 120,
//             borderRadius: 8,
//             marginVertical: 8,
//             justifyContent: 'center',
//             alignItems: 'center',
//         },
//         mapText: {
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//             color: isDarkMode ? 'black' : 'black',
//             fontSize: 16,
//             position: 'absolute'
//         },
//         groupsContainer: {
//             backgroundColor: isDarkMode ? '#121212' : 'white',
//             padding: 16,
//             marginTop: 8,
//         },
//         groupItem: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             marginBottom: 16,
//         },
//         groupInfoContainer: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             flex: 1,
//         },
//         groupImage: {
//             width: 50,
//             height: 50,
//             borderRadius: 4,
//         },
//         groupTextContainer: {
//             marginLeft: 12,
//             flex: 1,
//         },
//         groupName: {
//             fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//             fontSize: 16,
//             color: isDarkMode ? 'white' : 'black',
//         },
//         groupMembers: {
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             color: isDarkMode ? '#b0b3b8' : '#65676b',
//             fontSize: 14,
//         },
//         joinButton: {
//             borderWidth: 1,
//             borderColor: '#1877f2',
//             borderRadius: 6,
//             paddingHorizontal: 20,
//             paddingVertical: 6,
//         },
//         joinText: {
//             fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//             color: '#1877f2',
//             fontSize: 14,
//         },
//         seeAllContainer: {
//             alignItems: 'center',
//             paddingVertical: 10,
//         },
//         seeAllText: {
//             fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//             color: isDarkMode ? '#b0b3b8' : '#65676b',
//             fontSize: 14,
//         },
//         backButton: {
//             flexDirection: 'row',
//             alignItems: 'center',
//         },
//         headerTitle: {
//             fontSize: 16,
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//             color: isDarkMode ? 'white' : 'black',
//             marginLeft: 10,
//         },
//         followButton: {
//             paddingVertical: 6,
//             paddingHorizontal: 16,
//             borderRadius: 8,
//         },
//         followText: {
//             fontSize: 14,
//             fontWeight: '600',
//         },
//     });

//     const renderHeader = () => {
//         return (
//             <View style={styles.headerContainer}>
//                 <SpaceBetweenRow style={{ paddingHorizontal: 20 }}>
//                     <View style={styles.backButton}>
//                         <TouchableOpacity onPress={() => navigation.goBack()}>
//                             <BackIcon />
//                         </TouchableOpacity>
//                         <CustomText style={styles.headerTitle}>{allProducts?.ProductName}</CustomText>
//                     </View>
//                     <TouchableOpacity>
//                         <Search />
//                     </TouchableOpacity>
//                 </SpaceBetweenRow>
//             </View>
//         );
//     };

//     const renderImageGrid = () => {
//         return (
//             <View style={styles.imageGrid}>
//                 <View style={styles.imageContainer}>
//                     <Image source={{ uri: carImages[0].image }} style={styles.mainImage} />
//                     <Image source={{ uri: carImages[1].image }} style={styles.secondaryImage} />
//                     <Image source={{ uri: carImages[2].image }} style={styles.smallImage} />
//                     <Image source={{ uri: carImages[3].image }} style={styles.smallImage} />
//                     <View style={styles.smallImage}>
//                         <Image source={{ uri: carImages[4].image }} style={{ width: '100%', height: '100%' }} />
//                         <View style={styles.plusOverlay}>
//                             <CustomText style={styles.plusText}>+3</CustomText>
//                         </View>
//                     </View>
//                 </View>
//             </View>
//         );
//     };

//     const renderProductDetails = () => {
//         return (
//             <View style={styles.productDetailsContainer}>
//                 <CustomText style={styles.title}>{carData.title}</CustomText>
//                 <CustomText style={styles.price}>{carData.price}</CustomText>
//                 <CustomText style={styles.listedInfo}>
//                     {carData.listedTime} {carData.location}
//                 </CustomText>
//             </View>
//         );
//     };

//     const renderMessageSeller = () => {
//         return (
//             <View style={styles.messageContainer}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
//                     <Image source={{ uri: 'https://picsum.photos/id/237/200/200' }} style={{ width: 24, height: 24, borderRadius: 12 }} />
//                     <CustomText style={{ marginLeft: 8, color: isDarkMode ? 'white' : 'black', fontFamily: FONTS_FAMILY.SourceSans3_SemiBold }}>
//                         Send seller a message
//                     </CustomText>
//                 </View>
//                 <TextInput
//                     style={styles.messageInput}
//                     value={message}
//                     onChangeText={setMessage}
//                     placeholderTextColor={isDarkMode ? '#b0b3b8' : '#65676b'}
//                 />
//                 <TouchableOpacity style={styles.sendButton}>
//                     <CustomText style={styles.sendButtonText}>Send</CustomText>
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     const renderActions = () => {
//         return (
//             <View style={styles.actionsContainer}>
//                 <TouchableOpacity style={styles.actionButton}>
//                     <View style={styles.actionCircle}>
//                         <CustomText style={{ fontSize: 20 }}>🔔</CustomText>
//                     </View>
//                     <CustomText style={styles.actionText}>Alert</CustomText>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.actionButton}>
//                     <View style={styles.actionCircle}>
//                         <CustomText style={{ fontSize: 20 }}>💬</CustomText>
//                     </View>
//                     <CustomText style={styles.actionText}>Message</CustomText>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.actionButton}>
//                     <View style={styles.actionCircle}>
//                         <CustomText style={{ fontSize: 20 }}>🔖</CustomText>
//                     </View>
//                     <CustomText style={styles.actionText}>Save</CustomText>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.actionButton}>
//                     <View style={styles.actionCircle}>
//                         <CustomText style={{ fontSize: 20 }}>⋯</CustomText>
//                     </View>
//                     <CustomText style={styles.actionText}>More</CustomText>
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     const renderDescription = () => {
//         return (
//             <View style={[styles.productDetailsContainer, { marginTop: 8 }]}>
//                 <CustomText style={styles.sectionTitle}>Description</CustomText>
//                 {carData.description.map((line, index) => (
//                     <CustomText key={index} style={styles.descriptionText}>
//                         {line}
//                     </CustomText>
//                 ))}
//             </View>
//         );
//     };

//     const renderSellerInfo = () => {
//         return (
//             <View style={styles.sellerContainer}>
//                 <SpaceBetweenRow style={styles.sellerInfoContainer}>
//                     <View style={styles.sellerProfileContainer}>
//                         <Image source={{ uri: carData.seller.image }} style={styles.sellerImage} />
//                         <CustomText style={styles.sellerName}>{carData.seller.name}</CustomText>
//                     </View>
//                     {/* <TouchableOpacity style={styles.followButton}>
//             <CustomText style={{ fontSize: 16 }}>➕</CustomText>
//             <CustomText style={styles.followText}>Follow</CustomText>
//           </TouchableOpacity> */}
//                     <TouchableOpacity
//                     //  onPress={() => handleFollowToggle(item.id)}
//                     >
//                         <LinearGradient
//                             colors={['#ff00ff', '#6a5acd']}
//                             start={{ x: 1, y: 0 }}
//                             end={{ x: 1, y: 1 }}
//                             style={styles.followButton}
//                         >
//                             <Text style={[
//                                 styles.followText,
//                                 { color: isDarkMode ? '#fff' : '#000' }

//                             ]}>
//                                 {'Follow'}
//                             </Text>
//                         </LinearGradient>
//                     </TouchableOpacity>
//                 </SpaceBetweenRow>
//                 <View style={styles.mapContainer}>
//                     <Image
//                         source={{ uri: 'https://www.mapsofindia.com/maps/madhyapradesh/indore.gif' }}
//                         style={{ height: 150, width: '100%', borderRadius: 7 }}

//                     />
//                     <CustomText style={styles.mapText}>Indore</CustomText>
//                 </View>
//             </View>
//         );
//     };

//     const renderSuggestedGroups = () => {
//         return (
//             <View style={styles.groupsContainer}>
//                 <CustomText style={styles.sectionTitle}>Suggested buy-and-sell shops</CustomText>
//                 {suggestedGroups.map((group) => (
//                     <View key={group.id} style={styles.groupItem}>
//                         <View style={styles.groupInfoContainer}>
//                             <Image source={{ uri: group.image }} style={styles.groupImage} />
//                             <View style={styles.groupTextContainer}>
//                                 <CustomText style={styles.groupName}>{group.name}</CustomText>
//                                 <CustomText style={styles.groupMembers}>{group.members}</CustomText>
//                             </View>
//                         </View>
//                         <TouchableOpacity style={styles.joinButton}>
//                             <CustomText style={styles.joinText}>JOIN</CustomText>
//                         </TouchableOpacity>
//                     </View>
//                 ))}
//                 {/* <TouchableOpacity style={styles.seeAllContainer}>
//           <CustomText style={styles.seeAllText}>See all</CustomText>
//         </TouchableOpacity> */}
//             </View>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             <StatusBar
//                 translucent={true}
//                 backgroundColor="transparent"
//                 barStyle={isDarkMode ? "light-content" : "dark-content"}
//             />

//             {renderHeader()}

//             <ScrollView showsVerticalScrollIndicator={false}>
//                 {renderImageGrid()}
//                 {renderProductDetails()}
//                 {renderMessageSeller()}
//                 {renderActions()}
//                 {renderDescription()}
//                 {renderSellerInfo()}
//                 {renderSuggestedGroups()}
//                 <View style={{ height: 20 }} />
//             </ScrollView>
//         </View>
//     );
// };

// export default ProductDetail;


import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    FlatList,
    Dimensions,
    Modal
} from 'react-native';

import { useSelector } from 'react-redux';
import { BackIcon, Search } from '../../assets/SVGs/index';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { App_Primary_color } from '../../common/Colors/colors';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { apiGet, apiPost } from '../../utils/Apis';
import useLoader from '../../utils/LoaderHook';
import urls from '../../config/urls';
import StarRating from 'react-native-star-rating-widget';

// Sample car images
const carImages = [
    { id: '1', image: 'https://picsum.photos/id/111/800/600' },
    { id: '2', image: 'https://picsum.photos/id/112/800/600' },
    { id: '3', image: 'https://picsum.photos/id/133/800/600' },
    { id: '4', image: 'https://picsum.photos/id/114/800/600' },
    { id: '5', image: 'https://picsum.photos/id/115/800/600' },
];

// Sample suggested groups
const suggestedGroups = [
    {
        id: '1',
        name: 'Used Cars for Sale at Hyderabad',
        members: '163,104 members',
        image: 'https://picsum.photos/id/133/200/200',
    },
    {
        id: '2',
        name: 'Deal For Property',
        members: '22,754 members',
        image: 'https://picsum.photos/id/134/200/200',
    },
    {
        id: '3',
        name: 'USED CARS & BIKES',
        members: '18,911 members',
        image: 'https://picsum.photos/id/135/200/200',
    },
];

const windowWidth = Dimensions.get('window').width;

const ProductDetail = ({ navigation, route }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const [message, setMessage] = useState('Is this still available? 😊');
    const isFocused = useIsFocused()
    const [allProducts, setAllProducts] = useState(null)
    const [reviews, setReviews] = useState([])
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [rating, setRating] = useState(0)
    const [reviewText, setReviewText] = useState('')

    const { showLoader, hideLoader } = useLoader()

    useEffect(() => {
        fetchData()
        fetchReviews()
    }, [isFocused])

    const fetchData = async () => {
        try {
            showLoader()
            const res = await apiGet(`${urls.productDetails}/${route?.params?.productId}`)
            console.log("------------Product details-----", res.data);
            setAllProducts(res?.data)
            hideLoader()
        } catch (error) {
            hideLoader()
        }
    }

    const fetchReviews = async () => {
        try {
            // Replace with your actual reviews endpoint
            const res = await apiGet(`${urls.productReviews}/${route?.params?.productId}`)
            setReviews(res?.data || [])
        } catch (error) {
            console.log("Error fetching reviews:", error)
            // Sample reviews for testing
            setReviews([
                {
                    id: '1',
                    userName: 'John Doe',
                    userImage: 'https://picsum.photos/id/1005/200/200',
                    rating: 4.5,
                    comment: 'Great product! Highly recommend.',
                    date: '2 days ago'
                },
                {
                    id: '2',
                    userName: 'Jane Smith',
                    userImage: 'https://picsum.photos/id/1027/200/200',
                    rating: 5,
                    comment: 'Excellent condition and fast delivery.',
                    date: '1 week ago'
                }
            ])
        }
    }

    const submitReview = async () => {
        if (rating === 0) {
            alert('Please select a rating')
            return
        }
        if (!reviewText.trim()) {
            alert('Please write a review')
            return
        }

        try {
            showLoader()
            // Replace with your actual submit review endpoint
            const res = await apiPost(`${urls.submitReview}`, {
                productId: route?.params?.productId,
                rating: rating,
                comment: reviewText
            })
            
            // Refresh reviews
            await fetchReviews()
            
            // Reset form
            setRating(0)
            setReviewText('')
            setShowReviewModal(false)
            hideLoader()
        } catch (error) {
            hideLoader()
            console.log("Error submitting review:", error)
        }
    }

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
        return (sum / reviews.length).toFixed(1)
    }

    // Sample car data
    const carData = {
        title: 'New car lena hai',
        price: '₹180,000',
        location: 'Indore, MP',
        listedTime: 'Listed over a week ago in',
        description: [
            'Hyundai Eon 2012',
            'second owner',
            '4 tayre good condition',
            'Touch screen lagi Hui hai',
            'Pioneer speaker',
            '2 power window front',
            'Gear oil engine oil coolant recently change',
            'Jise Lena Ho vahi message Karen time pass wale dur rahe180,000 final price'
        ],
        seller: {
            name: 'Iqbal Patel',
            image: 'https://picsum.photos/id/1012/200/200',
            location: 'Indore'
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : '#f0f2f5',
        },
        headerContainer: {
            backgroundColor: isDarkMode ? '#252525' : 'white',
            paddingTop: 50,
            paddingBottom: 10,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#3a3b3c' : '#F0F0F0',
            borderRadius: 30,
            margin: 10,
            paddingVertical: 8,
            paddingHorizontal: 15,
        },
        imageGrid: {
            width: '100%',
            height: windowWidth * 0.8,
        },
        imageContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            height: '100%',
        },
        mainImage: {
            width: '50%',
            height: '66.7%',
            padding: 1,
        },
        secondaryImage: {
            width: '50%',
            height: '66.7%',
            padding: 1,
        },
        smallImage: {
            width: '33.3%',
            height: '33.3%',
            padding: 1,
        },
        plusOverlay: {
            position: 'absolute',
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        plusText: {
            color: 'white',
            fontSize: 24,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        productDetailsContainer: {
            padding: 16,
            backgroundColor: isDarkMode ? '#121212' : 'white',
        },
        title: {
            fontSize: 24,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            color: isDarkMode ? 'white' : 'black',
        },
        price: {
            fontSize: 26,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: isDarkMode ? 'white' : 'black',
            marginTop: 5,
        },
        listedInfo: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#b0b3b8' : '#65676b',
            marginTop: 5,
        },
        messageContainer: {
            padding: 16,
            backgroundColor: isDarkMode ? '#121212' : 'white',
            marginVertical: 8,
            borderRadius: 12,
        },
        messageInput: {
            padding: 12,
            backgroundColor: isDarkMode ? '#3a3b3c' : '#f0f2f5',
            borderRadius: 20,
            color: isDarkMode ? 'white' : 'black',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            fontSize: 16,
            marginBottom: 10,
        },
        sendButton: {
            backgroundColor: App_Primary_color,
            borderRadius: 6,
            padding: 14,
            alignItems: 'center',
        },
        sendButtonText: {
            color: 'white',
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            fontSize: 16,
        },
        actionsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 16,
            backgroundColor: isDarkMode ? '#121212' : 'white',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
        },
        actionButton: {
            alignItems: 'center',
        },
        actionCircle: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 5,
        },
        actionText: {
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#e4e6eb' : '#050505',
            fontSize: 14,
        },
        sectionTitle: {
            fontSize: 20,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: isDarkMode ? 'white' : 'black',
            marginVertical: 12,
        },
        descriptionText: {
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#e4e6eb' : '#050505',
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 4,
        },
        sellerContainer: {
            backgroundColor: isDarkMode ? '#121212' : 'white',
            padding: 16,
            marginTop: 8,
        },
        sellerInfoContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        sellerProfileContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        sellerImage: {
            width: 44,
            height: 44,
            borderRadius: 22,
        },
        sellerName: {
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            fontSize: 16,
            color: isDarkMode ? 'white' : 'black',
            marginLeft: 10,
        },
        followButton: {
            paddingVertical: 6,
            paddingHorizontal: 16,
            borderRadius: 8,
        },
        followText: {
            fontSize: 14,
            fontWeight: '600',
        },
        mapContainer: {
            backgroundColor: isDarkMode ? '#121212' : '#e4e6eb',
            borderRadius: 8,
            marginVertical: 8,
            justifyContent: 'center',
            alignItems: 'center',
        },
        mapText: {
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: isDarkMode ? 'black' : 'black',
            fontSize: 16,
            position: 'absolute'
        },
        groupsContainer: {
            backgroundColor: isDarkMode ? '#121212' : 'white',
            padding: 16,
            marginTop: 8,
        },
        groupItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        groupInfoContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        groupImage: {
            width: 50,
            height: 50,
            borderRadius: 4,
        },
        groupTextContainer: {
            marginLeft: 12,
            flex: 1,
        },
        groupName: {
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            fontSize: 16,
            color: isDarkMode ? 'white' : 'black',
        },
        groupMembers: {
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#b0b3b8' : '#65676b',
            fontSize: 14,
        },
        joinButton: {
            borderWidth: 1,
            borderColor: '#1877f2',
            borderRadius: 6,
            paddingHorizontal: 20,
            paddingVertical: 6,
        },
        joinText: {
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            color: '#1877f2',
            fontSize: 14,
        },
        seeAllContainer: {
            alignItems: 'center',
            paddingVertical: 10,
        },
        seeAllText: {
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            color: isDarkMode ? '#b0b3b8' : '#65676b',
            fontSize: 14,
        },
        backButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: isDarkMode ? 'white' : 'black',
            marginLeft: 10,
        },
        // Reviews Section Styles
        reviewsContainer: {
            backgroundColor: isDarkMode ? '#121212' : 'white',
            padding: 16,
            marginTop: 8,
        },
        reviewsHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        ratingOverview: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        averageRating: {
            fontSize: 32,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: isDarkMode ? 'white' : 'black',
            marginRight: 8,
        },
        ratingCount: {
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#b0b3b8' : '#65676b',
            fontSize: 14,
        },
        addReviewButton: {
            backgroundColor: App_Primary_color,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 6,
        },
        addReviewText: {
            color: 'white',
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            fontSize: 14,
        },
        reviewItem: {
            marginBottom: 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
        },
        reviewHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        reviewUserImage: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
        reviewUserInfo: {
            marginLeft: 12,
            flex: 1,
        },
        reviewUserName: {
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            fontSize: 16,
            color: isDarkMode ? 'white' : 'black',
        },
        reviewDate: {
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#b0b3b8' : '#65676b',
            fontSize: 12,
        },
        reviewComment: {
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#e4e6eb' : '#050505',
            fontSize: 15,
            lineHeight: 22,
            marginTop: 8,
        },
        modalContainer: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            backgroundColor: isDarkMode ? '#252525' : 'white',
            borderRadius: 12,
            padding: 20,
            width: '90%',
            maxHeight: '80%',
        },
        modalTitle: {
            fontSize: 22,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: isDarkMode ? 'white' : 'black',
            marginBottom: 20,
            textAlign: 'center',
        },
        ratingContainer: {
            alignItems: 'center',
            marginBottom: 20,
        },
        ratingLabel: {
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            color: isDarkMode ? 'white' : 'black',
            fontSize: 16,
            marginBottom: 10,
        },
        reviewTextInput: {
            backgroundColor: isDarkMode ? '#3a3b3c' : '#f0f2f5',
            borderRadius: 10,
            padding: 12,
            color: isDarkMode ? 'white' : 'black',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            fontSize: 15,
            minHeight: 120,
            textAlignVertical: 'top',
            marginBottom: 20,
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        modalButton: {
            flex: 1,
            padding: 14,
            borderRadius: 8,
            alignItems: 'center',
            marginHorizontal: 5,
        },
        cancelButton: {
            backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
        },
        submitButton: {
            backgroundColor: App_Primary_color,
        },
        modalButtonText: {
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            fontSize: 16,
        },
    });

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <SpaceBetweenRow style={{ paddingHorizontal: 20 }}>
                    <View style={styles.backButton}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <BackIcon />
                        </TouchableOpacity>
                        <CustomText style={styles.headerTitle}>{allProducts?.ProductName}</CustomText>
                    </View>
                    <TouchableOpacity>
                        <Search />
                    </TouchableOpacity>
                </SpaceBetweenRow>
            </View>
        );
    };

    const renderImageGrid = () => {
        return (
            <View style={styles.imageGrid}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: carImages[0].image }} style={styles.mainImage} />
                    <Image source={{ uri: carImages[1].image }} style={styles.secondaryImage} />
                    <Image source={{ uri: carImages[2].image }} style={styles.smallImage} />
                    <Image source={{ uri: carImages[3].image }} style={styles.smallImage} />
                    <View style={styles.smallImage}>
                        <Image source={{ uri: carImages[4].image }} style={{ width: '100%', height: '100%' }} />
                        <View style={styles.plusOverlay}>
                            <CustomText style={styles.plusText}>+3</CustomText>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderProductDetails = () => {
        return (
            <View style={styles.productDetailsContainer}>
                <CustomText style={styles.title}>{carData.title}</CustomText>
                <CustomText style={styles.price}>{carData.price}</CustomText>
                <CustomText style={styles.listedInfo}>
                    {carData.listedTime} {carData.location}
                </CustomText>
            </View>
        );
    };

    const renderMessageSeller = () => {
        return (
            <View style={styles.messageContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Image source={{ uri: 'https://picsum.photos/id/237/200/200' }} style={{ width: 24, height: 24, borderRadius: 12 }} />
                    <CustomText style={{ marginLeft: 8, color: isDarkMode ? 'white' : 'black', fontFamily: FONTS_FAMILY.SourceSans3_SemiBold }}>
                        Send seller a message
                    </CustomText>
                </View>
                <TextInput
                    style={styles.messageInput}
                    value={message}
                    onChangeText={setMessage}
                    placeholderTextColor={isDarkMode ? '#b0b3b8' : '#65676b'}
                />
                <TouchableOpacity style={styles.sendButton}>
                    <CustomText style={styles.sendButtonText}>Send</CustomText>
                </TouchableOpacity>
            </View>
        );
    };

    const renderActions = () => {
        return (
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                    <View style={styles.actionCircle}>
                        <CustomText style={{ fontSize: 20 }}>🔔</CustomText>
                    </View>
                    <CustomText style={styles.actionText}>Alert</CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <View style={styles.actionCircle}>
                        <CustomText style={{ fontSize: 20 }}>💬</CustomText>
                    </View>
                    <CustomText style={styles.actionText}>Message</CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <View style={styles.actionCircle}>
                        <CustomText style={{ fontSize: 20 }}>🔖</CustomText>
                    </View>
                    <CustomText style={styles.actionText}>Save</CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <View style={styles.actionCircle}>
                        <CustomText style={{ fontSize: 20 }}>⋯</CustomText>
                    </View>
                    <CustomText style={styles.actionText}>More</CustomText>
                </TouchableOpacity>
            </View>
        );
    };

    const renderDescription = () => {
        return (
            <View style={[styles.productDetailsContainer, { marginTop: 8 }]}>
                <CustomText style={styles.sectionTitle}>Description</CustomText>
                {carData.description.map((line, index) => (
                    <CustomText key={index} style={styles.descriptionText}>
                        {line}
                    </CustomText>
                ))}
            </View>
        );
    };

    const renderSellerInfo = () => {
        return (
            <View style={styles.sellerContainer}>
                <SpaceBetweenRow style={styles.sellerInfoContainer}>
                    <View style={styles.sellerProfileContainer}>
                        <Image source={{ uri: carData.seller.image }} style={styles.sellerImage} />
                        <CustomText style={styles.sellerName}>{carData.seller.name}</CustomText>
                    </View>
                    <TouchableOpacity>
                        <LinearGradient
                            colors={['#ff00ff', '#6a5acd']}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.followButton}
                        >
                            <Text style={[
                                styles.followText,
                                { color: isDarkMode ? '#fff' : '#000' }
                            ]}>
                                {'Follow'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </SpaceBetweenRow>
                <View style={styles.mapContainer}>
                    <Image
                        source={{ uri: 'https://www.mapsofindia.com/maps/madhyapradesh/indore.gif' }}
                        style={{ height: 150, width: '100%', borderRadius: 7 }}
                    />
                    <CustomText style={styles.mapText}>Indore</CustomText>
                </View>
            </View>
        );
    };

    const renderReviews = () => {
        return (
            <View style={styles.reviewsContainer}>
                <View style={styles.reviewsHeader}>
                    <View>
                        <CustomText style={styles.sectionTitle}>Reviews & Ratings</CustomText>
                        <View style={styles.ratingOverview}>
                            <CustomText style={styles.averageRating}>
                                {calculateAverageRating()}
                            </CustomText>
                            <View>
                                <StarRating
                                    rating={parseFloat(calculateAverageRating())}
                                    onChange={() => {}}
                                    starSize={20}
                                    color="#FFD700"
                                    enableHalfStar={true}
                                    disabled={true}
                                />
                                <CustomText style={styles.ratingCount}>
                                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                                </CustomText>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.addReviewButton}
                        onPress={() => setShowReviewModal(true)}
                    >
                        <CustomText style={styles.addReviewText}>Write Review</CustomText>
                    </TouchableOpacity>
                </View>

                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <View key={review.id} style={styles.reviewItem}>
                            <View style={styles.reviewHeader}>
                                <Image 
                                    source={{ uri: review.userImage }} 
                                    style={styles.reviewUserImage} 
                                />
                                <View style={styles.reviewUserInfo}>
                                    <CustomText style={styles.reviewUserName}>
                                        {review.userName}
                                    </CustomText>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <StarRating
                                            rating={review.rating}
                                            onChange={() => {}}
                                            starSize={16}
                                            color="#FFD700"
                                            enableHalfStar={true}
                                            disabled={true}
                                        />
                                        <CustomText style={styles.reviewDate}> • {review.date}</CustomText>
                                    </View>
                                </View>
                            </View>
                            <CustomText style={styles.reviewComment}>
                                {review.comment}
                            </CustomText>
                        </View>
                    ))
                ) : (
                    <CustomText style={styles.descriptionText}>
                        No reviews yet. Be the first to review!
                    </CustomText>
                )}
            </View>
        );
    };

    const renderReviewModal = () => {
        return (
            <Modal
                visible={showReviewModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowReviewModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <CustomText style={styles.modalTitle}>Write a Review</CustomText>
                        
                        <View style={styles.ratingContainer}>
                            <CustomText style={styles.ratingLabel}>Your Rating</CustomText>
                            <StarRating
                                rating={rating}
                                onChange={setRating}
                                starSize={40}
                                color="#FFD700"
                                enableHalfStar={false}
                            />
                        </View>

                        <TextInput
                            style={styles.reviewTextInput}
                            placeholder="Share your experience with this product..."
                            placeholderTextColor={isDarkMode ? '#b0b3b8' : '#65676b'}
                            value={reviewText}
                            onChangeText={setReviewText}
                            multiline={true}
                            numberOfLines={5}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setShowReviewModal(false)
                                    setRating(0)
                                    setReviewText('')
                                }}
                            >
                                <CustomText style={[styles.modalButtonText, { color: isDarkMode ? 'white' : 'black' }]}>
                                    Cancel
                                </CustomText>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={submitReview}
                            >
                                <CustomText style={[styles.modalButtonText, { color: 'white' }]}>
                                    Submit
                                </CustomText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    const renderSuggestedGroups = () => {
        return (
            <View style={styles.groupsContainer}>
                <CustomText style={styles.sectionTitle}>Suggested buy-and-sell shops</CustomText>
                {suggestedGroups.map((group) => (
                    <View key={group.id} style={styles.groupItem}>
                        <View style={styles.groupInfoContainer}>
                            <Image source={{ uri: group.image }} style={styles.groupImage} />
                            <View style={styles.groupTextContainer}>
                                <CustomText style={styles.groupName}>{group.name}</CustomText>
                                <CustomText style={styles.groupMembers}>{group.members}</CustomText>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.joinButton}>
                            <CustomText style={styles.joinText}>JOIN</CustomText>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />

            {renderHeader()}

            <ScrollView showsVerticalScrollIndicator={false}>
                {renderImageGrid()}
                {renderProductDetails()}
                {renderMessageSeller()}
                {renderActions()}
                {renderDescription()}
                {renderSellerInfo()}
                {renderReviews()}
                {renderSuggestedGroups()}
                <View style={{ height: 20 }} />
            </ScrollView>

            {renderReviewModal()}
        </View>
    );
};

export default ProductDetail;