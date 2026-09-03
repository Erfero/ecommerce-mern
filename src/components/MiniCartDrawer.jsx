import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useI18n } from "../useI18n";
import { CloseIcon } from "../icons";

export default function MiniCartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, total } = useCart();
  const { t } = useI18n();

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div className="c4l-drawer-overlay" onClick={closeDrawer}>
      <aside className="c4l-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="c4l-drawer-head">
          <h2>{t("miniCartTitle")}</h2>
          <button type="button" className="c4l-icon-btn" onClick={closeDrawer} aria-label="close">
            <CloseIcon size={16} />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="c4l-empty">{t("miniCartEmpty")}</p>
        ) : (
          <div className="c4l-drawer-list">
            {items.map((item) => (
              <div key={item.productId} className="c4l-drawer-row">
                <div
                  className="c4l-cart-thumb small"
                  style={{ background: `linear-gradient(155deg, ${item.color || "#ccc"}, ${item.color || "#ccc"}99)` }}
                >
                  {item.image && <img src={item.image} alt={item.name} loading="lazy" />}
                </div>
                <div className="c4l-drawer-row-info">
                  <p className="c4l-drawer-row-name">{item.name}</p>
                  <div className="c4l-drawer-qty">
                    <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <div className="c4l-drawer-row-end">
                  <span className="c4l-price">{(item.price * item.quantity).toFixed(2)} €</span>
                  <button type="button" className="c4l-remove-btn" onClick={() => removeItem(item.productId)}>
                    {t("remove")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="c4l-drawer-footer">
            <div className="c4l-drawer-total">
              <span>{t("totalLabel")}</span>
              <strong>{total.toFixed(2)} €</strong>
            </div>
            <Link className="c4l-back-btn" to="/panier" onClick={closeDrawer}>
              {t("viewCart")}
            </Link>
            <Link className="c4l-primary-btn" to="/commande" onClick={closeDrawer}>
              {t("checkoutNow")}
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
