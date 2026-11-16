// Shared constants + helpers for vehicle service records
// (web: Seller/Vehicle/* and Profile/Car/CurrentCarDetailModel.jsx).
export const WORK_TYPES = [
  { value: 'service', label: 'Service' },
  { value: 'repair', label: 'Repair' },
  { value: 'modification', label: 'Modification' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'other', label: 'Other' },
];

export const MOD_GROUPS = [
  { key: 'performance', label: 'Performance' },
  { key: 'suspension', label: 'Suspension' },
  { key: 'brakes', label: 'Brakes' },
  { key: 'exteriorMods', label: 'Exterior' },
  { key: 'interiorMods', label: 'Interior' },
];

export const SPEC_LABELS = {
  horsepower: ['Horsepower', ' hp'],
  torque: ['Torque', ' Nm'],
  mileage: ['Mileage', ' km'],
  engine: ['Engine', ''],
  transmission: ['Transmission', ''],
  drivetrain: ['Drivetrain', ''],
  buildStage: ['Build stage', ''],
  paintWrap: ['Paint / Wrap', ''],
};

export const SPEC_NUMBER_FIELDS = [
  { key: 'horsepower', label: 'Horsepower (hp)' },
  { key: 'torque', label: 'Torque (Nm)' },
  { key: 'mileage', label: 'Mileage (km)' },
];
export const SPEC_TEXT_FIELDS = [
  { key: 'engine', label: 'Engine' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'drivetrain', label: 'Drivetrain' },
  { key: 'buildStage', label: 'Build stage' },
  { key: 'paintWrap', label: 'Paint / Wrap' },
];

export const STATUS_COLORS = {
  pending: '#F59E0B',
  approved: '#22C55E',
  rejected: '#EF4444',
};

export const fmtDate = d =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
export const fmtMoney = n => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);
export const carName = car => {
  const i = car?.VehicleInfo || {};
  return i.vehicleName || [i.make, i.model].filter(Boolean).join(' ') || 'Vehicle';
};
// The vehicle QR holds the car id (24 hex chars) — possibly inside a URL.
export const extractCarId = (text = '') => {
  const m = String(text).match(/[a-f0-9]{24}/i);
  return m ? m[0] : '';
};
// accepts both { data: [] } and { data: { data: [] } }
export const listFrom = res => (Array.isArray(res?.data) ? res.data : Array.isArray(res?.data?.data) ? res.data.data : []);
