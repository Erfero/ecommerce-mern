import { Link } from "react-router-dom";
import { CategoryIcon, HeartIcon } from "../icons";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({ product }) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  return (
    <div className="c4l-card c4l-product-card">
      <Link to={`/produits/${product.slug}`} className="c4l-product-thumb-link">
        <div
          className="c4l-product-thumb"
          style={{ background: `linear-gradient(155deg, ${product.color}, ${product.color}99)` }}
        >
          <CategoryIcon category={product.category} />
        </div>
      </Link>
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
        <p className="c4l-price">{product.price.toFixed(2)} €</p>
      </Link>
    </div>
  );
}