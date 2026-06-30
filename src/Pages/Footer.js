import React, { useState } from "react";
import { FaInstagram, FaWhatsapp, FaTwitter, FaFacebook } from "react-icons/fa";

const Footer = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  // Updated menu links for UNLEASH CLUB
  const menuLinks = [
    { label: "HOME", page: "home" },
    { label: "SHOP", page: "shop" },
    { label: "COLLECTIONS", page: "collections" },
    { label: "ABOUT US", page: "about" },
    { label: "CONTACT", page: "contact" },
  ];

  // Updated customer care links for UNLEASH CLUB
  const customerCareLinks = [
    { label: "TRACK ORDER", page: "track-order" },
    { label: "SIZE GUIDE", page: "size-guide" },
    { label: "RETURNS & EXCHANGES", page: "returns" },
    { label: "FAQ", page: "faq" },
    { label: "CONTACT US", page: "contact" },
  ];

  // Updated socialLinks for UNLEASH CLUB (using Facebook and updating hrefs)
  const socialLinks = [
    { icon: <FaInstagram size={20} />, href: "https://instagram.com/ethnicbeing", label: "Instagram" },
    { icon: <FaWhatsapp size={20} />, href: "https://wa.me/919999999999", label: "WhatsApp" },
    { icon: <FaFacebook size={20} />, href: "https://facebook.com/ethnicbeing", label: "Facebook" },
    { icon: <FaTwitter size={20} />, href: "https://twitter.com/ethnicbeing", label: "Twitter" },
  ];

  return (
    <footer style={{ background: "#000", color: "#fff", borderTop: "1px solid rgba(255,255,255,0.08)" }}>

      {/* ── TOP SECTION ── */}
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "clamp(48px,7vw,80px) clamp(16px,5vw,60px) clamp(32px,4vw,48px)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "clamp(36px,5vw,60px)",
      }}
        className="ll-footer-grid"
      >

        {/* Menu */}
        <div>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            fontSize: "clamp(13px,1.2vw,14px)", letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.45)", marginBottom: 20,
          }}>
            MENU
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {menuLinks.map(l => (
              <button
                key={l.label}
                onClick={() => navigate && navigate(l.page)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#fff", fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600, fontSize: "clamp(14px,1.3vw,16px)",
                  letterSpacing: "0.1em", textAlign: "left",
                  padding: 0, transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#d88b08"}
                onMouseLeave={e => e.currentTarget.style.color = "#fff"}
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Customer Care */}
        <div>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            fontSize: "clamp(13px,1.2vw,14px)", letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.45)", marginBottom: 20,
          }}>
            CUSTOMER CARE
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {customerCareLinks.map(({ label, page }) => (
              <button
                key={label}
                onClick={() => navigate && navigate(page)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#fff", fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600, fontSize: "clamp(14px,1.3vw,16px)",
                  letterSpacing: "0.1em", textAlign: "left", padding: 0,
                  transition: "color 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#d88b08"}
                onMouseLeave={e => e.currentTarget.style.color = "#fff"}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Newsletter + Socials */}
        <div>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            fontSize: "clamp(13px,1.2vw,14px)", letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.45)", marginBottom: 20,
          }}>
            STAY CONNECTED
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(13px,1.2vw,14px)",
            color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 20,
          }}>
            Subscribe for exclusive offers, early access, and traditional style inspiration.
          </p>

          {subscribed ? (
            <p style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
              fontSize: 15, color: "#d88b08", letterSpacing: "0.08em",
            }}>
              ✓ YOU'RE IN! CHECK YOUR INBOX.
            </p>
          ) : (
            <div style={{ display: "flex" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                placeholder="your@email.com"
                style={{
                  flex: 1, minWidth: 0,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)", borderRight: "none",
                  color: "#fff", padding: "11px 14px",
                  fontSize: "clamp(12px,1.1vw,13px)", fontFamily: "'DM Sans', sans-serif",
                  borderRadius: "2px 0 0 2px", outline: "none",
                }}
              />
              <button
                onClick={handleSubscribe}
                style={{
                  background: "#d88b08", border: "none", color: "#fff",
                  padding: "11px clamp(14px,1.8vw,20px)", cursor: "pointer",
                  borderRadius: "0 2px 2px 0",
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                  letterSpacing: "0.12em", fontSize: "clamp(12px,1.2vw,13px)",
                  whiteSpace: "nowrap", transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#a87501"}
                onMouseLeave={e => e.currentTarget.style.background = "#d88b08"}
              >
                SUBSCRIBE
              </button>
            </div>
          )}

          {/* Social Icons */}
          <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
            {socialLinks.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  color: "rgba(255,255,255,0.5)", transition: "color 0.2s",
                  display: "flex", alignItems: "center",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#d88b08"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── OVERSIZED BRAND NAME ── */}
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        padding: "0 clamp(16px,5vw,60px)",
        overflow: "hidden",
      }}>
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: "clamp(24px,4vw,48px)",
          paddingBottom: "clamp(8px,2vw,16px)",
        }}>
          <p style={{
            fontFamily: "'Barlow Condensed', 'Impact', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(64px, 18vw, 220px)",
            color: "#fff",
            lineHeight: 0.85,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "clip",
          }}>
            UNLEASH CLUB
          </p>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(18px,4.5vw,56px)",
            color: "#d88b08",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginTop: "clamp(4px,0.8vw,10px)",
          }}>
            THE ART OF INDIA
          </p>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "clamp(14px,2vw,20px) clamp(16px,5vw,60px)",
        maxWidth: 1400, margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(11px,1.1vw,13px)",
          color: "rgba(255,255,255,0.35)",
        }}>
          © 2026 UNLEASH CLUB. All rights reserved.
        </p>
        <a
          href="#"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(11px,1.1vw,13px)",
            color: "rgba(255,255,255,0.35)",
            textDecoration: "none", transition: "color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
        >
          Terms and Policies
        </a>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @media (max-width: 600px) {
          .ll-footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;