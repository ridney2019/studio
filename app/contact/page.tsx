"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/providers";
import { SocialLinks } from "@/app/components/SocialLinks";
import ScrollToTopButton from "@/app/components/ScrollToTopButton";
import FloatingSocials from "@/app/components/FloatingSocials";

export default function ContactPage() {
  const { t, isHydrated } = useTranslation();
  const { theme, toggleTheme } = useLanguage();

  // State Management for Form Submission & Popup Overlays
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Grid entrance animation state
  const [animateGrid, setAnimateGrid] = useState(false);

  useEffect(() => {
    setAnimateGrid(true);
  }, []);

  if (!isHydrated) return null;

  return (
    <>
      {/* Main visual viewport layout container */}
      <main className="contact-shell loaded relative">
        
        {/* Exact Header Matched from Home Page */}
        <header className="site-header fade-section">
          <button 
            onClick={toggleTheme}
            className="accessibility-toggle"
            aria-label="Toggle Accessibility Theme"
          >
            {theme === 'dark' ? '☀ LIGHT MODE' : '☾ DARK MODE'}
          </button>
          
          <a href="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
            NEXO STUDIO TATTOO
          </a>
          
          <a className="appointment-link" href="/">
            RETURN HOME
          </a>
        </header>

        {/* Contact Hero Section */}
        <section className="contact-hero fade-section" style={{ paddingBottom: "2rem" }}>
          <div>
            <p className="eyebrow">EXPERIENCES</p>
            <h2 style={{ textTransform: "uppercase", letterSpacing: "1px", lineHeight: "1.3" }}>
              Let’s create the most unforgettable tattoo event for you & your brand
            </h2>
            <p style={{ marginTop: "1rem", maxWidth: "600px" }}>
              Whether you want to lock in a private milestone session, activate a corporate branding showcase, or walk right into the studio, explore our booking structures below.
            </p>
          </div>
        </section>

        {/* Booking Options Grid Section */}
        <section className="booking-options-section fade-section" style={{ padding: "0 2rem 4rem 2rem" }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes floatingIcon {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-6px); }
            }
          `}} />
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
              gap: "2.5rem",
              borderTop: "1px solid var(--border-color, #333)",
              paddingTop: "2.5rem"
            }}
          >
            {/* 01: Brand Activations */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.75rem",
              opacity: animateGrid ? 1 : 0,
              transform: animateGrid ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s'
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                animation: 'floatingIcon 4s ease-in-out infinite'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 12l10 10 10-10L12 2z"/>
                  <path d="M12 6l6 6-6 6-6-6 6-6z" opacity="0.5"/>
                </svg>
                <span style={{ fontSize: "0.8rem", color: "var(--accent-color, #888)", letterSpacing: "1px" }}>01</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", margin: "0.25rem 0 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>Brand Activations</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.5" }}>
                Book our resident talent for live corporate pop-ups, brand launches, VIP media mixers, and luxury curated events.
              </p>
            </div>

            {/* 02: Walk-Ins */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.75rem",
              opacity: animateGrid ? 1 : 0,
              transform: animateGrid ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s'
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                animation: 'floatingIcon 4s ease-in-out infinite 0.5s'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span style={{ fontSize: "0.8rem", color: "var(--accent-color, #888)", letterSpacing: "1px" }}>02</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", margin: "0.25rem 0 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>Walk-Ins</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.5" }}>
                Spontaneous ideas are always welcome. Drop directly by our Francis Street studio space for swift, same-day flash custom pieces.
              </p>
            </div>

            {/* 03: Group Sessions */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.75rem",
              opacity: animateGrid ? 1 : 0,
              transform: animateGrid ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s'
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                animation: 'floatingIcon 4s ease-in-out infinite 1s'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span style={{ fontSize: "0.8rem", color: "var(--accent-color, #888)", letterSpacing: "1px" }}>03</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", margin: "0.25rem 0 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>Group Sessions</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.5" }}>
                Reserve dedicated floor time for creative retreats, private celebrations, or custom party blocks with multiple artists.
              </p>
            </div>

            {/* 04: Matching Tattoos */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.75rem",
              opacity: animateGrid ? 1 : 0,
              transform: animateGrid ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s'
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                animation: 'floatingIcon 4s ease-in-out infinite 1.5s'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5-1.5-2.5-3.5-2.5-4.5s1-3 2.5-4.5 3.5-1.5 4.5 0l6 6c1 1.5 3 1.5 4.5 0s2.5-3.5 2.5-4.5-1-3-2.5-4.5-3.5-1.5-4.5 0l-6 6" />
                </svg>
                <span style={{ fontSize: "0.8rem", color: "var(--accent-color, #888)", letterSpacing: "1px" }}>04</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", margin: "0.25rem 0 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>Matching Tattoos</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.5" }}>
                Commemorate shared stories, partnerships, or bonds with clean, synchronized fine-line concepts tailored for pairs.
              </p>
            </div>
          </div>
        </section>
   
        {/* Contact Form & Info Grid */}
        <section className="contact-grid fade-section" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="contact-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p className="eyebrow" style={{ marginBottom: "0.25rem" }}>WORKSHOP PATH</p>
            <h2 style={{ margin: 0, textTransform: "uppercase" }}>Ready for a more structured tattoo training experience?</h2>
            <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.6 }}>
              The full workshop intake now lives on its own page so it feels more focused, easier to return to, and better suited for long-form mentorship conversations.
            </p>
            <a href="/workshop" className="button" style={{ width: "fit-content", textDecoration: "none" }}>
              Open workshop intake
            </a>
          </div>

          <div className="contact-card contact-info-card">
            <h2>{t('studioDetails')}</h2>
            <div className="info-block">
              <h3>{t('location')}</h3>
              <p>101-103 Francis St, The Liberties</p>
              <p>Dublin 8, D08 FHP9</p>
            </div>
            <div className="info-block">
              <h3>{t('hours')}</h3>
              <p>{t('timeOpen')}</p>
              <p>{t('tuesdayToSunday')}</p>
              <p>{t('closedMonday')}</p>
            </div>
            <div className="info-block">
              <h3>Booking</h3>
              <p>{t('textPreferred')}</p>
              <p>nexostudiosltd@gmail.com</p>
            </div>
          </div>
        </section>

        {/* Integrated Global Footer */}
        <SocialLinks />
      </main>

      {/* Modern Studio Success Overlay Modal Popup */}
      {showPopup && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div 
            style={{
              backgroundColor: "var(--background-color, #111)",
              border: "1px solid var(--border-color, #333)",
              padding: "3rem 2rem",
              textAlign: "center",
              maxWidth: "400px",
              width: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem"
            }}
          >
            {/* Elegant Fine-line Email Icon */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color, #fff)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            
            <div>
              <h3 style={{ textTransform: "uppercase", fontSize: "1.2rem", margin: "0 0 0.5rem 0", letterSpacing: "1px" }}>Thank You</h3>
              <p style={{ opacity: 0.8, fontSize: "0.95rem", margin: 0, lineHeight: "1.5" }}>
                Your message has been sent successfully. We will review your event configuration and get back to you shortly.
              </p>
            </div>

            <button 
              onClick={() => setShowPopup(false)} 
              className="button"
              style={{ padding: "0.5rem 2rem", fontSize: "0.85rem", width: "auto" }}
            >
              CLOSE WINDOW
            </button>
          </div>
        </div>
      )}

      {/* Floating Overlays Matched from Home Page Layout */}
      <FloatingSocials />
      <ScrollToTopButton />
    </>
  );
}