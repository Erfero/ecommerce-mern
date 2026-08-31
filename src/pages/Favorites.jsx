import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const favorites = products.filter((p) => ids.includes(p._id));

  return (
    <main className="c4l-main">
      <h1>Mes favoris</h1>
      {status === "loading" && <p className="c4l-empty">Chargement…</p>}
      {status === "ready" && favorites.length === 0 && (
        <>
          <p className="c4l-empty">Aucun favori pour l'instant.</p>
          <Link className="c4l-back-btn" to="/">
            ← Voir le catalogue
          </Link>
        </>
      )}
      <div className="c4l-grid">
        {favorites.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </main>
  );
}