
// // import { useState } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { FiCheck, FiLock, FiCreditCard, FiSmartphone, FiTrash2 } from "react-icons/fi";
// // import { orderAPI, paymentAPI, cartAPI } from "./api";

// // const STEPS = ["Address", "Review", "Payment"];

// // // ✅ Moved OUTSIDE Checkout — defined once, never recreated on re-render
// // const InputField = ({ name, label, placeholder, type = "text", form, errors, onChange }) => (
// //   <div style={{ marginBottom: 16 }}>
// //     <label style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: 6, display: "block" }}>
// //       {label}
// //     </label>
// //     <input
// //       style={{
// //         width: "100%", background: "#F5F0E8",
// //         border: `1.5px solid ${errors[name] ? "#C4622D" : "#E2D9CE"}`,
// //         padding: "11px 14px", borderRadius: 6, fontSize: 13,
// //         fontFamily: "'DM Sans'", outline: "none", color: "#1A1612",
// //         boxSizing: "border-box", transition: "border 0.2s",
// //       }}
// //       type={type}
// //       placeholder={placeholder}
// //       value={form[name]}
// //       onChange={e => onChange(name, e.target.value)}
// //     />
// //     {errors[name] && (
// //       <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#C4622D", marginTop: 4 }}>
// //         {errors[name]}
// //       </p>
// //     )}
// //   </div>
// // );

// // export default function Checkout({ cart, navigate, placeOrder, checkoutMeta, onCartUpdate }) {
// //   const [step, setStep] = useState(0);
// //   const [form, setForm] = useState({
// //     firstName: "",
// //     lastName: "",
// //     email: "",
// //     phone: "",
// //     address: "",
// //     apartment: "",
// //     city: "",
// //     state: "",
// //     pincode: "",
// //   });
// //   const [payMethod, setPayMethod] = useState("cod");
// //   const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvv: "", name: "" });
// //   const [errors, setErrors] = useState({});
// //   const [placing, setPlacing] = useState(false);
// //   const [apiError, setApiError] = useState("");
// //   const [removing, setRemoving] = useState(null); // holds id of item being removed

// //   // Defensive: fallback to [] if cart is not array (shouldn't happen)
// //   const safeCart = Array.isArray(cart) ? cart : [];

// //   const subtotal = safeCart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
// //   const shipping = subtotal > 999 ? 0 : 99;
// //   const discount = checkoutMeta?.discount || 0;
// //   const total = subtotal + shipping - discount;

// //   const states = [
// //     "Delhi",
// //     "Maharashtra",
// //     "Karnataka",
// //     "Tamil Nadu",
// //     "West Bengal",
// //     "Gujarat",
// //     "Rajasthan",
// //     "Uttar Pradesh",
// //     "Telangana",
// //     "Kerala",
// //   ];

// //   const handleFieldChange = (name, value) => setForm(f => ({ ...f, [name]: value }));

// //   const validate = () => {
// //     const e = {};
// //     if (!form.firstName) e.firstName = "Required";
// //     if (!form.lastName) e.lastName = "Required";
// //     if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
// //     if (!form.phone || form.phone.length < 10) e.phone = "Valid phone required";
// //     if (!form.address) e.address = "Required";
// //     if (!form.city) e.city = "Required";
// //     if (!form.state) e.state = "Required";
// //     if (!form.pincode || form.pincode.length < 6) e.pincode = "Valid pincode required";
// //     setErrors(e);
// //     return Object.keys(e).length === 0;
// //   };

// //   // Implement remove api (ethnic-being/src/Pages/api.js line 153+)
// //   // and delete the item visually only if success
// //   const handleRemoveItem = async (item) => {
// //     setRemoving(item._id || item.id);
// //     setApiError("");
// //     try {
// //       await cartAPI.remove(item._id || item.id);
// //       if (typeof onCartUpdate === "function") {
// //         await onCartUpdate();
// //       }
// //       // Otherwise rely on parent to update cart prop.
// //     } catch (e) {
// //       setApiError(e.message || "Failed to remove item. Please try again.");
// //     } finally {
// //       setRemoving(null);
// //     }
// //   };

// //   // 🟢 FIX: send cart with order creation to backend!
// //   const handlePlaceOrder = async () => {
// //     setPlacing(true);
// //     setApiError("");
// //     try {
// //       const shippingAddress = {
// //         name: `${form.firstName} ${form.lastName}`,
// //         phone: form.phone,
// //         address: `${form.address}${form.apartment ? `, ${form.apartment}` : ""}`,
// //         city: form.city,
// //         state: form.state,
// //         pincode: form.pincode,
// //       };

// //       // Fix: send cart to backend
// //       const orderPayload = {
// //         shippingAddress,
// //         paymentMethod: payMethod === "cod" ? "cod" : "razorpay",
// //         couponCode: checkoutMeta?.couponCode || "",
// //         cart: safeCart.map(item => ({
// //           id: item.id,
// //           qty: item.qty || 1,
// //           selectedSize: item.selectedSize,
// //           price: item.price,
// //         })),
// //       };

// //       const data = await orderAPI.place(orderPayload);
// //       const order = data.order;

// //       if (payMethod === "cod") {
// //         placeOrder(order);
// //         navigate("orderSuccess");
// //       } else {
// //         const payData = await paymentAPI.createOrder(order._id);

// //         const options = {
// //           key: payData.key_id,
// //           amount: payData.amount,
// //           currency: payData.currency,
// //           name: "EthnicBeing",
// //           description: "Order Payment",
// //           order_id: payData.razorpay_order_id,
// //           handler: async response => {
// //             try {
// //               await paymentAPI.verify({
// //                 razorpay_order_id: response.razorpay_order_id,
// //                 razorpay_payment_id: response.razorpay_payment_id,
// //                 razorpay_signature: response.razorpay_signature,
// //                 orderId: order._id,
// //               });
// //               placeOrder(order);
// //               navigate("orderSuccess");
// //             } catch (e) {
// //               setApiError("Payment verification failed. Contact support.");
// //               setPlacing(false);
// //             }
// //           },
// //           prefill: { name: shippingAddress.name, email: form.email, contact: form.phone },
// //           theme: { color: "#C4622D" },
// //           modal: { ondismiss: () => setPlacing(false) },
// //         };

// //         if (window.Razorpay) {
// //           const rzp = new window.Razorpay(options);
// //           rzp.open();
// //         } else {
// //           console.warn("Razorpay not loaded. Simulating success for development.");
// //           placeOrder(order);
// //           navigate("orderSuccess");
// //         }
// //       }
// //     } catch (e) {
// //       setApiError(e.message || "Failed to place order. Please try again.");
// //       setPlacing(false);
// //     }
// //   };

// //   const s = {
// //     page: { background: "#FAF8F4", minHeight: "100vh", paddingTop: 80 },
// //     inner: { maxWidth: 1100, margin: "0 auto", padding: "40px 40px 80px" },
// //     layout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 40 },
// //     stepsRow: { display: "flex", alignItems: "center", gap: 0, marginBottom: 36 },
// //     stepDot: (active, done) => ({
// //       width: 32,
// //       height: 32,
// //       borderRadius: "50%",
// //       background: done ? "#2C6E49" : active ? "#1A1612" : "#E2D9CE",
// //       color: done || active ? "#FAF8F4" : "#8C7B6B",
// //       display: "flex",
// //       alignItems: "center",
// //       justifyContent: "center",
// //       fontSize: 13,
// //       fontWeight: 700,
// //       fontFamily: "'DM Sans'",
// //       flexShrink: 0,
// //     }),
// //     stepLabel: active => ({
// //       fontFamily: "'DM Sans'",
// //       fontSize: 12,
// //       fontWeight: active ? 600 : 400,
// //       color: active ? "#1A1612" : "#8C7B6B",
// //       marginLeft: 8,
// //     }),
// //     stepLine: done => ({
// //       flex: 1,
// //       height: 2,
// //       background: done ? "#2C6E49" : "#E2D9CE",
// //       margin: "0 12px",
// //     }),
// //     card: {
// //       background: "#FFF",
// //       borderRadius: 12,
// //       padding: 28,
// //       boxShadow: "0 2px 12px rgba(26,22,18,0.06)",
// //       marginBottom: 20,
// //     },
// //     label: {
// //       fontFamily: "'DM Sans'",
// //       fontWeight: 600,
// //       fontSize: 11,
// //       letterSpacing: "0.1em",
// //       color: "#8C7B6B",
// //       marginBottom: 6,
// //       display: "block",
// //     },
// //     input: err => ({
// //       width: "100%",
// //       background: "#F5F0E8",
// //       border: `1.5px solid ${err ? "#C4622D" : "#E2D9CE"}`,
// //       padding: "11px 14px",
// //       borderRadius: 6,
// //       fontSize: 13,
// //       fontFamily: "'DM Sans'",
// //       outline: "none",
// //       color: "#1A1612",
// //       boxSizing: "border-box",
// //       transition: "border 0.2s",
// //     }),
// //     error: { fontFamily: "'DM Sans'", fontSize: 11, color: "#C4622D", marginTop: 4 },
// //     grid2: {
// //       display: "grid",
// //       gridTemplateColumns: "1fr 1fr",
// //       gap: 16,
// //       marginBottom: 16,
// //     },
// //     nextBtn: {
// //       width: "100%",
// //       background: "#1A1612",
// //       color: "#FAF8F4",
// //       border: "none",
// //       padding: "15px",
// //       fontSize: 13,
// //       fontWeight: 600,
// //       letterSpacing: "0.12em",
// //       cursor: "pointer",
// //       borderRadius: 6,
// //       fontFamily: "'DM Sans'",
// //       marginTop: 20,
// //       transition: "background 0.2s",
// //     },
// //     sectionTitle: {
// //       fontFamily: "'Playfair Display', serif",
// //       fontWeight: 700,
// //       fontSize: 20,
// //       color: "#1A1612",
// //       marginBottom: 20,
// //     },
// //     payOption: active => ({
// //       border: `2px solid ${active ? "#1A1612" : "#E2D9CE"}`,
// //       borderRadius: 8,
// //       padding: "14px 18px",
// //       cursor: "pointer",
// //       display: "flex",
// //       alignItems: "center",
// //       gap: 12,
// //       marginBottom: 12,
// //       background: active ? "#1A1612" : "#FFF",
// //       transition: "all 0.2s",
// //     }),
// //     payLabel: active => ({
// //       fontFamily: "'DM Sans'",
// //       fontWeight: 600,
// //       fontSize: 13,
// //       color: active ? "#FAF8F4" : "#1A1612",
// //     }),
// //     payDesc: active => ({
// //       fontFamily: "'DM Sans'",
// //       fontSize: 11,
// //       color: active ? "rgba(250,248,244,0.6)" : "#8C7B6B",
// //     }),
// //     miniSummary: {
// //       background: "#FFF",
// //       borderRadius: 12,
// //       padding: 24,
// //       boxShadow: "0 2px 12px rgba(26,22,18,0.06)",
// //       position: "sticky",
// //       top: 100,
// //     },
// //     summaryTitle: {
// //       fontFamily: "'Playfair Display', serif",
// //       fontWeight: 700,
// //       fontSize: 16,
// //       color: "#1A1612",
// //       marginBottom: 16,
// //     },
// //     summaryItem: {
// //       display: "flex",
// //       justifyContent: "space-between",
// //       fontFamily: "'DM Sans'",
// //       fontSize: 12,
// //       color: "#5A5048",
// //       marginBottom: 10,
// //     },
// //     summaryTotal: {
// //       display: "flex",
// //       justifyContent: "space-between",
// //       fontFamily: "'Playfair Display', serif",
// //       fontWeight: 700,
// //       fontSize: 16,
// //       color: "#1A1612",
// //       paddingTop: 12,
// //       borderTop: "1.5px solid #E2D9CE",
// //       marginTop: 8,
// //     },
// //     deleteBtn: {
// //       background: "none",
// //       border: "none",
// //       cursor: "pointer",
// //       color: "#C4622D",
// //       display: "flex",
// //       alignItems: "center",
// //       justifyContent: "center",
// //       padding: 0,
// //       marginLeft: 8,
// //       width: 28,
// //       height: 28,
// //       borderRadius: "50%",
// //       transition: "background 0.15s",
// //     }
// //   };

// //   return (
// //     <div style={s.page}>
// //       <div style={s.inner}>
// //         <h1
// //           style={{
// //             fontFamily: "'Playfair Display', serif",
// //             fontWeight: 700,
// //             fontSize: "clamp(24px,3vw,36px)",
// //             color: "#1A1612",
// //             marginBottom: 32,
// //           }}
// //         >
// //           Checkout
// //         </h1>

// //         {/* Steps */}
// //         <div style={s.stepsRow}>
// //           {STEPS.map((stepName, i) => (
// //             <span
// //               key={stepName}
// //               style={{
// //                 display: "flex",
// //                 alignItems: "center",
// //                 flex: i < STEPS.length - 1 ? 1 : 0,
// //               }}
// //             >
// //               <span style={{ display: "flex", alignItems: "center" }}>
// //                 <span style={s.stepDot(step === i, step > i)}>
// //                   {step > i ? <FiCheck size={14} /> : i + 1}
// //                 </span>
// //                 <span style={s.stepLabel(step === i)}>{stepName}</span>
// //               </span>
// //               {i < STEPS.length - 1 && (
// //                 <span style={{ ...s.stepLine(step > i), flex: 1 }} />
// //               )}
// //             </span>
// //           ))}
// //         </div>

// //         {apiError && (
// //           <div
// //             style={{
// //               background: "#FFF0F0",
// //               border: "1px solid #FCC",
// //               borderRadius: 8,
// //               padding: "12px 16px",
// //               marginBottom: 20,
// //               fontFamily: "'DM Sans'",
// //               fontSize: 13,
// //               color: "#C4622D",
// //             }}
// //           >
// //             {apiError}
// //           </div>
// //         )}

// //         <div style={s.layout}>
// //           <div>
// //             <AnimatePresence mode="wait">
// //               {/* STEP 0: Address */}
// //               {step === 0 && (
// //                 <motion.div
// //                   key="address"
// //                   initial={{ opacity: 0, x: 20 }}
// //                   animate={{ opacity: 1, x: 0 }}
// //                   exit={{ opacity: 0, x: -20 }}
// //                 >
// //                   <div style={s.card}>
// //                     <p style={s.sectionTitle}>Delivery Address</p>
// //                     <div style={s.grid2}>
// //                       <InputField
// //                         name="firstName"
// //                         label="FIRST NAME"
// //                         placeholder="Arjun"
// //                         form={form}
// //                         errors={errors}
// //                         onChange={handleFieldChange}
// //                       />
// //                       <InputField
// //                         name="lastName"
// //                         label="LAST NAME"
// //                         placeholder="Sharma"
// //                         form={form}
// //                         errors={errors}
// //                         onChange={handleFieldChange}
// //                       />
// //                     </div>
// //                     <div style={s.grid2}>
// //                       <InputField
// //                         name="email"
// //                         label="EMAIL"
// //                         placeholder="arjun@email.com"
// //                         type="email"
// //                         form={form}
// //                         errors={errors}
// //                         onChange={handleFieldChange}
// //                       />
// //                       <InputField
// //                         name="phone"
// //                         label="PHONE"
// //                         placeholder="9876543210"
// //                         form={form}
// //                         errors={errors}
// //                         onChange={handleFieldChange}
// //                       />
// //                     </div>
// //                     <InputField
// //                       name="address"
// //                       label="ADDRESS"
// //                       placeholder="House / Street / Area"
// //                       form={form}
// //                       errors={errors}
// //                       onChange={handleFieldChange}
// //                     />
// //                     <InputField
// //                       name="apartment"
// //                       label="APARTMENT / FLAT (optional)"
// //                       placeholder="Flat 4B, Tower 2"
// //                       form={form}
// //                       errors={errors}
// //                       onChange={handleFieldChange}
// //                     />
// //                     <div style={s.grid2}>
// //                       <InputField
// //                         name="city"
// //                         label="CITY"
// //                         placeholder="Mumbai"
// //                         form={form}
// //                         errors={errors}
// //                         onChange={handleFieldChange}
// //                       />
// //                       <div>
// //                         <label style={s.label}>STATE</label>
// //                         <select
// //                           style={s.input(errors.state)}
// //                           value={form.state}
// //                           onChange={e =>
// //                             setForm(f => ({
// //                               ...f,
// //                               state: e.target.value,
// //                             }))
// //                           }
// //                         >
// //                           <option value="">Select state</option>
// //                           {states.map(st => (
// //                             <option key={st} value={st}>
// //                               {st}
// //                             </option>
// //                           ))}
// //                         </select>
// //                         {errors.state && <p style={s.error}>{errors.state}</p>}
// //                       </div>
// //                     </div>
// //                     <InputField
// //                       name="pincode"
// //                       label="PINCODE"
// //                       placeholder="400001"
// //                       form={form}
// //                       errors={errors}
// //                       onChange={handleFieldChange}
// //                     />
// //                     <motion.button
// //                       style={s.nextBtn}
// //                       whileHover={{ background: "#C4622D" }}
// //                       onClick={() => {
// //                         if (validate()) setStep(1);
// //                       }}
// //                     >
// //                       CONTINUE TO REVIEW
// //                     </motion.button>
// //                   </div>
// //                 </motion.div>
// //               )}

// //               {/* STEP 1: Review */}
// //               {step === 1 && (
// //                 <motion.div
// //                   key="review"
// //                   initial={{ opacity: 0, x: 20 }}
// //                   animate={{ opacity: 1, x: 0 }}
// //                   exit={{ opacity: 0, x: -20 }}
// //                 >
// //                   <div style={s.card}>
// //                     <p style={s.sectionTitle}>Review Your Order</p>
// //                     {safeCart.length === 0 && (
// //                       <div
// //                         style={{
// //                           fontFamily: "'DM Sans'",
// //                           fontSize: 14,
// //                           color: "#C4622D",
// //                           marginBottom: 12,
// //                         }}
// //                       >
// //                         Your cart is empty.
// //                       </div>
// //                     )}
// //                     {safeCart.map(item => (
// //                       <div
// //                         key={`${item.id || item._id}-${item.selectedSize}`}
// //                         style={{
// //                           display: "flex",
// //                           gap: 16,
// //                           padding: "14px 0",
// //                           borderBottom: "1px solid #F0EBE3",
// //                           alignItems: "center",
// //                         }}
// //                       >
// //                         <div
// //                           style={{
// //                             width: 64,
// //                             height: 80,
// //                             borderRadius: 6,
// //                             overflow: "hidden",
// //                             background: "#EEE8DE",
// //                             flexShrink: 0,
// //                           }}
// //                         >
// //                           <img
// //                             src={item.image || item.images?.[0]}
// //                             alt={item.name}
// //                             style={{
// //                               width: "100%",
// //                               height: "100%",
// //                               objectFit: "cover",
// //                             }}
// //                           />
// //                         </div>
// //                         <div style={{ flex: 1 }}>
// //                           <p
// //                             style={{
// //                               fontFamily: "'DM Sans'",
// //                               fontWeight: 600,
// //                               fontSize: 14,
// //                               color: "#1A1612",
// //                             }}
// //                           >
// //                             {item.name}
// //                           </p>
// //                           <p
// //                             style={{
// //                               fontFamily: "'DM Sans'",
// //                               fontSize: 12,
// //                               color: "#8C7B6B",
// //                               marginTop: 4,
// //                             }}
// //                           >
// //                             {item.selectedSize
// //                               ? `Size: ${item.selectedSize} · `
// //                               : ""}
// //                             Qty: {item.qty || 1}
// //                           </p>
// //                         </div>
// //                         <p
// //                           style={{
// //                             fontFamily: "'Playfair Display', serif",
// //                             fontWeight: 700,
// //                             fontSize: 15,
// //                             color: "#C4622D",
// //                           }}
// //                         >
// //                           Rs. {(item.price * (item.qty || 1)).toLocaleString()}
// //                         </p>
// //                         <button
// //                           style={{
// //                             ...s.deleteBtn,
// //                             background: removing === (item._id || item.id)
// //                               ? "#F5F0E8"
// //                               : "none",
// //                             pointerEvents: removing ? "none" : "auto",
// //                           }}
// //                           title="Remove from cart"
// //                           onClick={() => handleRemoveItem(item)}
// //                           disabled={removing}
// //                         >
// //                           {removing === (item._id || item.id) ? (
// //                             <span style={{ fontSize: 12, color: "#C4622D" }}>...</span>
// //                           ) : (
// //                             <FiTrash2 size={18} />
// //                           )}
// //                         </button>
// //                       </div>
// //                     ))}
// //                     <div
// //                       style={{
// //                         marginTop: 20,
// //                         background: "#F5F0E8",
// //                         borderRadius: 8,
// //                         padding: 16,
// //                       }}
// //                     >
// //                       <p
// //                         style={{
// //                           fontFamily: "'DM Sans'",
// //                           fontWeight: 600,
// //                           fontSize: 12,
// //                           color: "#1A1612",
// //                           marginBottom: 8,
// //                           letterSpacing: "0.08em",
// //                         }}
// //                       >
// //                         DELIVERY TO
// //                       </p>
// //                       <p
// //                         style={{
// //                           fontFamily: "'DM Sans'",
// //                           fontSize: 13,
// //                           color: "#5A5048",
// //                           lineHeight: 1.6,
// //                         }}
// //                       >
// //                         {form.firstName} {form.lastName}
// //                         <br />
// //                         {form.address}
// //                         {form.apartment ? `, ${form.apartment}` : ""}
// //                         <br />
// //                         {form.city}, {form.state} - {form.pincode}
// //                         <br />
// //                         {form.phone}
// //                       </p>
// //                       <button
// //                         onClick={() => setStep(0)}
// //                         style={{
// //                           background: "none",
// //                           border: "none",
// //                           color: "#C4622D",
// //                           fontFamily: "'DM Sans'",
// //                           fontSize: 12,
// //                           cursor: "pointer",
// //                           marginTop: 8,
// //                           fontWeight: 600,
// //                         }}
// //                       >
// //                         Edit Address
// //                       </button>
// //                     </div>
// //                     <motion.button
// //                       style={s.nextBtn}
// //                       whileHover={{ background: "#C4622D" }}
// //                       onClick={() => setStep(2)}
// //                       disabled={safeCart.length === 0}
// //                     >
// //                       CONTINUE TO PAYMENT
// //                     </motion.button>
// //                   </div>
// //                 </motion.div>
// //               )}

// //               {/* STEP 2: Payment */}
// //               {step === 2 && (
// //                 <motion.div
// //                   key="payment"
// //                   initial={{ opacity: 0, x: 20 }}
// //                   animate={{ opacity: 1, x: 0 }}
// //                   exit={{ opacity: 0, x: -20 }}
// //                 >
// //                   <div style={s.card}>
// //                     <p style={s.sectionTitle}>Payment Method</p>
// //                     {[
// //                       {
// //                         id: "razorpay",
// //                         label: "Pay Online (UPI / Card / NetBanking)",
// //                         desc: "Razorpay — Visa, Mastercard, UPI, PhonePe, GPay",
// //                         icon: <FiCreditCard size={18} />,
// //                       },
// //                       {
// //                         id: "cod",
// //                         label: "Cash on Delivery",
// //                         desc: "Pay when your order arrives",
// //                         icon: <span style={{ fontSize: 16 }}>₹</span>,
// //                       },
// //                     ].map(opt => (
// //                       <div
// //                         key={opt.id}
// //                         style={s.payOption(payMethod === opt.id)}
// //                         onClick={() => setPayMethod(opt.id)}
// //                       >
// //                         <div style={{ color: payMethod === opt.id ? "#FAF8F4" : "#C4622D" }}>
// //                           {opt.icon}
// //                         </div>
// //                         <div style={{ flex: 1 }}>
// //                           <p style={s.payLabel(payMethod === opt.id)}>{opt.label}</p>
// //                           <p style={s.payDesc(payMethod === opt.id)}>{opt.desc}</p>
// //                         </div>
// //                         <div
// //                           style={{
// //                             width: 18,
// //                             height: 18,
// //                             borderRadius: "50%",
// //                             border: `2px solid ${
// //                               payMethod === opt.id ? "#FAF8F4" : "#D4C9BC"
// //                             }`,
// //                             background: payMethod === opt.id ? "#FAF8F4" : "transparent",
// //                             display: "flex",
// //                             alignItems: "center",
// //                             justifyContent: "center",
// //                           }}
// //                         >
// //                           {payMethod === opt.id && (
// //                             <div
// //                               style={{
// //                                 width: 8,
// //                                 height: 8,
// //                                 borderRadius: "50%",
// //                                 background: "#1A1612",
// //                               }}
// //                             />
// //                           )}
// //                         </div>
// //                       </div>
// //                     ))}

// //                     {payMethod === "razorpay" && (
// //                       <motion.div
// //                         initial={{ opacity: 0 }}
// //                         animate={{ opacity: 1 }}
// //                         style={{
// //                           padding: "12px",
// //                           background: "#F5F0E8",
// //                           borderRadius: 8,
// //                           marginBottom: 8,
// //                         }}
// //                       >
// //                         <p
// //                           style={{
// //                             fontFamily: "'DM Sans'",
// //                             fontSize: 12,
// //                             color: "#8C7B6B",
// //                             lineHeight: 1.5,
// //                           }}
// //                         >
// //                           Clicking "Place Order" will open the Razorpay secure payment window. Complete your payment there.
// //                         </p>
// //                       </motion.div>
// //                     )}

// //                     <div
// //                       style={{
// //                         marginTop: 8,
// //                         display: "flex",
// //                         alignItems: "center",
// //                         gap: 8,
// //                         padding: "10px 12px",
// //                         background: "#F0F7F2",
// //                         borderRadius: 6,
// //                       }}
// //                     >
// //                       <FiLock size={13} color="#2C6E49" />
// //                       <span
// //                         style={{
// //                           fontFamily: "'DM Sans'",
// //                           fontSize: 11,
// //                           color: "#2C6E49",
// //                         }}
// //                       >
// //                         Your payment information is encrypted & secure
// //                       </span>
// //                     </div>

// //                     <motion.button
// //                       style={{
// //                         ...s.nextBtn,
// //                         background: placing ? "#2C6E49" : "#1A1612",
// //                         marginTop: 20,
// //                       }}
// //                       whileHover={!placing ? { background: "#C4622D" } : {}}
// //                       onClick={handlePlaceOrder}
// //                       disabled={placing || safeCart.length === 0}
// //                     >
// //                       {placing ? (
// //                         <span
// //                           style={{
// //                             display: "flex",
// //                             alignItems: "center",
// //                             gap: 8,
// //                             justifyContent: "center",
// //                           }}
// //                         >
// //                           <motion.span
// //                             animate={{ rotate: 360 }}
// //                             transition={{
// //                               duration: 0.8,
// //                               repeat: Infinity,
// //                               ease: "linear",
// //                             }}
// //                             style={{
// //                               display: "inline-block",
// //                               width: 14,
// //                               height: 14,
// //                               border: "2px solid rgba(255,255,255,0.3)",
// //                               borderTopColor: "#FFF",
// //                               borderRadius: "50%",
// //                             }}
// //                           />
// //                           PLACING ORDER...
// //                         </span>
// //                       ) : (
// //                         `PLACE ORDER · Rs. ${total.toLocaleString()}`
// //                       )}
// //                     </motion.button>
// //                   </div>
// //                 </motion.div>
// //               )}
// //             </AnimatePresence>
// //           </div>

// //           {/* Mini Order Summary */}
// //           <div style={s.miniSummary}>
// //             <p style={s.summaryTitle}>Order Summary</p>
// //             {safeCart.map(item => (
// //               <div
// //                 key={`${item.id || item._id}-${item.selectedSize}`}
// //                 style={s.summaryItem}
// //               >
// //                 <span
// //                   style={{
// //                     maxWidth: 180,
// //                     overflow: "hidden",
// //                     textOverflow: "ellipsis",
// //                     whiteSpace: "nowrap",
// //                   }}
// //                 >
// //                   {item.name} ×{item.qty || 1}
// //                 </span>
// //                 <span>
// //                   Rs. {(item.price * (item.qty || 1)).toLocaleString()}
// //                 </span>
// //               </div>
// //             ))}
// //             {discount > 0 && (
// //               <div style={{ ...s.summaryItem, color: "#2C6E49" }}>
// //                 <span>Coupon Discount</span>
// //                 <span>−Rs. {discount.toLocaleString()}</span>
// //               </div>
// //             )}
// //             <div style={s.summaryItem}>
// //               <span>Shipping</span>
// //               <span
// //                 style={{
// //                   color: shipping === 0 ? "#2C6E49" : "#1A1612",
// //                 }}
// //               >
// //                 {shipping === 0 ? "FREE" : `Rs. ${shipping}`}
// //               </span>
// //             </div>
// //             <div style={s.summaryTotal}>
// //               <span>Total</span>
// //               <span>Rs. {total.toLocaleString()}</span>
// //             </div>
// //             <p
// //               style={{
// //                 fontFamily: "'DM Sans'",
// //                 fontSize: 11,
// //                 color: "#8C7B6B",
// //                 marginTop: 16,
// //                 textAlign: "center",
// //               }}
// //             >
// //               Taxes included. Free returns within 7 days.
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiCheck, FiLock, FiCreditCard, FiTrash2 } from "react-icons/fi";
// import { orderAPI, paymentAPI, cartAPI } from "./api";

// const STEPS = ["Address", "Review", "Payment"];

// // ✅ Defined OUTSIDE Checkout — never recreated on re-render
// const InputField = ({ name, label, placeholder, type = "text", form, errors, onChange }) => (
//   <div style={{ marginBottom: 16 }}>
//     <label style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: 6, display: "block" }}>
//       {label}
//     </label>
//     <input
//       style={{
//         width: "100%", background: "#F5F0E8",
//         border: `1.5px solid ${errors[name] ? "#C4622D" : "#E2D9CE"}`,
//         padding: "11px 14px", borderRadius: 6, fontSize: 13,
//         fontFamily: "'DM Sans'", outline: "none", color: "#1A1612",
//         boxSizing: "border-box", transition: "border 0.2s",
//       }}
//       type={type}
//       placeholder={placeholder}
//       value={form[name]}
//       onChange={e => onChange(name, e.target.value)}
//     />
//     {errors[name] && (
//       <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#C4622D", marginTop: 4 }}>
//         {errors[name]}
//       </p>
//     )}
//   </div>
// );

// export default function Checkout({ cart, navigate, placeOrder, checkoutMeta, onCartUpdate }) {
//   const [step, setStep] = useState(0);
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     apartment: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });
//   const [payMethod, setPayMethod] = useState("cod");
//   const [errors, setErrors] = useState({});
//   const [placing, setPlacing] = useState(false);
//   const [apiError, setApiError] = useState("");
//   // FIX: Initialize as null (not undefined), so disabled={removing !== null} works correctly
//   const [removing, setRemoving] = useState(null);

//   const safeCart = Array.isArray(cart) ? cart : [];

//   const subtotal = safeCart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
//   const shipping = subtotal > 999 ? 0 : 99;
//   const discount = checkoutMeta?.discount || 0;
//   const total = subtotal + shipping - discount;

//   const states = [
//     "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal",
//     "Gujarat", "Rajasthan", "Uttar Pradesh", "Telangana", "Kerala",
//   ];

//   const handleFieldChange = (name, value) => setForm(f => ({ ...f, [name]: value }));

//   const validate = () => {
//     const e = {};
//     if (!form.firstName) e.firstName = "Required";
//     if (!form.lastName) e.lastName = "Required";
//     if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
//     if (!form.phone || form.phone.length < 10) e.phone = "Valid phone required";
//     if (!form.address) e.address = "Required";
//     if (!form.city) e.city = "Required";
//     if (!form.state) e.state = "Required";
//     if (!form.pincode || form.pincode.length < 6) e.pincode = "Valid pincode required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   // FIX: Stringify the ID consistently so === comparisons always work
//   const handleRemoveItem = async (item) => {
//     // FIX: Always stringify — Mongoose _id objects fail strict equality
//     const itemId = String(item._id || item.id);
//     console.log("Removing cart item ID:", itemId, "Full item:", item);

//     setRemoving(itemId);
//     setApiError("");

//     try {
//       await cartAPI.remove(itemId);
//       if (typeof onCartUpdate === "function") {
//         await onCartUpdate();
//       }
//     } catch (e) {
//       setApiError(e.message || "Failed to remove item. Please try again.");
//     } finally {
//       // FIX: Always reset to null so buttons re-enable
//       setRemoving(null);
//     }
//   };

//   const handlePlaceOrder = async () => {
//     setPlacing(true);
//     setApiError("");
//     try {
//       const shippingAddress = {
//         name: `${form.firstName} ${form.lastName}`,
//         phone: form.phone,
//         address: `${form.address}${form.apartment ? `, ${form.apartment}` : ""}`,
//         city: form.city,
//         state: form.state,
//         pincode: form.pincode,
//       };

//       const orderPayload = {
//         shippingAddress,
//         paymentMethod: payMethod === "cod" ? "cod" : "razorpay",
//         couponCode: checkoutMeta?.couponCode || "",
//         cart: safeCart.map(item => ({
//           id: item.id || item._id,
//           qty: item.qty || 1,
//           selectedSize: item.selectedSize,
//           price: item.price,
//         })),
//       };

//       const data = await orderAPI.place(orderPayload);
//       const order = data.order;

//       if (payMethod === "cod") {
//         placeOrder(order);
//         navigate("orderSuccess");
//       } else {
//         const payData = await paymentAPI.createOrder(order._id);

//         const options = {
//           key: payData.key_id,
//           amount: payData.amount,
//           currency: payData.currency,
//           name: "EthnicBeing",
//           description: "Order Payment",
//           order_id: payData.razorpay_order_id,
//           handler: async response => {
//             try {
//               await paymentAPI.verify({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 orderId: order._id,
//               });
//               placeOrder(order);
//               navigate("orderSuccess");
//             } catch (e) {
//               setApiError("Payment verification failed. Contact support.");
//               setPlacing(false);
//             }
//           },
//           prefill: { name: shippingAddress.name, email: form.email, contact: form.phone },
//           theme: { color: "#C4622D" },
//           modal: { ondismiss: () => setPlacing(false) },
//         };

//         if (window.Razorpay) {
//           const rzp = new window.Razorpay(options);
//           rzp.open();
//         } else {
//           console.warn("Razorpay not loaded. Simulating success for development.");
//           placeOrder(order);
//           navigate("orderSuccess");
//         }
//       }
//     } catch (e) {
//       setApiError(e.message || "Failed to place order. Please try again.");
//       setPlacing(false);
//     }
//   };

//   const s = {
//     page: { background: "#FAF8F4", minHeight: "100vh", paddingTop: 80 },
//     inner: { maxWidth: 1100, margin: "0 auto", padding: "40px 40px 80px" },
//     layout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 40 },
//     stepsRow: { display: "flex", alignItems: "center", gap: 0, marginBottom: 36 },
//     stepDot: (active, done) => ({
//       width: 32, height: 32, borderRadius: "50%",
//       background: done ? "#2C6E49" : active ? "#1A1612" : "#E2D9CE",
//       color: done || active ? "#FAF8F4" : "#8C7B6B",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans'", flexShrink: 0,
//     }),
//     stepLabel: active => ({
//       fontFamily: "'DM Sans'", fontSize: 12,
//       fontWeight: active ? 600 : 400,
//       color: active ? "#1A1612" : "#8C7B6B",
//       marginLeft: 8,
//     }),
//     stepLine: done => ({
//       flex: 1, height: 2,
//       background: done ? "#2C6E49" : "#E2D9CE",
//       margin: "0 12px",
//     }),
//     card: {
//       background: "#FFF", borderRadius: 12, padding: 28,
//       boxShadow: "0 2px 12px rgba(26,22,18,0.06)", marginBottom: 20,
//     },
//     label: {
//       fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 11,
//       letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: 6, display: "block",
//     },
//     input: err => ({
//       width: "100%", background: "#F5F0E8",
//       border: `1.5px solid ${err ? "#C4622D" : "#E2D9CE"}`,
//       padding: "11px 14px", borderRadius: 6, fontSize: 13,
//       fontFamily: "'DM Sans'", outline: "none", color: "#1A1612",
//       boxSizing: "border-box", transition: "border 0.2s",
//     }),
//     error: { fontFamily: "'DM Sans'", fontSize: 11, color: "#C4622D", marginTop: 4 },
//     grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
//     nextBtn: {
//       width: "100%", background: "#1A1612", color: "#FAF8F4", border: "none",
//       padding: "15px", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em",
//       cursor: "pointer", borderRadius: 6, fontFamily: "'DM Sans'",
//       marginTop: 20, transition: "background 0.2s",
//     },
//     sectionTitle: {
//       fontFamily: "'Playfair Display', serif", fontWeight: 700,
//       fontSize: 20, color: "#1A1612", marginBottom: 20,
//     },
//     payOption: active => ({
//       border: `2px solid ${active ? "#1A1612" : "#E2D9CE"}`,
//       borderRadius: 8, padding: "14px 18px", cursor: "pointer",
//       display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
//       background: active ? "#1A1612" : "#FFF", transition: "all 0.2s",
//     }),
//     payLabel: active => ({
//       fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13,
//       color: active ? "#FAF8F4" : "#1A1612",
//     }),
//     payDesc: active => ({
//       fontFamily: "'DM Sans'", fontSize: 11,
//       color: active ? "rgba(250,248,244,0.6)" : "#8C7B6B",
//     }),
//     miniSummary: {
//       background: "#FFF", borderRadius: 12, padding: 24,
//       boxShadow: "0 2px 12px rgba(26,22,18,0.06)", position: "sticky", top: 100,
//     },
//     summaryTitle: {
//       fontFamily: "'Playfair Display', serif", fontWeight: 700,
//       fontSize: 16, color: "#1A1612", marginBottom: 16,
//     },
//     summaryItem: {
//       display: "flex", justifyContent: "space-between",
//       fontFamily: "'DM Sans'", fontSize: 12, color: "#5A5048", marginBottom: 10,
//     },
//     summaryTotal: {
//       display: "flex", justifyContent: "space-between",
//       fontFamily: "'Playfair Display', serif", fontWeight: 700,
//       fontSize: 16, color: "#1A1612",
//       paddingTop: 12, borderTop: "1.5px solid #E2D9CE", marginTop: 8,
//     },
//     // FIX: deleteBtn no longer sets pointerEvents here — handled per-button
//     deleteBtn: {
//       background: "none", border: "none", cursor: "pointer",
//       color: "#C4622D", display: "flex", alignItems: "center",
//       justifyContent: "center", padding: 0, marginLeft: 8,
//       width: 28, height: 28, borderRadius: "50%", transition: "background 0.15s",
//     },
//   };



//   return (
//     <div style={s.page}>
//       <div style={s.inner}>
//         <h1 style={{
//           fontFamily: "'Playfair Display', serif", fontWeight: 700,
//           fontSize: "clamp(24px,3vw,36px)", color: "#1A1612", marginBottom: 32,
//         }}>
//           Checkout
//         </h1>

//         {/* Steps */}
//         <div style={s.stepsRow}>
//           {STEPS.map((stepName, i) => (
//             <span key={stepName} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
//               <span style={{ display: "flex", alignItems: "center" }}>
//                 <span style={s.stepDot(step === i, step > i)}>
//                   {step > i ? <FiCheck size={14} /> : i + 1}
//                 </span>
//                 <span style={s.stepLabel(step === i)}>{stepName}</span>
//               </span>
//               {i < STEPS.length - 1 && (
//                 <span style={{ ...s.stepLine(step > i), flex: 1 }} />
//               )}
//             </span>
//           ))}
//         </div>

//         {apiError && (
//           <div style={{
//             background: "#FFF0F0", border: "1px solid #FCC", borderRadius: 8,
//             padding: "12px 16px", marginBottom: 20,
//             fontFamily: "'DM Sans'", fontSize: 13, color: "#C4622D",
//           }}>
//             {apiError}
//           </div>
//         )}

//         <div style={s.layout}>
//           <div>
//             <AnimatePresence mode="wait">

//               {/* STEP 0: Address */}
//               {step === 0 && (
//                 <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
//                   <div style={s.card}>
//                     <p style={s.sectionTitle}>Delivery Address</p>
//                     <div style={s.grid2}>
//                       <InputField name="firstName" label="FIRST NAME" placeholder="Arjun" form={form} errors={errors} onChange={handleFieldChange} />
//                       <InputField name="lastName" label="LAST NAME" placeholder="Sharma" form={form} errors={errors} onChange={handleFieldChange} />
//                     </div>
//                     <div style={s.grid2}>
//                       <InputField name="email" label="EMAIL" placeholder="arjun@email.com" type="email" form={form} errors={errors} onChange={handleFieldChange} />
//                       <InputField name="phone" label="PHONE" placeholder="9876543210" form={form} errors={errors} onChange={handleFieldChange} />
//                     </div>
//                     <InputField name="address" label="ADDRESS" placeholder="House / Street / Area" form={form} errors={errors} onChange={handleFieldChange} />
//                     <InputField name="apartment" label="APARTMENT / FLAT (optional)" placeholder="Flat 4B, Tower 2" form={form} errors={errors} onChange={handleFieldChange} />
//                     <div style={s.grid2}>
//                       <InputField name="city" label="CITY" placeholder="Mumbai" form={form} errors={errors} onChange={handleFieldChange} />
//                       <div>
//                         <label style={s.label}>STATE</label>
//                         <select
//                           style={s.input(errors.state)}
//                           value={form.state}
//                           onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
//                         >
//                           <option value="">Select state</option>
//                           {states.map(st => <option key={st} value={st}>{st}</option>)}
//                         </select>
//                         {errors.state && <p style={s.error}>{errors.state}</p>}
//                       </div>
//                     </div>
//                     <InputField name="pincode" label="PINCODE" placeholder="400001" form={form} errors={errors} onChange={handleFieldChange} />
//                     <motion.button
//                       style={s.nextBtn}
//                       whileHover={{ background: "#C4622D" }}
//                       onClick={() => { if (validate()) setStep(1); }}
//                     >
//                       CONTINUE TO REVIEW
//                     </motion.button>
//                   </div>
//                 </motion.div>
//               )}

//               {/* STEP 1: Review */}
//               {step === 1 && (
//                 <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
//                   <div style={s.card}>
//                     <p style={s.sectionTitle}>Review Your Order</p>
//                     {safeCart.length === 0 && (
//                       <div style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#C4622D", marginBottom: 12 }}>
//                         Your cart is empty.
//                       </div>
//                     )}
//                     {safeCart.map(item => {
//                       // FIX: Stringify once per item so all comparisons are reliable
//                       const itemId = String(item._id || item.id);
//                       const isRemoving = removing === itemId;

//                       return (
//                         <div
//                           key={`${itemId}-${item.selectedSize}`}
//                           style={{
//                             display: "flex", gap: 16, padding: "14px 0",
//                             borderBottom: "1px solid #F0EBE3", alignItems: "center",
//                             opacity: isRemoving ? 0.5 : 1, transition: "opacity 0.2s",
//                           }}
//                         >
//                           <div style={{ width: 64, height: 80, borderRadius: 6, overflow: "hidden", background: "#EEE8DE", flexShrink: 0 }}>
//                             <img
//                               src={item.image || item.images?.[0]}
//                               alt={item.name}
//                               style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                             />
//                           </div>
//                           <div style={{ flex: 1 }}>
//                             <p style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 14, color: "#1A1612" }}>
//                               {item.name}
//                             </p>
//                             <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B", marginTop: 4 }}>
//                               {item.selectedSize ? `Size: ${item.selectedSize} · ` : ""}Qty: {item.qty || 1}
//                             </p>
//                           </div>
//                           <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: "#C4622D" }}>
//                             Rs. {(item.price * (item.qty || 1)).toLocaleString()}
//                           </p>

//                           {/* FIX: disabled only when THIS item is being removed, not when any item is removing */}
//                           <button
//                             style={{
//                               ...s.deleteBtn,
//                               background: isRemoving ? "#F5F0E8" : "none",
//                               // FIX: cursor shows not-allowed only for THIS button while loading
//                               cursor: isRemoving ? "not-allowed" : "pointer",
//                             }}
//                             title="Remove from cart"
//                             // FIX: disabled is scoped to this item only — not all buttons
//                             // disabled={isRemoving}
//                             onClick={() => {
//                               console.log("Remove button clicked for item:", item);
//                               handleRemoveItem(item);
//                             }}
                       
//                           >
//                             {isRemoving ? (
//                               <motion.span
//                                 animate={{ rotate: 360 }}
//                                 transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
//                                 style={{
//                                   display: "inline-block", width: 14, height: 14,
//                                   border: "2px solid rgba(196,98,45,0.3)",
//                                   borderTopColor: "#C4622D", borderRadius: "50%",
//                                 }}
//                               />
//                             ) : (
//                               <FiTrash2 size={18} />
//                             )}
//                           </button>
//                         </div>
//                       );
//                     })}

//                     <div style={{ marginTop: 20, background: "#F5F0E8", borderRadius: 8, padding: 16 }}>
//                       <p style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 12, color: "#1A1612", marginBottom: 8, letterSpacing: "0.08em" }}>
//                         DELIVERY TO
//                       </p>
//                       <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#5A5048", lineHeight: 1.6 }}>
//                         {form.firstName} {form.lastName}<br />
//                         {form.address}{form.apartment ? `, ${form.apartment}` : ""}<br />
//                         {form.city}, {form.state} - {form.pincode}<br />
//                         {form.phone}
//                       </p>
//                       <button
//                         onClick={() => setStep(0)}
//                         style={{ background: "none", border: "none", color: "#C4622D", fontFamily: "'DM Sans'", fontSize: 12, cursor: "pointer", marginTop: 8, fontWeight: 600 }}
//                       >
//                         Edit Address
//                       </button>
//                     </div>

//                     <motion.button
//                       style={s.nextBtn}
//                       whileHover={{ background: "#C4622D" }}
//                       onClick={() => setStep(2)}
//                       disabled={safeCart.length === 0}
//                     >
//                       CONTINUE TO PAYMENT
//                     </motion.button>
//                   </div>
//                 </motion.div>
//               )}

//               {/* STEP 2: Payment */}
//               {step === 2 && (
//                 <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
//                   <div style={s.card}>
//                     <p style={s.sectionTitle}>Payment Method</p>
//                     {[
//                       {
//                         id: "razorpay",
//                         label: "Pay Online (UPI / Card / NetBanking)",
//                         desc: "Razorpay — Visa, Mastercard, UPI, PhonePe, GPay",
//                         icon: <FiCreditCard size={18} />,
//                       },
//                       {
//                         id: "cod",
//                         label: "Cash on Delivery",
//                         desc: "Pay when your order arrives",
//                         icon: <span style={{ fontSize: 16 }}>₹</span>,
//                       },
//                     ].map(opt => (
//                       <div key={opt.id} style={s.payOption(payMethod === opt.id)} onClick={() => setPayMethod(opt.id)}>
//                         <div style={{ color: payMethod === opt.id ? "#FAF8F4" : "#C4622D" }}>{opt.icon}</div>
//                         <div style={{ flex: 1 }}>
//                           <p style={s.payLabel(payMethod === opt.id)}>{opt.label}</p>
//                           <p style={s.payDesc(payMethod === opt.id)}>{opt.desc}</p>
//                         </div>
//                         <div style={{
//                           width: 18, height: 18, borderRadius: "50%",
//                           border: `2px solid ${payMethod === opt.id ? "#FAF8F4" : "#D4C9BC"}`,
//                           background: payMethod === opt.id ? "#FAF8F4" : "transparent",
//                           display: "flex", alignItems: "center", justifyContent: "center",
//                         }}>
//                           {payMethod === opt.id && (
//                             <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1A1612" }} />
//                           )}
//                         </div>
//                       </div>
//                     ))}

//                     {payMethod === "razorpay" && (
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         style={{ padding: "12px", background: "#F5F0E8", borderRadius: 8, marginBottom: 8 }}
//                       >
//                         <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B", lineHeight: 1.5 }}>
//                           Clicking "Place Order" will open the Razorpay secure payment window. Complete your payment there.
//                         </p>
//                       </motion.div>
//                     )}

//                     <div style={{
//                       marginTop: 8, display: "flex", alignItems: "center", gap: 8,
//                       padding: "10px 12px", background: "#F0F7F2", borderRadius: 6,
//                     }}>
//                       <FiLock size={13} color="#2C6E49" />
//                       <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#2C6E49" }}>
//                         Your payment information is encrypted &amp; secure
//                       </span>
//                     </div>

//                     <motion.button
//                       style={{ ...s.nextBtn, background: placing ? "#2C6E49" : "#1A1612", marginTop: 20 }}
//                       whileHover={!placing ? { background: "#C4622D" } : {}}
//                       onClick={handlePlaceOrder}
//                       disabled={placing || safeCart.length === 0}
//                     >
//                       {placing ? (
//                         <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
//                           <motion.span
//                             animate={{ rotate: 360 }}
//                             transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
//                             style={{
//                               display: "inline-block", width: 14, height: 14,
//                               border: "2px solid rgba(255,255,255,0.3)",
//                               borderTopColor: "#FFF", borderRadius: "50%",
//                             }}
//                           />
//                           PLACING ORDER...
//                         </span>
//                       ) : (
//                         `PLACE ORDER · Rs. ${total.toLocaleString()}`
//                       )}
//                     </motion.button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Mini Order Summary */}
//           <div style={s.miniSummary}>
//             <p style={s.summaryTitle}>Order Summary</p>
//             {safeCart.map(item => (
//               <div key={`${String(item._id || item.id)}-${item.selectedSize}`} style={s.summaryItem}>
//                 <span style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                   {item.name} ×{item.qty || 1}
//                 </span>
//                 <span>Rs. {(item.price * (item.qty || 1)).toLocaleString()}</span>
//               </div>
//             ))}
//             {discount > 0 && (
//               <div style={{ ...s.summaryItem, color: "#2C6E49" }}>
//                 <span>Coupon Discount</span>
//                 <span>−Rs. {discount.toLocaleString()}</span>
//               </div>
//             )}
//             <div style={s.summaryItem}>
//               <span>Shipping</span>
//               <span style={{ color: shipping === 0 ? "#2C6E49" : "#1A1612" }}>
//                 {shipping === 0 ? "FREE" : `Rs. ${shipping}`}
//               </span>
//             </div>
//             <div style={s.summaryTotal}>
//               <span>Total</span>
//               <span>Rs. {total.toLocaleString()}</span>
//             </div>
//             <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8C7B6B", marginTop: 16, textAlign: "center" }}>
//               Taxes included. Free returns within 7 days.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiLock, FiCreditCard, FiTrash2 } from "react-icons/fi";
import { orderAPI, paymentAPI, cartAPI } from "./api";

const STEPS = ["Address", "Review", "Payment"];

// Defined OUTSIDE — never recreated on re-render
const InputField = ({ name, label, placeholder, type = "text", form, errors, onChange }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: 6, display: "block" }}>
      {label}
    </label>
    <input
      style={{
        width: "100%", background: "#F5F0E8",
        border: `1.5px solid ${errors[name] ? "#C4622D" : "#E2D9CE"}`,
        padding: "11px 14px", borderRadius: 6, fontSize: 13,
        fontFamily: "'DM Sans'", outline: "none", color: "#1A1612",
        boxSizing: "border-box", transition: "border 0.2s",
      }}
      type={type}
      placeholder={placeholder}
      value={form[name]}
      onChange={e => onChange(name, e.target.value)}
    />
    {errors[name] && (
      <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#C4622D", marginTop: 4 }}>
        {errors[name]}
      </p>
    )}
  </div>
);

// Props:
//   cart         — flat items array from App state (already API-fetched)
//   navigate     — page router
//   placeOrder   — called on success, clears cart in App
//   checkoutMeta — { couponCode, discount } passed from Cart via navigate()
//   onCartUpdate — = fetchCart in App, called after remove so App state stays in sync
export default function Checkout({ cart, navigate, placeOrder, checkoutMeta, onCartUpdate }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", apartment: "", city: "", state: "", pincode: "",
  });
  const [payMethod, setPayMethod] = useState("cod");
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [apiError, setApiError] = useState("");
  // null = no item being removed; string = itemId currently being removed
  const [removing, setRemoving] = useState(null);

  // Normalize: cart from App is already a flat items array
  const safeCart = Array.isArray(cart) ? cart : (cart?.items ?? []);

  const subtotal = safeCart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const discount = checkoutMeta?.discount || 0;
  const total = subtotal + shipping - discount;

  const states = [
    "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal",
    "Gujarat", "Rajasthan", "Uttar Pradesh", "Telangana", "Kerala",
  ];

  const handleFieldChange = (name, value) => setForm(f => ({ ...f, [name]: value }));

  const validate = () => {
    const e = {};
    if (!form.firstName) e.firstName = "Required";
    if (!form.lastName) e.lastName = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone || form.phone.length < 10) e.phone = "Valid phone required";
    if (!form.address) e.address = "Required";
    if (!form.city) e.city = "Required";
    if (!form.state) e.state = "Required";
    if (!form.pincode || form.pincode.length < 6) e.pincode = "Valid pincode required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Remove item: hits API, then calls onCartUpdate so App re-fetches
  // and passes the fresh cart array back down as props automatically
  const handleRemoveItem = async (item) => {
    const itemId = String(item._id || item.id);
    setRemoving(itemId);
    setApiError("");
    try {
      await cartAPI.remove(itemId);
      // Tell App to re-fetch — this updates the cart prop we receive
      if (typeof onCartUpdate === "function") await onCartUpdate();
    } catch (e) {
      setApiError(e.message || "Failed to remove item. Please try again.");
    } finally {
      setRemoving(null);
    }
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setApiError("");
    try {
      const shippingAddress = {
        name: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        address: `${form.address}${form.apartment ? `, ${form.apartment}` : ""}`,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      };

      const orderPayload = {
        shippingAddress,
        paymentMethod: payMethod === "cod" ? "cod" : "razorpay",
        couponCode: checkoutMeta?.couponCode || "",
        cart: safeCart.map(item => ({
          // Send cart item subdocument _id (not product id) so backend can look it up
          id: String(item._id || item.id),
          qty: item.qty || 1,
          selectedSize: item.selectedSize,
          price: item.price,
        })),
      };

      const data = await orderAPI.place(orderPayload);
      const order = data.order;

      if (payMethod === "cod") {
        placeOrder(order); // clears cart in App
        navigate("orderSuccess");
      } else {
        const payData = await paymentAPI.createOrder(order._id);
        const options = {
          key: payData.key_id,
          amount: payData.amount,
          currency: payData.currency,
          name: "EthnicBeing",
          description: "Order Payment",
          order_id: payData.razorpay_order_id,
          handler: async response => {
            try {
              await paymentAPI.verify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              });
              placeOrder(order);
              navigate("orderSuccess");
            } catch (e) {
              setApiError("Payment verification failed. Contact support.");
              setPlacing(false);
            }
          },
          prefill: { name: shippingAddress.name, email: form.email, contact: form.phone },
          theme: { color: "#C4622D" },
          modal: { ondismiss: () => setPlacing(false) },
        };

        if (window.Razorpay) {
          new window.Razorpay(options).open();
        } else {
          console.warn("Razorpay not loaded — simulating success.");
          placeOrder(order);
          navigate("orderSuccess");
        }
      }
    } catch (e) {
      setApiError(e.message || "Failed to place order. Please try again.");
      setPlacing(false);
    }
  };

  const s = {
    page: { background: "#FAF8F4", minHeight: "100vh", paddingTop: 80 },
    inner: { maxWidth: 1100, margin: "0 auto", padding: "40px 40px 80px" },
    layout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 40 },
    stepsRow: { display: "flex", alignItems: "center", gap: 0, marginBottom: 36 },
    stepDot: (active, done) => ({
      width: 32, height: 32, borderRadius: "50%",
      background: done ? "#2C6E49" : active ? "#1A1612" : "#E2D9CE",
      color: done || active ? "#FAF8F4" : "#8C7B6B",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans'", flexShrink: 0,
    }),
    stepLabel: active => ({
      fontFamily: "'DM Sans'", fontSize: 12, fontWeight: active ? 600 : 400,
      color: active ? "#1A1612" : "#8C7B6B", marginLeft: 8,
    }),
    stepLine: done => ({ flex: 1, height: 2, background: done ? "#2C6E49" : "#E2D9CE", margin: "0 12px" }),
    card: { background: "#FFF", borderRadius: 12, padding: 28, boxShadow: "0 2px 12px rgba(26,22,18,0.06)", marginBottom: 20 },
    label: { fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: 6, display: "block" },
    input: err => ({
      width: "100%", background: "#F5F0E8", border: `1.5px solid ${err ? "#C4622D" : "#E2D9CE"}`,
      padding: "11px 14px", borderRadius: 6, fontSize: 13, fontFamily: "'DM Sans'",
      outline: "none", color: "#1A1612", boxSizing: "border-box", transition: "border 0.2s",
    }),
    error: { fontFamily: "'DM Sans'", fontSize: 11, color: "#C4622D", marginTop: 4 },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
    nextBtn: {
      width: "100%", background: "#1A1612", color: "#FAF8F4", border: "none",
      padding: "15px", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em",
      cursor: "pointer", borderRadius: 6, fontFamily: "'DM Sans'", marginTop: 20, transition: "background 0.2s",
    },
    sectionTitle: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "#1A1612", marginBottom: 20 },
    payOption: active => ({
      border: `2px solid ${active ? "#1A1612" : "#E2D9CE"}`, borderRadius: 8, padding: "14px 18px",
      cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
      background: active ? "#1A1612" : "#FFF", transition: "all 0.2s",
    }),
    payLabel: active => ({ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, color: active ? "#FAF8F4" : "#1A1612" }),
    payDesc: active => ({ fontFamily: "'DM Sans'", fontSize: 11, color: active ? "rgba(250,248,244,0.6)" : "#8C7B6B" }),
    miniSummary: { background: "#FFF", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(26,22,18,0.06)", position: "sticky", top: 100 },
    summaryTitle: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "#1A1612", marginBottom: 16 },
    summaryItem: { display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans'", fontSize: 12, color: "#5A5048", marginBottom: 10 },
    summaryTotal: { display: "flex", justifyContent: "space-between", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "#1A1612", paddingTop: 12, borderTop: "1.5px solid #E2D9CE", marginTop: 8 },
    deleteBtn: {
      background: "none", border: "none", color: "#C4622D", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 0, marginLeft: 8,
      width: 28, height: 28, borderRadius: "50%", transition: "background 0.15s",
    },
  };

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(24px,3vw,36px)", color: "#1A1612", marginBottom: 32 }}>
          Checkout
        </h1>

        {/* Steps */}
        <div style={s.stepsRow}>
          {STEPS.map((stepName, i) => (
            <span key={stepName} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <span style={s.stepDot(step === i, step > i)}>
                  {step > i ? <FiCheck size={14} /> : i + 1}
                </span>
                <span style={s.stepLabel(step === i)}>{stepName}</span>
              </span>
              {i < STEPS.length - 1 && <span style={{ ...s.stepLine(step > i), flex: 1 }} />}
            </span>
          ))}
        </div>

        {apiError && (
          <div style={{ background: "#FFF0F0", border: "1px solid #FCC", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontFamily: "'DM Sans'", fontSize: 13, color: "#C4622D" }}>
            {apiError}
          </div>
        )}

        <div style={s.layout}>
          <div>
            <AnimatePresence mode="wait">

              {/* ── STEP 0: Address ── */}
              {step === 0 && (
                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div style={s.card}>
                    <p style={s.sectionTitle}>Delivery Address</p>
                    <div style={s.grid2}>
                      <InputField name="firstName" label="FIRST NAME" placeholder="Arjun" form={form} errors={errors} onChange={handleFieldChange} />
                      <InputField name="lastName" label="LAST NAME" placeholder="Sharma" form={form} errors={errors} onChange={handleFieldChange} />
                    </div>
                    <div style={s.grid2}>
                      <InputField name="email" label="EMAIL" placeholder="arjun@email.com" type="email" form={form} errors={errors} onChange={handleFieldChange} />
                      <InputField name="phone" label="PHONE" placeholder="9876543210" form={form} errors={errors} onChange={handleFieldChange} />
                    </div>
                    <InputField name="address" label="ADDRESS" placeholder="House / Street / Area" form={form} errors={errors} onChange={handleFieldChange} />
                    <InputField name="apartment" label="APARTMENT / FLAT (optional)" placeholder="Flat 4B, Tower 2" form={form} errors={errors} onChange={handleFieldChange} />
                    <div style={s.grid2}>
                      <InputField name="city" label="CITY" placeholder="Mumbai" form={form} errors={errors} onChange={handleFieldChange} />
                      <div>
                        <label style={s.label}>STATE</label>
                        <select style={s.input(errors.state)} value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
                          <option value="">Select state</option>
                          {states.map(st => <option key={st} value={st}>{st}</option>)}
                        </select>
                        {errors.state && <p style={s.error}>{errors.state}</p>}
                      </div>
                    </div>
                    <InputField name="pincode" label="PINCODE" placeholder="400001" form={form} errors={errors} onChange={handleFieldChange} />
                    <motion.button style={s.nextBtn} whileHover={{ background: "#C4622D" }} onClick={() => { if (validate()) setStep(1); }}>
                      CONTINUE TO REVIEW
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 1: Review ── */}
              {step === 1 && (
                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div style={s.card}>
                    <p style={s.sectionTitle}>Review Your Order</p>

                    {safeCart.length === 0 && (
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#C4622D", marginBottom: 12 }}>
                        Your cart is empty.
                      </div>
                    )}

                    {safeCart.map(item => {
                      const itemId = String(item._id || item.id);
                      const isRemoving = removing === itemId;
                      return (
                        <div
                          key={`${itemId}-${item.selectedSize}`}
                          style={{
                            display: "flex", gap: 16, padding: "14px 0",
                            borderBottom: "1px solid #F0EBE3", alignItems: "center",
                            opacity: isRemoving ? 0.5 : 1, transition: "opacity 0.2s",
                          }}
                        >
                          <div style={{ width: 64, height: 80, borderRadius: 6, overflow: "hidden", background: "#EEE8DE", flexShrink: 0 }}>
                            <img
                              src={item.image || item.images?.[0] || item.product?.images?.[0]}
                              alt={item.name || item.product?.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 14, color: "#1A1612" }}>
                              {item.name || item.product?.name}
                            </p>
                            <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B", marginTop: 4 }}>
                              {item.selectedSize ? `Size: ${item.selectedSize} · ` : ""}Qty: {item.qty || 1}
                            </p>
                          </div>
                          <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: "#C4622D" }}>
                            Rs. {(item.price * (item.qty || 1)).toLocaleString()}
                          </p>

                          {/* DELETE BUTTON — disabled only for THIS item while it's being removed */}
                          <button
                            style={{
                              ...s.deleteBtn,
                              background: isRemoving ? "#F5F0E8" : "none",
                              cursor: isRemoving ? "not-allowed" : "pointer",
                            }}
                            title="Remove from cart"
                            disabled={isRemoving}
                            onClick={() => handleRemoveItem(item)}
                          >
                            {isRemoving ? (
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(196,98,45,0.3)", borderTopColor: "#C4622D", borderRadius: "50%" }}
                              />
                            ) : (
                              <FiTrash2 size={18} />
                            )}
                          </button>
                        </div>
                      );
                    })}

                    <div style={{ marginTop: 20, background: "#F5F0E8", borderRadius: 8, padding: 16 }}>
                      <p style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 12, color: "#1A1612", marginBottom: 8, letterSpacing: "0.08em" }}>
                        DELIVERY TO
                      </p>
                      <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#5A5048", lineHeight: 1.6 }}>
                        {form.firstName} {form.lastName}<br />
                        {form.address}{form.apartment ? `, ${form.apartment}` : ""}<br />
                        {form.city}, {form.state} - {form.pincode}<br />
                        {form.phone}
                      </p>
                      <button onClick={() => setStep(0)} style={{ background: "none", border: "none", color: "#C4622D", fontFamily: "'DM Sans'", fontSize: 12, cursor: "pointer", marginTop: 8, fontWeight: 600 }}>
                        Edit Address
                      </button>
                    </div>

                    <motion.button style={s.nextBtn} whileHover={{ background: "#C4622D" }} onClick={() => setStep(2)} disabled={safeCart.length === 0}>
                      CONTINUE TO PAYMENT
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Payment ── */}
              {step === 2 && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div style={s.card}>
                    <p style={s.sectionTitle}>Payment Method</p>
                    {[
                      { id: "razorpay", label: "Pay Online (UPI / Card / NetBanking)", desc: "Razorpay — Visa, Mastercard, UPI, PhonePe, GPay", icon: <FiCreditCard size={18} /> },
                      { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: <span style={{ fontSize: 16 }}>₹</span> },
                    ].map(opt => (
                      <div key={opt.id} style={s.payOption(payMethod === opt.id)} onClick={() => setPayMethod(opt.id)}>
                        <div style={{ color: payMethod === opt.id ? "#FAF8F4" : "#C4622D" }}>{opt.icon}</div>
                        <div style={{ flex: 1 }}>
                          <p style={s.payLabel(payMethod === opt.id)}>{opt.label}</p>
                          <p style={s.payDesc(payMethod === opt.id)}>{opt.desc}</p>
                        </div>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${payMethod === opt.id ? "#FAF8F4" : "#D4C9BC"}`, background: payMethod === opt.id ? "#FAF8F4" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {payMethod === opt.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1A1612" }} />}
                        </div>
                      </div>
                    ))}

                    {payMethod === "razorpay" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "12px", background: "#F5F0E8", borderRadius: 8, marginBottom: 8 }}>
                        <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B", lineHeight: 1.5 }}>
                          Clicking "Place Order" will open the Razorpay secure payment window. Complete your payment there.
                        </p>
                      </motion.div>
                    )}

                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#F0F7F2", borderRadius: 6 }}>
                      <FiLock size={13} color="#2C6E49" />
                      <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#2C6E49" }}>
                        Your payment information is encrypted &amp; secure
                      </span>
                    </div>

                    <motion.button
                      style={{ ...s.nextBtn, background: placing ? "#2C6E49" : "#1A1612", marginTop: 20 }}
                      whileHover={!placing ? { background: "#C4622D" } : {}}
                      onClick={handlePlaceOrder}
                      disabled={placing || safeCart.length === 0}
                    >
                      {placing ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#FFF", borderRadius: "50%" }}
                          />
                          PLACING ORDER...
                        </span>
                      ) : (
                        `PLACE ORDER · Rs. ${total.toLocaleString()}`
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mini Order Summary */}
          <div style={s.miniSummary}>
            <p style={s.summaryTitle}>Order Summary</p>
            {safeCart.map(item => (
              <div key={`${String(item._id || item.id)}-${item.selectedSize}`} style={s.summaryItem}>
                <span style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.name || item.product?.name} ×{item.qty || 1}
                </span>
                <span>Rs. {(item.price * (item.qty || 1)).toLocaleString()}</span>
              </div>
            ))}
            {discount > 0 && (
              <div style={{ ...s.summaryItem, color: "#2C6E49" }}>
                <span>Coupon Discount</span>
                <span>−Rs. {discount.toLocaleString()}</span>
              </div>
            )}
            <div style={s.summaryItem}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? "#2C6E49" : "#1A1612" }}>
                {shipping === 0 ? "FREE" : `Rs. ${shipping}`}
              </span>
            </div>
            <div style={s.summaryTotal}>
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8C7B6B", marginTop: 16, textAlign: "center" }}>
              Taxes included. Free returns within 7 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}