import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/ResumePage.module.css';
import { savePortfolioData } from '../utils/templates';

type Step = 'select' | 'role' | 'detail' | 'generating' | 'done';

interface Repo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
  owner: string;
}

interface RepoDetail {
  role: string;
  highlights: string;
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

const STEPS = ['레포 선택', '직군 선택', '프로젝트 상세', 'AI 분석', '포트폴리오 완성'];
const STEP_KEYS: Step[] = ['select', 'role', 'detail', 'generating', 'done'];

const ROLES = [
  '프론트엔드', '백엔드', '풀스택', 'iOS', 'Android',
  'DevOps', 'PM', 'UI/UX 디자이너', '데이터 엔지니어', '기타',
];

export default function GithubPortfolioPage() {
  const [step, setStep] = useState<Step>('select');
  const [repos, setRepos] = useState<Repo[]>([]);
  const [orgs, setOrgs] = useState<string[]>([]);
  const [reposLoading, setReposLoading] = useState(true);
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());
  const [filterOwner, setFilterOwner] = useState<string>('all');

  // 상세 정보
  const [major, setMajor] = useState('');
  const [customMajor, setCustomMajor] = useState('');
  const [repoDetails, setRepoDetails] = useState<Record<string, RepoDetail>>({});

  const [portfolio, setPortfolio] = useState<GeneratedPortfolio | null>(null);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';
  const token = sessionStorage.getItem('access_token');

  useEffect(() => {
    if (!token) { window.location.hash = ''; return; }

    fetch(`${apiBase}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d: { success: boolean; user?: { name?: string; login?: string } }) => {
        if (d.success && d.user) setUserName(d.user.name || d.user.login || '');
      }).catch(() => {});

    fetch(`${apiBase}/api/github/repos`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d: { success: boolean; repos?: Repo[]; orgs?: string[] }) => {
        if (d.success && d.repos) setRepos(d.repos);
        if (d.orgs) setOrgs(d.orgs);
      }).catch(() => {}).finally(() => setReposLoading(false));
  }, []);

  const toggleRepo = (fullName: string) => {
    setSelectedRepos((prev) => {
      const next = new Set(prev);
      next.has(fullName) ? next.delete(fullName) : next.add(fullName);
      return next;
    });
  };

  const updateRepoDetail = (fullName: string, field: keyof RepoDetail, value: string) => {
    setRepoDetails((prev) => ({
      ...prev,
      [fullName]: { ...prev[fullName], role: prev[fullName]?.role ?? '', highlights: prev[fullName]?.highlights ?? '', [field]: value },
    }));
  };

  const handleGenerate = async () => {
    if (!token || selectedRepos.size === 0) return;
    setStep('generating');
    setError('');
    try {
      const details = await Promise.all(
        Array.from(selectedRepos).map(async (fullName) => {
          const [owner, repo] = fullName.split('/');
          const res = await fetch(`${apiBase}/api/github/repo-detail/${owner}/${repo}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json() as { success: boolean; detail?: object };
          const extra = repoDetails[fullName] ?? {};
          return data.success ? { ...data.detail, ...extra } : null;
        })
      );

      const res = await fetch(`${apiBase}/api/ai/generate-portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, major: major === '기타' ? customMajor : major, repos: details.filter(Boolean) }),
      });
      const data = await res.json() as { success: boolean; portfolio?: GeneratedPortfolio; message?: string };

      if (data.success && data.portfolio) {
        setPortfolio(data.portfolio);
        savePortfolioData({ name: userName, role: major === '기타' ? customMajor : major, ...data.portfolio });
        setStep('done');
      } else {
        setError(data.message ?? '생성에 실패했습니다.');
        setStep('detail');
      }
    } catch {
      setError('서버 연결에 실패했습니다.');
      setStep('detail');
    }
  };

  const currentStepIdx = STEP_KEYS.indexOf(step);

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.headerLabel}>GITHUB PORTFOLIO</p>
          <h1 className={styles.headerTitle} style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            GitHub으로<br />시작하기
          </h1>
          <p className={styles.headerSub}>
            레포지토리를 선택하면 AI가 분석해서 포트폴리오 초안을 완성합니다.
          </p>
        </div>
        {/* 4단계 스텝 */}
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={i} className={styles.stepGroup}>
              <div className={`${styles.step} ${i === currentStepIdx ? styles.stepActive : ''}`}>
                <div className={styles.stepNum}>0{i + 1}</div>
                <div className={styles.stepText}>{s}</div>
              </div>
              {i < STEPS.length - 1 && <div className={styles.stepArrow}>→</div>}
            </div>
          ))}
        </div>
      </section>

      <div className={styles.body}>

        {/* ── Step 1: 레포 선택 ── */}
        {step === 'select' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>레포지토리 선택</h2>
            <p className={styles.cardDesc}>포트폴리오에 포함할 레포지토리를 선택하세요. (최대 5개 권장)</p>

            {/* 필터 탭 */}
            {!reposLoading && repos.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {['all', 'user', ...orgs].map((f) => (
                  <button key={f} onClick={() => setFilterOwner(f)} style={{
                    padding: '6px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                    border: filterOwner === f ? '2px solid #000' : '2px solid #e8e8e8',
                    background: filterOwner === f ? '#000' : '#fff',
                    color: filterOwner === f ? '#fff' : '#333',
                    fontWeight: filterOwner === f ? 700 : 400,
                  }}>
                    {f === 'all' ? '전체' : f === 'user' ? '내 레포' : f}
                  </button>
                ))}
              </div>
            )}

            {reposLoading ? (
              <p style={{ color: '#888', padding: '40px 0', textAlign: 'center' }}>불러오는 중...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 400, overflowY: 'auto', marginBottom: 24 }}>
                {repos.filter((r) => filterOwner === 'all' || r.owner === filterOwner).map((r) => {
                  const selected = selectedRepos.has(r.fullName);
                  return (
                    <div key={r.id} onClick={() => toggleRepo(r.fullName)} style={{
                      padding: '14px 18px', border: selected ? '2px solid #000' : '2px solid #e8e8e8',
                      borderRadius: 10, cursor: 'pointer', display: 'flex',
                      justifyContent: 'space-between', alignItems: 'center',
                      background: selected ? '#f8f8f8' : '#fff', transition: 'all 0.15s',
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</span>
                          {r.owner !== 'user' && (
                            <span style={{ fontSize: 11, padding: '2px 8px', background: '#f0f0f0', borderRadius: 10, color: '#666' }}>{r.owner}</span>
                          )}
                        </div>
                        <div style={{ fontSize: 13, color: '#888' }}>
                          {r.language && <span style={{ marginRight: 8 }}>{r.language}</span>}
                          {r.description ?? '설명 없음'}
                        </div>
                      </div>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                        border: selected ? 'none' : '2px solid #ccc',
                        background: selected ? '#000' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 14,
                      }}>{selected ? '✓' : ''}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className={styles.actions}>
              <a href="#" className={styles.cancelBtn}>취소</a>
              <button
                className={`${styles.nextBtn} ${selectedRepos.size === 0 ? styles.nextBtnDisabled : ''}`}
                disabled={selectedRepos.size === 0}
                onClick={() => setStep('role')}
              >
                다음 ({selectedRepos.size}개 선택) →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: 직군 선택 ── */}
        {step === 'role' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>직군 선택</h2>
            <p className={styles.cardDesc}>본인의 직군/역할을 선택해주세요. AI가 맞춤형 포트폴리오를 작성합니다.</p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
              {ROLES.map((r) => (
                <button key={r} onClick={() => setMajor(r)} style={{
                  padding: '12px 22px', borderRadius: 10, fontSize: 15, cursor: 'pointer',
                  border: major === r ? '2px solid #000' : '2px solid #e8e8e8',
                  background: major === r ? '#000' : '#fff',
                  color: major === r ? '#fff' : '#333',
                  fontWeight: major === r ? 700 : 400,
                  transition: 'all 0.15s',
                }}>{r}</button>
              ))}
            </div>

            {major === '기타' && (
              <input
                value={customMajor}
                onChange={(e) => setCustomMajor(e.target.value)}
                placeholder="직군/역할 직접 입력 (예: 임베디드 개발자)"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8e8e8', borderRadius: 8, fontSize: 14, marginBottom: 24, boxSizing: 'border-box' }}
              />
            )}

            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={() => setStep('select')}>← 이전</button>
              <button
                className={`${styles.nextBtn} ${!major ? styles.nextBtnDisabled : ''}`}
                disabled={!major}
                onClick={() => setStep('detail')}
              >
                다음 →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: 프로젝트 상세 입력 ── */}
        {step === 'detail' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>프로젝트 상세 정보</h2>
            <p className={styles.cardDesc}>각 프로젝트에서 내가 한 역할과 특징을 입력하면 더 정확한 포트폴리오가 만들어져요.</p>

            {error && <p style={{ color: 'red', marginBottom: 16, fontSize: 14 }}>{error}</p>}

            {/* 레포별 상세 입력 */}
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>프로젝트별 상세 정보</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              {Array.from(selectedRepos).map((fullName) => {
                const repo = repos.find((r) => r.fullName === fullName);
                const detail = repoDetails[fullName] ?? { role: '', highlights: '' };
                return (
                  <div key={fullName} style={{ padding: 20, border: '2px solid #e8e8e8', borderRadius: 12, background: '#fafafa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{repo?.name ?? fullName}</span>
                      {repo?.owner !== 'user' && (
                        <span style={{ fontSize: 11, padding: '2px 8px', background: '#f0f0f0', borderRadius: 10, color: '#666' }}>{repo?.owner}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>내가 한 역할 / 기여</label>
                        <input
                          value={detail.role}
                          onChange={(e) => updateRepoDetail(fullName, 'role', e.target.value)}
                          placeholder="예: 프론트엔드 전체 개발, 로그인 기능 구현"
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, background: '#fff', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>특징 / AI에게 알려줄 것</label>
                        <textarea
                          value={detail.highlights}
                          onChange={(e) => updateRepoDetail(fullName, 'highlights', e.target.value)}
                          placeholder="예: 실시간 채팅 기능, 성능 최적화로 로딩 속도 30% 개선, 팀 프로젝트에서 PM 역할"
                          rows={3}
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, background: '#fff', resize: 'vertical', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={() => setStep('role')}>← 이전</button>
              <button className={styles.nextBtn} onClick={handleGenerate}>
                AI 분석 시작 →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: 분석 중 ── */}
        {step === 'generating' && (
          <div className={`${styles.card} ${styles.cardCenter}`}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>⚙️</div>
            <h2 className={styles.doneTitle}>AI 분석 중...</h2>
            <p className={styles.doneDesc}>
              선택한 레포지토리를 분석하고 있습니다.<br />
              잠시만 기다려주세요.
            </p>
          </div>
        )}

        {/* ── Step 4: 완료 ── */}
        {step === 'done' && portfolio && (
          <div className={styles.card}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div className={styles.doneIcon}>✓</div>
              <h2 className={styles.doneTitle}>포트폴리오 초안 완성!</h2>
              <p className={styles.doneDesc}>AI가 레포지토리를 분석해 초안을 작성했습니다.</p>
            </div>

            <div style={{ background: '#f8f8f8', borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, letterSpacing: 2, color: '#888', marginBottom: 8 }}>자기소개</p>
                <p style={{ lineHeight: 1.8, fontSize: 15 }}>{portfolio.intro}</p>
              </div>
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, letterSpacing: 2, color: '#888', marginBottom: 12 }}>기술스택</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {portfolio.skills.map((s) => (
                    <span key={s} style={{ padding: '5px 14px', background: '#000', color: '#fff', borderRadius: 20, fontSize: 13 }}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, letterSpacing: 2, color: '#888', marginBottom: 12 }}>프로젝트</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {portfolio.projects.map((p) => (
                    <div key={p.name} style={{ background: '#fff', borderRadius: 10, padding: 18, border: '1px solid #eee' }}>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{p.name}</div>
                      <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7, marginBottom: 10 }}>{p.description}</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                        {p.tech.map((t) => (
                          <span key={t} style={{ padding: '3px 10px', background: '#f0f0f0', borderRadius: 4, fontSize: 12 }}>{t}</span>
                        ))}
                      </div>
                      <p style={{ fontSize: 13, color: '#666', fontStyle: 'italic' }}>{p.highlights}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#000', color: '#fff', borderRadius: 10, padding: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.6 }}>{portfolio.summary}</p>
              </div>
            </div>

            <div className={styles.doneActions}>
              <button className={styles.nextBtn} onClick={() => { window.location.hash = 'portfolio-result'; }}>포트폴리오 확인하기 →</button>
              <button className={styles.cancelBtn} onClick={() => { setStep('select'); setPortfolio(null); setSelectedRepos(new Set()); setRepoDetails({}); setMajor(''); }}>
                다시 선택하기
              </button>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
