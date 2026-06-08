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
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [isHydrated, setIsHydrated] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initialize language on mount
  useEffect(() => {
    const saved = getSavedLanguage();
    const detected = getBrowserLanguage();
    const initial = saved || detected;
    
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light-theme', savedTheme === 'light');
    }
    
    setLanguageState(initial);
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = initial;
    }
    setIsHydrated(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light-theme', newTheme === 'light');
  };

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
        theme,
        toggleTheme,
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
