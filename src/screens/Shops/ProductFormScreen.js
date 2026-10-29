import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import FormScreen, { FormSection } from '../../components/FormScreen';
import FormField from '../../components/FormField';
import FormButton from '../../components/FormButton';
import OptionChips from '../../components/OptionChips';
import MultiImagePicker from '../../components/MultiImagePicker';
import ProductCategoryForm from '../../components/ProductCategoryForm';
import { BASE_URL, apiGet, getItem } from '../../utils/Apis';
import urls from '../../config/urls';
import { ToastMsg } from '../../utils/helperFunctions';
import useForm from '../../utils/useForm';
import { compose, required, maxLength, price as priceRule, year as yearRule } from '../../utils/validators';
import { getFields, productTitle } from '../../utils/productFields';

// One add / edit product form for both flows (web: MarketPlace/Product/AddProduct.jsx and
// Seller/Product/SellerAddProduct.jsx — same fields, only the shop + endpoints differ).
//   variant 'listing' → a user's own shop listing   (route.params.shopId / .product)
//   variant 'seller'  → a seller's product          (route.params.shopId / .product, shop picker)
const SCHEMA = {
    Title: compose(required('Title'), maxLength(100, 'Title')),
    Price: compose(required('Price'), priceRule('Price')),
    Description: compose(required('Description'), maxLength(1500, 'Description')),
    OwnerNote: maxLength(300, 'Owner note'),
};

const ProductFormScreen = ({ navigation, route, variant }) => {
    const isSeller = variant === 'seller';
    const editing = route?.params?.product || null;
    const isEdit = !!editing;

    const form = useForm({
        Title: productTitle(editing),
        Price: editing?.Price ? String(editing.Price) : '',
        Description: editing?.Description || '',
        OwnerNote: editing?.OwnerNote || '',
    }, SCHEMA);
    const { values: v, errors: e } = form;

    // category + its fields
    const [category, setCategory] = useState(editing?.Category || '');
    const [subCategory, setSubCategory] = useState(editing?.SubCategory || '');
    const [details, setDetails] = useState(() => {
        const d = {};
        getFields(editing?.Category, editing?.SubCategory).forEach(f => { if (editing?.[f.name] != null) d[f.name] = String(editing[f.name]); });
        return d;
    });
    const [catErrors, setCatErrors] = useState({});

    // images
    const [existingImages, setExistingImages] = useState(editing?.Images || []);
    const [images, setImages] = useState([]);
    const [imageError, setImageError] = useState(null);

    // seller: which shop
    const [shops, setShops] = useState([]);
    const [shopId, setShopId] = useState(
        route?.params?.shopId || editing?.SellerShop?._id || editing?.SellerShop || editing?.Shop?._id || editing?.Shop || null,
    );
    const [shopError, setShopError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isSeller || isEdit) return;
        (async () => {
            try {
                const res = await apiGet(urls.sellerAllShop);
                const list = res?.data || [];
                setShops(list);
                if (!shopId && list.length === 1) setShopId(list[0]._id);
            } catch (err) {
                console.log('ProductForm fetchShops error', err);
            }
        })();
    }, []);

    const onSelectSub = useCallback((cat, sub) => {
        if (sub !== subCategory) setDetails({});
        setCategory(cat);
        setSubCategory(sub);
        setCatErrors({});
    }, [subCategory]);

    const onChangeDetail = useCallback((name, value) => {
        setDetails(prev => ({ ...prev, [name]: value }));
        setCatErrors(prev => (prev[name] ? { ...prev, [name]: null } : prev));
    }, []);

    const validateCategory = useCallback(() => {
        const errs = {};
        if (!category || !subCategory) errs._category = 'Choose a category first';
        else {
            getFields(category, subCategory).forEach(f => {
                if (f.required && !String(details[f.name] ?? '').trim()) errs[f.name] = `${f.label} is required`;
            });
            if (details.Year) {
                const err = yearRule(details.Year);
                if (err) errs.Year = err;
            }
        }
        setCatErrors(errs);
        return errs;
    }, [category, subCategory, details]);

    const onSubmit = useCallback(async () => {
        const { ok, firstError } = form.validateAll();
        const catErrs = validateCategory();
        const catFirst = Object.values(catErrs).find(Boolean);
        const needShop = !isEdit && !shopId;
        const noImage = existingImages.length + images.length === 0;
        if (needShop) setShopError('Please select a shop');
        if (noImage) setImageError('At least one image is required');

        if (needShop) return ToastMsg('Please select a shop');
        if (catFirst) return ToastMsg(catFirst);
        if (!ok) return ToastMsg(firstError);
        if (noImage) return ToastMsg('At least one image is required');

        try {
            setSaving(true);
            const token = await getItem('token');
            const fd = new FormData();
            if (!isEdit) fd.append(isSeller ? 'SellerShop' : 'Shop', shopId);
            else fd.append('ExistingImages', JSON.stringify(existingImages));

            fd.append('Category', category);
            fd.append('SubCategory', subCategory);
            fd.append('Title', v.Title.trim());
            // older backends still read these names
            fd.append('ProductName', v.Title.trim());
            fd.append('ProductDetails', v.Description.trim());
            fd.append('Description', v.Description.trim());
            fd.append('Price', v.Price);
            fd.append('OwnerNote', v.OwnerNote.trim());
            getFields(category, subCategory).forEach(f => {
                const val = (details[f.name] ?? '').toString().trim();
                if (val) fd.append(f.name, val);
            });
            if (isSeller) {
                ['VehicleInfo', 'Power', 'Modifications', 'Style', 'Status', 'PerformanceStats'].forEach(k => fd.append(k, JSON.stringify({})));
            }
            images.forEach((img, i) => {
                fd.append('Images', {
                    uri: Platform.OS === 'android' ? img.uri : img.uri.replace('file://', ''),
                    type: img.type || 'image/jpeg',
                    name: img.name || `product_${i}.jpg`,
                });
            });

            const base = isSeller
                ? (isEdit ? `${urls.sellerUpdateProduct}/${editing._id}` : urls.sellerCreateProduct)
                : (isEdit ? `${urls.updateListingProduct}/${editing._id}` : '/api/user/CreateProduct');
            const res = await fetch(`${BASE_URL}${base}`, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const result = await res.json();
            ToastMsg(result?.message || (isEdit ? 'Product updated' : 'Product added'));
            if (res.ok) navigation.goBack();
        } catch (err) {
            console.log('ProductForm submit error', err);
            ToastMsg('Something went wrong, please try again');
        } finally {
            setSaving(false);
        }
    }, [form, validateCategory, isEdit, isSeller, shopId, existingImages, images, category, subCategory, details, v, editing, navigation]);

    const field = name => ({
        value: v[name],
        error: e[name],
        onChangeText: t => form.set(name, t),
        onBlur: () => form.blur(name),
    });

    const shopNames = useMemo(() => shops.map(s => s.Name), [shops]);
    const selectedShopName = shops.find(s => s._id === shopId)?.Name || '';

    return (
        <FormScreen
            title={isEdit ? 'Update Product' : 'Add Product'}
            subtitle={isSeller ? 'List something in your shop' : 'List something for sale'}
            onBack={() => navigation.goBack()}
            footer={<FormButton label={isEdit ? 'Update Product' : 'Add Product'} onPress={onSubmit} loading={saving} />}>

            {isSeller && !isEdit && (
                <FormSection title="Shop">
                    {shops.length === 0 ? null : (
                        <OptionChips
                            label="Select shop" required options={shopNames} value={selectedShopName} allowClear={false}
                            error={shopError}
                            onChange={name => { setShopId(shops.find(s => s.Name === name)?._id || null); setShopError(null); }}
                        />
                    )}
                </FormSection>
            )}

            <FormSection title="Category" hint="Pick what you are listing — the form adapts to it">
                <ProductCategoryForm
                    category={category} subCategory={subCategory} details={details}
                    onSelectSub={onSelectSub} onChangeDetail={onChangeDetail} errors={catErrors}
                />
            </FormSection>

            <FormSection title="Details">
                <FormField label="Title" required placeholder="e.g. Honda City 2019 ZX" maxLength={100} autoCapitalize="words" {...field('Title')} />
                <FormField label="Price (₹)" required placeholder="Enter price" keyboardType="decimal-pad" {...field('Price')}
                    onChangeText={t => form.set('Price', t.replace(/[^0-9.]/g, ''))} />
                <FormField label="Description" required placeholder="Describe your item..." multiline maxLength={1500} showCounter autoCapitalize="sentences" {...field('Description')} />
                <FormField label="Owner note" placeholder="Anything buyers should know (optional)" multiline maxLength={300} showCounter autoCapitalize="sentences" {...field('OwnerNote')} />
            </FormSection>

            <FormSection title="Photos">
                <MultiImagePicker
                    label="Images" required existing={existingImages} images={images}
                    onChangeExisting={setExistingImages} onChangeImages={arr => { setImages(arr); setImageError(null); }}
                    error={imageError}
                />
            </FormSection>
        </FormScreen>
    );
};

export default ProductFormScreen;
