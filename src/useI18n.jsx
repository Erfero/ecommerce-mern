import { createContext, useContext, useState } from "react";

const STRINGS = {
  fr: {
    storeName: "Code4Life Store",
    favorites: "Favoris",
    cart: "Panier",
    badge: "Projet personnel",
    heroTitle: "Boutique en ligne MERN",
    heroLead:
      "Catalogue produits chargé depuis MongoDB, recherche, filtres par catégorie, favoris persistants et tunnel de commande complet.",
    searchPlaceholder: "Rechercher un produit...",
    all: "Tout",
  },
  en: {
    storeName: "Code4Life Store",
    favorites: "Favorites",
    cart: "Cart",
    badge: "Personal project",
    heroTitle: "MERN Online Store",
    heroLead:
      "Product catalog loaded from MongoDB, search, category filters, persistent favorites and a full checkout flow.",
    searchPlaceholder: "Search a product...",
    all: "All",
  },
};

function getInitial() {
  const stored = localStorage.getItem("c4l_shop_lang");
  if (stored === "fr" || stored === "en") return stored;
  const url = new URLSearchParams(window.location.search).get("lang");
  if (url === "fr" || url === "en") return url;
  return navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
}

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(getInitial);
  const t = (key) => STRINGS[lang][key] ?? key;
  const toggleLang = () => {
    setLang((l) => {
      const next = l === "fr" ? "en" : "fr";
      localStorage.setItem("c4l_shop_lang", next);
      return next;
    });
  };
  return <LangContext.Provider value={{ lang, t, toggleLang }}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used within LangProvider");
  return ctx;
}