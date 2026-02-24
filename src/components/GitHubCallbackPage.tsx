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
    const errorDesc = params.get('error_description');

    // 처리 후 URL에서 민감한 파라미터 즉시 제거
    window.history.replaceState(null, '', window.location.pathname);
    sessionStorage.removeItem('oauth_state');

    if (error) {
      setErrorMsg(errorDesc || 'GitHub 인증이 취소되었습니다.');
      setStatus('error');
      return;
    }

    if (!code) {
      setErrorMsg('인증 코드를 받지 못했습니다.');
      setStatus('error');
      return;
    }

    // 백엔드에 code를 전송해 access_token 교환
    fetch('http://localhost:3001/api/auth/github', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data: { success: boolean; access_token?: string; message?: string }) => {
        if (data.success && data.access_token) {
          sessionStorage.setItem('access_token', data.access_token);
          setStatus('success');
        } else {
          setErrorMsg(data.message || '토큰 발급에 실패했습니다.');
          setStatus('error');
        }
      })
      .catch(() => {
        setErrorMsg('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
        setStatus('error');
      });
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
