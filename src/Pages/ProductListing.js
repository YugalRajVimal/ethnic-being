
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiHeart, FiStar } from "react-icons/fi";
import { productAPI, cartAPI } from "./api";

// Fallback static products (used if API is unavailable)
const STATIC_PRODUCTS = [
  { id: 1, name: "Mughal Garden Tee", price: 1849, original: 2299, tag: "SALE", category: "T-Shirts", size: ["XS","S","M","L","XL"], color: "Ivory", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", rating: 4.8, reviews: 124, inStock: true },
  { id: 2, name: "Indigo Block Print", price: 1499, original: 2499, tag: "SOLD OUT", category: "Shirts", size: ["S","M","L"], color: "Indigo", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80", rating: 4.6, reviews: 89, inStock: false },
  { id: 3, name: "Tribal Geometry Tee", price: 1099, original: 1999, tag: "SALE", category: "T-Shirts", size: ["XS","S","M","L","XL","XXL"], color: "Sand", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", rating: 4.9, reviews: 201, inStock: true },
  { id: 4, name: "Rangoli Oversized", price: 1299, original: 2199, tag: "SALE", category: "T-Shirts", size: ["M","L","XL","XXL"], color: "Rust", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80", rating: 4.7, reviews: 156, inStock: true },
  { id: 5, name: "Lotus Field Drop", price: 1649, original: 2399, tag: "SALE", category: "Shirts", size: ["S","M","L","XL"], color: "Sage", image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80", rating: 4.5, reviews: 73, inStock: true },
  { id: 6, name: "Mirror Work Tee", price: 999, original: 1799, tag: "SALE", category: "T-Shirts", size: ["XS","S","M"], color: "Black", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", rating: 4.4, reviews: 48, inStock: true },
  { id: 7, name: "Warli Art Print", price: 1149, original: 1899, tag: "SALE", category: "Hoodies", size: ["S","M","L","XL"], color: "Cream", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80", rating: 4.8, reviews: 92, inStock: true },
  { id: 8, name: "Paisley Wash Tee", price: 1349, original: 2099, tag: "SALE", category: "T-Shirts", size: ["M","L","XL"], color: "Dusty Rose", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", rating: 4.6, reviews: 67, inStock: true },
  { id: 9, name: "Ajrakh Heritage Shirt", price: 2199, original: 3299, tag: "NEW", category: "Shirts", size: ["S","M","L","XL","XXL"], color: "Terracotta", image: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80", rating: 5.0, reviews: 34, inStock: true },
  { id: 10, name: "Kalamkari Oversized", price: 1799, original: 2699, tag: "NEW", category: "Hoodies", size: ["L","XL","XXL"], color: "Forest", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", rating: 4.9, reviews: 28, inStock: true },
  { id: 11, name: "Dhokra Art Tee", price: 1249, original: 1899, tag: "SALE", category: "T-Shirts", size: ["XS","S","M","L"], color: "Charcoal", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80", rating: 4.7, reviews: 112, inStock: true },
  { id: 12, name: "Ikat Woven Jogger", price: 1899, original: 2799, tag: "SALE", category: "Bottoms", size: ["S","M","L","XL"], color: "Multi", image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80", rating: 4.6, reviews: 55, inStock: true },
];

// Normalization function unchanged
function normalizeProduct(p) {
  let isAllSizesOut = false;
  let sizesArr = [];
  if (Array.isArray(p.sizes) && p.sizes.length > 0) {
    sizesArr = p.sizes.map(s => ({
      id: s._id || s.id || s.size,
      size: s.size,
      stock: typeof s.stock === "number" ? s.stock : 0,
    }));
    isAllSizesOut = sizesArr.every(s => s.stock === 0);
  }
  const inStock = (typeof p.inStock === "boolean"
    ? p.inStock
    : true
  ) && !isAllSizesOut;

  const tag =
    typeof p.tag === "string" && p.tag
      ? p.tag
      : isAllSizesOut
      ? "SOLD OUT"
      : p.isNew
      ? "NEW"
      : p.onSale
      ? "SALE"
      : "";

  return {
    id: p._id || p.id,
    name: p.name,
    price: p.price,
    original: p.originalPrice || p.original || p.price,
    tag,
    category: typeof p.category === "object" && p.category
      ? p.category.name || p.category
      : p.category || "Other",
    size: sizesArr.length > 0 ? sizesArr.map(s => s.size) : p.size || [],
    sizesDetailed: sizesArr,
    color: p.color || "—",
    image:
      (Array.isArray(p.images) && p.images.length > 0
        ? p.images[0]
        : p.image) || "",
    rating: typeof p.rating === "number" ? p.rating : p.averageRating || 0,
    reviews:
      typeof p.reviewCount === "number"
        ? p.reviewCount
        : typeof p.reviews === "number"
        ? p.reviews
        : 0,
    inStock,
    slug: p.slug,
  };
}

const CATEGORIES = [
  "All",
  "T-Shirts",
  "Shirts",
  "Hoodies",
  "Bottoms",
  "Accessories",
];
const SORT_OPTIONS = [
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
  "Most Popular",
];

export default function ProductListing({
  navigate,
  wishlist,
  toggleWishlist,
  addToCart,
}) {
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [priceRange, setPriceRange] = useState([0, 3500]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState(null);

  const [selectedSizes, setSelectedSizes] = useState({});
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [popupError, setPopupError] = useState("");

  // BEGIN wishlist structure patch
  // Accept "wishlist" as array of product objects OR array of IDs
  // Use a Set of IDs for fast lookup
  const wishlistIds = useMemo(() => {
    if (Array.isArray(wishlist)) {
      if (wishlist.length === 0) return new Set();
      if (
        typeof wishlist[0] === "object" &&
        wishlist[0] !== null &&
        ("_id" in wishlist[0] || "id" in wishlist[0])
      ) {
        // array of objects
        return new Set(wishlist.map(item => item._id || item.id));
      } else {
        // array of id strings or numbers
        return new Set(wishlist);
      }
    }
    return new Set();
  }, [wishlist]);
  // END wishlist structure patch

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const params = {};
        if (search) params.q = search;
        if (activeCategory !== "All") params.category = activeCategory;
        params.minPrice = priceRange[0];
        params.maxPrice = priceRange[1];
        if (sortBy === "Price: Low to High") params.sort = "price_asc";
        else if (sortBy === "Price: High to Low") params.sort = "price_desc";
        else if (sortBy === "Most Popular") params.sort = "popular";
        else params.sort = "newest";

        const data = await productAPI.list(params);
        const raw = data.products || data || [];
        if (raw.length > 0) {
          setProducts(raw.map(normalizeProduct));
          setApiError(false);
        } else {
          setApiError(true);
        }
      } catch {
        setApiError(true);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, activeCategory, sortBy, priceRange]);

  const displayProducts = apiError
    ? STATIC_PRODUCTS.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === "All" || p.category === activeCategory;
        const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        return matchSearch && matchCat && matchPrice;
      }).sort((a, b) => {
        if (sortBy === "Price: Low to High") return a.price - b.price;
        if (sortBy === "Price: High to Low") return b.price - a.price;
        if (sortBy === "Most Popular") return b.reviews - a.reviews;
        return b.id - a.id;
      })
    : products;

  const [addingToCart, setAddingToCart] = useState({});
  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    const hasSizes = Array.isArray(product.sizesDetailed) && product.sizesDetailed.length > 0;
    let selectedSize = hasSizes ? selectedSizes[product.id] : "";
    if (hasSizes && !selectedSize) {
      setPopupProduct(product);
      setPopupError("");
      setShowSizePopup(true);
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    try {
      await cartAPI.add({
        productId: product.id,
        qty: 1,
        selectedSize: selectedSize || "",
      });
      if (addToCart) addToCart(product);

      setAddedToCart(product.id);
      setTimeout(() => setAddedToCart(null), 1500);
    } catch (err) {
      alert("Could not add to cart. Please try again.");
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handlePopupAddToCart = async () => {
    if (
      !popupProduct ||
      !selectedSizes[popupProduct.id] ||
      !selectedSizes[popupProduct.id].trim()
    ) {
      setPopupError("Please select a size.");
      return;
    }
    setAddingToCart(prev => ({ ...prev, [popupProduct.id]: true }));

    try {
      await cartAPI.add({
        productId: popupProduct.id,
        qty: 1,
        selectedSize: selectedSizes[popupProduct.id],
      });
      if (addToCart) addToCart(popupProduct);

      setAddedToCart(popupProduct.id);
      setTimeout(() => setAddedToCart(null), 1500);
      setShowSizePopup(false);
    } catch (err) {
      alert("Could not add to cart. Please try again.");
    } finally {
      setAddingToCart(prev => ({ ...prev, [popupProduct.id]: false }));
      setShowSizePopup(false);
      setPopupError("");
      setPopupProduct(null);
    }
  };

  // --- CUSTOMIZED STYLE OBJECTS (BLACK/WHITE/RED THEME) ---
  const RED = "#EF233C";
  const WHITE = "#FFF";
  const NEAR_WHITE = "#EDEDED";
  const BLACK = "#101012";
  const DARKER = "#191821";
  const GREY = "#444";
  const GREY_ALT = "#222126";
  const CARD_HOVER = "#15151d";
  const HIGHLIGHT = RED;

  const s = {
    page: { background: "#000000", minHeight: "100vh", paddingTop: 80 },
    header: {
      padding: "40px 40px 24px",
      maxWidth: 1400,
      margin: "0 auto",
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
      fontSize: "clamp(28px,4vw,42px)",
      color: WHITE,
      letterSpacing: "0.03em",
      textShadow: `0 2px 16px rgba(239,35,60,0.12)`,
      borderBottom: `2px solid ${RED}`,
      display: "inline-block",
      paddingBottom: 4,
    },
    subtitle: {
      fontFamily: "'Cormorant Garamond', serif",
      fontStyle: "italic",
      fontSize: 16,
      color: HIGHLIGHT,
      marginTop: 6,
      letterSpacing: "0.04em",
      textShadow: `0 1px 6px rgba(239,35,60,.1)`,
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "0 40px 24px",
      maxWidth: 1400,
      margin: "0 auto",
      flexWrap: "wrap",
    },
    searchBox: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: GREY_ALT,
      border: `1px solid ${RED}`,
      borderRadius: 6,
      padding: "10px 16px",
      flex: "1 1 240px",
    },
    searchInput: {
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "'DM Sans'",
      fontSize: 13,
      color: WHITE,
      width: "100%",
    },
    catBtn: (active) => ({
      background: active ? RED : "transparent",
      color: active ? WHITE : NEAR_WHITE,
      border: `1.2px solid ${active ? RED : GREY}`,
      padding: "8px 18px",
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: "0.1em",
      cursor: "pointer",
      fontFamily: "'DM Sans'",
      transition: "all 0.2s",
      outline: active ? `2px solid ${RED}` : undefined,
      boxShadow: active ? `0 2px 12px ${RED}33` : undefined,
      textShadow: active ? `0 1px 2px #53201657` : undefined,
    }),
    sortSelect: {
      background: GREY_ALT,
      border: `1.2px solid ${RED}`,
      padding: "9px 16px",
      borderRadius: 6,
      fontSize: 12,
      fontFamily: "'DM Sans'",
      color: RED,
      cursor: "pointer",
      outline: "none",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: 24,
      padding: "0 40px 60px",
      maxWidth: 1400,
      margin: "0 auto",
    },
    card: {
      background: GREY_ALT,
      borderRadius: 12,
      overflow: "hidden",
      cursor: "pointer",
      boxShadow: "0 2px 18px rgba(239,35,60,0.04)",
      transition: "box-shadow 0.3s, background 0.3s",
      position: "relative",
      border: `1.5px solid transparent`,
    },
    imgWrap: {
      position: "relative",
      aspectRatio: "3/4",
      overflow: "hidden",
      background: "#140e0c",
    },
    img: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s cubic-bezier(.22,.68,.55,1.31)",
      display: "block",
      filter: "brightness(0.975) contrast(1.07)",
    },
    tag: (t) => ({
      position: "absolute",
      top: 12,
      left: 12,
      background:
        t === "SOLD OUT"
          ? "#F35657"
          : t === "NEW"
          ? "#EF233C"
          : t === "SALE"
          ? "#F1976F"
          : "#F35657",
      color: "#fff",
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: "0.15em",
      padding: "4px 10px",
      borderRadius: 2,
      textTransform: "uppercase",
      boxShadow: "0 2px 4px #3e1c2934",
      border: "1.2px solid #fff1",
    }),
    heartBtn: {
      position: "absolute",
      top: 12,
      right: 12,
      background: "rgba(16,16,18,0.92)",
      borderRadius: "50%",
      width: 34,
      height: 34,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: `0 2px 8px ${RED}40`,
      border: `2px solid ${RED}`,
      transition: "background 0.16s",
    },
    addBtn: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      background: HIGHLIGHT,
      color: WHITE,
      border: "none",
      padding: "14px",
      fontSize: 13,
      fontWeight: 800,
      letterSpacing: "0.14em",
      cursor: "pointer",
      fontFamily: "'DM Sans'",
      transition: "background 0.2s, color 0.2s",
      // borderBottomLeftRadius: 10,
      // borderBottomRightRadius: 10,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderTop: "1px solid #ef233c33",
      textShadow: "0 1px 2px #2c021b38",
    },
    cardBody: {
      padding: "14px 16px 16px",
    },
    productName: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
      fontSize: 16,
      color: "#fff",
      marginBottom: 4,
      textShadow: `0 1px 8px #e7414130`,
      letterSpacing: ".01em",
    },
    stars: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      marginBottom: 8,
    },
    priceRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    },
    price: {
      fontFamily: "'DM Sans'",
      fontWeight: 900,
      fontSize: 15,
      color: RED,
      textShadow: `0 1px 4px #fff6`,
      borderBottom: `2px solid ${RED}`,
      borderRadius: 2,
      padding: "1px 7px",
      background: "#24121c88",
    },
    original: {
      fontFamily: "'DM Sans'",
      fontSize: 13,
      color: "#F1976F",
      textDecoration: "line-through",
      opacity: 0.8,
    },
    skeleton: {
      background:
        "linear-gradient(90deg, #222126 25%, #191821 50%, #222126 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      borderRadius: 8,
    },
    sizeRow: {
      marginTop: 8,
      display: "flex",
      gap: 5,
      flexWrap: "wrap",
      fontFamily: "'DM Sans'",
      fontSize: 12,
      color: "#f8d9d3",
      minHeight: 18,
    },
    sizePill: (stock, isActive) => ({
      padding: "2px 9px",
      borderRadius: 8,
      border: isActive ? `2.5px solid ${RED}` : `1px solid #EF233C44`,
      background: stock === 0 ? "#EF233C33" : "#253249",
      color: stock === 0 ? "#EF233C55" : isActive ? RED : WHITE,
      opacity: stock === 0 ? 0.45 : 1,
      fontWeight: isActive ? 900 : 600,
      cursor: stock === 0 ? "not-allowed" : "pointer",
      boxShadow: isActive ? `0 2px 8px ${RED}3b` : undefined,
      outline: isActive ? `2px solid ${RED}` : undefined,
      position: "relative",
      textShadow: "0 1px 2px #2b0c1250",
      letterSpacing: ".1em",
    }),
    stockStatus: (inStock) => ({
      fontSize: 12,
      fontWeight: 800,
      color: inStock ? WHITE : RED,
      marginTop: 10,
      marginBottom: 2,
      fontFamily: "'DM Sans'",
      letterSpacing: "0.05em",
      textShadow: `0 1px 3px ${inStock ? WHITE : RED}40`,
    }),
    // P O P U P  modal
    modalBackdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(16,16,18,0.85)",
      zIndex: 1001,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modal: {
      background: GREY_ALT,
      borderRadius: 12,
      boxShadow: `0 8px 32px ${RED}20`,
      padding: "32px 28px 24px",
      minWidth: 320,
      maxWidth: "calc(100vw - 32px)",
      zIndex: 1002,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      border: `2.2px solid ${RED}99`,
    },
    modalTitle: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 800,
      fontSize: 21,
      color: RED,
      marginBottom: 8,
      marginTop: -4,
      textShadow: "0 1px 9px #ef233c29, 0 2px #222",
      letterSpacing: ".1em"
    },
    modalBodyText: {
      fontFamily: "'DM Sans'",
      color: WHITE,
      fontSize: 15,
      marginBottom: 12,
      textAlign: "center",
      maxWidth: 320,
      textShadow: "0 1px 7px #07050846",
    },
    modalClose: {
      position: "absolute",
      right: 20,
      top: 18,
      fontSize: 23,
      color: RED,
      cursor: "pointer",
      border: "none",
      background: "transparent",
      fontWeight: 500,
      transition: "color 0.2s",
      outline: "none",
    },
    modalError: {
      color: RED,
      fontSize: 13,
      margin: "4px 0 8px",
      textAlign: "center",
      minHeight: 18,
      fontWeight: "bold",
      letterSpacing: ".08em"
    },
    modalAddBtn: {
      background: RED,
      color: WHITE,
      border: "none",
      borderRadius: 6,
      fontSize: 14,
      fontWeight: 900,
      padding: "10px 30px",
      marginTop: 15,
      marginBottom: -4,
      fontFamily: "'DM Sans'",
      transition: "background 0.2s",
      cursor: "pointer",
      letterSpacing: "0.12em",
      outline: `2px solid ${RED}`,
      boxShadow: "0 2px 10px #ef233c82",
    },
    modalSizeRow: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: 4,
      justifyContent: "center",
      marginTop: 6,
    },
  };

  const SkeletonCard = () => (
    <div style={s.card}>
      <div
        style={{
          ...s.imgWrap,
          animation: "shimmer 1.5s infinite",
          background:
            "linear-gradient(90deg, #1e191a 25%, #191821 45%, #1e191a 75%)",
          backgroundSize: "200% 100%",
        }}
      />
      <div style={s.cardBody}>
        <div
          style={{ ...s.skeleton, height: 18, width: "70%", marginBottom: 8 }}
        />
        <div
          style={{ ...s.skeleton, height: 14, width: "40%", marginBottom: 10 }}
        />
        <div style={{ ...s.skeleton, height: 16, width: "50%" }} />
      </div>
    </div>
  );

  // --- Size selection modal pop-up ---
  const SizeSelectPopup = ({ product, onClose }) => {
    if (!product) return null;
    const sizes = product.sizesDetailed || [];
    const disabledAll = sizes.every(s => s.stock === 0);
    return (
      <div style={s.modalBackdrop} onClick={onClose}>
        <motion.div
          style={s.modal}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22, mass: 0.8 }}
          onClick={e => e.stopPropagation()}
        >
          <button style={s.modalClose} onClick={onClose} aria-label="Close">
            ×
          </button>
          <div style={s.modalTitle}>Select Size</div>
          <div style={s.modalBodyText}>{product.name}</div>
          <div style={s.modalSizeRow}>
            {sizes.map(sz => {
              const isActive = selectedSizes[product.id] === sz.size && sz.stock > 0;
              return (
                <span
                  key={sz.id || sz.size}
                  style={s.sizePill(sz.stock, isActive)}
                  title={sz.stock > 0 ? `In stock: ${sz.stock}` : "Sold out"}
                  tabIndex={sz.stock === 0 ? -1 : 0}
                  aria-disabled={sz.stock === 0 ? "true" : undefined}
                  onClick={() => {
                    if (sz.stock === 0) return;
                    setSelectedSizes(prev => ({
                      ...prev,
                      [product.id]: sz.size,
                    }));
                    setPopupError(""); // clear error if any
                  }}
                >
                  {sz.size}
                  {typeof sz.stock === "number" && (
                    <span style={{ fontSize: 10, marginLeft: 3 }}>
                      {sz.stock === 0 ? "×" : sz.stock}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
          <div style={s.modalError}>{popupError ? popupError : ""}</div>
          <button
            style={{
              ...s.modalAddBtn,
              opacity: addingToCart[product.id] ? 0.7 : 1,
              pointerEvents: addingToCart[product.id] ? "none" : "auto",
            }}
            disabled={addingToCart[product.id] || disabledAll}
            onClick={handlePopupAddToCart}
          >
            {addingToCart[product.id] ? "ADDING..." : "Add to Cart"}
          </button>
        </motion.div>
      </div>
    );
  };

  return (
    <div style={s.page}>
      <style>{`@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
      ::selection { background: #ef233caa !important; color: #fff; }
      `}</style>
      <div style={s.header}>
        <motion.h1
          style={s.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          All Products
        </motion.h1>
        <p style={s.subtitle}>Wear your roots. Tell your story.</p>
      </div>

      <div style={s.toolbar}>
        <div style={s.searchBox}>
          <FiSearch size={15} color={RED} />
          <input
            style={s.searchInput}
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              style={s.catBtn(activeCategory === cat)}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          style={s.sortSelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <span
          style={{
            fontFamily: "'DM Sans'",
            fontSize: 13,
            color: RED,
            marginLeft: "auto",
            fontWeight: 700,
            letterSpacing: ".04em"
          }}
        >
          {loading ? "Loading…" : `${displayProducts.length} products`}
        </span>
      </div>

      {/* Size Select Pop-up Modal */}
      <AnimatePresence>
        {showSizePopup && (
          <SizeSelectPopup
            product={popupProduct}
            onClose={() => {
              setShowSizePopup(false);
              setPopupProduct(null);
              setPopupError("");
            }}
          />
        )}
      </AnimatePresence>

      <div style={s.grid}>
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <AnimatePresence>
            {displayProducts.map((p, i) => {
              const hasSizes = Array.isArray(p.sizesDetailed) && p.sizesDetailed.length > 0;
              const isSoldOut =
                (typeof p.inStock === "boolean" && !p.inStock) ||
                (hasSizes && p.sizesDetailed.every((s) => s.stock === 0));

              const showDiscount =
                typeof p.original === "number" &&
                p.original > p.price &&
                p.price > 0;

              // For size selection: if sizes exist & any in stock, show clickable pills
              let renderSizes = null;
              if (hasSizes && !isSoldOut) {
                renderSizes = (
                  <div style={s.sizeRow}>
                    {p.sizesDetailed.map((sz) => {
                      const isActive =
                        selectedSizes[p.id] === sz.size && sz.stock > 0;
                      return (
                        <span
                          key={sz.id || sz.size}
                          style={s.sizePill(sz.stock, isActive)}
                          title={
                            sz.stock > 0
                              ? `In stock: ${sz.stock}`
                              : "Sold out"
                          }
                          onClick={
                            sz.stock === 0
                              ? undefined
                              : (e) => {
                                  e.stopPropagation();
                                  setSelectedSizes((prev) => ({
                                    ...prev,
                                    [p.id]: sz.size,
                                  }));
                                }
                          }
                          tabIndex={sz.stock === 0 ? -1 : 0}
                          aria-disabled={sz.stock === 0 ? "true" : undefined}
                        >
                          {sz.size}
                          {typeof sz.stock === "number" && (
                            <span style={{ fontSize: 10, marginLeft: 3 }}>
                              {sz.stock === 0 ? "×" : sz.stock}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                );
              } else if (hasSizes && isSoldOut) {
                renderSizes = (
                  <div style={s.sizeRow}>
                    {p.sizesDetailed.map((sz) => (
                      <span
                        key={sz.id || sz.size}
                        style={s.sizePill(sz.stock, false)}
                        title="Sold out"
                        aria-disabled="true"
                      >
                        {sz.size}
                        {typeof sz.stock === "number" && (
                          <span style={{ fontSize: 10, marginLeft: 3 }}>
                            ×
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                );
              }

              // PATCH: wishlist structure
              // We use wishlistIds for determining wishlisted state!
              const wishlisted = wishlistIds.has(p.id) || wishlistIds.has(p._id);

              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    ...s.card,
                    boxShadow:
                      hoveredProduct === p.id
                        ? `0 8px 32px ${RED}29`
                        : "0 2px 8px rgba(239,35,60,0.02)",
                    background: hoveredProduct === p.id ? CARD_HOVER : s.card.background,
                    border: hoveredProduct === p.id ? `1.5px solid ${RED}` : s.card.border,
                  }}
                  onMouseEnter={() => setHoveredProduct(p.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => navigate("product", p)}
                >
                  <div style={s.imgWrap}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{
                        ...s.img,
                        transform:
                          hoveredProduct === p.id
                            ? "scale(1.07)"
                            : "scale(1)",
                      }}
                    />
                    {(!!p.tag || isSoldOut) && (
                      <span style={s.tag(isSoldOut ? "SOLD OUT" : p.tag)}>{isSoldOut ? "SOLD OUT" : p.tag}</span>
                    )}
                    <button
                      style={{
                        ...s.heartBtn,
                        background: wishlisted ? RED : s.heartBtn.background,
                        color: wishlisted ? "#fff" : RED,
                        borderColor: wishlisted ? "#fff" : RED,
                        boxShadow: wishlisted ? "0 2px 12px #ef233c66" : s.heartBtn.boxShadow,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // PATCH: get ID to toggleWishlist
                        toggleWishlist(p.id);
                      }}
                    >
                      <FiHeart
                        size={16}
                        fill={wishlisted ? RED : "none"}
                        color={
                          wishlisted ? "#fff" : RED
                        }
                      />
                    </button>
                    {!isSoldOut ? (
                      <motion.button
                        style={{
                          ...s.addBtn,
                          background:
                            addedToCart === p.id
                              ? "#1affd3"
                              : HIGHLIGHT,
                          color: addedToCart === p.id ? RED : "#fff",
                          opacity: addingToCart[p.id] ? 0.65 : 1,
                          pointerEvents: addingToCart[p.id] ? "none" : "auto",
                        }}
                        initial={false}
                        animate={{
                          y: hoveredProduct === p.id ? 0 : 48,
                          opacity: hoveredProduct === p.id ? 1 : 0,
                        }}
                        onClick={e => handleAddToCart(p, e)}
                        disabled={!!addingToCart[p.id]}
                      >
                        {addingToCart[p.id]
                          ? "ADDING..."
                          : addedToCart === p.id
                          ? "✓ ADDED"
                          : hasSizes
                            ? selectedSizes[p.id]
                              ? `ADD (${selectedSizes[p.id]})`
                              : "ADD TO CART"
                            : "ADD TO CART"}
                      </motion.button>
                    ) : (
                      <div
                        style={{
                          ...s.addBtn,
                          background: "#18161b",
                          color: RED,
                          textAlign: "center",
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          cursor: "not-allowed",
                          fontWeight: 900,
                          letterSpacing: "0.12em",
                        }}
                      >
                        SOLD OUT
                      </div>
                    )}
                  </div>
                  <div style={s.cardBody}>
                    <p style={s.productName}>{p.name}</p>
                    {/* Stock Status */}
                    <div style={s.stockStatus(!isSoldOut)}>
                      {isSoldOut ? "Out of Stock" : "In Stock"}
                    </div>
                    {/* Sizes display if present */}
                    {renderSizes}
                    {p.rating > 0 && (
                      <div style={s.stars}>
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={12}
                            fill={i < Math.floor(p.rating) ? RED : "none"}
                            color={RED}
                          />
                        ))}
                        <span
                          style={{
                            fontFamily: "'DM Sans'",
                            fontSize: 11,
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        >
                          ({p.reviews})
                        </span>
                      </div>
                    )}
                    <div style={s.priceRow}>
                      <span style={s.price}>
                        Rs. {typeof p.price === "number" ? p.price.toLocaleString() : p.price}
                      </span>
                      {showDiscount && (
                        <>
                          <span style={s.original}>
                            Rs. {typeof p.original === "number"
                              ? p.original.toLocaleString()
                              : p.original}
                          </span>
                          <span
                            style={{
                              marginLeft: "auto",
                              fontFamily: "'DM Sans'",
                              fontSize: 12,
                              color: RED,
                              fontWeight: 800,
                              paddingLeft: 6,
                            }}
                          >
                            {Math.round(
                              (1 - p.price / p.original) * 100
                            )}
                            % OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export { STATIC_PRODUCTS as PRODUCTS };