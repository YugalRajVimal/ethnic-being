// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiUser, FiShoppingBag, FiHeart, FiArrowRight } from "react-icons/fi";
// import { FaInstagram } from "react-icons/fa";

// // ─── IMPORT PAGES ─────────────────────────────────────────────────────────────
// import ProductListing, { PRODUCTS } from "./Pages/ProductListing";
// import Cart from "./Pages/Cart";
// import { OrderSuccess, Auth, Profile, Orders, Wishlist } from "./Pages/AuthAndProfile";
// import ProductDetail from "./Pages/ProductDetails";
// import Checkout from "./Pages/CheckOut";
// import { authFetch } from "./Pages/api";

// // ─── NAVBAR ───────────────────────────────────────────────────────────────────
// import { FiMenu } from "react-icons/fi";

// function Navbar({ navigate, cartCount, wishlistCount, user }) {
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   useEffect(() => {
//     const fn = () => setScrolled(window.scrollY > 40);
//     window.addEventListener("scroll", fn);
//     return () => window.removeEventListener("scroll", fn);
//   }, []);

//   const links = [
//     { label: "Home", page: "home" },
//     { label: "All Products", page: "products" },
//     { label: "Contact", page: "home" },
//   ];

//   return (
//     <>
//       <nav
//         className={`
//           fixed w-full z-[100] transition-all duration-300 
//           ${scrolled ? "border-b border-[rgba(180,146,42,0.2)]" : ""} 
//           bg-[rgba(26,22,18,0.97)] backdrop-blur-[12px]
//         `}
//         style={{ height: 64 }}
//       >
//         <div className="flex items-center justify-between h-16 px-2 sm:px-4 md:px-8 xl:px-12">
//           {/* Hamburger + Links */}
//           <div className="flex flex-1 items-center">
//             {/* Hamburger (Mobile) */}
//             <button
//               className="md:hidden mr-2 xs:mr-1 text-[#FAF8F4] opacity-85 p-2 rounded focus:outline-none"
//               onClick={() => setMobileOpen(o => !o)}
//               aria-label="Toggle menu"
//             >
//               <FiMenu size={24} />
//             </button>
//             {/* Desktop Links */}
//             <div className="hidden md:flex gap-5 xl:gap-7">
//               {links.map(l => (
//                 <button
//                   key={l.label}
//                   className="bg-none border-none outline-none cursor-pointer
//                     text-[#FAF8F4] text-xs sm:text-sm font-medium font-['DM_Sans'] tracking-wider opacity-85
//                     transition hover:text-[#C4622D]"
//                   onClick={() => navigate(l.page)}
//                 >
//                   {l.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//           {/* Logo */}
//           <div className="flex-1 justify-center flex text-center">
//             <span
//               className="font-['Playfair_Display'] font-black text-lg xs:text-xl sm:text-2xl md:text-[22px] text-[#FAF8F4] tracking-[0.12em] cursor-pointer select-none"
//               onClick={() => navigate("home")}
//             >
//               Ethnic
//               <span className="text-[#C4622D]">Being</span>
//             </span>
//           </div>
//           {/* Icons */}
//           <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3 md:gap-4">
//             {/* Wishlist */}
//             <button
//               className="relative bg-none border-none cursor-pointer text-[#FAF8F4] opacity-85"
//               onClick={() => navigate("wishlist")}
//               aria-label="Wishlist"
//             >
//               <FiHeart size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
//               {wishlistCount > 0 && (
//                 <span className="absolute -top-1.5 -right-1.5 bg-[#C4622D] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-['DM_Sans'] font-bold">
//                   {wishlistCount}
//                 </span>
//               )}
//             </button>
//             {/* User */}
//             <button
//               className="bg-none border-none cursor-pointer text-[#FAF8F4] opacity-85"
//               onClick={() => navigate(user ? "profile" : "auth")}
//               aria-label="Profile"
//             >
//               <FiUser size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
//             </button>
//             {/* Cart */}
//             <button
//               className="relative bg-none border-none cursor-pointer text-[#FAF8F4] opacity-85"
//               onClick={() => navigate("cart")}
//               aria-label="Cart"
//             >
//               <FiShoppingBag size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-1.5 -right-1.5 bg-[#C4622D] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-['DM_Sans'] font-bold">
//                   {cartCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Drawer */}
//         <AnimatePresence>
//           {mobileOpen && (
//             <motion.div
//               initial={{ x: "-100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-100%" }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="fixed top-0 left-0 w-[85vw] max-w-xs min-w-[200px] h-full bg-[rgba(26,22,18,0.99)] z-[101] p-4 xs:p-6 sm:p-8 flex flex-col gap-6 sm:gap-9 shadow-xl md:hidden"
//               style={{ fontFamily: "'DM Sans', sans-serif" }}
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <span
//                   className="font-['Playfair_Display'] font-black text-lg xs:text-xl sm:text-2xl text-[#FAF8F4] tracking-[0.12em] cursor-pointer select-none"
//                   onClick={() => {
//                     setMobileOpen(false)
//                     navigate("home")
//                   }}
//                 >
//                   Ethnic<span className="text-[#C4622D]">Being</span>
//                 </span>
//                 <button
//                   className="text-[#FAF8F4] bg-none border-none p-1 ml-2"
//                   onClick={() => setMobileOpen(false)}
//                   aria-label="Close menu"
//                 >
//                   <svg fill="none" viewBox="0 0 24 24" width={22} height={22}><path stroke="#FAF8F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"/></svg>
//                 </button>
//               </div>
//               {links.map(l => (
//                 <button
//                   key={l.label}
//                   className="bg-none border-none outline-none cursor-pointer text-left w-full
//                     text-[#FAF8F4] text-base xs:text-[15px] font-medium font-['DM_Sans'] tracking-wider opacity-85
//                     p-2 rounded hover:text-[#C4622D] transition"
//                   onClick={() => {
//                     setMobileOpen(false)
//                     navigate(l.page)
//                   }}
//                 >
//                   {l.label}
//                 </button>
//               ))}
//               <div className="flex gap-2 sm:gap-3 mt-4">
//                 {/* Repeat icons for mobile */}
//                 <button
//                   className="relative bg-none border-none cursor-pointer text-[#FAF8F4] opacity-85"
//                   onClick={() => { setMobileOpen(false); navigate("wishlist"); }}
//                   aria-label="Wishlist"
//                 >
//                   <FiHeart size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
//                   {wishlistCount > 0 && (
//                     <span className="absolute -top-1.5 -right-1.5 bg-[#C4622D] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-['DM_Sans'] font-bold">
//                       {wishlistCount}
//                     </span>
//                   )}
//                 </button>
//                 <button
//                   className="bg-none border-none cursor-pointer text-[#FAF8F4] opacity-85"
//                   onClick={() => { setMobileOpen(false); navigate(user ? "profile" : "auth"); }}
//                   aria-label="Profile"
//                 >
//                   <FiUser size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
//                 </button>
//                 <button
//                   className="relative bg-none border-none cursor-pointer text-[#FAF8F4] opacity-85"
//                   onClick={() => { setMobileOpen(false); navigate("cart"); }}
//                   aria-label="Cart"
//                 >
//                   <FiShoppingBag size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
//                   {cartCount > 0 && (
//                     <span className="absolute -top-1.5 -right-1.5 bg-[#C4622D] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-['DM_Sans'] font-bold">
//                       {cartCount}
//                     </span>
//                   )}
//                 </button>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Mobile backdrop */}
//         <AnimatePresence>
//           {mobileOpen && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 0.36 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.16 }}
//               className="fixed inset-0 bg-black z-[100] md:hidden"
//               onClick={() => setMobileOpen(false)}
//             />
//           )}
//         </AnimatePresence>
//       </nav>
//     </>
//   );
// }

// // ─── HOME PAGE (simplified bridge to existing Home.js) ────────────────────────
// function HomePage({ navigate }) {
//   const s = {
//     hero: { height: "100vh", background: "linear-gradient(135deg, #1A1612 0%, #2C1F14 60%, #3D2B1A 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", position: "relative", overflow: "hidden" },
//     heroImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45)" },
//     overlay: { position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,22,18,0.75) 0%, transparent 60%, rgba(196,98,45,0.15) 100%)" },
//     heroContent: { position: "relative", zIndex: 2, textAlign: "left", padding: "0 8%", width: "100%" },
//     tag: { display: "inline-block", background: "#C4622D", color: "#FAF8F4", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 2, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" },
//     h1: { fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(52px,9vw,110px)", color: "#FAF8F4", lineHeight: 1.0, whiteSpace: "pre-line", marginBottom: 16 },
//     subtitle: { fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 22, color: "rgba(250,248,244,0.75)", marginBottom: 36 },
//     cta: { display: "inline-flex", alignItems: "center", gap: 10, border: "1.5px solid rgba(250,248,244,0.7)", color: "#FAF8F4", padding: "15px 36px", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2, fontFamily: "'DM Sans', sans-serif", background: "transparent", transition: "all 0.25s" },
//   };

//   const bestsellers = PRODUCTS.slice(0, 8);

//   return (
//     <div style={{ background: "#FAF8F4" }}>
//       {/* Hero */}
//       <section style={s.hero}>
//         <img src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1600&q=90" alt="Hero" style={s.heroImg} />
//         <div style={s.overlay} />
//         <div style={s.heroContent}>
//           <motion.span style={s.tag} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>New Drop</motion.span>
//           <motion.h1 style={s.h1} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>{"Roots &\nRhythm"}</motion.h1>
//           <motion.p style={s.subtitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>SS'26 Collection</motion.p>
//           <motion.button style={s.cta} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
//             whileHover={{ background: "#FAF8F4", color: "#1A1612" }} onClick={() => navigate("products")}>
//             Shop Now <FiArrowRight size={14} />
//           </motion.button>
//         </div>
//       </section>

//       {/* Marquee */}
//       <div style={{ background: "#1A1612", overflow: "hidden", padding: "18px 0", borderTop: "1px solid rgba(180,146,42,0.2)", borderBottom: "1px solid rgba(180,146,42,0.2)" }}>
//         <style>{`.marquee-track{display:flex;width:max-content;animation:marquee 20s linear infinite}.marquee-track:hover{animation-play-state:paused}@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
//         <div className="marquee-track">
//           {[...Array(2)].map((_, j) => (
//             <span key={j} style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, fontSize: 18, color: "#FAF8F4", letterSpacing: "0.1em", whiteSpace: "nowrap", paddingRight: 60 }}>
//               {Array(12).fill("RAW REAL RELENTLESS.").join("  •  ")}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Bestsellers */}
//       <section style={{ padding: "72px 40px", maxWidth: 1400, margin: "0 auto" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
//           <div>
//             <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(22px,3vw,30px)", color: "#1A1612", letterSpacing: "0.04em" }}>BESTSELLERS</h2>
//             <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, color: "#8C7B6B", marginTop: 4 }}>The pieces everyone's reaching for</p>
//           </div>
//           <button onClick={() => navigate("products")} style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#C4622D", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 6 }}>
//             VIEW ALL <FiArrowRight size={12} />
//           </button>
//         </div>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
//           {bestsellers.map((p, i) => (
//             <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
//               style={{ cursor: "pointer", background: "#FFF", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 8px rgba(26,22,18,0.06)" }}
//               whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(26,22,18,0.12)" }}
//               onClick={() => navigate("product", p)}>
//               <div style={{ aspectRatio: "3/4", background: "#EEE8DE", overflow: "hidden" }}>
//                 <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s" }} />
//               </div>
//               <div style={{ padding: "12px 14px 14px" }}>
//                 <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 14, color: "#1A1612", marginBottom: 6 }}>{p.name}</p>
//                 <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//                   <span style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14, color: "#C4622D" }}>Rs. {p.price.toLocaleString()}</span>
//                   <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#B0A090", textDecoration: "line-through" }}>Rs. {p.original.toLocaleString()}</span>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Featured Banner */}
//       <section style={{ position: "relative", height: 480, overflow: "hidden", margin: "0 40px 72px", borderRadius: 16 }}>
//         <img src="https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=1400&q=90" alt="Featured" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5)" }} />
//         <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,22,18,0.8) 0%, transparent 60%)" }} />
//         <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px" }}>
//           <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#C4622D", letterSpacing: "0.2em", fontWeight: 700, marginBottom: 16, display: "block" }}>FEATURED DROP</span>
//           <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(36px,5vw,64px)", color: "#FAF8F4", lineHeight: 1.1, whiteSpace: "pre-line", marginBottom: 20 }}>{"The Heritage\nEdit"}</h2>
//           <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 18, color: "rgba(250,248,244,0.75)", maxWidth: 400, marginBottom: 32 }}>Each piece carries a story older than fashion.</p>
//           <motion.button whileHover={{ background: "#FAF8F4", color: "#1A1612" }} style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1.5px solid rgba(250,248,244,0.7)", color: "#FAF8F4", padding: "14px 32px", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", cursor: "pointer", borderRadius: 2, fontFamily: "'DM Sans'", background: "transparent", width: "fit-content", transition: "all 0.25s" }}
//             onClick={() => navigate("products")}>
//             EXPLORE THE EDIT <FiArrowRight size={14} />
//           </motion.button>
//         </div>
//       </section>

//       {/* Collections */}
//       <section style={{ padding: "0 40px 72px", maxWidth: 1400, margin: "0 auto" }}>
//         <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(22px,3vw,30px)", color: "#1A1612", letterSpacing: "0.04em", marginBottom: 36 }}>SHOP BY COLLECTION</h2>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
//           {[{label:"T-SHIRTS",img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"},{label:"SHIRTS",img:"https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80"},{label:"HOODIES",img:"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80"},{label:"BOTTOMS",img:"https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80"}].map((col, i) => (
//             <motion.div key={col.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
//               style={{ cursor: "pointer" }} whileHover={{ y: -4 }} onClick={() => navigate("products")}>
//               <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "1/1.1", background: "#EEE8DE", position: "relative" }}>
//                 <img src={col.img} alt={col.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
//               </div>
//               <p style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", color: "#1A1612", marginTop: 12, textAlign: "center" }}>{col.label}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer style={{ background: "#1A1612", padding: "64px 40px 28px" }}>
//         <div style={{ maxWidth: 1400, margin: "0 auto" }}>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 48, marginBottom: 48 }}>
//             <div>
//               <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 28, color: "#FAF8F4", letterSpacing: "0.1em" }}>
//                 Ethnic<span style={{ color: "#C4622D" }}>Being</span>
//               </span>
//               <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "#8C7B6B", marginTop: 10, lineHeight: 1.6 }}>Wear your roots. Tell your story.</p>
//               <div style={{ marginTop: 20 }}>
//                 <FaInstagram size={20} color="#8C7B6B" style={{ cursor: "pointer" }} />
//               </div>
//             </div>
//             <div style={{ display: "flex", gap: 64 }}>
//               {[{h:"Shop",l:["Home","All Products","Contact"]},{h:"Customer Care",l:["Orders","Profile","Returns"]}].map(({ h, l }) => (
//                 <div key={h}>
//                   <p style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, color: "#FAF8F4", marginBottom: 16, letterSpacing: "0.05em" }}>{h}</p>
//                   {l.map(link => <a key={link} href="#" style={{ display: "block", fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B", textDecoration: "none", marginBottom: 10 }}>{link}</a>)}
//                 </div>
//               ))}
//             </div>
//             <div>
//               <p style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, color: "#FAF8F4", marginBottom: 12, letterSpacing: "0.05em" }}>STAY IN THE LOOP</p>
//               <div style={{ display: "flex", marginTop: 8 }}>
//                 <input type="email" placeholder="your@email.com" style={{ flex: 1, background: "rgba(250,248,244,0.07)", border: "1px solid rgba(250,248,244,0.15)", borderRight: "none", color: "#FAF8F4", padding: "10px 14px", fontSize: 12, fontFamily: "'DM Sans'", borderRadius: "4px 0 0 4px", outline: "none" }} />
//                 <button style={{ background: "#C4622D", border: "none", color: "#FAF8F4", padding: "10px 16px", cursor: "pointer", borderRadius: "0 4px 4px 0", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", fontFamily: "'DM Sans'" }}>JOIN</button>
//               </div>
//             </div>
//           </div>
//           <div style={{ borderTop: "1px solid rgba(250,248,244,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B" }}>© 2026 ETHNICBEING. All rights reserved.</p>
//             <a href="#" style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B", textDecoration: "none" }}>Terms and Policies</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// // ─── MAIN APP (ROUTER + GLOBAL STATE) ────────────────────────────────────────
// export default function App() {
//   const [page, setPage] = useState("home");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [cart, setCart] = useState([]);
//   const [wishlist, setWishlist] = useState([]);
//   const [user, setUser] = useState(null);
//   const [lastOrder, setLastOrder] = useState(null);
//   const [authChecked, setAuthChecked] = useState(false);

//   useEffect(() => {
//     // Global font and reset -- as before
//     const style = document.createElement("style");
//     style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{font-family:'DM Sans',sans-serif;background:#FAF8F4;color:#1A1612;overflow-x:hidden}`;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   // On mount: check if already logged in, set user and redirect to profile if applicable
//   useEffect(() => {
//     let isMounted = true;
//     const checkAuth = async () => {
//       try {
//         // Call authFetch with correct path argument as required by api.js
//         // e.g. '/auth/me' or similar (depending on actual api.js signature)
//         const res = await authFetch("/auth/me");
//         console.log(res);
//         if (isMounted && res && res.user) {
//           setUser(res.user);
//           if (page === "auth") setPage("profile");
//         }
//       } finally {
//         setAuthChecked(true);
//       }
//     };
//     // Only check if a token exists, for fast-load UX
//     if (localStorage.getItem("eb_token")) {
//       checkAuth();
//     } else {
//       setAuthChecked(true);
//     }
//     return () => { isMounted = false; };
//     // eslint-disable-next-line
//   }, [page]); // check again when navigating to login/profile

//   const navigate = (pg, data) => {
//     if (pg === "product" && data) setSelectedProduct(data);
//     // Auth guarded navigation
//     if (pg === "auth" && user) {
//       setPage("profile");
//     } else {
//       setPage(pg);
//     }
//     window.scrollTo(0, 0);
//   };

//   const addToCart = (product) => {
//     setCart(prev => {
//       const existing = prev.find(i => i.id === product.id && i.selectedSize === product.selectedSize);
//       if (existing) return prev.map(i => i.id === product.id && i.selectedSize === product.selectedSize ? { ...i, qty: (i.qty || 1) + (product.qty || 1) } : i);
//       return [...prev, { ...product, qty: product.qty || 1 }];
//     });
//   };

//   const updateCart = (id, qty) => {
//     setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
//   };

//   const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

//   const toggleWishlist = (id) => {
//     setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
//   };

//   const placeOrder = (address, total) => {
//     setLastOrder(address);
//     setCart([]);
//   };

//   const cartCount = cart.reduce((sum, i) => sum + (i.qty || 1), 0);

//   const renderPage = () => {
//     if (!authChecked) {
//       // You may want to show a splash/loading indicator here
//       return <div style={{padding:40, textAlign:'center',color:'#8C7B6B'}}>Checking authentication...</div>
//     }
//     switch (page) {
//       case "home": return <HomePage navigate={navigate} />;
//       case "products": return <ProductListing navigate={navigate} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />;
//       case "product": return selectedProduct ? <ProductDetail product={selectedProduct} navigate={navigate} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} /> : null;
//       case "cart": return <Cart cart={cart} updateCart={updateCart} removeFromCart={removeFromCart} navigate={navigate} />;
//       case "checkout": return <Checkout cart={cart} navigate={navigate} placeOrder={placeOrder} />;
//       case "orderSuccess": return <OrderSuccess navigate={navigate} lastOrder={lastOrder} />;
//       case "auth": return <Auth navigate={navigate} login={(u) => { setUser(u); setPage("profile"); }} />;
//       case "profile": return <Profile user={user} navigate={navigate} logout={() => { setUser(null); setPage("home"); }} />;
//       case "orders": return <Orders navigate={navigate} />;
//       case "wishlist": return <Wishlist wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} navigate={navigate} allProducts={PRODUCTS} />;
//       default: return <HomePage navigate={navigate} />;
//     }
//   };

//   const showNavbar = !["auth"].includes(page);

//   return (
//     <div>
//       {showNavbar && <Navbar navigate={navigate} cartCount={cartCount} wishlistCount={wishlist.length} user={user} />}
//       <AnimatePresence mode="wait">
//         <motion.div key={page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
//           {renderPage()}
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiShoppingBag, FiHeart, FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";

// ─── IMPORT PAGES ─────────────────────────────────────────────────────────────
import ProductListing, { PRODUCTS } from "./Pages/ProductListing";
import Cart from "./Pages/Cart";
import { OrderSuccess, Auth, Profile, Orders, Wishlist } from "./Pages/AuthAndProfile";
import ProductDetail from "./Pages/ProductDetails";
import Checkout from "./Pages/CheckOut";
import { authFetch } from "./Pages/api";
import HomePage from "./Pages/HomePage";
import NavBar from "./Pages/NavBar";

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
// function Navbar({ navigate, cartCount, wishlistCount, user }) {
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   useEffect(() => {
//     const fn = () => setScrolled(window.scrollY > 40);
//     window.addEventListener("scroll", fn);
//     return () => window.removeEventListener("scroll", fn);
//   }, []);

//   // Lock body scroll when mobile menu open
//   useEffect(() => {
//     document.body.style.overflow = mobileOpen ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [mobileOpen]);

//   const links = [
//     { label: "Home", page: "home" },
//     { label: "All Products", page: "products" },
//     { label: "Contact", page: "home" },
//   ];

//   const IconBtn = ({ onClick, label, badge, children }) => (
//     <button
//       onClick={onClick}
//       aria-label={label}
//       style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "#FAF8F4", opacity: 0.9, padding: 6, display: "flex", alignItems: "center" }}
//     >
//       {children}
//       {badge > 0 && (
//         <span style={{
//           position: "absolute", top: 0, right: 0,
//           background: "#C4622D", color: "#fff",
//           borderRadius: "50%", width: 16, height: 16,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           fontSize: 9, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
//         }}>{badge}</span>
//       )}
//     </button>
//   );

//   return (
//     <>
//       {/* ── MAIN NAV ── */}
//       <nav style={{
//         position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
//         height: 64,
//         background: "rgba(26,22,18,0.97)",
//         backdropFilter: "blur(12px)",
//         borderBottom: scrolled ? "1px solid rgba(180,146,42,0.2)" : "1px solid transparent",
//         transition: "border-color 0.3s",
//       }}>
//         <div
//           className="main-nav-inner"
//           style={{
//             maxWidth: 1400,
//             margin: "0 auto",
//             height: "100%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "0 16px",
//           }}
//         >
//           {/* LEFT: Hamburger (mobile), Logo (mobile), Desktop links */}
//           <div
//             className="main-nav-left"
//             style={{
//               flex: 1,
//               display: "flex",
//               alignItems: "center",
//               gap: 4,
//             }}
//           >
//             {/* Hamburger — mobile only */}
//             <button
//               onClick={() => setMobileOpen(true)}
//               aria-label="Open menu"
//               style={{
//                 display: "none",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 color: "#FAF8F4",
//                 padding: 6,
//               }}
//               className="nav-hamburger"
//             >
//               <FiMenu size={22} />
//             </button>

//             {/* Logo — only visible on mobile */}
//             <span
//               className="nav-mobile-logo"
//               onClick={() => navigate("home")}
//               style={{
//                 display: "none",
//                 fontFamily: "'Playfair Display', serif",
//                 fontWeight: 900,
//                 fontSize: "clamp(18px, 3vw, 24px)",
//                 color: "#FAF8F4",
//                 letterSpacing: "0.12em",
//                 cursor: "pointer",
//                 userSelect: "none",
//                 whiteSpace: "nowrap",
//                 marginLeft: 8
//               }}
//             >
//               Ethnic<span style={{ color: "#C4622D" }}>Being</span>
//             </span>

//             {/* Desktop links */}
//             <div
//               className="nav-desktop-links"
//               style={{ display: "flex", gap: 28 }}
//             >
//               {links.map((l) => (
//                 <button
//                   key={l.label}
//                   onClick={() => navigate(l.page)}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: "#FAF8F4",
//                     fontFamily: "'DM Sans', sans-serif",
//                     fontSize: 13,
//                     fontWeight: 500,
//                     letterSpacing: "0.1em",
//                     opacity: 0.85,
//                     transition: "opacity 0.2s, color 0.2s",
//                     padding: 0,
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.opacity = 1;
//                     e.target.style.color = "#C4622D";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.opacity = 0.85;
//                     e.target.style.color = "#FAF8F4";
//                   }}
//                 >
//                   {l.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* CENTER: Logo (desktop only, hidden on mobile) */}
//           <div
//             className="main-nav-center flex-1 flex justify-center"
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <span
//               className="nav-desktop-logo"
//               onClick={() => navigate("home")}
//               style={{
//                 fontFamily: "'Playfair Display', serif",
//                 fontWeight: 900,
//                 fontSize: "clamp(18px, 3vw, 24px)",
//                 color: "#FAF8F4",
//                 letterSpacing: "0.12em",
//                 cursor: "pointer",
//                 userSelect: "none",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               Ethnic<span style={{ color: "#C4622D" }}>Being</span>
//             </span>
//           </div>

//           {/* RIGHT: Icons */}
//           <div
//             style={{
//               flex: 1,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "flex-end",
//               gap: 4,
//             }}
//           >
//             <IconBtn
//               onClick={() => navigate("wishlist")}
//               label="Wishlist"
//               badge={wishlistCount}
//             >
//               <FiHeart size={20} />
//             </IconBtn>
//             <IconBtn
//               onClick={() => navigate(user ? "profile" : "auth")}
//               label="Profile"
//             >
//               <FiUser size={20} />
//             </IconBtn>
//             <IconBtn
//               onClick={() => navigate("cart")}
//               label="Cart"
//               badge={cartCount}
//             >
//               <FiShoppingBag size={20} />
//             </IconBtn>
//           </div>
//         </div>
//         {/* Responsive CSS via style tag: move the logo beside hamburger on small screens, hide desktop links/logo on small screens */}
//         <style>
//           {`
//             @media (max-width: 768px) {
//               .nav-hamburger {
//                 display: inline-flex !important;
//               }
//               .nav-desktop-links {
//                 display: none !important;
//               }
//               .nav-desktop-logo {
//                 display: none !important;
//               }
//               .nav-mobile-logo {
//                 display: inline !important;
//               }
//             }
//             @media (min-width: 769px) {
//               .nav-mobile-logo {
//                 display: none !important;
//               }
//               .nav-desktop-logo {
//                 display: inline !important;
//               }
//             }
//           `}
//         </style>
   
//       </nav>

//       {/* ── MOBILE DRAWER ── */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               key="backdrop"
//               initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               onClick={() => setMobileOpen(false)}
//               style={{ position: "fixed", inset: 0, background: "#000", zIndex: 200 }}
//             />
//             {/* Drawer */}
//             <motion.div
//               key="drawer"
//               initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               style={{
//                 position: "fixed", top: 0, left: 0, bottom: 0,
//                 width: "min(320px, 85vw)",
//                 background: "rgba(20,17,13,0.99)",
//                 zIndex: 201,
//                 display: "flex", flexDirection: "column",
//                 padding: "24px 28px",
//               }}
//             >
//               {/* Drawer header */}
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
//                 <span style={{
//                   fontFamily: "'Playfair Display', serif", fontWeight: 900,
//                   fontSize: 22, color: "#FAF8F4", letterSpacing: "0.1em",
//                 }}>
//                   Ethnic<span style={{ color: "#C4622D" }}>Being</span>
//                 </span>
//                 <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#FAF8F4", padding: 4 }}>
//                   <FiX size={22} />
//                 </button>
//               </div>

//               {/* Drawer nav links */}
//               <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//                 {links.map(l => (
//                   <button key={l.label} onClick={() => { setMobileOpen(false); navigate(l.page); }} style={{
//                     background: "none", border: "none", cursor: "pointer",
//                     color: "#FAF8F4", fontFamily: "'DM Sans', sans-serif",
//                     fontSize: 18, fontWeight: 500, letterSpacing: "0.05em",
//                     textAlign: "left", padding: "14px 0",
//                     borderBottom: "1px solid rgba(250,248,244,0.07)",
//                     opacity: 0.85, transition: "color 0.2s",
//                   }}
//                     onMouseEnter={e => e.currentTarget.style.color = "#C4622D"}
//                     onMouseLeave={e => e.currentTarget.style.color = "#FAF8F4"}
//                   >
//                     {l.label}
//                   </button>
//                 ))}
//               </div>

//               {/* Divider + action icons */}
//               <div style={{ marginTop: "auto", paddingTop: 24, borderTop: "1px solid rgba(250,248,244,0.08)", display: "flex", gap: 16 }}>
//                 <IconBtn onClick={() => { setMobileOpen(false); navigate("wishlist"); }} label="Wishlist" badge={wishlistCount}>
//                   <FiHeart size={22} />
//                 </IconBtn>
//                 <IconBtn onClick={() => { setMobileOpen(false); navigate(user ? "profile" : "auth"); }} label="Profile">
//                   <FiUser size={22} />
//                 </IconBtn>
//                 <IconBtn onClick={() => { setMobileOpen(false); navigate("cart"); }} label="Cart" badge={cartCount}>
//                   <FiShoppingBag size={22} />
//                 </IconBtn>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Responsive style injected once */}
//       <style>{`
//         @media (max-width: 767px) {
//           .nav-hamburger { display: flex !important; }
//           .nav-desktop-links { display: none !important; }
//         }
//       `}</style>
//     </>
//   );
// }



export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
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

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const res = await authFetch("/auth/me");
        if (isMounted && res && res.user) {
          setUser(res.user);
          if (page === "auth") setPage("profile");
        }
      } finally {
        setAuthChecked(true);
      }
    };
    if (localStorage.getItem("eb_token")) {
      checkAuth();
    } else {
      setAuthChecked(true);
    }
    return () => { isMounted = false; };
    // eslint-disable-next-line
  }, [page]);

  const navigate = (pg, data) => {
    if (pg === "product" && data) setSelectedProduct(data);
    if (pg === "auth" && user) {
      setPage("profile");
    } else {
      setPage(pg);
    }
    window.scrollTo(0, 0);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.selectedSize === product.selectedSize);
      if (existing) return prev.map(i => i.id === product.id && i.selectedSize === product.selectedSize ? { ...i, qty: (i.qty || 1) + (product.qty || 1) } : i);
      return [...prev, { ...product, qty: product.qty || 1 }];
    });
  };

  const updateCart = (id, qty) => setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const toggleWishlist = (id) => setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const placeOrder = (address) => { setLastOrder(address); setCart([]); };
  const cartCount = cart.reduce((sum, i) => sum + (i.qty || 1), 0);

  const renderPage = () => {
    if (!authChecked) return (
      <div style={{ padding: 40, textAlign: "center", color: "#8C7B6B", paddingTop: "30vh" }}>
        Loading...
      </div>
    );
    switch (page) {
      case "home":        return <HomePage navigate={navigate} PRODUCTS={PRODUCTS} />;
      case "products":    return <ProductListing navigate={navigate} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />;
      case "product":     return selectedProduct ? <ProductDetail product={selectedProduct} navigate={navigate} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} /> : null;
      case "cart":        return <Cart cart={cart} updateCart={updateCart} removeFromCart={removeFromCart} navigate={navigate} />;
      case "checkout":    return <Checkout cart={cart} navigate={navigate} placeOrder={placeOrder} />;
      case "orderSuccess":return <OrderSuccess navigate={navigate} lastOrder={lastOrder} />;
      case "auth":        return <Auth navigate={navigate} login={(u) => { setUser(u); setPage("profile"); }} />;
      case "profile":     return <Profile user={user} navigate={navigate} logout={() => { setUser(null); setPage("home"); }} />;
      case "orders":      return <Orders navigate={navigate} />;
      case "wishlist":    return <Wishlist wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} navigate={navigate} allProducts={PRODUCTS} />;
      default:            return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div>
      {page !== "auth" && (
        <NavBar navigate={navigate} cartCount={cartCount} wishlistCount={wishlist.length} user={user} />
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
    </div>
  );
}