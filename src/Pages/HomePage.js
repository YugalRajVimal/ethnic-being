
import React from "react";
import { motion } from "framer-motion";
import {FiArrowRight} from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";

const HomePage = ({ navigate,PRODUCTS }) => {

  const bestsellers = PRODUCTS.slice(0, 8);


  return (
    <div style={{ background: "#FAF8F4" }}>

    {/* ── HERO ── */}
    <section
      style={{
        height: "100svh",
        minHeight: 500,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
      }}
      className="hero-section"
    >
      <img
        src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1600&q=90"
        alt="Hero"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.45)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(160deg, rgba(26,22,18,0.8) 0%, rgba(196,98,45,0.1) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          padding: "clamp(24px,6vw,80px) clamp(20px,8%,120px) clamp(40px,7vh,100px)",
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "inline-block",
            background: "#C4622D",
            color: "#FAF8F4",
            fontSize: "clamp(9px,1.2vw,11px)",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "5px 14px",
            borderRadius: 2,
            marginBottom: "clamp(12px,2vw,20px)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          New Drop
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: "clamp(44px, 10vw, 110px)",
            color: "#FAF8F4",
            lineHeight: 1.0,
            whiteSpace: "pre-line",
            marginBottom: "clamp(10px,1.5vw,16px)",
          }}
        >
          {"Roots &\nRhythm"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(15px,2.5vw,22px)",
            color: "rgba(250,248,244,0.75)",
            marginBottom: "clamp(24px,3vw,36px)",
          }}
        >
          SS'26 Collection
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ background: "#FAF8F4", color: "#1A1612" }}
          onClick={() => navigate("products")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            border: "1.5px solid rgba(250,248,244,0.7)",
            color: "#FAF8F4",
            padding: "clamp(11px,1.5vw,15px) clamp(20px,3vw,36px)",
            fontSize: "clamp(11px,1.2vw,13px)",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: 2,
            fontFamily: "'DM Sans', sans-serif",
            background: "transparent",
            transition: "all 0.25s",
          }}
        >
          Shop Now <FiArrowRight size={14} />
        </motion.button>
      </div>
      {/* Responsive height for small screens */}
      <style>{`
        @media (max-width: 600px) {
          .hero-section {
            height: 80vh !important;
            min-height: 360px !important;
          }
        }
      `}</style>
    </section>

    {/* ── MARQUEE ── */}
    <div style={{
      background: "#1A1612", overflow: "hidden",
      padding: "clamp(12px,2vw,18px) 0",
      borderTop: "1px solid rgba(180,146,42,0.2)",
      borderBottom: "1px solid rgba(180,146,42,0.2)",
    }}>
      <style>{`
        .marquee-track{display:flex;width:max-content;animation:marquee 20s linear infinite}
        .marquee-track:hover{animation-play-state:paused}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      `}</style>
      <div className="marquee-track">
        {[...Array(2)].map((_, j) => (
          <span key={j} style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(13px,1.8vw,18px)",
            color: "#FAF8F4", letterSpacing: "0.1em",
            whiteSpace: "nowrap", paddingRight: 60,
          }}>
            {Array(12).fill("RAW REAL RELENTLESS.").join("  •  ")}
          </span>
        ))}
      </div>
    </div>

    {/* ── BESTSELLERS ── */}
    <section style={{ padding: "clamp(40px,6vw,72px) clamp(16px,4vw,40px)", maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(20px,3vw,36px)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700,
            fontSize: "clamp(18px,3vw,30px)", color: "#1A1612", letterSpacing: "0.04em",
          }}>BESTSELLERS</h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            fontSize: "clamp(13px,1.5vw,16px)", color: "#8C7B6B", marginTop: 4,
          }}>The pieces everyone's reaching for</p>
        </div>
        <button onClick={() => navigate("products")} style={{
          fontFamily: "'DM Sans'", fontSize: "clamp(11px,1.2vw,13px)",
          fontWeight: 600, color: "#C4622D",
          background: "none", border: "none", cursor: "pointer",
          letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 6,
        }}>
          VIEW ALL <FiArrowRight size={12} />
        </button>
      </div>

      {/* Responsive grid: 1 → 2 → 3 → 4 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
        gap: "clamp(12px,2vw,20px)",
      }}>
        {bestsellers.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(26,22,18,0.12)" }}
            onClick={() => navigate("product", p)}
            style={{
              cursor: "pointer", background: "#FFF",
              borderRadius: 10, overflow: "hidden",
              boxShadow: "0 2px 8px rgba(26,22,18,0.06)",
            }}
          >
            <div style={{ aspectRatio: "3/4", background: "#EEE8DE", overflow: "hidden" }}>
              <img
                src={p.image} alt={p.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
            </div>
            <div style={{ padding: "clamp(10px,1.5vw,14px)" }}>
              <p style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 600,
                fontSize: "clamp(12px,1.2vw,14px)", color: "#1A1612", marginBottom: 6,
              }}>{p.name}</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: "clamp(12px,1.2vw,14px)", color: "#C4622D" }}>
                  Rs. {p.price.toLocaleString()}
                </span>
                <span style={{ fontFamily: "'DM Sans'", fontSize: "clamp(11px,1vw,12px)", color: "#B0A090", textDecoration: "line-through" }}>
                  Rs. {p.original.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* ── FEATURED BANNER ── */}
    <section style={{
      position: "relative",
      height: "clamp(280px,45vw,480px)",
      overflow: "hidden",
      margin: "0 clamp(12px,3vw,40px) clamp(40px,6vw,72px)",
      borderRadius: "clamp(10px,1.5vw,16px)",
    }}>
      <img
        src="https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=1400&q=90"
        alt="Featured"
        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5)" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,22,18,0.85) 0%, transparent 65%)" }} />
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "clamp(20px,5vw,64px)",
      }}>
        <span style={{
          fontFamily: "'DM Sans'", fontSize: "clamp(9px,1vw,11px)",
          color: "#C4622D", letterSpacing: "0.2em", fontWeight: 700,
          marginBottom: "clamp(10px,1.5vw,16px)", display: "block",
        }}>
          FEATURED DROP
        </span>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 900,
          fontSize: "clamp(28px,5vw,64px)", color: "#FAF8F4",
          lineHeight: 1.1, whiteSpace: "pre-line",
          marginBottom: "clamp(10px,1.5vw,20px)",
        }}>
          {"The Heritage\nEdit"}
        </h2>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          fontSize: "clamp(13px,1.8vw,18px)",
          color: "rgba(250,248,244,0.75)",
          maxWidth: 400, marginBottom: "clamp(20px,3vw,32px)",
        }}>
          Each piece carries a story older than fashion.
        </p>
        <motion.button
          whileHover={{ background: "#FAF8F4", color: "#1A1612" }}
          onClick={() => navigate("products")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            border: "1.5px solid rgba(250,248,244,0.7)",
            color: "#FAF8F4",
            padding: "clamp(10px,1.3vw,14px) clamp(18px,2.5vw,32px)",
            fontSize: "clamp(10px,1.1vw,13px)",
            fontWeight: 600, letterSpacing: "0.15em",
            cursor: "pointer", borderRadius: 2,
            fontFamily: "'DM Sans'", background: "transparent",
            width: "fit-content", transition: "all 0.25s",
          }}
        >
          EXPLORE THE EDIT <FiArrowRight size={14} />
        </motion.button>
      </div>
    </section>

    {/* ── COLLECTIONS ── */}
    <section style={{ padding: "0 clamp(16px,4vw,40px) clamp(40px,6vw,72px)", maxWidth: 1400, margin: "0 auto" }}>
      <h2 style={{
        fontFamily: "'Playfair Display', serif", fontWeight: 700,
        fontSize: "clamp(18px,3vw,30px)", color: "#1A1612",
        letterSpacing: "0.04em", marginBottom: "clamp(20px,3vw,36px)",
      }}>
        SHOP BY COLLECTION
      </h2>

      {/* 2 cols on mobile, 4 on desktop */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "clamp(10px,1.8vw,16px)",
      }}
        className="collections-grid"
      >
        {[
          { label: "T-SHIRTS", img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80" },
          { label: "SHIRTS",   img: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80" },
          { label: "HOODIES",  img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80" },
          { label: "BOTTOMS",  img: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80" },
        ].map((col, i) => (
          <motion.div
            key={col.label}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            onClick={() => navigate("products")}
            style={{ cursor: "pointer" }}
          >
            <div style={{ borderRadius: "clamp(8px,1.2vw,10px)", overflow: "hidden", aspectRatio: "1/1.1", background: "#EEE8DE", position: "relative" }}>
              <img
                src={col.img} alt={col.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
            </div>
            <p style={{
              fontFamily: "'DM Sans'", fontSize: "clamp(11px,1.2vw,13px)",
              fontWeight: 600, letterSpacing: "0.15em",
              color: "#1A1612", marginTop: "clamp(8px,1vw,12px)", textAlign: "center",
            }}>
              {col.label}
            </p>
          </motion.div>
        ))}
      </div>
      <style>{`@media(min-width:640px){ .collections-grid{ grid-template-columns: repeat(4,1fr) !important; } }`}</style>
    </section>

    {/* ── FOOTER ── */}
    <footer style={{ background: "#1A1612", padding: "clamp(40px,6vw,64px) clamp(16px,4vw,40px) clamp(20px,3vw,28px)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* Footer grid: stack on mobile, 3-col on desktop */}
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "clamp(32px,4vw,48px)", marginBottom: "clamp(32px,4vw,48px)" }}>
          {/* Brand */}
          <div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(22px,3vw,28px)", color: "#FAF8F4", letterSpacing: "0.1em" }}>
              Ethnic<span style={{ color: "#C4622D" }}>Being</span>
            </span>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(13px,1.3vw,14px)", color: "#8C7B6B", marginTop: 10, lineHeight: 1.6 }}>
              Wear your roots. Tell your story.
            </p>
            <div style={{ marginTop: 20 }}>
              <FaInstagram size={20} color="#8C7B6B" style={{ cursor: "pointer" }} />
            </div>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "clamp(32px,5vw,64px)", flexWrap: "wrap" }}>
            {[
              { h: "Shop", l: ["Home", "All Products", "Contact"] },
              { h: "Customer Care", l: ["Orders", "Profile", "Returns"] },
            ].map(({ h, l }) => (
              <div key={h}>
                <p style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: "clamp(12px,1.2vw,13px)", color: "#FAF8F4", marginBottom: 16, letterSpacing: "0.05em" }}>{h}</p>
                {l.map(link => (
                  <a key={link} href="#" style={{ display: "block", fontFamily: "'DM Sans'", fontSize: "clamp(12px,1.2vw,13px)", color: "#8C7B6B", textDecoration: "none", marginBottom: 10 }}>{link}</a>
                ))}
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <p style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: "clamp(12px,1.2vw,13px)", color: "#FAF8F4", marginBottom: 12, letterSpacing: "0.05em" }}>STAY IN THE LOOP</p>
            <div style={{ display: "flex", marginTop: 8 }}>
              <input
                type="email" placeholder="your@email.com"
                style={{
                  flex: 1, minWidth: 0,
                  background: "rgba(250,248,244,0.07)",
                  border: "1px solid rgba(250,248,244,0.15)", borderRight: "none",
                  color: "#FAF8F4", padding: "10px 14px",
                  fontSize: "clamp(11px,1.2vw,12px)", fontFamily: "'DM Sans'",
                  borderRadius: "4px 0 0 4px", outline: "none",
                }}
              />
              <button style={{
                background: "#C4622D", border: "none", color: "#FAF8F4",
                padding: "10px clamp(12px,1.5vw,16px)", cursor: "pointer",
                borderRadius: "0 4px 4px 0",
                fontSize: "clamp(11px,1.2vw,12px)", fontWeight: 600,
                letterSpacing: "0.1em", fontFamily: "'DM Sans'",
                whiteSpace: "nowrap",
              }}>
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(250,248,244,0.08)", paddingTop: "clamp(16px,2vw,24px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontFamily: "'DM Sans'", fontSize: "clamp(11px,1.1vw,12px)", color: "#8C7B6B" }}>© 2026 ETHNICBEING. All rights reserved.</p>
          <a href="#" style={{ fontFamily: "'DM Sans'", fontSize: "clamp(11px,1.1vw,12px)", color: "#8C7B6B", textDecoration: "none" }}>Terms and Policies</a>
        </div>
      </div>

      {/* Footer responsive grid */}
      <style>{`@media(min-width:768px){ .footer-grid{ grid-template-columns: 1fr 2fr 1fr !important; } }`}</style>
    </footer>
  </div>
  )
}

export default HomePage