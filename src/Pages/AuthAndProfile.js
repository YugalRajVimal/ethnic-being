
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiPackage, FiHeart, FiMapPin, FiLogOut, FiCheck } from "react-icons/fi";
import { authAPI, orderAPI } from "./api";

// ─── ORDER SUCCESS ────────────────────────────────────────────────────────────
export function OrderSuccess({ navigate, lastOrder }) {
  return (
    <div className="bg-[#FAF8F4] min-h-screen pt-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl px-4 py-10 sm:px-8 max-w-md w-full mx-4 text-center shadow-[0_4px_32px_rgba(26,22,18,0.1)]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-[#2C6E49] flex items-center justify-center mx-auto mb-7"
        >
          <FiCheck size={36} color="#FFF" />
        </motion.div>
        <h1 className="font-serif font-bold text-2xl md:text-3xl text-[#1A1612] mb-3">
          Order Placed!
        </h1>
        <p className="font-garamond italic text-lg text-[#8C7B6B] mb-2">Thank you for shopping with EthnicBeing</p>
        <p className="font-sans text-sm text-[#8C7B6B] mb-8 leading-relaxed">
          Your order has been confirmed and will be shipped within 2 business days.
          <br />
          You'll receive a tracking link on your email.
        </p>
        <div className="bg-[#F5F0E8] rounded-lg py-4 px-5 mb-8 text-left">
          <p className="font-sans font-semibold text-xs text-[#8C7B6B] tracking-wider mb-2">ORDER DETAILS</p>
          <p className="font-sans text-sm text-[#1A1612]">
            {lastOrder?.orderId
              ? `Order #${lastOrder.orderId}`
              : `Order #EB${Date.now().toString().slice(-6)}`}
          </p>
          <p className="font-sans text-sm text-[#8C7B6B] mt-1">Estimated delivery: 5–7 business days</p>
          {lastOrder?.address && (
            <p className="font-sans text-sm text-[#8C7B6B] mt-1">
              Delivering to: {lastOrder.address.city}, {lastOrder.address.state}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ background: "#C4622D" }}
            className="flex-1 bg-[#1A1612] hover:bg-[#C4622D] text-[#FAF8F4] border-none py-3 text-xs font-semibold tracking-wider cursor-pointer rounded-md font-sans transition-colors"
            onClick={() => navigate("orders")}
          >
            TRACK ORDER
          </motion.button>
          <motion.button
            whileHover={{ background: "#1A1612", color: "#FAF8F4" }}
            className="flex-1 bg-transparent hover:bg-[#1A1612] hover:text-[#FAF8F4] text-[#1A1612] border border-[#1A1612] py-3 text-xs font-semibold tracking-wider cursor-pointer rounded-md font-sans transition-colors"
            onClick={() => navigate("home")}
          >
            CONTINUE SHOPPING
          </motion.button>
        </div>
      </motion.div>
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

  // Forgot password flow states
  const [fpMode, setFpMode] = useState(false); // "forgot" | "otp" | false
  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [fpStep, setFpStep] = useState(1); // 1=email, 2=otp, 3=reset
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMsg, setFpMsg] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      let data;
      if (mode === "login") {
        data = await authAPI.login({ email: form.email, password: form.password });
      } else {
        data = await authAPI.register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
      }
      if (data.token) localStorage.setItem("eb_token", data.token);
      login(data.user || { name: form.name || "Guest User", email: form.email });
      navigate("profile");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("Google sign-in requires OAuth configuration.");
  };

  const handleForgotPw = async () => {
    setFpLoading(true);
    setFpMsg("");
    try {
      await authAPI.forgotPw({ email: fpEmail });
      setFpMsg("OTP sent to your email.");
      setFpStep(2);
    } catch (err) {
      setFpMsg(err.message || "Failed to send OTP.");
    } finally {
      setFpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setFpLoading(true);
    setFpMsg("");
    try {
      await authAPI.verifyOtp({ email: fpEmail, otp });
      setFpMsg("OTP verified! Set your new password.");
      setFpStep(3);
    } catch (err) {
      setFpMsg(err.message || "Invalid OTP.");
    } finally {
      setFpLoading(false);
    }
  };

  const handleResetPw = async () => {
    setFpLoading(true);
    setFpMsg("");
    try {
      await authAPI.resetPw({ email: fpEmail, otp, newPassword: newPw });
      setFpMsg("Password reset! Please login.");
      setTimeout(() => {
        setFpMode(false);
        setFpStep(1);
        setMode("login");
      }, 1500);
    } catch (err) {
      setFpMsg(err.message || "Reset failed.");
    } finally {
      setFpLoading(false);
    }
  };

  // ── Forgot Password Modal ──
  if (fpMode) {
    return (
      <div className="bg-[#FAF8F4] min-h-screen pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl py-12 px-4 sm:px-12 max-w-md w-full mx-4 shadow-lg"
        >
          <p className="font-serif font-black text-2xl text-[#1A1612] tracking-wide text-center mb-2">
            Ethnic<span className="text-[#C4622D]">Being</span>
          </p>
          <p className="font-garamond italic text-base text-[#8C7B6B] text-center mb-8">
            {fpStep === 1
              ? "Forgot your password?"
              : fpStep === 2
              ? "Enter the OTP sent to your email"
              : "Set a new password"}
          </p>
          {fpMsg && (
            <p
              className={
                (fpStep === 3 && fpMsg.includes("reset")) ||
                fpMsg.includes("sent") ||
                fpMsg.includes("verified")
                  ? "bg-[#F0F7F2] border border-[#2C6E49] rounded-md py-2 px-4 font-sans text-sm text-[#2C6E49] mb-4"
                  : "bg-[#FFF0EC] border border-[#C4622D] rounded-md py-2 px-4 font-sans text-sm text-[#C4622D] mb-4"
              }
            >
              {fpMsg}
            </p>
          )}
          {fpStep === 1 && (
            <>
              <div className="mb-4 relative">
                <label className="font-sans font-semibold text-xs tracking-wider text-[#8C7B6B] mb-2 block">EMAIL</label>
                <input
                  className="w-full bg-[#F5F0E8] border border-[#E2D9CE] py-3 pl-3 pr-10 rounded-md text-sm font-sans text-[#1A1612] outline-none"
                  placeholder="arjun@email.com"
                  value={fpEmail}
                  onChange={e => setFpEmail(e.target.value)}
                />
                <FiMail size={15} className="absolute right-3 top-9 text-[#8C7B6B]" />
              </div>
              <motion.button
                className="w-full bg-[#1A1612] text-[#FAF8F4] border-none py-3 text-sm font-semibold tracking-wider cursor-pointer rounded-md font-sans mt-2 transition-colors hover:bg-[#C4622D]"
                whileHover={{ background: "#C4622D" }}
                onClick={handleForgotPw}
                disabled={fpLoading}
              >
                {fpLoading ? "SENDING OTP..." : "SEND OTP"}
              </motion.button>
            </>
          )}
          {fpStep === 2 && (
            <>
              <div className="mb-4 relative">
                <label className="font-sans font-semibold text-xs tracking-wider text-[#8C7B6B] mb-2 block">OTP</label>
                <input
                  className="w-full bg-[#F5F0E8] border border-[#E2D9CE] py-3 pl-3 pr-10 rounded-md text-sm font-sans text-[#1A1612] outline-none"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>
              <motion.button
                className="w-full bg-[#1A1612] text-[#FAF8F4] border-none py-3 text-sm font-semibold tracking-wider cursor-pointer rounded-md font-sans mt-2 transition-colors hover:bg-[#C4622D]"
                whileHover={{ background: "#C4622D" }}
                onClick={handleVerifyOtp}
                disabled={fpLoading}
              >
                {fpLoading ? "VERIFYING..." : "VERIFY OTP"}
              </motion.button>
            </>
          )}
          {fpStep === 3 && (
            <>
              <div className="mb-4 relative">
                <label className="font-sans font-semibold text-xs tracking-wider text-[#8C7B6B] mb-2 block">NEW PASSWORD</label>
                <input
                  className="w-full bg-[#F5F0E8] border border-[#E2D9CE] py-3 pl-3 pr-10 rounded-md text-sm font-sans text-[#1A1612] outline-none"
                  type="password"
                  placeholder="••••••••"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                />
                <FiLock size={15} className="absolute right-3 top-9 text-[#8C7B6B]" />
              </div>
              <motion.button
                className="w-full bg-[#1A1612] text-[#FAF8F4] border-none py-3 text-sm font-semibold tracking-wider cursor-pointer rounded-md font-sans mt-2 transition-colors hover:bg-[#C4622D]"
                whileHover={{ background: "#C4622D" }}
                onClick={handleResetPw}
                disabled={fpLoading}
              >
                {fpLoading ? "RESETTING..." : "RESET PASSWORD"}
              </motion.button>
            </>
          )}

          <button
            onClick={() => {
              setFpMode(false);
              setFpStep(1);
              setFpMsg("");
            }}
            className="w-full bg-none border-none text-[#8C7B6B] font-sans text-xs cursor-pointer mt-4 py-2"
          >
            ← Back to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F4] min-h-screen pt-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl px-4 py-12 sm:px-12 max-w-md w-full mx-4 shadow-lg"
      >
        <p className="font-serif font-black text-2xl text-[#1A1612] tracking-wide text-center mb-2">
          Ethnic<span className="text-[#C4622D]">Being</span>
        </p>
        <p className="font-garamond italic text-base text-[#8C7B6B] text-center mb-8">
          {mode === "login" ? "Welcome back" : "Join the tribe"}
        </p>
        <div className="flex mb-7 border border-[#E2D9CE] rounded-lg overflow-hidden">
          <button
            className={`flex-1 py-2 font-sans font-semibold text-sm cursor-pointer transition-colors ${
              mode === "login" ? "bg-[#1A1612] text-[#FAF8F4]" : "bg-transparent text-[#8C7B6B]"
            }`}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-sans font-semibold text-sm cursor-pointer transition-colors ${
              mode === "register" ? "bg-[#1A1612] text-[#FAF8F4]" : "bg-transparent text-[#8C7B6B]"
            }`}
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            Register
          </button>
        </div>

        {error && <p className="bg-[#FFF0EC] border border-[#C4622D] rounded-md py-2 px-4 font-sans text-sm text-[#C4622D] mb-4">{error}</p>}

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {mode === "register" && (
              <div className="mb-4 relative">
                <label className="font-sans font-semibold text-xs tracking-wider text-[#8C7B6B] mb-2 block">
                  FULL NAME
                </label>
                <input
                  className="w-full bg-[#F5F0E8] border border-[#E2D9CE] py-3 pl-3 pr-10 rounded-md text-sm font-sans text-[#1A1612] outline-none"
                  placeholder="Arjun Sharma"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
                <FiUser size={15} className="absolute right-3 top-9 text-[#8C7B6B]" />
              </div>
            )}
            <div className="mb-4 relative">
              <label className="font-sans font-semibold text-xs tracking-wider text-[#8C7B6B] mb-2 block">
                EMAIL
              </label>
              <input
                className="w-full bg-[#F5F0E8] border border-[#E2D9CE] py-3 pl-3 pr-10 rounded-md text-sm font-sans text-[#1A1612] outline-none"
                placeholder="arjun@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              <FiMail size={15} className="absolute right-3 top-9 text-[#8C7B6B]" />
            </div>
            {mode === "register" && (
              <div className="mb-4 relative">
                <label className="font-sans font-semibold text-xs tracking-wider text-[#8C7B6B] mb-2 block">
                  PHONE
                </label>
                <input
                  className="w-full bg-[#F5F0E8] border border-[#E2D9CE] py-3 pl-3 pr-10 rounded-md text-sm font-sans text-[#1A1612] outline-none"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
                <FiPhone size={15} className="absolute right-3 top-9 text-[#8C7B6B]" />
              </div>
            )}
            <div className="mb-2 relative">
              <label className="font-sans font-semibold text-xs tracking-wider text-[#8C7B6B] mb-2 block">
                PASSWORD
              </label>
              <input
                className="w-full bg-[#F5F0E8] border border-[#E2D9CE] py-3 pl-3 pr-10 rounded-md text-sm font-sans text-[#1A1612] outline-none"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
              <button
                className="absolute right-3 top-9 bg-none border-none cursor-pointer p-0"
                type="button"
                tabIndex={-1}
                onClick={() => setShowPw(p => !p)}
              >
                {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
            {mode === "login" && (
              <p
                className="font-sans text-xs text-[#C4622D] text-right cursor-pointer mt-[-8px] mb-3"
                onClick={() => {
                  setFpMode(true);
                  setFpEmail(form.email);
                }}
              >
                Forgot password?
              </p>
            )}
            <motion.button
              className="w-full bg-[#1A1612] hover:bg-[#C4622D] text-[#FAF8F4] border-none py-3 text-sm font-semibold tracking-wider cursor-pointer rounded-md font-sans transition-colors"
              whileHover={{ background: "#C4622D" }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "PLEASE WAIT..."
                : mode === "login"
                ? "LOGIN"
                : "CREATE ACCOUNT"}
            </motion.button>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#E2D9CE]" />
          <span className="font-sans text-xs text-[#B0A090]">OR</span>
          <div className="flex-1 h-px bg-[#E2D9CE]" />
        </div>
        <button
          className="w-full bg-white border border-[#E2D9CE] py-3 text-sm font-medium cursor-pointer rounded-md font-sans text-[#1A1612] flex items-center justify-center gap-2"
          onClick={handleGoogleAuth}
        >
          <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.4 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.4 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.4 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.2C9.6 39.6 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.1 5.5l6.2 5.2C37.9 40.8 44 36 44 24c0-1.3-.1-2.7-.4-3.9z"/></svg>
          Continue with Google
        </button>
      </motion.div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
export function Profile({ user, navigate, logout, setUser }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: user?.dob || "",
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  if (!user) {
    navigate("auth");
    return null;
  }

  const TABS = [
    { id: "overview", label: "Overview", icon: <FiUser size={15} /> },
    { id: "orders", label: "My Orders", icon: <FiPackage size={15} /> },
    { id: "addresses", label: "Addresses", icon: <FiMapPin size={15} /> },
  ];

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (_) {}
    localStorage.removeItem("eb_token");
    logout();
    navigate("home");
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const data = await fetch(`${require("./api").API}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("eb_token")}`,
        },
        body: JSON.stringify(profileForm),
      }).then(r => r.json());
      if (setUser) setUser(data.user || { ...user, ...profileForm });
      setSaveMsg("Profile updated successfully!");
    } catch (err) {
      setSaveMsg("Failed to save changes.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  return (
    <div className="bg-[#FAF8F4]  ">
      <div className="max-w-5xl mx-auto px-2 md:px-10 py-10 md:py-20 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
        <div className="bg-white rounded-xl p-6 shadow-lg h-fit ">
          <div
            className="w-18 h-18 rounded-full bg-gradient-to-tr from-[#C4622D] to-[#B8922A] flex items-center justify-center mx-auto mb-4 text-white font-serif font-bold text-2xl select-none"
            style={{ width: 72, height: 72 }}
          >
            {user.name?.[0] || "U"}
          </div>
          <p className="font-serif font-bold text-[18px] text-[#1A1612] text-center mb-1">{user.name}</p>
          <p className="font-sans text-xs text-[#8C7B6B] text-center mb-6">{user.email}</p>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 w-full rounded-md px-3 py-2 font-sans font-medium text-sm mb-1 text-left transition-colors ${
                activeTab === tab.id
                  ? "bg-[#1A1612] text-[#FAF8F4]"
                  : "bg-transparent text-[#5A5048]"
              }`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <div className="h-px bg-[#F0EBE3] my-3" />
          <button
            className="flex items-center gap-2 w-full rounded-md px-3 py-2 font-sans font-medium text-sm mb-1 bg-transparent text-[#C4622D] transition-colors"
            onClick={handleLogout}
            type="button"
          >
            <FiLogOut size={15} />
            Logout
          </button>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-8 shadow-lg">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-serif font-bold text-[22px] text-[#1A1612] mb-6">My Profile</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#F5F0E8] rounded-lg py-5 px-4 text-center">
                  <span className="font-serif font-bold text-2xl text-[#C4622D] block">—</span>
                  <p className="font-sans text-xs text-[#8C7B6B] mt-1 tracking-wide">ORDERS</p>
                </div>
                <div className="bg-[#F5F0E8] rounded-lg py-5 px-4 text-center">
                  <span className="font-serif font-bold text-2xl text-[#C4622D] block">—</span>
                  <p className="font-sans text-xs text-[#8C7B6B] mt-1 tracking-wide">WISHLIST</p>
                </div>
                <div className="bg-[#F5F0E8] rounded-lg py-5 px-4 text-center">
                  <span className="font-serif font-bold text-2xl text-[#C4622D] block">—</span>
                  <p className="font-sans text-xs text-[#8C7B6B] mt-1 tracking-wide">REVIEWS</p>
                </div>
              </div>
              {saveMsg && (
                <p
                  className={
                    saveMsg.includes("success")
                      ? "bg-[#F0F7F2] border border-[#2C6E49] rounded-md py-2 px-4 font-sans text-sm text-[#2C6E49] mb-4"
                      : "bg-[#FFF0EC] border border-[#C4622D] rounded-md py-2 px-4 font-sans text-sm text-[#C4622D] mb-4"
                  }
                >
                  {saveMsg}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-sans font-semibold text-xs tracking-wider text-[#8C7B6B] mb-2 block">FULL NAME</label>
                  <input
                    className="w-full bg-[#F5F0E8] border border-[#E2D9CE] py-3 px-3 rounded-md text-sm font-sans text-[#1A1612] outline-none mb-2"
                    value={profileForm.name}
                    onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="font-sans font-semibold text-xs tracking-wider text-[#8C7B6B] mb-2 block">EMAIL</label>
                  <input
                    className="w-full bg-[#F5F0E8] border border-[#E2D9CE] py-3 px-3 rounded-md text-sm font-sans text-[#1A1612] outline-none mb-2"
                    value={profileForm.email}
                    onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="font-sans font-semibold text-xs tracking-wider text-[#8C7B6B] mb-2 block">PHONE</label>
                  <input
                    className="w-full bg-[#F5F0E8] border border-[#E2D9CE] py-3 px-3 rounded-md text-sm font-sans text-[#1A1612] outline-none mb-2"
                    placeholder="Add phone number"
                    value={profileForm.phone}
                    onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="font-sans font-semibold text-xs tracking-wider text-[#8C7B6B] mb-2 block">DATE OF BIRTH</label>
                  <input
                    className="w-full bg-[#F5F0E8] border border-[#E2D9CE] py-3 px-3 rounded-md text-sm font-sans text-[#1A1612] outline-none mb-2"
                    type="date"
                    value={profileForm.dob}
                    onChange={e => setProfileForm(f => ({ ...f, dob: e.target.value }))}
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ background: "#C4622D" }}
                className="mt-4 bg-[#1A1612] hover:bg-[#C4622D] text-[#FAF8F4] border-none py-3 px-7 rounded-md text-xs font-semibold tracking-wider cursor-pointer font-sans transition-colors"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? "SAVING..." : "SAVE CHANGES"}
              </motion.button>
            </motion.div>
          )}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-serif font-bold text-[22px] text-[#1A1612] mb-6">My Orders</p>
              <Orders navigate={navigate} inline />
            </motion.div>
          )}
          {activeTab === "addresses" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-serif font-bold text-[22px] text-[#1A1612] mb-6">Saved Addresses</p>
              <div className="bg-[#F5F0E8] rounded-lg p-5 mb-3 border-2 border-[#C4622D]">
                <div className="flex justify-between mb-2">
                  <span className="font-sans font-bold text-xs text-[#C4622D] tracking-wider">HOME · DEFAULT</span>
                  <button className="bg-none border-none text-[#C4622D] font-sans text-xs cursor-pointer font-semibold">
                    Edit
                  </button>
                </div>
                <p className="font-sans text-sm text-[#5A5048] leading-relaxed">
                  {user.name}
                  <br />
                  123, Heritage Lane, Near Old Fort
                  <br />
                  New Delhi, Delhi - 110001
                  <br />+91 9876543210
                </p>
              </div>
              <motion.button
                whileHover={{ background: "#1A1612", color: "#FAF8F4" }}
                className="bg-transparent border border-[#1A1612] text-[#1A1612] py-3 px-6 rounded-md text-xs font-semibold tracking-wider cursor-pointer font-sans transition-colors hover:bg-[#1A1612] hover:text-[#FAF8F4]"
              >
                + ADD NEW ADDRESS
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────
export function Orders({ navigate, inline }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [returningId, setReturningId] = useState(null);

  useEffect(() => {
    orderAPI
      .myOrders()
      .then(data => setOrders(data.orders || data || []))
      .catch(err => setError(err.message || "Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async orderId => {
    if (!window.confirm("Cancel this order?")) return;
    setCancellingId(orderId);
    try {
      await orderAPI.cancel(orderId, "Customer requested cancellation");
      setOrders(prev =>
        prev.map(o =>
          o._id === orderId || o.id === orderId ? { ...o, status: "Cancelled" } : o
        )
      );
    } catch (err) {
      alert(err.message || "Could not cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  const handleReturn = async orderId => {
    if (!window.confirm("Request a return for this order?")) return;
    setReturningId(orderId);
    try {
      await orderAPI.return(orderId, "Customer requested return");
      setOrders(prev =>
        prev.map(o =>
          o._id === orderId || o.id === orderId ? { ...o, status: "Return Requested" } : o
        )
      );
    } catch (err) {
      alert(err.message || "Could not request return.");
    } finally {
      setReturningId(null);
    }
  };

  const statusColor = {
    Delivered: "#2C6E49",
    "In Transit": "#B8922A",
    Processing: "#C4622D",
    Cancelled: "#8C7B6B",
    "Return Requested": "#B8922A",
  };

  const OrderList = () => {
    if (loading)
      return (
        <p className="font-sans text-base text-[#8C7B6B] py-5">Loading orders…</p>
      );
    if (error)
      return (
        <p className="font-sans text-base text-[#C4622D] py-5">{error}</p>
      );
    if (!orders.length)
      return (
        <div className="text-center py-10">
          <p className="font-serif text-2xl text-[#1A1612] mb-2">No orders yet</p>
          <p className="font-sans text-sm text-[#8C7B6B]">
            Your order history will appear here.
          </p>
        </div>
      );

    return (
      <div>
        {orders.map(order => {
          const orderId = order._id || order.id;
          const itemNames =
            order.items
              ?.map(i => i.name || i.product?.name)
              .filter(Boolean)
              .join(", ") || "—";
          const thumbnail =
            order.items?.[0]?.image ||
            order.items?.[0]?.product?.images?.[0] ||
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=80&q=80";
          const dateStr = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : order.date || "—";
          const status = order.status || "Processing";
          const total = order.total || order.totalAmount || 0;

          return (
            <motion.div
              key={orderId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-5 mb-4 shadow-md flex flex-col md:flex-row gap-4 items-start md:items-center"
            >
              <img
                src={thumbnail}
                alt=""
                className="w-20 h-24 rounded-md object-cover flex-shrink-0 bg-[#EEE8DE]"
              />
              <div className="flex-1">
                <p className="font-sans font-bold text-sm text-[#1A1612] mb-1">
                  #{order.orderId || orderId}
                </p>
                <p className="font-sans text-xs text-[#8C7B6B] mb-2">{dateStr}</p>
                <p className="font-sans text-xs text-[#5A5048] mb-2">{itemNames}</p>
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold font-sans tracking-wide"
                  style={{
                    background: `${(statusColor[status] || "#8C7B6B")}15`,
                    color: statusColor[status] || "#8C7B6B",
                  }}
                >
                  <span
                    className="inline-block"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: statusColor[status] || "#8C7B6B",
                    }}
                  />
                  {status}
                </span>
              </div>
              <div className="text-right w-full md:w-fit flex flex-col items-end gap-2">
                <p className="font-serif font-bold text-lg text-[#1A1612] mb-1">
                  Rs. {total.toLocaleString()}
                </p>
                <div className="flex flex-col gap-2 justify-end w-full md:w-fit">
                  <button
                    className="border border-[#E2D9CE] text-[#8C7B6B] py-1.5 px-4 rounded font-sans font-semibold text-xs whitespace-nowrap hover:bg-[#F5F0E8] transition"
                    onClick={() => navigate("orders")}
                  >
                    Track Order
                  </button>
                  {status === "Processing" && (
                    <button
                      className="border border-[#8C7B6B] text-[#8C7B6B] py-1.5 px-4 rounded font-sans font-semibold text-xs whitespace-nowrap hover:bg-[#F5F0E8] transition"
                      onClick={() => handleCancel(orderId)}
                      disabled={cancellingId === orderId}
                    >
                      {cancellingId === orderId ? "Cancelling…" : "Cancel"}
                    </button>
                  )}
                  {status === "Delivered" && (
                    <button
                      className="border border-[#C4622D] text-[#C4622D] py-1.5 px-4 rounded font-sans font-semibold text-xs whitespace-nowrap hover:bg-[#FFF6F2] transition"
                      onClick={() => handleReturn(orderId)}
                      disabled={returningId === orderId}
                    >
                      {returningId === orderId ? "Requesting…" : "Return"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  if (inline) return <OrderList />;

  return (
    <div className="bg-[#FAF8F4] min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-2 md:px-10 py-10 md:py-20">
        <h1 className="font-serif font-bold text-2xl md:text-3xl text-[#1A1612] mb-2">
          My Orders
        </h1>
        <p className="font-sans text-sm text-[#8C7B6B] mb-8">
          {loading ? "Loading..." : `${orders.length} orders placed`}
        </p>
        <OrderList />
      </div>
    </div>
  );
}

// ─── WISHLIST ──────────────────────────────────────────────────────────────────
export function Wishlist({ wishlist, toggleWishlist, addToCart, navigate, allProducts }) {
  const wishlistProducts = allProducts.filter(p => wishlist.includes(p.id));

  if (!wishlistProducts.length)
    return (
      <div className="bg-[#FAF8F4] min-h-screen pt-20 flex items-center justify-center">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-center min-h-[50vh] px-4">
          <div className="text-center">
            <FiHeart size={48} color="#D4C9BC" className="mb-4 mx-auto" />
            <h2 className="font-serif font-bold text-2xl text-[#1A1612] mb-2">
              Your wishlist is empty
            </h2>
            <p className="font-sans text-base text-[#8C7B6B] mb-6">
              Save items you love to buy them later
            </p>
            <motion.button
              className="bg-[#1A1612] hover:bg-[#C4622D] text-[#FAF8F4] border-none py-3 px-7 rounded-md text-xs font-semibold tracking-wider cursor-pointer font-sans transition-colors"
              whileHover={{ background: "#C4622D" }}
              onClick={() => navigate("products")}
            >
              EXPLORE PRODUCTS
            </motion.button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="bg-[#FAF8F4] min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-2 md:px-10 py-10 md:py-20">
        <h1 className="font-serif font-bold text-2xl md:text-3xl text-[#1A1612] mb-2">
          My Wishlist
        </h1>
        <p className="font-sans text-sm text-[#8C7B6B] mb-8">
          {wishlistProducts.length} saved items
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl overflow-hidden cursor-pointer shadow-md flex flex-col"
              onClick={() => navigate("product", p)}
            >
              <div className="relative group aspect-[3/4] bg-[#EEE8DE]">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover block"
                />
                <button
                  className="absolute top-3 right-3 bg-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer border-none z-10"
                  onClick={e => {
                    e.stopPropagation();
                    toggleWishlist(p.id);
                  }}
                  tabIndex={-1}
                  type="button"
                >
                  <FiHeart size={15} fill="#C4622D" color="#C4622D" />
                </button>
              </div>
              <div className="px-4 py-2 flex-1 flex flex-col justify-between">
                <p className="font-serif font-semibold text-base text-[#1A1612] mb-1">
                  {p.name}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-sans font-bold text-[#C4622D] text-sm">
                    Rs. {p.price.toLocaleString()}
                  </span>
                  <motion.button
                    whileHover={{ background: "#C4622D" }}
                    className="bg-[#1A1612] hover:bg-[#C4622D] text-[#FAF8F4] border-none py-2 px-4 rounded text-xs font-semibold cursor-pointer font-sans tracking-wide transition-colors"
                    onClick={e => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                  >
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