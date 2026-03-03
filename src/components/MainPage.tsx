import { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { GitHubIcon, UploadIcon } from './Icons';
import { handleGitHubLogin } from '../utils/auth';
import { saveSelectedTemplate, TEMPLATES } from '../utils/templates';
import styles from '../styles/MainPage.module.css';

/* ===== Types ===== */
type Category = 'all' | 'minimal' | 'dark' | 'creative' | 'tech';

interface Template {
  id: string;
  name: string;
  category: 'minimal' | 'dark' | 'creative' | 'tech';
  Preview: React.ComponentType;
}

/* ===== Mini-preview components (pure CSS) ===== */
function PreviewMinimalDark() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewDark}`}>
      <div className={styles.darkName}>Kim Developers</div>
      <div className={styles.darkTags}>
        <span className={styles.darkTag}>React</span>
        <span className={styles.darkTag}>TypeScript</span>
        <span className={styles.darkTag}>Node.js</span>
      </div>
      <div className={styles.darkProject}>01 &mdash; E-commerce Platform</div>
      <div className={styles.darkProject}>02 &mdash; Real-time Chat App</div>
      <div className={styles.darkProject}>03 &mdash; CI/CD Dashboard</div>
    </div>
  );
}

function PreviewCleanWhite() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewWhite}`}>
      <div className={styles.whiteName}>Portfolio</div>
      <div className={styles.whiteDivider} />
      <div className={styles.whiteRole}>FULL-STACK DEVELOPER</div>
      <div className={styles.whiteSection}>Experience</div>
      <div className={styles.whiteItem}>Frontend Lead &mdash; 2022-Present</div>
      <div className={styles.whiteItem}>Software Engineer &mdash; 2020-2022</div>
      <div style={{ height: 12 }} />
      <div className={styles.whiteSection}>Projects</div>
      <div className={styles.whiteItem}>Design System Library</div>
      <div className={styles.whiteItem}>API Gateway Service</div>
    </div>
  );
}

function PreviewBlueAccent() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewBlue}`}>
      <div className={styles.blueSidebar} />
      <div className={styles.blueContent}>
        <div className={styles.blueName}>Lee Seongjin</div>
        <div className={styles.blueRole}>FRONTEND ENGINEER</div>
        <div className={styles.blueBarMed} />
        <div className={styles.blueBarShort} />
        <div className={styles.blueBar} />
        <div className={styles.blueBarMed} />
      </div>
    </div>
  );
}

function PreviewTerminal() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewTerminal}`}>
      <div className={styles.termBar}>
        <span className={`${styles.termDot} ${styles.termDotRed}`} />
        <span className={`${styles.termDot} ${styles.termDotYellow}`} />
        <span className={`${styles.termDot} ${styles.termDotGreen}`} />
      </div>
      <div className={styles.termLine}>
        <span className={styles.termComment}># portfolio.sh</span>
      </div>
      <div className={styles.termLine}>
        <span className={styles.termPrompt}>$ </span>whoami
      </div>
      <div className={styles.termLine}>Park Jiwon &mdash; Backend Dev</div>
      <div className={styles.termLine}>
        <span className={styles.termPrompt}>$ </span>ls projects/
      </div>
      <div className={styles.termLine}>auth-service/ api-gateway/ k8s-config/</div>
      <div className={styles.termLine}>
        <span className={styles.termPrompt}>$ </span>
        <span className={styles.termCursor} />
      </div>
    </div>
  );
}

function PreviewGrid() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewGrid}`}>
      <div className={styles.gridCellWide}>
        <div className={styles.gridLabel}>Name</div>
        <div className={styles.gridValue}>Choi Minseo</div>
      </div>
      <div className={styles.gridCell}>
        <div className={styles.gridLabel}>Project</div>
        <div className={styles.gridValue}>Dashboard</div>
      </div>
      <div className={styles.gridCell}>
        <div className={styles.gridLabel}>Project</div>
        <div className={styles.gridValue}>CLI Tool</div>
      </div>
      <div className={styles.gridCell}>
        <div className={styles.gridLabel}>Stack</div>
        <div className={styles.gridValue}>Go, Docker</div>
      </div>
      <div className={styles.gridCell}>
        <div className={styles.gridLabel}>Year</div>
        <div className={styles.gridValue}>2025</div>
      </div>
    </div>
  );
}

function PreviewMagazine() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewMagazine}`}>
      <div className={styles.magName}>JUNG<br />HANA</div>
      <div className={styles.magSub}>CREATIVE DEVELOPER</div>
    </div>
  );
}

/* ===== Template data ===== */
const templates: Template[] = [
  { id: 'minimal-dark', name: 'Minimal Dark', category: 'dark', Preview: PreviewMinimalDark },
  { id: 'clean-white', name: 'Clean White', category: 'minimal', Preview: PreviewCleanWhite },
  { id: 'blue-accent', name: 'Blue Accent', category: 'creative', Preview: PreviewBlueAccent },
  { id: 'terminal', name: 'Terminal', category: 'tech', Preview: PreviewTerminal },
  { id: 'grid', name: 'Grid', category: 'minimal', Preview: PreviewGrid },
  { id: 'magazine', name: 'Magazine', category: 'creative', Preview: PreviewMagazine },
];

const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'ALL', value: 'all' },
  { label: 'MINIMAL', value: 'minimal' },
  { label: 'DARK', value: 'dark' },
  { label: 'CREATIVE', value: 'creative' },
  { label: 'TECH', value: 'tech' },
];

const STAGGER: Record<number, string> = {
  0: styles.stagger0,
  1: styles.stagger1,
  2: styles.stagger2,
  3: styles.stagger3,
  4: styles.stagger4,
  5: styles.stagger5,
};

interface AiDesign {
  theme: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontStyle: string;
  layout: string;
  mood: string;
}

/* ===== Main Page Component ===== */
export default function MainPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiDesign | null>(null);
  const [aiError, setAiError] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [pickedTemplate, setPickedTemplate] = useState('');
  const isLoggedIn = !!sessionStorage.getItem('access_token');

  const handleResumeStart = () => { window.location.hash = 'template-select'; };

  const handleTemplateConfirm = () => {
    if (pickedTemplate) saveSelectedTemplate(pickedTemplate);
    setShowTemplateModal(false);
    window.location.hash = 'resume';
  };

  const filtered = activeFilter === 'all'
    ? templates
    : templates.filter((t) => t.category === activeFilter);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    setAiError('');
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';
      const res = await fetch(`${apiBase}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json() as { success: boolean; design?: AiDesign; message?: string };
      if (data.success && data.design) {
        setAiResult(data.design);
      } else {
        setAiError(data.message ?? '생성에 실패했습니다.');
      }
    } catch {
      setAiError('서버 연결에 실패했습니다.');
    } finally {
      setAiLoading(false);
    }
  };

  /* Intersection Observer for staggered card entrance */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.id;
            if (id) {
              setVisibleCards((prev) => new Set(prev).add(id));
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    const cards = grid.querySelectorAll('[data-id]');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [filtered]);

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ===== Hero ===== */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroHeadline}>GitHub에 쌓인 당신의 시간.<br />이제 하나의 작품으로.</h1>
          <p className={styles.heroSub}>
            GitHub 연동 또는 이력서 업로드를 통해<br />당신만의 작품을 만들어보세요.
          </p>
          <div className={styles.heroCtas}>
            <div className={styles.heroCtaRow}>
              <button
                className={styles.btnPrimary}
                onClick={isLoggedIn ? () => { window.location.hash = 'github-portfolio'; } : handleGitHubLogin}
              >
                <GitHubIcon />
                {isLoggedIn ? '프로젝트 선택하기' : 'GitHub으로 시작하기'}
              </button>
              <span className={styles.ctaDivider}>또는</span>
              <button className={styles.btnOutline} onClick={handleResumeStart}>
                <UploadIcon />
                이력서로 시작하기
              </button>
            </div>
            <button className={styles.btnGhost}>템플릿 둘러보기 →</button>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>890+</div>
            <div className={styles.statLabel}>만들어진 포트폴리오</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>1,200+</div>
            <div className={styles.statLabel}>총 사용자</div>
          </div>
        </div>
      </section>

      {/* ===== Template Gallery ===== */}
      <section className={styles.gallery}>
        <h2 className={styles.sectionTitle}>Templates</h2>

        <div className={styles.filterTabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`${styles.filterTab} ${activeFilter === cat.value ? styles.filterTabActive : ''}`}
              onClick={() => {
                setActiveFilter(cat.value);
                setVisibleCards(new Set());
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className={styles.templateGrid} ref={gridRef}>
          {filtered.map((tpl, idx) => (
            <div
              key={tpl.id}
              data-id={tpl.id}
              className={`${styles.templateCard} ${visibleCards.has(tpl.id) ? styles.cardVisible : ''} ${STAGGER[idx] ?? ''}`}
            >
              <tpl.Preview />
              <div className={styles.cardOverlay} onClick={() => { saveSelectedTemplate(tpl.id); window.location.hash = 'resume'; }} style={{ cursor: 'pointer' }}>
                <span className={styles.overlayText}>템플릿 사용하기</span>
              </div>
              <div className={styles.cardFooter}>
                <div>
                  <div className={styles.cardName}>{tpl.name}</div>
                  <div className={styles.cardCategory}>{tpl.category}</div>
                </div>
                <button className={styles.useBtn} onClick={() => { saveSelectedTemplate(tpl.id); window.location.hash = 'resume'; }}>사용하기</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== AI Custom Section ===== */}
      <section className={styles.aiSection}>
        <div className={styles.aiInner}>
          <span className={styles.aiLabel}>AI CUSTOM DESIGN</span>
          <h2 className={styles.aiHeadline}>나만의 디자인을 만들어보세요.</h2>
          <p className={styles.aiDesc}>
            원하는 스타일을 설명하면 AI가 맞춤 디자인을 생성합니다. 컬러, 레이아웃, 분위기 모두 자유롭게.
          </p>
          <div className={styles.aiInputRow}>
            <input
              className={styles.aiInput}
              placeholder="미니멀하고 다크한 개발자 포트폴리오"
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAiGenerate(); }}
            />
            <button className={styles.aiSubmit} onClick={handleAiGenerate} disabled={aiLoading}>
              {aiLoading ? '생성 중...' : '생성하기'}
            </button>
          </div>
          {aiError && <p style={{ color: '#ff6b6b', marginTop: 16, fontSize: 14 }}>{aiError}</p>}
          {aiResult && (
            <div style={{
              marginTop: 24,
              padding: 24,
              borderRadius: 12,
              background: aiResult.backgroundColor,
              color: aiResult.textColor,
              border: `2px solid ${aiResult.accentColor}`,
            }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, fontFamily: 'monospace' }}>
                AI GENERATED DESIGN
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: aiResult.primaryColor }}>
                {aiResult.mood}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 13 }}>
                <span>레이아웃: {aiResult.layout}</span>
                <span>폰트: {aiResult.fontStyle}</span>
                <span>테마: {aiResult.theme}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  주색상: <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 3, background: aiResult.primaryColor }} />
                  {aiResult.primaryColor}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  강조색: <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 3, background: aiResult.accentColor }} />
                  {aiResult.accentColor}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* ── 템플릿 선택 모달 ── */}
      {showTemplateModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowTemplateModal(false); }}
        >
          <div style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560,
            maxHeight: '80vh', overflowY: 'auto',
            padding: '32px 28px',
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>템플릿 선택</h2>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>
              원하는 템플릿을 골라주세요. 나중에 바꿀 수 있어요.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
              {TEMPLATES.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setPickedTemplate(t.id)}
                  style={{
                    padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
                    border: pickedTemplate === t.id ? '2px solid #000' : '2px solid #e8e8e8',
                    background: pickedTemplate === t.id ? '#f8f8f8' : '#fff',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>{t.description}</div>
                  <span style={{ fontSize: 11, padding: '2px 8px', background: '#f0f0f0', borderRadius: 10, color: '#666' }}>{t.category}</span>
                  {pickedTemplate === t.id && <span style={{ float: 'right', fontSize: 15 }}>✓</span>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => { setPickedTemplate(''); handleTemplateConfirm(); }}
                style={{
                  padding: '10px 18px', border: '1px solid #ddd', borderRadius: 8,
                  background: '#fff', cursor: 'pointer', fontSize: 14, color: '#666',
                }}
              >
                나중에 선택
              </button>
              <button
                onClick={handleTemplateConfirm}
                disabled={!pickedTemplate}
                style={{
                  padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                  border: 'none', cursor: pickedTemplate ? 'pointer' : 'not-allowed',
                  background: pickedTemplate ? '#000' : '#ccc', color: '#fff',
                  transition: 'background 0.15s',
                }}
              >
                이력서 업로드하기 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

