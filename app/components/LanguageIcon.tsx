'use client';

import { LanguageCode } from '@/lib/languages';

interface LanguageIconProps {
  lang: LanguageCode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 18,
  md: 24,
  lg: 32,
};

export function LanguageIcon({ lang, size = 'md' }: LanguageIconProps) {
  const iconSize = sizeMap[size];

  const icons: Record<LanguageCode, JSX.Element> = {
    en: (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        title="English"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M4 12h16" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20z" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    pt: (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        title="Português"
      >
        <circle cx="12" cy="12" r="11" fill="#093b39" />
        <rect x="2" y="2" width="20" height="8" fill="#ecc81e" />
        <polygon points="12,8 16,12 12,16 8,12" fill="#003da5" />
      </svg>
    ),
    es: (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        title="Español"
      >
        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="#c60c1f" />
        <rect x="2" y="8" width="20" height="8" fill="#ffc400" />
        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    fr: (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        title="Français"
      >
        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
        <rect x="2" y="2" width="7" height="20" fill="#002395" />
        <rect x="9" y="2" width="6" height="20" fill="#fff" />
        <rect x="15" y="2" width="7" height="20" fill="#ED2939" />
      </svg>
    ),
    de: (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        title="Deutsch"
      >
        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
        <rect x="2" y="2" width="20" height="7" fill="#000" />
        <rect x="2" y="9" width="20" height="7" fill="#D00" />
        <rect x="2" y="16" width="20" height="6" fill="#FFCE00" />
      </svg>
    ),
    it: (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        title="Italiano"
      >
        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
        <rect x="2" y="2" width="7" height="20" fill="#009246" />
        <rect x="9" y="2" width="6" height="20" fill="#fff" />
        <rect x="15" y="2" width="7" height="20" fill="#ce2b37" />
      </svg>
    ),
    ja: (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        title="日本語"
      >
        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="#fff" />
        <circle cx="12" cy="12" r="5" fill="#bc002d" />
      </svg>
    ),
  };

  return icons[lang];
}
