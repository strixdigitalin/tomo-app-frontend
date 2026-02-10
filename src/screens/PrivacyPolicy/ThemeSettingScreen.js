// import React, { useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   StatusBar,
//   ScrollView,
//   Switch,
//   Image,
// } from 'react-native';

// import { useSelector } from 'react-redux';
// import SpaceBetweenRow from '../../components/wrapper/spacebetween';
// import { PrimaryBackArrow, PrimaryBackWhite } from '../../assets/SVGs';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import CustomText from '../../components/TextComponent';
// import Slider from '@react-native-community/slider';

// const ThemeSettings = ({ navigation }) => {
//   const { isDarkMode } = useSelector(state => state.theme);

  
//   // Static states - baad me context/redux se connect karenge
//   const [selectedTheme, setSelectedTheme] = useState('default');
//   const [nightMode, setNightMode] = useState(isDarkMode);
//   const [messageCornerRadius, setMessageCornerRadius] = useState(12);
//   const [feedListView, setFeedListView] = useState('two-lines'); // 'two-lines' or 'three-lines'

//   // Pre-defined color themes (WhatsApp jaisa)
//   const colorThemes = [
//     { id: 'default', name: 'Default', icon: '🏠', primary: '#1877f2', bg: '#E8F5E9' },
//     { id: 'nature', name: 'Nature', icon: '🌿', primary: '#4CAF50', bg: '#C8E6C9' },
//     { id: 'ocean', name: 'Ocean', icon: '🌊', primary: '#03A9F4', bg: '#B3E5FC' },
//     { id: 'sunset', name: 'Sunset', icon: '🌅', primary: '#FF9800', bg: '#FFE0B2' },
//     { id: 'royal', name: 'Royal', icon: '💎', primary: '#9C27B0', bg: '#E1BEE7' },
//   ];

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? 'black' : '#f0f2f5',
//     },
//     headerContainer: {
//       backgroundColor: isDarkMode ? '#252525' : 'white',
//       paddingTop: 50,
//       paddingBottom: 15,
//     },
//     backButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     headerTitle: {
//       fontSize: 20,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : 'black',
//       marginLeft: 10,
//     },
    
//     // Section Styles
//     section: {
//       marginTop: 16,
//       marginBottom: 8,
//     },
//     sectionTitle: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? '#1877f2' : '#1877f2',
//       marginBottom: 12,
//       paddingHorizontal: 16,
//       textTransform: 'uppercase',
//       letterSpacing: 0.5,
//     },
    
//     // Setting Card Styles
//     settingCard: {
//       backgroundColor: isDarkMode ? '#252525' : 'white',
//       paddingVertical: 16,
//       paddingHorizontal: 16,
//       marginHorizontal: 16,
//       marginBottom: 8,
//       borderRadius: 12,
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     settingIcon: {
//       width: 40,
//       height: 40,
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginRight: 12,
//     },
//     settingText: {
//       flex: 1,
//       fontSize: 16,
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       color: isDarkMode ? 'white' : 'black',
//     },
//     settingSubText: {
//       fontSize: 13,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#b0b3b8' : '#65676b',
//       marginTop: 2,
//     },
//     arrowIcon: {
//       fontSize: 20,
//       color: isDarkMode ? '#b0b3b8' : '#65676b',
//     },
    
//     // Color Theme Grid
//     colorThemeContainer: {
//       paddingHorizontal: 16,
//     },
//     colorThemeScroll: {
//       paddingVertical: 8,
//     },
//     colorThemeCard: {
//       width: 110,
//       height: 110,
//       borderRadius: 12,
//       marginRight: 12,
//       overflow: 'hidden',
//       position: 'relative',
//       borderWidth: 3,
//     },
//     colorThemeSelected: {
//       borderColor: '#1877f2',
//     },
//     colorThemeUnselected: {
//       borderColor: 'transparent',
//     },
//     themeBackground: {
//       flex: 1,
//       padding: 12,
//       justifyContent: 'center',
//     },
//     themeBubble: {
//       height: 28,
//       borderRadius: 12,
//       marginVertical: 4,
//       width: '75%',
//     },
//     themeBubbleLight: {
//       backgroundColor: '#FFFFFF',
//     },
//     themeBubblePrimary: {
//       alignSelf: 'flex-end',
//     },
//     themeIcon: {
//       position: 'absolute',
//       bottom: 8,
//       left: 8,
//       fontSize: 26,
//     },
//     themeName: {
//       textAlign: 'center',
//       fontSize: 12,
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       color: isDarkMode ? 'white' : 'black',
//       marginTop: 6,
//     },
    
//     // Slider Styles
//     sliderCard: {
//       backgroundColor: isDarkMode ? '#252525' : 'white',
//       paddingVertical: 20,
//       paddingHorizontal: 16,
//       marginHorizontal: 16,
//       marginBottom: 8,
//       borderRadius: 12,
//     },
//     sliderContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginTop: 8,
//     },
//     slider: {
//       flex: 1,
//       height: 40,
//     },
//     sliderValue: {
//       marginLeft: 12,
//       fontSize: 16,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : 'black',
//       minWidth: 35,
//       textAlign: 'center',
//     },
    
//     // Preview Card
//     previewCard: {
//       backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
//       padding: 16,
//       marginTop: 12,
//       borderRadius: 12,
//     },
//     previewBubble: {
//       padding: 12,
//       alignSelf: 'flex-start',
//       maxWidth: '70%',
//       backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
//     },
//     previewText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? 'white' : 'black',
//     },
    
//     // List View Options
//     listViewOptions: {
//       flexDirection: 'row',
//       paddingHorizontal: 16,
//       gap: 12,
//     },
//     listViewOption: {
//       flex: 1,
//       backgroundColor: isDarkMode ? '#252525' : 'white',
//       padding: 16,
//       borderRadius: 12,
//       alignItems: 'center',
//       borderWidth: 2,
//     },
//     listViewSelected: {
//       borderColor: '#1877f2',
//     },
//     listViewUnselected: {
//       borderColor: 'transparent',
//     },
//     listViewPreview: {
//       flexDirection: 'row',
//       alignItems: 'flex-start',
//       width: '100%',
//       marginBottom: 12,
//       paddingHorizontal: 8,
//     },
//     listViewAvatar: {
//       width: 36,
//       height: 36,
//       borderRadius: 18,
//       backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
//       marginRight: 10,
//     },
//     listViewContent: {
//       flex: 1,
//     },
//     listViewLine: {
//       height: 8,
//       borderRadius: 4,
//       backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
//       marginVertical: 3,
//     },
//     listViewLabel: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       color: isDarkMode ? 'white' : 'black',
//       marginTop: 8,
//     },
    
//     // Divider
//     divider: {
//       height: 1,
//       backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
//       marginVertical: 20,
//       marginHorizontal: 16,
//     },
//   });

//   const renderHeader = () => {
//     return (
//       <View style={styles.headerContainer}>
//         <SpaceBetweenRow style={{ paddingHorizontal: 20 }}>
//           <View style={styles.backButton}>
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
//             </TouchableOpacity>
//             <CustomText style={styles.headerTitle}>Theme Settings</CustomText>
//           </View>
//         </SpaceBetweenRow>
//       </View>
//     );
//   };

//   const renderColorThemeCard = (theme) => {
//     const isSelected = selectedTheme === theme.id;
    
//     return (
//       <TouchableOpacity
//         key={theme.id}
//         onPress={() => setSelectedTheme(theme.id)}
//         activeOpacity={0.7}
//       >
//         <View
//           style={[
//             styles.colorThemeCard,
//             isSelected ? styles.colorThemeSelected : styles.colorThemeUnselected,
//           ]}
//         >
//           <View style={[styles.themeBackground, { backgroundColor: theme.bg }]}>
//             <View style={[styles.themeBubble, styles.themeBubbleLight]} />
//             <View
//               style={[
//                 styles.themeBubble,
//                 styles.themeBubblePrimary,
//                 { backgroundColor: theme.primary },
//               ]}
//             />
//           </View>
//           <CustomText style={styles.themeIcon}>{theme.icon}</CustomText>
//         </View>
//         <CustomText style={styles.themeName}>{theme.name}</CustomText>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent={true}
//         backgroundColor="transparent"
//         barStyle={isDarkMode ? "light-content" : "dark-content"}
//       />
      
//       {renderHeader()}
      
//       <ScrollView showsVerticalScrollIndicator={false}>
        
//         {/* Appearance Section */}
//         <View style={styles.section}>
//           <CustomText style={styles.sectionTitle}>Appearance</CustomText>
          
//           {/* Change Wallpaper */}
//           <TouchableOpacity
//             style={styles.settingCard}
//             onPress={() => {
//               // Image picker logic baad me implement karenge
//             //   console.log('Change Wallpaper');
//             }}
//           >
//             <View style={styles.settingIcon}>
//               <CustomText style={{ fontSize: 24 }}>🖼️</CustomText>
//             </View>
//             <CustomText style={styles.settingText}>Change App Wallpaper</CustomText>
//             <CustomText style={styles.arrowIcon}>→</CustomText>
//           </TouchableOpacity>
          
//           {/* Change Accent Color */}
//           <TouchableOpacity
//             style={styles.settingCard}
//             onPress={() => {
//               console.log('Change Accent Color');
//             }}
//           >
//             <View style={styles.settingIcon}>
//               <CustomText style={{ fontSize: 24 }}>🎨</CustomText>
//             </View>
//             <View style={{ flex: 1 }}>
//               <CustomText style={styles.settingText}>Change Accent Color</CustomText>
//               <CustomText style={styles.settingSubText}>
//                 Choose primary color for your app
//               </CustomText>
//             </View>
//             <View
//               style={{
//                 width: 24,
//                 height: 24,
//                 borderRadius: 12,
//                 backgroundColor: colorThemes.find(t => t.id === selectedTheme)?.primary || '#1877f2',
//               }}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Color Theme Section */}
//         <View style={styles.section}>
//           <CustomText style={styles.sectionTitle}>Color theme</CustomText>
          
//           <View style={styles.colorThemeContainer}>
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.colorThemeScroll}
//             >
//               {colorThemes.map(theme => renderColorThemeCard(theme))}
//             </ScrollView>
//           </View>
//         </View>

//         {/* Night Mode Toggle */}
//         <TouchableOpacity
//           style={[styles.settingCard, { marginTop: 16 }]}
//           onPress={() => setNightMode(!nightMode)}
//           activeOpacity={0.7}
//         >
//           <View style={styles.settingIcon}>
//             <CustomText style={{ fontSize: 24 }}>🌙</CustomText>
//           </View>
//           <CustomText style={styles.settingText}>
//             {nightMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
//           </CustomText>
//           <Switch
//             value={nightMode}
//             onValueChange={setNightMode}
//             trackColor={{ 
//               false: isDarkMode ? '#3a3b3c' : '#e4e6eb', 
//               true: '#1877f2' 
//             }}
//             thumbColor={'#ffffff'}
//           />
//         </TouchableOpacity>

//         {/* Browse Themes */}
//         <TouchableOpacity
//           style={styles.settingCard}
//           onPress={() => {
//             console.log('Browse More Themes');
//           }}
//         >
//           <View style={styles.settingIcon}>
//             <CustomText style={{ fontSize: 24 }}>🎭</CustomText>
//           </View>
//           <View style={{ flex: 1 }}>
//             <CustomText style={styles.settingText}>Browse Themes</CustomText>
//             <CustomText style={styles.settingSubText}>
//               Discover more beautiful themes
//             </CustomText>
//           </View>
//           <CustomText style={styles.arrowIcon}>→</CustomText>
//         </TouchableOpacity>

//         <View style={styles.divider} />

//         {/* Message Corners Section */}
//         <View style={styles.section}>
//           <CustomText style={styles.sectionTitle}>Message corners</CustomText>
          
//           <View style={styles.sliderCard}>
//             <View style={styles.sliderContainer}>
//               <Slider
//                 style={styles.slider}
//                 minimumValue={4}
//                 maximumValue={24}
//                 step={1}
//                 value={messageCornerRadius}
//                 onValueChange={setMessageCornerRadius}
//                 minimumTrackTintColor="#1877f2"
//                 maximumTrackTintColor={isDarkMode ? '#3a3b3c' : '#e4e6eb'}
//                 thumbTintColor="#1877f2"
//               />
//               <CustomText style={styles.sliderValue}>
//                 {Math.round(messageCornerRadius)}
//               </CustomText>
//             </View>
            
//             {/* Preview */}
//             <View style={styles.previewCard}>
//               <View
//                 style={[
//                   styles.previewBubble,
//                   { borderRadius: messageCornerRadius },
//                 ]}
//               >
//                 <CustomText style={styles.previewText}>
//                   Preview message bubble
//                 </CustomText>
//               </View>
//             </View>
//           </View>
//         </View>

//         <View style={styles.divider} />

//         {/* Feed List View Section */}
//         <View style={styles.section}>
//           <CustomText style={styles.sectionTitle}>Feed list view</CustomText>
          
//           <View style={styles.listViewOptions}>
//             {/* Two Lines Option */}
//             <TouchableOpacity
//               style={[
//                 styles.listViewOption,
//                 feedListView === 'two-lines'
//                   ? styles.listViewSelected
//                   : styles.listViewUnselected,
//               ]}
//               onPress={() => setFeedListView('two-lines')}
//               activeOpacity={0.7}
//             >
//               <View style={styles.listViewPreview}>
//                 <View style={styles.listViewAvatar} />
//                 <View style={styles.listViewContent}>
//                   <View style={styles.listViewLine} />
//                   <View style={[styles.listViewLine, { width: '60%' }]} />
//                 </View>
//               </View>
//               <CustomText style={styles.listViewLabel}>Two lines</CustomText>
//             </TouchableOpacity>

//             {/* Three Lines Option */}
//             <TouchableOpacity
//               style={[
//                 styles.listViewOption,
//                 feedListView === 'three-lines'
//                   ? styles.listViewSelected
//                   : styles.listViewUnselected,
//               ]}
//               onPress={() => setFeedListView('three-lines')}
//               activeOpacity={0.7}
//             >
//               <View style={styles.listViewPreview}>
//                 <View style={styles.listViewAvatar} />
//                 <View style={styles.listViewContent}>
//                   <View style={styles.listViewLine} />
//                   <View style={styles.listViewLine} />
//                   <View style={[styles.listViewLine, { width: '40%' }]} />
//                 </View>
//               </View>
//               <CustomText style={styles.listViewLabel}>Three lines</CustomText>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Bottom Spacing */}
//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </View>
//   );
// };

// export default ThemeSettings;




// screens/settings/ThemeSettings.js
// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   StatusBar,
//   ScrollView,
//   Switch,
// } from 'react-native';

// import { useSelector } from 'react-redux';
// import SpaceBetweenRow from '../../components/wrapper/spacebetween';
// import { PrimaryBackArrow, PrimaryBackWhite } from '../../assets/SVGs';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import CustomText from '../../components/TextComponent';
// import Slider from '@react-native-community/slider';
// import { 
//   updateColorTheme, 
//   updateMessageCornerRadius, 
//   updateFeedListView,
//   setSpecificTheme 
// } from '../../redux/actions/themeActions';
// import { THEMES } from '../../redux/reducer/theme';

// const ThemeSettings = ({ navigation }) => {
//   const { 
//     isDarkMode, 
//     selectedColorTheme, 
//     messageCornerRadius, 
//     feedListView 
//   } = useSelector(state => state.theme);

//   console.log('--------------------------------------',selectedColorTheme);
  

//   // Convert THEMES object to array
//   const colorThemes = Object.entries(THEMES).map(([id, data]) => ({
//     id,
//     name: data.name,
//     icon: getThemeIcon(id),
//     primary: data.primary,
//     bg: data.secondary,
//   }));



//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? 'black' : '#f0f2f5',
//     },
//     headerContainer: {
//       backgroundColor: isDarkMode ? '#252525' : 'white',
//       paddingTop: 50,
//       paddingBottom: 15,
//     },
//     backButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     headerTitle: {
//       fontSize: 20,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : 'black',
//       marginLeft: 10,
//     },
    
//     section: {
//       marginTop: 16,
//       marginBottom: 8,
//     },
//     sectionTitle: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? '#1877f2' : '#1877f2',
//       marginBottom: 12,
//       paddingHorizontal: 16,
//       textTransform: 'uppercase',
//       letterSpacing: 0.5,
//     },
    
//     settingCard: {
//       backgroundColor: isDarkMode ? '#252525' : 'white',
//       paddingVertical: 16,
//       paddingHorizontal: 16,
//       marginHorizontal: 16,
//       marginBottom: 8,
//       borderRadius: 12,
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     settingIcon: {
//       width: 40,
//       height: 40,
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginRight: 12,
//     },
//     settingText: {
//       flex: 1,
//       fontSize: 16,
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       color: isDarkMode ? 'white' : 'black',
//     },
//     settingSubText: {
//       fontSize: 13,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#b0b3b8' : '#65676b',
//       marginTop: 2,
//     },
//     arrowIcon: {
//       fontSize: 20,
//       color: isDarkMode ? '#b0b3b8' : '#65676b',
//     },
    
//     colorThemeContainer: {
//       paddingHorizontal: 16,
//     },
//     colorThemeScroll: {
//       paddingVertical: 8,
//     },
//     colorThemeCard: {
//       width: 110,
//       height: 110,
//       borderRadius: 12,
//       marginRight: 12,
//       overflow: 'hidden',
//       position: 'relative',
//       borderWidth: 3,
//     },
//     colorThemeSelected: {
//       borderColor: '#1877f2',
//     },
//     colorThemeUnselected: {
//       borderColor: 'transparent',
//     },
//     themeBackground: {
//       flex: 1,
//       padding: 12,
//       justifyContent: 'center',
//     },
//     themeBubble: {
//       height: 28,
//       borderRadius: 12,
//       marginVertical: 4,
//       width: '75%',
//     },
//     themeBubbleLight: {
//       backgroundColor: '#FFFFFF',
//     },
//     themeBubblePrimary: {
//       alignSelf: 'flex-end',
//     },
//     themeIcon: {
//       position: 'absolute',
//       bottom: 8,
//       left: 8,
//       fontSize: 26,
//     },
//     themeName: {
//       textAlign: 'center',
//       fontSize: 12,
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       color: isDarkMode ? 'white' : 'black',
//       marginTop: 6,
//     },
    
//     sliderCard: {
//       backgroundColor: isDarkMode ? '#252525' : 'white',
//       paddingVertical: 20,
//       paddingHorizontal: 16,
//       marginHorizontal: 16,
//       marginBottom: 8,
//       borderRadius: 12,
//     },
//     sliderContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginTop: 8,
//     },
//     slider: {
//       flex: 1,
//       height: 40,
//     },
//     sliderValue: {
//       marginLeft: 12,
//       fontSize: 16,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : 'black',
//       minWidth: 35,
//       textAlign: 'center',
//     },
    
//     previewCard: {
//       backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
//       padding: 16,
//       marginTop: 12,
//       borderRadius: 12,
//     },
//     previewBubble: {
//       padding: 12,
//       alignSelf: 'flex-start',
//       maxWidth: '70%',
//       backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
//     },
//     previewText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? 'white' : 'black',
//     },
    
//     listViewOptions: {
//       flexDirection: 'row',
//       paddingHorizontal: 16,
//       gap: 12,
//     },
//     listViewOption: {
//       flex: 1,
//       backgroundColor: isDarkMode ? '#252525' : 'white',
//       padding: 16,
//       borderRadius: 12,
//       alignItems: 'center',
//       borderWidth: 2,
//     },
//     listViewSelected: {
//       borderColor: '#1877f2',
//     },
//     listViewUnselected: {
//       borderColor: 'transparent',
//     },
//     listViewPreview: {
//       flexDirection: 'row',
//       alignItems: 'flex-start',
//       width: '100%',
//       marginBottom: 12,
//       paddingHorizontal: 8,
//     },
//     listViewAvatar: {
//       width: 36,
//       height: 36,
//       borderRadius: 18,
//       backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
//       marginRight: 10,
//     },
//     listViewContent: {
//       flex: 1,
//     },
//     listViewLine: {
//       height: 8,
//       borderRadius: 4,
//       backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
//       marginVertical: 3,
//     },
//     listViewLabel: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       color: isDarkMode ? 'white' : 'black',
//       marginTop: 8,
//     },
    
//     divider: {
//       height: 1,
//       backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
//       marginVertical: 20,
//       marginHorizontal: 16,
//     },
//   });

//   const renderHeader = () => {
//     return (
//       <View style={styles.headerContainer}>
//         <SpaceBetweenRow style={{ paddingHorizontal: 20 }}>
//           <View style={styles.backButton}>
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
//             </TouchableOpacity>
//             <CustomText style={styles.headerTitle}>Theme Settings</CustomText>
//           </View>
//         </SpaceBetweenRow>
//       </View>
//     );
//   };

//   const renderColorThemeCard = (theme) => {
//     const isSelected = selectedColorTheme === theme.id;
    
//     return (
//       <TouchableOpacity
//         key={theme.id}
//         onPress={() => updateColorTheme(theme.id)} // ✅ Redux action
//         activeOpacity={0.7}
//       >
//         <View
//           style={[
//             styles.colorThemeCard,
//             isSelected ? styles.colorThemeSelected : styles.colorThemeUnselected,
//           ]}
//         >
//           <View style={[styles.themeBackground, { backgroundColor: theme.bg }]}>
//             <View style={[styles.themeBubble, styles.themeBubbleLight]} />
//             <View
//               style={[
//                 styles.themeBubble,
//                 styles.themeBubblePrimary,
//                 { backgroundColor: theme.primary },
//               ]}
//             />
//           </View>
//           <CustomText style={styles.themeIcon}>{theme.icon}</CustomText>
//         </View>
//         <CustomText style={styles.themeName}>{theme.name}</CustomText>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent={true}
//         backgroundColor="transparent"
//         barStyle={isDarkMode ? "light-content" : "dark-content"}
//       />
      
//       {renderHeader()}
      
//       <ScrollView showsVerticalScrollIndicator={false}>
        
//         {/* Appearance Section */}
//         <View style={styles.section}>
//           <CustomText style={styles.sectionTitle}>Appearance</CustomText>
          
//           {/* Change Accent Color */}
//           <TouchableOpacity
//             style={styles.settingCard}
//             onPress={() => {
//               console.log('Change Accent Color');
//             }}
//           >
//             <View style={styles.settingIcon}>
//               <CustomText style={{ fontSize: 24 }}>🎨</CustomText>
//             </View>
//             <View style={{ flex: 1 }}>
//               <CustomText style={styles.settingText}>Change Accent Color</CustomText>
//               <CustomText style={styles.settingSubText}>
//                 Choose primary color for your app
//               </CustomText>
//             </View>
//             <View
//               style={{
//                 width: 24,
//                 height: 24,
//                 borderRadius: 12,
//                 backgroundColor: THEMES[selectedColorTheme]?.primary || '#1877f2',
//               }}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Color Theme Section */}
//         <View style={styles.section}>
//           <CustomText style={styles.sectionTitle}>Color theme</CustomText>
          
//           <View style={styles.colorThemeContainer}>
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.colorThemeScroll}
//             >
//               {colorThemes.map(theme => renderColorThemeCard(theme))}
//             </ScrollView>
//           </View>
//         </View>

//         {/* Night Mode Toggle */}
//         <TouchableOpacity
//           style={[styles.settingCard, { marginTop: 16 }]}
//           onPress={() => setSpecificTheme(!isDarkMode)} // ✅ Redux action
//           activeOpacity={0.7}
//         >
//           <View style={styles.settingIcon}>
//             <CustomText style={{ fontSize: 24 }}>🌙</CustomText>
//           </View>
//           <CustomText style={styles.settingText}>
//             {isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
//           </CustomText>
//           <Switch
//             value={isDarkMode}
//             onValueChange={(value) => setSpecificTheme(value)} // ✅ Redux action
//             trackColor={{ 
//               false: isDarkMode ? '#3a3b3c' : '#e4e6eb', 
//               true: '#1877f2' 
//             }}
//             thumbColor={'#ffffff'}
//           />
//         </TouchableOpacity>

//         <View style={styles.divider} />

//         {/* Message Corners Section */}
//         <View style={styles.section}>
//           <CustomText style={styles.sectionTitle}>Message corners</CustomText>
          
//           <View style={styles.sliderCard}>
//             <View style={styles.sliderContainer}>
//               <Slider
//                 style={styles.slider}
//                 minimumValue={4}
//                 maximumValue={24}
//                 step={1}
//                 value={messageCornerRadius}
//                 onValueChange={(value) => updateMessageCornerRadius(value)} // ✅ Redux action
//                 minimumTrackTintColor="#1877f2"
//                 maximumTrackTintColor={isDarkMode ? '#3a3b3c' : '#e4e6eb'}
//                 thumbTintColor="#1877f2"
//               />
//               <CustomText style={styles.sliderValue}>
//                 {Math.round(messageCornerRadius)}
//               </CustomText>
//             </View>
            
//             {/* Preview */}
//             <View style={styles.previewCard}>
//               <View
//                 style={[
//                   styles.previewBubble,
//                   { borderRadius: messageCornerRadius },
//                 ]}
//               >
//                 <CustomText style={styles.previewText}>
//                   Preview message bubble
//                 </CustomText>
//               </View>
//             </View>
//           </View>
//         </View>

//         <View style={styles.divider} />

//         {/* Feed List View Section */}
//         <View style={styles.section}>
//           <CustomText style={styles.sectionTitle}>Feed list view</CustomText>
          
//           <View style={styles.listViewOptions}>
//             {/* Two Lines Option */}
//             <TouchableOpacity
//               style={[
//                 styles.listViewOption,
//                 feedListView === 'two-lines'
//                   ? styles.listViewSelected
//                   : styles.listViewUnselected,
//               ]}
//               onPress={() => updateFeedListView('two-lines')} // ✅ Redux action
//               activeOpacity={0.7}
//             >
//               <View style={styles.listViewPreview}>
//                 <View style={styles.listViewAvatar} />
//                 <View style={styles.listViewContent}>
//                   <View style={styles.listViewLine} />
//                   <View style={[styles.listViewLine, { width: '60%' }]} />
//                 </View>
//               </View>
//               <CustomText style={styles.listViewLabel}>Two lines</CustomText>
//             </TouchableOpacity>

//             {/* Three Lines Option */}
//             <TouchableOpacity
//               style={[
//                 styles.listViewOption,
//                 feedListView === 'three-lines'
//                   ? styles.listViewSelected
//                   : styles.listViewUnselected,
//               ]}
//               onPress={() => updateFeedListView('three-lines')} // ✅ Redux action
//               activeOpacity={0.7}
//             >
//               <View style={styles.listViewPreview}>
//                 <View style={styles.listViewAvatar} />
//                 <View style={styles.listViewContent}>
//                   <View style={styles.listViewLine} />
//                   <View style={styles.listViewLine} />
//                   <View style={[styles.listViewLine, { width: '40%' }]} />
//                 </View>
//               </View>
//               <CustomText style={styles.listViewLabel}>Three lines</CustomText>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Bottom Spacing */}
//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </View>
//   );
// };

// const getThemeIcon = (themeId) => {
//   const icons = {
//     default: '🏠',
//     nature: '🌿',
//     ocean: '🌊',
//     sunset: '🌅',
//     royal: '💎',
//   };
//   return icons[themeId] || '🎨';
// };

// export default ThemeSettings;


import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';

import { useSelector } from 'react-redux';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import { PrimaryBackArrow, PrimaryBackWhite } from '../../assets/SVGs';
import { FONTS_FAMILY } from '../../assets/Fonts';
import CustomText from '../../components/TextComponent';
import Slider from '@react-native-community/slider';
import { 
  updateColorTheme, 
  updateMessageCornerRadius, 
  updateFeedListView,
  setSpecificTheme 
} from '../../redux/actions/themeActions';
import { THEMES } from '../../redux/reducer/theme';

const ThemeSettings = ({ navigation }) => {
  const { 
    isDarkMode, 
    selectedColorTheme, 
    messageCornerRadius, 
    feedListView 
  } = useSelector(state => state.theme);

  console.log('Selected Theme:', selectedColorTheme);
  
  // ✅ GET CURRENT THEME COLORS
  const currentTheme = THEMES[selectedColorTheme] || THEMES.default;
  const primaryColor = currentTheme.primary;
  const secondaryColor = currentTheme.secondary;

  // Convert THEMES object to array
  const colorThemes = Object.entries(THEMES).map(([id, data]) => ({
    id,
    name: data.name,
    icon: getThemeIcon(id),
    primary: data.primary,
    bg: data.secondary,
  }));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? 'black' : '#f0f2f5',
    },
    headerContainer: {
      backgroundColor: isDarkMode ? '#252525' : 'white',
      paddingTop: 50,
      paddingBottom: 15,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : 'black',
      marginLeft: 10,
    },
    
    section: {
      marginTop: 16,
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: primaryColor, // ✅ THEME COLOR (pehle #1877f2 tha)
      marginBottom: 12,
      paddingHorizontal: 16,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    
    settingCard: {
      backgroundColor: isDarkMode ? '#252525' : 'white',
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingIcon: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingText: {
      flex: 1,
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
      color: isDarkMode ? 'white' : 'black',
    },
    settingSubText: {
      fontSize: 13,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#b0b3b8' : '#65676b',
      marginTop: 2,
    },
    arrowIcon: {
      fontSize: 20,
      color: isDarkMode ? '#b0b3b8' : '#65676b',
    },
    
    colorThemeContainer: {
      paddingHorizontal: 16,
    },
    colorThemeScroll: {
      paddingVertical: 8,
    },
    colorThemeCard: {
      width: 110,
      height: 110,
      borderRadius: 12,
      marginRight: 12,
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 3,
    },
    colorThemeSelected: {
      borderColor: primaryColor, // ✅ THEME COLOR (pehle #1877f2 tha)
    },
    colorThemeUnselected: {
      borderColor: 'transparent',
    },
    themeBackground: {
      flex: 1,
      padding: 12,
      justifyContent: 'center',
    },
    themeBubble: {
      height: 28,
      borderRadius: 12,
      marginVertical: 4,
      width: '75%',
    },
    themeBubbleLight: {
      backgroundColor: '#FFFFFF',
    },
    themeBubblePrimary: {
      alignSelf: 'flex-end',
    },
    themeIcon: {
      position: 'absolute',
      bottom: 8,
      left: 8,
      fontSize: 26,
    },
    themeName: {
      textAlign: 'center',
      fontSize: 12,
      fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
      color: isDarkMode ? 'white' : 'black',
      marginTop: 6,
    },
    
    sliderCard: {
      backgroundColor: isDarkMode ? '#252525' : 'white',
      paddingVertical: 20,
      paddingHorizontal: 16,
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 12,
    },
    sliderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    slider: {
      flex: 1,
      height: 40,
    },
    sliderValue: {
      marginLeft: 12,
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : 'black',
      minWidth: 35,
      textAlign: 'center',
    },
    
    previewCard: {
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
      padding: 16,
      marginTop: 12,
      borderRadius: 12,
    },
    previewBubble: {
      padding: 12,
      alignSelf: 'flex-start',
      maxWidth: '70%',
      backgroundColor: primaryColor, // ✅ THEME COLOR for message bubble preview
    },
    previewText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: 'white', // Message bubble text always white
    },
    
    listViewOptions: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 12,
    },
    listViewOption: {
      flex: 1,
      backgroundColor: isDarkMode ? '#252525' : 'white',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 2,
    },
    listViewSelected: {
      borderColor: primaryColor, // ✅ THEME COLOR (pehle #1877f2 tha)
    },
    listViewUnselected: {
      borderColor: 'transparent',
    },
    listViewPreview: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%',
      marginBottom: 12,
      paddingHorizontal: 8,
    },
    listViewAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
      marginRight: 10,
    },
    listViewContent: {
      flex: 1,
    },
    listViewLine: {
      height: 8,
      borderRadius: 4,
      backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
      marginVertical: 3,
    },
    listViewLabel: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
      color: isDarkMode ? 'white' : 'black',
      marginTop: 8,
    },
    
    divider: {
      height: 1,
      backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
      marginVertical: 20,
      marginHorizontal: 16,
    },
    
    // ✅ NEW - Accent Color Preview Circle
    accentColorCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: primaryColor, // ✅ THEME COLOR
    },
  });

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <SpaceBetweenRow style={{ paddingHorizontal: 20 }}>
          <View style={styles.backButton}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
            </TouchableOpacity>
            <CustomText style={styles.headerTitle}>Theme Settings</CustomText>
          </View>
        </SpaceBetweenRow>
      </View>
    );
  };

  const renderColorThemeCard = (theme) => {
    const isSelected = selectedColorTheme === theme.id;
    
    return (
      <TouchableOpacity
        key={theme.id}
        onPress={() => updateColorTheme(theme.id)} // ✅ Redux action
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.colorThemeCard,
            isSelected ? styles.colorThemeSelected : styles.colorThemeUnselected,
          ]}
        >
          <View style={[styles.themeBackground, { backgroundColor: theme.bg }]}>
            <View style={[styles.themeBubble, styles.themeBubbleLight]} />
            <View
              style={[
                styles.themeBubble,
                styles.themeBubblePrimary,
                { backgroundColor: theme.primary },
              ]}
            />
          </View>
          <CustomText style={styles.themeIcon}>{theme.icon}</CustomText>
        </View>
        <CustomText style={styles.themeName}>{theme.name}</CustomText>
      </TouchableOpacity>
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
        
        {/* Appearance Section */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Appearance</CustomText>
          
          {/* Change Accent Color */}
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => {
              console.log('Change Accent Color');
            }}
          >
            <View style={styles.settingIcon}>
              <CustomText style={{ fontSize: 24 }}>🎨</CustomText>
            </View>
            <View style={{ flex: 1 }}>
              <CustomText style={styles.settingText}>Change Accent Color</CustomText>
              <CustomText style={styles.settingSubText}>
                Choose primary color for your app
              </CustomText>
            </View>
            <View style={styles.accentColorCircle} />
          </TouchableOpacity>
        </View>

        {/* Color Theme Section */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Color theme</CustomText>
          
          <View style={styles.colorThemeContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.colorThemeScroll}
            >
              {colorThemes.map(theme => renderColorThemeCard(theme))}
            </ScrollView>
          </View>
        </View>

        {/* Night Mode Toggle */}
        <TouchableOpacity
          style={[styles.settingCard, { marginTop: 16 }]}
          onPress={() => setSpecificTheme(!isDarkMode)}
          activeOpacity={0.7}
        >
          <View style={styles.settingIcon}>
            <CustomText style={{ fontSize: 24 }}>🌙</CustomText>
          </View>
          <CustomText style={styles.settingText}>
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
          </CustomText>
          <Switch
            value={isDarkMode}
            onValueChange={(value) => setSpecificTheme(value)}
            trackColor={{ 
              false: isDarkMode ? '#3a3b3c' : '#e4e6eb', 
              true: primaryColor // ✅ THEME COLOR (pehle #1877f2 tha)
            }}
            thumbColor={'#ffffff'}
          />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Message Corners Section */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Message corners</CustomText>
          
          <View style={styles.sliderCard}>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={4}
                maximumValue={24}
                step={1}
                value={messageCornerRadius}
                onValueChange={(value) => updateMessageCornerRadius(value)}
                minimumTrackTintColor={primaryColor} // ✅ THEME COLOR
                maximumTrackTintColor={isDarkMode ? '#3a3b3c' : '#e4e6eb'}
                thumbTintColor={primaryColor} // ✅ THEME COLOR
              />
              <CustomText style={styles.sliderValue}>
                {Math.round(messageCornerRadius)}
              </CustomText>
            </View>
            
            {/* Preview */}
            <View style={styles.previewCard}>
              <View
                style={[
                  styles.previewBubble,
                  { borderRadius: messageCornerRadius },
                ]}
              >
                <CustomText style={styles.previewText}>
                  Preview message bubble
                </CustomText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Feed List View Section */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Feed list view</CustomText>
          
          <View style={styles.listViewOptions}>
            {/* Two Lines Option */}
            <TouchableOpacity
              style={[
                styles.listViewOption,
                feedListView === 'two-lines'
                  ? styles.listViewSelected
                  : styles.listViewUnselected,
              ]}
              onPress={() => updateFeedListView('two-lines')}
              activeOpacity={0.7}
            >
              <View style={styles.listViewPreview}>
                <View style={styles.listViewAvatar} />
                <View style={styles.listViewContent}>
                  <View style={styles.listViewLine} />
                  <View style={[styles.listViewLine, { width: '60%' }]} />
                </View>
              </View>
              <CustomText style={styles.listViewLabel}>Two lines</CustomText>
            </TouchableOpacity>

            {/* Three Lines Option */}
            <TouchableOpacity
              style={[
                styles.listViewOption,
                feedListView === 'three-lines'
                  ? styles.listViewSelected
                  : styles.listViewUnselected,
              ]}
              onPress={() => updateFeedListView('three-lines')}
              activeOpacity={0.7}
            >
              <View style={styles.listViewPreview}>
                <View style={styles.listViewAvatar} />
                <View style={styles.listViewContent}>
                  <View style={styles.listViewLine} />
                  <View style={styles.listViewLine} />
                  <View style={[styles.listViewLine, { width: '40%' }]} />
                </View>
              </View>
              <CustomText style={styles.listViewLabel}>Three lines</CustomText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const getThemeIcon = (themeId) => {
  const icons = {
    default: '🏠',
    nature: '🌿',
    ocean: '🌊',
    sunset: '🌅',
    royal: '💎',
  };
  return icons[themeId] || '🎨';
};

export default ThemeSettings;