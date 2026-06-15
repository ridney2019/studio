"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "../hooks/useTranslation";

export function CookieBanner() {
  const { t, isHydrated } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner with a slight delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      // Trigger entry animation shortly after mounting
      const animTimer = setTimeout(() => setIsAnimating(true), 1100);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(animTimer);
      };
    }
  }, []);

  const handleConsent = (choice: "accepted" | "customized") => {
    setIsAnimating(false);
    // Allow time for exit animation before unmounting
    setTimeout(() => {
      localStorage.setItem("cookie-consent", choice);
      setIsVisible(false);
    }, 500);
  };

  if (!isHydrated || !isVisible) return null;

  return (
    <div 
      className="cookie-banner-overlay"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        pointerEvents: "none"
      }}
    >
      <div 
        className="cookie-banner"
        style={{
          backgroundColor: "var(--background-color, #111)",
          border: "1px solid var(--border-color, #333)",
          padding: "2rem",
          borderRadius: "4px",
          width: "380px",
          maxWidth: "calc(100vw - 4rem)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          pointerEvents: "auto",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: isAnimating ? 1 : 0,
          transform: isAnimating ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)"
        }}
      >
        <div className="cookie-content">
          <div className="cookie-icon" style={{ marginBottom: "1.25rem", display: "flex", justifyContent: "flex-start" }}>
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="var(--accent-color, #f39c12)" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
              <path d="M8.5 8.5v.01" />
              <path d="M16 15.5v.01" />
              <path d="M12 12v.01" />
              <path d="M11 17v.01" />
              <path d="M7 14v.01" />
            </svg>
          </div>
          <div className="cookie-text">
            <h3 style={{ textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>{t('cookiePolicy')}</h3>
            <p style={{ opacity: 0.8, fontSize: "0.9rem", lineHeight: "1.5" }}>
              {t('cookieDescription') || "We use cookies to improve your experience and analyze traffic. Choose your preference below."}
            </p>
          </div>
          <div className="cookie-actions" style={{ marginTop: "2rem", display: "flex", gap: "1rem", width: "100%" }}>
            <button 
              onClick={() => handleConsent("customized")} 
              className="button-outline"
              style={{ flex: 1, fontSize: "0.8rem" }}
            >
              {t('customize' as any) || "CUSTOMIZE"}
            </button>
            <button 
              onClick={() => handleConsent("accepted")} 
              className="button"
              style={{ flex: 1, fontSize: "0.8rem" }}
            >
              {t('acceptAll' as any) || "ACCEPT ALL"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}