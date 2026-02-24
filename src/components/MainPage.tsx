import { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/MainPage.module.css';

/* ===== Types ===== */
type Category = 'all' | 'minimal' | 'dark' | 'creative' | 'tech';

interface Template {
  id: string;
  name: string;
  category: 'minimal' | 'dark' | 'creative' | 'tech';
  component: React.ReactNode;
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
  { id: 'minimal-dark', name: 'Minimal Dark', category: 'dark', component: <PreviewMinimalDark /> },
  { id: 'clean-white', name: 'Clean White', category: 'minimal', component: <PreviewCleanWhite /> },
  { id: 'blue-accent', name: 'Blue Accent', category: 'creative', component: <PreviewBlueAccent /> },
  { id: 'terminal', name: 'Terminal', category: 'tech', component: <PreviewTerminal /> },
  { id: 'grid', name: 'Grid', category: 'minimal', component: <PreviewGrid /> },
  { id: 'magazine', name: 'Magazine', category: 'creative', component: <PreviewMagazine /> },
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

/* ===== Main Page Component ===== */
export default function MainPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement | null>(null);

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
          <h1 className={styles.heroHeadline}>포트폴리오를<br />만들어보세요.</h1>
          <p className={styles.heroSub}>
            GitHub 연동 또는 이력서 업로드만으로<br />AI가 5분 안에 포트폴리오 초안을 완성합니다.
          </p>
          <div className={styles.heroCtas}>
            <div className={styles.heroCtaRow}>
              <button className={styles.btnPrimary}>
                <GitHubIcon />
                GitHub으로 시작하기
              </button>
              <span className={styles.ctaDivider}>또는</span>
              <a href="#resume" className={styles.btnOutline}>
                <UploadIcon />
                이력서로 시작하기
              </a>
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
              {tpl.component}
              <div className={styles.cardOverlay}>
                <span className={styles.overlayText}>템플릿 사용하기</span>
              </div>
              <div className={styles.cardFooter}>
                <div>
                  <div className={styles.cardName}>{tpl.name}</div>
                  <div className={styles.cardCategory}>{tpl.category}</div>
                </div>
                <button className={styles.useBtn}>사용하기</button>
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
            />
            <button className={styles.aiSubmit}>생성하기</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ===== Inline SVG icons ===== */
function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
