import { useEffect, useState } from 'react';
import Logo from './Logo';
import styles from '../styles/Navbar.module.css';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

function handleGitHubLogin() {
  if (!GITHUB_CLIENT_ID) return;
  const state = crypto.randomUUID();
  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('oauth_provider', 'github');
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: 'read:user,repo',
    state,
  });
  window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
}

function handleGoogleLogin() {
  if (!GOOGLE_CLIENT_ID) return;
  const state = crypto.randomUUID();
  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('oauth_provider', 'google');
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: window.location.origin,
    response_type: 'code',
    scope: 'openid email profile',
    state,
  });
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('access_token'));

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

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
