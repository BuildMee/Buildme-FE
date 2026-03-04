import { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/TemplatesPage.module.css';
import { saveSelectedTemplate } from '../utils/templates';
import LoginModal from './LoginModal';

type Category = 'all' | 'minimal' | 'dark' | 'creative' | 'tech';
type SortKey = 'popular' | 'newest';

interface CommunityTemplate {
  id: string;
  name: string;
  category: 'minimal' | 'dark' | 'creative' | 'tech';
  author: string;
  likes: number;
  isNew?: boolean;
  isPro?: boolean;
  component: React.ReactNode;
}

/* ── Preview Components ── */

function PreviewNeo() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewNeo}`}>
      <div className={styles.neoBox}>
        <div className={styles.neoName}>OH<br />MINSU</div>
        <div className={styles.neoRole}>FRONTEND</div>
      </div>
    </div>
  );
}

function PreviewHacker() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewHacker}`}>
      <div className={styles.hackerTitle}>INIT<span className={styles.hackerCursor}>_</span>PORTFOLIO</div>
      <div className={styles.hackerDim}>ACCESS: GRANTED</div>
      <div className={styles.hackerName}>&gt; JUNG_MINHO</div>
      <div className={styles.hackerDim}>SKILL[]: React Node AWS</div>
      <div className={styles.hackerDim}>PROJ[]: 12 &nbsp; STARS: 847</div>
    </div>
  );
}

function PreviewBlueprint() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewBlueprint}`}>
      <div className={styles.bpGrid}>
        <div className={styles.bpHline} />
        <div className={styles.bpVline} />
        <div className={styles.bpBox}>
          <div className={styles.bpLabel}>DEVELOPER</div>
          <div className={styles.bpVal}>KIM JAEHO</div>
        </div>
        <div className={styles.bpBox}>
          <div className={styles.bpLabel}>STACK</div>
          <div className={styles.bpVal}>Go / K8s</div>
        </div>
      </div>
    </div>
  );
}

function PreviewEditorial() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewEditorial}`}>
      <div className={styles.editNumber}>03</div>
      <div className={styles.editName}>LEE<br />SOOJIN</div>
      <div className={styles.editDivider} />
      <div className={styles.editRole}>UI/UX DEVELOPER</div>
    </div>
  );
}

function PreviewNeon() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewNeon}`}>
      <div className={styles.neonLine} />
      <div className={styles.neonTitle}>PARK<br />JIYEON</div>
      <div className={styles.neonRole}>FULL-STACK</div>
    </div>
  );
}

function PreviewRetro() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewRetro}`}>
      <div className={styles.retroBar}>
        <span className={styles.retroDot} />
        <span className={styles.retroDot} />
        <span className={styles.retroDot} />
      </div>
      <div className={styles.retroLine}><span className={styles.retroPrompt}>C:\&gt; </span>CHOI_DEVELOPER</div>
      <div className={styles.retroLine}><span className={styles.retroDim}>SKILLS: </span>Java Spring AWS</div>
      <div className={styles.retroLine}><span className={styles.retroDim}>PROJ: </span>MSA / AUTH / GW</div>
      <div className={styles.retroLine}><span className={styles.retroCursor}>█</span></div>
    </div>
  );
}

function PreviewMono() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewMono}`}>
      <div className={styles.monoNum}>01</div>
      <div className={styles.monoName}>HAN JUNHYUK</div>
      <div className={styles.monoSub}>BACKEND ENGINEER</div>
    </div>
  );
}

function PreviewSplit() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewSplit}`}>
      <div className={styles.splitLeft}>
        <div className={styles.splitName}>YOON<br />SERI</div>
      </div>
      <div className={styles.splitRight}>
        <div className={styles.splitItem}>React</div>
        <div className={styles.splitItem}>TS</div>
        <div className={styles.splitItem}>Node</div>
        <div className={styles.splitItem}>Next</div>
      </div>
    </div>
  );
}

function PreviewCinematic() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewCinematic}`}>
      <div className={styles.cinBar} />
      <div className={styles.cinCenter}>
        <div className={styles.cinName}>RYU DONGHYUN</div>
        <div className={styles.cinRole}>CREATIVE DEVELOPER</div>
      </div>
      <div className={styles.cinBar} />
    </div>
  );
}

function PreviewGlass() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewProGlass}`}>
      <div className={styles.proGlassGlow} />
      <div className={styles.proGlassCard}>
        <div className={styles.proGlassName}>KIM<br />DOHYUN</div>
        <div className={styles.proGlassSub}>AI ENGINEER</div>
      </div>
    </div>
  );
}

function PreviewMagazine() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewProMag}`} style={{ padding: '28px 28px 24px', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div className={styles.proMagNum}>04</div>
      <div className={styles.proMagAccent} />
      <div className={styles.proMagName}>SHIN<br />YUJIN</div>
      <div className={styles.proMagRole}>PRODUCT DESIGNER</div>
    </div>
  );
}

function PreviewTypo() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewProTypo}`}>
      <div className={styles.proTypoLeft}>
        <div className={styles.proTypoBig}>DEV<br />OPS</div>
      </div>
      <div className={styles.proTypoRight}>
        <div className={styles.proTypoName}>BAEK<br />SEONGMIN</div>
        <div className={styles.proTypoRole}>CLOUD · K8S</div>
      </div>
    </div>
  );
}

function PreviewNeonGrid() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewProNeonGrid}`}>
      <div className={styles.neonGridLines} />
      <div className={styles.neonGridContent}>
        <div className={styles.neonGridTag}>// portfolio</div>
        <div className={styles.neonGridName}>CHOI<br />JUNHO</div>
        <div className={styles.neonGridRole}>FULLSTACK DEVELOPER</div>
      </div>
    </div>
  );
}

function PreviewPaper() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewProPaper}`}>
      <div className={styles.paperTop}>
        <div className={styles.paperIndex}>NO. 07</div>
        <div className={styles.paperStamp}>PORTFOLIO</div>
      </div>
      <div className={styles.paperName}>OH<br />SEUNGAH</div>
      <div className={styles.paperRule} />
      <div className={styles.paperRole}>UX RESEARCHER</div>
    </div>
  );
}

function PreviewAurora() {
  return (
    <div className={`${styles.cardPreview} ${styles.previewProAurora}`}>
      <div className={styles.auroraBlob1} />
      <div className={styles.auroraBlob2} />
      <div className={styles.auroraContent}>
        <div className={styles.auroraName}>JANG<br />EUNJI</div>
        <div className={styles.auroraLine} />
        <div className={styles.auroraRole}>FRONTEND DEV</div>
      </div>
    </div>
  );
}

/* ── Data ── */

const communityTemplates: CommunityTemplate[] = [
  { id: 'neo', name: '네오 브루탈', category: 'minimal', author: 'oh_minsu', likes: 1240, component: <PreviewNeo /> },
  { id: 'hacker', name: '해커 모드', category: 'tech', author: 'jung_minho', likes: 893, component: <PreviewHacker /> },
  { id: 'blueprint', name: '블루프린트', category: 'tech', author: 'kimjaeho', likes: 671, component: <PreviewBlueprint /> },
  { id: 'editorial', name: '에디토리얼', category: 'creative', author: 'leesoojin', likes: 458, isNew: true, component: <PreviewEditorial /> },
  { id: 'neon', name: '네온 다크', category: 'dark', author: 'park_jy', likes: 344, isNew: true, component: <PreviewNeon /> },
  { id: 'retro', name: '레트로 터미널', category: 'tech', author: 'choi_dev', likes: 289, component: <PreviewRetro /> },
  { id: 'mono', name: '모노크롬', category: 'minimal', author: 'han_jun', likes: 201, isPro: true, component: <PreviewMono /> },
  { id: 'split', name: '스플릿 레이아웃', category: 'creative', author: 'yoon_seri', likes: 178, isNew: true, isPro: true, component: <PreviewSplit /> },
  { id: 'cinematic', name: '시네마틱', category: 'dark', author: 'ryu_dh', likes: 143, isPro: true, component: <PreviewCinematic /> },
  { id: 'glass', name: '글래스모피즘', category: 'dark', author: 'kim_dh', likes: 118, isNew: true, isPro: true, component: <PreviewGlass /> },
  { id: 'magazine', name: '매거진', category: 'creative', author: 'shin_yj', likes: 97, isNew: true, isPro: true, component: <PreviewMagazine /> },
  { id: 'typo', name: '노이르 타이포', category: 'minimal', author: 'baek_sm', likes: 84, isPro: true, component: <PreviewTypo /> },
  { id: 'aurora', name: '오로라', category: 'dark', author: 'jang_ej', likes: 61, isNew: true, isPro: true, component: <PreviewAurora /> },
  { id: 'neongrid', name: '네온 그리드', category: 'tech', author: 'choi_jh', likes: 49, isNew: true, isPro: true, component: <PreviewNeonGrid /> },
  { id: 'paper', name: '페이퍼', category: 'minimal', author: 'oh_sa', likes: 37, isNew: true, isPro: true, component: <PreviewPaper /> },
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
  0: styles.stagger0, 1: styles.stagger1, 2: styles.stagger2,
  3: styles.stagger3, 4: styles.stagger4, 5: styles.stagger5,
  6: styles.stagger6, 7: styles.stagger7, 8: styles.stagger8,
  9: styles.stagger0, 10: styles.stagger1, 11: styles.stagger2, 12: styles.stagger3,
  13: styles.stagger4, 14: styles.stagger5,
};

/* ── Page ── */

const LIKES_KEY = 'buildme_liked_templates';

function loadLiked(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveLiked(liked: Set<string>) {
  try {
    localStorage.setItem(LIKES_KEY, JSON.stringify([...liked]));
  } catch {
    // private 모드 또는 quota 초과 시 UI는 계속 동작
  }
}

export default function TemplatesPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [sort, setSort] = useState<SortKey>('popular');
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [liked, setLiked] = useState<Set<string>>(() => loadLiked());
  const [poppedId, setPoppedId] = useState<string | null>(null);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(() => {
    const initial = loadLiked();
    return Object.fromEntries(communityTemplates.map((t) => [t.id, t.likes + (initial.has(t.id) ? 1 : 0)]));
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const isLoggedIn = !!sessionStorage.getItem('access_token');

  const handleUseTemplate = (id: string) => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    saveSelectedTemplate(id);
    window.location.hash = 'resume';
  };

  const handleLike = (id: string) => {
    const isLoggedIn = !!sessionStorage.getItem('access_token');
    if (!isLoggedIn) {
      alert('좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    const wasLiked = liked.has(id);
    const next = new Set(liked);
    if (wasLiked) {
      next.delete(id);
    } else {
      next.add(id);
    }
    saveLiked(next);
    setLiked(next);
    setLikeCounts((c) => ({ ...c, [id]: c[id] + (wasLiked ? -1 : 1) }));
    setPoppedId(id);
    setTimeout(() => setPoppedId(null), 250);
  };

  const filtered = (
    activeFilter === 'all' ? communityTemplates : communityTemplates.filter((t) => t.category === activeFilter)
  ).slice().sort((a, b) =>
    sort === 'popular' ? b.likes - a.likes : (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0),
  );

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.id;
            if (id) setVisibleCards((prev) => new Set(prev).add(id));
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

      {/* ── Header ── */}
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>템플릿</h1>
            <p className={styles.headerSub}>
              사용자가 만든 템플릿을 탐색하고 나만의 포트폴리오를 시작하세요.
            </p>
          </div>
          <div className={styles.headerRight}>
            <a href="#submit" className={styles.submitBtn}>
              <PlusIcon />
              템플릿 제출
            </a>
          </div>
        </div>
      </section>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        <div className={styles.filterTabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`${styles.filterTab} ${activeFilter === cat.value ? styles.filterTabActive : ''}`}
              onClick={() => { setActiveFilter(cat.value); setVisibleCards(new Set()); }}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className={styles.sortRow}>
          <button
            className={`${styles.sortBtn} ${sort === 'popular' ? styles.sortBtnActive : ''}`}
            onClick={() => setSort('popular')}
          >
            인기순
          </button>
          <button
            className={`${styles.sortBtn} ${sort === 'newest' ? styles.sortBtnActive : ''}`}
            onClick={() => setSort('newest')}
          >
            최신순
          </button>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className={styles.grid} ref={gridRef}>
        {filtered.map((tpl, idx) => (
          <div
            key={tpl.id}
            data-id={tpl.id}
            className={`${styles.card} ${visibleCards.has(tpl.id) ? styles.cardVisible : ''} ${STAGGER[idx] ?? ''}`}
          >
            <div className={styles.previewWrapper}>
              {tpl.isNew && !tpl.isPro && <div className={styles.newBadge}>신규</div>}
              {tpl.isPro && <div className={styles.proLockBadge}><MiniLockIcon /></div>}
              {tpl.component}
              <div
                className={styles.cardOverlay}
                onClick={() => {
                  if (tpl.isPro) { window.location.hash = 'pricing'; }
                  else { saveSelectedTemplate(tpl.id); window.location.hash = 'resume'; }
                }}
                style={{ cursor: 'pointer' }}
              >
                <span className={styles.overlayText}>{tpl.isPro ? 'Pro로 잠금 해제' : '템플릿 사용하기'}</span>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <div className={styles.cardMeta}>
                <div className={styles.cardName}>{tpl.name}</div>
                <div className={styles.cardAuthor}>@{tpl.author}</div>
                <div className={styles.cardCategory}>{CATEGORY_KO[tpl.category] ?? tpl.category}</div>
              </div>
              <div className={styles.cardActions}>
                <button
                  className={`${styles.likeBtn} ${liked.has(tpl.id) ? styles.likeBtnActive : ''} ${poppedId === tpl.id ? styles.likePop : ''}`}
                  onClick={() => handleLike(tpl.id)}
                >
                  <HeartIcon filled={liked.has(tpl.id)} />
                  {likeCounts[tpl.id] >= 1000 ? `${(likeCounts[tpl.id] / 1000).toFixed(1)}k` : likeCounts[tpl.id]}
                </button>
                <button
                  className={`${styles.useBtn} ${tpl.isPro ? styles.useBtnPro : ''}`}
                  onClick={() => {
                    if (tpl.isPro) { window.location.hash = 'pricing'; }
                    else { handleUseTemplate(tpl.id); }
                  }}
                >
                  {tpl.isPro ? 'Pro 전용' : '사용하기'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* ── Contribute CTA ── */}
      <section className={styles.contributeSect}>
        <div className={styles.contributeInner}>
          <div>
            <p className={styles.contributeLabel}>기여하기</p>
            <h2 className={styles.contributeTitle}>당신의 템플릿을 공유하세요.</h2>
            <p className={styles.contributeDesc}>
              직접 만든 포트폴리오 디자인을 커뮤니티와 함께 나누세요.<br />
              다른 개발자들이 당신의 작업을 발전시킵니다.
            </p>
          </div>
          <a href="#submit" className={styles.contributeCta}>템플릿 제출하기 →</a>
        </div>
      </section>

      <Footer />

      {/* ── Login required modal ── */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}

/* ── Icons ── */

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <line x1="6.5" y1="1" x2="6.5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="6.5" x2="12" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MiniLockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2.2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}


function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
