


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiShoppingBag, FiSearch, FiMenu, FiX } from "react-icons/fi";

const NavBar = ({ navigate, cartCount, wishlistCount, user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const links = [
    { label: "HOME", page: "home" },
    { label: "SHOP ALL", page: "products" },
    { label: "ABOUT US", page: "home" },
    { label: "CONTACT", page: "home" },
  ];

  const IconBtn = ({ onClick, label, badge, children }) => (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        position: "relative", background: "none", border: "none",
        cursor: "pointer", color: "#fff", padding: "6px 8px",
        display: "flex", alignItems: "center",
      }}
    >
      {children}
      {badge > 0 && (
        <span style={{
          position: "absolute", top: 2, right: 2,
          background: "#e8003d", color: "#fff",
          borderRadius: "50%", width: 15, height: 15,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 8, fontWeight: 700,
        }}>{badge}</span>
      )}
    </button>
  );

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      <div style={{
        background: "#fff", color: "#000",
        textAlign: "center", padding: "8px 16px",
        fontSize: "clamp(11px,1.3vw,13px)",
        fontFamily: "'Barlow Condensed', 'DM Sans', sans-serif",
        fontWeight: 600, letterSpacing: "0.06em",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 101,
      }}>
        GET 10% OFF ON PREPAID ORDERS
      </div>

      {/* ── MAIN NAV ── */}
      <nav style={{
        position: "fixed", top: 32, left: 0, right: 0, zIndex: 100,
        height: 56,
        background: "#000",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          maxWidth: 1400, margin: "0 auto", height: "100%",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 clamp(16px,3vw,32px)",
        }}>

          {/* LEFT: Logo (desktop) / Hamburger (mobile) */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="ll-hamburger"
              style={{
                display: "none", background: "none", border: "none",
                cursor: "pointer", color: "#fff", padding: 6,
              }}
            >
              <FiMenu size={22} />
            </button>

            {/* Desktop: bold brand logo on the left */}
            <span
              className="ll-desktop-logo"
              onClick={() => navigate("home")}
              style={{
                fontFamily: "'Barlow Condensed', 'Impact', sans-serif",
                fontWeight: 800, fontSize: "clamp(16px,1.8vw,20px)",
                color: "#fff", letterSpacing: "0.08em",
                cursor: "pointer", userSelect: "none", lineHeight: 1,
              }}
            >
              ETHNIC BEING
              {/* <span style={{ display: "block", color: "#e8003d", fontSize: "0.55em", letterSpacing: "0.15em", fontWeight: 700 }}>
                STREETWEAR CO.
              </span> */}
            </span>
          </div>

          {/* CENTER: Desktop Nav Links */}
          <div className="ll-desktop-links" style={{ display: "flex", gap: "clamp(16px,2.5vw,36px)", alignItems: "center" }}>
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => navigate(l.page)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#fff", fontFamily: "'Barlow Condensed', 'DM Sans', sans-serif",
                  fontSize: "clamp(12px,1.1vw,14px)", fontWeight: 600,
                  letterSpacing: "0.1em", padding: 0,
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.target.style.color = "#e8003d"}
                onMouseLeave={e => e.target.style.color = "#fff"}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* RIGHT: Icons */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0 }}>
            <IconBtn onClick={() => setSearchOpen(v => !v)} label="Search">
              <FiSearch size={18} />
            </IconBtn>
            <IconBtn onClick={() => navigate(user ? "profile" : "auth")} label="Account">
              <FiUser size={18} />
            </IconBtn>
            <IconBtn onClick={() => navigate("cart")} label="Cart" badge={cartCount}>
              <FiShoppingBag size={18} />
            </IconBtn>
          </div>
        </div>

        {/* Search Bar dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                background: "#111", borderBottom: "1px solid rgba(255,255,255,0.1)",
                padding: "12px clamp(16px,3vw,32px)",
              }}
            >
              <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", gap: 0 }}>
                <input
                  autoFocus
                  placeholder="Search products..."
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
                    borderRight: "none", color: "#fff", padding: "10px 14px",
                    fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                    borderRadius: "2px 0 0 2px", outline: "none",
                  }}
                />
                <button style={{
                  background: "#e8003d", border: "none", color: "#fff",
                  padding: "10px 18px", cursor: "pointer", borderRadius: "0 2px 2px 0",
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                  letterSpacing: "0.1em", fontSize: 13,
                }}>
                  SEARCH
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: "fixed", inset: 0, background: "#000", zIndex: 200 }}
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              style={{
                position: "fixed", top: 0, left: 0, bottom: 0,
                width: "min(300px, 85vw)",
                background: "#0a0a0a",
                zIndex: 201,
                display: "flex", flexDirection: "column",
                padding: "24px 28px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
                <span style={{
                  fontFamily: "'Barlow Condensed', 'Impact', sans-serif",
                  fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: "0.08em",
                }}>
                  ETHNIC BEING
                  {/* <span style={{ display: "block", color: "#e8003d", fontSize: "0.6em", letterSpacing: "0.15em", fontWeight: 700 }}>
                    STREETWEAR CO.
                  </span> */}
                </span>
                <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}>
                  <FiX size={22} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {links.map(l => (
                  <button key={l.label} onClick={() => { setMobileOpen(false); navigate(l.page); }} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#fff", fontFamily: "'Barlow Condensed', 'DM Sans', sans-serif",
                    fontSize: 20, fontWeight: 600, letterSpacing: "0.1em",
                    textAlign: "left", padding: "14px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    transition: "color 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = "#e8003d"}
                    onMouseLeave={e => e.currentTarget.style.color = "#fff"}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: "auto", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 12 }}>
                <IconBtn onClick={() => { setMobileOpen(false); navigate("cart"); }} label="Cart" badge={cartCount}>
                  <FiShoppingBag size={22} />
                </IconBtn>
                <IconBtn onClick={() => { setMobileOpen(false); navigate(user ? "profile" : "auth"); }} label="Account">
                  <FiUser size={22} />
                </IconBtn>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&display=swap');
        @media (max-width: 768px) {
          .ll-hamburger { display: flex !important; }
          .ll-desktop-links { display: none !important; }
          .ll-desktop-logo { display: none !important; }
        }
        @media (min-width: 769px) {
          .ll-hamburger { display: none !important; }
          .ll-desktop-logo { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default NavBar;