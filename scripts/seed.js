import dns from "node:dns";
import mongoose from "mongoose";
import Product from "../lib/models/Product.js";
import Coupon from "../lib/models/Coupon.js";
import { SEED_PRODUCTS, SEED_COUPONS } from "../lib/seedProducts.js";

// Contournement d'un souci de résolution DNS SRV de Node sous Windows dans cet
// environnement (l'OS résout correctement via nslookup, mais le résolveur
// interne de Node échoue) : on force un résolveur public fiable.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI manquant dans l'environnement");
    process.exit(1);
  }
  await mongoose.connect(uri);
  for (const p of SEED_PRODUCTS) {
    await Product.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
  }
  for (const c of SEED_COUPONS) {
    await Coupon.updateOne({ code: c.code }, { $set: { ...c, active: true } }, { upsert: true });
  }
  console.log(`Seed terminé : ${SEED_PRODUCTS.length} produits, ${SEED_COUPONS.length} codes promo.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
