import { connectDB } from "../../lib/db.js";
import Product from "../../lib/models/Product.js";
import Order from "../../lib/models/Order.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Méthode non autorisée" });
    return;
  }

  const { items, customerName, customerEmail, address } = req.body || {};

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
    let total = 0;

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
      total += product.price * quantity;
    }

    for (const item of orderItems) {
      await Product.updateOne({ _id: item.productId }, { $inc: { stock: -item.quantity } });
    }

    const order = await Order.create({
      items: orderItems,
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
