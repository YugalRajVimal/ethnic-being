// import { motion, AnimatePresence } from "framer-motion";
// import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag, FiTag } from "react-icons/fi";
// import { useEffect, useState } from "react";
// import { cartAPI, couponAPI } from "./api";

// export default function Cart({ navigate, cart, updateCart }) {

//   const [loading, setLoading] = useState(true);

//   // Coupon states
//   const [coupon, setCoupon] = useState("");
//   const [couponApplied, setCouponApplied] = useState(false);
//   const [couponDiscount, setCouponDiscount] = useState(0);
//   const [couponError, setCouponError] = useState("");
//   const [couponLoading, setCouponLoading] = useState(false);
//   const [appliedCode, setAppliedCode] = useState("");

//   // Helper to always get array of cart items
//   const getCartItems = (cart) =>
//     Array.isArray(cart)
//       ? cart
//       : cart && Array.isArray(cart.items)
//       ? cart.items
//       : [];

//   // Fetch cart from API on mount
//   useEffect(() => {
//     async function fetchCart() {
//       setLoading(true);
//       try {
//         const response = await cartAPI.get?.() || await cartAPI.getCart(); // Try both if possible
//         updateCart(response.cart ?? []);
//       } catch (err) {
//         updateCart([]);
//       }
//       setLoading(false);
//     }
//     fetchCart();
//   }, []);

//   // For all UI/logic, always use cartItems array
//   const cartItems = getCartItems(cart);

//   // Subtotal etc.
//   const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
//   const discount = couponDiscount;
//   const shipping = subtotal > 999 ? 0 : 99;
//   const total = subtotal - discount + shipping;

//   /**
//    * Update quantity of a cart item.
//    * This version tries both update() and addToCart() methods,
//    * since backend APIs sometimes do not expose update quantity directly
//    * (sometimes you must call addToCart with different quantity).
//    * It also tries to properly identify items by size if relevant.
//    */
//   const updateCartItem = async (itemId, qty, itemObj) => {
//     try {
//       if (qty < 1) return;
//       // Most robust way: try addToCart with same item+size+new qty, fallback to update, fallback to full refetch
//       try {
//         // Prefer addToCart if provided and itemObj exists
//         if (cartAPI.addToCart && itemObj) {
//           await cartAPI.addToCart(itemObj, itemObj.selectedSize, qty);
//         } else if (cartAPI.update) {
//           await cartAPI.update(itemId, qty, itemObj?.selectedSize);
//         }
//       } catch (err) {
//         // Fallback: if all above fail, ignore
//       }
//       // Refetch cart after update
//       let response;
//       if (cartAPI.getCart) {
//         response = await cartAPI.getCart();
//       } else if (cartAPI.get) {
//         response = await cartAPI.get();
//       }
//       updateCart(response && response.cart ? response.cart : []);
//     } catch (error) {
//       // Optionally: show error
//     }
//   };

//   // New remove implementation using "remove" from cartAPI (per instructions)
//   const removeFromCart = async (itemId, itemObj) => {
//     try {
//       // Using the remove function from cartAPI, as described in api.js (152-160)
//       if (typeof cartAPI.remove === "function") {
//         await cartAPI.remove(itemId, itemObj?.selectedSize);
//       } else if (typeof cartAPI.removeFromCart === "function") {
//         // fallback for backward compatibility
//         await cartAPI.removeFromCart(itemId, itemObj?.selectedSize);
//       }
//       const response = cartAPI.getCart
//         ? await cartAPI.getCart()
//         : await cartAPI.get?.();
//         updateCart(response.cart ?? []);
//     } catch (error) {
//       // Optionally: toast error
//     }
//   };

//   // Coupon
//   const applyCoupon = async () => {
//     if (!coupon.trim()) return;
//     setCouponLoading(true);
//     setCouponError("");
//     setCouponApplied(false);
//     try {
//       const data = await couponAPI.validate(coupon, subtotal);
//       setCouponApplied(true);
//       setCouponDiscount(data.discount);
//       setAppliedCode(data.coupon.code);
//       setCouponError("");
//     } catch (e) {
//       setCouponError(e.message || "Invalid coupon code");
//       setCouponApplied(false);
//       setCouponDiscount(0);
//     }
//     setCouponLoading(false);
//   };

//   const removeCoupon = () => {
//     setCouponApplied(false);
//     setCouponDiscount(0);
//     setAppliedCode("");
//     setCoupon("");
//     setCouponError("");
//   };

//   // Add-to-cart (for cases like quantity 0 -> 1)
//   const addToCart = async (itemObj) => {
//     try {
//       await cartAPI.addToCart(itemObj, itemObj.selectedSize, itemObj.qty || 1);
//       const response = cartAPI.getCart
//         ? await cartAPI.getCart()
//         : await cartAPI.get?.();
//         updateCart(response.cart ?? []);
//     } catch (error) {
//       // Optionally: toast error
//     }
//   };

//   // UI styles as before
//   const s = {
//     page: { background: "#FAF8F4", minHeight: "100vh", paddingTop: 80 },
//     inner: { maxWidth: 1200, margin: "0 auto", padding: "40px 40px 80px" },
//     title: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(24px,3vw,36px)", color: "#1A1612", marginBottom: 8 },
//     subtitle: { fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B", marginBottom: 36 },
//     layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: 40, alignItems: "flex-start" },
//     cartList: { background: "#FFF", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(26,22,18,0.06)" },
//     cartHeader: { padding: "16px 24px", borderBottom: "1px solid #F0EBE3", display: "flex", justifyContent: "space-between", alignItems: "center" },
//     cartHeaderText: { fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em", color: "#8C7B6B" },
//     item: { display: "flex", gap: 20, padding: "20px 24px", borderBottom: "1px solid #F0EBE3", alignItems: "center" },
//     imgBox: { width: 90, height: 110, borderRadius: 8, overflow: "hidden", background: "#EEE8DE", flexShrink: 0 },
//     itemInfo: { flex: 1 },
//     itemName: { fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 16, color: "#1A1612", marginBottom: 6 },
//     itemMeta: { fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B", marginBottom: 12 },
//     qtyRow: { display: "flex", alignItems: "center", gap: 0, border: "1px solid #E2D9CE", borderRadius: 4, width: "fit-content" },
//     qtyBtn: { width: 32, height: 32, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#1A1612" },
//     qtyNum: { width: 36, textAlign: "center", fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 14, color: "#1A1612" },
//     itemPrice: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#C4622D", textAlign: "right" },
//     deleteBtn: { background: "none", border: "none", cursor: "pointer", padding: 8, color: "#B0A090" },
//     sidebar: { position: "sticky", top: 100 },
//     summaryCard: { background: "#FFF", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(26,22,18,0.06)", marginBottom: 16 },
//     summaryTitle: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#1A1612", marginBottom: 20 },
//     summaryRow: { display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans'", fontSize: 13, color: "#5A5048", marginBottom: 12 },
//     totalRow: { display: "flex", justifyContent: "space-between", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#1A1612", paddingTop: 16, borderTop: "1.5px solid #E2D9CE", marginTop: 8 },
//     checkoutBtn: { width: "100%", background: "#1A1612", color: "#FAF8F4", border: "none", padding: "16px", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", cursor: "pointer", borderRadius: 6, fontFamily: "'DM Sans'", marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background 0.2s" },
//     couponBox: { display: "flex", gap: 8 },
//     couponInput: { flex: 1, background: "#F5F0E8", border: "1px solid #E2D9CE", padding: "10px 14px", borderRadius: 6, fontSize: 12, fontFamily: "'DM Sans'", outline: "none", color: "#1A1612" },
//     couponBtn: { background: "#1A1612", color: "#FAF8F4", border: "none", padding: "10px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" },
//     empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 16 },
//   };

//   if (loading) return (
//     <div style={s.page}>
//       <div style={{ ...s.inner, display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <div style={s.empty}>
//           <FiShoppingBag size={48} color="#D4C9BC" />
//           <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24, color: "#1A1612" }}>Loading your cart...</h2>
//         </div>
//       </div>
//     </div>
//   );

//   if (!cartItems.length) return (
//     <div style={s.page}>
//       <div style={{ ...s.inner, display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <div style={s.empty}>
//           <FiShoppingBag size={48} color="#D4C9BC" />
//           <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24, color: "#1A1612" }}>Your cart is empty</h2>
//           <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#8C7B6B" }}>Add some pieces to get started</p>
//           <motion.button whileHover={{ background: "#C4622D" }}
//             style={{ background: "#1A1612", color: "#FAF8F4", border: "none", padding: "14px 32px", borderRadius: 6, fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer", fontFamily: "'DM Sans'", marginTop: 8, transition: "background 0.2s" }}
//             onClick={() => navigate("products")}>
//             SHOP NOW
//           </motion.button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div style={s.page}>
//       <div style={s.inner}>
//         <h1 style={s.title}>Shopping Cart</h1>
//         <p style={s.subtitle}>{cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart</p>
//         <div style={s.layout}>
//           {/* Cart Items */}
//           <div style={s.cartList}>
//             <div style={s.cartHeader}>
//               <span style={s.cartHeaderText}>PRODUCT</span>
//               <span style={s.cartHeaderText}>TOTAL</span>
//             </div>
//             <AnimatePresence>
//               {cartItems.map((item) => (
//                 <motion.div key={`${item.id || item._id}-${item.selectedSize || ""}`} layout
//                   initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }}
//                   style={s.item}>
//                   <div style={s.imgBox}>
//                     <img
//                       src={item.image || item.product?.image || item.product?.images?.[0] || item.images?.[0]}
//                       alt={item.name || item.product?.name || ""}
//                       style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                     />
//                   </div>
//                   <div style={s.itemInfo}>
//                     <p style={s.itemName}>{item.name || item.product?.name}</p>
//                     <p style={s.itemMeta}>
//                       {item.selectedSize ? `Size: ${item.selectedSize}` : ""}
//                       {item.color ? ` · ${item.color}` : ""}
//                     </p>
//                     <div style={s.qtyRow}>
//                       <button
//                         style={s.qtyBtn}
//                         onClick={() => updateCartItem(item.id || item._id, Math.max(1, (item.qty || 1) - 1), item)}
//                       >
//                         <FiMinus size={12} />
//                       </button>
//                       <span style={s.qtyNum}>{item.qty || 1}</span>
//                       <button
//                         style={s.qtyBtn}
//                         onClick={() => updateCartItem(item.id || item._id, (item.qty || 1) + 1, item)}
//                       >
//                         <FiPlus size={12} />
//                       </button>
//                     </div>
//                   </div>
//                   <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
//                     <p style={s.itemPrice}>
//                       Rs. {(item.price * (item.qty || 1)).toLocaleString()}
//                     </p>
//                     <button
//                       style={s.deleteBtn}
//                       onClick={() => removeFromCart(item.id || item._id, item)}
//                     >
//                       <FiTrash2 size={16} />
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>

//           {/* Summary Sidebar */}
//           <div style={s.sidebar}>
//             {/* Coupon */}
//             <div style={{ ...s.summaryCard, marginBottom: 16 }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
//                 <FiTag size={14} color="#8C7B6B" />
//                 <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, color: "#1A1612" }}>Apply Coupon</span>
//               </div>
//               {couponApplied ? (
//                 <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F0F7F2", borderRadius: 6, padding: "10px 14px" }}>
//                   <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#2C6E49", fontWeight: 600, flex: 1 }}>✓ {appliedCode} applied!</span>
//                   <button onClick={removeCoupon} style={{ background: "none", border: "none", color: "#C4622D", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: 12 }}>Remove</button>
//                 </div>
//               ) : (
//                 <>
//                   <div style={s.couponBox}>
//                     <input style={s.couponInput} placeholder="Enter coupon code" value={coupon}
//                       onChange={e => setCoupon(e.target.value)}
//                       onKeyDown={e => e.key === "Enter" && applyCoupon()} />
//                     <button style={s.couponBtn} onClick={applyCoupon} disabled={couponLoading}>
//                       {couponLoading ? "..." : "APPLY"}
//                     </button>
//                   </div>
//                   <AnimatePresence>
//                     {couponError && (
//                       <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                         style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#C4622D", marginTop: 8 }}>
//                         ✗ {couponError}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </>
//               )}
//             </div>

//             <div style={s.summaryCard}>
//               <p style={s.summaryTitle}>Order Summary</p>
//               <div style={s.summaryRow}><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
//               {couponApplied && (
//                 <div style={{ ...s.summaryRow, color: "#2C6E49" }}>
//                   <span>Coupon ({appliedCode})</span>
//                   <span>−Rs. {discount.toLocaleString()}</span>
//                 </div>
//               )}
//               <div style={s.summaryRow}>
//                 <span>Shipping</span>
//                 <span style={{ color: shipping === 0 ? "#2C6E49" : "#1A1612" }}>{shipping === 0 ? "FREE" : `Rs. ${shipping}`}</span>
//               </div>
//               {shipping > 0 && (
//                 <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8C7B6B", marginBottom: 8 }}>
//                   Add Rs. {(999 - subtotal + discount).toLocaleString()} more for free shipping
//                 </p>
//               )}
//               <div style={s.totalRow}><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
//               <motion.button style={s.checkoutBtn} whileHover={{ background: "#C4622D" }}
//                 onClick={() => navigate("checkout", { couponCode: appliedCode, discount })}>
//                 PROCEED TO CHECKOUT <FiArrowRight size={14} />
//               </motion.button>
//               <button onClick={() => navigate("products")}
//                 style={{ width: "100%", background: "transparent", border: "none", color: "#8C7B6B", fontFamily: "'DM Sans'", fontSize: 12, cursor: "pointer", marginTop: 12, padding: "8px" }}>
//                 ← Continue Shopping
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag, FiTag } from "react-icons/fi";
import { useEffect, useState } from "react";
import { cartAPI, couponAPI } from "./api";

// Cart receives:
//   cart         — flat items array from App state (already fetched)
//   updateCart   — = setCart in App, replaces entire cart state
//   onCartUpdate — = fetchCart in App, re-fetches from API
//   navigate     — page router
export default function Cart({ navigate, cart, updateCart, onCartUpdate }) {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // itemId being mutated

  // Coupon states
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCode, setAppliedCode] = useState("");

  // Normalize: backend returns cart.items as array of subdocuments
  // Each item: { _id, product, name, image, price, selectedSize, qty }
  const cartItems = Array.isArray(cart) ? cart : (cart?.items ?? []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const discount = couponDiscount;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  // ─── FETCH CART ON MOUNT ─────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await cartAPI.get();
        if (isMounted) {
          // Normalize to flat items array and push up to App
          const items = res?.cart?.items ?? res?.cart ?? [];
          updateCart(Array.isArray(items) ? items : []);
        }
      } catch {
        if (isMounted) updateCart([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  // eslint-disable-next-line
  }, []);

  // ─── UPDATE QUANTITY ─────────────────────────────────────────────────────
  const handleUpdateQty = async (item, newQty) => {
    if (newQty < 1) return;
    const itemId = String(item._id || item.id);
    setActionLoading(itemId);
    try {
      await cartAPI.update(itemId, newQty);
      // Refetch to get authoritative state from server
      if (typeof onCartUpdate === "function") await onCartUpdate();
    } catch {
      // Optimistic rollback not needed — onCartUpdate will restore server state
    } finally {
      setActionLoading(null);
    }
  };

  // ─── REMOVE ITEM ─────────────────────────────────────────────────────────
  const handleRemove = async (item) => {
    const itemId = String(item._id || item.id);
    setActionLoading(itemId);
    try {
      await cartAPI.remove(itemId);
      if (typeof onCartUpdate === "function") await onCartUpdate();
    } catch {
      // silent — item stays visible, user can retry
    } finally {
      setActionLoading(null);
    }
  };

  // ─── COUPON ──────────────────────────────────────────────────────────────
  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const data = await couponAPI.validate(coupon, subtotal);
      setCouponApplied(true);
      setCouponDiscount(data.discount);
      setAppliedCode(data.coupon?.code || coupon);
    } catch (e) {
      setCouponError(e.message || "Invalid coupon code");
      setCouponApplied(false);
      setCouponDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
    setAppliedCode("");
    setCoupon("");
    setCouponError("");
  };

  // ─── STYLES ──────────────────────────────────────────────────────────────
  const s = {
    page: { background: "#FAF8F4", minHeight: "100vh", paddingTop: 80 },
    inner: { maxWidth: 1200, margin: "0 auto", padding: "40px 40px 80px" },
    title: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(24px,3vw,36px)", color: "#1A1612", marginBottom: 8 },
    subtitle: { fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B", marginBottom: 36 },
    layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: 40, alignItems: "flex-start" },
    cartList: { background: "#FFF", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(26,22,18,0.06)" },
    cartHeader: { padding: "16px 24px", borderBottom: "1px solid #F0EBE3", display: "flex", justifyContent: "space-between", alignItems: "center" },
    cartHeaderText: { fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em", color: "#8C7B6B" },
    item: { display: "flex", gap: 20, padding: "20px 24px", borderBottom: "1px solid #F0EBE3", alignItems: "center" },
    imgBox: { width: 90, height: 110, borderRadius: 8, overflow: "hidden", background: "#EEE8DE", flexShrink: 0 },
    itemInfo: { flex: 1 },
    itemName: { fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 16, color: "#1A1612", marginBottom: 6 },
    itemMeta: { fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B", marginBottom: 12 },
    qtyRow: { display: "flex", alignItems: "center", gap: 0, border: "1px solid #E2D9CE", borderRadius: 4, width: "fit-content" },
    qtyBtn: { width: 32, height: 32, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#1A1612" },
    qtyNum: { width: 36, textAlign: "center", fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 14, color: "#1A1612" },
    itemPrice: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#C4622D", textAlign: "right" },
    deleteBtn: { background: "none", border: "none", cursor: "pointer", padding: 8, color: "#B0A090" },
    sidebar: { position: "sticky", top: 100 },
    summaryCard: { background: "#FFF", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(26,22,18,0.06)", marginBottom: 16 },
    summaryTitle: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#1A1612", marginBottom: 20 },
    summaryRow: { display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans'", fontSize: 13, color: "#5A5048", marginBottom: 12 },
    totalRow: { display: "flex", justifyContent: "space-between", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#1A1612", paddingTop: 12, borderTop: "1.5px solid #E2D9CE", marginTop: 8 },
    checkoutBtn: { width: "100%", background: "#1A1612", color: "#FAF8F4", border: "none", padding: "16px", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", cursor: "pointer", borderRadius: 6, fontFamily: "'DM Sans'", marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background 0.2s" },
    couponBox: { display: "flex", gap: 8 },
    couponInput: { flex: 1, background: "#F5F0E8", border: "1px solid #E2D9CE", padding: "10px 14px", borderRadius: 6, fontSize: 12, fontFamily: "'DM Sans'", outline: "none", color: "#1A1612" },
    couponBtn: { background: "#1A1612", color: "#FAF8F4", border: "none", padding: "10px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" },
    empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 16 },
  };

  // ─── LOADING STATE ───────────────────────────────────────────────────────
  if (loading) return (
    <div style={s.page}>
      <div style={{ ...s.inner, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={s.empty}>
          <FiShoppingBag size={48} color="#D4C9BC" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24, color: "#1A1612" }}>
            Loading your cart...
          </h2>
        </div>
      </div>
    </div>
  );

  // ─── EMPTY STATE ─────────────────────────────────────────────────────────
  if (!cartItems.length) return (
    <div style={s.page}>
      <div style={{ ...s.inner, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={s.empty}>
          <FiShoppingBag size={48} color="#D4C9BC" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24, color: "#1A1612" }}>
            Your cart is empty
          </h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#8C7B6B" }}>
            Add some pieces to get started
          </p>
          <motion.button
            whileHover={{ background: "#C4622D" }}
            style={{ background: "#1A1612", color: "#FAF8F4", border: "none", padding: "14px 32px", borderRadius: 6, fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer", fontFamily: "'DM Sans'", marginTop: 8, transition: "background 0.2s" }}
            onClick={() => navigate("products")}
          >
            SHOP NOW
          </motion.button>
        </div>
      </div>
    </div>
  );

  // ─── MAIN RENDER ─────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.inner}>
        <h1 style={s.title}>Shopping Cart</h1>
        <p style={s.subtitle}>{cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart</p>

        <div style={s.layout}>
          {/* Cart Items */}
          <div style={s.cartList}>
            <div style={s.cartHeader}>
              <span style={s.cartHeaderText}>PRODUCT</span>
              <span style={s.cartHeaderText}>TOTAL</span>
            </div>
            <AnimatePresence>
              {cartItems.map((item) => {
                const itemId = String(item._id || item.id);
                const isBusy = actionLoading === itemId;
                return (
                  <motion.div
                    key={`${itemId}-${item.selectedSize || ""}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isBusy ? 0.5 : 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={s.item}
                  >
                    <div style={s.imgBox}>
                      <img
                        src={item.image || item.product?.images?.[0] || item.images?.[0]}
                        alt={item.name || item.product?.name || ""}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>

                    <div style={s.itemInfo}>
                      <p style={s.itemName}>{item.name || item.product?.name}</p>
                      <p style={s.itemMeta}>
                        {item.selectedSize ? `Size: ${item.selectedSize}` : ""}
                        {item.color ? ` · ${item.color}` : ""}
                      </p>
                      <div style={s.qtyRow}>
                        <button
                          style={{ ...s.qtyBtn, opacity: isBusy ? 0.4 : 1, cursor: isBusy ? "not-allowed" : "pointer" }}
                          disabled={isBusy}
                          onClick={() => handleUpdateQty(item, (item.qty || 1) - 1)}
                        >
                          <FiMinus size={12} />
                        </button>
                        <span style={s.qtyNum}>{item.qty || 1}</span>
                        <button
                          style={{ ...s.qtyBtn, opacity: isBusy ? 0.4 : 1, cursor: isBusy ? "not-allowed" : "pointer" }}
                          disabled={isBusy}
                          onClick={() => handleUpdateQty(item, (item.qty || 1) + 1)}
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                      <p style={s.itemPrice}>
                        Rs. {(item.price * (item.qty || 1)).toLocaleString()}
                      </p>
                      <button
                        style={{ ...s.deleteBtn, cursor: isBusy ? "not-allowed" : "pointer" }}
                        disabled={isBusy}
                        onClick={() => handleRemove(item)}
                        title="Remove item"
                      >
                        {isBusy ? (
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(176,160,144,0.3)", borderTopColor: "#B0A090", borderRadius: "50%" }}
                          />
                        ) : (
                          <FiTrash2 size={16} />
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary Sidebar */}
          <div style={s.sidebar}>
            {/* Coupon */}
            <div style={{ ...s.summaryCard, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <FiTag size={14} color="#8C7B6B" />
                <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, color: "#1A1612" }}>Apply Coupon</span>
              </div>
              {couponApplied ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F0F7F2", borderRadius: 6, padding: "10px 14px" }}>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#2C6E49", fontWeight: 600, flex: 1 }}>
                    ✓ {appliedCode} applied!
                  </span>
                  <button onClick={removeCoupon} style={{ background: "none", border: "none", color: "#C4622D", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: 12 }}>
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div style={s.couponBox}>
                    <input
                      style={s.couponInput}
                      placeholder="Enter coupon code"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && applyCoupon()}
                    />
                    <button style={s.couponBtn} onClick={applyCoupon} disabled={couponLoading}>
                      {couponLoading ? "..." : "APPLY"}
                    </button>
                  </div>
                  <AnimatePresence>
                    {couponError && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#C4622D", marginTop: 8 }}>
                        ✗ {couponError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            <div style={s.summaryCard}>
              <p style={s.summaryTitle}>Order Summary</p>
              <div style={s.summaryRow}><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
              {couponApplied && (
                <div style={{ ...s.summaryRow, color: "#2C6E49" }}>
                  <span>Coupon ({appliedCode})</span>
                  <span>−Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div style={s.summaryRow}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? "#2C6E49" : "#1A1612" }}>
                  {shipping === 0 ? "FREE" : `Rs. ${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8C7B6B", marginBottom: 8 }}>
                  Add Rs. {Math.max(0, 999 - subtotal + discount).toLocaleString()} more for free shipping
                </p>
              )}
              <div style={s.totalRow}>
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
              <motion.button
                style={s.checkoutBtn}
                whileHover={{ background: "#C4622D" }}
                // Pass coupon meta to Checkout via navigate
                onClick={() => navigate("checkout", { couponCode: appliedCode, discount })}
              >
                PROCEED TO CHECKOUT <FiArrowRight size={14} />
              </motion.button>
              <button
                onClick={() => navigate("products")}
                style={{ width: "100%", background: "transparent", border: "none", color: "#8C7B6B", fontFamily: "'DM Sans'", fontSize: 12, cursor: "pointer", marginTop: 12, padding: "8px" }}
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}