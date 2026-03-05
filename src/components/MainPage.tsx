import { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { GitHubIcon, UploadIcon } from './Icons';
import { handleGitHubLogin } from '../utils/auth';
import { saveSelectedTemplate } from '../utils/templates';
import LoginModal from './LoginModal';
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
  { id: 'minimal-dark', name: '미니멀 다크', category: 'dark', Preview: PreviewMinimalDark },
  { id: 'clean-white', name: '클린 화이트', category: 'minimal', Preview: PreviewCleanWhite },
  { id: 'blue-accent', name: '블루 엑센트', category: 'creative', Preview: PreviewBlueAccent },
  { id: 'terminal', name: '터미널', category: 'tech', Preview: PreviewTerminal },
  { id: 'grid', name: '그리드', category: 'minimal', Preview: PreviewGrid },
  { id: 'magazine', name: '매거진', category: 'creative', Preview: PreviewMagazine },
];

const CATEGORIES: { label: string; value: Category }[] = [
  { label: '전체', value: 'all' },
  { label: '미니멀', value: 'minimal' },
  { label: '다크', value: 'dark' },
  { label: '크리에이티브', value: 'creative' },
  { label: '테크', value: 'tech' },
];

const CATEGORY_KO: Record<string, string> = {
  minimal: '미니멀',
  dark: '다크',
  creative: '크리에이티브',
  tech: '테크',
};

const STAGGER: Record<number, string> = {
  0: styles.stagger0,
  1: styles.stagger1,
  2: styles.stagger2,
  3: styles.stagger3,
  4: styles.stagger4,
  5: styles.stagger5,
};


/* ===== Main Page Component ===== */
export default function MainPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isLoggedIn = !!sessionStorage.getItem('access_token');

  const handleResumeStart = () => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    window.location.hash = 'template-select';
  };

  const filtered = activeFilter === 'all'
    ? templates
    : templates.filter((t) => t.category === activeFilter);


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
                onClick={isLoggedIn ? () => {
                  sessionStorage.setItem('template_select_return', 'github-portfolio');
                  window.location.hash = 'template-select';
                } : handleGitHubLogin}
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
            <button className={styles.btnGhost} onClick={() => { window.location.hash = 'templates'; }}>템플릿 둘러보기 →</button>
          </div>
        </div>
      </section>

      {/* ===== Template Gallery ===== */}
      <section className={styles.gallery}>
        <h2 className={styles.sectionTitle}>템플릿</h2>

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
              <div className={styles.cardOverlay} onClick={() => { if (!isLoggedIn) { setShowLoginModal(true); return; } saveSelectedTemplate(tpl.id); window.location.hash = 'resume'; }} style={{ cursor: 'pointer' }}>
                <span className={styles.overlayText}>템플릿 사용하기</span>
              </div>
              <div className={styles.cardFooter}>
                <div>
                  <div className={styles.cardName}>{tpl.name}</div>
                  <div className={styles.cardCategory}>{CATEGORY_KO[tpl.category] ?? tpl.category}</div>
                </div>
                <button className={styles.useBtn} onClick={() => { if (!isLoggedIn) { setShowLoginModal(true); return; } saveSelectedTemplate(tpl.id); window.location.hash = 'resume'; }}>사용하기</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className={styles.aiSection}>
        <div className={styles.aiInner}>
          <h2 className={styles.aiHeadline}>지금 바로 시작하세요.</h2>
          <p className={styles.aiDesc}>
            10개 이상의 프리미엄 템플릿과 AI 커스텀 디자인으로 나만의 포트폴리오를 완성하세요.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
            <a
              href="#templates"
              style={{
                padding: '16px 36px',
                background: '#fff', color: '#0A0A0A',
                fontFamily: 'var(--font-mono)',
                fontSize: 12, fontWeight: 700,
                letterSpacing: 2, textTransform: 'uppercase' as const,
                border: 'none', cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              템플릿 둘러보기 →
            </a>
            <a
              href="#ai-template"
              style={{
                padding: '16px 36px',
                background: 'transparent', color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: 12, fontWeight: 700,
                letterSpacing: 2, textTransform: 'uppercase' as const,
                border: '1px solid rgba(255,255,255,0.25)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              AI로 만들기
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* ── Login required modal ── */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}

