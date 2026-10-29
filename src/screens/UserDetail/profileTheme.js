// Shared palette for the profile screens (same slate surfaces as the home feed).
export const profilePalette = (isDark, accent) => ({
  screen: isDark ? '#0B1220' : '#EEF1F6',
  card: isDark ? '#131B2B' : '#FFFFFF',
  chip: isDark ? '#1B2538' : '#F1F5F9',
  border: accent + (isDark ? '55' : '40'),
  text: isDark ? '#F3F4F6' : '#0F172A',
  muted: isDark ? '#94A3B8' : '#64748B',
  divider: isDark ? '#1E293B' : '#E2E8F0',
  danger: '#EF4444',
});
