import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api";
import { SearchIcon } from "../icons";
import ProductCard from "../components/ProductCard";
import { useI18n } from "../useI18n";

const SORTS = {
  newest: (a, b) => (a._id < b._id ? 1 : -1),
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
  rating: (a, b) => (b.avgRating || 0) - (a.avgRating || 0),
};

export default function Home() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("categorie") || "Toutes");
  const [sortKey, setSortKey] = useState("newest");

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const categories = useMemo(
    () => ["Toutes", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = category === "Toutes" || p.category === category;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort(SORTS[sortKey]);
  }, [products, search, category, sortKey]);

  const isBrowsing = search.trim() === "" && category === "Toutes";
  const featured = useMemo(() => products.filter((p) => p.featured).slice(0, 4), [products]);
  const newArrivals = useMemo(() => products.filter((p) => p.newArrival).slice(0, 4), [products]);

  return (
    <main className="c4l-main">
      <section className="c4l-hero">
        <span className="c4l-badge">{t("badge")}</span>
        <h1>{t("heroTitle")}</h1>
        <p className="c4l-lead">{t("heroLead")}</p>
      </section>

      {isBrowsing && featured.length > 0 && (
        <section className="c4l-showcase">
          <h2>{t("featuredTitle")}</h2>
          <div className="c4l-grid">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {isBrowsing && newArrivals.length > 0 && (
        <section className="c4l-showcase">
          <h2>{t("newArrivalsTitle")}</h2>
          <div className="c4l-grid">
            {newArrivals.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      <div className="c4l-toolbar">
        <div className="c4l-search">
          <SearchIcon />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
          />
        </div>
        <div className="c4l-category-pills">
          {categories.map((c) => (
            <button
              key={c}
              className={"c4l-pill" + (c === category ? " active" : "")}
              onClick={() => setCategory(c)}
            >
              {c === "Toutes" ? t("all") : c}
            </button>
          ))}
        </div>
        <label className="c4l-sort">
          {t("sortLabel")}
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="newest">{t("sortNewest")}</option>
            <option value="priceAsc">{t("sortPriceAsc")}</option>
            <option value="priceDesc">{t("sortPriceDesc")}</option>
            <option value="name">{t("sortName")}</option>
            <option value="rating">{t("sortRating")}</option>
          </select>
        </label>
      </div>

      {isBrowsing && <h2 className="c4l-catalog-title">{t("catalogTitle")}</h2>}

      {status === "loading" && <p className="c4l-empty">Chargement du catalogue…</p>}
      {status === "error" && <p className="c4l-empty">Impossible de charger les produits.</p>}
      {status === "ready" && filtered.length === 0 && (
        <p className="c4l-empty">Aucun produit ne correspond à ta recherche.</p>
      )}

      <div className="c4l-grid">
        {filtered.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </main>
  );
}
