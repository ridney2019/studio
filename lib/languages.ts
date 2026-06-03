// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  pt: { name: 'Português', flag: '🇧🇷' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  ja: { name: '日本語', flag: '🇯🇵' },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Default language
export const DEFAULT_LANGUAGE: LanguageCode = 'en';

// Get browser language
export const getBrowserLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  
  if (browserLang in SUPPORTED_LANGUAGES) {
    return browserLang as LanguageCode;
  }
  
  return DEFAULT_LANGUAGE;
};

// Get language from localStorage
export const getSavedLanguage = (): LanguageCode | null => {
  if (typeof window === 'undefined') return null;
  
  const saved = localStorage.getItem('preferred-language');
  if (saved && saved in SUPPORTED_LANGUAGES) {
    return saved as LanguageCode;
  }
  
  return null;
};

// Save language to localStorage
export const saveLanguage = (lang: LanguageCode): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', lang);
  }
};
