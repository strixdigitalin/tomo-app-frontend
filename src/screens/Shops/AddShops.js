import React from 'react';
import ShopFormScreen from './ShopFormScreen';

// A user's own shop listing (web: MarketPlace/Shop/AddShop.jsx)
const AddShops = props => <ShopFormScreen {...props} variant="listing" />;

export default AddShops;
