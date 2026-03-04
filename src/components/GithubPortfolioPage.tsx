import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/ResumePage.module.css';
import { savePortfolioData, getSelectedTemplate } from '../utils/templates';
import { savePortfolioToServer } from '../utils/portfolioApi';

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

  const [major, setMajor] = useState('');
  const [customMajor, setCustomMajor] = useState('');
  const [repoDetails, setRepoDetails] = useState<Record<string, RepoDetail>>({});
  const [extraInfo, setExtraInfo] = useState({ awards: '', certifications: '', activities: '', additional: '' });

  const [portfolio, setPortfolio] = useState<GeneratedPortfolio | null>(null);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [hoveredRepo, setHoveredRepo] = useState<number | null>(null);

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
          savePortfolioToServer({
            title: `${userName || '내'}의 포트폴리오`,
            templateId: getSelectedTemplate() ?? 'minimal-dark',
            data: portfolioData,
          }).catch(() => {});
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
        padding: step === 'select' ? '36px 60px 0' : '48px 60px 100px',
        boxSizing: 'border-box',
        background: step === 'select' ? '#F4F4F5' : 'transparent',
        minHeight: step === 'select' ? '100vh' : undefined,
      }}>

        {/* ════════════════════════════════════════
            STEP 1 — Premium Select UI
        ════════════════════════════════════════ */}
        {step === 'select' && (
          <>
            <style>{`
              @keyframes repoCardIn {
                from { opacity: 0; transform: translateY(8px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              @keyframes checkPop {
                0%   { transform: scale(0) rotate(-8deg); }
                65%  { transform: scale(1.12) rotate(2deg); }
                100% { transform: scale(1) rotate(0deg); }
              }
              @keyframes counterPulse {
                0%   { transform: scale(1); }
                40%  { transform: scale(1.05); }
                100% { transform: scale(1); }
              }
              @keyframes panelSlideIn {
                from { opacity: 0; transform: translateX(12px); }
                to   { opacity: 1; transform: translateX(0); }
              }
              @keyframes _spin { to { transform: rotate(360deg); } }
              .repo-item { animation: repoCardIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) both; }
              .check-icon { animation: checkPop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
              .counter-num { animation: counterPulse 0.2s ease; }
              .summary-panel { animation: panelSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) both; }
            `}</style>

            <div style={{
              display: 'flex',
              gap: 20,
              maxWidth: 1200,
              margin: '0 auto',
              paddingBottom: 100,
            }}>

              {/* ── LEFT: Repo list ── */}
              <div style={{ flex: '1 1 0', minWidth: 0 }}>

                {/* Filter tabs — segmented control */}
                {!reposLoading && repos.length > 0 && (
                  <div style={{
                    display: 'inline-flex',
                    gap: 2,
                    marginBottom: 16,
                    background: '#EAEAEA',
                    borderRadius: 8,
                    padding: 3,
                  }}>
                    {['all', 'user', ...orgs].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilterOwner(f)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: filterOwner === f ? 600 : 400,
                          border: 'none',
                          background: filterOwner === f ? '#FFFFFF' : 'transparent',
                          color: filterOwner === f ? '#0A0A0A' : '#888888',
                          transition: 'all 0.12s ease',
                          boxShadow: filterOwner === f ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                          whiteSpace: 'nowrap',
                        }}>
                        {f === 'all' ? '전체' : f === 'user' ? '내 레포' : f}
                      </button>
                    ))}
                  </div>
                )}

                {/* Repo cards */}
                {reposLoading ? (
                  <div style={{
                    padding: '80px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                  }}>
                    <div style={{
                      width: 26,
                      height: 26,
                      border: '2px solid #D8D8D8',
                      borderTopColor: '#0A0A0A',
                      borderRadius: '50%',
                      animation: '_spin 0.8s linear infinite',
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: '#BBBBBB',
                      letterSpacing: 1.5,
                    }}>불러오는 중...</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {repos
                      .filter((r) => filterOwner === 'all' || r.owner === filterOwner)
                      .map((r, idx) => {
                        const selected = selectedRepos.has(r.fullName);
                        const maxReached = selectedRepos.size >= 5 && !selected;
                        const isHovered = hoveredRepo === r.id && !maxReached;
                        const langColor = LANG_COLORS[r.language ?? ''] ?? '#888';

                        return (
                          <div
                            key={r.id}
                            className="repo-item"
                            onMouseEnter={() => !maxReached && setHoveredRepo(r.id)}
                            onMouseLeave={() => setHoveredRepo(null)}
                            onClick={() => !maxReached && toggleRepo(r.fullName)}
                            style={{
                              animationDelay: `${Math.min(idx * 28, 280)}ms`,
                              padding: '13px 16px',
                              border: selected
                                ? '1px solid #0A0A0A'
                                : isHovered
                                  ? '1px solid #C0C0C0'
                                  : '1px solid #E4E4E4',
                              borderRadius: 8,
                              cursor: maxReached ? 'not-allowed' : 'pointer',
                              background: selected ? '#FFFFFF' : isHovered ? '#FFFFFF' : '#FAFAFA',
                              boxShadow: selected
                                ? '0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
                                : isHovered
                                  ? '0 1px 6px rgba(0,0,0,0.06)'
                                  : 'none',
                              transition: 'all 0.16s cubic-bezier(0.16, 1, 0.3, 1)',
                              opacity: maxReached ? 0.28 : 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            {/* Left accent bar */}
                            <div style={{
                              position: 'absolute',
                              left: 0, top: 0, bottom: 0,
                              width: selected ? 2 : 0,
                              background: '#0A0A0A',
                              transition: 'width 0.16s ease',
                            }} />

                            {/* Content */}
                            <div style={{
                              flex: 1,
                              paddingLeft: selected ? 8 : 0,
                              minWidth: 0,
                              transition: 'padding 0.16s ease',
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 7,
                                marginBottom: 3,
                                flexWrap: 'wrap',
                              }}>
                                <span style={{
                                  fontFamily: 'var(--font-heading)',
                                  fontWeight: 600,
                                  fontSize: 13.5,
                                  color: '#0A0A0A',
                                  letterSpacing: -0.3,
                                }}>
                                  {r.name}
                                </span>

                                {r.language && (
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    fontSize: 11,
                                    padding: '1px 7px',
                                    background: '#EFEFEF',
                                    borderRadius: 4,
                                    color: '#555',
                                    fontFamily: 'var(--font-mono)',
                                    letterSpacing: 0.1,
                                  }}>
                                    <span style={{
                                      width: 6, height: 6,
                                      borderRadius: '50%',
                                      background: langColor,
                                      flexShrink: 0,
                                    }} />
                                    {r.language}
                                  </span>
                                )}

                                {r.owner !== 'user' && (
                                  <span style={{
                                    fontSize: 11,
                                    padding: '1px 7px',
                                    background: '#EFEFEF',
                                    borderRadius: 4,
                                    color: '#999',
                                    fontFamily: 'var(--font-mono)',
                                    letterSpacing: 0.1,
                                  }}>
                                    {r.owner}
                                  </span>
                                )}
                              </div>

                              <p style={{
                                fontSize: 12,
                                color: '#9A9A9A',
                                lineHeight: 1.4,
                                fontFamily: 'var(--font-heading)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                margin: 0,
                              }}>
                                {r.description ?? '설명 없음'}
                              </p>
                            </div>

                            {/* Checkbox — square for precision */}
                            <div
                              className={selected ? 'check-icon' : ''}
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 5,
                                background: selected ? '#0A0A0A' : 'transparent',
                                border: selected ? 'none' : `1.5px solid ${isHovered ? '#BBBBBB' : '#DEDEDE'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'all 0.14s',
                              }}
                            >
                              {selected && (
                                <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                                  <path d="M1 3.5L3.5 6L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Max reached notice */}
                {selectedRepos.size >= 5 && (
                  <div style={{
                    marginTop: 10,
                    padding: '9px 14px',
                    background: '#FFFBEB',
                    border: '1px solid #EED97A',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <span style={{ fontSize: 13 }}>⚠</span>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: '#7A5800',
                      margin: 0,
                    }}>최대 5개까지 선택 가능합니다.</p>
                  </div>
                )}
              </div>

              {/* ── RIGHT: Control panel ── */}
              <div className="summary-panel" style={{ width: 268, flexShrink: 0 }}>
                <div style={{ position: 'sticky', top: 24 }}>

                  {/* Dark header — count */}
                  <div style={{
                    background: '#0A0A0A',
                    borderRadius: '10px 10px 0 0',
                    padding: '22px 20px 18px',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      letterSpacing: 2.5,
                      color: '#505050',
                      marginBottom: 10,
                      textTransform: 'uppercase',
                    }}>선택된 레포</p>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 14 }}>
                      <span
                        key={selectedRepos.size}
                        className="counter-num"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 68,
                          color: selectedRepos.size > 0 ? '#FFFFFF' : '#242424',
                          lineHeight: 1,
                          transition: 'color 0.25s',
                        }}
                      >{selectedRepos.size}</span>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 30,
                        color: '#303030',
                        lineHeight: 1,
                      }}>/ 5</span>
                    </div>

                    {/* 5-segment bar */}
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} style={{
                          flex: 1,
                          height: 2,
                          borderRadius: 1,
                          background: n <= selectedRepos.size ? '#FFFFFF' : '#1E1E1E',
                          transition: 'background 0.2s ease',
                        }} />
                      ))}
                    </div>
                  </div>

                  {/* Selected list */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E4E4E4',
                    borderTop: 'none',
                    minHeight: 72,
                    padding: '12px 16px',
                  }}>
                    {selectedRepos.size === 0 ? (
                      <p style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 12,
                        color: '#C4C4C4',
                        lineHeight: 1.65,
                        textAlign: 'center',
                        padding: '10px 0',
                        margin: 0,
                      }}>왼쪽 목록에서 레포를 선택하세요.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {Array.from(selectedRepos).map((fullName) => {
                          const repo = repos.find(r => r.fullName === fullName);
                          return (
                            <div key={fullName} style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              background: '#F6F6F6',
                              borderRadius: 6,
                              border: '1px solid #EEEEEE',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                                <div style={{
                                  width: 4, height: 4,
                                  borderRadius: '50%',
                                  background: '#0A0A0A',
                                  flexShrink: 0,
                                }} />
                                <span style={{
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: 12,
                                  color: '#1A1A1A',
                                  fontWeight: 500,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}>
                                  {repo?.name ?? fullName.split('/')[1]}
                                </span>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleRepo(fullName); }}
                                style={{
                                  color: '#C8C8C8',
                                  fontSize: 15,
                                  cursor: 'pointer',
                                  padding: '0 2px',
                                  lineHeight: 1,
                                  flexShrink: 0,
                                  transition: 'color 0.12s',
                                  background: 'transparent',
                                  border: 'none',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0A')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#C8C8C8')}
                              >×</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    disabled={selectedRepos.size === 0}
                    onClick={() => setStep('role')}
                    style={{
                      width: '100%',
                      padding: '13px',
                      background: selectedRepos.size > 0 ? '#0A0A0A' : '#EBEBEB',
                      color: selectedRepos.size > 0 ? '#FFFFFF' : '#BBBBBB',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      border: 'none',
                      borderRadius: '0 0 10px 10px',
                      cursor: selectedRepos.size > 0 ? 'pointer' : 'not-allowed',
                      transition: 'background 0.15s ease',
                      textTransform: 'uppercase',
                    }}
                    onMouseEnter={e => { if (selectedRepos.size > 0) e.currentTarget.style.background = '#1C1C1C'; }}
                    onMouseLeave={e => { if (selectedRepos.size > 0) e.currentTarget.style.background = '#0A0A0A'; }}
                  >
                    {selectedRepos.size > 0 ? '다음 단계 →' : '레포를 먼저 선택하세요'}
                  </button>

                  {/* Info note */}
                  <p style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 11,
                    color: '#BBBBBB',
                    lineHeight: 1.7,
                    marginTop: 14,
                    paddingLeft: 2,
                  }}>
                    ✦ AI가 코드 패턴, 기술 스택, 프로젝트 규모를 분석해 맞춤형 포트폴리오를 생성합니다.
                  </p>
                </div>
              </div>

            </div>
          </>
        )}

        {/* ── Step 2: 직군 선택 ── */}
        {step === 'role' && (
          <div className={styles.card}>
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

        {/* ── Step 3: 프로젝트 상세 ── */}
        {step === 'detail' && (
          <div className={styles.card}>
            {error && <p style={{ color: 'red', marginBottom: 16, fontSize: 14 }}>{error}</p>}

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
              <button className={styles.nextBtn} onClick={() => setStep('extra')}>
                다음 →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: 추가 정보 ── */}
        {step === 'extra' && (
          <div className={styles.card}>
            <div className={styles.fields}>
              {[
                { key: 'awards', label: '수상 내역', placeholder: '예: 2024 해커톤 대상, 교내 알고리즘 경진대회 1위' },
                { key: 'certifications', label: '자격증 / 수료', placeholder: '예: 정보처리기사, AWS Solutions Architect, Coursera ML 수료' },
                { key: 'activities', label: '대외 활동 / 기여', placeholder: '예: 오픈소스 기여 (React 이슈 해결), 개발 동아리 운영, 기술 블로그 운영' },
                { key: 'additional', label: '강조하고 싶은 점', placeholder: '이력서나 레포에 담기 어려운 경험, 특기사항, 목표 등 자유롭게 작성하세요.' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className={styles.field}>
                  <label className={styles.label}>{label}</label>
                  <textarea
                    className={styles.input}
                    value={extraInfo[key as keyof typeof extraInfo]}
                    onChange={(e) => setExtraInfo(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    rows={3}
                    style={{ resize: 'vertical', minHeight: 72 }}
                  />
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={() => setStep('detail')}>← 이전</button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={styles.cancelBtn} onClick={handleGenerate}>건너뛰기</button>
                <button className={styles.nextBtn} onClick={handleGenerate}>
                  AI 분석 시작 →
                </button>
              </div>
            </div>
          </div>
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
            <div style={{ width: 220, height: 3, background: '#ebebeb', borderRadius: 4, overflow: 'hidden', marginBottom: 18 }}>
              <div style={{
                height: '100%', background: '#000', borderRadius: 4,
                animation: '_bar 2.5s ease-in-out infinite',
              }} />
            </div>
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
              <div style={{ background: '#f8f8f8', borderRadius: 14, padding: '28px 32px' }}>
                <p style={{ fontSize: 10, letterSpacing: 3, color: '#aaa', marginBottom: 16 }}>기술 스택</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {portfolio.skills.map((s) => (
                    <span key={s} style={{ padding: '6px 16px', background: '#000', color: '#fff', borderRadius: 20, fontSize: 13 }}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ background: '#000', color: '#fff', borderRadius: 14, padding: '28px 32px' }}>
                <p style={{ fontSize: 10, letterSpacing: 3, color: '#555', marginBottom: 12 }}>요약</p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: '#ccc' }}>{portfolio.summary}</p>
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
    </div>
  );
}
