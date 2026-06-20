"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "./hooks/useTranslation";
import { TranslationKey } from "../lib/translations";
import { LanguageCode, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "../lib/languages"; 
import { useLanguage } from "./providers";
import { SocialLinks } from "./components/SocialLinks"; 
import { motion, useInView, animate } from "framer-motion";
import { FaUsers, FaPenNib, FaUserCheck, FaPalette, FaLocationDot } from "react-icons/fa6";
import { LocationMap } from "./components/LocationMap";
import ScrollToTopButton from "./components/ScrollToTopButton";
import FloatingSocials from "./components/FloatingSocials";

// Custom Tattoo Icons for the Marketplace and UI
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
  Menu: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
  )
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
        opacity: 0.15,
        filter: 'blur(60px)',
        color: 'var(--accent-color, #f39c12)',
        ...style 
      }}
      animate={{
        scale: [1, 1.1, 0.95, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 20 + variant * 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <path fill="currentColor" d={paths[variant - 1]} transform="translate(100 100)" />
    </motion.svg>
  );
};

const artists = [
  {
    name: "FELIPE SANTOS",
    image: "/artists/felipe-santos.jpg",
    descKey: "artistFelipeDesc" as TranslationKey,
  },
  {
    name: "CARLA MORALES",
    image: "/artists/carla-morales.jpg",
    descKey: "artistCarlaDesc" as TranslationKey,
  },
  {
    name: "ZACK",
    image: "/artists/zack.jpg",
    descKey: "artistZackDesc" as TranslationKey,
  },
  {
    name: "VICTORIA",
    image: "/artists/victoria.jpg",
    descKey: "artistVictoriaDesc" as TranslationKey,
  },
  {
    name: "OWEN",
    image: "/artists/owen.jpg",
    descKey: "artistOwenDesc" as TranslationKey,
  },
  {
    name: "CONOR",
    image: "/artists/conor.jpg",
    descKey: "artistConorDesc" as TranslationKey,
  },
  {
    name: "SARAH MORGAN",
    image: "/artists/sarah-morgan.jpg",
    descKey: "artistSarahDesc" as TranslationKey,
  },
  {
    name: "ELIAS SILVA",
    image: "/artists/elias-silva.jpg",
    descKey: "artistEliasDesc" as TranslationKey,
  },
];

const contacts = [
  {
    title: "LOCATION",
    lines: ["101-103 Francis St, The Liberties", "Dublin 8, D08 FHP9"],
  },
  {
    title: "HOURS OF OPERATION",
    lines: ["11AM TO 7PM | MONDAY - SUNDAY", "CLOSED TUESDAY"],
  },
  {
    title: "CONTACT US",
    lines: ["nexostudiosltd@gmail.com"],
  },
];

export default function Home() {
  const { t, isHydrated } = useTranslation();
  const { theme, toggleTheme, language, setLanguage } = useLanguage();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const snapContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  // Carousel Autoplay state controls
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Carousel Autoplay Timer Setup
  useEffect(() => {
    if (isHovered) return; // Pause autoplay when mouse leaves to allow user reading

    const timer = setInterval(() => {
      setCurrentArtistIndex((prevIndex) => (prevIndex + 1) % artists.length);
    }, 4500); // Transitions slide every 4.5 seconds

    return () => clearInterval(timer);
  }, [isHovered]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const characterVariants = {
    hidden: { opacity: 0, y: "100%" },
    visible: { opacity: 1, y: "0%", transition: { ease: [0.16, 1, 0.3, 1], duration: 0.8 } },
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const sectionFadeVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  const splitTagline = useMemo(() => {
    if (!isHydrated) return [];
    const taglineText = t("tagline");
    return taglineText.split("").map(char => (char === " " ? "\u00A0" : char));
  }, [t, isHydrated]);

  const splitArtistsTitle = useMemo(() => {
    if (!isHydrated) return [];
    const text = t("artists");
    return text.split("").map(char => (char === " " ? "\u00A0" : char));
  }, [t, isHydrated]);

  const splitAftercareTitle = useMemo(() => {
    if (!isHydrated) return [];
    const text = t("aftercareTitle");
    return text.split("").map(char => (char === " " ? "\u00A0" : char));
  }, [t, isHydrated]);

  useEffect(() => {
    const container = snapContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = container.querySelectorAll('.snap-section, .location-section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isHydrated]);

  useEffect(() => {
    const container = snapContainerRef.current;
    if (!container || window.innerWidth < 1024) return;

    const handleScroll = () => {
      const sections = container.querySelectorAll('.snap-section, .location-section');
      sections.forEach((section: any) => {
        const rect = section.getBoundingClientRect();
        const speed = 0.4;
        const yOffset = rect.top * speed;
        section.style.setProperty('--parallax-offset', `${yOffset}px`);

        const viewportHeight = window.innerHeight;
        const minScale = 0.95;
        const maxScale = 1.0;
        
        let normalizedOffset = Math.abs(rect.top) / viewportHeight;
        if (normalizedOffset > 1) normalizedOffset = 1;

        const scaleValue = maxScale - (normalizedOffset * (maxScale - minScale));
        section.style.setProperty('--parallax-scale', `${scaleValue}`);
      });
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isHydrated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nextArtist = () => {
    setCurrentArtistIndex((prev) => (prev + 1) % artists.length);
  };

  const prevArtist = () => {
    setCurrentArtistIndex((prev) => (prev - 1 + artists.length) % artists.length);
  };

  const currentLangConfig = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES['english'];

  return (
    <>
      <main id="home" className="page-shell loaded relative w-full overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --text-color: ${theme === 'dark' ? '#ffffff' : '#333333'};
            --bg-color: ${theme === 'dark' ? '#0a0a0a' : '#ffffff'};
            --border-color: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            --card-bg: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'};
            --control-bg: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          }
          
          /* Enforced Global Body reset to contain layout leaks */
          body {
            color: var(--text-color);
            background-color: var(--bg-color);
            transition: background-color 0.3s ease, color 0.3s ease;
            overflow-x: hidden;
            margin: 0;
            padding: 0;
          }

          @media (min-width: 1024px) {
            .snap-container {
              height: 100vh;
              overflow-y: scroll;
              scroll-snap-type: y mandatory;
              scroll-behavior: smooth;
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .snap-container::-webkit-scrollbar {
              display: none;
            }
            .snap-section {
              scroll-snap-align: start;
              height: 100vh;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              box-sizing: border-box;
              overflow: hidden;
            }
            .parallax-bg {
              position: absolute;
              top: -20%;
              left: 0;
              width: 100%;
              height: 140%;
              z-index: -1;
              background-size: cover;
              background-position: center;
              transform: translateY(var(--parallax-offset, 0)) scale(calc(var(--parallax-scale, 1) * 1.15));
              pointer-events: none;
              opacity: ${theme === 'dark' ? '0.4' : '0.15'};
              filter: grayscale(100%) ${theme === 'dark' ? 'brightness(0.3)' : 'brightness(0.9)'};
              transition: transform 0.3s ease-out, filter 0.3s ease, opacity 0.3s ease;
              will-change: transform, filter, opacity;
            }
            
            .reveal-text {
              overflow: hidden;
              display: block;
            }
            
            .reveal-text span {
              display: block;
            }
            
            .is-active .reveal-text span {
              transform: translateY(0);
            }
            
            .section-number {
              position: absolute;
              left: 4%;
              top: 50%;
              transform: translateY(-50%);
              font-size: 12vw;
              font-weight: 900;
              opacity: 0.05;
              line-height: 1;
              pointer-events: none;
              color: var(--text-color);
            }

            .location-section {
              scroll-snap-align: start;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding-top: 100px !important;
              position: relative;
              overflow: hidden;
              background: var(--bg-color);
              color: var(--text-color);
              transition: background-color 0.3s ease, color 0.3s ease;
            }
          }

          /* General Layout Structure with complete height containment fixes */
          .artists-section, .product-section {
            position: relative !important;
            overflow: hidden !important;
          }

          @media (max-width: 1023px) {
            .site-header-fixed {
              flex-direction: column !important;
              padding: 15px 4% !important;
              gap: 10px !important;
            }
            .site-header-fixed > div:first-child {
              display: none;
            }
            .hero-section {
              flex-direction: column;
              padding-top: 140px !important;
              height: auto !important;
              min-height: 100vh;
              padding-bottom: 60px !important;
            }
            .hero-side {
              position: static !important;
              transform: none !important;
              max-width: 100% !important;
              margin-top: 3rem;
              order: 2;
            }
            .artists-section, .product-section {
              height: auto !important;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
          }

          .site-header-fixed {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            background: ${theme === 'dark' ? 'rgba(10, 10, 10, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
            backdrop-filter: blur(12px);
            transition: all 0.3s ease;
            border-bottom: 1px solid var(--border-color);
          }

          .custom-lang-selector select option {
            background: var(--bg-color);
            color: var(--text-color);
          }
          .artist-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
          }
          .info-block {
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .info-block:last-child {
            border-bottom: none;
          }
          .button {
            background: var(--text-color);
            color: var(--bg-color);
            padding: 0.8rem 2rem;
            border-radius: 100px;
            text-decoration: none;
            font-weight: 600;
            transition: opacity 0.2s ease;
            display: inline-block;
          }
          .button:hover {
            opacity: 0.9;
          }
          .button-outline {
            border: 1px solid var(--text-color);
            color: var(--text-color);
            padding: 0.8rem 2rem;
            border-radius: 100px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.2s ease;
            display: inline-block;
          }
          .button-outline:hover {
            background: var(--text-color);
            color: var(--bg-color);
          }
          .view-gallery {
            color: var(--text-color);
            text-decoration: underline;
            font-size: 0.85rem;
            letter-spacing: 0.1em;
          }
          .stats-section {
            position: relative;
            min-height: 45vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: var(--bg-color);
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            width: 100%;
            max-width: 1400px;
            gap: clamp(2rem, 5vw, 5rem);
            z-index: 2;
            text-align: center;
          }
          @media (min-width: 1024px) {
            .stats-grid {
              grid-template-columns: repeat(5, 1fr);
            }
          }
          .stat-icon {
            font-size: clamp(1.4rem, 3vw, 2.5rem);
            margin-bottom: clamp(1rem, 2vw, 1.5rem);
            opacity: 0.8;
            color: var(--text-color);
          }
          .stat-number {
            font-size: clamp(2.2rem, 7.5vw, 4.8rem);
            font-weight: 800;
            line-height: 1;
            margin-bottom: 0.5rem;
          }
          .stat-label {
            font-size: clamp(0.6rem, 1.2vw, 0.75rem);
            letter-spacing: 0.2em;
            opacity: 0.7;
          }
        `}} />
        
        <header className="site-header-fixed" style={{ 
          display: 'flex', 
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          alignItems: 'center', 
          padding: '20px 4%',
          gap: '1.5rem'
        }}>
          <div style={{ flex: 1, minWidth: '80px' }}></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div className="brand" style={{ fontSize: '1.25rem', letterSpacing: '0.2em' }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                NEXO STUDIO TATTOO
              </Link>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'flex-end' }}>
            <button 
              onClick={toggleTheme}
              className={`accessibility-toggle theme-${theme}`}
              aria-label="Toggle Accessibility Theme"
              style={{
                background: 'transparent',
                color: 'currentColor',
                border: '1px solid currentColor',
                padding: '0 16px',
                fontFamily: 'inherit',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                height: '40px',
                borderRadius: '20px'
              }}
            >
              <span className="theme-icon">{theme === 'dark' ? '☀' : '☾'}</span>
              <span className="theme-text">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
            </button>

            <div className="custom-lang-selector" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                pointerEvents: 'none',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                {currentLangConfig.flag}
              </div>
              <select
                value={language || 'english'}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                style={{
                  background: 'transparent',
                  color: 'currentColor',
                  border: '1px solid currentColor',
                  padding: '0 36px 0 42px',
                  fontFamily: 'inherit',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  height: '40px',
                  borderRadius: '20px'
                }}
              >
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                  <option key={code} value={code}>
                    {lang.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <span style={{ position: 'absolute', right: '16px', pointerEvents: 'none', fontSize: '0.55rem' }}>▼</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <motion.section 
          className="hero-section fade-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionFadeVariants}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: -1,
              opacity: theme === 'dark' ? 0.3 : 0.15,
              filter: 'grayscale(100%)',
              pointerEvents: 'none'
            }}
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
          <motion.div 
            className="hero-copy"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.p className="eyebrow" variants={fadeInUpVariants}>STUDIO</motion.p>
            <motion.h1 variants={containerVariants}>
              {splitTagline.map((char, index) => (
                <motion.span key={index} variants={characterVariants}>
                  {char}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p className="hero-description" variants={fadeInUpVariants}>
              {t("description")}
            </motion.p>
            <motion.div className="hero-actions" variants={fadeInUpVariants}>
              <Link className="button" href="/contact">
                {t("booking").toUpperCase()}
              </Link>
              <Link className="button-outline" href="/shop">
                SHOP STORE
              </Link>
            </motion.div>
          </motion.div> 

          <motion.aside className="hero-side">
            <motion.div 
              className="info-panel"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            >
              {contacts.map((block) => (
                <motion.div key={block.title} className="info-block" variants={fadeInUpVariants}>
                  <h2>{block.title}</h2>
                  {block.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </motion.aside>
        </motion.section>

        {/* Stats Section */}
        <section className="stats-section snap-section">
          <div 
            className="parallax-bg" 
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80")',
              opacity: theme === 'dark' ? 0.3 : 0.1,
              zIndex: 1
            }} 
          />
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="stat-item"
                whileHover="hover"
                style={{ cursor: 'default' }}
              >
                <motion.div 
                  className="stat-icon"
                  variants={{
                    hover: { scale: 1.3 }
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {stat.icon}
                </motion.div>
                <div className="stat-number">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="stat-label">{stat.label.toUpperCase()}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Artists Section */}
        <motion.section 
          id="artists" 
          className="artists-section fade-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionFadeVariants}
        >
          <div className="section-number"></div>
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
              opacity: 0.05,
              backgroundImage: 'url("https://www.svgrepo.com/show/155307/ink-splash.svg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: theme === 'dark' ? 'invert(1)' : 'none',
              pointerEvents: 'none'
            }}
          />
          <InkBlot variant={2} style={{ top: '10%', right: '-15%', width: '90%', height: '90%', transform: 'rotate(45deg)' }} />
          <InkBlot variant={3} style={{ bottom: '0', left: '-10%', width: '70%', height: '70%', transform: 'rotate(-20deg)' }} />
          
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.p className="eyebrow" variants={fadeInUpVariants}>ARTISTS</motion.p>
            <motion.h2 variants={containerVariants}>
              {splitArtistsTitle.map((char, index) => (
                <motion.span key={index} variants={characterVariants}>{char}</motion.span>
              ))}
            </motion.h2>
          </motion.div>
          
          {/* Autoplay Slider Track Wrapper */}
          <div 
            className="carousel-container" 
            style={{ position: 'relative', overflow: 'hidden' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div 
              className="artist-carousel-track" 
              style={{ 
                display: 'flex', 
                transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                transform: `translateX(-${currentArtistIndex * 100}%)`,
                willChange: 'transform'
              }}
            >
              {artists.map((artist) => (
                <div 
                  key={artist.name} 
                  style={{ 
                    minWidth: '100%', 
                    padding: '0 20px',
                    boxSizing: 'border-box'
                  }}
                >
                  <motion.article 
                    className="artist-card" 
                    style={{ maxWidth: '800px', margin: '0 auto' }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                      hidden: { scale: 0.95, opacity: 0 },
                      visible: { 
                        scale: 1, 
                        opacity: 1,
                        transition: { duration: 0.6 }
                      }
                    }}
                  >
                    <div className="artist-image">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        width={800}
                        height={800}
                        className="artist-photo object-cover rounded-lg"
                      />
                    </div>
                    <div className="artist-copy" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                      <h3>{artist.name}</h3>
                      <p className="my-2">{t(artist.descKey)}</p>
                      <div>
                        <Link className="view-gallery inline-block mt-2" href="/contact">
                          {t("bookAppointment").toUpperCase()}
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                </div>
              ))}
            </div>

            {/* Manual navigation buttons */}
            <button 
              onClick={prevArtist}
              className="carousel-control prev"
              aria-label="Previous artist"
              style={{
                position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
                background: 'var(--control-bg)', border: '1px solid var(--border-color)', color: 'currentColor',
                width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ←
            </button>
            <button 
              onClick={nextArtist}
              className="carousel-control next"
              aria-label="Next artist"
              style={{
                position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                background: 'var(--control-bg)', border: '1px solid var(--border-color)', color: 'currentColor',
                width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              →
            </button>

            {/* Indicators */}
            <div className="carousel-indicators" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
              {artists.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentArtistIndex(i)}
                  style={{
                    width: '10px', height: '10px', borderRadius: '50%', border: 'none',
                    background: i === currentArtistIndex ? 'var(--text-color)' : 'rgba(128,128,128,0.4)',
                    cursor: 'pointer', padding: 0, transition: 'background 0.3s'
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Location Section */}
        <motion.div 
          style={{ position: 'relative' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionFadeVariants}
        >
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
              opacity: 0.05,
              backgroundImage: 'url("https://www.svgrepo.com/show/532390/ink-splash.svg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: theme === 'dark' ? 'invert(1)' : 'none',
              pointerEvents: 'none'
            }}
          />
          <LocationMap />
        </motion.div>

        {/* Aftercare & Marketplace Section */}
        <motion.section 
          className="product-section fade-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionFadeVariants}
        >
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
              opacity: 0.05,
              backgroundImage: 'url("https://www.svgrepo.com/show/532394/ink-splash.svg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: theme === 'dark' ? 'invert(1)' : 'none',
              pointerEvents: 'none'
            }}
          />
          <InkBlot variant={3} style={{ top: '-20%', right: '0', width: '100%', height: '100%', transform: 'rotate(10deg)' }} />
          <InkBlot variant={1} style={{ bottom: '-15%', left: '0', width: '60%', height: '60%', transform: 'rotate(-30deg)' }} />
          
          <motion.div 
            className="product-copy"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.p className="eyebrow" variants={fadeInUpVariants}>{t('marketplace')}</motion.p>
            <motion.h2 variants={containerVariants}>
              {splitAftercareTitle.map((char, index) => (
                <motion.span key={index} variants={characterVariants}>{char}</motion.span>
              ))}
            </motion.h2>
            <motion.p style={{ marginBottom: "1.5rem" }} variants={fadeInUpVariants}>
              {t('aftercareDescription')}
            </motion.p>
            
            <motion.ul 
              className="marketplace-list" 
              style={{ 
                listStyle: "none", 
                padding: 0, 
                margin: "0 0 2rem 0",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}
              variants={fadeInUpVariants}
            >
              <li style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Icons.Gift />
                {t('giftCards')}
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Icons.Machine />
                {t('flashTattoos')}
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Icons.Ink />
                {t('aftercareProduct')}
              </li>
            </motion.ul>
            
            <motion.div className="product-action" variants={fadeInUpVariants}>
              <Link className="button button-outline" href="/shop">
                {t('shopNow')}
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>
        
        <SocialLinks />
      </main>

      <FloatingSocials />
      <ScrollToTopButton />
    </>
  );
}