'use client';

import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <LanguageSwitcher />
    </header>
  );
}
