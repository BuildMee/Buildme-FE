import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/MyPage.module.css';
import {
  fetchMyPortfolios,
  deletePortfolioFromServer,
  fetchMyResumes,
  deleteResumeFromServer,
  type SavedPortfolio,
  type SavedResume,
} from '../utils/portfolioApi';

type Tab = 'portfolio' | 'resume' | 'payment';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<Tab>('portfolio');
  const [portfolios, setPortfolios] = useState<SavedPortfolio[]>([]);
  const [portfoliosLoading, setPortfoliosLoading] = useState(true);
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    const provider = sessionStorage.getItem('auth_provider');
    if (!token) return;

    if (provider === 'google') {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data: { name?: string }) => {
          if (data.name) setUserName(data.name);
        })
        .catch(() => {});
    } else {
      fetch(`${apiBase}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data: { success: boolean; user?: { name?: string; login?: string } }) => {
          if (data.success && data.user) {
            setUserName(data.user.name || data.user.login || null);
          }
        })
        .catch(() => {});
    }

    // 포트폴리오 목록 로드
    fetchMyPortfolios()
      .then((result) => {
        if (result.success && result.portfolios) setPortfolios(result.portfolios);
      })
      .catch(() => {})
      .finally(() => setPortfoliosLoading(false));

    // 이력서 목록 로드
    fetchMyResumes()
      .then((result) => {
        if (result.success && result.resumes) setResumes(result.resumes);
      })
      .catch(() => {})
      .finally(() => setResumesLoading(false));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('auth_provider');
    window.location.hash = '';
  };

  const deletePortfolio = async (id: string) => {
    const result = await deletePortfolioFromServer(id);
    if (result.success) {
      setPortfolios((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const deleteResume = async (id: string) => {
    const result = await deleteResumeFromServer(id);
    if (result.success) {
      setResumes((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const previewPortfolio = (p: SavedPortfolio) => {
    sessionStorage.setItem('portfolio_data', JSON.stringify(p.data));
    sessionStorage.setItem('selected_template', p.templateId);
    sessionStorage.removeItem('ai_design');
    window.location.hash = '#portfolio-result';
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.headerTitle}>
            {userName ? `안녕하세요, ${userName}님` : '마이페이지'}
          </h1>
        </div>
      </section>

      <div className={styles.body}>
        {/* 탭 */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'portfolio' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            내 포트폴리오
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'resume' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            이력서 관리
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'payment' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            결제 내역
          </button>
        </div>

        {/* 포트폴리오 탭 */}
        {activeTab === 'portfolio' && (
          <div className={styles.section}>
            {portfoliosLoading ? (
              <div className={styles.empty}>
                <p className={styles.emptyText} style={{ color: '#bbb' }}>불러오는 중...</p>
              </div>
            ) : portfolios.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyText}>아직 만든 포트폴리오가 없어요.</p>
                <a href="#resume" className={styles.emptyBtn}>포트폴리오 만들기 →</a>
              </div>
            ) : (
              <div className={styles.list}>
                {portfolios.map((p) => (
                  <div key={p.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{p.title}</div>
                      <div className={styles.itemMeta}>
                        {p.templateId} · {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <button className={styles.editBtn} onClick={() => previewPortfolio(p)}>미리보기</button>
                      <button className={styles.deleteBtn} onClick={() => deletePortfolio(p.id)}>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 이력서 탭 */}
        {activeTab === 'resume' && (
          <div className={styles.section}>
            {resumesLoading ? (
              <div className={styles.empty}>
                <p className={styles.emptyText} style={{ color: '#bbb' }}>불러오는 중...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyText}>업로드된 이력서가 없어요.</p>
                <a href="#resume" className={styles.emptyBtn}>이력서 업로드 →</a>
              </div>
            ) : (
              <div className={styles.list}>
                {resumes.map((r) => (
                  <div key={r.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemIcon}>📄</div>
                      <div>
                        <div className={styles.itemName}>{r.fileName}</div>
                        <div className={styles.itemMeta}>업로드 · {new Date(r.uploadedAt).toLocaleDateString('ko-KR')}</div>
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <a href="#resume" className={styles.editBtn}>재업로드</a>
                      <button className={styles.deleteBtn} onClick={() => deleteResume(r.id)}>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 결제 내역 탭 */}
        {activeTab === 'payment' && (
          <div className={styles.section}>
            <div className={styles.planCard}>
              <div className={styles.planCardTop}>
                <div>
                  <p className={styles.planCardLabel}>현재 플랜</p>
                  <p className={styles.planCardName}>FREE</p>
                </div>
                <span className={styles.planBadge}>무료</span>
              </div>
              <p className={styles.planCardDesc}>
                포트폴리오 3개 · 기본 템플릿 6종 · 이력서 업로드 1개
              </p>
              <a href="#pricing" className={styles.planUpgradeBtn}>
                Pro로 업그레이드 →
              </a>
            </div>
            <div className={styles.empty} style={{ paddingTop: 40, paddingBottom: 40 }}>
              <p className={styles.emptyText}>결제 내역이 없어요.</p>
            </div>
          </div>
        )}

        {/* 로그아웃 */}
        <div className={styles.logoutSection}>
          <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
