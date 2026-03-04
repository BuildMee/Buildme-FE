import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>&copy; 2026 buildme</p>

        <nav className={styles.links}>
          <a href="https://github.com/hdudwo" target="_blank" rel="noopener noreferrer" className={styles.link}>GitHub</a>
          <span className={styles.dot}>·</span>
          <a href="https://github.com/hdudwo" target="_blank" rel="noopener noreferrer" className={styles.link}>Contact</a>
        </nav>

      </div>
    </footer>
  );
}
