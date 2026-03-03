import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/MyPage.module.css';

interface Portfolio {
  id: string;
  name: string;
  template: string;
  createdAt: string;
}

interface Resume {
  id: string;
  fileName: string;
  uploadedAt: string;
}

interface Payment {
  id: string;
  item: string;
  amount: string;
  date: string;
  status: '완료' | '취소';
}

interface Repo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
  isPrivate: boolean;
}

interface GeneratedProject {
  name: string;
  description: string;
  tech: string[];
  highlights: string;
}

interface GeneratedPortfolio {
  intro: string;
  skills: string[];
  projects: GeneratedProject[];
  summary: string;
}

// 더미 데이터
const dummyPortfolios: Portfolio[] = [
  { id: '1', name: '내 첫 번째 포트폴리오', template: 'Minimal Dark', createdAt: '2026.02.10' },
  { id: '2', name: '프론트엔드 개발자 포트폴리오', template: 'Terminal', createdAt: '2026.02.20' },
];

const dummyResumes: Resume[] = [
  { id: '1', fileName: '허영재_이력서_2026.pdf', uploadedAt: '2026.02.18' },
];

const dummyPayments: Payment[] = [
  { id: '1', item: 'Pro 플랜 1개월', amount: '9,900원', date: '2026.02.01', status: '완료' },
  { id: '2', item: 'Pro 플랜 1개월', amount: '9,900원', date: '2026.01.01', status: '완료' },
];

type Tab = 'portfolio' | 'resume' | 'payment' | 'generate';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<Tab>('portfolio');
  const [portfolios, setPortfolios] = useState(dummyPortfolios);
  const [resumes, setResumes] = useState(dummyResumes);
  const [userName, setUserName] = useState<string | null>(null);

  // 포트폴리오 생성 관련 state
  const [repos, setRepos] = useState<Repo[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [generatedPortfolio, setGeneratedPortfolio] = useState<GeneratedPortfolio | null>(null);
  const [generateError, setGenerateError] = useState('');

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
      const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';
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
  }, []);

  const fetchRepos = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) return;
    setReposLoading(true);
    const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';
    try {
      const res = await fetch(`${apiBase}/api/github/repos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json() as { success: boolean; repos?: Repo[] };
      if (data.success && data.repos) setRepos(data.repos);
    } catch {}
    setReposLoading(false);
  };

  const toggleRepo = (fullName: string) => {
    setSelectedRepos((prev) => {
      const next = new Set(prev);
      next.has(fullName) ? next.delete(fullName) : next.add(fullName);
      return next;
    });
  };

  const handleGenerate = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token || selectedRepos.size === 0) return;
    setGenerating(true);
    setGeneratedPortfolio(null);
    setGenerateError('');
    const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';
    try {
      // 선택된 레포 상세 정보 수집
      const details = await Promise.all(
        Array.from(selectedRepos).map(async (fullName) => {
          const [owner, repo] = fullName.split('/');
          const res = await fetch(`${apiBase}/api/github/repo-detail/${owner}/${repo}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json() as { success: boolean; detail?: object };
          return data.success ? data.detail : null;
        })
      );
      const validDetails = details.filter(Boolean);

      // AI 포트폴리오 생성
      const res = await fetch(`${apiBase}/api/ai/generate-portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, repos: validDetails }),
      });
      const data = await res.json() as { success: boolean; portfolio?: GeneratedPortfolio; message?: string };
      if (data.success && data.portfolio) {
        setGeneratedPortfolio(data.portfolio);
      } else {
        setGenerateError(data.message ?? '생성 실패');
      }
    } catch {
      setGenerateError('서버 연결에 실패했습니다.');
    }
    setGenerating(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('auth_provider');
    window.location.hash = '';
  };

  const deletePortfolio = (id: string) => {
    setPortfolios((prev) => prev.filter((p) => p.id !== id));
  };

  const deleteResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.headerLabel}>MY ACCOUNT</p>
          <h1 className={styles.headerTitle}>
            {userName ? `${userName}` : '마이페이지'}
          </h1>
          {userName && <p className={styles.headerSub}>안녕하세요, {userName}님</p>}
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
            className={`${styles.tab} ${activeTab === 'generate' ? styles.tabActive : ''}`}
            onClick={() => { setActiveTab('generate'); if (repos.length === 0) fetchRepos(); }}
          >
            포트폴리오 생성
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

        {/* 포트폴리오 생성 탭 */}
        {activeTab === 'generate' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: 8 }}>레포지토리 선택</h2>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
              포트폴리오에 포함할 레포지토리를 선택하세요. (최대 5개 권장)
            </p>

            {reposLoading ? (
              <p style={{ color: '#888' }}>레포지토리 불러오는 중...</p>
            ) : repos.length === 0 ? (
              <p style={{ color: '#888' }}>레포지토리가 없거나 GitHub 로그인이 필요합니다.</p>
            ) : (
              <div className={styles.list}>
                {repos.map((r) => (
                  <div
                    key={r.id}
                    className={styles.item}
                    style={{
                      cursor: 'pointer',
                      border: selectedRepos.has(r.fullName) ? '2px solid #000' : '2px solid transparent',
                      borderRadius: 8,
                      padding: '12px 16px',
                      transition: 'border 0.15s',
                    }}
                    onClick={() => toggleRepo(r.fullName)}
                  >
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{r.name}</div>
                      <div className={styles.itemMeta}>
                        {r.language && `${r.language} · `}
                        {r.description ?? '설명 없음'}
                      </div>
                    </div>
                    <div style={{ fontSize: 20 }}>
                      {selectedRepos.has(r.fullName) ? '✓' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {repos.length > 0 && (
              <button
                onClick={handleGenerate}
                disabled={generating || selectedRepos.size === 0}
                style={{
                  marginTop: 24,
                  padding: '14px 32px',
                  background: selectedRepos.size === 0 ? '#ccc' : '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: selectedRepos.size === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {generating ? 'AI 분석 중...' : `선택된 레포 ${selectedRepos.size}개로 포트폴리오 생성`}
              </button>
            )}

            {generateError && (
              <p style={{ color: 'red', marginTop: 16 }}>{generateError}</p>
            )}

            {generatedPortfolio && (
              <div style={{ marginTop: 32, padding: 24, background: '#f8f8f8', borderRadius: 12 }}>
                <p style={{ fontSize: 11, letterSpacing: 2, color: '#888', marginBottom: 16 }}>AI GENERATED PORTFOLIO</p>

                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>자기소개</h3>
                <p style={{ marginBottom: 24, lineHeight: 1.7 }}>{generatedPortfolio.intro}</p>

                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>기술스택</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                  {generatedPortfolio.skills.map((s) => (
                    <span key={s} style={{ padding: '4px 12px', background: '#000', color: '#fff', borderRadius: 4, fontSize: 13 }}>{s}</span>
                  ))}
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>프로젝트</h3>
                {generatedPortfolio.projects.map((p) => (
                  <div key={p.name} style={{ marginBottom: 20, padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #eee' }}>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{p.name}</div>
                    <p style={{ fontSize: 14, color: '#444', marginBottom: 8, lineHeight: 1.6 }}>{p.description}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      {p.tech.map((t) => (
                        <span key={t} style={{ padding: '2px 8px', background: '#f0f0f0', borderRadius: 4, fontSize: 12 }}>{t}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: 13, color: '#666', fontStyle: 'italic' }}>{p.highlights}</p>
                  </div>
                ))}

                <div style={{ marginTop: 16, padding: 16, background: '#000', color: '#fff', borderRadius: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 700 }}>{generatedPortfolio.summary}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 포트폴리오 탭 */}
        {activeTab === 'portfolio' && (
          <div className={styles.section}>
            {portfolios.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyText}>아직 만든 포트폴리오가 없어요.</p>
                <a href="#resume" className={styles.emptyBtn}>포트폴리오 만들기 →</a>
              </div>
            ) : (
              <div className={styles.list}>
                {portfolios.map((p) => (
                  <div key={p.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{p.name}</div>
                      <div className={styles.itemMeta}>{p.template} · {p.createdAt}</div>
                    </div>
                    <div className={styles.itemActions}>
                      <button className={styles.editBtn}>수정</button>
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
            {resumes.length === 0 ? (
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
                        <div className={styles.itemMeta}>업로드 · {r.uploadedAt}</div>
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
            {dummyPayments.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyText}>결제 내역이 없어요.</p>
              </div>
            ) : (
              <div className={styles.list}>
                {dummyPayments.map((pay) => (
                  <div key={pay.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{pay.item}</div>
                      <div className={styles.itemMeta}>{pay.date}</div>
                    </div>
                    <div className={styles.itemRight}>
                      <div className={styles.payAmount}>{pay.amount}</div>
                      <div className={`${styles.payStatus} ${pay.status === '완료' ? styles.payDone : styles.payCanceled}`}>
                        {pay.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
