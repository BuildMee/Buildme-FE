import { useEffect, useState } from 'react';
import Logo from './Logo';
import { GitHubIcon, GoogleIcon } from './Icons';
import { handleGitHubLogin, handleGoogleLogin } from '../utils/auth';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('access_token'));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    const handleHash = () => {
      setCurrentHash(window.location.hash);
      setIsLoggedIn(!!sessionStorage.getItem('access_token'));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleHash);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // 모달 열릴 때 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  return (
    <>
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
        {isLoggedIn ? (
          <button className={styles.ctaButton} onClick={() => { window.location.hash = '#mypage'; }}>
            마이페이지
          </button>
        ) : (
          <button className={styles.ctaButton} onClick={() => setModalOpen(true)}>
            시작하기
          </button>
        )}
      </nav>

      {/* 로그인 모달 */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModalOpen(false)}>✕</button>

            <p className={styles.modalLabel}>GET STARTED</p>
            <h2 className={styles.modalTitle}>시작하기</h2>
            <p className={styles.modalDesc}>
              계정으로 로그인하고<br />포트폴리오를 만들어보세요.
            </p>

            <div className={styles.modalBtns}>
              <button className={styles.githubBtn} onClick={handleGitHubLogin}>
                <GitHubIcon />
                GitHub으로 시작하기
              </button>
              <button className={styles.googleBtn} onClick={handleGoogleLogin}>
                <GoogleIcon />
                Google로 시작하기
              </button>
            </div>

            <p className={styles.modalHint}>
              로그인 시 <span>이용약관</span> 및 <span>개인정보처리방침</span>에 동의하게 됩니다.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

