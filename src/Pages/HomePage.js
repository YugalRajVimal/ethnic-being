
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiStar,
  FiShoppingBag,
} from "react-icons/fi";
import { productAPI, cartAPI } from "./api";

/* ═══════════════════════════════════════════════════════════
   STATIC FALLBACK (same schema as ProductListing.js)
═══════════════════════════════════════════════════════════ */
const STATIC_PRODUCTS = [
  { id: 1,  name: "Mughal Garden Tee",       price: 1849, original: 2299, tag: "SALE",     category: "T-Shirts", sizesDetailed: [{ size: "S", stock: 5 }, { size: "M", stock: 8 }, { size: "L", stock: 3 }, { size: "XL", stock: 0 }], color: "Ivory",      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", rating: 4.8, reviews: 124, inStock: true },
  { id: 2,  name: "Indigo Block Print",      price: 1499, original: 2499, tag: "SOLD OUT", category: "Shirts",   sizesDetailed: [{ size: "S", stock: 0 }, { size: "M", stock: 0 }, { size: "L", stock: 0 }],                           color: "Indigo",     image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80", rating: 4.6, reviews: 89,  inStock: false },
  { id: 3,  name: "Tribal Geometry Tee",     price: 1099, original: 1999, tag: "SALE",     category: "T-Shirts", sizesDetailed: [{ size: "XS", stock: 2 }, { size: "S", stock: 6 }, { size: "M", stock: 9 }, { size: "L", stock: 4 }, { size: "XL", stock: 2 }], color: "Sand", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", rating: 4.9, reviews: 201, inStock: true },
  { id: 4,  name: "Rangoli Oversized",       price: 1299, original: 2199, tag: "SALE",     category: "T-Shirts", sizesDetailed: [{ size: "M", stock: 5 }, { size: "L", stock: 7 }, { size: "XL", stock: 4 }, { size: "XXL", stock: 2 }], color: "Rust",     image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80", rating: 4.7, reviews: 156, inStock: true },
  { id: 5,  name: "Lotus Field Drop",        price: 1649, original: 2399, tag: "SALE",     category: "Shirts",   sizesDetailed: [{ size: "S", stock: 3 }, { size: "M", stock: 6 }, { size: "L", stock: 2 }, { size: "XL", stock: 1 }],  color: "Sage",      image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80", rating: 4.5, reviews: 73,  inStock: true },
  { id: 6,  name: "Mirror Work Tee",         price: 999,  original: 1799, tag: "SALE",     category: "T-Shirts", sizesDetailed: [{ size: "XS", stock: 4 }, { size: "S", stock: 7 }, { size: "M", stock: 3 }],                           color: "Black",      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", rating: 4.4, reviews: 48,  inStock: true },
  { id: 7,  name: "Warli Art Hoodie",        price: 1149, original: 1899, tag: "SALE",     category: "Hoodies",  sizesDetailed: [{ size: "S", stock: 2 }, { size: "M", stock: 5 }, { size: "L", stock: 4 }, { size: "XL", stock: 1 }],  color: "Cream",      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80", rating: 4.8, reviews: 92,  inStock: true },
  { id: 8,  name: "Ajrakh Heritage Shirt",   price: 2199, original: 3299, tag: "NEW",      category: "Shirts",   sizesDetailed: [{ size: "S", stock: 3 }, { size: "M", stock: 4 }, { size: "L", stock: 5 }, { size: "XL", stock: 2 }, { size: "XXL", stock: 1 }], color: "Terracotta", image: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80", rating: 5.0, reviews: 34, inStock: true },
];

/* ═══════════════════════════════════════════════════════════
   NORMALIZE — identical to ProductListing.js
═══════════════════════════════════════════════════════════ */
function normalizeProduct(p) {
  let sizesArr = [];
  if (Array.isArray(p.sizes) && p.sizes.length > 0) {
    sizesArr = p.sizes.map(s => ({
      id: s._id || s.id || s.size,
      size: s.size,
      stock: typeof s.stock === "number" ? s.stock : 0,
    }));
  }
  const isAllSizesOut = sizesArr.length > 0 && sizesArr.every(s => s.stock === 0);
  const inStock = (typeof p.inStock === "boolean" ? p.inStock : true) && !isAllSizesOut;
  const tag =
    typeof p.tag === "string" && p.tag ? p.tag
    : isAllSizesOut ? "SOLD OUT"
    : p.isNew       ? "NEW"
    : p.onSale      ? "SALE"
    : "";
  return {
    id:            p._id || p.id,
    name:          p.name,
    price:         p.price,
    original:      p.originalPrice || p.original || p.price,
    tag,
    category:      typeof p.category === "object" && p.category ? p.category.name || p.category : p.category || "Other",
    size:          sizesArr.length > 0 ? sizesArr.map(s => s.size) : p.size || [],
    sizesDetailed: sizesArr.length > 0 ? sizesArr : (p.sizesDetailed || []),
    color:         p.color || "—",
    image:         (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image) || "",
    rating:        typeof p.rating === "number" ? p.rating : p.averageRating || 0,
    reviews:       typeof p.reviewCount === "number" ? p.reviewCount : typeof p.reviews === "number" ? p.reviews : 0,
    inStock,
    slug:          p.slug,
  };
}

/* ═══════════════════════════════════════════════════════════
   STATIC CONTENT DATA
═══════════════════════════════════════════════════════════ */
const faqs = [
  { q: "WHAT IS THE RETURN POLICY?",            a: "We accept returns within 7 days of delivery for unused, unwashed items in original packaging. Sale items are final sale." },
  { q: "ARE ANY PURCHASES FINAL SALE?",         a: "Yes — items marked SALE at the time of purchase are final and cannot be returned or exchanged." },
  { q: "WHEN WILL I GET MY ORDER?",             a: "Standard delivery takes 5–7 business days across India. Prepaid orders are dispatched within 24 hours." },
  { q: "WHERE ARE YOUR PRODUCTS MANUFACTURED?", a: "All Lavish Loom pieces are designed and manufactured in India using premium high-gauge fabric." },
  { q: "HOW MUCH DOES SHIPPING COST?",          a: "Free shipping on all prepaid orders above ₹999. COD orders incur a flat ₹60 handling fee." },
];

const igImages = [
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80",
  "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
  "https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=500&q=80",
];

const MARQUEE_TEXT = "FREE SHIPPING ON PREPAID  •  HIGH GAUGE PREMIUM FABRIC  •  MADE IN INDIA  •  NEW COLLECTION LIVE  •  ";

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const tagBg = t =>
  t === "SOLD OUT" ? "#444"
  : t === "NEW"    ? "#2C6E49"
  : t === "SALE"   ? "#e8003d"
  : "#444";

const sizePillSt = (stock, isActive) => ({
  padding: "3px 9px",
  borderRadius: 3,
  border: isActive ? "1.5px solid #e8003d" : "1px solid rgba(255,255,255,0.18)",
  background: stock === 0 ? "transparent" : isActive ? "rgba(232,0,61,0.1)" : "rgba(255,255,255,0.06)",
  color: stock === 0 ? "rgba(255,255,255,0.22)" : isActive ? "#e8003d" : "rgba(255,255,255,0.7)",
  opacity: stock === 0 ? 0.5 : 1,
  fontWeight: isActive ? 700 : 500,
  cursor: stock === 0 ? "not-allowed" : "pointer",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  letterSpacing: "0.04em",
  transition: "all 0.15s",
  userSelect: "none",
});

/* ═══════════════════════════════════════════════════════════
   SIZE POPUP MODAL
═══════════════════════════════════════════════════════════ */
const SizeSelectPopup = ({ product, selectedSizes, setSelectedSizes, popupError, addingToCart, onConfirm, onClose }) => {
  if (!product) return null;
  const sizes = product.sizesDetailed || [];
  const allOut = sizes.every(s => s.stock === 0);
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "32px 28px 26px", minWidth: 300, maxWidth: "calc(100vw - 32px)", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", right: 14, top: 12, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center" }}>SELECT SIZE</p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 20, textAlign: "center" }}>{product.name}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 6 }}>
          {sizes.map(sz => {
            const isActive = selectedSizes[product.id] === sz.size && sz.stock > 0;
            return (
              <span key={sz.id || sz.size} style={sizePillSt(sz.stock, isActive)}
                onClick={() => { if (sz.stock === 0) return; setSelectedSizes(prev => ({ ...prev, [product.id]: sz.size })); }}
                title={sz.stock > 0 ? `In stock: ${sz.stock}` : "Sold out"}
              >
                {sz.size}
                <span style={{ fontSize: 9, marginLeft: 3, opacity: 0.55 }}>{sz.stock === 0 ? "✕" : sz.stock}</span>
              </span>
            );
          })}
        </div>
        {popupError && <p style={{ color: "#e8003d", fontSize: 12, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{popupError}</p>}
        <button
          onClick={onConfirm}
          disabled={addingToCart[product.id] || allOut}
          style={{
            marginTop: 20, background: addingToCart[product.id] ? "#333" : "#e8003d",
            color: "#fff", border: "none", borderRadius: 3,
            padding: "12px 36px", cursor: "pointer",
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            fontSize: 15, letterSpacing: "0.14em", transition: "background 0.2s",
            opacity: addingToCart[product.id] ? 0.7 : 1,
          }}
        >
          {addingToCart[product.id] ? "ADDING..." : "ADD TO CART"}
        </button>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PRODUCT CARD — dark Lavish Loom style
═══════════════════════════════════════════════════════════ */
const ProductCard = ({
  p, i, navigate,
  wishlist,
  toggleWishlist,
  selectedSizes,
  setSelectedSizes,
  addedToCart,
  addingToCart,
  onAddToCart
}) => {
  const [hovered, setHovered] = useState(false);
  const hasSizes  = Array.isArray(p.sizesDetailed) && p.sizesDetailed.length > 0;
  const isSoldOut = !p.inStock || (hasSizes && p.sizesDetailed.every(s => s.stock === 0));
  const showDiscount = typeof p.original === "number" && p.original > p.price && p.price > 0;

  // Updated wishlist logic: Only match _id or id by value (not both at once, and consistently)
  let isWishlisted = false;
  if (Array.isArray(wishlist)) {
    isWishlisted = wishlist.some(
      item =>
        (item && ((item._id && (item._id === (p._id || p.id))) ||
                  (item.id && (item.id === (p._id || p.id))) ||
                  (item._id && item._id === p.id) ||
                  (item.id && item.id === p.id)))
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: i * 0.05 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => navigate("product", p)}
      style={{ cursor: "pointer", position: "relative" }}
    >
      {/* IMAGE WRAPPER */}
      <div style={{ aspectRatio: "3/4", background: "#111", overflow: "hidden", borderRadius: 3, position: "relative" }}>
        <img
          src={p.image || "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80"}
          alt={p.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.52s ease"
          }}
        />

        {/* TAG */}
        {p.tag && (
          <span style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: tagBg(p.tag),
            color: "#fff",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.12em",
            padding: "3px 9px",
            borderRadius: 2,
            textTransform: "uppercase"
          }}>
            {p.tag}
          </span>
        )}

        {/* WISHLIST HEART */}
        <button
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          tabIndex={0}
          onClick={e => {
            e.stopPropagation();
            if (typeof toggleWishlist === "function") {
              // Always pass the original product object as expected for correct id matching
              toggleWishlist(p.id);
            }
          }}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: isWishlisted ? "rgba(232,0,61,0.8)" : "rgba(0,0,0,0.55)",
            border: "none",
            borderRadius: "50%",
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
            transition: "background 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(232,0,61,0.8)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = isWishlisted ? "rgba(232,0,61,0.8)" : "rgba(0,0,0,0.55)";
          }}
        >
          <FiHeart
            size={14}
            fill={isWishlisted ? "#e8003d" : "none"}
            color={isWishlisted ? "#e8003d" : "rgba(255,255,255,0.85)"}
          />
        </button>

        {/* ADD TO CART */}
        {!isSoldOut ? (
          <motion.button
            initial={false}
            animate={{ y: hovered ? 0 : 54, opacity: hovered ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            onClick={e => { e.stopPropagation(); onAddToCart(p, e); }}
            disabled={!!addingToCart[p.id]}
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: addedToCart === p.id ? "#2C6E49" : "#e8003d",
              color: "#fff", border: "none", padding: "13px",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif",
              transition: "background 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            }}
          >
            <FiShoppingBag size={12} />
            {addingToCart[p.id]  ? "ADDING..."
             : addedToCart === p.id ? "✓ ADDED"
             : hasSizes && selectedSizes[p.id] ? `ADD  (${selectedSizes[p.id]})`
             : "ADD TO CART"}
          </motion.button>
        ) : (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "rgba(60,60,60,0.9)", color: "rgba(255,255,255,0.4)",
            padding: "13px", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.14em", textAlign: "center",
            fontFamily: "'Barlow Condensed', sans-serif", cursor: "not-allowed"
          }}>
            SOLD OUT
          </div>
        )}
      </div>

      {/* CARD BODY */}
      <div style={{ paddingTop: 11 }}>
        <p style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 600,
          fontSize: "clamp(12px,1.2vw,14px)",
          letterSpacing: "0.07em",
          color: "#fff",
          textTransform: "uppercase",
          marginBottom: 7,
          lineHeight: 1.2
        }}>
          {p.name}
        </p>

        {/* SIZE PILLS */}
        {hasSizes && !isSoldOut && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
            {p.sizesDetailed.map(sz => {
              const isActive = selectedSizes[p.id] === sz.size && sz.stock > 0;
              return (
                <span key={sz.id || sz.size} style={sizePillSt(sz.stock, isActive)}
                  onClick={e => { e.stopPropagation(); if (sz.stock === 0) return; setSelectedSizes(prev => ({ ...prev, [p.id]: sz.size })); }}
                  title={sz.stock > 0 ? `Stock: ${sz.stock}` : "Sold out"}
                >
                  {sz.size}
                </span>
              );
            })}
          </div>
        )}

        {/* STARS */}
        {p.rating > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 7 }}>
            {[...Array(5)].map((_, idx) => (
              <FiStar key={idx} size={10}
                fill={idx < Math.floor(p.rating) ? "#e8003d" : "none"}
                color={idx < Math.floor(p.rating) ? "#e8003d" : "rgba(255,255,255,0.18)"}
              />
            ))}
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 2 }}>({p.reviews})</span>
          </div>
        )}

        {/* PRICE */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>
            RS. {p.price.toLocaleString()}.00
          </span>
          {showDiscount && (
            <>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.32)", textDecoration: "line-through" }}>
                RS. {p.original.toLocaleString()}.00
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#2C6E49", fontWeight: 700 }}>
                {Math.round((1 - p.price / p.original) * 100)}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   SKELETON CARD
═══════════════════════════════════════════════════════════ */
const SkeletonCard = () => (
  <div>
    <div style={{ aspectRatio: "3/4", borderRadius: 3, background: "linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%)", backgroundSize: "200% 100%", animation: "llShimmer 1.4s infinite" }} />
    <div style={{ paddingTop: 11 }}>
      <div style={{ height: 14, width: "68%", borderRadius: 2, background: "#1c1c1c", animation: "llShimmer 1.4s infinite", marginBottom: 8 }} />
      <div style={{ height: 14, width: "42%", borderRadius: 2, background: "#1c1c1c", animation: "llShimmer 1.4s infinite" }} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════ */
const HomePage = ({ navigate, wishlist = [], toggleWishlist, addToCart }) => {

  /* ── API state ── */
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);

  /* ── Cart state — mirrors ProductListing.js ── */
  const [selectedSizes,  setSelectedSizes]  = useState({});
  const [addedToCart,    setAddedToCart]    = useState(null);
  const [addingToCart,   setAddingToCart]   = useState({});
  const [showSizePopup,  setShowSizePopup]  = useState(false);
  const [popupProduct,   setPopupProduct]   = useState(null);
  const [popupError,     setPopupError]     = useState("");

  /* ── UI state ── */
  const [openFaq,  setOpenFaq]  = useState(null);
  const [igSlide,  setIgSlide]  = useState(0);

  /* ── Fetch 8 newest products from API ── */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const data = await productAPI.list({ sort: "newest", limit: 8 });
        const raw = data.products || data || [];
        if (!cancelled) {
          setProducts(raw.length > 0 ? raw.map(normalizeProduct) : STATIC_PRODUCTS);
        }
      } catch {
        if (!cancelled) setProducts(STATIC_PRODUCTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── Add to cart (identical logic to ProductListing) ── */
  const handleAddToCart = async (product, e) => {
    if (e) e.stopPropagation();
    const hasSizes     = Array.isArray(product.sizesDetailed) && product.sizesDetailed.length > 0;
    const selectedSize = hasSizes ? selectedSizes[product.id] : "";

    if (hasSizes && !selectedSize) {
      setPopupProduct(product);
      setPopupError("");
      setShowSizePopup(true);
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    try {
      await cartAPI.add({ productId: product.id, qty: 1, selectedSize: selectedSize || "" });
      if (addToCart) addToCart(product);
      setAddedToCart(product.id);
      setTimeout(() => setAddedToCart(null), 1500);
    } catch {
      alert("Could not add to cart. Please try again.");
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handlePopupConfirm = async () => {
    if (!popupProduct || !selectedSizes[popupProduct.id]?.trim()) {
      setPopupError("Please select a size.");
      return;
    }
    setAddingToCart(prev => ({ ...prev, [popupProduct.id]: true }));
    try {
      await cartAPI.add({ productId: popupProduct.id, qty: 1, selectedSize: selectedSizes[popupProduct.id] });
      if (addToCart) addToCart(popupProduct);
      setAddedToCart(popupProduct.id);
      setTimeout(() => setAddedToCart(null), 1500);
    } catch {
      alert("Could not add to cart. Please try again.");
    } finally {
      setAddingToCart(prev => ({ ...prev, [popupProduct.id]: false }));
      setShowSizePopup(false);
      setPopupError("");
      setPopupProduct(null);
    }
  };

  const closePopup = () => { setShowSizePopup(false); setPopupProduct(null); setPopupError(""); };

  /* ─────────────────────────────────────
     RENDER
  ───────────────────────────────────── */
  return (
    <div style={{ background: "#000", color: "#fff", paddingTop: 88 }}>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes llShimmer { from{background-position:200% 0} to{background-position:-200% 0} }
        .ll-marquee { display:flex; width:max-content; animation:llmarquee 22s linear infinite; }
        .ll-marquee:hover { animation-play-state:paused; }
        @keyframes llmarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        .ll-ig-slide { min-width:20%; aspect-ratio:1; flex-shrink:0; overflow:hidden; cursor:pointer; }
        @media(max-width:600px)  { .ll-ig-slide{min-width:50%!important;} }
        @media(min-width:601px) and (max-width:1024px){ .ll-ig-slide{min-width:33.33%!important;} }

        .ll-grid {
          display:grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%,230px),1fr));
          gap: clamp(12px,1.8vw,22px);
        }
        @media(max-width:480px) { .ll-grid{ grid-template-columns:repeat(2,1fr)!important; gap:10px!important; } }
      `}</style>

      {/* ═══════════ HERO ═══════════ */}
      <section style={{ position:"relative", height:"clamp(480px,80vh,820px)", overflow:"hidden", display:"flex", alignItems:"flex-end" }}>
        <img
          src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1800&q=90"
          alt="Hero"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.35)" }}
        />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.06) 65%)" }} />
        <div style={{ position:"relative", zIndex:2, width:"100%", padding:"clamp(24px,6vw,80px) clamp(20px,6%,80px) clamp(48px,8vh,100px)" }}>
          <motion.p
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:"clamp(11px,1.2vw,13px)", letterSpacing:"0.22em", color:"rgba(255,255,255,0.5)", marginBottom:12, textTransform:"uppercase" }}
          >NEW COLLECTION</motion.p>
          <motion.h1
            initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
            style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:"clamp(52px,11vw,140px)", color:"#fff", lineHeight:0.9, textTransform:"uppercase", marginBottom:6 }}
          >SHOP THE</motion.h1>
          <motion.h1
            initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
            style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontStyle:"italic", fontSize:"clamp(52px,11vw,140px)", color:"#fff", lineHeight:0.9, marginBottom:"clamp(24px,3vw,44px)" }}
          >Latest Collection</motion.h1>
          <motion.button
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
            whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={() => navigate("products")}
            style={{ display:"inline-flex", alignItems:"center", gap:10, background:"#e8003d", border:"none", color:"#fff", padding:"clamp(12px,1.5vw,16px) clamp(24px,3vw,44px)", fontSize:"clamp(13px,1.2vw,15px)", fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", cursor:"pointer", borderRadius:2, fontFamily:"'Barlow Condensed',sans-serif" }}
          >SHOP NOW <FiArrowRight size={14} /></motion.button>
        </div>
      </section>

      {/* ═══════════ MARQUEE ═══════════ */}
      <div style={{ background:"#e8003d", overflow:"hidden", padding:"10px 0" }}>
        <div className="ll-marquee">
          {[0,1].map(j => (
            <span key={j} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"clamp(12px,1.4vw,15px)", color:"#fff", letterSpacing:"0.15em", whiteSpace:"nowrap" }}>
              {Array(10).fill(MARQUEE_TEXT).join("")}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════ PRODUCTS SECTION ═══════════ */}
      <section style={{ maxWidth:1440, margin:"0 auto", padding:"clamp(40px,6vw,72px) clamp(16px,4vw,48px) clamp(16px,2vw,24px)" }}>
        {/* Header row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"clamp(20px,3vw,36px)", flexWrap:"wrap", gap:12 }}>
          <div>
            <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:"clamp(24px,4vw,48px)", color:"#fff", textTransform:"uppercase", lineHeight:1, letterSpacing:"0.01em" }}>
              NEWEST ARRIVALS
            </h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(12px,1.2vw,14px)", color:"rgba(255,255,255,0.38)", marginTop:6 }}>
              8 fresh pieces — just dropped
            </p>
          </div>
          <button
            onClick={() => navigate("products")}
            style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, color:"#e8003d", background:"none", border:"1.5px solid #e8003d", cursor:"pointer", letterSpacing:"0.12em", display:"flex", alignItems:"center", gap:6, padding:"8px 18px", borderRadius:2, transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background="#e8003d"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color="#e8003d"; }}
          >
            VIEW ALL <FiArrowRight size={13} />
          </button>
        </div>

        {/* Grid */}
        <div
          className="ll-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "32px 22px",
            width: "100%",
          }}
        >
          {loading
            ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p, i) => (
                <ProductCard
                  key={p.id} p={p} i={i}
                  navigate={navigate}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={setSelectedSizes}
                  addedToCart={addedToCart}
                  addingToCart={addingToCart}
                  onAddToCart={handleAddToCart}
                />
              ))
          }
        </div>
  

        {/* View all CTA */}
        {!loading && (
          <motion.div
            initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            style={{ textAlign:"center", marginTop:"clamp(32px,5vw,56px)" }}
          >
            <button
              onClick={() => navigate("products")}
              style={{ background:"none", border:"2px solid rgba(255,255,255,0.18)", color:"#fff", padding:"14px clamp(28px,5vw,56px)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"clamp(13px,1.4vw,15px)", letterSpacing:"0.18em", textTransform:"uppercase", cursor:"pointer", borderRadius:2, transition:"all 0.25s", display:"inline-flex", alignItems:"center", gap:10 }}
              onMouseEnter={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.color="#000"; e.currentTarget.style.border="2px solid #fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color="#fff"; e.currentTarget.style.border="2px solid rgba(255,255,255,0.18)"; }}
            >
              EXPLORE ALL PRODUCTS <FiArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </section>

      {/* ═══════════ LOOKBOOK STRIP ═══════════ */}
      <section style={{ position:"relative", overflow:"hidden", marginTop:"clamp(40px,6vw,72px)" }}>
        <div style={{ display:"flex", transition:"transform 0.42s cubic-bezier(0.4,0,0.2,1)", transform:`translateX(-${igSlide * 20}%)` }}>
          {[...igImages, ...igImages].map((src, i) => (
            <div key={i} className="ll-ig-slide">
              <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", filter:"grayscale(25%)", transition:"filter 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.filter="grayscale(0%)"}
                onMouseLeave={e => e.currentTarget.style.filter="grayscale(25%)"}
              />
            </div>
          ))}
        </div>
        {[
          { side:"left",  icon:<FiChevronLeft size={18}/>,  action:()=>setIgSlide(v=>Math.max(0,v-1)) },
          { side:"right", icon:<FiChevronRight size={18}/>, action:()=>setIgSlide(v=>Math.min(igImages.length-1,v+1)) },
        ].map(({side,icon,action})=>(
          <button key={side} onClick={action} style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", [side]:12, background:"rgba(0,0,0,0.6)", border:"none", color:"#fff", width:36, height:36, borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2, backdropFilter:"blur(4px)" }}>
            {icon}
          </button>
        ))}
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"20%", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.6)", pointerEvents:"none" }}>
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:"clamp(16px,2.5vw,30px)", color:"#fff", letterSpacing:"0.04em", textTransform:"uppercase", lineHeight:1.1, textAlign:"center", padding:"0 12px" }}>
            HIGH GAUGE<br/>PREMIUM FABRIC
          </p>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section style={{ padding:"clamp(48px,7vw,96px) clamp(16px,6vw,80px)", maxWidth:1100, margin:"0 auto" }}>
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:"clamp(28px,5vw,56px)", color:"#fff", marginBottom:"clamp(28px,4vw,48px)" }}>
          Frequently asked questions
        </h2>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)" }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
              <button
                onClick={() => setOpenFaq(openFaq===i ? null : i)}
                style={{ width:"100%", background:"none", border:"none", cursor:"pointer", color:"#fff", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"clamp(16px,2vw,22px) 0", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"clamp(13px,1.4vw,16px)", letterSpacing:"0.08em", textAlign:"left" }}
              >
                {faq.q}
                <motion.span animate={{ rotate: openFaq===i ? 180 : 0 }} transition={{ duration:0.2 }} style={{ flexShrink:0, marginLeft:16 }}>
                  <FiChevronDown size={18} color="rgba(255,255,255,0.35)" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openFaq===i && (
                  <motion.div key="faq-body" initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.25 }} style={{ overflow:"hidden" }}>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(13px,1.3vw,15px)", color:"rgba(255,255,255,0.5)", lineHeight:1.75, paddingBottom:"clamp(16px,2vw,22px)" }}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ SIZE POPUP ═══════════ */}
      <AnimatePresence>
        {showSizePopup && (
          <SizeSelectPopup
            product={popupProduct}
            selectedSizes={selectedSizes} setSelectedSizes={setSelectedSizes}
            popupError={popupError}
            addingToCart={addingToCart}
            onConfirm={handlePopupConfirm}
            onClose={closePopup}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;