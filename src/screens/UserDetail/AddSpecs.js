// import React, { useEffect, useRef, useState } from "react";
// import { Animated, ImageBackground, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, Text } from "react-native";
// import CustomText from "../../components/TextComponent";
// import IMG from "../../assets/Images";
// import Row from "../../components/wrapper/row";
// import { Back, BackOuterWhite, Upload } from "../../assets/SVGs";
// import { FONTS_FAMILY } from "../../assets/Fonts";
// import CustomInputField from "../../components/CustomInputField";
// import { useSelector } from "react-redux";
// import { ToastMsg } from "../../utils/helperFunctions";
// import { launchImageLibrary } from 'react-native-image-picker';
// import { Platform } from 'react-native';
// import LinearGradient from "react-native-linear-gradient";


// const AddVehicleSpecs = ({ navigation }) => {
//     const { isDarkMode } = useSelector(state => state.theme);
//     const slideAnim = useRef(new Animated.Value(300)).current;

//     // Main Vehicle Info
//     const [vehicleName, setVehicleName] = useState('');
//     const [make, setMake] = useState('');
//     const [model, setModel] = useState('');
//     const [year, setYear] = useState('');
//     const [bodyType, setBodyType] = useState('');

//     // Power
//     const [engine, setEngine] = useState('');
//     const [horsepower, setHorsepower] = useState('');
//     const [torque, setTorque] = useState('');
//     const [drivetrain, setDrivetrain] = useState('');
//     const [transmission, setTransmission] = useState('');

//     // Modifications
//     const [performance, setPerformance] = useState('');
//     const [suspension, setSuspension] = useState('');
//     const [brakes, setBrakes] = useState('');

//     // Style
//     const [paintWrap, setPaintWrap] = useState('');
//     const [exteriorMods, setExteriorMods] = useState('');
//     const [interiorMods, setInteriorMods] = useState('');

//     // Status
//     const [mileage, setMileage] = useState('');
//     const [buildStage, setBuildStage] = useState('');
//     const [notes, setNotes] = useState('');

//     // Optional
//     const [performanceStats, setPerformanceStats] = useState('');
//     const [budget, setBudget] = useState('');

//     // Vehicle Images
//     const [vehicleImages, setVehicleImages] = useState([]);

//     // Dropdown options
//     const buildStageOptions = ['Stock', 'Modified', 'Under Build'];
//     const drivetrainOptions = ['FWD', 'RWD', 'AWD', '4WD'];
//     const transmissionOptions = ['Manual', 'Automatic', 'CVT', 'DCT'];

//     useEffect(() => {
//         Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//         }).start();
//     }, []);

//     const handleImagePick = () => {
//         const options = {
//             mediaType: 'photo',
//             selectionLimit: 5,
//         };

//         launchImageLibrary(options, (response) => {
//             if (response.didCancel) {
//                 console.log('User cancelled image picker');
//             } else if (response.errorMessage) {
//                 console.error('Image Picker Error:', response.errorMessage);
//             } else {
//                 const selectedImages = response.assets.map(asset => ({
//                     uri: asset.uri,
//                     type: asset.type,
//                     name: asset.fileName,
//                 }));
//                 setVehicleImages([...vehicleImages, ...selectedImages]);
//             }
//         });
//     };

//     const removeImage = (index) => {
//         const newImages = vehicleImages.filter((_, i) => i !== index);
//         setVehicleImages(newImages);
//     };

//     const onSubmit = async () => {
//         try {
//             // Validation
//             if (!vehicleName) {
//                 ToastMsg('Vehicle name is required');
//                 return;
//             }

//             if (!make || !model || !year) {
//                 ToastMsg('Make, Model, and Year are required');
//                 return;
//             }

//             // Prepare vehicle data
//             const vehicleData = {
//                 vehicleName,
//                 mainInfo: {
//                     make,
//                     model,
//                     year,
//                     bodyType
//                 },
//                 power: {
//                     engine,
//                     horsepower,
//                     torque,
//                     drivetrain,
//                     transmission
//                 },
//                 modifications: {
//                     performance,
//                     suspension,
//                     brakes
//                 },
//                 style: {
//                     paintWrap,
//                     exteriorMods,
//                     interiorMods
//                 },
//                 status: {
//                     mileage,
//                     buildStage,
//                     notes
//                 },
//                 optional: {
//                     performanceStats,
//                     budget
//                 },
//                 images: vehicleImages
//             };

//             console.log('Vehicle Data:', vehicleData);
//             ToastMsg('Vehicle specs added successfully!');
//             navigation.goBack();

//         } catch (error) {
//             console.log('Submit Failed:', error.message);
//             ToastMsg('Failed to add vehicle specs');
//         }
//     };

//     const renderHeader = () => {
//         return (
//             <Row style={{ paddingTop: 50, paddingHorizontal: 20, gap: 70 }}>
//                 <Row>
//                     <TouchableOpacity onPress={() => navigation.goBack()}>
//                         {isDarkMode ? <BackOuterWhite /> : <Back />}
//                     </TouchableOpacity>
//                 </Row>
//                 <CustomText style={{
//                     fontSize: 18,
//                     fontFamily: FONTS_FAMILY.SourceSans3_Bold
//                 }}>Add Vehicle Specs</CustomText>
//             </Row>
//         )
//     };

//     const renderSection = (title) => {
//         return (
//             <CustomText style={{
//                 fontSize: 16,
//                 fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//                 color: isDarkMode ? '#21B7FF' : '#0084F8',
//                 marginTop: 20,
//                 marginBottom: 10
//             }}>
//                 {title}
//             </CustomText>
//         );
//     };

//     const renderItems = () => {
//         return (
//             <Animated.View style={{
//                 transform: [{ translateX: slideAnim }],
//                 marginTop: 30,
//                 backgroundColor: isDarkMode ? '#252525' : 'rgba(255, 255, 255, 1)',
//                 flexGrow: 1,
//                 padding: 20,
//                 borderTopLeftRadius: 30,
//                 borderTopRightRadius: 30
//             }}>
//                 <ScrollView 
//                     contentContainerStyle={{ paddingBottom: 100 }}
//                     showsVerticalScrollIndicator={false}
//                 >
//                     <View style={{ marginTop: 15, alignItems: 'center', gap: 10 }}>
                        
//                         {/* Main Vehicle Information */}
//                         <CustomInputField
//                             placeholder={'Enter Vehicle Name'}
//                             label={'Vehicle Name'}
//                             value={vehicleName}
//                             onChangeText={setVehicleName}
//                             lableStyle={true}
//                         />

//                         <CustomInputField
//                             placeholder={'Enter Make (e.g., Toyota, Honda)'}
//                             label={'Make'}
//                             value={make}
//                             onChangeText={setMake}
//                             lableStyle={true}
//                         />

//                         <CustomInputField
//                             placeholder={'Enter Model (e.g., Camry, Civic)'}
//                             label={'Model'}
//                             value={model}
//                             onChangeText={setModel}
//                             lableStyle={true}
//                         />

//                         <CustomInputField
//                             placeholder={'Enter Year (e.g., 2024)'}
//                             label={'Year'}
//                             value={year}
//                             onChangeText={setYear}
//                             keyboardType={'numeric'}
//                             lableStyle={true}
//                         />

//                         <CustomInputField
//                             placeholder={'Enter Body Type / Trim'}
//                             label={'Body Type / Trim'}
//                             value={bodyType}
//                             onChangeText={setBodyType}
//                             lableStyle={true}
//                         />

//                         {/* Power Section */}
//                         {renderSection('POWER')}

//                         <CustomInputField
//                             placeholder={'Enter Engine (e.g., 2.0L Turbo)'}
//                             label={'Engine'}
//                             value={engine}
//                             onChangeText={setEngine}
//                             lableStyle={true}
//                         />

//                         <CustomInputField
//                             placeholder={'Enter Horsepower (e.g., 300 HP)'}
//                             label={'HP / Torque'}
//                             value={horsepower}
//                             onChangeText={setHorsepower}
//                             lableStyle={true}
//                         />

//                         <CustomInputField
//                             placeholder={'Enter Torque (e.g., 280 lb-ft)'}
//                             label={'Torque'}
//                             value={torque}
//                             onChangeText={setTorque}
//                             lableStyle={true}
//                         />

//                         {/* Drivetrain Dropdown */}
//                         <View style={{ width: '100%' }}>
//                             <CustomText style={{
//                                 fontSize: 14,
//                                 fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//                                 color: isDarkMode ? 'white' : 'black',
//                                 marginBottom: 8
//                             }}>
//                                 Drivetrain
//                             </CustomText>
//                             <View style={styles.dropdownContainer}>
//                                 {drivetrainOptions.map((option) => (
//                                     <TouchableOpacity
//                                         key={option}
//                                         style={[
//                                             styles.dropdownOption,
//                                             {
//                                                 backgroundColor: drivetrain === option 
//                                                     ? (isDarkMode ? '#21B7FF' : '#0084F8')
//                                                     : (isDarkMode ? '#1a1a1a' : '#f0f0f0')
//                                             }
//                                         ]}
//                                         onPress={() => setDrivetrain(option)}
//                                     >
//                                         <CustomText style={{
//                                             color: drivetrain === option ? 'white' : (isDarkMode ? '#ccc' : '#666')
//                                         }}>
//                                             {option}
//                                         </CustomText>
//                                     </TouchableOpacity>
//                                 ))}
//                             </View>
//                         </View>

//                         {/* Transmission Dropdown */}
//                         <View style={{ width: '100%' }}>
//                             <CustomText style={{
//                                 fontSize: 14,
//                                 fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//                                 color: isDarkMode ? 'white' : 'black',
//                                 marginBottom: 8
//                             }}>
//                                 Transmission
//                             </CustomText>
//                             <View style={styles.dropdownContainer}>
//                                 {transmissionOptions.map((option) => (
//                                     <TouchableOpacity
//                                         key={option}
//                                         style={[
//                                             styles.dropdownOption,
//                                             {
//                                                 backgroundColor: transmission === option 
//                                                     ? (isDarkMode ? '#21B7FF' : '#0084F8')
//                                                     : (isDarkMode ? '#1a1a1a' : '#f0f0f0')
//                                             }
//                                         ]}
//                                         onPress={() => setTransmission(option)}
//                                     >
//                                         <CustomText style={{
//                                             color: transmission === option ? 'white' : (isDarkMode ? '#ccc' : '#666')
//                                         }}>
//                                             {option}
//                                         </CustomText>
//                                     </TouchableOpacity>
//                                 ))}
//                             </View>
//                         </View>

//                         {/* Modifications Section */}
//                         {renderSection('MODIFICATIONS')}

//                         <CustomInputField
//                             placeholder={'Performance Mods (e.g., Cold Air Intake, Exhaust)'}
//                             label={'Performance'}
//                             value={performance}
//                             onChangeText={setPerformance}
//                             multiline={true}
//                             lableStyle={true}
//                         />

//                         <CustomInputField
//                             placeholder={'Suspension Mods (e.g., Coilovers, Springs)'}
//                             label={'Suspension'}
//                             value={suspension}
//                             onChangeText={setSuspension}
//                             multiline={true}
//                             lableStyle={true}
//                         />

//                         <CustomInputField
//                             placeholder={'Brake Upgrades (e.g., Big Brake Kit)'}
//                             label={'Brakes'}
//                             value={brakes}
//                             onChangeText={setBrakes}
//                             multiline={true}
//                             lableStyle={true}
//                         />

//                         {/* Style Section */}
//                         {renderSection('STYLE')}

//                         <CustomInputField
//                             placeholder={'Paint/Wrap Details'}
//                             label={'Paint/Wrap'}
//                             value={paintWrap}
//                             onChangeText={setPaintWrap}
//                             lableStyle={true}
//                         />

//                         <CustomInputField
//                             placeholder={'Exterior Modifications (e.g., Body Kit, Spoiler)'}
//                             label={'Exterior Mods'}
//                             value={exteriorMods}
//                             onChangeText={setExteriorMods}
//                             multiline={true}
//                             lableStyle={true}
//                         />

//                         <CustomInputField
//                             placeholder={'Interior Modifications (e.g., Seats, Steering Wheel)'}
//                             label={'Interior Mods'}
//                             value={interiorMods}
//                             onChangeText={setInteriorMods}
//                             multiline={true}
//                             lableStyle={true}
//                         />

//                         {/* Status Section */}
//                         {renderSection('STATUS')}

//                         <CustomInputField
//                             placeholder={'Current Mileage'}
//                             label={'Mileage'}
//                             value={mileage}
//                             onChangeText={setMileage}
//                             keyboardType={'numeric'}
//                             lableStyle={true}
//                         />

//                         {/* Build Stage Dropdown */}
//                         <View style={{ width: '100%' }}>
//                             <CustomText style={{
//                                 fontSize: 14,
//                                 fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//                                 color: isDarkMode ? 'white' : 'black',
//                                 marginBottom: 8
//                             }}>
//                                 Build Stage
//                             </CustomText>
//                             <View style={styles.dropdownContainer}>
//                                 {buildStageOptions.map((option) => (
//                                     <TouchableOpacity
//                                         key={option}
//                                         style={[
//                                             styles.dropdownOption,
//                                             {
//                                                 backgroundColor: buildStage === option 
//                                                     ? (isDarkMode ? '#21B7FF' : '#0084F8')
//                                                     : (isDarkMode ? '#1a1a1a' : '#f0f0f0')
//                                             }
//                                         ]}
//                                         onPress={() => setBuildStage(option)}
//                                     >
//                                         <CustomText style={{
//                                             color: buildStage === option ? 'white' : (isDarkMode ? '#ccc' : '#666')
//                                         }}>
//                                             {option}
//                                         </CustomText>
//                                     </TouchableOpacity>
//                                 ))}
//                             </View>
//                         </View>

//                         <CustomInputField
//                             placeholder={'Owner notes (250 character limit)'}
//                             label={'Notes'}
//                             value={notes}
//                             onChangeText={(text) => {
//                                 if (text.length <= 250) {
//                                     setNotes(text);
//                                 }
//                             }}
//                             multiline={true}
//                             lableStyle={true}
//                         />
//                         <CustomText style={{
//                             fontSize: 12,
//                             color: isDarkMode ? '#999' : '#666',
//                             alignSelf: 'flex-end',
//                             marginTop: -5
//                         }}>
//                             {notes.length}/250
//                         </CustomText>

//                         {/* Optional Section */}
//                         {renderSection('OPTIONAL')}

//                         <CustomInputField
//                             placeholder={'0-60 mph, Quarter Mile, etc.'}
//                             label={'Performance Stats'}
//                             value={performanceStats}
//                             onChangeText={setPerformanceStats}
//                             multiline={true}
//                             lableStyle={true}
//                         />

//                         <CustomInputField
//                             placeholder={'Total Budget / Current Value'}
//                             label={'Budget/Current Price'}
//                             value={budget}
//                             onChangeText={setBudget}
//                             keyboardType={'numeric'}
//                             lableStyle={true}
//                         />

//                         {/* Vehicle Images */}
//                         {renderSection('VEHICLE IMAGES')}

//                         <TouchableOpacity 
//                             onPress={handleImagePick}
//                             style={{ width: '100%' }}
//                         >
//                             <View style={[
//                                 styles.uploadBox,
//                                 { 
//                                     borderColor: isDarkMode ? '#404040' : '#ddd',
//                                     backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9'
//                                 }
//                             ]}>
//                                 <Upload />
//                                 <CustomText style={{ 
//                                     color: isDarkMode ? '#ccc' : '#666',
//                                     marginTop: 10
//                                 }}>
//                                     Upload Vehicle Images (Max 5)
//                                 </CustomText>
//                             </View>
//                         </TouchableOpacity>

//                         {/* Display Selected Images */}
//                         {vehicleImages.length > 0 && (
//                             <View style={styles.imageContainer}>
//                                 {vehicleImages.map((image, index) => (
//                                     <View key={index} style={styles.imageWrapper}>
//                                         <Text style={{ 
//                                             color: isDarkMode ? 'white' : 'black',
//                                             fontSize: 12
//                                         }}>
//                                             Image {index + 1}
//                                         </Text>
//                                         <TouchableOpacity
//                                             onPress={() => removeImage(index)}
//                                             style={styles.removeImageButton}
//                                         >
//                                             <CustomText style={{ color: 'red' }}>×</CustomText>
//                                         </TouchableOpacity>
//                                     </View>
//                                 ))}
//                             </View>
//                         )}

//                         {/* Submit Button */}
//                         <TouchableOpacity
//                             onPress={onSubmit}
//                             style={{ marginTop: 20 }}
//                         >
//                             <LinearGradient
//                                 colors={['#21B7FF', '#0084F8']}
//                                 start={{ x: 1, y: 0 }}
//                                 end={{ x: 1, y: 1 }}
//                                 style={styles.submitButton}
//                             >
//                                 <Text style={styles.submitText}>
//                                     Add Vehicle Specs
//                                 </Text>
//                             </LinearGradient>
//                         </TouchableOpacity>

//                     </View>
//                 </ScrollView>
//             </Animated.View>
//         )
//     };

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: isDarkMode ? 'black' : 'white'
//         },
//         dropdownContainer: {
//             flexDirection: 'row',
//             flexWrap: 'wrap',
//             gap: 10,
//             marginBottom: 15
//         },
//         dropdownOption: {
//             paddingVertical: 10,
//             paddingHorizontal: 20,
//             borderRadius: 8,
//             minWidth: 80,
//             alignItems: 'center'
//         },
//         uploadBox: {
//             borderWidth: 2,
//             borderStyle: 'dashed',
//             borderRadius: 12,
//             paddingVertical: 30,
//             alignItems: 'center',
//             justifyContent: 'center',
//             marginBottom: 15
//         },
//         imageContainer: {
//             flexDirection: 'row',
//             flexWrap: 'wrap',
//             gap: 10,
//             marginTop: 10
//         },
//         imageWrapper: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
//             paddingVertical: 8,
//             paddingHorizontal: 12,
//             borderRadius: 8,
//             gap: 8
//         },
//         removeImageButton: {
//             width: 20,
//             height: 20,
//             borderRadius: 10,
//             backgroundColor: 'rgba(255, 0, 0, 0.1)',
//             justifyContent: 'center',
//             alignItems: 'center'
//         },
//         submitButton: {
//             paddingVertical: 15,
//             paddingHorizontal: 16,
//             borderRadius: 8,
//             alignItems: 'center',
//             width: 300
//         },
//         submitText: {
//             fontSize: 16,
//             fontWeight: '600',
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//             color: '#fff'
//         }
//     });

//     return (
//         <ImageBackground source={IMG.bgShadow} style={styles.container}>
//             <StatusBar 
//                 translucent 
//                 backgroundColor="transparent" 
//                 barStyle={isDarkMode ? "light-content" : "dark-content"} 
//             />
//             {renderHeader()}
//             {renderItems()}
//         </ImageBackground>
//     )
// }

// export default AddVehicleSpecs;



import React, { useEffect, useRef, useState } from "react";
import { Animated, ImageBackground, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, Text, Image, Modal } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { Back, BackOuterWhite, Upload } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomInputField from "../../components/CustomInputField";
import { useSelector } from "react-redux";
import { ToastMsg } from "../../utils/helperFunctions";
import { launchImageLibrary } from 'react-native-image-picker';
import { Platform } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import axios from 'axios';
import { BASE_URL, getItem } from "../../utils/Apis";

const AddVehicleSpecs = ({ navigation, route }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const slideAnim = useRef(new Animated.Value(300)).current;
    
    // Check if we're in edit mode
    const isEditMode = route?.params?.vehicleData ? true : false;
    const vehicleId = route?.params?.vehicleData?._id || null;
    const existingData = route?.params?.vehicleData || null;

    // Main Vehicle Info
    const [vehicleName, setVehicleName] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [bodyType, setBodyType] = useState('');

    // Power
    const [engine, setEngine] = useState('');
    const [horsepower, setHorsepower] = useState('');
    const [torque, setTorque] = useState('');
    const [drivetrain, setDrivetrain] = useState('');
    const [transmission, setTransmission] = useState('');

    // Modifications (arrays)
    const [performance, setPerformance] = useState('');
    const [suspension, setSuspension] = useState('');
    const [brakes, setBrakes] = useState('');

    // Style
    const [paintWrap, setPaintWrap] = useState('');
    const [exteriorMods, setExteriorMods] = useState('');
    const [interiorMods, setInteriorMods] = useState('');

    // Status
    const [mileage, setMileage] = useState('');
    const [buildStage, setBuildStage] = useState('');
    const [ownerNote, setOwnerNote] = useState('');

    // Performance Stats
    const [zeroToSixty, setZeroToSixty] = useState('');
    const [quarterMile, setQuarterMile] = useState('');
    
    // Budget
    const [currentPrice, setCurrentPrice] = useState('');

    // Vehicle Image - ONLY ONE IMAGE
    const [vehicleImage, setVehicleImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Modal states for dropdowns
    const [showDrivetrainModal, setShowDrivetrainModal] = useState(false);
    const [showTransmissionModal, setShowTransmissionModal] = useState(false);
    const [showBuildStageModal, setShowBuildStageModal] = useState(false);

    // Dropdown options
    const buildStageOptions = ['Stock', 'Modified', 'Under Build'];
    const drivetrainOptions = ['FWD', 'RWD', 'AWD', '4WD'];
    const transmissionOptions = ['Manual', 'Automatic', 'CVT', 'DCT'];

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Load existing data if in edit mode
        if (isEditMode && existingData) {
            loadExistingData(existingData);
        }
    }, []);

    const loadExistingData = (data) => {
        setVehicleName(data.vehicleName || '');
        setMake(data.make || '');
        setModel(data.model || '');
        setYear(data.year?.toString() || '');
        setBodyType(data.bodyType || '');
        setEngine(data.engine || '');
        setHorsepower(data.horsepower?.toString() || '');
        setTorque(data.torque?.toString() || '');
        setDrivetrain(data.drivetrain || '');
        setTransmission(data.transmission || '');
        
        // Handle array fields
        setPerformance(Array.isArray(data.performance) ? data.performance.join(', ') : '');
        setSuspension(Array.isArray(data.suspension) ? data.suspension.join(', ') : '');
        setBrakes(Array.isArray(data.brakes) ? data.brakes.join(', ') : '');
        
        setPaintWrap(data.paintWrap || '');
        setExteriorMods(Array.isArray(data.exteriorMods) ? data.exteriorMods.join(', ') : '');
        setInteriorMods(Array.isArray(data.interiorMods) ? data.interiorMods.join(', ') : '');
        
        setMileage(data.mileage?.toString() || '');
        setBuildStage(data.buildStage || '');
        setOwnerNote(data.ownerNote || '');
        
        setZeroToSixty(data.zeroToSixty || '');
        setQuarterMile(data.quarterMile || '');
        setCurrentPrice(data.currentPrice?.toString() || '');
        
        // Handle existing image - SINGLE IMAGE
        if (data.image) {
            setVehicleImage({ uri: data.image, isExisting: true });
        }
    };

    const handleImagePick = () => {
        const options = {
            mediaType: 'photo',
            quality: 0.8,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.error('Image Picker Error:', response.errorMessage);
                ToastMsg('Error picking image');
            } else if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                setVehicleImage({
                    uri: asset.uri,
                    type: asset.type,
                    name: asset.fileName || `vehicle_image_${Date.now()}.jpg`,
                    isExisting: false
                });
            }
        });
    };

    const removeImage = () => {
        setVehicleImage(null);
    };

    // Helper function to convert comma-separated string to array
    const stringToArray = (str) => {
        if (!str || str.trim() === '') return [];
        return str.split(',').map(item => item.trim()).filter(item => item !== '');
    };

    const onSubmit = async () => {
        try {
            setLoading(true);

            // Validation
            if (!vehicleName.trim()) {
                ToastMsg('Vehicle name is required');
                setLoading(false);
                return;
            }

            if (!make.trim() || !model.trim() || !year.trim()) {
                ToastMsg('Make, Model, and Year are required');
                setLoading(false);
                return;
            }

            // Get auth token
            const token = await getItem('token');

            // Prepare FormData
            const formData = new FormData();
            
            // Required fields
            formData.append('vehicleName', vehicleName.trim());
            formData.append('make', make.trim());
            formData.append('model', model.trim());
            formData.append('year', parseInt(year));
            
            // Optional main info
            if (bodyType.trim()) formData.append('bodyType', bodyType.trim());
            
            // Power specs
            if (engine.trim()) formData.append('engine', engine.trim());
            if (horsepower.trim()) formData.append('horsepower', parseInt(horsepower));
            if (torque.trim()) formData.append('torque', parseInt(torque));
            if (drivetrain) formData.append('drivetrain', drivetrain);
            if (transmission) formData.append('transmission', transmission);
            
            // Modifications - convert to arrays
            if (performance.trim()) {
                formData.append('performance', JSON.stringify(stringToArray(performance)));
            }
            if (suspension.trim()) {
                formData.append('suspension', JSON.stringify(stringToArray(suspension)));
            }
            if (brakes.trim()) {
                formData.append('brakes', JSON.stringify(stringToArray(brakes)));
            }
            
            // Style
            if (paintWrap.trim()) formData.append('paintWrap', paintWrap.trim());
            if (exteriorMods.trim()) {
                formData.append('exteriorMods', JSON.stringify(stringToArray(exteriorMods)));
            }
            if (interiorMods.trim()) {
                formData.append('interiorMods', JSON.stringify(stringToArray(interiorMods)));
            }
            
            // Status
            if (mileage.trim()) formData.append('mileage', parseInt(mileage));
            if (buildStage) formData.append('buildStage', buildStage);
            if (ownerNote.trim()) formData.append('ownerNote', ownerNote.trim());
            
            // Performance stats
            if (zeroToSixty.trim()) formData.append('zeroToSixty', zeroToSixty.trim());
            if (quarterMile.trim()) formData.append('quarterMile', quarterMile.trim());
            
            // Price
            if (currentPrice.trim()) formData.append('currentPrice', parseInt(currentPrice));
            
            // Add single image if selected and not existing
            if (vehicleImage && !vehicleImage.isExisting) {
                formData.append('Image', {
                    uri: Platform.OS === 'android' ? vehicleImage.uri : vehicleImage.uri.replace('file://', ''),
                    type: vehicleImage.type || 'image/jpeg',
                    name: vehicleImage.name || `vehicle_image.jpg`,
                });
            }

            // Log the payload for debugging
            console.log('=== API PAYLOAD ===');
            console.log('Endpoint:', isEditMode ? `${BASE_URL}/api/user/UpdateUserCurrentCar/${vehicleId}` : `${BASE_URL}/api/user/UserAddCurrentCar`);
            console.log('Token:', token ? 'Present' : 'Missing');
            console.log('FormData fields:', {
                vehicleName: vehicleName.trim(),
                make: make.trim(),
                model: model.trim(),
                year: parseInt(year),
                bodyType: bodyType.trim() || 'Not provided',
                engine: engine.trim() || 'Not provided',
                horsepower: horsepower.trim() ? parseInt(horsepower) : 'Not provided',
                torque: torque.trim() ? parseInt(torque) : 'Not provided',
                drivetrain: drivetrain || 'Not provided',
                transmission: transmission || 'Not provided',
                performance: stringToArray(performance),
                suspension: stringToArray(suspension),
                brakes: stringToArray(brakes),
                paintWrap: paintWrap.trim() || 'Not provided',
                exteriorMods: stringToArray(exteriorMods),
                interiorMods: stringToArray(interiorMods),
                mileage: mileage.trim() ? parseInt(mileage) : 'Not provided',
                buildStage: buildStage || 'Not provided',
                ownerNote: ownerNote.trim() || 'Not provided',
                zeroToSixty: zeroToSixty.trim() || 'Not provided',
                quarterMile: quarterMile.trim() || 'Not provided',
                currentPrice: currentPrice.trim() ? parseInt(currentPrice) : 'Not provided',
                hasImage: vehicleImage && !vehicleImage.isExisting ? 'Yes' : 'No'
            });

            // API call
            let response;

            if (isEditMode) {
                // Update existing vehicle
                const updateUrl = `${BASE_URL}/api/user/UpdateUserCurrentCar/${vehicleId}`;
                console.log('UPDATE URL:', updateUrl);
                
                response = await axios.put(
                    updateUrl,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        },
                    }
                );
                ToastMsg('Vehicle updated successfully!');
            } else {
                // Add new vehicle
                const addUrl = `${BASE_URL}/api/user/UserAddCurrentCar`;
                console.log('ADD URL:', addUrl);
                
                response = await axios.post(
                    addUrl,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        },
                    }
                );
                ToastMsg('Vehicle added successfully!');
            }

            console.log('API Response:', response.data);
            setLoading(false);
            navigation.goBack();

        } catch (error) {
            console.error('=== API ERROR ===');
            console.error('Error:', error);
            console.error('Response:', error.response?.data);
            console.error('Status:', error.response?.status);
            console.error('Headers:', error.response?.headers);
            
            if (error.response?.status === 404) {
                ToastMsg('API endpoint not found. Please check the URL.');
            } else {
                ToastMsg(error.response?.data?.message || 'Failed to save vehicle specs');
            }
            setLoading(false);
        }
    };

    const renderHeader = () => {
        return (
            <Row style={{ paddingTop: 50, paddingHorizontal: 20, gap: 70 }}>
                <Row>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        {isDarkMode ? <BackOuterWhite /> : <Back />}
                    </TouchableOpacity>
                </Row>
                <CustomText style={{
                    fontSize: 18,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>
                    {isEditMode ? 'Update Vehicle Specs' : 'Add Vehicle Specs'}
                </CustomText>
            </Row>
        )
    };

    const renderSection = (title) => {
        return (
            <CustomText style={{
                fontSize: 16,
                fontFamily: FONTS_FAMILY.SourceSans3_Bold,
                color: isDarkMode ? '#21B7FF' : '#0084F8',
                marginTop: 20,
                marginBottom: 10
            }}>
                {title}
            </CustomText>
        );
    };

    const renderDropdownModal = (visible, setVisible, options, selectedValue, onSelect, title) => {
        return (
            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <View style={[
                        styles.modalContent,
                        { backgroundColor: isDarkMode ? '#252525' : 'white' }
                    ]}>
                        <CustomText style={{
                            fontSize: 18,
                            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
                            color: isDarkMode ? 'white' : 'black',
                            marginBottom: 20,
                            textAlign: 'center'
                        }}>
                            {title}
                        </CustomText>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.modalOption,
                                    {
                                        backgroundColor: selectedValue === option 
                                            ? (isDarkMode ? '#21B7FF' : '#0084F8')
                                            : (isDarkMode ? '#1a1a1a' : '#f0f0f0')
                                    }
                                ]}
                                onPress={() => {
                                    onSelect(option);
                                    setVisible(false);
                                }}
                            >
                                <CustomText style={{
                                    color: selectedValue === option ? 'white' : (isDarkMode ? '#ccc' : '#666'),
                                    fontSize: 16
                                }}>
                                    {option}
                                </CustomText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    const renderDropdownField = (label, value, onPress, placeholder = "Select") => {
        return (
            <View style={{ width: '100%', marginBottom: 15 }}>
                <CustomText style={{
                    fontSize: 14,
                    fontFamily: FONTS_FAMILY.SourceSans3_Medium,
                    color: isDarkMode ? 'white' : 'black',
                    marginBottom: 8
                }}>
                    {label}
                </CustomText>
                <TouchableOpacity
                    onPress={onPress}
                    style={[
                        styles.dropdownField,
                        {
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9',
                            borderColor: isDarkMode ? '#404040' : '#ddd'
                        }
                    ]}
                >
                    <CustomText style={{
                        color: value ? (isDarkMode ? 'white' : 'black') : (isDarkMode ? '#666' : '#999'),
                        fontSize: 16
                    }}>
                        {value || placeholder}
                    </CustomText>
                    <CustomText style={{
                        color: isDarkMode ? '#666' : '#999',
                        fontSize: 18
                    }}>
                        ▼
                    </CustomText>
                </TouchableOpacity>
            </View>
        );
    };

    const renderItems = () => {
        return (
            <Animated.View style={{
                transform: [{ translateX: slideAnim }],
                marginTop: 30,
                backgroundColor: isDarkMode ? '#252525' : 'rgba(255, 255, 255, 1)',
                flexGrow: 1,
                padding: 20,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30
            }}>
                <ScrollView 
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ marginTop: 15, alignItems: 'center', gap: 10 }}>
                        
                        {/* Main Vehicle Information */}
                        <CustomInputField
                            placeholder={'Enter Vehicle Name'}
                            label={'Vehicle Name *'}
                            value={vehicleName}
                            onChangeText={setVehicleName}
                            lableStyle={true}
                        />

                        <CustomInputField
                            placeholder={'Enter Make (e.g., Toyota, Honda)'}
                            label={'Make *'}
                            value={make}
                            onChangeText={setMake}
                            lableStyle={true}
                        />

                        <CustomInputField
                            placeholder={'Enter Model (e.g., Camry, Civic)'}
                            label={'Model *'}
                            value={model}
                            onChangeText={setModel}
                            lableStyle={true}
                        />

                        <CustomInputField
                            placeholder={'Enter Year (e.g., 2024)'}
                            label={'Year *'}
                            value={year}
                            onChangeText={setYear}
                            keyboardType={'numeric'}
                            lableStyle={true}
                        />

                        <CustomInputField
                            placeholder={'Enter Body Type / Trim'}
                            label={'Body Type / Trim'}
                            value={bodyType}
                            onChangeText={setBodyType}
                            lableStyle={true}
                        />

                        {/* Power Section */}
                        {renderSection('POWER')}

                        <CustomInputField
                            placeholder={'Enter Engine (e.g., 2.0L Turbo)'}
                            label={'Engine'}
                            value={engine}
                            onChangeText={setEngine}
                            lableStyle={true}
                        />

                        <CustomInputField
                            placeholder={'Enter Horsepower (e.g., 300)'}
                            label={'Horsepower'}
                            value={horsepower}
                            onChangeText={setHorsepower}
                            keyboardType={'numeric'}
                            lableStyle={true}
                        />

                        <CustomInputField
                            placeholder={'Enter Torque (e.g., 280)'}
                            label={'Torque (lb-ft)'}
                            value={torque}
                            onChangeText={setTorque}
                            keyboardType={'numeric'}
                            lableStyle={true}
                        />

                        {/* Drivetrain Dropdown */}
                        {renderDropdownField(
                            'Drivetrain',
                            drivetrain,
                            () => setShowDrivetrainModal(true),
                            'Select Drivetrain'
                        )}

                        {/* Transmission Dropdown */}
                        {renderDropdownField(
                            'Transmission',
                            transmission,
                            () => setShowTransmissionModal(true),
                            'Select Transmission'
                        )}

                        {/* Modifications Section */}
                        {renderSection('MODIFICATIONS')}

                        <CustomInputField
                            placeholder={'Performance Mods (comma separated, e.g., Stage 2 Tune, Downpipes)'}
                            label={'Performance Mods'}
                            value={performance}
                            onChangeText={setPerformance}
                            multiline={true}
                            lableStyle={true}
                        />

                        <CustomInputField
                            placeholder={'Suspension Mods (comma separated, e.g., Coilovers, Adjustable Arms)'}
                            label={'Suspension Mods'}
                            value={suspension}
                            onChangeText={setSuspension}
                            multiline={true}
                            lableStyle={true}
                        />

                        <CustomInputField
                            placeholder={'Brake Upgrades (comma separated, e.g., Brembo GT Kit)'}
                            label={'Brake Upgrades'}
                            value={brakes}
                            onChangeText={setBrakes}
                            multiline={true}
                            lableStyle={true}
                        />

                        {/* Style Section */}
                        {renderSection('STYLE')}

                        <CustomInputField
                            placeholder={'Paint/Wrap Details'}
                            label={'Paint/Wrap'}
                            value={paintWrap}
                            onChangeText={setPaintWrap}
                            lableStyle={true}
                        />

                        <CustomInputField
                            placeholder={'Exterior Mods (comma separated, e.g., Carbon Fiber Splitter, Spoiler)'}
                            label={'Exterior Mods'}
                            value={exteriorMods}
                            onChangeText={setExteriorMods}
                            multiline={true}
                            lableStyle={true}
                        />

                        <CustomInputField
                            placeholder={'Interior Mods (comma separated, e.g., Alcantara Steering Wheel)'}
                            label={'Interior Mods'}
                            value={interiorMods}
                            onChangeText={setInteriorMods}
                            multiline={true}
                            lableStyle={true}
                        />

                        {/* Status Section */}
                        {renderSection('STATUS')}

                        <CustomInputField
                            placeholder={'Current Mileage'}
                            label={'Mileage'}
                            value={mileage}
                            onChangeText={setMileage}
                            keyboardType={'numeric'}
                            lableStyle={true}
                        />

                        {/* Build Stage Dropdown */}
                        {renderDropdownField(
                            'Build Stage',
                            buildStage,
                            () => setShowBuildStageModal(true),
                            'Select Build Stage'
                        )}

                        <CustomInputField
                            placeholder={'Owner notes (250 character limit)'}
                            label={'Owner Notes'}
                            value={ownerNote}
                            onChangeText={(text) => {
                                if (text.length <= 250) {
                                    setOwnerNote(text);
                                }
                            }}
                            multiline={true}
                            lableStyle={true}
                        />
                        <CustomText style={{
                            fontSize: 12,
                            color: isDarkMode ? '#999' : '#666',
                            alignSelf: 'flex-end',
                            marginTop: -5
                        }}>
                            {ownerNote.length}/250
                        </CustomText>

                        {/* Performance Stats Section */}
                        {renderSection('PERFORMANCE STATS')}

                        <CustomInputField
                            placeholder={'0-60 mph time (e.g., 3.8s)'}
                            label={'0-60 mph'}
                            value={zeroToSixty}
                            onChangeText={setZeroToSixty}
                            lableStyle={true}
                        />

                        <CustomInputField
                            placeholder={'Quarter Mile time (e.g., 11.9s)'}
                            label={'Quarter Mile'}
                            value={quarterMile}
                            onChangeText={setQuarterMile}
                            lableStyle={true}
                        />

                        {/* Budget Section */}
                        {renderSection('PRICING')}

                        <CustomInputField
                            placeholder={'Current Value/Price'}
                            label={'Current Price ($)'}
                            value={currentPrice}
                            onChangeText={setCurrentPrice}
                            keyboardType={'numeric'}
                            lableStyle={true}
                        />

                        {/* Vehicle Image - SINGLE IMAGE */}
                        {renderSection('VEHICLE IMAGE')}

                        <TouchableOpacity 
                            onPress={handleImagePick}
                            style={{ width: '100%' }}
                        >
                            <View style={[
                                styles.uploadBox,
                                { 
                                    borderColor: isDarkMode ? '#404040' : '#ddd',
                                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9'
                                }
                            ]}>
                                <Upload />
                                <CustomText style={{ 
                                    color: isDarkMode ? '#ccc' : '#666',
                                    marginTop: 10
                                }}>
                                    {vehicleImage ? 'Change Vehicle Image' : 'Upload Vehicle Image'}
                                </CustomText>
                            </View>
                        </TouchableOpacity>

                        {/* Display Selected Image */}
                        {vehicleImage && (
                            <View style={styles.imageContainer}>
                                <View style={styles.imageWrapper}>
                                    <Image 
                                        source={{ uri: vehicleImage.uri }} 
                                        style={styles.imagePreview}
                                    />
                                    <TouchableOpacity
                                        onPress={removeImage}
                                        style={styles.removeImageButton}
                                    >
                                        <CustomText style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>×</CustomText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={onSubmit}
                            disabled={loading}
                            style={{ marginTop: 20 }}
                        >
                            <LinearGradient
                                colors={loading ? ['#999', '#666'] : ['#21B7FF', '#0084F8']}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.submitButton}
                            >
                                <Text style={styles.submitText}>
                                    {loading ? 'Saving...' : (isEditMode ? 'Update Vehicle' : 'Add Vehicle')}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </Animated.View>
        )
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : 'white'
        },
        dropdownField: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
            paddingHorizontal: 15,
            borderRadius: 8,
            borderWidth: 1,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            width: '80%',
            borderRadius: 12,
            padding: 20,
            maxHeight: '60%',
        },
        modalOption: {
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginBottom: 10,
            alignItems: 'center',
        },
        uploadBox: {
            borderWidth: 2,
            borderStyle: 'dashed',
            borderRadius: 12,
            paddingVertical: 30,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15
        },
        imageContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
            width: '100%'
        },
        imageWrapper: {
            position: 'relative',
            width: 150,
            height: 150,
            borderRadius: 8,
            overflow: 'hidden',
        },
        imagePreview: {
            width: '100%',
            height: '100%',
            borderRadius: 8,
        },
        removeImageButton: {
            position: 'absolute',
            top: 5,
            right: 5,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: 'rgba(255, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center'
        },
        submitButton: {
            paddingVertical: 15,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignItems: 'center',
            width: 300
        },
        submitText: {
            fontSize: 16,
            fontWeight: '600',
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: '#fff'
        }
    });

    return (
        <ImageBackground source={IMG.bgShadow} style={styles.container}>
            <StatusBar 
                translucent 
                backgroundColor="transparent" 
                barStyle={isDarkMode ? "light-content" : "dark-content"} 
            />
            {renderHeader()}
            {renderItems()}
            
            {/* Dropdown Modals */}
            {renderDropdownModal(
                showDrivetrainModal,
                setShowDrivetrainModal,
                drivetrainOptions,
                drivetrain,
                setDrivetrain,
                'Select Drivetrain'
            )}
            
            {renderDropdownModal(
                showTransmissionModal,
                setShowTransmissionModal,
                transmissionOptions,
                transmission,
                setTransmission,
                'Select Transmission'
            )}
            
            {renderDropdownModal(
                showBuildStageModal,
                setShowBuildStageModal,
                buildStageOptions,
                buildStage,
                setBuildStage,
                'Select Build Stage'
            )}
        </ImageBackground>
    )
}

export default AddVehicleSpecs;