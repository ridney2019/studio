"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "../hooks/useTranslation";

export function CookieBanner() {
  const { t, isHydrated } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner with a slight delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice: "accepted" | "declined") => {
    localStorage.setItem("cookie-consent", choice);
    setIsVisible(false);
  };

  if (!isHydrated || !isVisible) return null;

  return (
    <div className="cookie-banner-overlay">
      <div className="cookie-banner">
        <div className="cookie-content">
          <div className="cookie-text">
            <p className="eyebrow">Privacy</p>
            <h3>Cookie Policy</h3>
            <p>
              We use cookies to enhance your experience and analyze our traffic. 
              By clicking "Accept", you consent to our use of cookies.
            </p>
          </div>
          <div className="cookie-actions">
            <button 
              onClick={() => handleConsent("accepted")} 
              className="button"
            >
              ACCEPT
            </button>
            <button 
              onClick={() => handleConsent("declined")} 
              className="button-outline"
            >
              DECLINE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}