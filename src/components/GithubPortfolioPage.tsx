import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/ResumePage.module.css';
import { savePortfolioData, getSelectedTemplate } from '../utils/templates';
import { savePortfolioToServer } from '../utils/portfolioApi';
import { handleGitHubLogin } from '../utils/auth';
import { GitHubIcon } from './Icons';
import UpgradeModal from './UpgradeModal';

type Step = 'select' | 'role' | 'detail' | 'extra' | 'generating' | 'done';

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

const STEP_KEYS: Step[] = ['select', 'role', 'detail', 'extra', 'generating', 'done'];

const PHASES = ['프로젝트 선택', '상세 정보 입력', 'AI 분석', '포트폴리오'];
const getPhaseIndex = (s: Step): number => {
  if (s === 'select') return 0;
  if (['role', 'detail', 'extra'].includes(s)) return 1;
  if (s === 'generating') return 2;
  return 3;
};

const ROLES = [
  '프론트엔드', '백엔드', '풀스택', 'iOS', 'Android',
  'DevOps', 'PM', 'UI/UX 디자이너', '데이터 엔지니어', '기타',
];

// Language color map for visual flair
const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6', JavaScript: '#F7DF1E', Python: '#3776AB',
  Java: '#ED8B00', 'C++': '#00599C', C: '#555555', Go: '#00ADD8',
  Rust: '#DEA584', Swift: '#FA7343', Kotlin: '#7F52FF',
  HTML: '#E34F26', CSS: '#1572B6', Vue: '#42B883', React: '#61DAFB',
};

export default function GithubPortfolioPage() {
  const [step, setStep] = useState<Step>('select');
  const [repos, setRepos] = useState<Repo[]>([]);
  const [orgs, setOrgs] = useState<string[]>([]);
  const [reposLoading, setReposLoading] = useState(true);
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());
  const [filterOwner, setFilterOwner] = useState<string>('all');
  const [cardIndex, setCardIndex] = useState(0);
  const [cardAnim, setCardAnim] = useState<'enter-right' | 'enter-left' | null>(null);

  const [major, setMajor] = useState('');
  const [customMajor, setCustomMajor] = useState('');
  const [repoDetails, setRepoDetails] = useState<Record<string, RepoDetail>>({});
  const [extraInfo, setExtraInfo] = useState({ awards: '', certifications: '', activities: '', additional: '' });

  const [portfolio, setPortfolio] = useState<GeneratedPortfolio | null>(null);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [hoveredRepo, setHoveredRepo] = useState<number | null>(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';
  const token = sessionStorage.getItem('access_token');
  const authProvider = sessionStorage.getItem('auth_provider');
  const isGoogleOnly = authProvider === 'google';

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
    const resolvedRole = major === '기타' ? customMajor.trim() : major;
    if (!resolvedRole) {
      setError('직군을 입력해주세요.');
      setStep('role');
      return;
    }
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
        body: JSON.stringify({ userName, major: resolvedRole, repos: details.filter(Boolean), extraInfo }),
      });
      const data = await res.json() as { success: boolean; portfolio?: GeneratedPortfolio; message?: string; fallback?: boolean };

      if (data.success && data.portfolio) {
        setPortfolio(data.portfolio);
        const portfolioData = { name: userName, role: resolvedRole, ...data.portfolio };
        savePortfolioData(portfolioData);
        if (data.fallback) setError('⚠️ AI API 한도 초과 — 레포 정보 기반으로 자동 생성된 초안입니다.');

        if (token) {
          const saveResult = await savePortfolioToServer({
            title: `${userName || '내'}의 포트폴리오`,
            templateId: getSelectedTemplate() ?? 'minimal-dark',
            data: portfolioData,
          }).catch(() => ({ success: false, code: undefined }));
          if (!saveResult.success && (saveResult as { code?: string }).code === 'DAILY_LIMIT') {
            setUpgradeOpen(true);
            setStep('select');
            return;
          }
        }

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

  const phaseIndex = getPhaseIndex(step);
  const currentStepIdx = STEP_KEYS.indexOf(step);

  const HEADER_TEXT: Record<Step, { title: string; sub: string }> = {
    select:     { title: '나를 대표하는 프로젝트 선택', sub: '선택한 레포지토리가 AI 포트폴리오의 핵심 재료가 됩니다. 나를 가장 잘 표현하는 프로젝트를 골라보세요.' },
    role:       { title: '직군을 선택해주세요', sub: '본인의 직군/역할을 선택하면 AI가 맞춤형 포트폴리오를 작성합니다.' },
    detail:     { title: '프로젝트 상세 정보 입력', sub: '각 프로젝트에서 내가 한 역할과 특징을 입력하면 더 정확한 포트폴리오가 만들어져요.' },
    extra:      { title: '추가 정보 입력', sub: '수상 내역, 자격증, 대외활동 등 포트폴리오에 포함할 추가 정보를 입력해주세요.' },
    generating: { title: 'AI 분석 중', sub: '선택한 레포지토리를 분석해 포트폴리오 초안을 작성하고 있습니다.' },
    done:       { title: '포트폴리오 초안 완성!', sub: 'AI가 레포지토리를 분석해 초안을 작성했습니다. 아래에서 확인하세요.' },
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.headerTitle}>
            {HEADER_TEXT[step].title}
          </h1>
          <p className={styles.headerSub}>
            {HEADER_TEXT[step].sub}
          </p>
        </div>

        {/* ── 3-Phase Progress Header ── */}
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 80px 44px',
          display: 'flex',
          alignItems: 'center',
        }}>
          {PHASES.map((phase, i) => {
            const isActive = i === phaseIndex;
            const isCompleted = i < phaseIndex;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < PHASES.length - 1 ? '1' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  {/* Circle */}
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: isActive || isCompleted ? '#0A0A0A' : 'transparent',
                    border: isActive || isCompleted ? 'none' : '1.5px solid #DADADA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? '0 0 0 4px rgba(10,10,10,0.08)' : 'none',
                  }}>
                    {isCompleted ? (
                      <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                        <path d="M1.5 5L5.5 9L11.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: isActive ? '#FFF' : '#AAAAAA',
                        lineHeight: 1,
                      }}>{i + 1}</span>
                    )}
                  </div>

                  {/* Label */}
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: 2,
                      color: isActive ? '#0A0A0A' : isCompleted ? '#555' : '#AAAAAA',
                      textTransform: 'uppercase',
                      transition: 'color 0.3s',
                      marginBottom: 0,
                    }}>{phase}</p>
                  </div>
                </div>

                {/* Connector line */}
                {i < PHASES.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: 1,
                    background: isCompleted ? '#0A0A0A' : '#E5E5E5',
                    margin: '0 20px',
                    transition: 'background 0.4s ease',
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Page body ── */}
      <div style={{
        width: '100%',
        padding: ['select','role','detail','extra'].includes(step) ? '0' : '48px 60px 100px',
        boxSizing: 'border-box',
        background: ['select','role','detail','extra'].includes(step) ? '#F7F7F8' : 'transparent',
      }}>

        {/* ════════════════════════════════════════
            STEP 1 — Premium Select UI
        ════════════════════════════════════════ */}
        {step === 'select' && isGoogleOnly && (
          <div style={{
            minHeight: '70vh',
            background: '#F7F7F8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              maxWidth: 480,
              width: '100%',
              margin: '0 auto',
              padding: '60px 40px',
              textAlign: 'center',
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: '#0A0A0A', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 28px',
              }}>
                <GitHubIcon size={40} />
              </div>

              <h2 style={{
                fontSize: 24, fontWeight: 800, color: '#0A0A0A',
                marginBottom: 12, fontFamily: 'var(--font-heading)',
              }}>
                GitHub 연동이 필요합니다
              </h2>
              <p style={{
                fontSize: 15, color: '#777', lineHeight: 1.7,
                marginBottom: 36,
              }}>
                GitHub 레포지토리를 기반으로 포트폴리오를 생성하려면<br />
                GitHub 계정 로그인이 필요합니다.
              </p>

              <button
                onClick={handleGitHubLogin}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 32px', borderRadius: 10,
                  fontSize: 15, fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  background: '#0A0A0A', color: '#fff',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <GitHubIcon size={20} />
                GitHub으로 로그인
              </button>

              <p style={{ fontSize: 13, color: '#BBB', marginTop: 20 }}>
                GitHub 로그인 후 레포지토리를 선택할 수 있습니다.
              </p>

              <button
                onClick={() => { window.location.hash = ''; }}
                style={{
                  marginTop: 24, padding: '10px 20px',
                  fontSize: 13, fontWeight: 500, color: '#999',
                  background: 'none', border: '1px solid #E0E0E0',
                  borderRadius: 8, cursor: 'pointer',
                }}
              >
                ← 돌아가기
              </button>
            </div>
          </div>
        )}

        {step === 'select' && !isGoogleOnly && (
          <>
            <style>{`
              @keyframes _spin { to { transform: rotate(360deg); } }
              @keyframes cardIn {
                from { opacity: 0; transform: translateY(12px); }
                to   { opacity: 1; transform: none; }
              }
              .repo-grid-card {
                animation: cardIn 0.22s cubic-bezier(0.16,1,0.3,1) both;
                cursor: pointer;
                border-radius: 4px;
                padding: 22px 24px;
                border: 1px solid #E5E5E5;
                background: #fff;
                transition: border-color 0.18s, background 0.18s;
                position: relative;
                overflow: hidden;
              }
              .repo-grid-card:hover {
                border-color: #C8C8C8;
              }
              .repo-grid-card.selected {
                border-color: #0A0A0A;
                background: #FAFAFA;
              }
              .repo-grid-card.disabled {
                opacity: 0.35;
                cursor: not-allowed;
              }
            `}</style>

            {/* Page layout */}
            <div style={{ minHeight: '100vh', background: '#F7F7F8', paddingBottom: 100 }}>

              {/* Header */}
              <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 40px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  {/* Filter tabs */}
                  <div style={{
                    display: 'inline-flex', gap: 2,
                    background: '#EAEAEA', borderRadius: 4, padding: 3,
                  }}>
                    {['all', 'user', ...orgs].map(f => (
                      <button key={f} onClick={() => setFilterOwner(f)} style={{
                        padding: '6px 16px', borderRadius: 2,
                        fontSize: 13, fontWeight: filterOwner === f ? 600 : 400,
                        border: 'none', cursor: 'pointer',
                        background: filterOwner === f ? '#fff' : 'transparent',
                        color: filterOwner === f ? '#0A0A0A' : '#888',
                        boxShadow: filterOwner === f ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap',
                      }}>
                        {f === 'all' ? '전체' : f === 'user' ? '내 레포' : f}
                      </button>
                    ))}
                  </div>

                  {/* Selected count */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1,2,3,4,5].map(n => (
                        <div key={n} style={{
                          width: 20, height: 4, borderRadius: 2,
                          background: n <= selectedRepos.size ? '#0A0A0A' : '#E0E0E0',
                          transition: 'background 0.2s',
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 13, color: '#888', fontFamily: 'var(--font-mono)' }}>
                      {selectedRepos.size} / 5
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px' }}>
                {reposLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                    <div style={{ width: 28, height: 28, border: '2px solid #E0E0E0', borderTopColor: '#0A0A0A', borderRadius: '50%', animation: '_spin 0.8s linear infinite' }} />
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 12,
                  }}>
                    {repos
                      .filter(r => filterOwner === 'all' || r.owner === filterOwner)
                      .map((r, idx) => {
                        const selected = selectedRepos.has(r.fullName);
                        const maxReached = selectedRepos.size >= 5 && !selected;
                        const langColor = LANG_COLORS[r.language ?? ''] ?? '#999';

                        return (
                          <div
                            key={r.id}
                            className={`repo-grid-card${selected ? ' selected' : ''}${maxReached ? ' disabled' : ''}`}
                            style={{ animationDelay: `${Math.min(idx * 20, 200)}ms` }}
                            onClick={() => !maxReached && toggleRepo(r.fullName)}
                          >
                            {/* Language color bar */}
                            <div style={{
                              position: 'absolute', top: 0, left: 0, right: 0,
                              height: 3, borderRadius: '4px 4px 0 0',
                              background: selected ? langColor : 'transparent',
                              transition: 'background 0.18s',
                            }} />

                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                {/* Name */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                                  <span style={{
                                    fontSize: 15, fontWeight: 700,
                                    color: '#0A0A0A', letterSpacing: -0.3,
                                    fontFamily: 'var(--font-heading)',
                                  }}>{r.name}</span>
                                  {r.owner !== 'user' && (
                                    <span style={{
                                      fontSize: 11, color: '#AAA',
                                      background: '#F0F0F0', padding: '2px 8px',
                                      borderRadius: 4, fontFamily: 'var(--font-mono)',
                                    }}>{r.owner}</span>
                                  )}
                                </div>

                                {/* Description */}
                                <p style={{
                                  fontSize: 13, color: '#888', lineHeight: 1.55,
                                  margin: '0 0 14px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical' as const,
                                  overflow: 'hidden',
                                }}>{r.description ?? '설명 없음'}</p>

                                {/* Footer */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                  {r.language && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#666' }}>
                                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: langColor, flexShrink: 0 }} />
                                      {r.language}
                                    </span>
                                  )}
                                  {r.stars > 0 && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#AAA' }}>
                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="#CCC"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                      {r.stars}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Checkbox */}
                              <div style={{
                                width: 22, height: 22, borderRadius: 3, flexShrink: 0, marginTop: 2,
                                background: selected ? '#0A0A0A' : 'transparent',
                                border: selected ? 'none' : '1.5px solid #D8D8D8',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.15s',
                              }}>
                                {selected && (
                                  <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                                    <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom fixed CTA */}
            <div style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderTop: '1px solid #EBEBEB',
              padding: '16px 40px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {selectedRepos.size === 0 ? (
                  <span style={{ fontSize: 14, color: '#BBB' }}>레포지토리를 선택해주세요</span>
                ) : (
                  Array.from(selectedRepos).map(fn => {
                    const repo = repos.find(r => r.fullName === fn);
                    const lang = repo?.language;
                    return (
                      <div key={fn} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 10px 5px 8px',
                        background: '#F2F2F2', borderRadius: 4,
                        fontSize: 12, color: '#333', fontWeight: 500,
                      }}>
                        {lang && <span style={{ width: 7, height: 7, borderRadius: '50%', background: LANG_COLORS[lang] ?? '#999' }} />}
                        {repo?.name ?? fn.split('/')[1]}
                        <button onClick={(e) => { e.stopPropagation(); toggleRepo(fn); }} style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#AAA', fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 2,
                        }}>×</button>
                      </div>
                    );
                  })
                )}
              </div>

              <button
                disabled={selectedRepos.size === 0}
                onClick={() => setStep('role')}
                style={{
                  padding: '11px 28px', borderRadius: 10,
                  fontSize: 14, fontWeight: 700,
                  border: 'none', cursor: selectedRepos.size === 0 ? 'not-allowed' : 'pointer',
                  background: selectedRepos.size > 0 ? '#0A0A0A' : '#E8E8E8',
                  color: selectedRepos.size > 0 ? '#fff' : '#BBB',
                  transition: 'all 0.2s',
                }}
              >
                다음 단계 →
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: 직군 선택 ── */}
        {step === 'role' && (
          <>
            <style>{`
              .role-chip {
                padding: 14px 24px;
                border-radius: 4px;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                border: 1.5px solid #EBEBEB;
                background: #fff;
                color: #333;
                transition: all 0.15s;
                font-family: var(--font-heading);
                box-shadow: none;
                white-space: nowrap;
              }
              .role-chip:hover {
                border-color: #C8C8C8;
              }
              .role-chip.selected {
                border-color: transparent;
                background: #0A0A0A;
                color: #fff;
                font-weight: 700;
              }
            `}</style>

            <div style={{ minHeight: '70vh', background: '#F7F7F8', paddingBottom: 120 }}>
              <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 40px 0' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      className={`role-chip${major === r ? ' selected' : ''}`}
                      onClick={() => setMajor(r)}
                    >{r}</button>
                  ))}
                </div>

                {major === '기타' && (
                  <input
                    value={customMajor}
                    onChange={(e) => setCustomMajor(e.target.value)}
                    placeholder="직군/역할 직접 입력 (예: 임베디드 개발자)"
                    style={{
                      width: '100%', marginTop: 20,
                      padding: '14px 16px', border: '1.5px solid #EBEBEB',
                      borderRadius: 4, fontSize: 14, background: '#fff',
                      boxSizing: 'border-box', outline: 'none',
                    }}
                  />
                )}
              </div>
            </div>

            {/* Bottom fixed CTA */}
            <div style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderTop: '1px solid #EBEBEB',
              padding: '16px 40px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <button
                onClick={() => setStep('select')}
                style={{
                  padding: '11px 22px', borderRadius: 10,
                  fontSize: 14, fontWeight: 500,
                  border: '1.5px solid #E0E0E0', background: 'transparent',
                  color: '#555', cursor: 'pointer',
                }}
              >
                ← 이전
              </button>
              <button
                disabled={!major}
                onClick={() => setStep('detail')}
                style={{
                  padding: '11px 28px', borderRadius: 10,
                  fontSize: 14, fontWeight: 700,
                  border: 'none', cursor: !major ? 'not-allowed' : 'pointer',
                  background: major ? '#0A0A0A' : '#E8E8E8',
                  color: major ? '#fff' : '#BBB',
                  transition: 'all 0.2s',
                }}
              >
                다음 단계 →
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: 프로젝트 상세 ── */}
        {step === 'detail' && (
          <>
            <div style={{ minHeight: '70vh', background: '#F7F7F8', paddingBottom: 120 }}>
              <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 40px 0' }}>
                {error && <p style={{ color: 'red', marginBottom: 16, fontSize: 14 }}>{error}</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Array.from(selectedRepos).map((fullName) => {
                    const repo = repos.find((r) => r.fullName === fullName);
                    const detail = repoDetails[fullName] ?? { role: '', highlights: '' };
                    return (
                      <div key={fullName} style={{
                        background: '#fff',
                        borderRadius: 4,
                        border: '1px solid #E5E5E5',
                        overflow: 'hidden',
                      }}>
                        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-heading)' }}>{repo?.name ?? fullName}</span>
                          {repo?.owner !== 'user' && (
                            <span style={{ fontSize: 11, padding: '2px 8px', background: '#F0F0F0', borderRadius: 4, color: '#888', fontFamily: 'var(--font-mono)' }}>{repo?.owner}</span>
                          )}
                        </div>
                        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div>
                            <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>내가 한 역할 / 기여</label>
                            <input
                              value={detail.role}
                              onChange={(e) => updateRepoDetail(fullName, 'role', e.target.value)}
                              placeholder="예: 프론트엔드 전체 개발, 로그인 기능 구현"
                              style={{ width: '100%', padding: '12px 14px', border: '1px solid #E5E5E5', borderRadius: 4, fontSize: 14, background: '#FAFAFA', boxSizing: 'border-box', outline: 'none' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>특징 / AI에게 알려줄 것</label>
                            <textarea
                              value={detail.highlights}
                              onChange={(e) => updateRepoDetail(fullName, 'highlights', e.target.value)}
                              placeholder="예: 실시간 채팅 기능, 성능 최적화로 로딩 속도 30% 개선, 팀 프로젝트에서 PM 역할"
                              rows={3}
                              style={{ width: '100%', padding: '12px 14px', border: '1px solid #E5E5E5', borderRadius: 4, fontSize: 14, background: '#FAFAFA', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom fixed CTA */}
            <div style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderTop: '1px solid #EBEBEB',
              padding: '16px 40px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <button onClick={() => setStep('role')} style={{ padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 500, border: '1.5px solid #E0E0E0', background: 'transparent', color: '#555', cursor: 'pointer' }}>
                ← 이전
              </button>
              <button onClick={() => setStep('extra')} style={{ padding: '11px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', background: '#0A0A0A', color: '#fff', transition: 'all 0.2s' }}>
                다음 단계 →
              </button>
            </div>
          </>
        )}

        {/* ── Step 4: 추가 정보 ── */}
        {step === 'extra' && (
          <>
            <div style={{ minHeight: '70vh', background: '#F7F7F8', paddingBottom: 120 }}>
              <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 40px 0' }}>
                <div style={{ background: '#fff', borderRadius: 4, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
                  {[
                    { key: 'awards', label: '수상 내역', placeholder: '예: 2024 해커톤 대상, 교내 알고리즘 경진대회 1위' },
                    { key: 'certifications', label: '자격증 / 수료', placeholder: '예: 정보처리기사, AWS Solutions Architect, Coursera ML 수료' },
                    { key: 'activities', label: '대외 활동 / 기여', placeholder: '예: 오픈소스 기여 (React 이슈 해결), 개발 동아리 운영, 기술 블로그 운영' },
                    { key: 'additional', label: '강조하고 싶은 점', placeholder: '이력서나 레포에 담기 어려운 경험, 특기사항, 목표 등 자유롭게 작성하세요.' },
                  ].map(({ key, label, placeholder }, idx, arr) => (
                    <div key={key} style={{ padding: '20px 24px', borderBottom: idx < arr.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                      <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 8, fontWeight: 500 }}>{label}</label>
                      <textarea
                        value={extraInfo[key as keyof typeof extraInfo]}
                        onChange={(e) => setExtraInfo(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        rows={3}
                        style={{ width: '100%', padding: '12px 14px', border: '1px solid #E5E5E5', borderRadius: 4, fontSize: 14, background: '#FAFAFA', resize: 'vertical', minHeight: 80, boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom fixed CTA */}
            <div style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderTop: '1px solid #EBEBEB',
              padding: '16px 40px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <button onClick={() => setStep('detail')} style={{ padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 500, border: '1.5px solid #E0E0E0', background: 'transparent', color: '#555', cursor: 'pointer' }}>
                ← 이전
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleGenerate} style={{ padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 500, border: '1.5px solid #E0E0E0', background: 'transparent', color: '#555', cursor: 'pointer' }}>
                  건너뛰기
                </button>
                <button onClick={handleGenerate} style={{ padding: '11px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', background: '#0A0A0A', color: '#fff' }}>
                  AI 분석 시작 →
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Step 5: 분석 중 ── */}
        {step === 'generating' && (
          <div className={`${styles.card} ${styles.cardCenter}`}>
            <style>{`
              @keyframes _spin { to { transform: rotate(360deg); } }
              @keyframes _pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
              @keyframes _bar { 0% { width: 0%; } 100% { width: 100%; } }
            `}</style>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              border: '4px solid #ebebeb', borderTopColor: '#000',
              animation: '_spin 0.85s linear infinite',
              marginBottom: 28,
            }} />
            <p style={{ fontSize: 13, color: '#bbb', letterSpacing: 0.3 }}>
              레포지토리를 분석하고 포트폴리오를 작성 중입니다
            </p>
          </div>
        )}

        {/* ── Step 6: 완료 ── */}
        {step === 'done' && portfolio && (
          <div style={{ width: '100%' }}>
            <div style={{ background: '#000', color: '#fff', padding: '48px 60px', marginBottom: 40 }}>
              <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
                <div>
                  <p style={{ fontSize: 11, letterSpacing: 3, color: '#666', marginBottom: 10 }}>AI 분석 완료</p>
                  <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>포트폴리오 초안 완성!</h2>
                  <p style={{ fontSize: 14, color: '#888' }}>AI가 레포지토리를 분석해 초안을 작성했습니다.</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className={styles.cancelBtn} style={{ color: '#fff', borderColor: '#444' }}
                    onClick={() => { setStep('select'); setPortfolio(null); setSelectedRepos(new Set()); setRepoDetails({}); setMajor(''); setCustomMajor(''); setExtraInfo({ awards: '', certifications: '', activities: '', additional: '' }); setError(''); }}>
                    다시 선택하기
                  </button>
                  <button className={styles.nextBtn} style={{ background: '#fff', color: '#000' }}
                    onClick={() => { window.location.hash = 'portfolio-result'; }}>
                    포트폴리오 확인하기 →
                  </button>
                </div>
              </div>
            </div>

            <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ gridColumn: '1 / -1', background: '#f8f8f8', borderRadius: 14, padding: '28px 32px' }}>
                <p style={{ fontSize: 10, letterSpacing: 3, color: '#aaa', marginBottom: 12 }}>소개</p>
                <p style={{ fontSize: 15, lineHeight: 1.9, color: '#333' }}>{portfolio.intro}</p>
              </div>
              <div style={{ gridColumn: '1 / -1', background: '#f8f8f8', borderRadius: 14, padding: '28px 32px' }}>
                <p style={{ fontSize: 10, letterSpacing: 3, color: '#aaa', marginBottom: 14 }}>기술 스택</p>
                <p style={{ fontSize: 15, color: '#333', lineHeight: 1.8 }}>
                  {portfolio.skills.join('  ·  ')}
                </p>
              </div>
              <div style={{ gridColumn: '1 / -1', background: '#f8f8f8', borderRadius: 14, padding: '28px 32px' }}>
                <p style={{ fontSize: 10, letterSpacing: 3, color: '#aaa', marginBottom: 12 }}>요약</p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: '#444' }}>{portfolio.summary}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: 10, letterSpacing: 3, color: '#aaa', marginBottom: 16 }}>프로젝트</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {portfolio.projects.map((p, i) => (
                    <div key={p.name} style={{ background: '#f8f8f8', borderRadius: 14, padding: '24px 28px', display: 'grid', gridTemplateColumns: '40px 1fr', gap: 20, alignItems: 'start' }}>
                      <div style={{ fontSize: 28, fontWeight: 900, color: '#e8e8e8', lineHeight: 1 }}>0{i + 1}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{p.name}</div>
                        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.75, marginBottom: 12 }}>{p.description}</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                          {p.tech.map((t) => (
                            <span key={t} style={{ padding: '3px 12px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 4, fontSize: 12, color: '#555' }}>{t}</span>
                          ))}
                        </div>
                        <p style={{ fontSize: 13, color: '#999', fontStyle: 'italic' }}>{p.highlights}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Suppress unused variable warning */}
      {currentStepIdx === -1 && null}

      <Footer />
      {upgradeOpen && <UpgradeModal reason="daily" onClose={() => setUpgradeOpen(false)} />}
    </div>
  );
}
