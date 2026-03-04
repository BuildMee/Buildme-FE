import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

type Status = 'all' | 'pending' | 'approved' | 'rejected';

interface Submission {
  id: string;
  name: string;
  category: string;
  description: string;
  previewUrl: string;
  githubUrl: string;
  author: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending: '검토 대기',
  approved: '승인',
  rejected: '거절',
};

const STATUS_COLOR: Record<string, string> = {
  pending: '#F59E0B',
  approved: '#10B981',
  rejected: '#EF4444',
};

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';
  const token = sessionStorage.getItem('access_token');

  const isAdmin = sessionStorage.getItem('is_admin') === 'true';

  useEffect(() => {
    if (!isAdmin) return;
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const query = filter !== 'all' ? `?status=${filter}` : '';
      const res = await fetch(`${apiBase}/api/templates/submissions${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json() as { success: boolean; submissions?: Submission[] };
      if (data.success && data.submissions) setSubmissions(data.submissions);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      const res = await fetch(`${apiBase}/api/templates/submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json() as { success: boolean; submission?: Submission };
      if (data.success && data.submission) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? data.submission! : s))
        );
      }
    } catch {
      /* ignore */
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🔒</p>
          <p style={{ fontSize: 16, color: '#888' }}>접근 권한이 없습니다.</p>
          <a href="/" style={{ marginTop: 16, display: 'inline-block', fontSize: 14, color: '#0A0A0A', textDecoration: 'underline' }}>홈으로</a>
        </div>
      </div>
    );
  }

  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
  };

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <section style={{ background: '#0A0A0A', padding: '80px 80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, color: '#666', marginBottom: 12, textTransform: 'uppercase' }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 52, color: '#fff', marginBottom: 8, lineHeight: 1 }}>템플릿 제출 관리</h1>
          <p style={{ fontSize: 14, color: '#666' }}>커뮤니티가 제출한 템플릿을 검토하고 승인 또는 거절하세요.</p>
        </div>
      </section>

      {/* Filter tabs + counts */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 80px 0' }}>
        <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #E5E5E5', paddingBottom: 0 }}>
          {(['all', 'pending', 'approved', 'rejected'] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: filter === s ? 700 : 400,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: filter === s ? '#0A0A0A' : '#888',
                borderBottom: filter === s ? '2px solid #0A0A0A' : '2px solid transparent',
                marginBottom: -1,
                transition: 'all 0.15s',
              }}
            >
              {s === 'all' ? '전체' : STATUS_LABEL[s]}
              <span style={{
                marginLeft: 6,
                fontSize: 11,
                background: s === 'pending' ? '#FEF3C7' : s === 'approved' ? '#D1FAE5' : s === 'rejected' ? '#FEE2E2' : '#F0F0F0',
                color: s === 'pending' ? '#92400E' : s === 'approved' ? '#065F46' : s === 'rejected' ? '#991B1B' : '#555',
                padding: '1px 7px',
                borderRadius: 10,
              }}>
                {s === 'all' ? submissions.length : counts[s]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 80px 80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#BBB', fontSize: 14 }}>불러오는 중...</div>
        ) : submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#BBB', fontSize: 14 }}>제출된 템플릿이 없습니다.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {submissions.map((s) => (
              <div key={s.id} style={{
                background: '#fff',
                border: '1px solid #E5E5E5',
                borderRadius: 4,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
              }}>
                {/* Status bar */}
                <div style={{
                  width: 4, borderRadius: 2, alignSelf: 'stretch', flexShrink: 0,
                  background: STATUS_COLOR[s.status],
                }} />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A' }}>{s.name}</span>
                    <span style={{
                      fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: 1,
                      padding: '2px 8px', background: '#F0F0F0', color: '#666', borderRadius: 2,
                    }}>{s.category}</span>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 10,
                      background: s.status === 'pending' ? '#FEF3C7' : s.status === 'approved' ? '#D1FAE5' : '#FEE2E2',
                      color: s.status === 'pending' ? '#92400E' : s.status === 'approved' ? '#065F46' : '#991B1B',
                      fontWeight: 600,
                    }}>{STATUS_LABEL[s.status]}</span>
                  </div>

                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 10 }}>{s.description}</p>

                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#888', marginBottom: 8 }}>
                    <span>👤 @{s.author}</span>
                    <span>🕐 {new Date(s.submittedAt).toLocaleDateString('ko-KR')}</span>
                    {s.githubUrl && <a href={s.githubUrl} target="_blank" rel="noreferrer" style={{ color: '#0A0A0A', textDecoration: 'underline' }}>GitHub ↗</a>}
                    {s.previewUrl && <a href={s.previewUrl} target="_blank" rel="noreferrer" style={{ color: '#0A0A0A', textDecoration: 'underline' }}>미리보기 ↗</a>}
                  </div>

                  {s.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {s.tags.map((tag) => (
                        <span key={tag} style={{ fontSize: 11, padding: '2px 8px', background: '#F5F5F5', color: '#666', borderRadius: 2 }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {s.status === 'pending' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => updateStatus(s.id, 'approved')}
                      disabled={processingId === s.id}
                      style={{
                        padding: '8px 18px', fontSize: 13, fontWeight: 700,
                        border: 'none', borderRadius: 4, cursor: 'pointer',
                        background: '#10B981', color: '#fff',
                        opacity: processingId === s.id ? 0.5 : 1,
                      }}
                    >승인</button>
                    <button
                      onClick={() => updateStatus(s.id, 'rejected')}
                      disabled={processingId === s.id}
                      style={{
                        padding: '8px 18px', fontSize: 13, fontWeight: 600,
                        border: '1px solid #E5E5E5', borderRadius: 4, cursor: 'pointer',
                        background: '#fff', color: '#EF4444',
                        opacity: processingId === s.id ? 0.5 : 1,
                      }}
                    >거절</button>
                  </div>
                )}
                {s.status !== 'pending' && (
                  <button
                    onClick={() => updateStatus(s.id, 'pending')}
                    disabled={processingId === s.id}
                    style={{
                      padding: '8px 14px', fontSize: 12,
                      border: '1px solid #E5E5E5', borderRadius: 4, cursor: 'pointer',
                      background: '#fff', color: '#888', flexShrink: 0,
                      opacity: processingId === s.id ? 0.5 : 1,
                    }}
                  >대기로 되돌리기</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
