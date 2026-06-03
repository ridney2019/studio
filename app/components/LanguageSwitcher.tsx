'use client';

import { useLanguage } from '@/app/providers';
import { useTranslation } from '@/app/hooks/useTranslation';
import { LanguageCode } from '@/lib/languages';
import { useState, useRef, useEffect } from 'react';
import { LanguageIcon } from './LanguageIcon';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as any);
    setIsOpen(false);
  };

  const currentLang = supportedLanguages[language];

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.button}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('language')}
        aria-expanded={isOpen}
      >
        <LanguageIcon lang={language} size="sm" />
        <span className={styles.label}>{currentLang.name}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.menuHeader}>{t('selectLanguage')}</div>
          {Object.entries(supportedLanguages).map(([code]) => (
            <button
              key={code}
              className={`${styles.menuItem} ${
                code === language ? styles.active : ''
              }`}
              onClick={() => handleLanguageChange(code)}
            >
              <LanguageIcon lang={code as LanguageCode} size="md" />
              <span className={styles.menuName}>{supportedLanguages[code as LanguageCode].name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
