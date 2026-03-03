import { useState } from 'react';
import Logo from './Logo';
import { updatePortfolioOnServer, type SavedPortfolio } from '../utils/portfolioApi';
import type { PortfolioData } from '../utils/templates';

function loadEditTarget(): { portfolio: SavedPortfolio } | null {
  try {
    const raw = sessionStorage.getItem('editing_portfolio');
    if (!raw) return null;
    return { portfolio: JSON.parse(raw) as SavedPortfolio };
  } catch {
    return null;
  }
}

export default function PortfolioEditPage() {
  const target = loadEditTarget();

  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [form, setForm] = useState<PortfolioData>(
    target?.portfolio.data ?? {
      name: '', role: '', intro: '', skills: [], projects: [], summary: '',
    }
  );
  const [skillsInput, setSkillsInput] = useState(
    target?.portfolio.data.skills.join(', ') ?? ''
  );

  if (!target) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ fontSize: 16, color: '#888' }}>편집할 포트폴리오 정보가 없습니다.</p>
        <button
          onClick={() => { window.location.hash = '#mypage'; }}
          style={{ padding: '10px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}
        >
          마이페이지로
        </button>
      </div>
    );
  }

  const { portfolio } = target;

  const updateProject = (idx: number, key: keyof PortfolioData['projects'][number], value: string | string[]) => {
    setForm((prev) => {
      const projects = prev.projects.map((p, i) => i === idx ? { ...p, [key]: value } : p);
      return { ...prev, projects };
    });
  };

  const addProject = () => {
    setForm((prev) => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', tech: [], highlights: '' }],
    }));
  };

  const removeProject = (idx: number) => {
    setForm((prev) => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    setSaveState('saving');
    const data: PortfolioData = {
      ...form,
      skills: skillsInput.split(',').map((s) => s.trim()).filter(Boolean),
    };
    const result = await updatePortfolioOnServer(portfolio.id, {
      title: `${data.name}의 포트폴리오`,
      templateId: portfolio.templateId,
      data,
    });
    if (result.success) {
      sessionStorage.removeItem('editing_portfolio');
      setSaveState('done');
      setTimeout(() => { window.location.hash = '#mypage'; }, 1000);
    } else {
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 2500);
    }
  };

  const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#555', letterSpacing: 0.5 };
  const inputStyle: React.CSSProperties = { padding: '9px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' };
  const textareaStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical', minHeight: 80, fontFamily: 'inherit' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
      {/* 툴바 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#fff', borderBottom: '1px solid #e8e8e8',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 52,
      }}>
        <a href="#mypage" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <Logo size={28} />
          <span style={{ fontWeight: 700, fontSize: 15, color: '#111', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>buildme</span>
        </a>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => { window.location.hash = '#mypage'; }}
            style={{ padding: '7px 16px', border: '1px solid #ddd', borderRadius: 6, background: '#fff', fontSize: 13, cursor: 'pointer', color: '#666' }}
          >
            ← 취소
          </button>
          <button
            onClick={handleSave}
            disabled={saveState === 'saving' || saveState === 'done'}
            style={{
              padding: '7px 20px', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600,
              cursor: saveState === 'saving' ? 'wait' : 'pointer',
              background: saveState === 'done' ? '#16a34a' : saveState === 'error' ? '#dc2626' : '#000',
              color: '#fff', transition: 'background 0.2s',
            }}
          >
            {saveState === 'saving' ? '저장 중...' : saveState === 'done' ? '✓ 저장됨' : saveState === 'error' ? '오류 발생' : '저장하기'}
          </button>
        </div>
      </div>

      {/* 폼 */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px', width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 32, color: '#111' }}>포트폴리오 편집</h1>

        {/* 기본 정보 */}
        <section style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: '24px', marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 20, letterSpacing: 0.5 }}>기본 정보</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>이름</label>
              <input style={inputStyle} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>직군</label>
              <input style={inputStyle} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder="예: 프론트엔드 개발자" />
            </div>
          </div>
          <div style={{ ...fieldStyle, marginBottom: 16 }}>
            <label style={labelStyle}>소개</label>
            <textarea style={textareaStyle} value={form.intro} onChange={(e) => setForm((p) => ({ ...p, intro: e.target.value }))} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>스킬 (쉼표로 구분)</label>
            <input style={inputStyle} value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="예: React, TypeScript, Node.js" />
          </div>
        </section>

        {/* 프로젝트 */}
        <section style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: '24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111', letterSpacing: 0.5 }}>프로젝트</h2>
            <button
              onClick={addProject}
              style={{ padding: '5px 14px', border: '1px solid #000', borderRadius: 6, background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              + 추가
            </button>
          </div>
          {form.projects.length === 0 && (
            <p style={{ fontSize: 13, color: '#bbb', textAlign: 'center', padding: '20px 0' }}>프로젝트를 추가해주세요.</p>
          )}
          {form.projects.map((proj, idx) => (
            <div key={idx} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: '20px', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#888' }}>PROJECT {String(idx + 1).padStart(2, '0')}</span>
                <button
                  onClick={() => removeProject(idx)}
                  style={{ background: 'none', border: 'none', color: '#bbb', fontSize: 12, cursor: 'pointer' }}
                >
                  삭제
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>프로젝트명</label>
                  <input style={inputStyle} value={proj.name} onChange={(e) => updateProject(idx, 'name', e.target.value)} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>기술 스택 (쉼표로 구분)</label>
                  <input
                    style={inputStyle}
                    value={proj.tech.join(', ')}
                    onChange={(e) => updateProject(idx, 'tech', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                  />
                </div>
              </div>
              <div style={{ ...fieldStyle, marginBottom: 12 }}>
                <label style={labelStyle}>설명</label>
                <textarea style={textareaStyle} value={proj.description} onChange={(e) => updateProject(idx, 'description', e.target.value)} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>주요 성과</label>
                <input style={inputStyle} value={proj.highlights} onChange={(e) => updateProject(idx, 'highlights', e.target.value)} />
              </div>
            </div>
          ))}
        </section>

        {/* 추가 정보 */}
        <section style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: '24px' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 20, letterSpacing: 0.5 }}>추가 정보</h2>
          <div style={{ ...fieldStyle, marginBottom: 16 }}>
            <label style={labelStyle}>한 줄 요약</label>
            <input style={inputStyle} value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>GitHub URL</label>
              <input style={inputStyle} value={form.github ?? ''} onChange={(e) => setForm((p) => ({ ...p, github: e.target.value }))} placeholder="https://github.com/..." />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>블로그 URL</label>
              <input style={inputStyle} value={form.blog ?? ''} onChange={(e) => setForm((p) => ({ ...p, blog: e.target.value }))} placeholder="https://..." />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
