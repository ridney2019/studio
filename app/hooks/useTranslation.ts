'use client';

import { useLanguage } from '@/app/providers';
import { getTranslation, TranslationKey } from '@/lib/translations';

export function useTranslation() {
  const { language, isHydrated } = useLanguage();

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  return { t, language, isHydrated };
}
