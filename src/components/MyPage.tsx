import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/MyPage.module.css';
import {
  fetchMyPortfolios,
  deletePortfolioFromServer,
  updatePortfolioOnServer,
  fetchMyResumes,
  deleteResumeFromServer,
  API_BASE,
  type SavedPortfolio,
  type SavedResume,
} from '../utils/portfolioApi';
import type { PortfolioData } from '../utils/templates';

type Tab = 'portfolio' | 'resume' | 'payment';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<Tab>('portfolio');
  const [portfolios, setPortfolios] = useState<SavedPortfolio[]>([]);
  const [portfoliosLoading, setPortfoliosLoading] = useState(true);
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<SavedPortfolio | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editData, setEditData] = useState<PortfolioData | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    const provider = sessionStorage.getItem('auth_provider');
    if (!token) return;

    if (provider === 'google') {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data: { name?: string }) => {
          if (data.name) setUserName(data.name);
        })
        .catch(() => {});
    } else {
      fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data: { success: boolean; user?: { name?: string; login?: string } }) => {
          if (data.success && data.user) {
            setUserName(data.user.name || data.user.login || null);
          }
        })
        .catch(() => {});
    }

    // 포트폴리오 목록 로드
    fetchMyPortfolios()
      .then((result) => {
        if (result.success && result.portfolios) setPortfolios(result.portfolios);
      })
      .catch(() => {})
      .finally(() => setPortfoliosLoading(false));

    // 이력서 목록 로드
    fetchMyResumes()
      .then((result) => {
        if (result.success && result.resumes) setResumes(result.resumes);
      })
      .catch(() => {})
      .finally(() => setResumesLoading(false));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('auth_provider');
    sessionStorage.removeItem('is_admin');
    window.location.hash = '';
  };

  const deletePortfolio = async (id: string) => {
    const result = await deletePortfolioFromServer(id);
    if (result.success) {
      setPortfolios((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const deleteResume = async (id: string) => {
    const result = await deleteResumeFromServer(id);
    if (result.success) {
      setResumes((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const openEdit = (p: SavedPortfolio) => {
    setEditTarget(p);
    setEditTitle(p.title);
    setEditData(JSON.parse(JSON.stringify(p.data)) as PortfolioData);
  };

  const closeEdit = () => {
    setEditTarget(null);
    setEditData(null);
  };

  useEffect(() => {
    if (!editTarget) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEdit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editTarget]);

  const handleEditSave = async () => {
    if (!editTarget || !editData) return;
    setEditSaving(true);
    const result = await updatePortfolioOnServer(editTarget.id, {
      title: editTitle,
      templateId: editTarget.templateId,
      data: editData,
    });
    if (result.success && result.portfolio) {
      setPortfolios((prev) => prev.map((p) => p.id === editTarget.id ? result.portfolio! : p));
      closeEdit();
    } else {
      alert(result.message ?? '저장에 실패했습니다.');
    }
    setEditSaving(false);
  };

  const updateProject = (idx: number, field: string, value: string) => {
    if (!editData) return;
    const projects = [...(editData.projects ?? [])];
    projects[idx] = { ...projects[idx], [field]: field === 'tech' ? value.split(',').map(s => s.trim()).filter(Boolean) : value };
    setEditData({ ...editData, projects });
  };

  const previewPortfolio = (p: SavedPortfolio) => {
    sessionStorage.setItem('portfolio_data', JSON.stringify(p.data));
    sessionStorage.setItem('selected_template', p.templateId);
    sessionStorage.removeItem('ai_design');
    window.location.hash = '#portfolio-result';
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.headerTitle}>
            {userName ? `안녕하세요, ${userName}님` : '마이페이지'}
          </h1>
        </div>
      </section>

      <div className={styles.body}>
        {/* 탭 */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'portfolio' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            내 포트폴리오
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'resume' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            이력서 관리
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'payment' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            결제 내역
          </button>
        </div>

        {/* 포트폴리오 탭 */}
        {activeTab === 'portfolio' && (
          <div className={styles.section}>
            {portfoliosLoading ? (
              <div className={styles.empty}>
                <p className={styles.emptyText} style={{ color: '#bbb' }}>불러오는 중...</p>
              </div>
            ) : portfolios.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyText}>아직 만든 포트폴리오가 없어요.</p>
                <a href="#resume" className={styles.emptyBtn}>포트폴리오 만들기 →</a>
              </div>
            ) : (
              <div className={styles.list}>
                {portfolios.map((p) => (
                  <div key={p.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{p.title}</div>
                      <div className={styles.itemMeta}>
                        {p.templateId} · {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <button className={styles.editBtn} onClick={() => previewPortfolio(p)}>미리보기</button>
                      <button className={styles.editBtn} onClick={() => openEdit(p)}>수정</button>
                      <button className={styles.deleteBtn} onClick={() => deletePortfolio(p.id)}>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 이력서 탭 */}
        {activeTab === 'resume' && (
          <div className={styles.section}>
            {resumesLoading ? (
              <div className={styles.empty}>
                <p className={styles.emptyText} style={{ color: '#bbb' }}>불러오는 중...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyText}>업로드된 이력서가 없어요.</p>
                <a href="#resume" className={styles.emptyBtn}>이력서 업로드 →</a>
              </div>
            ) : (
              <div className={styles.list}>
                {resumes.map((r) => (
                  <div key={r.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemIcon}>📄</div>
                      <div>
                        <div className={styles.itemName}>{r.fileName}</div>
                        <div className={styles.itemMeta}>업로드 · {new Date(r.uploadedAt).toLocaleDateString('ko-KR')}</div>
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <a href="#resume" className={styles.editBtn}>재업로드</a>
                      <button className={styles.deleteBtn} onClick={() => deleteResume(r.id)}>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 결제 내역 탭 */}
        {activeTab === 'payment' && (
          <div className={styles.section}>
            <div className={styles.planCard}>
              <div className={styles.planCardTop}>
                <div>
                  <p className={styles.planCardLabel}>현재 플랜</p>
                  <p className={styles.planCardName}>FREE</p>
                </div>
                <span className={styles.planBadge}>무료</span>
              </div>
              <p className={styles.planCardDesc}>
                하루 포트폴리오 5개 제한 · 기본 템플릿 6종 · 이력서 업로드 1개
              </p>
              <a href="#pricing" className={styles.planUpgradeBtn}>
                Pro로 업그레이드 →
              </a>
            </div>
            <div className={styles.empty} style={{ paddingTop: 40, paddingBottom: 40 }}>
              <p className={styles.emptyText}>결제 내역이 없어요.</p>
            </div>
          </div>
        )}

        {/* 로그아웃 */}
        <div className={styles.logoutSection}>
          <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
        </div>
      </div>

      {/* ── 포트폴리오 편집 모달 ── */}
      {editTarget && editData && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }} onClick={closeEdit}>
          <div style={{
            background: '#fff', borderRadius: 16,
            width: '100%', maxWidth: 680, maxHeight: '88vh',
            overflowY: 'auto', padding: '36px 40px',
            boxSizing: 'border-box',
          }} onClick={(e) => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>포트폴리오 수정</h2>
              <button onClick={closeEdit} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
            </div>

            {/* 제목 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>포트폴리오 제목</label>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #EBEBEB', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
            </div>

            {/* 이름 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>이름</label>
              <input value={editData.name ?? ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #EBEBEB', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
            </div>

            {/* 직군 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>직군</label>
              <input value={editData.role ?? ''} onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #EBEBEB', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
            </div>

            {/* GitHub */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>GitHub URL</label>
              <input value={editData.github ?? ''} onChange={(e) => setEditData({ ...editData, github: e.target.value })}
                placeholder="https://github.com/username"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #EBEBEB', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
            </div>

            {/* 블로그 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>블로그 URL</label>
              <input value={editData.blog ?? ''} onChange={(e) => setEditData({ ...editData, blog: e.target.value })}
                placeholder="https://blog.example.com"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #EBEBEB', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
            </div>

            {/* 소개글 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>소개글</label>
              <textarea value={editData.intro ?? ''} onChange={(e) => setEditData({ ...editData, intro: e.target.value })}
                rows={4} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #EBEBEB', borderRadius: 10, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
            </div>

            {/* 기술 스택 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>기술 스택 (쉼표로 구분)</label>
              <input value={(editData.skills ?? []).join(', ')}
                onChange={(e) => setEditData({ ...editData, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #EBEBEB', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
            </div>

            {/* 프로젝트 */}
            {(editData.projects ?? []).length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 10 }}>프로젝트</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {editData.projects.map((proj, idx) => (
                    <div key={idx} style={{ border: '1.5px solid #EBEBEB', borderRadius: 12, padding: '18px 20px', background: '#FAFAFA' }}>
                      <div style={{ fontSize: 12, color: '#AAA', marginBottom: 10, fontWeight: 600 }}>프로젝트 {idx + 1}</div>
                      {[
                        { label: '이름', field: 'name', value: proj.name },
                        { label: '설명', field: 'description', value: proj.description },
                        { label: '기술 스택 (쉼표 구분)', field: 'tech', value: (proj.tech ?? []).join(', ') },
                        { label: '핵심 성과', field: 'highlights', value: proj.highlights },
                      ].map(({ label, field, value }) => (
                        <div key={field} style={{ marginBottom: 10 }}>
                          <label style={{ fontSize: 11, color: '#AAA', display: 'block', marginBottom: 4 }}>{label}</label>
                          <input value={value ?? ''} onChange={(e) => updateProject(idx, field, e.target.value)}
                            style={{ width: '100%', padding: '9px 12px', border: '1px solid #E8E8E8', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', outline: 'none', background: '#fff' }} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 요약 */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>요약</label>
              <textarea value={editData.summary ?? ''} onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
                rows={3} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #EBEBEB', borderRadius: 10, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
            </div>

            {/* 저장 버튼 */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={closeEdit} style={{ padding: '11px 22px', borderRadius: 10, fontSize: 14, border: '1.5px solid #E0E0E0', background: 'transparent', color: '#555', cursor: 'pointer' }}>
                취소
              </button>
              <button onClick={handleEditSave} disabled={editSaving} style={{ padding: '11px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', cursor: editSaving ? 'not-allowed' : 'pointer', background: '#0A0A0A', color: '#fff' }}>
                {editSaving ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
