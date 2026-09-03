import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchProduct, fetchProducts, fetchReviews, postReview } from "../api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useI18n } from "../useI18n";
import { CategoryIcon, HeartIcon } from "../icons";
import StarRating from "../components/StarRating";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { t } = useI18n();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState("loading");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ author: "", rating: 0, comment: "" });
  const [reviewState, setReviewState] = useState("idle");

  useEffect(() => {
    setStatus("loading");
    setQuantity(1);
    setReviewForm({ author: "", rating: 0, comment: "" });
    setReviewState("idle");
    fetchProduct(slug)
      .then((data) => {
        setProduct(data);
        setStatus("ready");
        fetchReviews(data._id).then(setReviews).catch(() => {});
        return fetchProducts();
      })
      .then((all) => {
        setRelated(all.filter((p) => p.slug !== slug).slice(0, 4));
      })
      .catch(() => setStatus("error"));
  }, [slug]);

  if (status === "loading") return <main className="c4l-main"><p className="c4l-empty">Chargement…</p></main>;
  if (status === "error" || !product)
    return <main className="c4l-main"><p className="c4l-empty">Produit introuvable.</p></main>;

  const wishlisted = isWishlisted(product._id);
  const lowStock = product.stock > 0 && product.stock <= 5;

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!reviewForm.author.trim() || !reviewForm.comment.trim() || !reviewForm.rating) return;
    setReviewState("sending");
    try {
      const review = await postReview({ productId: product._id, ...reviewForm });
      setReviews((r) => [review, ...r]);
      setProduct((p) => ({
        ...p,
        reviewCount: (p.reviewCount || 0) + 1,
        avgRating:
          Math.round((((p.avgRating || 0) * (p.reviewCount || 0) + reviewForm.rating) / ((p.reviewCount || 0) + 1)) * 10) /
          10,
      }));
      setReviewForm({ author: "", rating: 0, comment: "" });
      setReviewState("done");
    } catch {
      setReviewState("idle");
    }
  }

  return (
    <main className="c4l-main">
      <nav className="c4l-breadcrumb" aria-label="breadcrumb">
        <Link to="/">{t("breadcrumbHome")}</Link>
        <span>/</span>
        <Link to={`/?categorie=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>
      <button className="c4l-back-btn" onClick={() => navigate(-1)}>
        ← Retour
      </button>
      <div className="c4l-product-detail">
        <div
          className="c4l-product-thumb large"
          style={{ background: `linear-gradient(155deg, ${product.color}, ${product.color}99)` }}
        >
          {product.newArrival && <span className="c4l-flag new">{t("newArrival")}</span>}
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <CategoryIcon category={product.category} size={72} />
          )}
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
          {product.reviewCount > 0 ? (
            <a href="#avis" className="c4l-rating-link">
              <StarRating value={product.avgRating} count={product.reviewCount} size={15} />
            </a>
          ) : (
            <p className="c4l-no-rating">{t("noRatingYet")}</p>
          )}
          <p className="c4l-lead">{product.description}</p>
          <p className="c4l-price large">{product.price.toFixed(2)} €</p>
          <p className={"c4l-stock" + (lowStock ? " urgent" : "")}>
            {product.stock > 0
              ? lowStock
                ? t("lowStock", { n: product.stock })
                : `${product.stock} en stock`
              : t("outOfStock")}
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
              {added ? "Ajouté ✓" : t("addToCart")}
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
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" />
                  ) : (
                    <CategoryIcon category={p.category} size={28} />
                  )}
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

      <section className="c4l-reviews" id="avis">
        <h2>{t("reviews")}{product.reviewCount > 0 ? ` (${product.reviewCount})` : ""}</h2>

        {reviews.length === 0 ? (
          <p className="c4l-empty">{t("reviewsEmpty")}</p>
        ) : (
          <ul className="c4l-review-list">
            {reviews.map((r) => (
              <li key={r._id} className="c4l-card c4l-review-item">
                <div className="c4l-review-head">
                  <strong>{r.author}</strong>
                  <StarRating value={r.rating} size={13} />
                </div>
                <p>{r.comment}</p>
                <time>{new Date(r.createdAt).toLocaleDateString()}</time>
              </li>
            ))}
          </ul>
        )}

        <form className="c4l-card c4l-review-form" onSubmit={handleReviewSubmit}>
          <h3>{t("writeReview")}</h3>
          <label>
            {t("reviewName")}
            <input
              type="text"
              value={reviewForm.author}
              maxLength={60}
              required
              onChange={(e) => setReviewForm((f) => ({ ...f, author: e.target.value }))}
            />
          </label>
          <label>
            {t("reviewRating")}
            <StarRating
              value={reviewForm.rating}
              size={22}
              interactive
              onChange={(n) => setReviewForm((f) => ({ ...f, rating: n }))}
            />
          </label>
          <label>
            {t("reviewComment")}
            <textarea
              value={reviewForm.comment}
              maxLength={600}
              required
              rows={3}
              onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
            />
          </label>
          <button type="submit" disabled={reviewState === "sending" || !reviewForm.rating}>
            {reviewState === "sending" ? t("reviewSending") : t("reviewSubmit")}
          </button>
          {reviewState === "done" && <p className="c4l-review-thanks">{t("reviewThanks")}</p>}
        </form>
      </section>
    </main>
  );
}
