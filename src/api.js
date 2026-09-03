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

export async function trackOrder(orderId, email) {
  const res = await fetch("/api/orders/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Commande introuvable");
  return data;
}

export async function fetchReviews(productId) {
  const res = await fetch(`/api/reviews?productId=${productId}`);
  if (!res.ok) throw new Error("Impossible de charger les avis");
  return res.json();
}

export async function postReview(payload) {
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Impossible d'envoyer l'avis");
  return data;
}

export async function validateCoupon(code, subtotal) {
  const res = await fetch("/api/coupons/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, subtotal }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Code promo invalide");
  return data;
}
