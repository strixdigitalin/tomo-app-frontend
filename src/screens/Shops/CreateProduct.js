import React from 'react';
import ProductFormScreen from './ProductFormScreen';

// A user's own shop listing (web: MarketPlace/Product/AddProduct.jsx)
const CreateProducts = props => <ProductFormScreen {...props} variant="listing" />;

export default CreateProducts;
