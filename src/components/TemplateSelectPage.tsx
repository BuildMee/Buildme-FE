import { useState, useEffect, useCallback } from 'react';
import { saveSelectedTemplate, clearSelectedTemplate, TEMPLATES, PRO_TEMPLATE_IDS } from '../utils/templates';
import { PREVIEWS } from './TemplatePreviews';
import UpgradeModal from './UpgradeModal';

const CATEGORY_KO: Record<string, string> = {
  minimal: '미니멀',
  dark: '다크',
  creative: '크리에이티브',
  tech: '테크',
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
};

export default function TemplateSelectPage() {
  const [index, setIndex] = useState(0);
  const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const isAdmin = sessionStorage.getItem('is_admin') === 'true';

  const current = TEMPLATES[index];
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

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigate('right');
      if (e.key === 'ArrowLeft') navigate('left');
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

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
        className={
          !isAnimating ? '' :
          animDir === 'right' ? '' :
          animDir === 'left' ? '' : ''
        }
        style={{
          position: 'absolute', inset: 0,
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? exitAnim : 'none',
          transition: isAnimating ? 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1)' : 'none',
        }}
      >
        <Preview />
      </div>

      {/* ── Bottom gradient overlay ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '52%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Top bar ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '24px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 800, fontSize: 17,
          color: '#fff', letterSpacing: -0.5,
        }}>buildme</div>

        {/* Counter */}
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
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
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
                  // jump directly after animation
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
          <button className="tpl-cta" onClick={handleConfirm}>
            {isPro && !isAdmin ? '🔒 Pro 전용' : '이 템플릿 적용하기 →'}
          </button>
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
