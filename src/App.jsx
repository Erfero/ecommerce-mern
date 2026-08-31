import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ThemeProvider } from "./useTheme";
import { LangProvider } from "./useI18n";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Favorites from "./pages/Favorites";
import "./App.css";

export default function App() {
  return (
    <ThemeProvider>
    <LangProvider>
    <WishlistProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="c4l-shell">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produits/:slug" element={<ProductDetail />} />
              <Route path="/favoris" element={<Favorites />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/commande" element={<Checkout />} />
              <Route path="/confirmation/:id" element={<OrderConfirmation />} />
            </Routes>
            <footer className="c4l-footer">
              Construit par Erféro Keoula —{" "}
              <a href="https://code4life-2.vercel.app" target="_blank" rel="noopener noreferrer">
                retour au portfolio Code4Life ↗
              </a>
            </footer>
          </div>
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
    </LangProvider>
    </ThemeProvider>
  );
}