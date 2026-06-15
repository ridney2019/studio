"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "../hooks/useTranslation";

export function CookieBanner() {
  const { t, isHydrated } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: false,
  });

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

  const handleConsent = (choice: "accepted" | "customized" | "save") => {
    if (choice === "customized") {
      setShowPreferences(true);
      return;
    }

    setIsAnimating(false);
    // Allow time for exit animation before unmounting
    setTimeout(() => {
      const consentValue = choice === "accepted" 
        ? "accepted" 
        : JSON.stringify({ necessary: true, ...preferences });
      localStorage.setItem("cookie-consent", consentValue);
      setIsVisible(false);
    }, 500);
  };

  const dismissBanner = () => {
    setIsAnimating(false);
    // Dismiss visually without saving preference to localStorage
    setTimeout(() => {
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
      <style dangerouslySetInnerHTML={{
        __html: `
        .cookie-icon-wrapper svg {
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .cookie-banner:hover .cookie-icon-wrapper svg {
          transform: rotate(15deg) scale(1.1);
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0px 0px rgba(243, 156, 18, 0); }
          50% { box-shadow: 0 0 8px 2px rgba(243, 156, 18, 0.7); }
        }
      `}} />
      <div 
        className="cookie-banner"
        style={{
          position: "relative",
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
        <button 
          onClick={dismissBanner}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            color: "inherit",
            opacity: 0.5,
            transition: "opacity 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="cookie-content">
          {!showPreferences ? (
            <>
              <div 
                className="cookie-icon-wrapper" 
                style={{ 
                  marginBottom: "1.25rem", 
                  display: "flex", 
                  justifyContent: "flex-start",
                  transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isAnimating ? "rotate(0deg)" : "rotate(-30deg) scale(0.9)"
                }}
              >
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
                  style={{ flex: 1, fontSize: "0.8rem", animation: "pulseGlow 2s infinite ease-in-out" }}
                >
                  {t('acceptAll' as any) || "ACCEPT ALL"}
                </button>
              </div>
            </>
          ) : (
            <div className="cookie-preferences">
              <h3 style={{ textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.5rem", fontSize: "1.1rem" }}>{t('preferences' as any) || "CONSENT PREFERENCES"}</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "bold" }}>{t('necessary' as any) || "Strictly Necessary"}</p>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", opacity: 0.6, lineHeight: "1.4" }}>Required for the website to function properly.</p>
                  </div>
                  <input type="checkbox" checked disabled style={{ width: "16px", height: "16px", cursor: "not-allowed", accentColor: "var(--accent-color, #f39c12)" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "bold" }}>{t('analytics' as any) || "Performance & Analytics"}</p>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", opacity: 0.6, lineHeight: "1.4" }}>Allows us to understand how visitors interact with the site.</p>
                  </div>
                  <input type="checkbox" checked={preferences.analytics} onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })} style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--accent-color, #f39c12)" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "bold" }}>{t('marketing' as any) || "Marketing & Targeting"}</p>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", opacity: 0.6, lineHeight: "1.4" }}>Used to deliver more relevant ads and track campaigns.</p>
                  </div>
                  <input type="checkbox" checked={preferences.marketing} onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })} style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--accent-color, #f39c12)" }} />
                </div>
              </div>

              <div className="cookie-actions" style={{ display: "flex", gap: "1rem", width: "100%" }}>
                <button onClick={() => handleConsent("save")} className="button-outline" style={{ flex: 1, fontSize: "0.8rem" }}>{t('saveSettings' as any) || "SAVE"}</button>
                <button onClick={() => handleConsent("accepted")} className="button" style={{ flex: 1, fontSize: "0.8rem" }}>{t('acceptAll' as any) || "ACCEPT ALL"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}