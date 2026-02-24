import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/GitHubCallbackPage.module.css';

type Status = 'loading' | 'success' | 'error';

export default function GitHubCallbackPage() {
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      setErrorMsg('GitHub 인증이 취소되었습니다.');
      setStatus('error');
      return;
    }

    if (!code) {
      setErrorMsg('인증 코드를 받지 못했습니다.');
      setStatus('error');
      return;
    }

    // 실제 서비스에서는 여기서 백엔드에 code를 전송해 access_token을 받아옵니다.
    // 현재는 프론트엔드 데모이므로 성공 상태로 처리합니다.
    const timer = setTimeout(() => {
      setStatus('success');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.body}>
        <div className={styles.card}>
          {status === 'loading' && (
            <>
              <div className={styles.spinner} />
              <p className={styles.label}>GITHUB CONNECTING</p>
              <h2 className={styles.title}>연결 중...</h2>
              <p className={styles.desc}>GitHub 계정을 인증하고 있습니다.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className={styles.successIcon}>✓</div>
              <p className={styles.label}>CONNECTED</p>
              <h2 className={styles.title}>연결 완료</h2>
              <p className={styles.desc}>
                GitHub 계정이 연결되었습니다.<br />
                이제 레포지토리를 분석해 포트폴리오를 만들 수 있어요.
              </p>
              <div className={styles.actions}>
                <button
                  className={styles.primaryBtn}
                  onClick={() => { window.location.href = '/'; }}
                >
                  포트폴리오 만들기 →
                </button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className={styles.errorIcon}>✕</div>
              <p className={styles.label}>ERROR</p>
              <h2 className={styles.title}>연결 실패</h2>
              <p className={styles.desc}>{errorMsg}</p>
              <div className={styles.actions}>
                <a href="/" className={styles.ghostBtn}>홈으로 돌아가기</a>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
