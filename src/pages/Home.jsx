import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../api";
import { SearchIcon } from "../icons";
import ProductCard from "../components/ProductCard";
import { useI18n } from "../useI18n";

export default function Home() {
  const { t } = useI18n();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");

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
    return products.filter((p) => {
      const matchesCategory = category === "Toutes" || p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <main className="c4l-main">
      <section className="c4l-intro">
        <span className="c4l-badge">{t("badge")}</span>
        <h1>{t("heroTitle")}</h1>
        <p className="c4l-lead">{t("heroLead")}</p>
      </section>

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
      </div>

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