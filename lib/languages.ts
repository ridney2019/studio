export type LanguageCode =
  | 'arabic' | 'azerbaijani' | 'catalan' | 'chinese' | 'croatian'
  | 'czech' | 'danish' | 'dutch' | 'english' | 'estonian'
  | 'farsi' | 'french' | 'german' | 'hebrew' | 'hungarian'
  | 'italian' | 'macedonian' | 'norwegian' | 'portuguese-br' | 'portuguese-pt'
  | 'romanian' | 'russian' | 'spanish' | 'swedish' | 'turkish' | 'ukrainian';

export const DEFAULT_LANGUAGE: LanguageCode = 'english';

export const SUPPORTED_LANGUAGES: Record<LanguageCode, { name: string; flag: string }> = {
  arabic: { name: 'العربية', flag: '🇦🇪' },
  azerbaijani: { name: 'Azerbaijani', flag: '🇦🇿' },
  catalan: { name: 'Català', flag: '🇪🇸' },
  chinese: { name: '中文', flag: '🇨🇳' },
  croatian: { name: 'Hrvatski', flag: '🇭🇷' },
  czech: { name: 'Čeština', flag: '🇨🇿' },
  danish: { name: 'Dansk', flag: '🇩🇰' },
  dutch: { name: 'Nederlands', flag: '🇳🇱' },
  english: { name: 'English', flag: '🇬🇧' },
  estonian: { name: 'Estonian', flag: '🇪🇪' },
  farsi: { name: 'Persian', flag: '🇮🇷' },
  french: { name: 'Français', flag: '🇫🇷' },
  german: { name: 'Deutsch', flag: '🇩🇪' },
  hebrew: { name: 'עברית', flag: '🇮🇱' },
  hungarian: { name: 'Magyar', flag: '🇭🇺' },
  italian: { name: 'Italiano', flag: '🇮🇹' },
  macedonian: { name: 'Macedonian', flag: '🇲🇰' },
  norwegian: { name: 'Norwegian', flag: '🇳🇴' },
  'portuguese-br': { name: 'Português (BR)', flag: '🇧🇷' },
  'portuguese-pt': { name: 'Português (PT)', flag: '🇵🇹' },
  romanian: { name: 'Română', flag: '🇷🇴' },
  russian: { name: 'Русский', flag: '🇷🇺' },
  spanish: { name: 'Español', flag: '🇪🇸' },
  swedish: { name: 'Svenska', flag: '🇸🇪' },
  turkish: { name: 'Türkçe', flag: '🇹🇷' },
  ukrainian: { name: 'Українська', flag: '🇺🇦' }
};

export function getBrowserLanguage(): LanguageCode {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const navLang = navigator.language.toLowerCase().split('-')[0];
  
  const mapping: Record<string, LanguageCode> = {
    ar: 'arabic', az: 'azerbaijani', ca: 'catalan', zh: 'chinese', hr: 'croatian',
    cs: 'czech', da: 'danish', nl: 'dutch', en: 'english', et: 'estonian',
    fa: 'farsi', fr: 'french', de: 'german', he: 'hebrew', hu: 'hungarian',
    it: 'italian', mk: 'macedonian', no: 'norwegian', ro: 'romanian', ru: 'russian',
    es: 'spanish', sv: 'swedish', tr: 'turkish', uk: 'ukrainian'
  };

  if (navLang === 'pt') {
    return navigator.language.toLowerCase().includes('br') ? 'portuguese-br' : 'portuguese-pt';
  }

  return mapping[navLang] || DEFAULT_LANGUAGE;
}

export function getSavedLanguage(): LanguageCode | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('app-lang') as LanguageCode | null;
}

export function saveLanguage(lang: LanguageCode): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('app-lang', lang);
  }
}