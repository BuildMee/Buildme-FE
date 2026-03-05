import { useState, useEffect, useCallback } from 'react';
import { saveSelectedTemplate, saveAiDesign, TEMPLATES, PRO_TEMPLATE_IDS } from '../utils/templates';
import type { AiDesign } from '../utils/templates';
import { PREVIEWS } from './TemplatePreviews';
import { API_BASE } from '../utils/portfolioApi';
import UpgradeModal from './UpgradeModal';

const CATEGORY_KO: Record<string, string> = {
  minimal: '미니멀',
  dark: '다크',
  creative: '크리에이티브',
  tech: '테크',
  ai: 'AI',
};

const TEMPLATE_NAMES_KO: Record<string, string> = {
  'minimal-dark': '미니멀 다크',
  'clean-white': '클린 화이트',
  'blue-accent': '블루 엑센트',
  'terminal': '터미널',
  'grid': '그리드',
  'magazine': '매거진',
  'neo': '네오 브루탈',
  'hacker': '해커 모드',
  'editorial': '에디토리얼',
  'neon': '네온 다크',
  'ai-generate': 'AI 커스텀',
};

const EXAMPLE_PROMPTS = [
  '다크한 터미널 감성',
  '밝고 깔끔한 미니멀',
  '보라색 네온 다크',
  '매거진 레이아웃',
];

export default function TemplateSelectPage() {
  const [index, setIndex] = useState(0);
  const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const isAdmin = sessionStorage.getItem('is_admin') === 'true';

  // AI generation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDesign, setAiDesign] = useState<AiDesign | null>(null);
  const [aiError, setAiError] = useState('');

  const current = TEMPLATES[index];
  const isAiCard = current.id === 'ai-generate';
  const Preview = PREVIEWS[current.id] ?? PREVIEWS['minimal-dark'];

  const navigate = useCallback((dir: 'left' | 'right') => {
    if (isAnimating) return;
    const next = dir === 'right'
      ? (index + 1) % TEMPLATES.length
      : (index - 1 + TEMPLATES.length) % TEMPLATES.length;

    setAnimDir(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setIndex(next);
      setAnimDir(null);
      setIsAnimating(false);
    }, 320);
  }, [index, isAnimating]);

  const returnHash = sessionStorage.getItem('template_select_return') || 'resume';

  const isPro = PRO_TEMPLATE_IDS.includes(current.id);

  const handleConfirm = () => {
    if (isPro && !isAdmin) {
      setUpgradeOpen(true);
      return;
    }
    saveSelectedTemplate(current.id);
    sessionStorage.removeItem('template_select_return');
    window.location.hash = returnHash;
  };

  const handleSkip = () => {
    sessionStorage.removeItem('template_select_return');
    window.location.hash = '';
  };

  // AI generate handler
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim() || aiLoading) return;
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch(`${API_BASE}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json() as { success: boolean; design?: AiDesign; message?: string };
      if (data.success && data.design) {
        setAiDesign(data.design);
      } else {
        setAiError(data.message ?? '생성에 실패했습니다.');
      }
    } catch {
      setAiError('서버 연결에 실패했습니다.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiApply = () => {
    if (!aiDesign) return;
    saveAiDesign(aiDesign);
    saveSelectedTemplate('ai-generate');
    sessionStorage.removeItem('template_select_return');
    window.location.hash = returnHash;
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isAiCard && (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') navigate('right');
      if (e.key === 'ArrowLeft') navigate('left');
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, isAiCard]);

  const exitAnim = animDir === 'right'
    ? 'translateX(-60px) scale(0.97)'
    : animDir === 'left'
      ? 'translateX(60px) scale(0.97)'
      : 'none';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000',
      zIndex: 9000,
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes _aiSpin { to { transform: rotate(360deg); } }
        .preview-enter-right { animation: slideInRight 0.32s cubic-bezier(0.16,1,0.3,1) forwards; }
        .preview-enter-left  { animation: slideInLeft  0.32s cubic-bezier(0.16,1,0.3,1) forwards; }
        .tpl-arrow {
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.18s ease;
          color: #fff; font-size: 18px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .tpl-arrow:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.3);
          transform: scale(1.08);
        }
        .tpl-arrow:disabled { opacity: 0.2; cursor: default; transform: none; }
        .tpl-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.25);
          transition: all 0.2s ease; cursor: pointer;
        }
        .tpl-dot.active { background: #fff; width: 18px; border-radius: 3px; }
        .tpl-cta {
          padding: 13px 32px;
          background: #fff; color: #000;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.5px;
          border: none; border-radius: 8px;
          cursor: pointer; transition: all 0.18s ease;
        }
        .tpl-cta:hover { background: #E8E8E8; transform: translateY(-1px); }
        .tpl-skip {
          padding: 13px 20px;
          background: transparent; color: rgba(255,255,255,0.45);
          font-size: 13px; font-weight: 500;
          border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
          cursor: pointer; transition: all 0.18s ease;
        }
        .tpl-skip:hover { color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.25); }
      `}</style>

      {/* ── Preview area ── */}
      <div
        key={current.id}
        style={{
          position: 'absolute', inset: 0,
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? exitAnim : 'none',
          transition: isAnimating ? 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1)' : 'none',
        }}
      >
        {/* AI card with generated design: show live preview */}
        {isAiCard && aiDesign ? (
          <div style={{
            width: '100%', height: '100%',
            background: aiDesign.backgroundColor,
            color: aiDesign.textColor,
            fontFamily: aiDesign.fontStyle === 'monospace' ? 'monospace'
              : aiDesign.fontStyle === 'serif' ? 'Georgia, serif'
              : '-apple-system, BlinkMacSystemFont, sans-serif',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '48px',
          }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: aiDesign.accentColor, marginBottom: 16 }}>
              AI GENERATED · PORTFOLIO
            </div>
            <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.05, color: aiDesign.primaryColor, marginBottom: 10 }}>
              YOUR NAME
            </div>
            <div style={{ fontSize: 12, letterSpacing: 3, opacity: 0.5, marginBottom: 28 }}>
              DEVELOPER
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
              {['React', 'TypeScript', 'Node.js'].map(s => (
                <span key={s} style={{
                  border: `1px solid ${aiDesign.accentColor}`,
                  padding: '5px 14px', fontSize: 12,
                  color: aiDesign.accentColor,
                }}>{s}</span>
              ))}
            </div>
            <div style={{
              padding: '20px 24px', maxWidth: 400, width: '100%',
              border: `1px solid ${aiDesign.primaryColor}33`,
              borderTop: `3px solid ${aiDesign.accentColor}`,
              background: `${aiDesign.primaryColor}08`,
            }}>
              <div style={{ fontSize: 11, color: aiDesign.accentColor, opacity: 0.5, marginBottom: 6 }}>01</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: aiDesign.primaryColor, marginBottom: 6 }}>Sample Project</div>
              <div style={{ fontSize: 13, opacity: 0.6 }}>프로젝트 설명이 여기에 표시됩니다.</div>
            </div>
          </div>
        ) : (
          <Preview />
        )}
      </div>

      {/* ── Bottom gradient overlay ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: isAiCard ? '62%' : '52%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
        pointerEvents: 'none',
        transition: 'height 0.3s ease',
      }} />

      {/* ── Top bar ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '24px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 800, fontSize: 17,
          color: '#fff', letterSpacing: -0.5,
        }}>buildme</div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11, letterSpacing: 2,
          color: 'rgba(255,255,255,0.45)',
        }}>
          {String(index + 1).padStart(2, '0')} / {String(TEMPLATES.length).padStart(2, '0')}
        </div>
      </div>

      {/* ── Bottom UI ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 48px 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isAiCard ? 20 : 28,
      }}>
        {/* Template info */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10, letterSpacing: 2.5,
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
            }}>
              {CATEGORY_KO[current.category] ?? current.category}
            </div>
            {isPro && !isAdmin && (
              <div style={{
                background: '#fff', color: '#0A0A0A',
                fontSize: 9, fontWeight: 800, letterSpacing: 2,
                padding: '3px 8px',
              }}>
                PRO
              </div>
            )}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 44, fontWeight: 800,
            color: '#fff', lineHeight: 1,
            letterSpacing: -1.5,
            marginBottom: 10,
            transition: 'opacity 0.2s',
          }}>
            {TEMPLATE_NAMES_KO[current.id] ?? current.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 14, color: 'rgba(255,255,255,0.5)',
            fontWeight: 400, letterSpacing: -0.2,
          }}>
            {current.description}
          </div>
        </div>

        {/* AI Prompt Input (only for AI card) */}
        {isAiCard && (
          <div style={{ width: '100%', maxWidth: 480 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {EXAMPLE_PROMPTS.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setAiPrompt(ex)}
                  style={{
                    padding: '5px 12px',
                    background: aiPrompt === ex ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                    color: aiPrompt === ex ? '#fff' : 'rgba(255,255,255,0.4)',
                    border: `1px solid ${aiPrompt === ex ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 0, fontSize: 11,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >{ex}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="원하는 디자인 분위기를 설명해주세요..."
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAiGenerate();
                  }
                }}
                style={{
                  flex: 1, padding: '12px 16px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 0, color: '#fff',
                  fontSize: 14, resize: 'none',
                  outline: 'none', fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.4)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
              />
              <button
                onClick={handleAiGenerate}
                disabled={!aiPrompt.trim() || aiLoading}
                style={{
                  padding: '12px 20px',
                  background: '#fff', color: '#000',
                  border: 'none', borderRadius: 0,
                  fontSize: 13, fontWeight: 700,
                  cursor: !aiPrompt.trim() || aiLoading ? 'not-allowed' : 'pointer',
                  opacity: !aiPrompt.trim() ? 0.4 : 1,
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 8,
                  whiteSpace: 'nowrap',
                }}
              >
                {aiLoading ? (
                  <>
                    <div style={{
                      width: 14, height: 14,
                      border: '2px solid rgba(0,0,0,0.2)',
                      borderTopColor: '#000', borderRadius: '50%',
                      animation: '_aiSpin 0.8s linear infinite',
                    }} />
                    생성 중
                  </>
                ) : '생성하기'}
              </button>
            </div>
            {aiError && (
              <p style={{ color: '#ef4444', fontSize: 12, marginTop: 8, textAlign: 'center' }}>{aiError}</p>
            )}
            {aiDesign && (
              <div style={{
                marginTop: 10, display: 'flex', alignItems: 'center', gap: 10,
                justifyContent: 'center',
              }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[aiDesign.primaryColor, aiDesign.accentColor, aiDesign.backgroundColor, aiDesign.textColor].map((c, i) => (
                    <div key={i} style={{
                      width: 16, height: 16,
                      background: c, border: '1px solid rgba(255,255,255,0.2)',
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                  {aiDesign.mood}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Navigation row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button className="tpl-arrow" onClick={() => navigate('left')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dot indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {TEMPLATES.map((_, i) => (
              <div
                key={i}
                className={`tpl-dot${i === index ? ' active' : ''}`}
                onClick={() => {
                  if (i === index || isAnimating) return;
                  navigate(i > index ? 'right' : 'left');
                  setTimeout(() => setIndex(i), 320);
                }}
              />
            ))}
          </div>

          <button className="tpl-arrow" onClick={() => navigate('right')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* CTA row */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="tpl-skip" onClick={handleSkip}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}>
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            이전
          </button>
          {isAiCard ? (
            <button
              className="tpl-cta"
              onClick={aiDesign ? handleAiApply : handleAiGenerate}
              disabled={!aiDesign && !aiPrompt.trim()}
              style={!aiDesign && !aiPrompt.trim() ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
            >
              {aiDesign ? '이 디자인 적용하기 →' : '디자인을 생성해주세요'}
            </button>
          ) : (
            <button className="tpl-cta" onClick={handleConfirm}>
              {isPro && !isAdmin ? 'Pro 전용' : '이 템플릿 적용하기 →'}
            </button>
          )}
        </div>
      </div>

      {upgradeOpen && <UpgradeModal reason="template" onClose={() => setUpgradeOpen(false)} />}

      {/* ── Left / Right click zones ── */}
      <div
        onClick={() => navigate('left')}
        style={{
          position: 'absolute', left: 0, top: '10%', bottom: '40%',
          width: '12%', cursor: 'w-resize',
        }}
      />
      <div
        onClick={() => navigate('right')}
        style={{
          position: 'absolute', right: 0, top: '10%', bottom: '40%',
          width: '12%', cursor: 'e-resize',
        }}
      />
    </div>
  );
}
