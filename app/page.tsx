"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "./hooks/useTranslation";
import { TranslationKey } from "../lib/translations";
import { LanguageCode, SUPPORTED_LANGUAGES } from "../lib/languages"; 
import { useLanguage } from "./providers";
import { SocialLinks } from "./components/SocialLinks"; 
// 1. Added useScroll and useSpring here
import { motion, useInView, animate, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { FaUsers, FaPenNib, FaUserCheck, FaPalette, FaLocationDot, FaStar, FaGoogle } from "react-icons/fa6";
import { LocationMap } from "./components/LocationMap";
import ScrollToTopButton from "./components/ScrollToTopButton";
import FloatingSocials from "./components/FloatingSocials";

const GOOGLE_REVIEW_URL = "https://g.page/r/CRIAbJ7AOfOPEBM/review";

// 2. Custom Smooth Tattoo Machine Cursor Component
const TattooMachineCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch screens for clean mobile accessibility
    if (window.matchMedia("(max-width: 1023px)").matches) return;

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") || 
        target.closest("button") || 
        target.closest("select") || 
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 48,
        height: 48,
        pointerEvents: "none",
        zIndex: 99999,
        x: position.x,
        y: position.y,
        // Ensures the very tip of the needle at (0,0) matches the real cursor hotspot
        transform: "translate(0px, 0px)", 
      }}
      animate={{
        // Give a slight structural kick/tilt forward when active
        rotate: isHovered ? -5 : 0,
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{ type: "spring", stiffness: 550, damping: 32, mass: 0.15 }}
    >
      {/* High-fidelity Tattoo Machine Asset */}
      <svg 
        width="48" 
        height="48" 
        viewBox="0 0 32 32" 
        fill="none" 
        style={{ 
          filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))",
          overflow: "visible"
        }}
      >
        {/* Dynamic Needle Layer: Vibrates at high frequency on hover links */}
        <motion.line 
          x1="0" 
          y1="0" 
          x2="8" 
          y2="8" 
          stroke="var(--text-color)" 
          strokeWidth="1.2" 
          strokeLinecap="round"
          animate={isHovered ? {
            x: [0, 0.4, -0.2, 0],
            y: [0, 0.4, -0.2, 0],
          } : {}}
          transition={{
            repeat: Infinity,
            duration: 0.05,
            ease: "linear"
          }}
        />

        {/* Needle Tube & Grip Tip */}
        <path 
          d="M6 6 L9 9 M5.5 7.5 L7.5 5.5" 
          stroke="var(--text-color)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />
        
        {/* Main Ergonomic Machine Grip Barrel */}
        <rect 
          x="7.5" 
          y="7.5" 
          width="5" 
          height="12" 
          rx="1" 
          transform="rotate(-45 7.5 7.5)" 
          fill="var(--bg-color)" 
          stroke="var(--text-color)" 
          strokeWidth="1.5" 
        />
        {/* Grip Texture Details */}
        <line x1="10" y1="13" x2="13" y2="10" stroke="var(--text-color)" strokeWidth="1" opacity="0.6" />
        <line x1="12" y1="15" x2="15" y2="12" stroke="var(--text-color)" strokeWidth="1" opacity="0.6" />
        <line x1="14" y1="17" x2="17" y2="14" stroke="var(--text-color)" strokeWidth="1" opacity="0.6" />

        {/* Upper Machine Frame & Coil Assembly */}
        <path 
          d="M16 16 L22 22 L27 17 L21 11 Z" 
          fill="var(--text-color)" 
          stroke="var(--text-color)" 
          strokeWidth="1" 
        />
        
        {/* Power Unit/Motor Component housing */}
        <circle 
          cx="21" 
          cy="16" 
          r="3" 
          fill="var(--bg-color)" 
          stroke="var(--text-color)" 
          strokeWidth="1.5" 
        />
        <circle 
          cx="21" 
          cy="16" 
          r="1" 
          fill="var(--text-color)" 
        />
        
        {/* Back Frame Clip Bracket */}
        <path 
          d="M22 22 L26 26 L29 23 L25 19" 
          fill="var(--bg-color)" 
          stroke="var(--text-color)" 
          strokeWidth="1.2" 
        />

        {/* Operational Power Cord (Aesthetic Tail) */}
        <path 
          d="M27 25 C 29 27, 31 26, 33 29" 
          stroke="var(--text-color)" 
          strokeWidth="1" 
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Lightning/Electric Resonance FX sparks when hovering actionable targets */}
        {isHovered && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.1 }}
          >
            <path d="M-2 3 L-5 1 L-3 -1" stroke="var(--text-color)" strokeWidth="1" />
            <path d="M4 -2 L2 -5 L0 -3" stroke="var(--text-color)" strokeWidth="1" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
};

const Icons = {
  Machine: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v8M9 6h6M8 10h8l-2 12H10l-2-12zM12 15v3" />
      <path d="M7 10c0-3 2-5 5-5s5 2 5 5" />
    </svg>
  ),
  Ink: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2s-5 3-5 8c0 2.8 2.2 5 5 5s5-2.2 5-5c0-5-5-8-5-8z" />
      <path d="M7 10c0-1.5 1-3 1-3" />
      <path d="M12 15v5M9 22h6" />
    </svg>
  ),
  Gift: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M12 20V8M3 12h18M12 8c-2-2-5-2-5 2 0 3 5 3 5 3s5 0 5-3c0-4-3-4-5-2z" />
    </svg>
  ),
};

const stats = [
  { label: "Artists", value: 8, suffix: "", icon: <FaUsers /> },
  { label: "Designs", value: 1500, suffix: "", icon: <FaPenNib /> },
  { label: "Customers", value: 5000, suffix: "", icon: <FaUserCheck /> },
  { label: "Artworks", value: 10000, suffix: "+", icon: <FaPalette /> },
  { label: "Location", value: 1, suffix: "", icon: <FaLocationDot /> },
];

const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (latest) => setCount(Math.floor(latest)),
      });
      return () => controls.stop();
    }
  }, [value, isInView]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const InkBlot = ({ variant = 1, style }: { variant?: 1 | 2 | 3; style?: React.CSSProperties }) => {
  const paths = [
    "M47.7,-76.4C60.1,-70.2,68.2,-55.1,74.4,-40.4C80.7,-25.7,85.1,-11.3,83.9,2.8C82.7,16.8,75.8,30.5,66.4,42.4C56.9,54.3,44.9,64.4,31.4,70.9C17.9,77.4,2.9,80.3,-12.3,78.8C-27.5,77.2,-42.9,71.2,-55.5,61.4C-68.1,51.6,-77.9,38,-82.1,23.3C-86.4,8.5,-85.1,-7.4,-80.1,-21.5C-75.1,-35.6,-66.4,-47.9,-55.1,-55.1C-43.8,-62.3,-30,-64.3,-17.8,-70.5C-5.6,-76.7,5.1,-87,21.5,-86.3C37.9,-85.6,41.3,-82.6,47.7,-76.4Z",
    "M39.9,-68.2C50.2,-61.1,56.1,-46.6,62.8,-33.1C69.5,-19.6,77.1,-7.1,78.4,6.4C79.7,19.9,74.7,34.5,66,46.7C57.4,58.9,45,68.7,31.4,73.1C17.8,77.5,2.9,76.5,-11.1,74.3C-25.1,72.1,-38.3,68.7,-49.4,61.1C-60.5,53.5,-69.6,41.7,-74.6,28.6C-79.6,15.5,-80.6,1.1,-78.3,-12.6C-76,-26.3,-70.4,-39.3,-60.9,-46.8C-51.4,-54.3,-38,-56.3,-26.6,-62.9C-15.3,-69.5,-5.9,-80.8,5.1,-88.7C16.1,-96.6,29.5,-75.3,39.9,-68.2Z",
    "M41.4,-72.1C53.3,-65.4,62.5,-52.8,70.1,-39.5C77.7,-26.2,83.7,-12.1,84.6,2.2C85.5,16.5,81.3,31,73.1,43.2C64.9,55.4,52.7,65.3,39.1,72.4C25.5,79.5,10.5,83.8,-4.2,91C-18.9,98.2,-33.3,108.3,-45.5,106.1C-57.7,103.9,-67.7,89.4,-75.3,74.6C-82.9,59.8,-88.1,44.7,-91.1,29.7C-94.1,14.7,-94.9,-0.2,-91.4,-14.2C-87.9,-28.2,-80.1,-41.3,-69.4,-49.2C-58.7,-57.1,-45.1,-59.8,-33,-66.3C-20.9,-72.8,-10.4,-83.1,2.8,-88.1C16.1,-93.1,32.2,-92.8,41.4,-72.1Z"
  ];

  return (
    <motion.svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ 
        position: 'absolute', 
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.12,
        filter: 'blur(50px)',
        color: 'var(--accent-color, #e0a96d)',
        ...style 
      }}
      animate={{
        scale: [1, 1.08, 0.96, 1],
        rotate: [0, 4, -4, 0],
      }}
      transition={{
        duration: 22 + variant * 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <path fill="currentColor" d={paths[variant - 1]} transform="translate(100 100)" />
    </motion.svg>
  );
};

const artists = [
  { name: "FELIPE SANTOS", image: "/artists/felipe-santos.jpg", style: "BLACK REALISM", descKey: "artistFelipeDesc" as TranslationKey },
  { name: "JAY SHIN", image: "/artists/jay-shin.svg", style: "FINE LINE & FLORAL", descKey: "artistJayDesc" as TranslationKey },
  { name: "VICTOR", image: "/artists/victor.svg", style: "TRADITIONAL INK", descKey: "artistVictorDesc" as TranslationKey },
  { name: "ZEE", image: "/artists/zee.svg", style: "NEO-TRADITIONAL", descKey: "artistZeeDesc" as TranslationKey },
  { name: "ADRIAN", image: "/artists/adrian.svg", style: "GEOMETRIC / DOTWORK", descKey: "artistAdrianDesc" as TranslationKey },
];

const contacts = [
  { title: "LOCATION", lines: ["101-103 Francis St, The Liberties", "Dublin 8, D08 FHP9"] },
  { title: "HOURS OF OPERATION", lines: ["11AM TO 7PM | MON - SUN", "CLOSED TUESDAY"] },
  { title: "CONTACT US", lines: ["nexostudiosltd@gmail.com"] },
];

export default function Home() {
  const { t, isHydrated } = useTranslation();
  const { theme, toggleTheme, language, setLanguage } = useLanguage();

  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 3. Setup Framer Motion scroll tracker inputs
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentArtistIndex((prev) => (prev + 1) % artists.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.02 } },
  };

  const characterVariants = {
    hidden: { opacity: 0, y: "100%" },
    visible: { opacity: 1, y: "0%", transition: { ease: [0.16, 1, 0.3, 1], duration: 0.8 } },
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const sectionFadeVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
  };

  const currentLangConfig = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES['english'];

  return (
    <>
      <main id="home" className="page-shell loaded relative w-full overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --text-color: ${theme === 'dark' ? '#ffffff' : '#0a0a0a'};
            --bg-color: ${theme === 'dark' ? '#0a0a0a' : '#ffffff'};
            --border-color: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'};
            --card-bg: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)'};
            --control-bg: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'};
          }
            
          .menu-overlay-link {
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.03em;
            text-decoration: none;
            color: var(--text-color);
            transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            opacity: 0.4;
          }

          .menu-overlay-link:hover {
            opacity: 1;
          }
          
          body {
            color: var(--text-color);
            background-color: var(--bg-color);
            overflow-x: hidden;
            margin: 0;
            padding: 0;
            letter-spacing: -0.01em;
          }

          /* 4. Hides default browser mouse pointer on desktop screens to allow the tattoo gun to take over */
          @media (min-width: 1024px) {
            body, a, button, select, option, input {
              cursor: none !important;
            }
          }

          .fade-section {
            position: relative !important;
            overflow: hidden !important;
            padding: 160px 4% !important;
            box-sizing: border-box;
          }

          @media (max-width: 1023px) {
            .fade-section {
              padding: 100px 6% !important;
            }
            .hero-section {
              flex-direction: column;
              padding-top: 160px !important;
            }
            .hero-side {
              margin-top: 4rem;
              max-width: 100% !important;
            }
          }

          .site-header-fixed {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            background: ${theme === 'dark' ? 'rgba(10, 10, 10, 0.75)' : 'rgba(255, 255, 255, 0.75)'};
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border-color);
            padding: 24px 4%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .eyebrow {
            font-size: 10px !important;
            font-weight: 700 !important;
            letter-spacing: 0.35em !important;
            text-transform: uppercase;
            opacity: 0.5;
            margin-bottom: 1rem;
          }

          h1, h2 {
            font-weight: 900 !important;
            text-transform: uppercase;
            letter-spacing: -0.03em !important;
            line-height: 0.95 !important;
          }

          h1 { font-size: clamp(3rem, 8vw, 6.5rem); }
          h2 { font-size: clamp(2.5rem, 6.5vw, 5rem); margin-bottom: 2.5rem; }

          .nike-btn {
            background: var(--text-color);
            color: var(--bg-color);
            padding: 1.1rem 2.8rem;
            border-radius: 100px;
            font-weight: 700;
            font-size: 0.85rem;
            letter-spacing: 0.05em;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s ease;
          }
          .nike-btn:hover {
            transform: scale(1.02);
            opacity: 0.95;
          }

          .nike-btn-outline {
            border: 1.5px solid var(--text-color);
            color: var(--text-color);
            padding: 1.1rem 2.8rem;
            border-radius: 100px;
            font-weight: 700;
            font-size: 0.85rem;
            letter-spacing: 0.05em;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .nike-btn-outline:hover {
            background: var(--text-color);
            color: var(--bg-color);
          }

          .nike-link-action {
            color: var(--text-color);
            font-weight: 700;
            font-size: 0.8rem;
            letter-spacing: 0.15em;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border-bottom: 2px solid var(--text-color);
            padding-bottom: 4px;
            transition: gap 0.3s ease;
          }
          .nike-link-action:hover {
            gap: 14px;
          }

          .nike-split-card {
            display: grid;
            grid-template-columns: 1fr;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            overflow: hidden;
          }
          @media (min-width: 1024px) {
            .nike-split-card {
              grid-template-columns: 1.1fr 0.9fr;
            }
          }

          .stats-section {
            background: var(--bg-color);
            padding: 120px 4%;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            max-width: 1400px;
            margin: 0 auto;
            gap: 4rem 2rem;
            text-align: center;
          }
          @media (min-width: 1024px) {
            .stats-grid { grid-template-columns: repeat(5, 1fr); }
          }
          .stat-number {
            font-size: clamp(2.5rem, 5vw, 4.5rem);
            font-weight: 900;
            letter-spacing: -0.02em;
            line-height: 1;
            margin-bottom: 0.5rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
          }
          .stat-icon {
            font-size: 0.6em;
            opacity: 0.5;
            display: inline-flex;
            align-items: center;
          }
          .stat-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.2em;
            opacity: 0.4;
          }

          .reviews-header-block {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 4rem;
          }
          @media (min-width: 768px) {
            .reviews-header-block {
              flex-direction: row;
              justify-content: space-between;
              align-items: flex-end;
            }
          }
          .reviews-summary-badge {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            padding: 0.75rem 1.5rem;
            border-radius: 100px;
            font-size: 0.85rem;
            font-weight: 700;
          }

          /* Master Site Footer Element */
.site-footer {
  margin-top: 6rem;
  padding-top: 4rem;
  padding-bottom: 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 4rem;
  background: var(--bg-color);
}

.footer-main {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-description {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-color);
  opacity: 0.6;
}

.footer-nav-group,
.footer-social-group {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.footer-heading {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-color);
  opacity: 0.5;
  font-weight: 600;
}

.footer-nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: var(--text-color);
}

.footer-nav-links a {
  opacity: 0.7;
  transition: all 0.2s ease;
}

.footer-nav-links a:hover {
  opacity: 1;
  color: var(--text-color);
}

/* Social Media Networks Setup */
.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-link {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.social-link:hover {
  background: var(--control-bg);
  border-color: var(--text-color);
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}

.social-icon {
  position: absolute;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.social-icon svg {
  width: 100%;
  height: 100%;
  stroke-width: 2;
}

.link-indicator {
  position: absolute;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: -2px;
  right: -2px;
  background: var(--text-color);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0) rotate(-45deg);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.link-indicator svg {
  width: 7px;
  height: 7px;
  color: var(--bg-color);
  stroke-width: 2.5;
}

.social-link:hover .social-icon {
  transform: scale(0.7) rotate(-45deg);
}

.social-link:hover .link-indicator {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

/* Lower Base Metadata Section */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.4;
}
        `}} />

        {/* 5. Fixed Top Progress Indicator line */}
        <motion.div 
          style={{
            scaleX,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'var(--text-color)',
            transformOrigin: '0%',
            zIndex: 99999,
          }}
        />
        
      {/* Navigation Bar */}
      <header className="site-header-fixed" style={{ zIndex: 100000 }}>
        <div className="brand" style={{ fontWeight: 900, fontSize: '1.15rem', letterSpacing: '0.25em' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setIsMenuOpen(false)}>
            NEXO STUDIO
          </Link>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleTheme}
            className="accessibility-toggle"
            style={{
              background: 'transparent',
              color: 'currentColor',
              border: '1px solid var(--border-color)',
              padding: '0 16px',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              height: '38px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{theme === 'dark' ? '☀ LIGHT' : '☾ DARK'}</span>
          </button>

          <div className="custom-lang-selector" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}>{currentLangConfig.flag}</span>
            <select
              value={language || 'english'}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              style={{
                background: 'transparent',
                color: 'currentColor',
                border: '1px solid var(--border-color)',
                padding: '0 32px 0 40px',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                appearance: 'none',
                height: '38px',
                borderRadius: '20px'
              }}
            >
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                <option key={code} value={code} style={{ background: 'var(--bg-color)' }}>
                  {lang.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Collapsed Menu Trigger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              background: 'transparent',
              color: 'currentColor',
              border: '1px solid var(--border-color)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <motion.span 
              animate={isMenuOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
              style={{ width: '16px', height: '1.5px', background: 'currentColor', display: 'block', transformOrigin: 'center' }} 
            />
            <motion.span 
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              style={{ width: '16px', height: '1.5px', background: 'currentColor', display: 'block' }} 
            />
            <motion.span 
              animate={isMenuOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
              style={{ width: '16px', height: '1.5px', background: 'currentColor', display: 'block', transformOrigin: 'center' }} 
            />
          </button>
        </div>
      </header>

      {/* Collapsed Transparent Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: theme === 'dark' ? 'rgba(10, 10, 10, 0.4)' : 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
              {[
                { label: 'HOME', href: '#home' },
                { label: 'ARTISTS', href: '#artists' },
                { label: 'BOOK', href: '/contact' },
              ].map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link 
                    href={link.href} 
                    className="menu-overlay-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Hero Section */}
        <motion.section 
          className="hero-section fade-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionFadeVariants}
          style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', paddingTop: '200px' }}
        >
          <video
            autoPlay loop muted playsInline
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover', zIndex: -1, opacity: theme === 'dark' ? 0.25 : 0.08,
              filter: 'grayscale(100%)', pointerEvents: 'none'
            }}
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>

          <div style={{ flex: '1 1 60%' }}>
            <motion.div className="hero-copy" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.p className="eyebrow" variants={fadeInUpVariants}>EXCEPTIONAL EMBLEM CRAFT</motion.p>
              
              <motion.h1 variants={containerVariants}>
                {isHydrated && t("tagline").split(" ").map((word, wIdx, arr) => (
                  <span key={wIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                    {word.split("").map((char, cIdx) => (
                      <motion.span key={cIdx} style={{ display: 'inline-block' }} variants={characterVariants}>
                        {char}
                      </motion.span>
                    ))}
                    {wIdx < arr.length - 1 && "\u00A0"}
                  </span>
                ))}
              </motion.h1>

              <motion.p style={{ fontSize: '1.15rem', opacity: 0.7, maxWidth: '540px', margin: '2rem 0 3rem 0', lineHeight: 1.6 }} variants={fadeInUpVariants}>
                {t("description")}
              </motion.p>
              <motion.div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }} variants={fadeInUpVariants}>
                <Link className="nike-btn" href="/contact">{t("booking").toUpperCase()}</Link>
              </motion.div>
            </motion.div>
          </div>

          <aside className="hero-side" style={{ flex: '1 1 40%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {contacts.map((block) => (
                <div key={block.title} style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', opacity: 0.4, marginBottom: '0.5rem' }}>{block.title}</h3>
                  {block.lines.map((line) => (
                    <p key={line} style={{ fontSize: '0.9rem', margin: '2px 0', fontWeight: 500 }}>{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </aside>
        </motion.section>

        {/* Stats Grid Dashboard */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="stat-number">
                  <span className="stat-icon">{stat.icon}</span>
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="stat-label">{stat.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Artists Split-Screen Section */}
        <motion.section 
          id="artists" 
          className="fade-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionFadeVariants}
        >
          <InkBlot variant={2} style={{ top: '5%', right: '-10%', width: '80%', height: '80%' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className="eyebrow">THE ROSTER</p>
            <h2>
              {isHydrated && t("artists").split(" ").map((word, wIdx, arr) => (
                <span key={wIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                  {word.split("").map((char, cIdx) => (
                    <span key={cIdx} style={{ display: 'inline-block' }}>{char}</span>
                  ))}
                  {wIdx < arr.length - 1 && "\u00A0"}
                </span>
              ))}
            </h2>
          </div>
          
          <div 
            className="carousel-container" 
            style={{ position: 'relative', marginTop: '2rem' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div 
              style={{ 
                display: 'flex', 
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: `translateX(-${currentArtistIndex * 100}%)`,
                willChange: 'transform'
              }}
            >
              {artists.map((artist) => (
                <div key={artist.name} style={{ minWidth: '100%', padding: '0 10px', boxSizing: 'border-box' }}>
                  <div className="nike-split-card">
                    {/* Media Left Boundary */}
                    <div style={{ position: 'relative', height: '500px', width: '100%', overflow: 'hidden', background: 'var(--border-color)' }}>
                      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          style={{ objectFit: 'contain' }}
                          priority
                        />
                      </motion.div>
                      <span style={{ position: 'absolute', bottom: '24px', left: '24px', background: 'var(--bg-color)', fontSize: '10px', fontWeight: 800, padding: '6px 14px', borderRadius: '4px', letterSpacing: '0.1em', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        {artist.style}
                      </span>
                    </div>
                    
                    {/* Editorial Description Boundary Right */}
                    <div style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', opacity: 0.4 }}>RESIDENT ELITE</span>
                      <h3 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.5rem 0 1.5rem 0', letterSpacing: '-0.02em' }}>{artist.name}</h3>
                      <p style={{ opacity: 0.7, lineHeight: 1.6, fontSize: '1rem', marginBottom: '2.5rem' }}>{t(artist.descKey)}</p>
                      <div>
                        <Link className="nike-link-action" href="/contact">
                          BOOK A SESSION
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Control Arrows */}
            <button 
              onClick={() => setCurrentArtistIndex((prev) => (prev - 1 + artists.length) % artists.length)}
              style={{
                position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)',
                background: 'var(--text-color)', border: 'none', color: 'var(--bg-color)',
                width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
              aria-label="Previous Profile"
            >
              ←
            </button>
            <button 
              onClick={() => setCurrentArtistIndex((prev) => (prev + 1) % artists.length)}
              style={{
                position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)',
                background: 'var(--text-color)', border: 'none', color: 'var(--bg-color)',
                width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
              aria-label="Next Profile"
            >
              →
            </button>
          </div>
        </motion.section>

        {/* Location Section Wrapper */}
        <motion.div 
          style={{ position: 'relative' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionFadeVariants}
        >
          <LocationMap />
        </motion.div>

        

        {/* Google Reviews Widget Dashboard Section */}
        <motion.section 
          id="reviews"
          className="reviews-section fade-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionFadeVariants}
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <div className="reviews-header-block">
            <div>
              <p className="eyebrow">CLIENT VERDICTS</p>
              <h2 style={{ margin: 0 }}>GOOGLE REVIEWS</h2>
            </div>
            
            <div className="reviews-summary-badge">
              <FaGoogle style={{ opacity: 0.8 }} />
              <span>4.9</span>
              <div style={{ display: "flex", gap: "2px", color: "#ffc107" }}>
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <span style={{ opacity: 0.4, fontWeight: 500 }}>(142 REVIEWS)</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}>
            <a className="nike-btn" href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
              WRITE A REVIEW
            </a>
            <a className="nike-btn-outline" href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
              VIEW ALL ON GOOGLE
            </a>
          </div>
        </motion.section>
        
        {/* Studio Modernist Footer */}
        <footer className="site-footer">
          <SocialLinks />
        </footer>
      </main>

      {/* 6. Render Custom Cursor globally over client tree */}
      <TattooMachineCursor />

      <FloatingSocials />
      <ScrollToTopButton />
    </>
  );
}