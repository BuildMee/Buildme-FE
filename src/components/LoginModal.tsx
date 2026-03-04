import { useEffect } from 'react';
import { GitHubIcon, GoogleIcon } from './Icons';
import { handleGitHubLogin, handleGoogleLogin } from '../utils/auth';
import styles from '../styles/Navbar.module.css';

export default function LoginModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>

        <h2 className={styles.modalTitle}>로그인이 필요해요</h2>
        <p className={styles.modalDesc}>
          포트폴리오를 만들려면<br />먼저 로그인해주세요.
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
  );
}
