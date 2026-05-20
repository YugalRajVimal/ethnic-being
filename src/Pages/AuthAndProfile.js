
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff,
  FiPackage, FiHeart, FiMapPin, FiLogOut, FiCheck, FiStar, FiTrash, FiEdit2, FiPlus
} from "react-icons/fi";
import { authAPI, orderAPI, userAPI } from "./api";

// ─── ORDER SUCCESS ─────────────────────────────────────────────────────────────
export function OrderSuccess({ navigate, lastOrder }) {
  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh", paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: "#FFF", borderRadius: 16, padding: "60px 48px", maxWidth: 520, width: "100%", margin: "0 40px", textAlign: "center", boxShadow: "0 4px 32px rgba(26,22,18,0.1)" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{ width: 80, height: 80, borderRadius: "50%", background: "#2C6E49", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
          <FiCheck size={36} color="#FFF" />
        </motion.div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 32, color: "#1A1612", marginBottom: 12 }}>Order Placed!</h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 18, color: "#8C7B6B", marginBottom: 8 }}>
          Thank you for shopping with EthnicBeing
        </p>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B", marginBottom: 32, lineHeight: 1.6 }}>
          Your order has been confirmed and will be shipped within 2 business days.<br />
          You'll receive a tracking link on your email.
        </p>
        <div style={{ background: "#F5F0E8", borderRadius: 8, padding: "16px 20px", marginBottom: 32, textAlign: "left" }}>
          <p style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 12, color: "#8C7B6B", letterSpacing: "0.1em", marginBottom: 8 }}>ORDER DETAILS</p>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#1A1612" }}>
            Order #{lastOrder?._id?.slice(-6)?.toUpperCase() || "EB" + Date.now().toString().slice(-6)}
          </p>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B", marginTop: 4 }}>Estimated delivery: 5–7 business days</p>
          {lastOrder?.shippingAddress && (
            <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B", marginTop: 4 }}>
              Delivering to: {lastOrder.shippingAddress.city}, {lastOrder.shippingAddress.state}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <motion.button whileHover={{ background: "#C4622D" }}
            style={{ flex: 1, background: "#1A1612", color: "#FAF8F4", border: "none", padding: "14px", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer", borderRadius: 6, fontFamily: "'DM Sans'", transition: "background 0.2s" }}
            onClick={() => navigate("orders")}>
            TRACK ORDER
          </motion.button>
          <motion.button whileHover={{ background: "#1A1612", color: "#FAF8F4" }}
            style={{ flex: 1, background: "transparent", color: "#1A1612", border: "1.5px solid #1A1612", padding: "14px", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer", borderRadius: 6, fontFamily: "'DM Sans'", transition: "all 0.2s" }}
            onClick={() => navigate("home")}>
            CONTINUE SHOPPING
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── FORGOT PASSWORD MODAL ─────────────────────────────────────────────────────
function ForgotPasswordFlow({ onClose }) {
  const [step, setStep] = useState("email"); // email | otp | reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const s = {
    overlay: { position: "fixed", inset: 0, background: "rgba(26,22,18,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
    box: { background: "#FFF", borderRadius: 12, padding: "36px 32px", maxWidth: 400, width: "100%", margin: "0 20px", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" },
    title: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: "#1A1612", marginBottom: 8 },
    sub: { fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B", marginBottom: 24 },
    label: { fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: 6, display: "block" },
    input: { width: "100%", background: "#F5F0E8", border: "1.5px solid #E2D9CE", padding: "11px 14px", borderRadius: 6, fontSize: 13, fontFamily: "'DM Sans'", outline: "none", color: "#1A1612", boxSizing: "border-box", marginBottom: 16 },
    btn: { width: "100%", background: "#1A1612", color: "#FAF8F4", border: "none", padding: "13px", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", cursor: "pointer", borderRadius: 6, fontFamily: "'DM Sans'", marginBottom: 10 },
    cancel: { width: "100%", background: "transparent", border: "none", color: "#8C7B6B", fontFamily: "'DM Sans'", fontSize: 13, cursor: "pointer", padding: "8px" },
  };

  const sendOtp = async () => {
    setLoading(true); setErr("");
    try {
      await authAPI.forgotPw({ email });
      setMsg("OTP sent to your email.");
      setStep("otp");
    } catch (e) { setErr(e.message); }
    setLoading(false);
  };

  const verify = async () => {
    setLoading(true); setErr("");
    try {
      await authAPI.verifyOtp({ email, otp });
      setStep("reset");
    } catch (e) { setErr(e.message); }
    setLoading(false);
  };

  const reset = async () => {
    setLoading(true); setErr("");
    try {
      await authAPI.resetPw({ email, password: newPw });
      setMsg("Password reset! Please log in.");
      setTimeout(onClose, 1500);
    } catch (e) { setErr(e.message); }
    setLoading(false);
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.box} onClick={e => e.stopPropagation()}>
        <p style={s.title}>
          {step === "email" ? "Forgot Password" : step === "otp" ? "Enter OTP" : "New Password"}
        </p>
        <p style={s.sub}>
          {step === "email" ? "We'll send an OTP to your email." : step === "otp" ? `Check ${email} for your 6-digit code.` : "Choose a new password (min. 6 chars)."}
        </p>
        {msg && <p style={{ color: "#2C6E49", fontFamily: "'DM Sans'", fontSize: 12, marginBottom: 12 }}>{msg}</p>}
        {err && <p style={{ color: "#C4622D", fontFamily: "'DM Sans'", fontSize: 12, marginBottom: 12 }}>{err}</p>}
        {step === "email" && (
          <>
            <label style={s.label}>EMAIL</label>
            <input style={s.input} placeholder="arjun@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            <button style={s.btn} onClick={sendOtp} disabled={loading}>{loading ? "SENDING..." : "SEND OTP"}</button>
          </>
        )}
        {step === "otp" && (
          <>
            <label style={s.label}>OTP CODE</label>
            <input style={s.input} placeholder="123456" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} />
            <button style={s.btn} onClick={verify} disabled={loading}>{loading ? "VERIFYING..." : "VERIFY OTP"}</button>
          </>
        )}
        {step === "reset" && (
          <>
            <label style={s.label}>NEW PASSWORD</label>
            <input style={s.input} type="password" placeholder="••••••••" value={newPw} onChange={e => setNewPw(e.target.value)} />
            <button style={s.btn} onClick={reset} disabled={loading}>{loading ? "SAVING..." : "RESET PASSWORD"}</button>
          </>
        )}
        <button style={s.cancel} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ─── ADDRESS MODAL ─────────────────────────────────────────────────────────────
function AddressModal({ onClose, onSave, initial }) {
  // Defensive: support undefined/null initial, then overlay with its fields if present.
  const [address, setAddress] = useState({
    label: initial?.label || "",
    addressLine1: initial?.addressLine1 || "",
    addressLine2: initial?.addressLine2 || "",
    city: initial?.city || "",
    state: initial?.state || "",
    pincode: initial?.pincode || "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const s = {
    overlay: { position: "fixed", inset: 0, background: "rgba(26,22,18,0.4)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" },
    box: { background: "#FFF", borderRadius: 12, padding: "36px 32px", maxWidth: 420, width: "100%", margin: "0 20px", boxShadow: "0 8px 40px rgba(0,0,0,0.16)" },
    title: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "#1A1612", marginBottom: 18 },
    label: { fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: 6, display: "block" },
    input: { width: "100%", background: "#F5F0E8", border: "1.5px solid #E2D9CE", padding: "11px 14px", borderRadius: 6, fontSize: 13, fontFamily: "'DM Sans'", outline: "none", color: "#1A1612", boxSizing: "border-box", marginBottom: 14 },
    btnRow: { display: "flex", gap: 10, marginTop: 10 },
    btn: { flex: 1, background: "#1A1612", color: "#FAF8F4", border: "none", padding: "12px", borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans'", cursor: "pointer" },
    cancel: { flex: 1, background: "transparent", border: "1.5px solid #8C7B6B", color: "#8C7B6B", padding: "12px", borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans'", cursor: "pointer" },
    err: { color: "#C4622D", fontSize: 12, marginBottom: 12, fontFamily: "'DM Sans'" }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setAddress(a => ({ ...a, [name]: value }));
  };

  // Basic validation for all fields except addressLine2
  const validate = () =>
    !!address.label && !!address.addressLine1 && !!address.city && !!address.state && !!address.pincode;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!validate()) {
      setErr("Please fill all fields except Address Line 2.");
      return;
    }
    setLoading(true);
    try {
      await onSave(address);
      onClose();
    } catch (e) {
      setErr(e.message || "Error");
    }
    setLoading(false);
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <form style={s.box} onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <p style={s.title}>{initial && initial._id ? "Edit Address" : "Add New Address"}</p>
        {err && <div style={s.err}>{err}</div>}
        <label style={s.label}>LABEL (e.g. Home, Office)</label>
        <input style={s.input} name="label" value={address.label} onChange={handleChange} placeholder="Home, Office, etc." required />
        <label style={s.label}>ADDRESS LINE 1</label>
        <input style={s.input} name="addressLine1" value={address.addressLine1} onChange={handleChange} placeholder="Building, Area, Street" required />
        <label style={s.label}>ADDRESS LINE 2</label>
        <input style={s.input} name="addressLine2" value={address.addressLine2} onChange={handleChange} placeholder="(optional)" />
        <label style={s.label}>CITY</label>
        <input style={s.input} name="city" value={address.city} onChange={handleChange} placeholder="City" required />
        <label style={s.label}>STATE</label>
        <input style={s.input} name="state" value={address.state} onChange={handleChange} placeholder="State" required />
        <label style={s.label}>PINCODE</label>
        <input style={s.input} name="pincode" value={address.pincode} onChange={handleChange} placeholder="Pincode" required maxLength={8} />
        <div style={s.btnRow}>
          <button style={s.btn} type="submit" disabled={loading}>{loading ? "Saving..." : (initial && initial._id ? "Update" : "Add")}</button>
          <button style={s.cancel} type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export function Auth({ navigate, login }) {
  const [mode, setMode] = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      let data;
      if (mode === "login") {
        data = await authAPI.login({ email: form.email, password: form.password });
      } else {
        data = await authAPI.register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      }
      localStorage.setItem("eb_token", data.token);
      login(data.user);
      navigate("profile");
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("Google login requires OAuth setup. Use email/password for now.");
  };

  const s = {
    page: { background: "#FAF8F4", minHeight: "100vh", paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center" },
    card: { background: "#FFF", borderRadius: 16, padding: "48px", maxWidth: 440, width: "100%", margin: "0 20px", boxShadow: "0 4px 32px rgba(26,22,18,0.08)" },
    logo: { fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 24, color: "#1A1612", letterSpacing: "0.1em", textAlign: "center", marginBottom: 8 },
    subtitle: { fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, color: "#8C7B6B", textAlign: "center", marginBottom: 32 },
    tabs: { display: "flex", marginBottom: 28, border: "1px solid #E2D9CE", borderRadius: 8, overflow: "hidden" },
    tab: (active) => ({ flex: 1, padding: "11px", background: active ? "#1A1612" : "transparent", color: active ? "#FAF8F4" : "#8C7B6B", border: "none", fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }),
    fieldWrap: { marginBottom: 16, position: "relative" },
    label: { fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: 6, display: "block" },
    input: { width: "100%", background: "#F5F0E8", border: "1.5px solid #E2D9CE", padding: "11px 40px 11px 14px", borderRadius: 6, fontSize: 13, fontFamily: "'DM Sans'", outline: "none", color: "#1A1612", boxSizing: "border-box" },
    icon: { position: "absolute", right: 12, top: 32, color: "#8C7B6B" },
    submitBtn: { width: "100%", background: "#1A1612", color: "#FAF8F4", border: "none", padding: "15px", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer", borderRadius: 6, fontFamily: "'DM Sans'", marginTop: 8, transition: "background 0.2s" },
    divider: { display: "flex", alignItems: "center", gap: 12, margin: "20px 0" },
    divLine: { flex: 1, height: 1, background: "#E2D9CE" },
    divText: { fontFamily: "'DM Sans'", fontSize: 11, color: "#B0A090" },
    googleBtn: { width: "100%", background: "#FFF", border: "1.5px solid #E2D9CE", padding: "13px", fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 6, fontFamily: "'DM Sans'", color: "#1A1612", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 },
    errorBox: { background: "#FFF0F0", border: "1px solid #FCC", borderRadius: 6, padding: "10px 14px", fontFamily: "'DM Sans'", fontSize: 12, color: "#C4622D", marginBottom: 16 },
  };

  return (
    <div style={s.page}>
      {showForgot && <ForgotPasswordFlow onClose={() => setShowForgot(false)} />}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={s.card}>
        <p style={s.logo}>Ethnic<span style={{ color: "#C4622D" }}>Being</span></p>
        <p style={s.subtitle}>{mode === "login" ? "Welcome back" : "Join the tribe"}</p>
        <div style={s.tabs}>
          <button style={s.tab(mode === "login")} onClick={() => { setMode("login"); setError(""); }}>Login</button>
          <button style={s.tab(mode === "register")} onClick={() => { setMode("register"); setError(""); }}>Register</button>
        </div>

        {error && <div style={s.errorBox}>{error}</div>}

        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            {mode === "register" && (
              <div style={s.fieldWrap}>
                <label style={s.label}>FULL NAME</label>
                <input style={s.input} placeholder="Arjun Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <FiUser size={15} style={s.icon} />
              </div>
            )}
            <div style={s.fieldWrap}>
              <label style={s.label}>EMAIL</label>
              <input style={s.input} placeholder="arjun@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              <FiMail size={15} style={s.icon} />
            </div>
            {mode === "register" && (
              <div style={s.fieldWrap}>
                <label style={s.label}>PHONE</label>
                <input style={s.input} placeholder="9876543210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                <FiPhone size={15} style={s.icon} />
              </div>
            )}
            <div style={s.fieldWrap}>
              <label style={s.label}>PASSWORD</label>
              <input style={s.input} type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              <button style={{ ...s.icon, background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={() => setShowPw(p => !p)}>
                {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
            {mode === "login" && (
              <p onClick={() => setShowForgot(true)} style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#C4622D", textAlign: "right", cursor: "pointer", marginTop: -8, marginBottom: 12 }}>
                Forgot password?
              </p>
            )}
            <motion.button style={s.submitBtn} whileHover={{ background: "#C4622D" }} onClick={handleSubmit} disabled={loading}>
              {loading ? "PLEASE WAIT..." : mode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
            </motion.button>
          </motion.div>
        </AnimatePresence>

        <div style={s.divider}>
          <div style={s.divLine} /><span style={s.divText}>OR</span><div style={s.divLine} />
        </div>
        <button style={s.googleBtn} onClick={handleGoogle}>
          <svg width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.4 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.4 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.4 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.2C9.6 39.6 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.1 5.5l6.2 5.2C37.9 40.8 44 36 44 24c0-1.3-.1-2.7-.4-3.9z"/>
          </svg>
          Continue with Google
        </button>
      </motion.div>
    </div>
  );
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────
//
// Now supports: 
// - Adding wishlist as left panel navTab.
// - Clicking stats boxes for Orders/Wishlist/Overview also switches main panel to that tab.
//
export function Profile({ user, navigate, logout, setUser, wishlist, toggleWishlist, addToCart, allProducts }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: user?.phone || "", dob: user?.dob || "" });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, reviews: 0 });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressErr, setAddressErr] = useState("");

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || "", phone: user.phone || "", dob: user.dob?.slice(0,10) || "" });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "addresses") loadAddresses();
    if (activeTab === "overview") loadStats();
  }, [activeTab]);

  const loadAddresses = async () => {
    setAddressLoading(true);
    setAddressErr("");
    try {
      const data = await userAPI.getAddresses();
      setAddresses(data.addresses || []);
    } catch (e) { setAddressErr(e.message || "Failed to load addresses"); }
    setAddressLoading(false);
  };

  const loadStats = async () => {
    try {
      const data = await orderAPI.myOrders();
      setStats(s => ({ ...s, orders: data.orders?.length || 0, wishlist: wishlist ? wishlist.length : 0 }));
    } catch (e) { /* ignore */ }
  };

  const handleSaveProfile = async () => {
    setSaving(true); setSaveMsg("");
    try {
      const data = await userAPI.updateProfile(profileForm);
      setUser(data.user);
      setSaveMsg("Saved successfully!");
    } catch (e) { setSaveMsg(e.message); }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleAddAddress = async (addr) => {
    await userAPI.addAddress(addr);
    await loadAddresses();
  };

  const handleUpdateAddress = async (addr) => {
    if (!editAddress || !editAddress._id) return;
    await userAPI.updateAddress(editAddress._id, addr);
    await loadAddresses();
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm("Delete this address?")) {
      await userAPI.deleteAddress(id);
      await loadAddresses();
    }
  };

  if (!user) { navigate("auth"); return null; }

  // ----------- NEW: Include a Wishlist tab in the left sidebar
  const TABS = [
    { id: "overview",  label: "Overview",   icon: <FiUser size={15} /> },
    { id: "orders",    label: "My Orders",  icon: <FiPackage size={15} /> },
    { id: "wishlist",  label: "Wishlist",   icon: <FiHeart size={15} /> },
    { id: "addresses", label: "Addresses",  icon: <FiMapPin size={15} /> },
  ];

  const s = {
    page: { background: "#FAF8F4", minHeight: "100vh", paddingTop: 80 },
    inner: { maxWidth: 1100, margin: "0 auto", padding: "40px 40px 80px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 32 },
    sidebar: { background: "#FFF", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(26,22,18,0.06)", height: "fit-content", position: "sticky", top: 100 },
    avatar: { width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #C4622D, #B8922A)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#FFF", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 28 },
    name: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#1A1612", textAlign: "center", marginBottom: 4 },
    email: { fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B", textAlign: "center", marginBottom: 24 },
    navItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 6, cursor: "pointer", background: active ? "#1A1612" : "transparent", color: active ? "#FAF8F4" : "#5A5048", fontFamily: "'DM Sans'", fontWeight: 500, fontSize: 13, marginBottom: 4, border: "none", width: "100%", textAlign: "left", transition: "all 0.2s" }),
    content: { background: "#FFF", borderRadius: 12, padding: 32, boxShadow: "0 2px 12px rgba(26,22,18,0.06)" },
    sectionTitle: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: "#1A1612", marginBottom: 24 },
    statGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 },
    stat: { background: "#F5F0E8", borderRadius: 10, padding: "20px 16px", textAlign: "center", cursor: "pointer", transition: "box-shadow 0.2s" },
    statNum: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 28, color: "#C4622D", display: "block" },
    statLabel: { fontFamily: "'DM Sans'", fontSize: 11, color: "#8C7B6B", marginTop: 4, letterSpacing: "0.05em" },
    input: { width: "100%", background: "#F5F0E8", border: "1.5px solid #E2D9CE", padding: "11px 14px", borderRadius: 6, fontSize: 13, fontFamily: "'DM Sans'", outline: "none", color: "#1A1612", boxSizing: "border-box", marginBottom: 16 },
    label: { fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: 6, display: "block" },
    saveBtn: { background: "#1A1612", color: "#FAF8F4", border: "none", padding: "12px 28px", borderRadius: 6, fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer", fontFamily: "'DM Sans'", transition: "background 0.2s" },
    addrActions: { display: "flex", gap: 8, alignItems: "center" }
  };

  // Grab the allProducts prop _only_ for wishlist inline-render
  // Defensive: null allProducts just falls back to []
  const wishlistProducts = wishlist||[];

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <div style={s.sidebar}>
          <div style={s.avatar}>{user.name?.[0] || "U"}</div>
          <p style={s.name}>{user.name}</p>
          <p style={s.email}>{user.email}</p>
          {TABS.map(tab => (
            <button key={tab.id} style={s.navItem(activeTab === tab.id)} onClick={() => setActiveTab(tab.id)}>
              {tab.icon}{tab.label}
            </button>
          ))}
          <div style={{ height: 1, background: "#F0EBE3", margin: "12px 0" }} />
          <button style={{ ...s.navItem(false), color: "#C4622D" }} onClick={() => {
            logout();
            localStorage.removeItem("eb_token");
            navigate("home");
          }}>
            <FiLogOut size={15} />Logout
          </button>
        </div>

        <div style={s.content}>
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p style={s.sectionTitle}>My Profile</p>
              <div style={s.statGrid}>
                <div
                  style={s.stat}
                  // Clicking stat box opens Orders tab
                  onClick={() => setActiveTab("orders")}
                  title="View all orders"
                >
                  <span style={s.statNum}>{stats.orders}</span>
                  <p style={s.statLabel}>ORDERS</p>
                </div>
                <div
                  style={s.stat}
                  // Clicking stat box opens Wishlist tab
                  onClick={() => setActiveTab("wishlist")}
                  title="View your wishlist"
                >
                  <span style={s.statNum}>{wishlist ? wishlist.length : 0}</span>
                  <p style={s.statLabel}>WISHLIST</p>
                </div>
                <div
                  style={s.stat}
                  // Could handle a reviews section if needed
                  onClick={() => setActiveTab("overview")}
                  title="Overview"
                >
                  <span style={s.statNum}>—</span>
                  <p style={s.statLabel}>REVIEWS</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={s.label}>FULL NAME</label>
                  <input style={s.input} value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label style={s.label}>EMAIL</label>
                  <input style={s.input} value={user.email} disabled style={{ ...s.input, opacity: 0.6, cursor: "not-allowed" }} />
                </div>
                <div>
                  <label style={s.label}>PHONE</label>
                  <input style={s.input} placeholder="Add phone number" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label style={s.label}>DATE OF BIRTH</label>
                  <input style={s.input} type="date" value={profileForm.dob} onChange={e => setProfileForm(f => ({ ...f, dob: e.target.value }))} />
                </div>
              </div>
              {saveMsg && <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: saveMsg.includes("success") ? "#2C6E49" : "#C4622D", marginBottom: 12 }}>{saveMsg}</p>}
              <motion.button whileHover={{ background: "#C4622D" }} style={s.saveBtn} onClick={handleSaveProfile} disabled={saving}>
                {saving ? "SAVING..." : "SAVE CHANGES"}
              </motion.button>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p style={s.sectionTitle}>My Orders</p>
              <Orders navigate={navigate} inline />
            </motion.div>
          )}

          {/* ---- INLINE WISHLIST PANEL ----- */}
          {activeTab === "wishlist" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p style={s.sectionTitle}>My Wishlist</p>
              {/* Inline Wishlist with same display as before */}
              {!wishlistProducts.length ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "30vh" }}>
                  <div style={{ textAlign: "center" }}>
                    <FiHeart size={48} color="#D4C9BC" style={{ marginBottom: 16 }} />
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24, color: "#1A1612", marginBottom: 8 }}>Your wishlist is empty</h2>
                    <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#8C7B6B", marginBottom: 24 }}>Save items you love to buy them later</p>
                    <motion.button whileHover={{ background: "#C4622D" }}
                      style={{ background: "#1A1612", color: "#FAF8F4", border: "none", padding: "13px 28px", borderRadius: 6, fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer", fontFamily: "'DM Sans'", transition: "background 0.2s" }}
                      onClick={() => navigate("products")}>
                      EXPLORE PRODUCTS
                    </motion.button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B", marginBottom: 32 }}>{wishlistProducts.length} saved items</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 24 }}>
                  {wishlistProducts.map((p, i) => (
                    <motion.div
                      key={p.id || p._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        background: "#FFF",
                        borderRadius: 12,
                        overflow: "hidden",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(26,22,18,0.06)"
                      }}
                      onClick={() => navigate("product", p)}
                    >
                      <div style={{
                        position: "relative",
                        aspectRatio: "3/4",
                        overflow: "hidden",
                        background: "#EEE8DE"
                      }}>
                        <img src={p.image || p.images?.[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        <button style={{ position: "absolute", top: 12, right: 12, background: "#FFF", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none" }}
                          onClick={e => { e.stopPropagation(); toggleWishlist(p.id || p._id); }}>
                          <FiHeart size={15} fill="#C4622D" color="#C4622D" />
                        </button>
                      </div>
                      <div style={{ padding: "14px 16px 16px" }}>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 15, color: "#1A1612", marginBottom: 6 }}>{p.name}</p>
                        <span style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14, color: "#C4622D" }}>Rs. {p.price?.toLocaleString()}</span>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop:6 }}>
                          
                          <motion.button whileHover={{ background: "#C4622D" }}
                            style={{ background: "#1A1612", color: "#FAF8F4", border: "none", padding: "7px 14px", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", letterSpacing: "0.1em", transition: "background 0.2s" }}
                            onClick={e => { e.stopPropagation(); addToCart(p); }}>
                            ADD TO CART
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === "addresses" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p style={s.sectionTitle}>Saved Addresses</p>
              {addressErr && <div style={{ color: "#C4622D", fontFamily: "'DM Sans'", marginBottom: 16 }}>{addressErr}</div>}
              {addressLoading ? (
                <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B", marginBottom: 20 }}>Loading...</p>
              ) : addresses.length === 0 ? (
                <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B", marginBottom: 20 }}>No saved addresses yet.</p>
              ) : (
                addresses.map(addr => (
                  <div key={addr._id} style={{
                    background: "#F5F0E8",
                    borderRadius: 10,
                    padding: 20,
                    marginBottom: 12,
                    border: addr.isDefault ? "2px solid #C4622D" : "2px solid transparent",
                    position: "relative"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
                      <span style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 12, color: addr.isDefault ? "#C4622D" : "#8C7B6B", letterSpacing: "0.1em" }}>
                        {addr.label?.toUpperCase()}{addr.isDefault ? " · DEFAULT" : ""}
                      </span>
                      <div style={s.addrActions}>
                        <button
                          onClick={() => {
                            setEditAddress(addr);
                            setShowAddressModal(true);
                          }}
                          style={{
                            background: "none", border: "none", color: "#5A5048", fontFamily: "'DM Sans'",
                            fontSize: 14, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center"
                          }}
                          title="Edit"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          style={{
                            background: "none", border: "none", color: "#C4622D", fontFamily: "'DM Sans'",
                            fontSize: 14, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center"
                          }}
                          title="Delete"
                        >
                          <FiTrash size={15} />
                        </button>
                        <button
                          disabled={addr.isDefault}
                          onClick={() => userAPI.setDefaultAddress(addr._id).then(loadAddresses)}
                          style={{
                            background: "none", border: "none", color: addr.isDefault ? "#98A6A6" : "#B8922A",
                            fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 12, cursor: addr.isDefault ? "default" : "pointer",
                            paddingLeft: 6, paddingRight: 3, minWidth: 70
                          }}
                          title={addr.isDefault ? "Current Default" : "Set Default"}
                        >
                          {addr.isDefault ? "Default" : "Set Default"}
                        </button>
                      </div>
                    </div>
                    <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#5A5048", lineHeight: 1.7 }}>
                      {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}<br />
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                ))
              )}
              <motion.button
                whileHover={{ background: "#1A1612", color: "#FAF8F4" }}
                style={{
                  background: "transparent",
                  border: "1.5px solid #1A1612",
                  color: "#1A1612",
                  padding: "11px 24px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  fontFamily: "'DM Sans'",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  marginTop: 10
                }}
                onClick={() => {
                  setEditAddress(null);
                  setShowAddressModal(true);
                }}
              >
                <FiPlus style={{ marginRight: 7 }} /> ADD NEW ADDRESS
              </motion.button>
              <AnimatePresence>
                {showAddressModal && (
                  <AddressModal
                    key={editAddress?._id || "new"}
                    onClose={() => { setShowAddressModal(false); setEditAddress(null); }}
                    initial={editAddress}
                    onSave={editAddress ? handleUpdateAddress : handleAddAddress}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────
export function Orders({ navigate, inline }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderAPI.myOrders();
      setOrders(data.orders || []);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleCancel = async (orderId) => {
    try {
      await orderAPI.cancel(orderId, "Cancelled by customer");
      fetchOrders();
    } catch (e) { alert(e.message); }
  };

  const handleReturn = async (orderId) => {
    try {
      await orderAPI.return(orderId, "Return requested by customer");
      fetchOrders();
    } catch (e) { alert(e.message); }
  };

  const statusColor = { delivered: "#2C6E49", shipped: "#B8922A", out_for_delivery: "#B8922A", processing: "#C4622D", confirmed: "#C4622D", pending: "#8C7B6B", cancelled: "#8C7B6B", return_initiated: "#7A3F7A", returned: "#7A3F7A" };

  const s = {
    page: { background: "#FAF8F4", minHeight: "100vh", paddingTop: 80 },
    inner: { maxWidth: 900, margin: "0 auto", padding: "40px 40px 80px" },
    orderCard: { background: "#FFF", borderRadius: 10, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(26,22,18,0.06)", display: "flex", gap: 20, alignItems: "flex-start" },
    img: { width: 72, height: 88, borderRadius: 6, objectFit: "cover", flexShrink: 0, background: "#EEE8DE" },
    info: { flex: 1 },
    orderId: { fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14, color: "#1A1612", marginBottom: 4 },
    date: { fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B", marginBottom: 8 },
    items: { fontFamily: "'DM Sans'", fontSize: 12, color: "#5A5048", marginBottom: 8 },
    statusBadge: (st) => ({ display: "inline-flex", alignItems: "center", gap: 6, background: `${statusColor[st] || "#8C7B6B"}15`, color: statusColor[st] || "#8C7B6B", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans'", letterSpacing: "0.08em" }),
    price: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#1A1612", textAlign: "right", marginBottom: 8 },
    actionBtn: { background: "none", border: "1px solid #E2D9CE", color: "#8C7B6B", padding: "6px 14px", borderRadius: 4, fontSize: 11, fontFamily: "'DM Sans'", cursor: "pointer", fontWeight: 600, letterSpacing: "0.08em", whiteSpace: "nowrap", marginBottom: 6 },
  };

  const OrderList = () => {
    if (loading) return <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#8C7B6B", padding: "24px 0" }}>Loading orders...</p>;
    if (error) return <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#C4622D", padding: "24px 0" }}>{error}</p>;
    if (!orders.length) return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <FiPackage size={40} color="#D4C9BC" style={{ marginBottom: 16 }} />
        <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#8C7B6B" }}>No orders yet. Go shop something!</p>
      </div>
    );
    return (
      <div>
        {orders.map(order => (
          <motion.div key={order._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={s.orderCard}>
            <div style={{ width: 72, height: 88, borderRadius: 6, background: "#EEE8DE", flexShrink: 0, overflow: "hidden" }}>
              {order.items[0]?.image
                ? <img src={order.items[0].image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><FiPackage size={20} color="#C9C0B6" /></div>
              }
            </div>
            <div style={s.info}>
              <p style={s.orderId}>#{order._id.slice(-8).toUpperCase()}</p>
              <p style={s.date}>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              <p style={s.items}>{order.items.map(i => i.name).join(", ")}</p>
              <span style={s.statusBadge(order.status)}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor[order.status] || "#8C7B6B" }} />
                {order.status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              </span>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={s.price}>Rs. {order.total?.toLocaleString()}</p>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexDirection: "column" }}>
                {["pending", "confirmed", "processing"].includes(order.status) && (
                  <button style={s.actionBtn} onClick={() => handleCancel(order._id)}>Cancel</button>
                )}
                {order.status === "delivered" && (
                  <button style={{ ...s.actionBtn, borderColor: "#C4622D", color: "#C4622D" }} onClick={() => handleReturn(order._id)}>Return</button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  if (inline) return <OrderList />;

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(24px,3vw,36px)", color: "#1A1612", marginBottom: 8 }}>My Orders</h1>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B", marginBottom: 32 }}>{orders.length} orders placed</p>
        <OrderList />
      </div>
    </div>
  );
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
// The Wishlist component is now only for full-page use; the left-panel Profile view renders it inline.
export function Wishlist({ wishlist, toggleWishlist, addToCart, navigate, allProducts }) {
  const wishlistProducts = allProducts.filter(p => wishlist.includes(p.id) || wishlist.includes(p._id));

  const s = {
    page: { background: "#FAF8F4", minHeight: "100vh", paddingTop: 80 },
    inner: { maxWidth: 1200, margin: "0 auto", padding: "40px 40px 80px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 },
    card: { background: "#FFF", borderRadius: 12, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 8px rgba(26,22,18,0.06)" },
    imgWrap: { position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#EEE8DE" },
    price: { fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14, color: "#C4622D" },
    name: { fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 15, color: "#1A1612", marginBottom: 6 },
  };

  if (!wishlistProducts.length) return (
    <div style={s.page}>
      <div style={{ ...s.inner, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
        <div style={{ textAlign: "center" }}>
          <FiHeart size={48} color="#D4C9BC" style={{ marginBottom: 16 }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24, color: "#1A1612", marginBottom: 8 }}>Your wishlist is empty</h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#8C7B6B", marginBottom: 24 }}>Save items you love to buy them later</p>
          <motion.button whileHover={{ background: "#C4622D" }}
            style={{ background: "#1A1612", color: "#FAF8F4", border: "none", padding: "13px 28px", borderRadius: 6, fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer", fontFamily: "'DM Sans'", transition: "background 0.2s" }}
            onClick={() => navigate("products")}>
            EXPLORE PRODUCTS
          </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(24px,3vw,36px)", color: "#1A1612", marginBottom: 8 }}>My Wishlist</h1>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8C7B6B", marginBottom: 32 }}>{wishlistProducts.length} saved items</p>
        <div style={s.grid}>
          {wishlistProducts.map((p, i) => (
            <motion.div key={p.id || p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={s.card} onClick={() => navigate("product", p)}>
              <div style={s.imgWrap}>
                <img src={p.image || p.images?.[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <button style={{ position: "absolute", top: 12, right: 12, background: "#FFF", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none" }}
                  onClick={e => { e.stopPropagation(); toggleWishlist(p.id || p._id); }}>
                  <FiHeart size={15} fill="#C4622D" color="#C4622D" />
                </button>
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                <p style={s.name}>{p.name}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={s.price}>Rs. {p.price?.toLocaleString()}</span>
                  <motion.button whileHover={{ background: "#C4622D" }}
                    style={{ background: "#1A1612", color: "#FAF8F4", border: "none", padding: "7px 14px", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", letterSpacing: "0.1em", transition: "background 0.2s" }}
                    onClick={e => { e.stopPropagation(); addToCart(p); }}>
                    ADD TO CART
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}