import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="c4l-main">
        <h1>Panier</h1>
        <p className="c4l-empty">Ton panier est vide.</p>
        <Link className="c4l-back-btn" to="/">
          ← Voir le catalogue
        </Link>
      </main>
    );
  }

  return (
    <main className="c4l-main">
      <h1>Panier</h1>
      <div className="c4l-card c4l-cart-list">
        {items.map((item) => (
          <div key={item.productId} className="c4l-cart-row">
            <div
              className="c4l-cart-thumb"
              style={{ background: `linear-gradient(155deg, ${item.color || "#ccc"}, ${item.color || "#ccc"}99)` }}
            >
              {item.image && <img src={item.image} alt={item.name} loading="lazy" />}
            </div>
            <div>
              <strong>{item.name}</strong>
              <p className="c4l-muted">{item.price.toFixed(2)} € / unité</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
            />
            <p className="c4l-price">{(item.price * item.quantity).toFixed(2)} €</p>
            <button className="c4l-remove-btn" onClick={() => removeItem(item.productId)}>
              Retirer
            </button>
          </div>
        ))}
      </div>
      <div className="c4l-cart-summary">
        <p>
          Total : <strong>{total.toFixed(2)} €</strong>
        </p>
        <Link className="c4l-primary-btn" to="/commande">
          Passer la commande
        </Link>
      </div>
    </main>
  );
}
