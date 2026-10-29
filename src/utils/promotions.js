// Promotions come from one endpoint (api/user/GetAllApprovedPostPromotions) and are either
// a post promotion (promo.Post) or a shop promotion (promo.SellerShop / promo.Seller).
// Same rule as web's RightPanel.jsx.
export const isShopPromotion = promo =>
  promo?.Type === 'Shop' || (!promo?.Post && !!(promo?.SellerShop || promo?.Seller));

export const timeAgo = date => {
  if (!date) return '';
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d > 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
};
