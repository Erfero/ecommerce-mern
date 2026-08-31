import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchProduct, fetchProducts } from "../api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { CategoryIcon, HeartIcon } from "../icons";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState("loading");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setStatus("loading");
    setQuantity(1);
    fetchProduct(slug)
      .then((data) => {
        setProduct(data);
        setStatus("ready");
        return fetchProducts();
      })
      .then((all) => {
        setRelated(
          all.filter((p) => p.slug !== slug).slice(0, 4)
        );
      })
      .catch(() => setStatus("error"));
  }, [slug]);

  if (status === "loading") return <main className="c4l-main"><p className="c4l-empty">Chargement…</p></main>;
  if (status === "error" || !product)
    return <main className="c4l-main"><p className="c4l-empty">Produit introuvable.</p></main>;

  const wishlisted = isWishlisted(product._id);

  return (
    <main className="c4l-main">
      <button className="c4l-back-btn" onClick={() => navigate(-1)}>
        ← Retour
      </button>
      <div className="c4l-product-detail">
        <div
          className="c4l-product-thumb large"
          style={{ background: `linear-gradient(155deg, ${product.color}, ${product.color}99)` }}
        >
          <CategoryIcon category={product.category} size={72} />
        </div>
        <div className="c4l-card c4l-product-info">
          <div className="c4l-product-info-top">
            <span className="c4l-product-category">{product.category}</span>
            <button
              className={"c4l-wishlist-btn static" + (wishlisted ? " active" : "")}
              onClick={() => toggle(product._id)}
              type="button"
            >
              <HeartIcon filled={wishlisted} />
            </button>
          </div>
          <h1>{product.name}</h1>
          <p className="c4l-lead">{product.description}</p>
          <p className="c4l-price large">{product.price.toFixed(2)} €</p>
          <p className="c4l-stock">
            {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
          </p>
          <div className="c4l-qty-row">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
            <button
              disabled={product.stock < 1}
              onClick={() => {
                addItem(product, quantity);
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              }}
            >
              {added ? "Ajouté ✓" : "Ajouter au panier"}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="c4l-related">
          <h2>Tu pourrais aussi aimer</h2>
          <div className="c4l-grid">
            {related.map((p) => (
              <Link key={p._id} to={`/produits/${p.slug}`} className="c4l-card c4l-product-card-mini">
                <div
                  className="c4l-product-thumb small"
                  style={{ background: `linear-gradient(155deg, ${p.color}, ${p.color}99)` }}
                >
                  <CategoryIcon category={p.category} size={28} />
                </div>
                <div>
                  <p className="c4l-related-name">{p.name}</p>
                  <p className="c4l-price">{p.price.toFixed(2)} €</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}