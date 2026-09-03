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

    newArrival: "Nouveau",
    lowStock: "Plus que {n} en stock !",
    addToCart: "Ajouter au panier",
    outOfStock: "Rupture de stock",

    featuredTitle: "Meilleures ventes",
    newArrivalsTitle: "Nouveautés",
    catalogTitle: "Tout le catalogue",

    sortLabel: "Trier par",
    sortNewest: "Nouveautés",
    sortPriceAsc: "Prix croissant",
    sortPriceDesc: "Prix décroissant",
    sortName: "Nom (A-Z)",
    sortRating: "Mieux notés",

    reviews: "Avis clients",
    writeReview: "Laisser un avis",
    reviewName: "Ton nom",
    reviewRating: "Ta note",
    reviewComment: "Ton avis",
    reviewSubmit: "Publier l'avis",
    reviewsEmpty: "Aucun avis pour l'instant. Sois le premier à donner ton avis !",
    reviewSending: "Envoi…",
    reviewThanks: "Merci pour ton avis !",
    noRatingYet: "Pas encore noté",

    breadcrumbHome: "Accueil",
    recentlyViewed: "Consultés récemment",

    couponLabel: "Code promo",
    couponPlaceholder: "Ex. BIENVENUE10",
    couponApply: "Appliquer",
    couponRemove: "Retirer",
    couponApplying: "Vérification…",
    couponApplied: "appliqué",
    subtotalLabel: "Sous-total",
    discountLabel: "Réduction",
    totalLabel: "Total",

    trackOrderNav: "Suivre ma commande",
    trackOrderTitle: "Suivre ma commande",
    trackOrderLead: "Entre ton numéro de commande et l'email utilisé pour la retrouver.",
    trackOrderIdLabel: "Numéro de commande",
    trackOrderEmailLabel: "Email",
    trackOrderSubmit: "Rechercher",
    trackOrderSearching: "Recherche…",
    trackOrderNotFound: "Aucune commande trouvée avec ces informations.",

    statusReceived: "Commande reçue",
    statusPreparing: "En préparation",
    statusShipped: "Expédiée",
    statusDelivered: "Livrée",

    miniCartTitle: "Panier",
    miniCartEmpty: "Ton panier est vide.",
    viewCart: "Voir le panier",
    checkoutNow: "Commander",
    addedToCart: "ajouté au panier",
    remove: "Retirer",
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

    newArrival: "New",
    lowStock: "Only {n} left!",
    addToCart: "Add to cart",
    outOfStock: "Out of stock",

    featuredTitle: "Best sellers",
    newArrivalsTitle: "New arrivals",
    catalogTitle: "Full catalog",

    sortLabel: "Sort by",
    sortNewest: "Newest",
    sortPriceAsc: "Price: low to high",
    sortPriceDesc: "Price: high to low",
    sortName: "Name (A-Z)",
    sortRating: "Top rated",

    reviews: "Customer reviews",
    writeReview: "Write a review",
    reviewName: "Your name",
    reviewRating: "Your rating",
    reviewComment: "Your review",
    reviewSubmit: "Post review",
    reviewsEmpty: "No reviews yet. Be the first to review this product!",
    reviewSending: "Sending…",
    reviewThanks: "Thanks for your review!",
    noRatingYet: "Not rated yet",

    breadcrumbHome: "Home",
    recentlyViewed: "Recently viewed",

    couponLabel: "Promo code",
    couponPlaceholder: "e.g. WELCOME10",
    couponApply: "Apply",
    couponRemove: "Remove",
    couponApplying: "Checking…",
    couponApplied: "applied",
    subtotalLabel: "Subtotal",
    discountLabel: "Discount",
    totalLabel: "Total",

    trackOrderNav: "Track my order",
    trackOrderTitle: "Track my order",
    trackOrderLead: "Enter your order number and the email used to place it.",
    trackOrderIdLabel: "Order number",
    trackOrderEmailLabel: "Email",
    trackOrderSubmit: "Search",
    trackOrderSearching: "Searching…",
    trackOrderNotFound: "No order found with this information.",

    statusReceived: "Order received",
    statusPreparing: "Preparing",
    statusShipped: "Shipped",
    statusDelivered: "Delivered",

    miniCartTitle: "Cart",
    miniCartEmpty: "Your cart is empty.",
    viewCart: "View cart",
    checkoutNow: "Checkout",
    addedToCart: "added to cart",
    remove: "Remove",
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
  const t = (key, vars) => {
    let str = STRINGS[lang][key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, v);
      }
    }
    return str;
  };
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
