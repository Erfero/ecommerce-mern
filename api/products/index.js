import { connectDB } from "../../lib/db.js";
import Product from "../../lib/models/Product.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Méthode non autorisée" });
    return;
  }

  try {
    await connectDB();
    const products = await Product.find().sort({ name: 1 }).lean();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}
