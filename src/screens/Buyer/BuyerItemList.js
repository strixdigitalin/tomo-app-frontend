

import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const shops = [
  { id: '1', name: 'Sports World', address: 'MG Road, Delhi', image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Fitness Hub', address: 'Brigade Road, Bangalore', image: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Active Zone', address: 'Bandra, Mumbai', image: 'https://via.placeholder.com/150' },
];

const MarketplaceHomeScreen = ({ navigation }) => {
  const renderShop = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ShopDetails', { item })}>
      <Image source={{ uri: item.image }} style={styles.shopImage} />
      <View style={styles.shopInfo}>
        <Text style={styles.shopName}>{item.name}</Text>
        <Text style={styles.shopAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Marketplace</Text>
      <Image
        source={{ uri: 'https://via.placeholder.com/400x200?text=Map+Placeholder' }}
        style={styles.mapImage}
        resizeMode="cover"
      />
      <FlatList
        data={shops}
        keyExtractor={(item) => item.id}
        renderItem={renderShop}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default MarketplaceHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  heading: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mapImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  shopAddress: {
    fontSize: 14,
    color: '#aaa',
  },
});
