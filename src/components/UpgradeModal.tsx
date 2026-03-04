import { useEffect } from 'react';

interface Props {
  reason: 'daily' | 'resume' | 'template';
  onClose: () => void;
}

const REASON_TEXT: Record<Props['reason'], { title: string; desc: string }> = {
  daily:    { title: '하루 포트폴리오 생성 5개 제한을 초과했어요', desc: '오늘 생성 가능한 포트폴리오 수를 모두 사용했습니다.\nPro로 업그레이드하면 하루 무제한으로 생성할 수 있어요.' },
  resume:   { title: '이력서는 1개까지만 업로드할 수 있어요', desc: '무료 플랜은 이력서를 1개만 보관할 수 있습니다.\n기존 이력서를 삭제하거나 Pro로 업그레이드해보세요.' },
  template: { title: 'Pro 전용 템플릿이에요', desc: '이 템플릿은 Pro 플랜에서만 사용할 수 있습니다.\nPro로 업그레이드하면 모든 템플릿을 자유롭게 쓸 수 있어요.' },
};

export default function UpgradeModal({ reason, onClose }: Props) {
  const { title, desc } = REASON_TEXT[reason];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 4,
          padding: '40px 36px 32px',
          width: 420,
          maxWidth: 'calc(100vw - 32px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          position: 'relative',
        }}
      >
        {/* 닫기 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#999', fontSize: 18, lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* 배지 */}
        <div style={{
          display: 'inline-block',
          background: '#0A0A0A', color: '#fff',
          fontSize: 10, fontWeight: 700, letterSpacing: 2,
          padding: '4px 10px',
          marginBottom: 20,
        }}>
          PRO
        </div>

        <h2 style={{
          fontSize: 18, fontWeight: 800, color: '#0A0A0A',
          lineHeight: 1.4, marginBottom: 12,
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: 14, color: '#666', lineHeight: 1.8,
          marginBottom: 28, whiteSpace: 'pre-line',
        }}>
          {desc}
        </p>

        {/* 플랜 비교 */}
        <div style={{
          border: '1px solid #E8E8E8',
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 24,
        }}>
          {/* Free */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E8E8E8', background: '#FAFAFA' }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: '#999', marginBottom: 8 }}>FREE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['하루 5개 생성 제한', '기본 템플릿 6종', '이력서 1개', 'PDF 내보내기', '공유 링크 (30일)'].map((f) => (
                <div key={f} style={{ fontSize: 13, color: '#555', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: '#BBBBBB', fontSize: 11 }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
          {/* Pro */}
          <div style={{ padding: '16px 20px', background: '#0A0A0A' }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: '#888', marginBottom: 8 }}>PRO</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['하루 생성 무제한', '모든 템플릿 사용', '이력서 무제한', 'AI 디자인 커스텀', '공유 링크 영구'].map((f) => (
                <div key={f} style={{ fontSize: 13, color: '#fff', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 11 }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => { onClose(); window.location.hash = '#pricing'; }}
          style={{
            width: '100%',
            padding: '14px 0',
            background: '#0A0A0A', color: '#fff',
            border: 'none', borderRadius: 4,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            letterSpacing: 0.5,
          }}
        >
          Pro 업그레이드 보기 →
        </button>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: 10,
            padding: '12px 0',
            background: 'transparent', color: '#999',
            border: '1px solid #E8E8E8', borderRadius: 4,
            fontSize: 13, cursor: 'pointer',
          }}
        >
          나중에
        </button>
      </div>
    </div>
  );
}
