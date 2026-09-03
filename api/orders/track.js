import { connectDB } from "../../lib/db.js";
import Order from "../../lib/models/Order.js";
import { computeStatus } from "../../lib/orderStatus.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Méthode non autorisée" });
    return;
  }

  const { orderId, email } = req.body || {};
  if (!orderId || !email) {
    res.status(400).json({ message: "Numéro de commande et email requis" });
    return;
  }

  try {
    await connectDB();
    const order = await Order.findById(orderId).lean();
    if (!order || order.customerEmail.toLowerCase() !== String(email).toLowerCase()) {
      res.status(404).json({ message: "Aucune commande trouvée avec ces informations" });
      return;
    }
    res.status(200).json({ ...order, ...computeStatus(order.createdAt) });
  } catch {
    res.status(404).json({ message: "Aucune commande trouvée avec ces informations" });
  }
}
