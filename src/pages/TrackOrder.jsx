import { useState } from "react";
import { trackOrder } from "../api";
import { useI18n } from "../useI18n";
import OrderStatusTracker from "../components/OrderStatusTracker";

export default function TrackOrder() {
  const { t } = useI18n();
  const [form, setForm] = useState({ orderId: "", email: "" });
  const [order, setOrder] = useState(null);
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState("searching");
    setError("");
    setOrder(null);
    try {
      const data = await trackOrder(form.orderId.trim(), form.email.trim());
      setOrder(data);
      setState("found");
    } catch (err) {
      setError(err.message);
      setState("idle");
    }
  };

  return (
    <main className="c4l-main">
      <h1>{t("trackOrderTitle")}</h1>
      <p className="c4l-lead">{t("trackOrderLead")}</p>

      <form className="c4l-card c4l-form c4l-track-form" onSubmit={handleSubmit}>
        <label>
          {t("trackOrderIdLabel")}
          <input
            required
            value={form.orderId}
            onChange={(e) => setForm({ ...form, orderId: e.target.value })}
          />
        </label>
        <label>
          {t("trackOrderEmailLabel")}
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        {error && <p className="c4l-error">{error}</p>}
        <button type="submit" disabled={state === "searching"}>
          {state === "searching" ? t("trackOrderSearching") : t("trackOrderSubmit")}
        </button>
      </form>

      {order && (
        <div className="c4l-card c4l-confirmation c4l-track-result">
          <p className="c4l-lead">
            Commande <code>{order._id}</code>
          </p>
          <OrderStatusTracker steps={order.steps} stepIndex={order.stepIndex} />
          <div className="c4l-cart-list">
            {order.items.map((item) => (
              <div key={item.name} className="c4l-cart-row confirmation">
                <div className="c4l-cart-thumb small">
                  {item.image && <img src={item.image} alt={item.name} loading="lazy" />}
                </div>
                <span className="c4l-confirmation-name">
                  {item.quantity}× {item.name}
                </span>
                <span className="c4l-price">{(item.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
          </div>
          <p className="c4l-cart-summary">
            Total : <strong>{order.total.toFixed(2)} €</strong>
          </p>
        </div>
      )}
    </main>
  );
}
