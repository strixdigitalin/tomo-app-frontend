import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { BackOuterWhite, PrimaryBackArrow } from '../../assets/SVGs';
import Row from '../../components/wrapper/row';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { useSelector } from 'react-redux';
import useLoader from '../../utils/LoaderHook';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import CustomText from '../../components/TextComponent';
import MessageListShimmer from '../../components/Skeletons/MessageListShimmer';

// ─── Card — module scope + memo'd so it doesn't remount on every parent render ─
const Card = React.memo(({ item, isDarkMode, animatedValue, onPress }) => (
    <Animated.View style={[cardStyles.cardContainer, { backgroundColor: isDarkMode ? '#252525' : null, opacity: animatedValue }]}>
        <Image source={{ uri: item?.Image }} style={cardStyles.profileImage} />
        <TouchableOpacity style={cardStyles.textContainer} onPress={onPress}>
            <CustomText style={cardStyles.name}>{item?.UserName}</CustomText>
        </TouchableOpacity>
    </Animated.View>
));
Card.displayName = 'Card';

const cardStyles = StyleSheet.create({
    cardContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 5 },
    profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
    textContainer: { flex: 1 },
    name: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
});

const Follwing = ({ navigation }) => {
    const [animatedValue] = useState(new Animated.Value(0));
    const { isDarkMode } = useSelector(state => state.theme);
    const { showLoader, hideLoader } = useLoader()
    const [Allfollowers, setAllFollowers] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
        fetchData()
    }, []);

    const fetchData = async () => {
        setLoading(true)
        const res = await apiGet(urls.getAllFollowings)
        setAllFollowers(res?.data)
        setLoading(false)
    }

    const renderHeader = () => (
        <Row style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                {isDarkMode ? <BackOuterWhite /> : <PrimaryBackArrow />}
            </TouchableOpacity>
            <CustomText style={styles.headerText}>
                Following
            </CustomText>
        </Row>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : '#fff',
        },
        header: {
            paddingTop: 50,
            paddingHorizontal: 20,
            gap: 90,
        },
        headerText: {
            fontSize: 20,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
    });

    if (loading) {
        return <MessageListShimmer />;
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            {renderHeader()}
            <FlatList
                style={{ marginTop: 20, paddingHorizontal: 10 }}
                data={Allfollowers}
                keyExtractor={(item, index) => item?._id || String(index)}
                renderItem={({ item }) => (
                    <Card
                        item={item}
                        isDarkMode={isDarkMode}
                        animatedValue={animatedValue}
                        onPress={() => navigation.navigate('OtherUserDetail', { userId: item?._id })}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={<CustomText
                    style={{
                        alignSelf: 'center',
                        fontFamily: FONTS_FAMILY.SourceSans3_Medium,
                        marginTop: 20
                    }}
                >No Data Found!</CustomText>}
            />
        </View>
    );
};

export default Follwing;
