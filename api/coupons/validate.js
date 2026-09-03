import { connectDB } from "../../lib/db.js";
import Coupon from "../../lib/models/Coupon.js";
import { computeDiscount } from "../../lib/coupon.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Méthode non autorisée" });
    return;
  }

  const { code, subtotal } = req.body || {};
  if (!code || typeof subtotal !== "number") {
    res.status(400).json({ message: "Code et sous-total requis" });
    return;
  }

  try {
    await connectDB();
    const coupon = await Coupon.findOne({ code: String(code).trim().toUpperCase(), active: true }).lean();
    if (!coupon) {
      res.status(404).json({ message: "Code promo invalide ou expiré" });
      return;
    }
    const discount = computeDiscount(coupon, subtotal);
    res.status(200).json({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
      total: Math.max(0, Math.round((subtotal - discount) * 100) / 100),
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}
