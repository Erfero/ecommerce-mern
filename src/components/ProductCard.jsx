import { Link } from "react-router-dom";
import { CategoryIcon, HeartIcon, PlusIcon } from "../icons";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import StarRating from "./StarRating";
import { useI18n } from "../useI18n";

export default function ProductCard({ product }) {
  const { isWishlisted, toggle } = useWishlist();
  const { addItem } = useCart();
  const { t } = useI18n();
  const wishlisted = isWishlisted(product._id);
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock <= 0;

  return (
    <div className="c4l-card c4l-product-card">
      <Link to={`/produits/${product.slug}`} className="c4l-product-thumb-link">
        <div
          className="c4l-product-thumb"
          style={{ background: `linear-gradient(155deg, ${product.color}, ${product.color}99)` }}
        >
          {product.image ? (
            <img src={product.image} alt={product.name} loading="lazy" />
          ) : (
            <CategoryIcon category={product.category} />
          )}
        </div>
      </Link>
      {product.newArrival && <span className="c4l-flag new">{t("newArrival")}</span>}
      {lowStock && <span className="c4l-flag low-stock">{t("lowStock", { n: product.stock })}</span>}
      <button
        className={"c4l-wishlist-btn" + (wishlisted ? " active" : "")}
        onClick={() => toggle(product._id)}
        aria-label="Ajouter aux favoris"
        type="button"
      >
        <HeartIcon filled={wishlisted} />
      </button>
      <Link to={`/produits/${product.slug}`} className="c4l-product-body">
        <span className="c4l-product-category">{product.category}</span>
        <h3>{product.name}</h3>
        {product.reviewCount > 0 && <StarRating value={product.avgRating} count={product.reviewCount} size={12} />}
        <p className="c4l-price">{product.price.toFixed(2)} €</p>
      </Link>
      <button
        type="button"
        className="c4l-quick-add"
        disabled={outOfStock}
        onClick={() => addItem(product, 1)}
        aria-label={t("addToCart")}
        title={t("addToCart")}
      >
        <PlusIcon size={15} />
      </button>
    </div>
  );
}
