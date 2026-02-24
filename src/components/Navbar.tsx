import { useEffect, useState } from 'react';
import Logo from './Logo';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    const handleHash = () => setCurrentHash(window.location.hash);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleHash);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#" className={styles.logoGroup}>
        <Logo size={36} />
        <span className={styles.logoText}>buildme</span>
      </a>
      <div className={styles.navLinks}>
        <a
          href="#"
          className={`${styles.navLink} ${currentHash === '' || currentHash === '#' ? styles.navLinkActive : ''}`}
        >
          홈
        </a>
        <a
          href="#templates"
          className={`${styles.navLink} ${currentHash === '#templates' ? styles.navLinkActive : ''}`}
        >
          템플릿
        </a>
      </div>
      <button className={styles.ctaButton}>시작하기</button>
    </nav>
  );
}
