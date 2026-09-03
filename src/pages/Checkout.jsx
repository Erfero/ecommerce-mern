import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customerName: "", customerEmail: "", address: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <main className="c4l-main">
        <h1>Commande</h1>
        <p className="c4l-empty">Ton panier est vide.</p>
        <Link className="c4l-back-btn" to="/">
          ← Voir le catalogue
        </Link>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        ...form,
      };
      const { orderId } = await createOrder(payload);
      clearCart();
      navigate(`/confirmation/${orderId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="c4l-main">
      <h1>Commande</h1>
      <p className="c4l-lead">
        Démo sans paiement réel : la commande est enregistrée en base (stock décrémenté) mais
        aucun processeur de paiement n'est connecté.
      </p>
      <div className="c4l-checkout-grid">
        <form className="c4l-card c4l-form" onSubmit={handleSubmit}>
          <label>
            Nom complet
            <input
              required
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
            />
          </label>
          <label>
            Adresse de livraison
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>
          {error && <p className="c4l-error">{error}</p>}
          <div className="c4l-cart-summary">
            <p>
              Total : <strong>{total.toFixed(2)} €</strong>
            </p>
            <button className="c4l-primary-btn" type="submit" disabled={submitting}>
              {submitting ? "Envoi…" : "Confirmer la commande"}
            </button>
          </div>
        </form>

        <aside className="c4l-card c4l-order-summary">
          <h2>Récapitulatif</h2>
          <div className="c4l-cart-list">
            {items.map((item) => (
              <div key={item.productId} className="c4l-cart-row summary">
                <div
                  className="c4l-cart-thumb small"
                  style={{ background: `linear-gradient(155deg, ${item.color || "#ccc"}, ${item.color || "#ccc"}99)` }}
                >
                  {item.image && <img src={item.image} alt={item.name} loading="lazy" />}
                </div>
                <div className="c4l-order-summary-info">
                  <p className="c4l-order-summary-name">{item.name}</p>
                  <p className="c4l-muted">Qté {item.quantity}</p>
                </div>
                <span className="c4l-price">{(item.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
          </div>
          <div className="c4l-order-summary-total">
            <span>Total</span>
            <strong>{total.toFixed(2)} €</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
