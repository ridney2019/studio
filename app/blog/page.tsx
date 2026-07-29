"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/providers";
import { SocialLinks } from "@/app/components/SocialLinks";
import ScrollToTopButton from "@/app/components/ScrollToTopButton";
import FloatingSocials from "@/app/components/FloatingSocials";
import GlobalMenu from "@/app/components/GlobalMenu";

// Mock Database for Studio Blog Articles
const BLOG_POSTS = [
  {
    id: "fine-line-blackwork",
    title: "The Renaissance of Fine-Line Blackwork",
    description: "An exploration into the structural physics and minimalistic philosophy transforming modern skin art into high-end luxury.",
    date: "JUNE 12, 2026",
    author: "Gabriel Nexo",
    readTime: "5 MIN READ",
    category: "INSIGHTS",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800",
    featured: true
  },
  {
    id: "ink-chemistry-safety",
    title: "Beneath the Surface: Modern Ink Chemistry",
    description: "A comprehensive look at organic pigment compounds, allergen safety updates, and how premium composition preserves micro-lines over decades.",
    date: "MAY 28, 2026",
    author: "Dr. Elena Rostova",
    readTime: "8 MIN READ",
    category: "FINE LINE",
    image: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=800",
    featured: false
  },
  {
    id: "minimalist-placement-guide",
    title: "Geometry & Anatomy: The Art of Placement",
    description: "How structural muscle flow dictates where minimalist designs should live. Master the alignment balance before hitting the needle.",
    date: "APRIL 14, 2026",
    author: "Sasha Vane",
    readTime: "4 MIN READ",
    category: "DESIGN",
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800",
    featured: false
  },
  {
    id: "aftercare-physics-healing",
    title: "The Physics of Dermal Healing Over Time",
    description: "Ditching old myths for advanced scientific methods. Why medical-grade breathable barriers radically alter long-term crispness.",
    date: "MARCH 03, 2026",
    author: "Gabriel Nexo",
    readTime: "6 MIN READ",
    category: "AFTERCARE",
    image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&q=80&w=800",
    featured: false
  }
];

const BlogIcons = {
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  User: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Clock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
};

export default function BlogPage() {
  const { t, isHydrated } = useTranslation();
  const { theme, toggleTheme } = useLanguage();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Extract separate layout entries
  const featuredPost = useMemo(() => BLOG_POSTS.find(p => p.featured), []);
  const categories = useMemo(() => ["ALL", ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))], []);

  // Filter Pipeline Engine
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      if (post.featured) return false; // Don't repeat the hero article below
      const matchesCategory = selectedCategory === "ALL" || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isHydrated) return null;

  return (
    <>
      <main className="contact-shell loaded relative" style={{ minHeight: "100vh" }}>
        
        {/* Universal Studio Header Mapping */}
        <header className="site-header fade-section">
          <button 
            onClick={toggleTheme}
            className="accessibility-toggle"
            aria-label="Toggle Accessibility Theme"
          >
            {theme === 'dark' ? '☀ LIGHT MODE' : '☾ DARK MODE'}
          </button>
          
          <a href="/" className="brand" style={{ textDecoration: "none", color: "inherit", letterSpacing: "2px" }}>
            NEXO STUDIO JOURNAL
          </a>
          
          <GlobalMenu />
        </header>

        {/* SECTION 1: HERO FEATURED ARTICLE COLUMN */}
        {featuredPost && (
          <section style={{ padding: "120px 4% 60px 4%", borderBottom: "1px solid var(--border-color, #222)" }}>
            <p className="eyebrow" style={{ color: "var(--accent-color, #888)", letterSpacing: "3px", fontSize: "0.75rem", marginBottom: "2rem" }}>
              FEATURED ESSAY
            </p>
            
            <a href={`/blog/${featuredPost.id}`} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "48px", textDecoration: "none", color: "inherit" }} className="blog-card">
              {/* Image Box Frame with fix layers */}
              <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", borderRadius: "4px", border: "1px solid var(--border-color, #333)", transform: "translateZ(0)", isolation: "isolate" }}>
                <Image 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  fill
                  priority
                  style={{ objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
                  className="hover-zoom"
                />
                <div style={{ position: "absolute", top: "24px", left: "24px", background: "rgba(0,0,0,0.85)", padding: "6px 14px", fontSize: "0.65rem", letterSpacing: "2px", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)", zIndex: 2 }}>
                  {featuredPost.category}
                </div>
              </div>

              {/* Text Layout Metadata column */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", fontSize: "0.75rem", color: "#888", letterSpacing: "0.5px" }}>
                  <span>{featuredPost.date}</span>
                  <span style={{ opacity: 0.3 }}>|</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><BlogIcons.User /> BY {featuredPost.author.toUpperCase()}</span>
                  <span style={{ opacity: 0.3 }}>|</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><BlogIcons.Clock /> {featuredPost.readTime}</span>
                </div>

                <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", textTransform: "uppercase", lineHeight: "1.15", letterSpacing: "0.5px" }}>
                  {featuredPost.title}
                </h1>

                <p style={{ color: "var(--accent-color, #aaa)", lineHeight: "1.7", fontSize: "1.05rem", fontWeight: "300" }}>
                  {featuredPost.description}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.8rem", fontWeight: "bold", letterSpacing: "2px", marginTop: "1rem" }}>
                  READ MANUSCRIPT <BlogIcons.ArrowRight />
                </div>
              </div>
            </a>
          </section>
        )}

        {/* SECTION 2: ARCHIVE QUERY & GRID NAVIGATION FILTER */}
        <section style={{ padding: "60px 4% 100px 4%" }}>
          
          {/* Controls Bar */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "24px", marginBottom: "48px", paddingBottom: "24px", borderBottom: "1px solid var(--border-color, #222)" }}>
            
            {/* Category selection pill stack */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: selectedCategory === cat ? "#fff" : "transparent",
                    color: selectedCategory === cat ? "#000" : "var(--accent-color, #888)",
                    border: `1px solid ${selectedCategory === cat ? "#fff" : "var(--border-color, #333)"}`,
                    padding: "6px 16px",
                    fontSize: "0.7rem",
                    letterSpacing: "1px",
                    cursor: "pointer",
                    borderRadius: "2px",
                    transition: "all 0.3s ease",
                    fontWeight: selectedCategory === cat ? "bold" : "normal"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Clean Modular Search Engine Field */}
            <div style={{ position: "relative", minWidth: "260px" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666", display: "flex" }}>
                <BlogIcons.Search />
              </span>
              <input 
                type="text" 
                placeholder="SEARCH JOURNAL..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 16px 10px 40px",
                  fontSize: "0.75rem",
                  letterSpacing: "1px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border-color, #333)",
                  color: "#fff",
                  outline: "none",
                  borderRadius: "2px"
                }}
              />
            </div>
          </div>

          {/* Grid Layout Core Wrapper */}
          {filteredPosts.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "48px 32px" }}>
              {filteredPosts.map(post => (
                <a key={post.id} href={`/blog/${post.id}`} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: "20px" }} className="blog-card">
                  
                  {/* Photo Node */}
                  <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", borderRadius: "4px", border: "1px solid var(--border-color, #333)", transform: "translateZ(0)", isolation: "isolate" }}>
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill
                      style={{ objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
                      className="hover-zoom"
                    />
                    <div style={{ position: "absolute", bottom: "16px", left: "16px", background: "rgba(0,0,0,0.85)", padding: "4px 10px", fontSize: "0.6rem", letterSpacing: "1px", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {post.category}
                    </div>
                  </div>

                  {/* Metadata Fields Line */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.65rem", color: "#666", letterSpacing: "0.5px" }}>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><BlogIcons.Clock /> {post.readTime}</span>
                  </div>

                  {/* Headers & Copy Text block */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <h3 style={{ fontSize: "1.3rem", lineHeight: "1.3", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {post.title}
                    </h3>
                    
                    {/* Author block explicitly positioned directly under title */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.65rem", color: "var(--accent-color, #888)", textTransform: "uppercase" }}>
                      <BlogIcons.User /> written by {post.author}
                    </div>

                    <p style={{ color: "#888", lineHeight: "1.6", fontSize: "0.9rem", marginTop: "4px" }}>
                      {post.description}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.7rem", fontWeight: "bold", letterSpacing: "1px", marginTop: "auto" }}>
                    OPEN ENTRY <BlogIcons.ArrowRight />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            /* Empty Search States Layout */
            <div style={{ padding: "80px 0", textAlign: "center", border: "1px dashed #222", borderRadius: "4px" }}>
              <p style={{ color: "#555", fontSize: "0.85rem", letterSpacing: "1px" }}>
                NO JOURNAL ENTRIES MATCHED YOUR FILTER CRITERIA
              </p>
            </div>
          )}
        </section>

        {/* Global Structural Layout Addons */}
        <SocialLinks />
      </main>

      <FloatingSocials />
      <ScrollToTopButton />
    </>
  );
}