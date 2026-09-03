export function computeDiscount(coupon, subtotal) {
  if (coupon.type === "percent") return Math.round(subtotal * (coupon.value / 100) * 100) / 100;
  return Math.min(coupon.value, subtotal);
}
