// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiHeart, FiShoppingBag, FiStar, FiChevronLeft, FiShare2, FiChevronDown, FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";

// const RELATED = [
//   { id: 3, name: "Tribal Geometry Tee", price: 1099, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80" },
//   { id: 9, name: "Ajrakh Heritage Shirt", price: 2199, image: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=400&q=80" },
//   { id: 4, name: "Rangoli Oversized", price: 1299, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80" },
//   { id: 7, name: "Warli Art Print", price: 1149, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80" },
// ];

// const REVIEWS = [
//   { name: "Priya S.", rating: 5, date: "Apr 2026", comment: "Absolutely love the print quality. The fabric is so soft and the fit is perfect!", verified: true },
//   { name: "Arjun M.", rating: 4, date: "Mar 2026", comment: "Great design, very unique. Took a week to deliver but worth the wait.", verified: true },
//   { name: "Sneha K.", rating: 5, date: "Mar 2026", comment: "The craftsmanship is incredible. Got so many compliments when I wore this.", verified: true },
// ];

// export default function ProductDetail({ product, navigate, wishlist, toggleWishlist, addToCart }) {
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [qty, setQty] = useState(1);
//   const [activeImg, setActiveImg] = useState(0);
//   const [added, setAdded] = useState(false);
//   const [openFaq, setOpenFaq] = useState(null);
//   const [sizeError, setSizeError] = useState(false);

//   const imgs = [product.image, product.image, product.image];

//   const handleAddToCart = () => {
//     if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000); return; }
//     addToCart({ ...product, selectedSize, qty });
//     setAdded(true);
//     setTimeout(() => setAdded(false), 2000);
//   };

//   const faqs = [
//     { q: "Shipping & Delivery", a: "Free shipping on orders above Rs. 999. Standard delivery in 5–7 business days. Express delivery in 2–3 business days." },
//     { q: "Returns & Exchange", a: "Easy 7-day returns for unused items. Exchange available for size issues. Initiate via your orders page." },
//     { q: "Fabric & Care", a: "100% cotton unless otherwise noted. Machine wash cold, inside out. Do not tumble dry. Iron on low heat." },
//   ];

//   const s = {
//     page: { background: "#FAF8F4", minHeight: "100vh", paddingTop: 80 },
//     breadcrumb: { padding: "20px 40px", display: "flex", alignItems: "center", gap: 8, maxWidth: 1300, margin: "0 auto" },
//     crumbLink: { fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B", cursor: "pointer", textDecoration: "none" },
//     crumbSep: { fontFamily: "'DM Sans'", fontSize: 12, color: "#D4C9BC" },
//     main: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, padding: "0 40px 80px", maxWidth: 1300, margin: "0 auto" },
//     imgSection: { position: "sticky", top: 100, alignSelf: "flex-start" },
//     mainImg: { borderRadius: 12, overflow: "hidden", aspectRatio: "3/4", background: "#EEE8DE", marginBottom: 12 },
//     thumbRow: { display: "flex", gap: 10 },
//     thumb: (active) => ({ borderRadius: 8, overflow: "hidden", aspectRatio: "1/1", flex: "0 0 80px", cursor: "pointer", border: `2px solid ${active ? "#C4622D" : "transparent"}`, transition: "border 0.2s" }),
//     infoSection: { paddingTop: 8 },
//     tag: (t) => ({ display: "inline-block", background: t === "SOLD OUT" ? "#8C7B6B" : t === "NEW" ? "#2C6E49" : "#C4622D", color: "#FFF", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", padding: "4px 10px", borderRadius: 2, marginBottom: 16 }),
//     name: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(24px,3vw,36px)", color: "#1A1612", lineHeight: 1.2, marginBottom: 12 },
//     ratingRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 20 },
//     price: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 28, color: "#C4622D", marginBottom: 4 },
//     originalPrice: { fontFamily: "'DM Sans'", fontSize: 14, color: "#B0A090", textDecoration: "line-through" },
//     divider: { height: 1, background: "#E2D9CE", margin: "20px 0" },
//     sizeLabel: { fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em", color: "#1A1612", marginBottom: 10 },
//     sizeGrid: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 },
//     sizeBtn: (active, oos) => ({ padding: "8px 16px", borderRadius: 4, border: `1.5px solid ${active ? "#1A1612" : "#E2D9CE"}`, background: active ? "#1A1612" : oos ? "#F5F0E8" : "#FFF", color: active ? "#FAF8F4" : oos ? "#C9C0B6" : "#1A1612", fontSize: 13, fontWeight: 600, cursor: oos ? "not-allowed" : "pointer", fontFamily: "'DM Sans'", textDecoration: oos ? "line-through" : "none", transition: "all 0.2s" }),
//     qtyRow: { display: "flex", alignItems: "center", gap: 0, marginBottom: 24, border: "1px solid #E2D9CE", borderRadius: 6, width: "fit-content" },
//     qtyBtn: { width: 40, height: 44, background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: "#1A1612", fontFamily: "'DM Sans'" },
//     qtyNum: { width: 44, textAlign: "center", fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 15, color: "#1A1612" },
//     ctas: { display: "flex", gap: 12, marginBottom: 24 },
//     addBtn: { flex: 1, background: "#1A1612", color: "#FAF8F4", border: "none", padding: "16px", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", cursor: "pointer", borderRadius: 6, fontFamily: "'DM Sans'", transition: "all 0.2s" },
//     wishBtn: { width: 52, height: 52, background: "#FFF", border: "1px solid #E2D9CE", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
//     trustRow: { display: "flex", gap: 20, flexWrap: "wrap" },
//     trustItem: { display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B" },
//   };

//   return (
//     <div style={s.page}>
//       <div style={s.breadcrumb}>
//         <span style={s.crumbLink} onClick={() => navigate("home")}>Home</span>
//         <span style={s.crumbSep}>/</span>
//         <span style={s.crumbLink} onClick={() => navigate("products")}>All Products</span>
//         <span style={s.crumbSep}>/</span>
//         <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#1A1612" }}>{product.name}</span>
//       </div>

//       <div style={s.main}>
//         {/* Image Gallery */}
//         <div style={s.imgSection}>
//           <motion.div style={s.mainImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//             <AnimatePresence mode="wait">
//               <motion.img key={activeImg} src={imgs[activeImg]} alt={product.name}
//                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//                 style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
//             </AnimatePresence>
//           </motion.div>
//           <div style={s.thumbRow}>
//             {imgs.map((img, i) => (
//               <div key={i} style={s.thumb(activeImg === i)} onClick={() => setActiveImg(i)}>
//                 <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div style={s.infoSection}>
//           {product.tag && <span style={s.tag(product.tag)}>{product.tag}</span>}
//           <h1 style={s.name}>{product.name}</h1>
          
//           <div style={s.ratingRow}>
//             {[...Array(5)].map((_, i) => <FiStar key={i} size={14} fill={i < Math.floor(product.rating) ? "#B8922A" : "none"} color="#B8922A" />)}
//             <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B" }}>{product.rating} · {product.reviews} reviews</span>
//           </div>

//           <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
//             <span style={s.price}>Rs. {product.price.toLocaleString()}</span>
//             <span style={s.originalPrice}>Rs. {product.original.toLocaleString()}</span>
//             <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#2C6E49", fontWeight: 700 }}>
//               {Math.round((1 - product.price/product.original)*100)}% OFF
//             </span>
//           </div>

//           <div style={s.divider} />

//           {/* Size Selection */}
//           <div style={{ marginBottom: 20 }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
//               <span style={s.sizeLabel}>SELECT SIZE</span>
//               <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#C4622D", cursor: "pointer" }}>Size Guide →</span>
//             </div>
//             <div style={s.sizeGrid}>
//               {product.size.map(sz => (
//                 <button key={sz} style={s.sizeBtn(selectedSize === sz, false)} onClick={() => setSelectedSize(sz)}>{sz}</button>
//               ))}
//             </div>
//             <AnimatePresence>
//               {sizeError && (
//                 <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
//                   style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#C4622D", marginTop: 6 }}>
//                   Please select a size to continue
//                 </motion.p>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Quantity */}
//           <div style={{ marginBottom: 20 }}>
//             <span style={s.sizeLabel}>QUANTITY</span>
//             <div style={{ marginTop: 10, ...s.qtyRow }}>
//               <button style={s.qtyBtn} onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
//               <span style={s.qtyNum}>{qty}</span>
//               <button style={s.qtyBtn} onClick={() => setQty(q => q+1)}>+</button>
//             </div>
//           </div>

//           {/* CTAs */}
//           <div style={s.ctas}>
//             <motion.button style={{ ...s.addBtn, background: added ? "#2C6E49" : "#1A1612" }}
//               whileHover={{ background: added ? "#2C6E49" : "#C4622D" }}
//               onClick={handleAddToCart}>
//               {added ? "✓ ADDED TO CART" : "ADD TO CART"}
//             </motion.button>
//             <button style={s.wishBtn} onClick={() => toggleWishlist(product.id)}>
//               <FiHeart size={18} fill={wishlist.includes(product.id) ? "#C4622D" : "none"} color={wishlist.includes(product.id) ? "#C4622D" : "#8C7B6B"} />
//             </button>
//           </div>

//           <motion.button
//             whileHover={{ background: "#1A1612", color: "#FAF8F4" }}
//             style={{ width: "100%", background: "transparent", border: "1.5px solid #1A1612", color: "#1A1612", padding: "14px", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", cursor: "pointer", borderRadius: 6, fontFamily: "'DM Sans'", marginBottom: 24, transition: "all 0.2s" }}
//             onClick={() => { handleAddToCart(); navigate("checkout"); }}
//           >
//             BUY NOW
//           </motion.button>

//           <div style={s.trustRow}>
//             <div style={s.trustItem}><FiTruck size={14} /><span>Free shipping over Rs. 999</span></div>
//             <div style={s.trustItem}><FiRefreshCw size={14} /><span>7-day easy returns</span></div>
//             <div style={s.trustItem}><FiShield size={14} /><span>Secure payments</span></div>
//           </div>

//           <div style={s.divider} />

//           {/* FAQs */}
//           {faqs.map((faq, i) => (
//             <div key={i} style={{ borderBottom: "1px solid #E2D9CE" }}>
//               <button style={{ width: "100%", background: "none", border: "none", padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
//                 onClick={() => setOpenFaq(openFaq === i ? null : i)}>
//                 <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, color: "#1A1612" }}>{faq.q}</span>
//                 <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}><FiChevronDown size={16} color="#8C7B6B" /></motion.div>
//               </button>
//               <AnimatePresence>
//                 {openFaq === i && (
//                   <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
//                     style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B", lineHeight: 1.7, paddingBottom: 16, overflow: "hidden" }}>
//                     {faq.a}
//                   </motion.p>
//                 )}
//               </AnimatePresence>
//             </div>
//           ))}

//           {/* Reviews */}
//           <div style={{ marginTop: 32 }}>
//             <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "#1A1612", marginBottom: 20 }}>Customer Reviews</h3>
//             {REVIEWS.map((r, i) => (
//               <div key={i} style={{ background: "#FFF", borderRadius: 8, padding: 20, marginBottom: 12 }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                     <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#C4622D", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14 }}>
//                       {r.name[0]}
//                     </div>
//                     <div>
//                       <div style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, color: "#1A1612" }}>{r.name}</div>
//                       <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
//                         {[...Array(5)].map((_, j) => <FiStar key={j} size={10} fill={j < r.rating ? "#B8922A" : "none"} color="#B8922A" />)}
//                       </div>
//                     </div>
//                   </div>
//                   <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#B0A090" }}>{r.date}</span>
//                 </div>
//                 <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#5A5048", lineHeight: 1.6 }}>{r.comment}</p>
//                 {r.verified && <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#2C6E49", marginTop: 8, display: "block" }}>✓ Verified Purchase</span>}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       <div style={{ padding: "40px 40px 80px", background: "#FFF", maxWidth: "100%" }}>
//         <div style={{ maxWidth: 1300, margin: "0 auto" }}>
//           <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24, color: "#1A1612", marginBottom: 24 }}>You May Also Like</h2>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
//             {RELATED.map(p => (
//               <motion.div key={p.id} whileHover={{ y: -4 }} style={{ cursor: "pointer" }} onClick={() => navigate("product", p)}>
//                 <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "3/4", background: "#EEE8DE", marginBottom: 10 }}>
//                   <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
//                 </div>
//                 <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 14, color: "#1A1612" }}>{p.name}</p>
//                 <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14, color: "#C4622D", marginTop: 4 }}>Rs. {p.price.toLocaleString()}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart,
  FiStar,
  FiChevronDown,
  FiTruck,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";
import { productAPI } from "./api";

const RELATED_FALLBACK = [
  {
    id: 3,
    name: "Tribal Geometry Tee",
    price: 1099,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80",
  },
  {
    id: 9,
    name: "Ajrakh Heritage Shirt",
    price: 2199,
    image:
      "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=400&q=80",
  },
  {
    id: 4,
    name: "Rangoli Oversized",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80",
  },
  {
    id: 7,
    name: "Warli Art Print",
    price: 1149,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80",
  },
];

export default function ProductDetail({
  product,
  navigate,
  wishlist,
  toggleWishlist,
  addToCart,
}) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [sizeError, setSizeError] = useState(false);

  // API-driven state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState(RELATED_FALLBACK);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const productId = product._id || product.id;
  const imgs = product.images?.length
    ? product.images
    : [product.image, product.image, product.image];

  useEffect(() => {
    // Load reviews
    productAPI
      .getReviews(productId)
      .then((data) => setReviews(data.reviews || data || []))
      .catch(() =>
        setReviews([
          {
            name: "Priya S.",
            rating: 5,
            date: "Apr 2026",
            comment:
              "Absolutely love the print quality. The fabric is so soft and the fit is perfect!",
            verified: true,
          },
          {
            name: "Arjun M.",
            rating: 4,
            date: "Mar 2026",
            comment:
              "Great design, very unique. Took a week to deliver but worth the wait.",
            verified: true,
          },
          {
            name: "Sneha K.",
            rating: 5,
            date: "Mar 2026",
            comment:
              "The craftsmanship is incredible. Got so many compliments when I wore this.",
            verified: true,
          },
        ])
      )
      .finally(() => setReviewsLoading(false));

    // Load related products
    productAPI
      .list({ category: product.category, limit: 4 })
      .then((data) => {
        const raw = data.products || data || [];
        const filtered = raw
          .filter((p) => (p._id || p.id) !== productId)
          .slice(0, 4);
        if (filtered.length) {
          setRelatedProducts(
            filtered.map((p) => ({
              id: p._id || p.id,
              name: p.name,
              price: p.price,
              image: p.images?.[0] || p.image,
            }))
          );
        }
      })
      .catch(() => {});
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart({ ...product, selectedSize, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.comment.trim()) {
      setReviewError("Please write a review.");
      return;
    }
    setSubmittingReview(true);
    setReviewError("");
    try {
      const data = await productAPI.addReview(productId, reviewForm);
      setReviews((prev) => [
        data.review ||
          { ...reviewForm, name: "You", date: "Just now", verified: true },
        ...prev,
      ]);
      setReviewForm({ rating: 5, comment: "" });
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError(
        err.message || "Failed to submit review. Please login first."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const faqs = [
    {
      q: "Shipping & Delivery",
      a:
        "Free shipping on orders above Rs. 999. Standard delivery in 5–7 business days. Express delivery in 2–3 business days.",
    },
    {
      q: "Returns & Exchange",
      a:
        "Easy 7-day returns for unused items. Exchange available for size issues. Initiate via your orders page.",
    },
    {
      q: "Fabric & Care",
      a:
        "100% cotton unless otherwise noted. Machine wash cold, inside out. Do not tumble dry. Iron on low heat.",
    },
  ];

  return (
    <div className="bg-[#FAF8F4] min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="px-6 py-5 flex items-center gap-2 max-w-[1300px] mx-auto text-xs">
        <button
          className="font-dmsans text-[#8C7B6B] hover:text-[#C4622D] transition"
          onClick={() => navigate("home")}
        >
          Home
        </button>
        <span className="text-[#D4C9BC]">/</span>
        <button
          className="font-dmsans text-[#8C7B6B] hover:text-[#C4622D] transition"
          onClick={() => navigate("products")}
        >
          All Products
        </button>
        <span className="text-[#D4C9BC]">/</span>
        <span className="font-dmsans text-[#1A1612]">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-14 gap-x-16 px-4 sm:px-6 pb-20 max-w-[1300px] mx-auto">
        {/* Image Gallery */}
        <div className="top-24 self-start">
          <motion.div
            className="rounded-xl overflow-hidden aspect-[3/4] bg-[#EEE8DE] mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={imgs[activeImg]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full object-cover block"
              />
            </AnimatePresence>
          </motion.div>
          <div className="flex gap-2">
            {imgs.slice(0, 4).map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImg(i)}
                className={`rounded-lg overflow-hidden aspect-square w-20 cursor-pointer border-2 transition-all ${
                  activeImg === i
                    ? "border-[#C4622D]"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover block"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Product Info */}
        <div className="pt-2">
          {product.tag && (
            <span
              className={`inline-block uppercase font-black tracking-wider text-[10px] py-1.5 px-4 rounded-sm mb-4
                ${
                  product.tag === "SOLD OUT"
                    ? "bg-[#8C7B6B] text-white"
                    : product.tag === "NEW"
                    ? "bg-[#2C6E49] text-white"
                    : "bg-[#C4622D] text-white"
                }
              `}
            >
              {product.tag}
            </span>
          )}
          <h1 className="font-playfair font-bold text-[clamp(24px,3vw,36px)] text-[#1A1612] leading-tight mb-3">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mb-5">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={14}
                fill={i < Math.floor(product.rating || 0) ? "#B8922A" : "none"}
                color="#B8922A"
              />
            ))}
            <span className="font-dmsans text-xs text-[#8C7B6B]">{product.rating} · {product.reviews} reviews</span>
          </div>
          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-playfair font-bold text-[28px] text-[#C4622D]">
              Rs. {product.price?.toLocaleString()}
            </span>
            {product.original > product.price && (
              <>
                <span className="font-dmsans text-sm text-[#B0A090] line-through">
                  Rs. {product.original?.toLocaleString()}
                </span>
                <span className="font-dmsans text-xs text-[#2C6E49] font-bold">
                  {Math.round((1 - product.price / product.original) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          <div className="h-px bg-[#E2D9CE] my-5" />
          {/* Size Selection */}
          {product.size?.length > 0 && (
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-dmsans font-semibold text-[12px] tracking-wide text-[#1A1612]">
                  SELECT SIZE
                </span>
                <span className="font-dmsans text-xs text-[#C4622D] cursor-pointer">
                  Size Guide →
                </span>
              </div>
              <div className="flex gap-2 flex-wrap mb-2">
                {product.size.map((sz) => (
                  <button
                    key={sz}
                    className={`py-2 px-4 rounded font-dmsans font-semibold text-[13px] border transition-all
                      ${
                        selectedSize === sz
                          ? "bg-[#1A1612] text-[#FAF8F4] border-[#1A1612]"
                          : "bg-white text-[#1A1612] border-[#E2D9CE] hover:border-[#C4622D]"
                      }
                    `}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {sizeError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-dmsans text-xs text-[#C4622D] mt-1"
                  >
                    Please select a size to continue
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )}
          {/* Quantity */}
          <div className="mb-5">
            <span className="font-dmsans font-semibold text-[12px] tracking-wide text-[#1A1612]">
              QUANTITY
            </span>
            <div className="mt-2 flex items-center border border-[#E2D9CE] rounded w-fit">
              <button
                className="w-10 h-11 text-lg font-dmsans text-[#1A1612] bg-transparent border-none"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="w-11 text-center font-dmsans font-semibold text-[15px] text-[#1A1612] select-none">
                {qty}
              </span>
              <button
                className="w-10 h-11 text-lg font-dmsans text-[#1A1612] bg-transparent border-none"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>
          {/* CTAs */}
          <div className="flex gap-3 mb-6">
            <motion.button
              className={`flex-1 font-dmsans font-semibold text-[13px] rounded px-4 py-4 transition-colors ${
                added
                  ? "bg-[#2C6E49] text-[#FAF8F4]"
                  : "bg-[#1A1612] text-[#FAF8F4] hover:bg-[#C4622D]"
              }`}
              onClick={handleAddToCart}
            >
              {added ? "✓ ADDED TO CART" : "ADD TO CART"}
            </motion.button>
            <button
              className="w-13 h-13 min-w-[52px] min-h-[52px] bg-white border border-[#E2D9CE] rounded flex items-center justify-center"
              onClick={() => toggleWishlist(productId)}
            >
              <FiHeart
                size={18}
                fill={wishlist.includes(productId) ? "#C4622D" : "none"}
                color={
                  wishlist.includes(productId) ? "#C4622D" : "#8C7B6B"
                }
              />
            </button>
          </div>
          <motion.button
            whileHover={{
              backgroundColor: "#1A1612",
              color: "#FAF8F4",
              borderColor: "#1A1612",
            }}
            className="w-full bg-transparent border-[1.5px] border-[#1A1612] text-[#1A1612] py-3.5 text-[13px] font-dmsans font-semibold tracking-wider cursor-pointer rounded mb-6 transition-all"
            onClick={() => {
              handleAddToCart();
              navigate("checkout");
            }}
          >
            BUY NOW
          </motion.button>
          {/* Trust row */}
          <div className="flex gap-5 flex-wrap mb-5">
            <div className="flex items-center gap-2 font-dmsans text-xs text-[#8C7B6B]">
              <FiTruck size={14} />
              <span>Free shipping over Rs. 999</span>
            </div>
            <div className="flex items-center gap-2 font-dmsans text-xs text-[#8C7B6B]">
              <FiRefreshCw size={14} />
              <span>7-day easy returns</span>
            </div>
            <div className="flex items-center gap-2 font-dmsans text-xs text-[#8C7B6B]">
              <FiShield size={14} />
              <span>Secure payments</span>
            </div>
          </div>
          <div className="h-px bg-[#E2D9CE] my-5" />
          {/* FAQs */}
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[#E2D9CE]">
              <button
                className="w-full bg-none border-none py-4 px-0 flex justify-between items-center cursor-pointer"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                type="button"
              >
                <span className="font-dmsans font-semibold text-[13px] text-[#1A1612]">
                  {faq.q}
                </span>
                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
                  <FiChevronDown size={16} color="#8C7B6B" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="font-dmsans text-[13px] text-[#8C7B6B] leading-7 pb-4 overflow-hidden"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
          {/* Reviews */}
          <div className="mt-8">
            <h3 className="font-playfair font-bold text-[20px] text-[#1A1612] mb-5">
              Customer Reviews
            </h3>
            {reviewsLoading ? (
              <p className="font-dmsans text-[13px] text-[#8C7B6B]">
                Loading reviews…
              </p>
            ) : (
              reviews.map((r, i) => {
                const reviewerName = r.user?.name || r.name || "Customer";
                const reviewDate = r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                    })
                  : r.date || "";
                return (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-5 mb-3 shadow-sm"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#C4622D] flex items-center justify-center text-white font-dmsans font-bold text-[14px]">
                          {reviewerName[0]}
                        </div>
                        <div>
                          <div className="font-dmsans font-semibold text-[13px] text-[#1A1612]">
                            {reviewerName}
                          </div>
                          <div className="flex gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, j) => (
                              <FiStar
                                key={j}
                                size={10}
                                fill={
                                  j < (r.rating || 5) ? "#B8922A" : "none"
                                }
                                color="#B8922A"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="font-dmsans text-[11px] text-[#B0A090]">
                        {reviewDate}
                      </span>
                    </div>
                    <p className="font-dmsans text-[13px] text-[#5A5048] leading-normal">
                      {r.comment}
                    </p>
                    {r.verified && (
                      <span className="font-dmsans text-[11px] text-[#2C6E49] mt-2 block">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                );
              })
            )}
            {/* Add Review Form */}
            <div className="bg-[#F5F0E8] rounded-xl p-5 mt-5">
              <p className="font-dmsans font-semibold text-[13px] text-[#1A1612] mb-3">
                Write a Review
              </p>
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className="bg-none border-none cursor-pointer p-0.5"
                    onClick={() =>
                      setReviewForm((f) => ({ ...f, rating: n }))
                    }
                  >
                    <FiStar
                      size={20}
                      fill={n <= reviewForm.rating ? "#B8922A" : "none"}
                      color="#B8922A"
                    />
                  </button>
                ))}
              </div>
              <textarea
                className="w-full bg-[#F5F0E8] border-[1.5px] border-[#E2D9CE] px-4 py-2.5 rounded text-[13px] font-dmsans text-[#1A1612] min-h-[80px] outline-none resize-y box-border"
                placeholder="Share your experience with this product…"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((f) => ({
                    ...f,
                    comment: e.target.value,
                  }))
                }
              />
              {reviewError && (
                <p className="font-dmsans text-xs text-[#C4622D] mt-1">
                  {reviewError}
                </p>
              )}
              {reviewSuccess && (
                <p className="font-dmsans text-xs text-[#2C6E49] mt-1">
                  ✓ Review submitted!
                </p>
              )}
              <motion.button
                className="bg-[#1A1612] text-white font-dmsans font-semibold px-6 py-2 rounded text-xs tracking-wider mt-2 transition-colors hover:bg-[#C4622D] disabled:bg-[#8C7B6B]"
                whileHover={{ background: "#C4622D" }}
                onClick={handleSubmitReview}
                disabled={submittingReview}
              >
                {submittingReview ? "SUBMITTING…" : "SUBMIT REVIEW"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="py-10 px-4 sm:px-6 bg-white max-w-full">
        <div className="max-w-[1300px] mx-auto">
          <h2 className="font-playfair font-bold text-[24px] text-[#1A1612] mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                className="cursor-pointer"
                onClick={() => navigate("product", p)}
              >
                <div className="rounded-xl overflow-hidden aspect-[3/4] bg-[#EEE8DE] mb-2.5">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover block"
                  />
                </div>
                <p className="font-playfair font-semibold text-[14px] text-[#1A1612]">
                  {p.name}
                </p>
                <p className="font-dmsans font-bold text-[14px] text-[#C4622D] mt-1">
                  Rs. {p.price?.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}