import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, validateCoupon } from "../api";
import { useI18n } from "../useI18n";
import { TagIcon } from "../icons";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [form, setForm] = useState({ customerName: "", customerEmail: "", address: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponState, setCouponState] = useState("idle");

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

  const finalTotal = coupon ? coupon.total : total;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError("");
    setCouponState("checking");
    try {
      const result = await validateCoupon(couponInput.trim(), total);
      setCoupon(result);
      setCouponState("applied");
    } catch (err) {
      setCoupon(null);
      setCouponState("idle");
      setCouponError(err.message);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponInput("");
    setCouponError("");
    setCouponState("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        ...form,
        ...(coupon ? { couponCode: coupon.code } : {}),
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
              Total : <strong>{finalTotal.toFixed(2)} €</strong>
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

          <div className="c4l-coupon-box">
            {coupon ? (
              <div className="c4l-coupon-applied">
                <span>
                  <TagIcon size={14} /> {coupon.code} {t("couponApplied")}
                </span>
                <button type="button" className="c4l-coupon-remove" onClick={removeCoupon}>
                  {t("couponRemove")}
                </button>
              </div>
            ) : (
              <form className="c4l-coupon-form" onSubmit={handleApplyCoupon}>
                <label htmlFor="coupon-input">{t("couponLabel")}</label>
                <div className="c4l-coupon-row">
                  <input
                    id="coupon-input"
                    type="text"
                    placeholder={t("couponPlaceholder")}
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button type="submit" disabled={couponState === "checking"}>
                    {couponState === "checking" ? t("couponApplying") : t("couponApply")}
                  </button>
                </div>
                {couponError && <p className="c4l-error small">{couponError}</p>}
              </form>
            )}
          </div>

          <div className="c4l-order-summary-total">
            <span>{t("subtotalLabel")}</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          {coupon && (
            <div className="c4l-order-summary-total discount">
              <span>{t("discountLabel")}</span>
              <span>-{coupon.discount.toFixed(2)} €</span>
            </div>
          )}
          <div className="c4l-order-summary-total grand">
            <span>{t("totalLabel")}</span>
            <strong>{finalTotal.toFixed(2)} €</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
