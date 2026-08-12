"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTranslation } from "./hooks/useTranslation";
import { TranslationKey, translations } from "../lib/translations";
import { LanguageCode, SUPPORTED_LANGUAGES } from "../lib/languages"; 
import { useLanguage } from "./providers";
import { SocialLinks } from "./components/SocialLinks"; 
import { motion, useInView, animate, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { FaUsers, FaPenNib, FaUserCheck, FaPalette, FaLocationDot, FaStar, FaGoogle } from "react-icons/fa6";
import { LocationMap } from "./components/LocationMap";
import ScrollToTopButton from "./components/ScrollToTopButton";
import FloatingSocials from "./components/FloatingSocials";
import { ArtistProfile, ARTISTS_UPDATED_EVENT, DEFAULT_ARTISTS, getArtistsFromStorage } from "../lib/artists";

const GOOGLE_REVIEW_URL = "https://g.page/r/CRIAbJ7AOfOPEBM/review";

// Custom Smooth Tattoo Machine Cursor Component
const TattooMachineCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) return;

    const showCursor = () => setIsVisible(true);
    const hideCursor = () => setIsVisible(false);

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
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

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsVisible(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseenter", showCursor);
    window.addEventListener("mouseleave", hideCursor);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseenter", showCursor);
      window.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
        transform: "translate(0px, 0px)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 140ms ease",
      }}
      animate={{
        rotate: isHovered ? -5 : 0,
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{ type: "spring", stiffness: 550, damping: 32, mass: 0.15 }}
    >
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
        <path 
          d="M6 6 L9 9 M5.5 7.5 L7.5 5.5" 
          stroke="var(--text-color)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />
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
        <line x1="10" y1="13" x2="13" y2="10" stroke="var(--text-color)" strokeWidth="1" opacity="0.6" />
        <line x1="12" y1="15" x2="15" y2="12" stroke="var(--text-color)" strokeWidth="1" opacity="0.6" />
        <line x1="14" y1="17" x2="17" y2="14" stroke="var(--text-color)" strokeWidth="1" opacity="0.6" />
        <path 
          d="M16 16 L22 22 L27 17 L21 11 Z" 
          fill="var(--text-color)" 
          stroke="var(--text-color)" 
          strokeWidth="1" 
        />
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
        <path 
          d="M22 22 L26 26 L29 23 L25 19" 
          fill="var(--bg-color)" 
          stroke="var(--text-color)" 
          strokeWidth="1.2" 
        />
        <path 
          d="M27 25 C 29 27, 31 26, 33 29" 
          stroke="var(--text-color)" 
          strokeWidth="1" 
          strokeLinecap="round"
          opacity="0.5"
        />
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

const contacts = [
  { title: "LOCATION", lines: ["101-103 Francis St, The Liberties", "Dublin 8, D08 FHP9"] },
  { title: "HOURS OF OPERATION", lines: ["11AM TO 7PM | MON - SUN", "CLOSED TUESDAY"] },
  { title: "CONTACT US", lines: ["nexostudiosltd@gmail.com"] },
];

export default function Home() {
  const { t, isHydrated } = useTranslation();
  const { theme, toggleTheme, language, setLanguage } = useLanguage();

  const [artists, setArtists] = useState<ArtistProfile[]>(DEFAULT_ARTISTS);
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // States for the Collapsible Navigation Dock
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const syncArtists = () => {
      setArtists(getArtistsFromStorage());
    };

    syncArtists();
    window.addEventListener(ARTISTS_UPDATED_EVENT, syncArtists);

    return () => {
      window.removeEventListener(ARTISTS_UPDATED_EVENT, syncArtists);
    };
  }, []);

  useEffect(() => {
    if (artists.length === 0) {
      return;
    }

    setCurrentArtistIndex((prev) => prev % artists.length);
  }, [artists.length]);

  useEffect(() => {
    if (isHovered || artists.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentArtistIndex((prev) => (prev + 1) % artists.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, artists.length]);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger floating state when page scrolls past 120px
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll);

    const sections = ["home", "services", "artists", "reviews", "location"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { 
          threshold: 0.2, 
          rootMargin: "-25% 0px -55% 0px"
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  const isTranslationKey = (key: string): key is TranslationKey => {
    return Object.prototype.hasOwnProperty.call(translations.english, key);
  };

  const getArtistDescription = (descKey: string): string => {
    return isTranslationKey(descKey) ? t(descKey) : descKey;
  };

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

  const servicePreviews = [
    {
      title: t("homeServiceCoverTitle"),
      subtitle: t("homeServiceCoverSubtitle"),
      description: t("homeServiceCoverDescription"),
      href: "/cover-up",
      cta: t("homeServiceCoverCta"),
    },
    {
      title: t("homeServiceNewTitle"),
      subtitle: t("homeServiceNewSubtitle"),
      description: t("homeServiceNewDescription"),
      href: "/new-tattoo",
      cta: t("homeServiceNewCta"),
    },
    {
      title: t("homeServiceScalpTitle"),
      subtitle: t("homeServiceScalpSubtitle"),
      description: t("homeServiceScalpDescription"),
      href: "/scalp-micropigmentation",
      cta: t("homeServiceScalpCta"),
    },
  ];

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
          
          body {
            color: var(--text-color);
            background-color: var(--bg-color);
            overflow-x: hidden;
            margin: 0;
            padding: 0;
            letter-spacing: -0.01em;
            scroll-behavior: smooth;
          }

          /* --- FIXED TRANSPARENT GLASSMORPHIC NAVIGATION BAR --- */
          .site-header-centralized {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            background: transparent;
            padding: 24px 4%;
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            box-sizing: border-box;
            transition: padding 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease;
          }

          .site-header-centralized.header-scrolled {
            padding: 14px 4%;
            background: ${theme === 'dark' ? 'rgba(10, 10, 10, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border-color);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          }

          .brand-logo {
            font-weight: 900;
            letter-spacing: -0.02em;
            font-size: 1.2rem;
            color: var(--text-color);
            text-decoration: none;
          }

          /* --- COLLAPSIBLE NAVIGATION INTERACTIVE DOCK --- */
          .header-center-nav {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .central-nav-pill {
            background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
            border: 1px solid var(--border-color);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border-radius: 40px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            overflow: hidden;
            display: flex;
            align-items: center;
          }

          .central-nav-pill.is-collapsed {
            width: 140px;
            height: 44px;
          }

          .central-nav-pill.is-collapsed:hover {
            background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'};
            border-color: var(--text-color);
            transform: translateY(-1px);
          }

          .pill-trigger-btn {
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: var(--text-color);
          }

          .pill-dot-indicator {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--text-color);
            box-shadow: 0 0 8px var(--text-color);
          }

          .pill-label-text {
            font-size: 0.75rem;
            font-weight: 800;
            letter-spacing: 0.12em;
          }

          .central-nav-pill.is-expanded {
            width: min(700px, calc(100vw - 80px));
            min-height: 46px;
            height: auto;
            padding: 10px 10px 10px 18px;
            background: ${theme === 'dark' ? 'rgba(10, 10, 10, 0.92)' : 'rgba(255, 255, 255, 0.92)'};
            border-color: var(--text-color);
          }

          .expanded-links-container {
            width: 100%;
            min-height: 46px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            flex-wrap: wrap;
          }

          .expanded-nav-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.7rem 1.2rem;
            list-style: none;
            margin: 0;
            padding: 0;
            align-items: center;
          }

          .expanded-nav-list a {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text-color);
            text-decoration: none;
            opacity: 0.4;
            transition: opacity 0.2s ease;
          }

          .expanded-nav-list a:hover,
          .expanded-nav-list a.active-pill {
            opacity: 1;
          }

          .pill-close-btn {
            background: var(--control-bg);
            border: none;
            color: var(--text-color);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            transition: background 0.2s;
          }

          .pill-close-btn:hover {
            background: var(--text-color);
            color: var(--bg-color);
          }

          /* --- PREMIUM SCROLL-FOLLOWING & FLOATING CTA --- */
          .header-right-cta {
            justify-self: end;
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }

          .admin-header-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 40px;
            padding: 0 1rem;
            border-radius: 999px;
            border: 1px solid var(--border-color);
            background: var(--card-bg);
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.68rem;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            transition: border-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
            opacity: 0.8;
          }

          .admin-header-link:hover {
            border-color: var(--text-color);
            transform: translateY(-1px);
            opacity: 1;
          }

          .premium-rolling-btn {
            position: relative;
            overflow: hidden !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem !important;
            font-weight: 800 !important;
            letter-spacing: 0.1em;
            height: 44px;
            padding: 0 1.8rem !important;
            text-decoration: none;
            background: linear-gradient(135deg, #5c0000 0%, #a30015 50%, #e63946 100%) !important;
            border: 1px solid rgba(255, 255, 255, 0.16);
            border-radius: 30px;
            color: #ffffff !important;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 10px 28px rgba(108, 4, 12, 0.35);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.25s ease;
          }

          .premium-rolling-btn:hover {
            filter: brightness(1.08);
            border-color: rgba(255, 255, 255, 0.24);
          }

          /* Global Floating Scroll-Following Class Configuration */
          .premium-rolling-btn.is-floating {
            position: fixed !important;
            bottom: 2.2rem;
            right: 2.2rem;
            height: 50px;
            padding: 0 2.2rem !important;
            background: linear-gradient(135deg, #6f0000 0%, #b2001a 55%, #ff4d4d 100%) !important;
            color: #ffffff !important;
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 16px 44px rgba(109, 6, 17, 0.45);
            z-index: 1001;
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            animation: ctaPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .premium-rolling-btn.is-floating:hover {
            transform: scale(1.04) translateY(-2px);
            box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
          }

          @keyframes ctaPopIn {
            from { transform: scale(0.8) translateY(30px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }

          .btn-text-roll {
            display: block;
            position: relative;
            height: 100%;
            transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
            transform-style: preserve-3d;
          }

          .premium-rolling-btn.is-floating .btn-text-roll {
            line-height: 50px;
          }

          .primary-text, .hover-text {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
            backface-visibility: hidden;
          }

          .hover-text {
            position: absolute;
            top: 100%;
            left: 0;
            transform: rotateX(-90deg);
            transform-origin: top;
          }

          .premium-rolling-btn:hover .btn-text-roll {
            transform: translateY(-100%);
          }

          .premium-rolling-btn:hover .hover-text {
            transform: rotateX(0deg);
          }

          @media (max-width: 1023px) {
            .header-center-nav {
              display: none;
            }
            .premium-rolling-btn {
              display: none;
            }
            .admin-header-link {
              height: 36px;
              padding: 0 0.85rem;
              font-size: 0.62rem;
              letter-spacing: 0.1em;
            }
            /* Retain visible floating CTA access for mobile engagement */
            .premium-rolling-btn.is-floating {
              display: inline-flex !important;
              bottom: 1.5rem;
              right: 1.5rem;
              height: 48px;
              padding: 0 1.8rem !important;
            }
            .site-header-centralized {
              grid-template-columns: 1fr auto;
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
            background: linear-gradient(135deg, #5c0000 0%, #a30015 50%, #e63946 100%);
            color: #ffffff;
            padding: 1.1rem 2.8rem;
            border-radius: 100px;
            font-weight: 700;
            font-size: 0.85rem;
            letter-spacing: 0.05em;
            text-decoration: none;
            display: inline-block;
            box-shadow: 0 10px 26px rgba(108, 4, 12, 0.32);
            transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s ease, filter 0.2s ease;
          }
          .nike-btn:hover {
            transform: scale(1.02);
            opacity: 0.98;
            filter: brightness(1.08);
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

          .services-preview-section {
            padding: 70px 4% 30px;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
            position: relative;
          }

          .services-preview-head {
            max-width: 900px;
            margin: 0 auto 2rem;
            display: grid;
            gap: 0.8rem;
          }

          .services-preview-head h2 {
            margin: 0;
          }

          .services-preview-grid {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            gap: 1rem;
            grid-template-columns: 1fr;
          }

          .service-preview-card {
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 1.6rem;
            background: var(--card-bg);
            display: grid;
            gap: 1rem;
            transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
          }

          .service-preview-card:hover {
            transform: translateY(-4px);
            border-color: var(--text-color);
          }

          .service-preview-eyebrow {
            margin: 0;
            font-size: 10px;
            letter-spacing: 0.2em;
            opacity: 0.5;
            font-weight: 700;
          }

          .service-preview-title {
            margin: 0;
            font-size: clamp(1.3rem, 2.7vw, 1.85rem);
            letter-spacing: -0.02em;
            font-weight: 900;
          }

          .service-preview-desc {
            margin: 0;
            line-height: 1.7;
            opacity: 0.72;
          }

          .service-preview-actions {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            flex-wrap: wrap;
          }

          @media (min-width: 1024px) {
            .services-preview-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
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
        `}} />

        {/* Top Progress Bar */}
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
        
        {/* Centralized Grid Navigation Header */}
        <header className={`site-header-centralized ${isScrolled ? 'header-scrolled' : ''}`}>
          <div className="header-left">
            <Link href="#home" onClick={() => setActiveSection("home")} className="brand-logo">
              NEXO TATTOO
            </Link>
          </div>

          {/* Centralized Collapsible Pill Menu Container */}
          <nav className="header-center-nav">
            <div className={`central-nav-pill ${isNavExpanded ? 'is-expanded' : 'is-collapsed'}`}>
              {!isNavExpanded ? (
                <button className="pill-trigger-btn" onClick={() => setIsNavExpanded(true)}>
                  <span className="pill-dot-indicator"></span>
                  <span className="pill-label-text">
                    {activeSection === "home" ? "MENU" : activeSection.toUpperCase()}
                  </span>
                </button>
              ) : (
                <div className="expanded-links-container">
                  <ul className="expanded-nav-list">
                    {[
                      { id: "home", href: "#home", label: "home" },
                      { id: "services", href: "#services", label: "services" },
                      { id: "location", href: "#location", label: "location" },
                      { id: "contact", href: "/contact", label: "contact" },
                      { id: "workshop", href: "/workshop", label: "workshop" },
                    ].map((item) => (
                      <li key={item.id}>
                        {item.href.startsWith("#") ? (
                          <a 
                            href={item.href} 
                            className={activeSection === item.id ? "active-pill" : ""}
                            onClick={() => {
                              setActiveSection(item.id);
                              setIsNavExpanded(false);
                            }}
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            className={activeSection === item.id ? "active-pill" : ""}
                            onClick={() => {
                              setActiveSection(item.id);
                              setIsNavExpanded(false);
                            }}
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                  <button className="pill-close-btn" onClick={() => setIsNavExpanded(false)}>✕</button>
                </div>
              )}
            </div>
          </nav>

          <div className="header-right-cta">
            {/* The Floating Scroll-Following Booking button tracks layout status contextually */}
            <Link href="/contact" className={`premium-rolling-btn ${isScrolled ? 'is-floating' : ''}`}>
              <span className="btn-text-roll">
                <span className="primary-text">BOOK SESSION</span>
                <span className="hover-text">GET INKED NOW</span>
              </span>
            </Link>

            <Link href="/admin" className="admin-header-link">
              Admin Login
            </Link>

            <button 
              className="mobile-menu-trigger" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className={isMenuOpen ? "line-open" : ""}></span>
            </button>
          </div>
        </header>

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
              <motion.p className="eyebrow">EXCEPTIONAL EMBLEM CRAFT</motion.p>
              
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

        {/* Services Preview */}
        <motion.section
          id="services"
          className="services-preview-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionFadeVariants}
        >
          <div className="services-preview-head">
            <p className="eyebrow">{t("homeServiceEyebrow")}</p>
            <h2>{t("homeServiceHeading")}</h2>
            <p style={{ maxWidth: "760px", margin: 0, opacity: 0.72, lineHeight: 1.7 }}>
              {t("homeServiceLead")}
            </p>
          </div>

          <div className="services-preview-grid">
            {servicePreviews.map((service) => (
              <article key={service.title} className="service-preview-card">
                <p className="service-preview-eyebrow">{service.subtitle.toUpperCase()}</p>
                <h3 className="service-preview-title">{service.title}</h3>
                <p className="service-preview-desc">{service.description}</p>
                <div className="service-preview-actions">
                  <Link className="nike-btn-outline" href={service.href}>
                    {service.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        {/* Stats Dashboard */}
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

        {/* Artists Section */}
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
                <div key={artist.id} style={{ minWidth: '100%', padding: '0 10px', boxSizing: 'border-box' }}>
                  <div className="nike-split-card">
                    <div style={{ position: 'relative', height: '500px', width: '100%', overflow: 'hidden', background: 'var(--border-color)' }}>
                      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <img
                          src={artist.image}
                          alt={artist.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </motion.div>
                      <span style={{ position: 'absolute', bottom: '24px', left: '24px', background: 'var(--bg-color)', fontSize: '10px', fontWeight: 800, padding: '6px 14px', borderRadius: '4px', letterSpacing: '0.1em', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        {artist.style}
                      </span>
                    </div>
                    
                    <div style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', opacity: 0.4 }}>RESIDENT ELITE</span>
                      <h3 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.5rem 0 1.5rem 0', letterSpacing: '-0.02em' }}>{artist.name}</h3>
                      <p style={{ opacity: 0.7, lineHeight: 1.6, fontSize: '1rem', marginBottom: '2.5rem' }}>{getArtistDescription(artist.descKey)}</p>
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

            <button 
              onClick={() => {
                if (artists.length === 0) return;
                setCurrentArtistIndex((prev) => (prev - 1 + artists.length) % artists.length);
              }}
              style={{
                position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)',
                background: 'var(--text-color)', border: 'none', color: 'var(--bg-color)',
                width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
              aria-label="Previous Profile"
              disabled={artists.length <= 1}
            >
              ←
            </button>
            <button 
              onClick={() => {
                if (artists.length === 0) return;
                setCurrentArtistIndex((prev) => (prev + 1) % artists.length);
              }}
              style={{
                position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)',
                background: 'var(--text-color)', border: 'none', color: 'var(--bg-color)',
                width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
              aria-label="Next Profile"
              disabled={artists.length <= 1}
            >
              →
            </button>
          </div>
        </motion.section>

        {/* Location Section */}
        <motion.div 
          id="location"
          style={{ position: 'relative' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionFadeVariants}
        >
          <LocationMap />
        </motion.div>

        {/* Google Reviews Widget */}
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
        
        {/* Footer */}
        <footer className="site-footer">
          <SocialLinks />
          <div style={{ textAlign: "center", paddingTop: "0.5rem" }}>
            <Link
              href="/admin"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                opacity: 0.5,
                textDecoration: "none",
                color: "var(--text-color)",
              }}
            >
              Owner Admin
            </Link>
          </div>
        </footer>
      </main>

      <TattooMachineCursor />
      <FloatingSocials />
      <ScrollToTopButton />
    </>
  );
}