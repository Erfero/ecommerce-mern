import { connectDB } from "../../lib/db.js";
import Product from "../../lib/models/Product.js";
import { SEED_PRODUCTS } from "../../lib/seedProducts.js";

// Temporary, one-time migration endpoint to backfill product images on the
// live database without exposing the MongoDB connection string. Protected by
// a shared secret so it can't be triggered by anyone else. Remove this file
// (and the SEED_SECRET env var) once the migration has run.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Méthode non autorisée" });
    return;
  }

  const secret = req.headers["x-seed-secret"];
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    res.status(401).json({ message: "Non autorisé" });
    return;
  }

  try {
    await connectDB();
    let updated = 0;
    for (const p of SEED_PRODUCTS) {
      await Product.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
      updated += 1;
    }
    res.status(200).json({ message: "OK", updated });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}
