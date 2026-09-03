import { connectDB } from "../../lib/db.js";
import Product from "../../lib/models/Product.js";
import Order from "../../lib/models/Order.js";
import Coupon from "../../lib/models/Coupon.js";
import { computeDiscount } from "../../lib/coupon.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Méthode non autorisée" });
    return;
  }

  const { items, customerName, customerEmail, address, couponCode } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: "Le panier est vide" });
    return;
  }
  if (!customerName || !customerEmail || !address) {
    res.status(400).json({ message: "Nom, email et adresse sont requis" });
    return;
  }

  try {
    await connectDB();

    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productById = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productById.get(String(item.productId));
      const quantity = Number(item.quantity) || 0;
      if (!product || quantity < 1) {
        res.status(400).json({ message: "Article invalide dans le panier" });
        return;
      }
      if (product.stock < quantity) {
        res.status(409).json({ message: `Stock insuffisant pour "${product.name}"` });
        return;
      }
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      });
      subtotal += product.price * quantity;
    }

    // Coupon is re-validated server-side — the client-displayed discount is
    // never trusted as-is.
    let discount = 0;
    let appliedCode;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: String(couponCode).trim().toUpperCase(), active: true }).lean();
      if (!coupon) {
        res.status(400).json({ message: "Code promo invalide ou expiré" });
        return;
      }
      discount = computeDiscount(coupon, subtotal);
      appliedCode = coupon.code;
    }

    const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100);

    for (const item of orderItems) {
      await Product.updateOne({ _id: item.productId }, { $inc: { stock: -item.quantity } });
    }

    const order = await Order.create({
      items: orderItems,
      subtotal,
      discount,
      couponCode: appliedCode,
      total,
      customerName,
      customerEmail,
      address,
    });

    res.status(201).json({ orderId: order._id, total });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}
