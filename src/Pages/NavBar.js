import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiShoppingBag, FiHeart, FiMenu, FiX } from "react-icons/fi";

const NavBar = ({ navigate, cartCount, wishlistCount, user }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
  
    useEffect(() => {
      const fn = () => setScrolled(window.scrollY > 40);
      window.addEventListener("scroll", fn);
      return () => window.removeEventListener("scroll", fn);
    }, []);
  
    // Lock body scroll when mobile menu open
    useEffect(() => {
      document.body.style.overflow = mobileOpen ? "hidden" : "";
      return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);
  
    const links = [
      { label: "Home", page: "home" },
      { label: "All Products", page: "products" },
      { label: "Contact", page: "home" },
    ];
  
    const IconBtn = ({ onClick, label, badge, children }) => (
      <button
        onClick={onClick}
        aria-label={label}
        style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "#FAF8F4", opacity: 0.9, padding: 6, display: "flex", alignItems: "center" }}
      >
        {children}
        {badge > 0 && (
          <span style={{
            position: "absolute", top: 0, right: 0,
            background: "#C4622D", color: "#fff",
            borderRadius: "50%", width: 16, height: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
          }}>{badge}</span>
        )}
      </button>
    );
  return (
    <>
        {/* ── MAIN NAV ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: 64,
          background: "rgba(26,22,18,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled ? "1px solid rgba(180,146,42,0.2)" : "1px solid transparent",
          transition: "border-color 0.3s",
        }}>
          <div
            className="main-nav-inner"
            style={{
              maxWidth: 1400,
              margin: "0 auto",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
            }}
          >
            {/* LEFT: Hamburger (mobile), Logo (mobile), Desktop links */}
            <div
              className="main-nav-left"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                style={{
                  display: "none",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#FAF8F4",
                  padding: 6,
                }}
                className="nav-hamburger"
              >
                <FiMenu size={22} />
              </button>
  
              {/* Logo — only visible on mobile */}
              <span
                className="nav-mobile-logo"
                onClick={() => navigate("home")}
                style={{
                  display: "none",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: "clamp(18px, 3vw, 24px)",
                  color: "#FAF8F4",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  userSelect: "none",
                  whiteSpace: "nowrap",
                  marginLeft: 8
                }}
              >
                Ethnic<span style={{ color: "#C4622D" }}>Being</span>
              </span>
  
              {/* Desktop links */}
              <div
                className="nav-desktop-links"
                style={{ display: "flex", gap: 28 }}
              >
                {links.map((l) => (
                  <button
                    key={l.label}
                    onClick={() => navigate(l.page)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#FAF8F4",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      opacity: 0.85,
                      transition: "opacity 0.2s, color 0.2s",
                      padding: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = 1;
                      e.target.style.color = "#C4622D";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = 0.85;
                      e.target.style.color = "#FAF8F4";
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
  
            {/* CENTER: Logo (desktop only, hidden on mobile) */}
            <div
              className="main-nav-center flex-1 flex justify-center"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                className="nav-desktop-logo"
                onClick={() => navigate("home")}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: "clamp(18px, 3vw, 24px)",
                  color: "#FAF8F4",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  userSelect: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Ethnic<span style={{ color: "#C4622D" }}>Being</span>
              </span>
            </div>
  
            {/* RIGHT: Icons */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 4,
              }}
            >
              <IconBtn
                onClick={() => navigate("wishlist")}
                label="Wishlist"
                badge={wishlistCount}
              >
                <FiHeart size={20} />
              </IconBtn>
              <IconBtn
                onClick={() => navigate(user ? "profile" : "auth")}
                label="Profile"
              >
                <FiUser size={20} />
              </IconBtn>
              <IconBtn
                onClick={() => navigate("cart")}
                label="Cart"
                badge={cartCount}
              >
                <FiShoppingBag size={20} />
              </IconBtn>
            </div>
          </div>
          {/* Responsive CSS via style tag: move the logo beside hamburger on small screens, hide desktop links/logo on small screens */}
          <style>
            {`
              @media (max-width: 768px) {
                .nav-hamburger {
                  display: inline-flex !important;
                }
                .nav-desktop-links {
                  display: none !important;
                }
                .nav-desktop-logo {
                  display: none !important;
                }
                .nav-mobile-logo {
                  display: inline !important;
                }
              }
              @media (min-width: 769px) {
                .nav-mobile-logo {
                  display: none !important;
                }
                .nav-desktop-logo {
                  display: inline !important;
                }
              }
            `}
          </style>
     
        </nav>
  
        {/* ── MOBILE DRAWER ── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileOpen(false)}
                style={{ position: "fixed", inset: 0, background: "#000", zIndex: 200 }}
              />
              {/* Drawer */}
              <motion.div
                key="drawer"
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  position: "fixed", top: 0, left: 0, bottom: 0,
                  width: "min(320px, 85vw)",
                  background: "rgba(20,17,13,0.99)",
                  zIndex: 201,
                  display: "flex", flexDirection: "column",
                  padding: "24px 28px",
                }}
              >
                {/* Drawer header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif", fontWeight: 900,
                    fontSize: 22, color: "#FAF8F4", letterSpacing: "0.1em",
                  }}>
                    Ethnic<span style={{ color: "#C4622D" }}>Being</span>
                  </span>
                  <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#FAF8F4", padding: 4 }}>
                    <FiX size={22} />
                  </button>
                </div>
  
                {/* Drawer nav links */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {links.map(l => (
                    <button key={l.label} onClick={() => { setMobileOpen(false); navigate(l.page); }} style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#FAF8F4", fontFamily: "'DM Sans', sans-serif",
                      fontSize: 18, fontWeight: 500, letterSpacing: "0.05em",
                      textAlign: "left", padding: "14px 0",
                      borderBottom: "1px solid rgba(250,248,244,0.07)",
                      opacity: 0.85, transition: "color 0.2s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = "#C4622D"}
                      onMouseLeave={e => e.currentTarget.style.color = "#FAF8F4"}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
  
                {/* Divider + action icons */}
                <div style={{ marginTop: "auto", paddingTop: 24, borderTop: "1px solid rgba(250,248,244,0.08)", display: "flex", gap: 16 }}>
                  <IconBtn onClick={() => { setMobileOpen(false); navigate("wishlist"); }} label="Wishlist" badge={wishlistCount}>
                    <FiHeart size={22} />
                  </IconBtn>
                  <IconBtn onClick={() => { setMobileOpen(false); navigate(user ? "profile" : "auth"); }} label="Profile">
                    <FiUser size={22} />
                  </IconBtn>
                  <IconBtn onClick={() => { setMobileOpen(false); navigate("cart"); }} label="Cart" badge={cartCount}>
                    <FiShoppingBag size={22} />
                  </IconBtn>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
  
        {/* Responsive style injected once */}
        <style>{`
          @media (max-width: 767px) {
            .nav-hamburger { display: flex !important; }
            .nav-desktop-links { display: none !important; }
          }
        `}</style>
      </>
  )
}

export default NavBar

