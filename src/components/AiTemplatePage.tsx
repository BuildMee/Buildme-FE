import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { saveAiDesign, saveSelectedTemplate } from '../utils/templates';
import type { AiDesign } from '../utils/templates';
import { API_BASE } from '../utils/portfolioApi';

const EXAMPLE_PROMPTS = [
  '다크한 터미널 감성의 개발자 포트폴리오',
  '밝고 깔끔한 미니멀 스타일',
  '보라색 네온 포인트의 다크 테마',
  '고급스러운 매거진 레이아웃',
  '그리드 기반의 모던한 디자인',
  '따뜻한 톤의 세리프 포트폴리오',
];

export default function AiTemplatePage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [design, setDesign] = useState<AiDesign | null>(null);
  const [error, setError] = useState('');
  const [fallback, setFallback] = useState(false);

  const fontFamily = (style: string) =>
    style === 'monospace' ? 'monospace'
    : style === 'serif' ? 'Georgia, serif'
    : '-apple-system, BlinkMacSystemFont, sans-serif';

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError('');
    setFallback(false);
    try {
      const res = await fetch(`${API_BASE}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json() as { success: boolean; design?: AiDesign; message?: string; fallback?: boolean };
      if (data.success && data.design) {
        setDesign(data.design);
        if (data.fallback) setFallback(true);
      } else {
        setError(data.message ?? '생성에 실패했습니다.');
      }
    } catch {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!design) return;
    saveAiDesign(design);
    saveSelectedTemplate('ai-generate');
    window.location.hash = 'resume';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <Navbar />

      {/* Header */}
      <section style={{
        maxWidth: 1400, margin: '0 auto',
        padding: '80px 80px 0',
      }}>
        <h1 style={{
          fontSize: 48, fontWeight: 900, color: '#0A0A0A',
          lineHeight: 1.1, marginBottom: 16,
          fontFamily: 'var(--font-heading)',
        }}><span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 900 }}>AI</span>로 나만의 템플릿 만들기</h1>
        <p style={{ fontSize: 16, color: '#888', lineHeight: 1.7 }}>
          원하는 분위기를 설명하면 AI가 나만의 포트폴리오 디자인을 생성합니다.
        </p>
      </section>

      {/* Main content */}
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        padding: '48px 80px 100px',
        display: 'grid',
        gridTemplateColumns: design ? '1fr 1fr' : '1fr',
        gap: 40,
        alignItems: 'start',
      }}>
        {/* Left: Input */}
        <div>
          {/* Prompt input */}
          <div style={{
            background: '#fff', borderRadius: 0,
            border: '1px solid #E8E8E8',
            padding: '32px',
          }}>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600,
              color: '#999', letterSpacing: 1,
              marginBottom: 12, textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}>디자인 설명</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="원하는 포트폴리오 디자인의 분위기를 자유롭게 설명해주세요..."
              rows={4}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              style={{
                width: '100%', padding: '16px',
                border: '1.5px solid #EBEBEB', borderRadius: 0,
                fontSize: 15, lineHeight: 1.6,
                resize: 'vertical', outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                background: '#FAFAFA',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#0A0A0A')}
              onBlur={(e) => (e.target.style.borderColor = '#EBEBEB')}
            />

            {/* Example chips */}
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {EXAMPLE_PROMPTS.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  style={{
                    padding: '6px 14px', borderRadius: 0,
                    background: prompt === ex ? '#0A0A0A' : '#F5F5F5',
                    color: prompt === ex ? '#fff' : '#888',
                    border: 'none', fontSize: 12,
                    cursor: 'pointer', transition: 'all 0.15s',
                    fontWeight: 500,
                  }}
                >{ex}</button>
              ))}
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              style={{
                marginTop: 24, width: '100%',
                padding: '16px',
                background: loading ? 'rgba(10,10,10,0.5)' : '#0A0A0A',
                color: '#fff', border: 'none', borderRadius: 0,
                fontSize: 15, fontWeight: 700,
                cursor: !prompt.trim() || loading ? 'not-allowed' : 'pointer',
                opacity: !prompt.trim() ? 0.4 : 1,
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              {loading ? (
                <>
                  <style>{`@keyframes _spin { to { transform: rotate(360deg); } }`}</style>
                  <div style={{
                    width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: '_spin 0.8s linear infinite',
                  }} />
                  AI 생성 중...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  디자인 생성하기
                </>
              )}
            </button>

            {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 12, textAlign: 'center' }}>{error}</p>}
            {fallback && <p style={{ color: '#f59e0b', fontSize: 13, marginTop: 12, textAlign: 'center' }}>API 한도 초과로 추천 디자인이 적용되었습니다.</p>}
          </div>
        </div>

        {/* Right: Preview */}
        {design && (
          <div>
            {/* Live preview */}
            <div style={{
              borderRadius: 0, overflow: 'hidden',
              border: '1px solid #E8E8E8',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            }}>
              <div style={{
                background: design.backgroundColor,
                color: design.textColor,
                fontFamily: fontFamily(design.fontStyle),
                padding: '48px 40px',
                minHeight: 440,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: design.accentColor, marginBottom: 16 }}>
                  AI GENERATED · PORTFOLIO
                </div>
                <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.05, color: design.primaryColor, marginBottom: 10 }}>
                  YOUR NAME
                </div>
                <div style={{ fontSize: 12, letterSpacing: 3, opacity: 0.5, marginBottom: 28 }}>
                  DEVELOPER
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.7, marginBottom: 28, maxWidth: 440 }}>
                  AI가 생성한 디자인 프리뷰입니다. 실제 포트폴리오에서는 입력한 정보가 표시됩니다.
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                  {['React', 'TypeScript', 'Node.js'].map(s => (
                    <span key={s} style={{
                      border: `1px solid ${design.accentColor}`,
                      padding: '5px 14px', fontSize: 12,
                      color: design.accentColor,
                      borderRadius: design.layout === 'minimal' ? 0 : design.layout === 'grid' ? 4 : 12,
                    }}>{s}</span>
                  ))}
                </div>
                <div style={{
                  padding: '20px 24px',
                  border: `1px solid ${design.primaryColor}33`,
                  borderTop: `3px solid ${design.accentColor}`,
                  borderRadius: design.layout === 'grid' ? 4 : 0,
                  background: `${design.primaryColor}08`,
                }}>
                  <div style={{ fontSize: 11, color: design.accentColor, opacity: 0.5, marginBottom: 6 }}>01</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: design.primaryColor, marginBottom: 6 }}>Sample Project</div>
                  <div style={{ fontSize: 13, opacity: 0.6 }}>프로젝트 설명이 여기에 표시됩니다.</div>
                </div>
              </div>
            </div>

            {/* Design info */}
            <div style={{
              marginTop: 16, padding: '20px 24px',
              background: '#fff', borderRadius: 0,
              border: '1px solid #E8E8E8',
              display: 'flex', flexWrap: 'wrap', gap: 16,
              alignItems: 'center',
            }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 11, color: '#AAA', fontFamily: 'var(--font-mono)', letterSpacing: 1, marginBottom: 6 }}>MOOD</div>
                <div style={{ fontSize: 14, color: '#555', fontStyle: 'italic' }}>{design.mood}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[design.primaryColor, design.accentColor, design.backgroundColor, design.textColor].map((c, i) => (
                  <div key={i} style={{
                    width: 28, height: 28, borderRadius: 0,
                    background: c, border: '1px solid #E0E0E0',
                  }} title={c} />
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#AAA', fontFamily: 'var(--font-mono)' }}>
                {design.fontStyle} · {design.layout}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setDesign(null); setPrompt(''); }}
                style={{
                  flex: 1, padding: '14px',
                  background: 'transparent',
                  border: '1.5px solid #E0E0E0',
                  borderRadius: 0, fontSize: 14,
                  fontWeight: 600, color: '#888',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                다시 만들기
              </button>
              <button
                onClick={handleApply}
                style={{
                  flex: 2, padding: '14px',
                  background: '#0A0A0A', color: '#fff',
                  border: 'none', borderRadius: 0,
                  fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                이 디자인으로 포트폴리오 만들기 →
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
