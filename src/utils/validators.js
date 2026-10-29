// Shared form validators. Every validator returns an error string, or null when valid.
// Used through useForm()'s schema:  { Email: v => required('Email')(v) || email(v) }
//
// NOTE: Do not use `password` for LOGIN — accounts created before the 6-char rule may be
// shorter. Login only checks that a password was entered.

const str = v => (v === undefined || v === null ? '' : String(v));

export const required = (label = 'This field') => v =>
  str(v).trim().length === 0 ? `${label} is required` : null;

export const email = v => {
  if (!str(v).trim()) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(str(v).trim()) ? null : 'Please enter a valid email address';
};

// New passwords: at least 6 characters
export const password = v => {
  if (!str(v)) return null;
  return str(v).length >= 6 ? null : 'Password must be at least 6 characters';
};

export const matches = (getOther, message = 'Passwords do not match') => (v, values) =>
  str(v) === str(getOther(values)) ? null : message;

// Indian-style 10 digit mobile number (web: /^\d{10}$/)
export const phone10 = v => {
  if (!str(v)) return null;
  return /^\d{10}$/.test(str(v)) ? null : 'Enter a valid 10 digit mobile number';
};

export const username = v => {
  const s = str(v).trim();
  if (!s) return null;
  if (s.length < 3) return 'Username must be at least 3 characters';
  if (s.length > 30) return 'Username must be 30 characters or less';
  return /^[A-Za-z0-9._@-]+$/.test(s) ? null : 'Use only letters, numbers and . _ - @';
};

export const minLength = (n, label = 'This field') => v =>
  str(v).trim() && str(v).trim().length < n ? `${label} must be at least ${n} characters` : null;

export const maxLength = (n, label = 'This field') => v =>
  str(v).length > n ? `${label} must be ${n} characters or less` : null;

export const number = (label = 'Value', { min, max, integer = false } = {}) => v => {
  const s = str(v).trim();
  if (!s) return null;
  const n = Number(s);
  if (Number.isNaN(n)) return `${label} must be a number`;
  if (integer && !Number.isInteger(n)) return `${label} must be a whole number`;
  if (min !== undefined && n < min) return `${label} must be at least ${min}`;
  if (max !== undefined && n > max) return `${label} must be at most ${max}`;
  return null;
};

export const price = (label = 'Price') => v => {
  const s = str(v).trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isNaN(n) || n <= 0 ? `Enter a valid ${label.toLowerCase()}` : null;
};

// Vehicle / product year, same range as web (1950 → next year)
export const year = v => {
  const s = str(v).trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isInteger(n) && n >= 1950 && n <= new Date().getFullYear() + 1 ? null : 'Enter a valid year';
};

export const url = v => {
  const s = str(v).trim();
  if (!s) return null;
  return /^(https?:\/\/)[^\s.]+\.[^\s]{2,}$/i.test(s) ? null : 'Enter a valid link (https://...)';
};

export const mustBeTrue = message => v => (v ? null : message);

// Combine validators: runs in order, returns the first error
export const compose = (...validators) => (v, values) => {
  for (const fn of validators) {
    const err = fn(v, values);
    if (err) return err;
  }
  return null;
};
