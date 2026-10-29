// Marketplace (OLX-style) categories and per-category fields.
// Ported 1:1 from web: Pages/MarketPlace/Product/AddProduct.jsx + Productdetails.jsx

export const CATEGORIES = {
  Cars: ['Cars'],
  Bikes: ['Motorcycles', 'Scooters', 'Bicycles'],
  'Commercial Vehicles': ['Trucks', 'Buses', 'Tractors', 'Other Commercial Vehicles'],
  'Spare Parts': ['Car Spare Parts', 'Bike Spare Parts', 'Commercial Vehicle Spare Parts', 'Accessories'],
  Services: ['Repair & Maintenance', 'Towing', 'Driver', 'Rental', 'Other Services'],
};

const FUEL_CARS = ['CNG & Hybrids', 'Diesel', 'Electric', 'LPG', 'Petrol'];
const FUEL_BIKES = ['Electric', 'Others', 'CNG', 'Hybrid', 'Petrol'];
const FUEL_COMMERCIAL = ['Diesel', 'CNG', 'Electric', 'Petrol', 'Others'];

const vehicleBase = fuelOptions => [
  { name: 'Brand', label: 'Brand', type: 'brand', required: true },
  { name: 'Model', label: 'Model', type: 'text', required: true },
  { name: 'Variant', label: 'Variant', type: 'text' },
  { name: 'Year', label: 'Year', type: 'number', maxLength: 4, required: true },
  { name: 'Fuel', label: 'Fuel', type: 'options', options: fuelOptions, required: true },
  { name: 'KmDriven', label: 'KM driven', type: 'number', maxLength: 6, required: true },
];

export const getFields = (category, subCategory) => {
  if (subCategory === 'Cars') {
    return [
      ...vehicleBase(FUEL_CARS),
      { name: 'Transmission', label: 'Transmission', type: 'options', options: ['Automatic', 'Manual'], required: true },
      { name: 'NoOfOwners', label: 'No. of owners', type: 'options', options: ['1st', '2nd', '3rd', '4th', '4+'], required: true },
    ];
  }
  if (subCategory === 'Motorcycles' || subCategory === 'Scooters') return vehicleBase(FUEL_BIKES);
  if (subCategory === 'Bicycles') {
    return [
      { name: 'Brand', label: 'Brand', type: 'brand' },
      { name: 'Condition', label: 'Condition', type: 'options', options: ['New', 'Used', 'Refurbished'], required: true },
    ];
  }
  if (category === 'Commercial Vehicles') {
    return [
      { name: 'VehicleType', label: 'Vehicle type', type: 'options', options: ['Truck', 'Bus', 'Tractor', 'JCB / Earthmover', 'Pickup', 'Auto Rickshaw', 'Other'], required: true },
      ...vehicleBase(FUEL_COMMERCIAL),
      { name: 'PayloadTons', label: 'Payload (tons)', type: 'number' },
      { name: 'NoOfWheels', label: 'No. of wheels', type: 'number' },
      { name: 'RegistrationState', label: 'Registration state', type: 'text' },
    ];
  }
  if (category === 'Spare Parts') {
    return [
      { name: 'Condition', label: 'Condition', type: 'options', options: ['New', 'Used', 'Refurbished'], required: true },
      { name: 'CompatibleBrand', label: 'Compatible brand', type: 'brand' },
    ];
  }
  if (category === 'Services') {
    return [
      { name: 'ServiceType', label: 'Service type', type: 'options', options: ['Repair & Maintenance', 'Towing', 'Car Wash / Detailing', 'Driver', 'Rental', 'Insurance', 'Documentation', 'Other'], required: true },
      { name: 'PricingType', label: 'Pricing type', type: 'options', options: ['Fixed', 'Starting From', 'Per Hour', 'Per Km'], required: true },
      { name: 'ServiceArea', label: 'Service area', type: 'text' },
    ];
  }
  return [];
};

// New listings use `Title`; older ones only have `ProductName`.
export const productTitle = p => p?.Title || p?.ProductName || '';

// Rows shown on product detail screens (label, value)
const DETAIL_ROWS = [
  ['Category', 'Category'], ['SubCategory', 'Type'], ['VehicleType', 'Vehicle type'],
  ['Brand', 'Brand'], ['Model', 'Model'], ['Variant', 'Variant'], ['Year', 'Year'],
  ['Fuel', 'Fuel'], ['KmDriven', 'KM driven', v => `${Number(v).toLocaleString('en-IN')} km`],
  ['Transmission', 'Transmission'], ['NoOfOwners', 'Owners'],
  ['PayloadTons', 'Payload (tons)'], ['NoOfWheels', 'Wheels'], ['RegistrationState', 'Registration state'],
  ['Condition', 'Condition'], ['CompatibleBrand', 'Compatible brand'],
  ['ServiceType', 'Service type'], ['PricingType', 'Pricing type'], ['ServiceArea', 'Service area'],
];

export const detailRows = p =>
  DETAIL_ROWS.map(([key, label, fmt]) => {
    const v = p?.[key];
    return v === undefined || v === null || v === '' ? null : [label, fmt ? fmt(v) : String(v)];
  }).filter(Boolean);
