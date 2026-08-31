export async function fetchProducts() {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Impossible de charger les produits");
  return res.json();
}

export async function fetchProduct(slug) {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) throw new Error("Produit introuvable");
  return res.json();
}

export async function createOrder(payload) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de la commande");
  return data;
}

export async function fetchOrder(id) {
  const res = await fetch(`/api/orders/${id}`);
  if (!res.ok) throw new Error("Commande introuvable");
  return res.json();
}