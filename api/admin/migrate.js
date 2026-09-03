import { connectDB } from "../../lib/db.js";
import Product from "../../lib/models/Product.js";
import Coupon from "../../lib/models/Coupon.js";
import Review from "../../lib/models/Review.js";
import { SEED_PRODUCTS, SEED_COUPONS } from "../../lib/seedProducts.js";

const SAMPLE_REVIEWS = [
  { author: "Camille", rating: 5, comment: "Exactement ce qu'il me fallait, livraison rapide et qualité au rendez-vous." },
  { author: "Yanis", rating: 4, comment: "Très content de l'achat, bon rapport qualité-prix, je recommande." },
  { author: "Sofia", rating: 5, comment: "Parfait, aucune déception, je recommande sans hésiter." },
  { author: "Thomas", rating: 3, comment: "Correct mais rien d'exceptionnel, fait le travail sans plus." },
];

async function recomputeRating(productId) {
  const stats = await Review.aggregate([
    { $match: { productId } },
    { $group: { _id: "$productId", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Product.updateOne({ _id: productId }, { $set: { avgRating: Math.round(avg * 10) / 10, reviewCount: count } });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Méthode non autorisée" });
    return;
  }
  if (req.headers["x-seed-secret"] !== process.env.SEED_SECRET) {
    res.status(401).json({ message: "Non autorisé" });
    return;
  }

  try {
    await connectDB();

    for (const p of SEED_PRODUCTS) {
      await Product.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
    }

    for (const c of SEED_COUPONS) {
      await Coupon.updateOne({ code: c.code }, { $set: { ...c, active: true } }, { upsert: true });
    }

    const products = await Product.find({});
    let reviewsSeeded = 0;
    for (const [i, product] of products.entries()) {
      const existing = await Review.countDocuments({ productId: product._id });
      if (existing > 0) continue;
      const picks = [SAMPLE_REVIEWS[i % 4], SAMPLE_REVIEWS[(i + 1) % 4], SAMPLE_REVIEWS[(i + 2) % 4]];
      for (const r of picks) {
        await Review.create({ productId: product._id, ...r });
        reviewsSeeded += 1;
      }
      await recomputeRating(product._id);
    }

    res.status(200).json({
      products: SEED_PRODUCTS.length,
      coupons: SEED_COUPONS.length,
      reviewsSeeded,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}
