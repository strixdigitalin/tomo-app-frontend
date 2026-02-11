// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Splash from '../../screens/Splash/Splash';
// import OnBoarding from '../../screens/Splash/OnBoarding';
// import Login from '../../screens/Auth/Login';
// import SignUp from '../../screens/Auth/Signup';
// import Home from '../../screens/Home/Home';
// import TabNavigation from '../TabNavigation.js/TabNavigation';
// import ChatScreen from '../../screens/Message/ChatScreen';
// import Activity from '../../screens/Activity/Activity';
// import UserDetail from '../../screens/UserDetail/UserDetail';
// import Followers from '../../screens/Followers/Followers';
// import OtherUserDetail from '../../screens/UserDetail/OtherUserDetail';
// import StoryScreen from '../../screens/Home/StoryScreen';
// import RequestBecomSeller from '../../screens/Seller/RequestBecomSeller';
// import Shops from '../../screens/Shops/Shops';
// import AddShops from '../../screens/Shops/AddShops';
// import SavedPosts from '../../screens/Saved/SavedPosts';
// import GalleryPickerScreen from '../../screens/Home/GalleryPicker';
// import GalleryForAddPost from '../../screens/Home/GalleryForAddPost';
// import Follwing from '../../screens/Followers/Following';
// import MarketplaceBuyer from '../../screens/Buyer/BuyerItemList';
// import ProductDetail from '../../screens/Buyer/ProductDetail';
// import PrivacyPolicy from '../../screens/PrivacyPolicy/PrivacyPolicy';
// import TermsAndConditions from '../../screens/PrivacyPolicy/Terms&Conditions';
// import AllProductsOfAShops from '../../screens/Shops/AllProductsOfaShop';
// import CreateProducts from '../../screens/Shops/CreateProduct';
// import AllPostOfAUser from '../../screens/AllPostOfAUser/AllPostOfaUser';
// import FeedBack from '../../screens/Feedback/FeedBack';
// import BoostProduct from '../../screens/Shops/BoostProduct';
// import BoostSuccess from '../../screens/Shops/SuccessBoost';
// import MyPromotions from '../../screens/Shops/MyPromotions';



// const Stack = createNativeStackNavigator();

// const StackNavigation = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Splash"
//         screenOptions={{
//           headerShown: false,
//           cardStyle: { backgroundColor: '#000' },
//         }}>
//         <Stack.Screen name={'Splash'} component={Splash} />
//         <Stack.Screen name={'Onboarding'} component={OnBoarding} />
//         <Stack.Screen name={'Login'} component={Login} />
//         <Stack.Screen name={'Singnup'} component={SignUp} />
//         {/* <Stack.Screen name={'Home'} component={Home} /> */}
//         <Stack.Screen name={'Tab'} component={TabNavigation} />
//         <Stack.Screen name={'Chat'} component={ChatScreen} />
//         <Stack.Screen name={'Activity'} component={Activity} />

//         <Stack.Screen name={'UserDetail'} component={UserDetail} />
//         <Stack.Screen name={'Followers'} component={Followers} />
//         <Stack.Screen name={'Followings'} component={Follwing} />

//         <Stack.Screen name={'OtherUserDetail'} component={OtherUserDetail} />
//         <Stack.Screen name={'StoryScreen'} component={StoryScreen} />

//         <Stack.Screen name={'RequestBecomSeller'} component={RequestBecomSeller} />
//         <Stack.Screen name={'Shops'} component={Shops} />
//         <Stack.Screen name={'AllProductsOfAShops'} component={AllProductsOfAShops} />
//         <Stack.Screen name={'CreateProducts'} component={CreateProducts} />



//         <Stack.Screen name={'AddShops'} component={AddShops} />
//         <Stack.Screen name={'SavedPosts'} component={SavedPosts} />
//         <Stack.Screen name={'GalleryPickerScreen'} component={GalleryPickerScreen} />
//         <Stack.Screen name={'GalleryForAddPost'} component={GalleryForAddPost} />
//         <Stack.Screen name={'MarketplaceBuyer'} component={MarketplaceBuyer} />
//         <Stack.Screen name={'ProductDetail'} component={ProductDetail} />
//         <Stack.Screen name={'PrivacyPolicy'} component={PrivacyPolicy} />
//         <Stack.Screen name={'TermsAndConditions'} component={TermsAndConditions} />
//         <Stack.Screen name={'AllPostOfAUser'} component={AllPostOfAUser} />
//         <Stack.Screen name={'FeedBack'} component={FeedBack} />

//         <Stack.Screen name={'BoostProduct'} component={BoostProduct} />
//         <Stack.Screen name={'BoostSuccess'} component={BoostSuccess} />
//         <Stack.Screen name={'MyPromotions'} component={MyPromotions} />









//         {/* 

//         <Stack.Screen name={'OtpScreen'} component={OtpScreen} />
//         <Stack.Screen name={'FoodDescription'} component={FoodDescription} /> */}

//         {/* FrameWorkDetails */}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default StackNavigation;


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../../screens/Splash/Splash';
import OnBoarding from '../../screens/Splash/OnBoarding';
import Login from '../../screens/Auth/Login';
import SignUp from '../../screens/Auth/Signup';
import Home from '../../screens/Home/Home';
import TabNavigation from '../TabNavigation.js/TabNavigation';
import ChatScreen from '../../screens/Message/ChatScreen';
import Activity from '../../screens/Activity/Activity';
import UserDetail from '../../screens/UserDetail/UserDetail';
import Followers from '../../screens/Followers/Followers';
import OtherUserDetail from '../../screens/UserDetail/OtherUserDetail';
import StoryScreen from '../../screens/Home/StoryScreen';
import RequestBecomSeller from '../../screens/Seller/RequestBecomSeller';
import Shops from '../../screens/Shops/Shops';
import AddShops from '../../screens/Shops/AddShops';
import SavedPosts from '../../screens/Saved/SavedPosts';
import GalleryPickerScreen from '../../screens/Home/GalleryPicker';
import GalleryForAddPost from '../../screens/Home/GalleryForAddPost';
import Follwing from '../../screens/Followers/Following';
import MarketplaceBuyer from '../../screens/Buyer/BuyerItemList';
import ProductDetail from '../../screens/Buyer/ProductDetail';
import PrivacyPolicy from '../../screens/PrivacyPolicy/PrivacyPolicy';
import TermsAndConditions from '../../screens/PrivacyPolicy/Terms&Conditions';
import AllProductsOfAShops from '../../screens/Shops/AllProductsOfaShop';
import CreateProducts from '../../screens/Shops/CreateProduct';
import AllPostOfAUser from '../../screens/AllPostOfAUser/AllPostOfaUser';
import FeedBack from '../../screens/Feedback/FeedBack';
import BoostProduct from '../../screens/Shops/BoostProduct';
import BoostSuccess from '../../screens/Shops/SuccessBoost';
import MyPromotions from '../../screens/Shops/MyPromotions';
import PostDetailScreen from '../../screens/Home/PostDetailScreen';
import CommentsScreen from '../../screens/Home/CommentScreen';
import SettingsDrawerScreen from '../../components/DrawerModal';
import ReactNativeChatbot from '../../screens/Message/ChatBot';
import ReportScreen from '../../screens/Home/ReportPostScreen';
import AddVehicleSpecs from '../../screens/UserDetail/AddSpecs';
import Settings from '../../screens/PrivacyPolicy/Settings';
import ThemeSettings from '../../screens/PrivacyPolicy/ThemeSettingScreen';
import ChooseMusicScreen from '../../screens/UserDetail/SelectSongs';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' },
          // Premium animation options
          animation: 'default', // Change karke dekho: 'slide_from_right', 'slide_from_bottom', 'fade', 'fade_from_bottom', 'flip'

          // Custom transition config
          customAnimationOnGesture: true,
          fullScreenGestureEnabled: true,
          gestureEnabled: true,

          // Smooth transitions
          animationTypeForReplace: 'push',

          // Custom animation timing
          transitionSpec: {
            open: {
              animation: 'spring',
              config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 200,
              },
            },
          },
        }}>

        {/* Auth Screens - Fade animation */}
        <Stack.Screen
          name={'Splash'}
          component={Splash}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name={'Onboarding'}
          component={OnBoarding}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name={'Login'}
          component={Login}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name={'Singnup'}
          component={SignUp}
          options={{
            animation: 'slide_from_right',
          }}
        />

        {/* Main App - Default animation */}
        <Stack.Screen
          name={'Tab'}
          component={TabNavigation}
          options={{
            animation: 'fade',
          }}
        />

        {/* Modal Style Screens - Bottom slide */}
        <Stack.Screen
          name={'Chat'}
          component={ChatScreen}
          options={{
            animation: 'slide_from_right',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name={'Activity'}
          component={Activity}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'transparentModal',
          }}

        />

        {/* User Related Screens */}
        <Stack.Screen
          name={'UserDetail'}
          component={UserDetail}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name={'Followers'}
          component={Followers}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name={'Followings'}
          component={Follwing}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name={'OtherUserDetail'}
          component={OtherUserDetail}
          options={{
            animation: 'slide_from_right',
          }}
        />

        {/* Story Screen - Full screen modal */}
        <Stack.Screen
          name={'StoryScreen'}
          component={StoryScreen}
          options={{
            animation: 'fade',
            presentation: 'transparentModal',
          }}
        />

        {/* Seller & Shop Screens */}
        <Stack.Screen
          name={'RequestBecomSeller'}
          component={RequestBecomSeller}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name={'Shops'}
          component={Shops}
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="PostDetail"
          component={PostDetailScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }}
        />


        <Stack.Screen
          name="Comments"
          component={CommentsScreen}
          options={{
            headerShown: false,
            presentation: 'transparentModal', // ✅ Modal jaisa dikhega
            animation: 'slide_from_bottom',
            cardStyle: { backgroundColor: 'transparent' },
          }}
        />

        <Stack.Screen
          name="SettingsDrawer"
          component={SettingsDrawerScreen}
          options={{
            headerShown: false,
            presentation: 'transparentModal', // ✅ Transparent background
            animation: 'slide_from_right', // ✅ Slide from right
            cardStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name={'AllProductsOfAShops'}
          component={AllProductsOfAShops}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name={'CreateProducts'}
          component={CreateProducts}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name={'AddShops'}
          component={AddShops}
          options={{
            animation: 'slide_from_bottom',
          }}
        />

        {/* Gallery & Media Screens */}
        <Stack.Screen
          name={'SavedPosts'}
          component={SavedPosts}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name={'GalleryPickerScreen'}
          component={GalleryPickerScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name={'GalleryForAddPost'}
          component={GalleryForAddPost}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name={'AllPostOfAUser'}
          component={AllPostOfAUser}
          options={{
            animation: 'slide_from_right',
          }}
        />

        {/* Marketplace Screens */}
        <Stack.Screen
          name={'MarketplaceBuyer'}
          component={MarketplaceBuyer}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name={'ProductDetail'}
          component={ProductDetail}
          options={{
            animation: 'slide_from_right',
          }}
        />
 <Stack.Screen
          name={'ReportScreen'}
          component={ReportScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        

        {/* Boost & Promotion Screens */}
        <Stack.Screen
          name={'BoostProduct'}
          component={BoostProduct}
          options={{
            animation: 'slide_from_bottom',
          }}
        />

          <Stack.Screen
          name={'AddVehicleSpecs'}
          component={AddVehicleSpecs}
          options={{
            animation: 'slide_from_bottom',
          }}
        />

        

          <Stack.Screen
          name={'Settings'}
          component={Settings}
          // options={{
          //   animation: 'right',
          // }}
        />

        

           <Stack.Screen
          name={'ThemeSettings'}
          component={ThemeSettings}
          // options={{
          //   animation: 'right',
          // }}
        />

        
        <Stack.Screen
          name={'BoostSuccess'}
          component={BoostSuccess}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name={'MyPromotions'}
          component={MyPromotions}
          options={{
            animation: 'slide_from_right',
          }}
        />

        {/* Info Screens */}
        <Stack.Screen
          name={'PrivacyPolicy'}
          component={PrivacyPolicy}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name={'TermsAndConditions'}
          component={TermsAndConditions}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name={'FeedBack'}
          component={FeedBack}
          options={{
            animation: 'slide_from_bottom',
          }}
        />

          <Stack.Screen
          name={'ReactNativeChatbot'}
          component={ReactNativeChatbot}
          options={{
            animation: 'slide_from_bottom',
          }}
        />

        

         <Stack.Screen
          name={'ChooseMusicScreen'}
          component={ChooseMusicScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;