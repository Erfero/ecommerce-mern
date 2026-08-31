import dns from "node:dns";
import mongoose from "mongoose";
import Product from "../lib/models/Product.js";

// Contournement d'un souci de résolution DNS SRV de Node sous Windows dans cet
// environnement (l'OS résout correctement via nslookup, mais le résolveur
// interne de Node échoue) : on force un résolveur public fiable.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const products = [
  {
    name: "Casque audio Nova",
    slug: "casque-audio-nova",
    description: "Casque circum-aural sans fil, autonomie 30h, réduction de bruit passive.",
    price: 79.9,
    category: "Audio",
    color: "#c2f24e",
    stock: 24,
  },
  {
    name: "Enceinte portable Pulse",
    slug: "enceinte-portable-pulse",
    description: "Enceinte Bluetooth étanche IPX6, 12h d'autonomie, format poche.",
    price: 49.9,
    category: "Audio",
    color: "#7ad1e8",
    stock: 40,
  },
  {
    name: "Clavier mécanique Forge",
    slug: "clavier-mecanique-forge",
    description: "Clavier mécanique switches rouges, rétroéclairage RGB, châssis aluminium.",
    price: 89.0,
    category: "Périphériques",
    color: "#ffb86b",
    stock: 15,
  },
  {
    name: "Souris sans fil Glide",
    slug: "souris-sans-fil-glide",
    description: "Souris ergonomique sans fil, capteur 16000 DPI, autonomie 3 mois.",
    price: 34.5,
    category: "Périphériques",
    color: "#ff7a7a",
    stock: 60,
  },
  {
    name: "Webcam Focus 1080p",
    slug: "webcam-focus-1080p",
    description: "Webcam Full HD 1080p, autofocus, micro double intégré.",
    price: 42.0,
    category: "Vidéo",
    color: "#c084fc",
    stock: 30,
  },
  {
    name: "Support ordinateur portable Stand",
    slug: "support-portable-stand",
    description: "Support ergonomique en aluminium, pliable, compatible 11-17 pouces.",
    price: 27.9,
    category: "Accessoires",
    color: "#8b9585",
    stock: 50,
  },
  {
    name: "Batterie externe PowerCell 20000",
    slug: "batterie-externe-powercell-20000",
    description: "Batterie externe 20000mAh, charge rapide USB-C PD 20W, deux ports.",
    price: 39.9,
    category: "Accessoires",
    color: "#f7b955",
    stock: 45,
  },
  {
    name: "Tapis de souris XL Grid",
    slug: "tapis-de-souris-xl-grid",
    description: "Tapis de souris XXL 900x400mm, surface texturée, bords cousus.",
    price: 19.9,
    category: "Accessoires",
    color: "#6ee7b7",
    stock: 70,
  },
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI manquant dans l'environnement");
    process.exit(1);
  }
  await mongoose.connect(uri);
  for (const p of products) {
    await Product.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
  }
  console.log(`Seed terminé : ${products.length} produits.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});