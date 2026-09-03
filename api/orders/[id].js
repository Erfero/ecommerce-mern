import { connectDB } from "../../lib/db.js";
import Order from "../../lib/models/Order.js";
import { computeStatus } from "../../lib/orderStatus.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Méthode non autorisée" });
    return;
  }

  try {
    await connectDB();
    const order = await Order.findById(req.query.id).lean();
    if (!order) {
      res.status(404).json({ message: "Commande introuvable" });
      return;
    }
    res.status(200).json({ ...order, ...computeStatus(order.createdAt) });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}
