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
  { name: "CARLA MORALES", image: "/artists/carla-morales.jpg", style: "FINE LINE & FLORAL", descKey: "artistCarlaDesc" as TranslationKey },
  { name: "ZACK", image: "/artists/zack.jpg", style: "TRADITIONAL INK", descKey: "artistZackDesc" as TranslationKey },
  { name: "VICTORIA", image: "/artists/victoria.jpg", style: "NEO-TRADITIONAL", descKey: "artistVictoriaDesc" as TranslationKey },
  { name: "OWEN", image: "/artists/owen.jpg", style: "GEOMETRIC / DOTWORK", descKey: "artistOwenDesc" as TranslationKey },
  { name: "CONOR", image: "/artists/conor.jpg", style: "JAPANESE OREINTAL", descKey: "artistConorDesc" as TranslationKey },
  { name: "SARAH MORGAN", image: "/artists/sarah-morgan.jpg", style: "WATERCOLOR ART", descKey: "artistSarahDesc" as TranslationKey },
  { name: "ELIAS SILVA", image: "/artists/elias-silva.jpg", style: "CHICANO CULTURE", descKey: "artistEliasDesc" as TranslationKey },
];

const contacts = [
  { title: "LOCATION", lines: ["101-103 Francis St, The Liberties", "Dublin 8, D08 FHP9"] },
  { title: "HOURS OF OPERATION", lines: ["11AM TO 7PM | MON - SUN", "CLOSED TUESDAY"] },
  { title: "CONTACT US", lines: ["nexostudiosltd@gmail.com"] },
];

export default function Home() {
  const { t, isHydrated } = useTranslation();
  const { theme, toggleTheme, language, setLanguage } = useLanguage();

  const snapContainerRef = useRef<HTMLDivElement>(null);
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
          
          body {
            color: var(--text-color);
            background-color: var(--bg-color);
            overflow-x: hidden;
            margin: 0;
            padding: 0;
            letter-spacing: -0.01em;
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
          }
          .stat-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.2em;
            opacity: 0.4;
          }
        `}} />
        
        {/* Navigation Bar */}
        <header className="site-header-fixed">
          <div className="brand" style={{ fontWeight: 900, fontSize: '1.15rem', letterSpacing: '0.25em' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
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
                          RESERVE CONSULTATION
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

        {/* Aftercare Store Marketplace Section */}
        <motion.section 
          className="product-section fade-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionFadeVariants}
        >
          <InkBlot variant={3} style={{ bottom: '-10%', left: '-5%', width: '70%', height: '70%' }} />
          
          <div style={{ maxWidth: '640px' }}>
            <p className="eyebrow">{t('marketplace')}</p>
            <h2>
              {isHydrated && t("aftercareTitle").split(" ").map((word, wIdx, arr) => (
                <span key={wIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                  {word.split("").map((char, cIdx) => (
                    <span key={cIdx} style={{ display: 'inline-block' }}>{char}</span>
                  ))}
                  {wIdx < arr.length - 1 && "\u00A0"}
                </span>
              ))}
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.7, marginBottom: '2.5rem' }}>
              {t('aftercareDescription')}
            </p>
            
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 3.5rem 0", display: "flex", flexDirection: "column", gap: "1.2rem", fontWeight: 600, fontSize: '0.95rem' }}>
              <li style={{ display: "flex", alignItems: "center", gap: "1rem", borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <Icons.Gift /> {t('giftCards')}
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "1rem", borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <Icons.Machine /> {t('flashTattoos')}
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "1rem", borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <Icons.Ink /> {t('aftercareProduct')}
              </li>
            </ul>
            
            <div>
              <Link className="nike-btn" href="/shop">
                EXPLORE GALLERY STORE
              </Link>
            </div>
          </div>
        </motion.section>
        
        <SocialLinks />
      </main>

      <FloatingSocials />
      <ScrollToTopButton />
    </>
  );
}