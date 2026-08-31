import { connectDB } from "../../lib/db.js";
import Product from "../../lib/models/Product.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Méthode non autorisée" });
    return;
  }

  try {
    await connectDB();
    const product = await Product.findOne({ slug: req.query.slug }).lean();
    if (!product) {
      res.status(404).json({ message: "Produit introuvable" });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}
