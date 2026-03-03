import { useState } from 'react';
import Navbar from './Navbar';
import { saveSelectedTemplate, clearSelectedTemplate, TEMPLATES } from '../utils/templates';
import { PREVIEWS } from './TemplatePreviews';

export default function TemplateSelectPage() {
  const [selected, setSelected] = useState(TEMPLATES[0].id);
  const Preview = PREVIEWS[selected] ?? PREVIEWS['minimal-dark'];

  const handleConfirm = () => {
    saveSelectedTemplate(selected);
    window.location.hash = 'resume';
  };

  const handleSkip = () => {
    clearSelectedTemplate();
    window.location.hash = 'resume';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 60px)' }}>

        {/* ── 왼쪽: 미리보기 ── */}
        <div style={{
          flex: '0 0 55%', position: 'sticky', top: 60,
          height: 'calc(100vh - 60px)',
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid #e8e8e8',
        }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid #e8e8e8', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, color: '#aaa', marginBottom: 2 }}>PREVIEW</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                {TEMPLATES.find(t => t.id === selected)?.name}
              </div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', background: '#f0f0f0', borderRadius: 20, color: '#666' }}>
              {TEMPLATES.find(t => t.id === selected)?.category}
            </span>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Preview />
          </div>
        </div>

        {/* ── 오른쪽: 템플릿 목록 ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 120px' }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>템플릿 선택</h2>
            <p style={{ fontSize: 13, color: '#888' }}>원하는 스타일을 골라주세요. 나중에 언제든 바꿀 수 있어요.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TEMPLATES.map((t) => {
              const isSelected = selected === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  style={{
                    padding: '16px 18px', borderRadius: 10, cursor: 'pointer',
                    border: isSelected ? '2px solid #000' : '2px solid #e8e8e8',
                    background: isSelected ? '#f8f8f8' : '#fff',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{t.description}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', background: '#f0f0f0', borderRadius: 20, color: '#666' }}>{t.category}</span>
                    {isSelected && <span style={{ fontSize: 16, fontWeight: 700 }}>✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 하단 고정 버튼 바 ── */}
      <div style={{
        position: 'fixed', bottom: 0, right: 0,
        width: '45%',
        background: '#fff', borderTop: '1px solid #e8e8e8',
        padding: '16px 28px',
        display: 'flex', justifyContent: 'flex-end', gap: 10,
      }}>
        <button
          onClick={handleSkip}
          style={{
            padding: '11px 20px', border: '1px solid #ddd', borderRadius: 8,
            background: '#fff', cursor: 'pointer', fontSize: 14, color: '#666',
          }}
        >
          나중에 선택
        </button>
        <button
          onClick={handleConfirm}
          style={{
            padding: '11px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            border: 'none', cursor: 'pointer',
            background: '#000', color: '#fff',
          }}
        >
          이력서 업로드하기 →
        </button>
      </div>
    </div>
  );
}
