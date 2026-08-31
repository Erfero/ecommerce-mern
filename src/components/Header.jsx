import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { HeartIcon } from "../icons";
import { useTheme } from "../useTheme";
import { useI18n } from "../useI18n";

export default function Header() {
  const { count } = useCart();
  const { ids } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { lang, t, toggleLang } = useI18n();
  return (
    <header className="c4l-header">
      <Link to="/" className="c4l-logo">
        <svg width="28" height="28" viewBox="0 0 40 40">
          <rect width="40" height="40" rx="11" fill="#d97706" />
          <path
            d="M14 12 L7 20 L14 28"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M26 12 L33 20 L26 28"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M15.5 20 L18 20 L19.5 14.5 L21.5 26 L23 20 L24.5 20"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <strong>{t("storeName")}</strong>
      </Link>
      <div className="c4l-header-actions">
        <button type="button" className="c4l-icon-btn" onClick={toggleTheme} aria-label="theme">
          {theme === "dark" ? "☀" : "☾"}
        </button>
        <button type="button" className="c4l-icon-btn" onClick={toggleLang} aria-label="lang">
          {lang === "fr" ? "EN" : "FR"}
        </button>
        <Link to="/favoris" className="c4l-cart-link">
          <HeartIcon size={16} /> {ids.length > 0 && <span className="c4l-cart-badge">{ids.length}</span>}
        </Link>
        <Link to="/panier" className="c4l-cart-link">
          {t("cart")} {count > 0 && <span className="c4l-cart-badge">{count}</span>}
        </Link>
      </div>
    </header>
  );
}
