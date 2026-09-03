import { connectDB } from "../../lib/db.js";
import Review from "../../lib/models/Review.js";
import Product from "../../lib/models/Product.js";

async function recomputeProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { productId } },
    { $group: { _id: "$productId", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Product.updateOne(
    { _id: productId },
    { $set: { avgRating: Math.round(avg * 10) / 10, reviewCount: count } }
  );
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { productId } = req.query;
    if (!productId) {
      res.status(400).json({ message: "productId requis" });
      return;
    }
    try {
      const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).lean();
      res.status(200).json(reviews);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
    return;
  }

  if (req.method === "POST") {
    const { productId, author, rating, comment } = req.body || {};
    if (!productId || !author?.trim() || !comment?.trim() || !rating) {
      res.status(400).json({ message: "Tous les champs sont requis" });
      return;
    }
    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      res.status(400).json({ message: "Note invalide" });
      return;
    }
    try {
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({ message: "Produit introuvable" });
        return;
      }
      const review = await Review.create({
        productId,
        author: author.trim().slice(0, 60),
        rating: numericRating,
        comment: comment.trim().slice(0, 600),
      });
      await recomputeProductRating(product._id);
      res.status(201).json(review);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
    return;
  }

  res.status(405).json({ message: "Méthode non autorisée" });
}
