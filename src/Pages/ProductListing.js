
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiHeart, FiStar } from "react-icons/fi";
import { productAPI } from "./api";

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

// Accurately normalize API product shape, especially sizes, inStock and original/tag
function normalizeProduct(p) {
  // If every size has zero or missing stock, mark as out of stock
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
  // Allow forced inStock=false from API, but use size stock for accuracy
  const inStock = (typeof p.inStock === "boolean"
    ? p.inStock
    : true // fallback if missing field
  ) && !isAllSizesOut;

  // Tag logic: Use from API (`tag`) or fallback rules
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
    // If sizes object, map to string array for filter/search UI usage:
    size: sizesArr.length > 0 ? sizesArr.map(s => s.size) : p.size || [],
    // Also pass full detailed sizes for card footers etc.
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

  // Fetch and filter with debounce
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

  // Local filtering/sorting applied on top of static fallback
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

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 1500);
  };

  const s = {
    page: { background: "#FAF8F4", minHeight: "100vh", paddingTop: 80 },
    header: {
      padding: "40px 40px 24px",
      maxWidth: 1400,
      margin: "0 auto",
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
      fontSize: "clamp(28px,4vw,42px)",
      color: "#1A1612",
      letterSpacing: "0.03em",
    },
    subtitle: {
      fontFamily: "'Cormorant Garamond', serif",
      fontStyle: "italic",
      fontSize: 16,
      color: "#8C7B6B",
      marginTop: 6,
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
      background: "#FFF",
      border: "1px solid #E2D9CE",
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
      color: "#1A1612",
      width: "100%",
    },
    catBtn: (active) => ({
      background: active ? "#1A1612" : "transparent",
      color: active ? "#FAF8F4" : "#8C7B6B",
      border: `1px solid ${active ? "#1A1612" : "#E2D9CE"}`,
      padding: "8px 18px",
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.1em",
      cursor: "pointer",
      fontFamily: "'DM Sans'",
      transition: "all 0.2s",
    }),
    sortSelect: {
      background: "#FFF",
      border: "1px solid #E2D9CE",
      padding: "9px 16px",
      borderRadius: 6,
      fontSize: 12,
      fontFamily: "'DM Sans'",
      color: "#1A1612",
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
      background: "#FFF",
      borderRadius: 12,
      overflow: "hidden",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(26,22,18,0.06)",
      transition: "box-shadow 0.3s",
      position: "relative",
    },
    imgWrap: {
      position: "relative",
      aspectRatio: "3/4",
      overflow: "hidden",
      background: "#EEE8DE",
    },
    img: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease",
      display: "block",
    },
    tag: (t) => ({
      position: "absolute",
      top: 12,
      left: 12,
      background:
        t === "SOLD OUT"
          ? "#8C7B6B"
          : t === "NEW"
          ? "#2C6E49"
          : t === "SALE"
          ? "#C4622D"
          : "#8C7B6B",
      color: "#FFF",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.15em",
      padding: "4px 10px",
      borderRadius: 2,
      textTransform: "uppercase",
    }),
    heartBtn: {
      position: "absolute",
      top: 12,
      right: 12,
      background: "#FFF",
      borderRadius: "50%",
      width: 34,
      height: 34,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "none",
    },
    addBtn: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#1A1612",
      color: "#FAF8F4",
      border: "none",
      padding: "14px",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.12em",
      cursor: "pointer",
      fontFamily: "'DM Sans'",
      transition: "background 0.2s",
    },
    cardBody: {
      padding: "14px 16px 16px",
    },
    productName: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: 15,
      color: "#1A1612",
      marginBottom: 4,
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
      fontWeight: 700,
      fontSize: 15,
      color: "#C4622D",
    },
    original: {
      fontFamily: "'DM Sans'",
      fontSize: 13,
      color: "#B0A090",
      textDecoration: "line-through",
    },
    skeleton: {
      background:
        "linear-gradient(90deg, #F0EBE3 25%, #FAF8F4 50%, #F0EBE3 75%)",
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
      color: "#6c635b",
      minHeight: 18,
    },
    sizePill: (stock) => ({
      padding: "2px 9px",
      borderRadius: 8,
      border: "1px solid #E2D9CE",
      background: stock === 0 ? "#E2D9CE" : "#F7F6EF",
      color: stock === 0 ? "#B0A090" : "#5A5048",
      opacity: stock === 0 ? 0.5 : 1,
      fontWeight: 500,
    }),
    stockStatus: (inStock) => ({
      fontSize: 12,
      fontWeight: 600,
      color: inStock ? "#2C6E49" : "#B0A090",
      marginTop: 10,
      marginBottom: 2,
      fontFamily: "'DM Sans'",
      letterSpacing: "0.05em",
    }),
  };

  const SkeletonCard = () => (
    <div style={s.card}>
      <div
        style={{
          ...s.imgWrap,
          animation: "shimmer 1.5s infinite",
          background:
            "linear-gradient(90deg, #F0EBE3 25%, #FAF8F4 50%, #F0EBE3 75%)",
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

  return (
    <div style={s.page}>
      <style>{`@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }`}</style>
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
          <FiSearch size={15} color="#8C7B6B" />
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
            color: "#8C7B6B",
            marginLeft: "auto",
          }}
        >
          {loading ? "Loading…" : `${displayProducts.length} products`}
        </span>
      </div>

      <div style={s.grid}>
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <AnimatePresence>
            {displayProducts.map((p, i) => {
              // If using API products, show more accurate stock status/size info if present
              const hasSizes = Array.isArray(p.sizesDetailed) && p.sizesDetailed.length > 0;
              const isSoldOut =
                (typeof p.inStock === "boolean" && !p.inStock) ||
                (hasSizes && p.sizesDetailed.every((s) => s.stock === 0));
              const stockStatusLabel = isSoldOut
                ? "Out of Stock"
                : hasSizes
                ? "Available"
                : "In Stock";

              // For original comparison
              const showDiscount =
                typeof p.original === "number" &&
                p.original > p.price &&
                p.price > 0;

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
                        ? "0 8px 32px rgba(26,22,18,0.14)"
                        : "0 2px 8px rgba(26,22,18,0.06)",
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
                        color: wishlist.includes(p.id) ? "#C4622D" : "#8C7B6B",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                    >
                      <FiHeart
                        size={15}
                        fill={wishlist.includes(p.id) ? "#C4622D" : "none"}
                        color={
                          wishlist.includes(p.id) ? "#C4622D" : "#8C7B6B"
                        }
                      />
                    </button>
                    {!isSoldOut ? (
                      <motion.button
                        style={{
                          ...s.addBtn,
                          background:
                            addedToCart === p.id ? "#2C6E49" : "#1A1612",
                        }}
                        initial={false}
                        animate={{
                          y: hoveredProduct === p.id ? 0 : 48,
                          opacity: hoveredProduct === p.id ? 1 : 0,
                        }}
                        onClick={(e) => handleAddToCart(p, e)}
                      >
                        {addedToCart === p.id ? "✓ ADDED" : "ADD TO CART"}
                      </motion.button>
                    ) : (
                      <div
                        style={{
                          ...s.addBtn,
                          background: "#8C7B6B",
                          textAlign: "center",
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          cursor: "not-allowed",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
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
                    {hasSizes && (
                      <div style={s.sizeRow}>
                        {p.sizesDetailed.map((sz) => (
                          <span
                            key={sz.id || sz.size}
                            style={s.sizePill(sz.stock)}
                            title={
                              sz.stock > 0
                                ? `In stock: ${sz.stock}`
                                : "Sold out"
                            }
                          >
                            {sz.size}
                            {typeof sz.stock === "number" && (
                              <span style={{ fontSize: 10, marginLeft: 3 }}>
                                {sz.stock === 0 ? "×" : sz.stock}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                    {p.rating > 0 && (
                      <div style={s.stars}>
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={11}
                            fill={i < Math.floor(p.rating) ? "#B8922A" : "none"}
                            color="#B8922A"
                          />
                        ))}
                        <span
                          style={{
                            fontFamily: "'DM Sans'",
                            fontSize: 11,
                            color: "#8C7B6B",
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
                              fontSize: 11,
                              color: "#2C6E49",
                              fontWeight: 600,
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