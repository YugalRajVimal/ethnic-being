import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import {
  FiSearch, FiUser, FiShoppingBag, FiMenu, FiX,
  FiChevronLeft, FiChevronRight, FiInstagram, FiArrowRight
} from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";

// ─── SWIPER CSS (injected inline to keep single-file) ───────────────────────
const swiperCss = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cream: #F5F0E8;
  --warm-white: #FAF8F4;
  --charcoal: #1A1612;
  --deep-brown: #2C1F14;
  --terracotta: #C4622D;
  --gold: #B8922A;
  --muted: #8C7B6B;
  --light-muted: #D4C9BC;
  --border: #E2D9CE;
}

html { scroll-behavior: smooth; }
body { font-family: 'DM Sans', sans-serif; background: var(--warm-white); color: var(--charcoal); overflow-x: hidden; }

.swiper { width: 100%; }
.swiper-slide { flex-shrink: 0; }
.swiper-pagination-bullet { background: var(--charcoal) !important; opacity: 0.3 !important; width: 6px !important; height: 6px !important; }
.swiper-pagination-bullet-active { opacity: 1 !important; width: 24px !important; border-radius: 3px !important; background: var(--terracotta) !important; }
.swiper-button-next, .swiper-button-prev { display: none !important; }

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 20s linear infinite;
}
.marquee-track:hover { animation-play-state: paused; }
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.hero-swiper .swiper-slide { height: 100vh; min-height: 600px; }
.reels-swiper .swiper-slide { height: auto; }

@media (max-width: 768px) {
  .hero-swiper .swiper-slide { height: 90vh; }
}
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Home", "All Products", "Contact"];

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1600&q=90",
    tag: "New Drop",
    title: "Roots &\nRhythm",
    subtitle: "SS'26 Collection",
    cta: "Shop Now",
  },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=1600&q=90",
//     tag: "Limited Edition",
//     title: "Woven\nStories",
//     subtitle: "Heritage Print Series",
//     cta: "Explore",
//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600&q=90",
//     tag: "Bestseller",
//     title: "Soil &\nSoul",
//     subtitle: "Artisan Tee Series",
//     cta: "View Collection",
//   },
];

const BESTSELLERS = [
  {
    id: 1,
    name: "Mughal Garden Tee",
    price: "Rs. 1,849",
    original: "Rs. 2,299",
    tag: "SALE",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
  },
  {
    id: 2,
    name: "Indigo Block Print",
    price: "Rs. 1,499",
    original: "Rs. 2,499",
    tag: "SOLD OUT",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
  },
  {
    id: 3,
    name: "Tribal Geometry Tee",
    price: "Rs. 1,099",
    original: "Rs. 1,999",
    tag: "SALE",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
  },
  {
    id: 4,
    name: "Rangoli Oversized",
    price: "Rs. 1,299",
    original: "Rs. 2,199",
    tag: "SALE",
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
  },
  {
    id: 5,
    name: "Lotus Field Drop",
    price: "Rs. 1,649",
    original: "Rs. 2,399",
    tag: "SALE",
    image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80",
  },
  {
    id: 6,
    name: "Mirror Work Tee",
    price: "Rs. 999",
    original: "Rs. 1,799",
    tag: "SALE",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    id: 7,
    name: "Warli Art Print",
    price: "Rs. 1,149",
    original: "Rs. 1,899",
    tag: "SALE",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
  },
  {
    id: 8,
    name: "Paisley Wash Tee",
    price: "Rs. 1,349",
    original: "Rs. 2,099",
    tag: "SALE",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
  },
];

const FEATURE_SLIDE = {
  image: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=1400&q=90",
  tag: "Featured Drop",
  title: "The Heritage\nEdit",
  subtitle: "Each piece carries a story older than fashion. Wear your roots.",
};

const REELS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80",
    product: "Mughal Garden Tee",
    price: "Rs. 1,849",
    original: "Rs. 2,299",
    label: "Real Life Vs Website",
    isFeatured: false,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80",
    product: "Indigo Block Print",
    price: "Rs. 1,499",
    original: "Rs. 2,499",
    label: "",
    isFeatured: true,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80",
    product: "Tribal Geometry Tee",
    price: "Rs. 1,099",
    original: "Rs. 1,999",
    label: "Top Pick",
    isFeatured: false,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80",
    product: "Rangoli Oversized",
    price: "Rs. 2,899",
    original: "Rs. 1,999",
    label: "Milgyi vo classic tee",
    isFeatured: false,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=400&q=80",
    product: "Lotus Field Drop",
    price: "Rs. 2,199",
    original: "Rs. 1,299",
    label: "Street Style",
    isFeatured: false,
  },
];

const COLLECTIONS = [
  {
    id: 1,
    label: "T-SHIRTS",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
  },
  {
    id: 2,
    label: "SHIRTS",
    image: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80",
  },
  {
    id: 3,
    label: "HOODIES",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
  },
  {
    id: 4,
    label: "BOTTOMS",
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
  },
];

const FOOTER_LINKS = {
  Shop: ["Home", "All Products", "Contact"],
  "Customer Care": ["Orders", "Profile"],
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

// 1. Navbar
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(26,22,18,0.97)" : "#1A1612",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled ? "1px solid rgba(180,146,42,0.15)" : "none",
          transition: "all 0.3s ease",
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left links */}
        <div style={{ display: "flex", gap: 28, flex: 1 }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              style={{
                color: "#FAF8F4",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.05em",
                fontFamily: "'DM Sans', sans-serif",
                opacity: 0.85,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => e.target.style.opacity = 1}
              onMouseLeave={e => e.target.style.opacity = 0.85}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Logo */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: 22,
            color: "#FAF8F4",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            Ethnic<span style={{ color: "#C4622D" }}>Being</span>
          </span>
        </div>

        {/* Right icons */}
        <div style={{ display: "flex", gap: 20, flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
          {[FiSearch, FiUser, FiShoppingBag].map((Icon, i) => (
            <Icon
              key={i}
              size={20}
              color="#FAF8F4"
              style={{ cursor: "pointer", opacity: 0.85, transition: "opacity 0.2s" }}
              onMouseEnter={e => e.target.style.opacity = 1}
              onMouseLeave={e => e.target.style.opacity = 0.85}
            />
          ))}
        </div>
      </motion.nav>
    </>
  );
}

// 2. Hero Section
function HeroSection() {
  return (
    <section style={{ position: "relative", width: "100%" }} className="flex hero-swiper">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className=""
        loop
        style={{ width: "100%" }}
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden" }}>
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.55)",
                }}
              />
              {/* Gradient overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg, rgba(26,22,18,0.7) 0%, transparent 60%, rgba(196,98,45,0.15) 100%)",
              }} />

              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                justifyContent: "center",
                padding: "0 8%",
              }}>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    display: "inline-block",
                    background: "#C4622D",
                    color: "#FAF8F4",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    padding: "5px 14px",
                    borderRadius: 2,
                    width: "fit-content",
                    marginBottom: 20,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {slide.tag}
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    fontSize: "clamp(52px, 9vw, 110px)",
                    color: "#FAF8F4",
                    lineHeight: 1.0,
                    whiteSpace: "pre-line",
                    marginBottom: 16,
                  }}
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: 20,
                    color: "rgba(250,248,244,0.7)",
                    marginBottom: 36,
                  }}
                >
                  {slide.subtitle}
                </motion.p>

                <motion.a
                  href="#"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  whileHover={{ scale: 1.04, background: "#FAF8F4", color: "#1A1612" }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    background: "transparent",
                    border: "1.5px solid rgba(250,248,244,0.7)",
                    color: "#FAF8F4",
                    padding: "14px 32px",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    borderRadius: 2,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.25s ease",
                    width: "fit-content",
                  }}
                >
                  {slide.cta} <FiArrowRight size={14} />
                </motion.a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

// 3. Bestseller Section
function BestsellerSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{ padding: "72px 32px", background: "#FAF8F4" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 36 }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "clamp(22px, 3vw, 30px)",
            color: "#1A1612",
            letterSpacing: "0.04em",
          }}>
            BESTSELLER
          </h2>
          <a href="#" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: "#C4622D",
            textDecoration: "none",
            fontWeight: 500,
            letterSpacing: "0.05em",
            borderBottom: "1px solid currentColor",
          }}>
            View all
          </a>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
        }}>
          {BESTSELLERS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <div style={{
                position: "relative",
                borderRadius: 10,
                overflow: "hidden",
                aspectRatio: "3/4",
                background: "#EEE8DE",
              }}>
                <motion.img
                  src={item.image}
                  alt={item.name}
                  animate={{ scale: hovered === item.id ? 1.06 : 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{
                  position: "absolute", top: 12, left: 12,
                }}>
                  <span style={{
                    background: item.tag === "SOLD OUT" ? "#1A1612" : "#C4622D",
                    color: "#FAF8F4",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    padding: "4px 10px",
                    borderRadius: 2,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {item.tag}
                  </span>
                </div>

                <AnimatePresence>
                  {hovered === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{
                        position: "absolute", bottom: 12, left: 12, right: 12,
                      }}
                    >
                      <button style={{
                        width: "100%",
                        background: "#1A1612",
                        color: "#FAF8F4",
                        border: "none",
                        padding: "12px",
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        borderRadius: 4,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        Quick Add
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ padding: "12px 4px 0" }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: "#1A1612",
                  fontWeight: 500,
                  marginBottom: 4,
                }}>
                  {item.name}
                </p>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 600, color: "#1A1612" }}>
                    {item.price}
                  </span>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B", textDecoration: "line-through" }}>
                    {item.original}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. Feature Banner Section
function FeatureBanner() {
  return (
    <section style={{ padding: "0 32px 72px", background: "#FAF8F4" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            height: "clamp(400px, 55vw, 640px)",
          }}
        >
          <img
            src={FEATURE_SLIDE.image}
            alt="Feature"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5)" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(26,22,18,0.75) 30%, transparent 80%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "0 8%",
          }}>
            <span style={{
              fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#C4622D", marginBottom: 16,
            }}>
              {FEATURE_SLIDE.tag}
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "clamp(42px, 7vw, 90px)",
              color: "#FAF8F4",
              lineHeight: 1.05,
              whiteSpace: "pre-line",
              marginBottom: 16,
            }}>
              {FEATURE_SLIDE.title}
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 18,
              color: "rgba(250,248,244,0.75)",
              marginBottom: 32,
              maxWidth: 360,
            }}>
              {FEATURE_SLIDE.subtitle}
            </p>
            <motion.a
              href="#"
              whileHover={{ background: "#FAF8F4", color: "#1A1612" }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "#1A1612", border: "1.5px solid rgba(250,248,244,0.4)",
                color: "#FAF8F4", padding: "14px 32px",
                fontSize: 12, fontWeight: 600, letterSpacing: "0.15em",
                textTransform: "uppercase", textDecoration: "none",
                borderRadius: 4, fontFamily: "'DM Sans'",
                width: "fit-content", transition: "all 0.25s ease",
              }}
            >
              Shop now
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 5. Reels / Social Proof Carousel
// function ReelsSection() {
//   const prevRef = useRef(null);
//   const nextRef = useRef(null);
//   const swiperRef = useRef(null);

//   return (
//     <section style={{ padding: "72px 0", background: "#F5F0E8", overflow: "hidden" }} className="reels-swiper">
//       <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <h2 style={{
//           fontFamily: "'Playfair Display', serif",
//           fontWeight: 700, fontSize: "clamp(22px, 3vw, 30px)",
//           color: "#1A1612", letterSpacing: "0.04em",
//         }}>
//           AS SEEN IN THE WILD
//         </h2>
//         <div style={{ display: "flex", gap: 10 }}>
//           {[FiChevronLeft, FiChevronRight].map((Icon, i) => (
//             <button
//               key={i}
//               ref={i === 0 ? prevRef : nextRef}
//               onClick={() => i === 0 ? swiperRef.current?.slidePrev() : swiperRef.current?.slideNext()}
//               style={{
//                 width: 40, height: 40, borderRadius: "50%",
//                 background: "transparent", border: "1.5px solid #1A1612",
//                 cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
//                 transition: "all 0.2s",
//               }}
//               onMouseEnter={e => { e.currentTarget.style.background = "#1A1612"; e.currentTarget.querySelector("svg").style.color = "#FAF8F4"; }}
//               onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.querySelector("svg").style.color = "#1A1612"; }}
//             >
//               <Icon size={18} color="#1A1612" />
//             </button>
//           ))}
//         </div>
//       </div>

//       <div style={{ paddingLeft: 32 }}>
//         <Swiper
//           modules={[Navigation, Pagination]}
//           slidesPerView="auto"
//           spaceBetween={16}
//           centeredSlides={false}
//           pagination={{ clickable: true }}
//           navigation={{
//             prevEl: prevRef.current,
//             nextEl: nextRef.current,
//           }}
//           onSwiper={(swiper) => {
//             swiperRef.current = swiper;
//             // Patch navigation: allow dynamic assignment of refs after rendering
//             // See https://swiperjs.com/react/#custom-navigation
//             // setTimeout(() => {
//             //   if (
//             //     prevRef.current &&
//             //     nextRef.current &&
//             //     swiper.params.navigation
//             //   ) {
//             //     swiper.params.navigation.prevEl = prevRef.current;
//             //     swiper.params.navigation.nextEl = nextRef.current;
//             //     swiper.navigation.destroy();
//             //     swiper.navigation.init();
//             //     swiper.navigation.update();
//             //   }
//             // });
//           }}
//           style={{ paddingBottom: 40 }}
//         >
//           {REELS.map((reel, i) => (
//             <SwiperSlide key={reel.id} style={{ width: reel.isFeatured ? 320 : 240, flexShrink: 0 }}>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.1 }}
//                 style={{
//                   borderRadius: 12,
//                   overflow: "hidden",
//                   position: "relative",
//                   aspectRatio: reel.isFeatured ? "9/14" : "9/14",
//                   background: "#D4C9BC",
//                   transform: reel.isFeatured ? "scale(1.06)" : "scale(1)",
//                   transformOrigin: "center",
//                   zIndex: reel.isFeatured ? 2 : 1,
//                   boxShadow: reel.isFeatured ? "0 20px 60px rgba(26,22,18,0.25)" : "none",
//                 }}
//               >
//                 <img
//                   src={reel.image}
//                   alt={reel.product}
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 />
//                 <div style={{
//                   position: "absolute", inset: 0,
//                   background: "linear-gradient(to top, rgba(26,22,18,0.85) 0%, transparent 50%)",
//                 }} />
//                 {reel.label && (
//                   <div style={{
//                     position: "absolute", top: 12, left: 12,
//                     background: "rgba(26,22,18,0.7)",
//                     color: "#FAF8F4",
//                     fontSize: 10, fontWeight: 600,
//                     letterSpacing: "0.1em",
//                     padding: "4px 10px", borderRadius: 2,
//                     fontFamily: "'DM Sans'",
//                   }}>
//                     {reel.label}
//                   </div>
//                 )}
//                 <div style={{
//                   position: "absolute", bottom: 0, left: 0, right: 0,
//                   padding: 14,
//                   display: "flex", alignItems: "center", gap: 10,
//                 }}>
//                   <div style={{
//                     width: 36, height: 36, borderRadius: 6,
//                     overflow: "hidden", flexShrink: 0,
//                     border: "1.5px solid rgba(250,248,244,0.3)",
//                   }}>
//                     <img src={reel.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                   </div>
//                   <div>
//                     <p style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#FAF8F4" }}>
//                       {reel.product}
//                     </p>
//                     <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "rgba(250,248,244,0.6)" }}>
//                       <s>{reel.price}</s> {reel.original}
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </section>
//   );
// }


// 5. Reels / Social Proof Carousel
function ReelsSection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  return (
    <section  style={{ padding: "72px 0", background: "#F5F0E8", overflow: "hidden" }} className="reels-swiper">
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700, fontSize: "clamp(22px, 3vw, 30px)",
          color: "#1A1612", letterSpacing: "0.04em",
        }}>
          AS SEEN IN THE WILD
        </h2>
        <div style={{ display: "flex", gap: 10 }}>
          {[FiChevronLeft, FiChevronRight].map((Icon, i) => (
            <button
              key={i}
              ref={i === 0 ? prevRef : nextRef}
              onClick={() => i === 0 ? swiperRef.current?.slidePrev() : swiperRef.current?.slideNext()}
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "transparent", border: "1.5px solid #1A1612",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1A1612"; e.currentTarget.querySelector("svg").style.color = "#FAF8F4"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.querySelector("svg").style.color = "#1A1612"; }}
            >
              <Icon size={18} color="#1A1612" />
            </button>
          ))}
        </div>
      </div>

      <div style={{ paddingLeft: 32, overflowX: "auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            minHeight: 420,
            paddingBottom: 40,
            width: "max-content"
          }}
        >
          {REELS.map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                width: reel.isFeatured ? 320 : 240,
                borderRadius: 12,
                overflow: "hidden",
                position: "relative",
                aspectRatio: reel.isFeatured ? "9/14" : "9/14",
                background: "#D4C9BC",
                transform: reel.isFeatured ? "scale(1.06)" : "scale(1)",
                transformOrigin: "center",
                zIndex: reel.isFeatured ? 2 : 1,
                boxShadow: reel.isFeatured ? "0 20px 60px rgba(26,22,18,0.25)" : "none",
                flexShrink: 0
              }}
            >
              <img
                src={reel.image}
                alt={reel.product}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(26,22,18,0.85) 0%, transparent 50%)",
              }} />
              {reel.label && (
                <div style={{
                  position: "absolute", top: 12, left: 12,
                  background: "rgba(26,22,18,0.7)",
                  color: "#FAF8F4",
                  fontSize: 10, fontWeight: 600,
                  letterSpacing: "0.1em",
                  padding: "4px 10px", borderRadius: 2,
                  fontFamily: "'DM Sans'",
                }}>
                  {reel.label}
                </div>
              )}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: 14,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 6,
                  overflow: "hidden", flexShrink: 0,
                  border: "1.5px solid rgba(250,248,244,0.3)",
                }}>
                  <img src={reel.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#FAF8F4" }}>
                    {reel.product}
                  </p>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "rgba(250,248,244,0.6)" }}>
                    <s>{reel.price}</s> {reel.original}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}

// 6. Shop By Collection
function CollectionSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{ padding: "72px 32px", background: "#FAF8F4" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: "clamp(22px, 3vw, 30px)",
          color: "#1A1612",
          letterSpacing: "0.04em",
          marginBottom: 36,
        }}>
          SHOP BY COLLECTION
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}>
          {COLLECTIONS.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setHovered(col.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <div style={{
                borderRadius: 10,
                overflow: "hidden",
                aspectRatio: "1/1.1",
                position: "relative",
                background: "#EEE8DE",
              }}>
                <motion.img
                  src={col.image}
                  alt={col.label}
                  animate={{ scale: hovered === col.id ? 1.07 : 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: hovered === col.id
                    ? "rgba(26,22,18,0.35)"
                    : "rgba(26,22,18,0.1)",
                  transition: "background 0.3s",
                }} />
              </div>
              <p style={{
                fontFamily: "'DM Sans'",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.15em",
                color: "#1A1612",
                marginTop: 12,
                textAlign: "center",
              }}>
                {col.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 7. Marquee Banner
function MarqueeBanner() {
  const text = "RAW REAL RELENTLESS.";
  const repeated = Array(12).fill(text).join("  •  ");

  return (
    <div style={{
      background: "#1A1612",
      overflow: "hidden",
      padding: "18px 0",
      borderTop: "1px solid rgba(180,146,42,0.2)",
      borderBottom: "1px solid rgba(180,146,42,0.2)",
    }}>
      <div className="marquee-track">
        {[...Array(2)].map((_, j) => (
          <span key={j} style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 18,
            color: "#FAF8F4",
            letterSpacing: "0.1em",
            whiteSpace: "nowrap",
            paddingRight: 60,
          }}>
            {repeated}
          </span>
        ))}
      </div>
    </div>
  );
}

// 8. Footer
function Footer() {
  return (
    <footer style={{ background: "#1A1612", padding: "64px 32px 28px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 48, marginBottom: 48 }}>
          {/* Logo */}
          <div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: 28,
              color: "#FAF8F4",
              letterSpacing: "0.1em",
            }}>
              Ethnic<span style={{ color: "#C4622D" }}>Being</span>
            </span>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 14,
              color: "#8C7B6B",
              marginTop: 10,
              lineHeight: 1.6,
            }}>
              Wear your roots. Tell your story.
            </p>
            <div style={{ marginTop: 20 }}>
              <FaInstagram size={20} color="#8C7B6B" style={{ cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#C4622D"}
                onMouseLeave={e => e.target.style.color = "#8C7B6B"}
              />
            </div>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 64 }}>
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <p style={{
                  fontFamily: "'DM Sans'",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "#FAF8F4",
                  marginBottom: 16,
                  letterSpacing: "0.05em",
                }}>
                  {heading}
                </p>
                {links.map((link) => (
                  <a key={link} href="#" style={{
                    display: "block",
                    fontFamily: "'DM Sans'",
                    fontSize: 13,
                    color: "#8C7B6B",
                    textDecoration: "none",
                    marginBottom: 10,
                    transition: "color 0.2s",
                  }}
                    onMouseEnter={e => e.target.style.color = "#FAF8F4"}
                    onMouseLeave={e => e.target.style.color = "#8C7B6B"}
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <p style={{
              fontFamily: "'DM Sans'",
              fontWeight: 600,
              fontSize: 13,
              color: "#FAF8F4",
              marginBottom: 12,
              letterSpacing: "0.05em",
            }}>
              STAY IN THE LOOP
            </p>
            <div style={{ display: "flex", gap: 0, marginTop: 8 }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  background: "rgba(250,248,244,0.07)",
                  border: "1px solid rgba(250,248,244,0.15)",
                  borderRight: "none",
                  color: "#FAF8F4",
                  padding: "10px 14px",
                  fontSize: 12,
                  fontFamily: "'DM Sans'",
                  borderRadius: "4px 0 0 4px",
                  outline: "none",
                }}
              />
              <button style={{
                background: "#C4622D",
                border: "none",
                color: "#FAF8F4",
                padding: "10px 16px",
                cursor: "pointer",
                borderRadius: "0 4px 4px 0",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.1em",
                fontFamily: "'DM Sans'",
              }}>
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(250,248,244,0.08)",
          paddingTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B" }}>
            © 2026 ETHNICBEING. Powered by Shopify
          </p>
          <a href="#" style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8C7B6B", textDecoration: "none" }}>
            Terms and Policies
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ─────────────Home─────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <style>{swiperCss}</style>
      <Navbar />
      <main>
        <HeroSection />
        <BestsellerSection />
        <FeatureBanner />
        <ReelsSection />
        <CollectionSection />
        <MarqueeBanner />
      </main>
      <Footer />
    </>
  );
}