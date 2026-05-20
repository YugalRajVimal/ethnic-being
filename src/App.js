

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductListing, { PRODUCTS } from "./Pages/ProductListing";
import Cart from "./Pages/Cart";
import { OrderSuccess, Auth, Profile, Orders, Wishlist } from "./Pages/AuthAndProfile";
import ProductDetail from "./Pages/ProductDetails";
import Checkout from "./Pages/CheckOut";
import { authFetch, cartAPI, wishlistAPI } from "./Pages/api";
import HomePage from "./Pages/HomePage";
import NavBar from "./Pages/NavBar";
import Footer from "./Pages/Footer";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ─── CART: single source of truth — always the raw API cart.items array ───
  // Shape: [{ _id, product, name, image, price, selectedSize, qty }, ...]
  const [cart, setCart] = useState([]);
  const [checkoutMeta, setCheckoutMeta] = useState({ couponCode: "", discount: 0 });

  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}
      body{font-family:'DM Sans',sans-serif;background:#FAF8F4;color:#1A1612;overflow-x:hidden}
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ─── AUTH CHECK ───────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const res = await authFetch("/auth/me");
        if (isMounted && res?.user) {
          setUser(res.user);
          if (page === "auth") setPage("profile");
        }
      } finally {
        if (isMounted) setAuthChecked(true);
      }
    };
    if (localStorage.getItem("eb_token")) {
      checkAuth();
    } else {
      setAuthChecked(true);
    }
    return () => { isMounted = false; };
    // eslint-disable-next-line
  }, []);

  // ─── FETCH CART FROM API ──────────────────────────────────────────────────
  // This is the canonical way to refresh cart anywhere in the app.
  // Both Cart.js and Checkout.js call this via the onCartUpdate prop.
  const fetchCart = useCallback(async () => {
    try {
      const res = await cartAPI.get();
      // Backend returns { success, cart: { items: [...] } }
      // Normalize: always store a flat array of items on state
      const items = res?.cart?.items ?? res?.cart ?? [];
      setCart(Array.isArray(items) ? items : []);
    } catch {
      // If unauthenticated or network error, keep existing cart
    }
  }, []);

  // ─── FETCH WISHLIST FROM API ──────────────────────────────────────────────
  // Always syncs wishlist state from the API (used after add/remove)
  // Expects API response shape: { success: true, wishlist: [ {...product fields...}, ... ] }
  // Sets wishlist state to array of product objects.
  const fetchWishlist = useCallback(async () => {
    try {
      const res = await wishlistAPI.get();
      if (Array.isArray(res?.wishlist)) {
        setWishlist(res.wishlist);
      }
    } catch {
      // keep local wishlist unchanged on error
    }
  }, []);

  // Fetch on mount if logged in
  useEffect(() => {
    if (localStorage.getItem("eb_token")) {
      fetchWishlist();
    }
  }, [fetchWishlist]);

  // ─── NAVIGATION ──────────────────────────────────────────────────────────
  const navigate = (pg, data) => {
    if (pg === "product" && data) setSelectedProduct(data);

    // Cart → Checkout: carry coupon/discount meta
    if (pg === "checkout" && data) {
      setCheckoutMeta({
        couponCode: data.couponCode || "",
        discount: data.discount || 0,
      });
    }

    if (pg === "auth" && user) {
      setPage("profile");
    } else {
      setPage(pg);
    }
    window.scrollTo(0, 0);
  };

  // ─── LOCAL CART HELPERS (for guest / optimistic UI) ───────────────────────
  // Used by ProductListing / ProductDetail when user adds to cart.
  // After API call succeeds in those components, they should call fetchCart.
  // For now we keep local add as fallback.
  const addToCart = async (product) => {
    try {
      await cartAPI.add({
        productId: product.id || product._id,
        selectedSize: product.selectedSize || "",
        qty: product.qty || 1,
      });
      await fetchCart(); // sync from server
    } catch {
      // Optimistic local fallback
      setCart(prev => {
        const existing = prev.find(
          i => (i._id || i.id) === (product.id || product._id) &&
               i.selectedSize === product.selectedSize
        );
        if (existing) {
          return prev.map(i =>
            (i._id || i.id) === (product.id || product._id) &&
            i.selectedSize === product.selectedSize
              ? { ...i, qty: (i.qty || 1) + (product.qty || 1) }
              : i
          );
        }
        return [...prev, { ...product, qty: product.qty || 1 }];
      });
    }
  };

  // ─── WISHLIST HANDLERS ────────────────────────────────────────────────────
  // Adds/removes from wishlist using the api (prefers server source of truth)
  // toggleWishlist handles adding/removing by product id, using the wishlist array of product objects (not just ids)
  const toggleWishlist = async (id) => {
    // Find if the ID is already present in the wishlist (structure: array of product objects)
    const isInWishlist = wishlist.some(item => item._id === id || item.id === id);
    if (isInWishlist) {
      // Optimistically remove from wishlist
      setWishlist(prev => prev.filter(item => item._id !== id && item.id !== id));
      try {
        await wishlistAPI.remove(id);
      } catch (err) {
        // ignore for now, fallback will be from server
      } finally {
        fetchWishlist();
      }
    } else {
      // Optimistically add a placeholder (if desired, or just call fetch after API)
      try {
        await wishlistAPI.add(id);
      } catch (err) {
        // ignore for now, fallback will be from server
      } finally {
        fetchWishlist();
      }
    }
  };

  // Called by Checkout after order is placed — clears cart
  const placeOrder = (order) => {
    setLastOrder(order);
    setCart([]);
    // Also clear on server
    cartAPI.clear().catch(() => {});
  };

  const cartCount = cart.reduce((sum, i) => sum + (i.qty || 1), 0);

  // ─── RENDER ───────────────────────────────────────────────────────────────
  const renderPage = () => {
    if (!authChecked) return (
      <div style={{ padding: 40, textAlign: "center", color: "#8C7B6B", paddingTop: "30vh" }}>
        Loading...
      </div>
    );

    switch (page) {
      case "home":
        return <HomePage navigate={navigate} PRODUCTS={PRODUCTS}   wishlist={wishlist}
            toggleWishlist={toggleWishlist} />;

      case "products":
        return (
          <ProductListing
            navigate={navigate}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
          />
        );

      case "product":
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            navigate={navigate}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
          />
        ) : null;

      case "cart":
        return (
          <Cart
            cart={cart}
            // Cart.js calls updateCart(responseCart) to replace entire cart state
            updateCart={setCart}
            // fetchCart lets Cart.js refresh from API after any mutation
            onCartUpdate={fetchCart}
            navigate={navigate}
          />
        );

      case "checkout":
        return (
          <Checkout
            cart={cart}
            navigate={navigate}
            placeOrder={placeOrder}
            checkoutMeta={checkoutMeta}
            // Checkout calls this after removing an item so cart state stays in sync
            onCartUpdate={fetchCart}
          />
        );

      case "orderSuccess":
        return <OrderSuccess navigate={navigate} lastOrder={lastOrder} />;

      case "auth":
        return (
          <Auth
            navigate={navigate}
            login={(u) => {
              setUser(u);
              fetchCart(); // sync cart after login
              fetchWishlist(); // sync wishlist after login
              setPage("profile");
            }}
          />
        );

      case "profile":
        return (
          <Profile
            user={user}
            navigate={navigate}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
            logout={() => {
              setUser(null);
              setCart([]);
              setWishlist([]);
              localStorage.removeItem("eb_token");
              setPage("home");
            }}
          />
        );

      case "orders":
        return <Orders navigate={navigate} />;

      case "wishlist":
        return (
          <Wishlist
             wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
            navigate={navigate}
            allProducts={PRODUCTS}
          />
        );

      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div>
      {page !== "auth" && (
        <NavBar
          navigate={navigate}
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          user={user}
        />
      )}
      <div style={{ paddingTop: page !== "auth" ? 64 : 0 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>
      {page !== "auth" && (
        <Footer />
      )}
    </div>
  );
}