import { useEffect, useState } from 'react';
import { fetchPublicPortfolio } from '../utils/portfolioApi';
import type { PortfolioData } from '../utils/templates';
import { TEMPLATE_MAP } from './PortfolioResultPage';

export default function PublicPortfolioPage() {
  const token = window.location.hash.replace(/^#portfolio-public\//, '');

  const [state, setState] = useState<'loading' | 'done' | 'error'>('loading');
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [templateId, setTemplateId] = useState('minimal-dark');
  const [title, setTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // 토큰 변경 시 즉시 loading 상태로 리셋 (stale UI 방지)
    setState('loading');
    setPortfolioData(null);

    if (!token) {
      setState('error');
      setErrorMsg('유효하지 않은 링크입니다.');
      return;
    }

    let cancelled = false; // race condition 방지

    fetchPublicPortfolio(token).then((result) => {
      if (cancelled) return; // 이전 요청 응답 무시
      if (result.success && result.data) {
        setPortfolioData(result.data);
        setTemplateId(result.templateId ?? 'minimal-dark');
        setTitle(result.title ?? '');
        setState('done');
      } else {
        setErrorMsg(result.message ?? '포트폴리오를 불러올 수 없습니다.');
        setState('error');
      }
    });

    return () => { cancelled = true; }; // cleanup으로 이전 요청 무효화
  }, [token]);

  if (state === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #eee', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 14, color: '#888' }}>포트폴리오 불러오는 중...</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 32 }}>🔗</p>
        <p style={{ fontSize: 18, fontWeight: 700 }}>링크를 찾을 수 없어요</p>
        <p style={{ fontSize: 14, color: '#888' }}>{errorMsg}</p>
        <button
          onClick={() => { window.location.hash = ''; }}
          style={{ marginTop: 8, padding: '10px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}
        >
          홈으로
        </button>
      </div>
    );
  }

  const TemplateComponent = TEMPLATE_MAP[templateId] ?? TEMPLATE_MAP['minimal-dark'];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* 공개 뷰 상단 배너 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 48, fontSize: 13,
      }}>
        <span style={{ fontWeight: 700, color: '#111' }}>{title}</span>
        <a
          href="#"
          style={{ color: '#888', textDecoration: 'none', fontSize: 12 }}
        >
          buildme로 만들기 →
        </a>
      </div>
      <div style={{ paddingTop: 48 }}>
        {portfolioData && <TemplateComponent data={portfolioData} />}
      </div>
    </div>
  );
}
