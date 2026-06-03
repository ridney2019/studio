'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  LanguageCode,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getBrowserLanguage,
  getSavedLanguage,
  saveLanguage,
} from '@/lib/languages';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  isHydrated: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    const saved = getSavedLanguage();
    const detected = getBrowserLanguage();
    const initial = saved || detected;
    
    setLanguageState(initial);
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = initial;
    }
    setIsHydrated(true);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    saveLanguage(lang);
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  // Always provide context, even during hydration
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isHydrated,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
