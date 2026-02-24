import Logo from './Logo';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logoGroup}>
          <Logo size={28} />
          <span className={styles.logoText}>buildme</span>
        </div>

        <nav className={styles.links}>
          <a href="#" className={styles.link}>GitHub</a>
          <a href="#" className={styles.link}>Documentation</a>
          <a href="#" className={styles.link}>Contact</a>
        </nav>

        <p className={styles.copy}>&copy; 2026 buildme. All rights reserved.</p>
      </div>
    </footer>
  );
}
