import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOrder } from "../api";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetchOrder(id)
      .then((data) => {
        setOrder(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  if (status === "loading") return <main className="c4l-main"><p className="c4l-empty">Chargement…</p></main>;
  if (status === "error" || !order)
    return <main className="c4l-main"><p className="c4l-empty">Commande introuvable.</p></main>;

  return (
    <main className="c4l-main">
      <div className="c4l-card c4l-confirmation">
        <span className="c4l-badge">Commande confirmée</span>
        <h1>Merci {order.customerName.split(" ")[0]} !</h1>
        <p className="c4l-lead">
          Commande <code>{order._id}</code> enregistrée en base de données.
        </p>
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
        <Link className="c4l-back-btn" to="/">
          ← Retour au catalogue
        </Link>
      </div>
    </main>
  );
}
