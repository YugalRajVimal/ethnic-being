// import { motion, AnimatePresence } from "framer-motion";
// import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag, FiTag } from "react-icons/fi";
// import { useState } from "react";

// export default function Cart({ cart, updateCart, removeFromCart, navigate }) {
//   const [coupon, setCoupon] = useState("");
//   const [couponApplied, setCouponApplied] = useState(false);
//   const [couponError, setCouponError] = useState(false);

//   const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
//   const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
//   const shipping = subtotal > 999 ? 0 : 99;
//   const total = subtotal - discount + shipping;

//   const applyCoupon = () => {
//     if (coupon.toUpperCase() === "ETHNIC10") { setCouponApplied(true); setCouponError(false); }
//     else { setCouponError(true); setCouponApplied(false); }
//   };

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

//   if (!cart.length) return (
//     <div style={s.page}>
//       <div style={{ ...s.inner, display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <div style={s.empty}>
//           <FiShoppingBag size={48} color="#D4C9BC" />
//           <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24, color: "#1A1612" }}>Your cart is empty</h2>
//           <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#8C7B6B" }}>Add some pieces to get started</p>
//           <motion.button whileHover={{ background: "#C4622D" }} style={{ background: "#1A1612", color: "#FAF8F4", border: "none", padding: "14px 32px", borderRadius: 6, fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer", fontFamily: "'DM Sans'", marginTop: 8, transition: "background 0.2s" }} onClick={() => navigate("products")}>
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
//         <p style={s.subtitle}>{cart.length} {cart.length === 1 ? "item" : "items"} in your cart</p>
//         <div style={s.layout}>
//           {/* Cart Items */}
//           <div style={s.cartList}>
//             <div style={s.cartHeader}>
//               <span style={s.cartHeaderText}>PRODUCT</span>
//               <span style={s.cartHeaderText}>TOTAL</span>
//             </div>
//             <AnimatePresence>
//               {cart.map((item) => (
//                 <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }} style={s.item}>
//                   <div style={s.imgBox}>
//                     <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                   </div>
//                   <div style={s.itemInfo}>
//                     <p style={s.itemName}>{item.name}</p>
//                     <p style={s.itemMeta}>Size: {item.selectedSize || "M"} · Color: {item.color || "Default"}</p>
//                     <div style={s.qtyRow}>
//                       <button style={s.qtyBtn} onClick={() => updateCart(item.id, Math.max(1, (item.qty||1) - 1))}>
//                         <FiMinus size={12} />
//                       </button>
//                       <span style={s.qtyNum}>{item.qty || 1}</span>
//                       <button style={s.qtyBtn} onClick={() => updateCart(item.id, (item.qty||1) + 1)}>
//                         <FiPlus size={12} />
//                       </button>
//                     </div>
//                   </div>
//                   <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
//                     <p style={s.itemPrice}>Rs. {(item.price * (item.qty||1)).toLocaleString()}</p>
//                     <button style={s.deleteBtn} onClick={() => removeFromCart(item.id)}>
//                       <FiTrash2 size={16} />
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>

//           {/* Summary */}
//           <div style={s.sidebar}>
//             {/* Coupon */}
//             <div style={{ ...s.summaryCard, marginBottom: 16 }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
//                 <FiTag size={14} color="#8C7B6B" />
//                 <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, color: "#1A1612" }}>Apply Coupon</span>
//               </div>
//               <div style={s.couponBox}>
//                 <input style={s.couponInput} placeholder="Enter code (try ETHNIC10)" value={coupon} onChange={e => setCoupon(e.target.value)} />
//                 <button style={s.couponBtn} onClick={applyCoupon}>APPLY</button>
//               </div>
//               <AnimatePresence>
//                 {couponApplied && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#2C6E49", marginTop: 8 }}>✓ 10% discount applied!</motion.p>}
//                 {couponError && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#C4622D", marginTop: 8 }}>✗ Invalid coupon code</motion.p>}
//               </AnimatePresence>
//             </div>

//             <div style={s.summaryCard}>
//               <p style={s.summaryTitle}>Order Summary</p>
//               <div style={s.summaryRow}><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
//               {couponApplied && <div style={{ ...s.summaryRow, color: "#2C6E49" }}><span>Discount (ETHNIC10)</span><span>−Rs. {discount.toLocaleString()}</span></div>}
//               <div style={s.summaryRow}><span>Shipping</span><span style={{ color: shipping === 0 ? "#2C6E49" : "#1A1612" }}>{shipping === 0 ? "FREE" : `Rs. ${shipping}`}</span></div>
//               {shipping > 0 && <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8C7B6B", marginBottom: 8 }}>Add Rs. {(999 - subtotal).toLocaleString()} more for free shipping</p>}
//               <div style={s.totalRow}><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
//               <motion.button style={s.checkoutBtn} whileHover={{ background: "#C4622D" }} onClick={() => navigate("checkout")}>
//                 PROCEED TO CHECKOUT <FiArrowRight size={14} />
//               </motion.button>
//               <button onClick={() => navigate("products")} style={{ width: "100%", background: "transparent", border: "none", color: "#8C7B6B", fontFamily: "'DM Sans'", fontSize: 12, cursor: "pointer", marginTop: 12, padding: "8px" }}>
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
import { useState } from "react";
import { couponAPI } from "./api";

export default function Cart({ cart, updateCart, removeFromCart, navigate }) {
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setApplyingCoupon(true);
    setCouponError("");
    setCouponApplied(false);
    setDiscount(0);
    try {
      const data = await couponAPI.validate(coupon.trim(), subtotal);
      // API is expected to return { discount, discountAmount, message }
      const discountAmount = data.discountAmount ?? data.discount ?? 0;
      setDiscount(discountAmount);
      setCouponApplied(true);
    } catch (err) {
      setCouponError(err.message || "Invalid coupon code");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setCouponApplied(false);
    setCouponError("");
    setDiscount(0);
  };

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
    totalRow: { display: "flex", justifyContent: "space-between", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#1A1612", paddingTop: 16, borderTop: "1.5px solid #E2D9CE", marginTop: 8 },
    checkoutBtn: { width: "100%", background: "#1A1612", color: "#FAF8F4", border: "none", padding: "16px", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", cursor: "pointer", borderRadius: 6, fontFamily: "'DM Sans'", marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background 0.2s" },
    couponBox: { display: "flex", gap: 8 },
    couponInput: { flex: 1, background: "#F5F0E8", border: "1px solid #E2D9CE", padding: "10px 14px", borderRadius: 6, fontSize: 12, fontFamily: "'DM Sans'", outline: "none", color: "#1A1612" },
    couponBtn: { background: "#1A1612", color: "#FAF8F4", border: "none", padding: "10px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", minWidth: 70 },
    empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 16 },
  };

  if (!cart.length) return (
    <div style={s.page}>
      <div style={{ ...s.inner, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={s.empty}>
          <FiShoppingBag size={48} color="#D4C9BC" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24, color: "#1A1612" }}>Your cart is empty</h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#8C7B6B" }}>Add some pieces to get started</p>
          <motion.button whileHover={{ background: "#C4622D" }} style={{ background: "#1A1612", color: "#FAF8F4", border: "none", padding: "14px 32px", borderRadius: 6, fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer", fontFamily: "'DM Sans'", marginTop: 8, transition: "background 0.2s" }} onClick={() => navigate("products")}>
            SHOP NOW
          </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <h1 style={s.title}>Shopping Cart</h1>
        <p style={s.subtitle}>{cart.length} {cart.length === 1 ? "item" : "items"} in your cart</p>
        <div style={s.layout}>
          {/* Cart Items */}
          <div style={s.cartList}>
            <div style={s.cartHeader}>
              <span style={s.cartHeaderText}>PRODUCT</span>
              <span style={s.cartHeaderText}>TOTAL</span>
            </div>
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }} style={s.item}>
                  <div style={s.imgBox}>
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={s.itemInfo}>
                    <p style={s.itemName}>{item.name}</p>
                    <p style={s.itemMeta}>Size: {item.selectedSize || "M"} · Color: {item.color || "Default"}</p>
                    <div style={s.qtyRow}>
                      <button style={s.qtyBtn} onClick={() => updateCart(item.id, Math.max(1, (item.qty||1) - 1))}>
                        <FiMinus size={12} />
                      </button>
                      <span style={s.qtyNum}>{item.qty || 1}</span>
                      <button style={s.qtyBtn} onClick={() => updateCart(item.id, (item.qty||1) + 1)}>
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                    <p style={s.itemPrice}>Rs. {(item.price * (item.qty||1)).toLocaleString()}</p>
                    <button style={s.deleteBtn} onClick={() => removeFromCart(item.id)}>
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div style={s.sidebar}>
            {/* Coupon */}
            <div style={{ ...s.summaryCard, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <FiTag size={14} color="#8C7B6B" />
                <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, color: "#1A1612" }}>Apply Coupon</span>
              </div>
              {couponApplied ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F0F7F2", borderRadius: 6, padding: "10px 14px" }}>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#2C6E49", fontWeight: 600 }}>✓ Coupon "{coupon}" applied!</span>
                  <button onClick={removeCoupon} style={{ background: "none", border: "none", color: "#8C7B6B", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: 12 }}>Remove</button>
                </div>
              ) : (
                <>
                  <div style={s.couponBox}>
                    <input style={s.couponInput} placeholder="Enter coupon code" value={coupon} onChange={e => setCoupon(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && applyCoupon()} />
                    <button style={s.couponBtn} onClick={applyCoupon} disabled={applyingCoupon}>
                      {applyingCoupon ? "..." : "APPLY"}
                    </button>
                  </div>
                  <AnimatePresence>
                    {couponError && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#C4622D", marginTop: 8 }}>
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
              {couponApplied && discount > 0 && (
                <div style={{ ...s.summaryRow, color: "#2C6E49" }}>
                  <span>Discount ({coupon.toUpperCase()})</span>
                  <span>−Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div style={s.summaryRow}><span>Shipping</span><span style={{ color: shipping === 0 ? "#2C6E49" : "#1A1612" }}>{shipping === 0 ? "FREE" : `Rs. ${shipping}`}</span></div>
              {shipping > 0 && <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8C7B6B", marginBottom: 8 }}>Add Rs. {(999 - subtotal).toLocaleString()} more for free shipping</p>}
              <div style={s.totalRow}><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
              <motion.button style={s.checkoutBtn} whileHover={{ background: "#C4622D" }} onClick={() => navigate("checkout")}>
                PROCEED TO CHECKOUT <FiArrowRight size={14} />
              </motion.button>
              <button onClick={() => navigate("products")} style={{ width: "100%", background: "transparent", border: "none", color: "#8C7B6B", fontFamily: "'DM Sans'", fontSize: 12, cursor: "pointer", marginTop: 12, padding: "8px" }}>
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}