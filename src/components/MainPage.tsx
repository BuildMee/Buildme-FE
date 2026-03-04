import { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { GitHubIcon, UploadIcon } from './Icons';
import { handleGitHubLogin } from '../utils/auth';
import { saveSelectedTemplate, saveAiDesign, TEMPLATES } from '../utils/templates';
import Logo from './Logo';
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
  const [aiFallback, setAiFallback] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [pickedTemplate, setPickedTemplate] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isLoggedIn = !!sessionStorage.getItem('access_token');

  const handleResumeStart = () => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    window.location.hash = 'template-select';
  };

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
      const data = await res.json() as { success: boolean; design?: AiDesign; message?: string; fallback?: boolean };
      if (data.success && data.design) {
        setAiResult(data.design);
        setAiFallback(data.fallback === true);
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

      {/* ===== AI Custom Section ===== */}
      <section className={styles.aiSection}>
        <div className={styles.aiInner}>
          <span className={styles.aiLabel}>AI 커스텀 디자인</span>
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
        </div>
      </section>

      <Footer />

      {/* ── AI 디자인 전체화면 미리보기 ── */}
      {aiResult && (() => {
        const ff = aiResult.fontStyle === 'monospace' ? 'monospace'
          : aiResult.fontStyle === 'serif' ? 'Georgia, serif'
          : '-apple-system, BlinkMacSystemFont, sans-serif';
        const r = aiResult.layout === 'minimal' ? 0 : aiResult.layout === 'grid' ? 4 : 12;
        const SAMPLE_PROJECTS = [
          { name: 'E-Commerce Platform', tech: ['React', 'TypeScript', 'AWS'], desc: '대규모 트래픽을 처리하는 이커머스 플랫폼. 장바구니, 결제, 재고 관리 시스템 구현.' },
          { name: 'Real-time Chat App', tech: ['Node.js', 'Socket.io', 'Redis'], desc: '실시간 메시지 전송과 채널 기반 커뮤니케이션을 지원하는 채팅 서비스.' },
          { name: 'CI/CD Dashboard', tech: ['Docker', 'GitHub Actions', 'Next.js'], desc: '배포 파이프라인을 시각화하고 모니터링하는 DevOps 대시보드.' },
        ];

        const escapeHtml = (v: string) =>
          String(v)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        const downloadPortfolioCode = () => {
          const raw = sessionStorage.getItem('portfolio_data');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let d: any;
          try {
            d = raw ? JSON.parse(raw) : null;
          } catch {
            d = null;
          }
          if (!d || typeof d !== 'object') {
            d = {
              name: '홍길동', role: '프론트엔드 개발자', intro: aiResult.mood,
              skills: ['React', 'TypeScript', 'Node.js', 'Docker', 'AWS'],
              projects: SAMPLE_PROJECTS.map(p => ({ name: p.name, description: p.desc, tech: p.tech, highlights: '핵심 성과 및 기여' })),
              summary: aiResult.mood,
            };
          }
          const skills: string[] = Array.isArray(d.skills) ? d.skills : [];
          const projects: {name:string;description:string;tech:string[];highlights:string}[] = Array.isArray(d.projects) ? d.projects : [];
          const skillTags = skills.map((s: string) => `<span class="skill">${escapeHtml(s)}</span>`).join('');
          const projectItems = projects.map((p, i: number) =>
            `<div class="project">
               <div class="pnum">0${i+1}</div>
               <h3 class="pname">${escapeHtml(p.name ?? '')}</h3>
               <p class="pdesc">${escapeHtml(p.description ?? '')}</p>
               <div class="ptechs">${(Array.isArray(p.tech) ? p.tech : []).map((t:string) => `<span class="ptag">${escapeHtml(t)}</span>`).join('')}</div>
               <p class="phigh">${escapeHtml(p.highlights ?? '')}</p>
             </div>`
          ).join('');

          const htmlMap: Record<string, string> = {
            terminal: `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${d.name} - Portfolio</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:${aiResult.backgroundColor};color:${aiResult.textColor};font-family:'Courier New',monospace;min-height:100vh}
.winbar{background:${aiResult.primaryColor}22;padding:10px 24px;display:flex;align-items:center;gap:8px;border-bottom:1px solid ${aiResult.primaryColor}33}
.dot{width:12px;height:12px;border-radius:50%;display:inline-block}
.title{margin-left:12px;font-size:12px;color:${aiResult.accentColor}}
.body{max-width:860px;margin:0 auto;padding:48px 40px}
.comment{color:${aiResult.accentColor};font-size:13px;margin-bottom:8px}
.cmd{font-size:14px;margin-bottom:6px}
.prompt{color:${aiResult.primaryColor}}
.out{font-size:13px;padding-left:16px;margin-bottom:6px;opacity:.8;line-height:1.8}
.skills-out{color:${aiResult.accentColor};font-size:13px;padding-left:16px;margin-bottom:16px}
.project{margin-bottom:24px}
.pfile{font-size:13px;margin-bottom:8px}
.pbox{background:${aiResult.primaryColor}18;border:1px solid ${aiResult.primaryColor}33;border-radius:6px;padding:16px 20px}
.pbox h3{color:${aiResult.accentColor};margin-bottom:8px}
.pbox p{font-size:13px;opacity:.75;margin-bottom:8px;line-height:1.7}
.pbox .tech{font-size:12px;opacity:.5}
</style></head><body>
<div class="winbar">
  <span class="dot" style="background:#ff5f57"></span>
  <span class="dot" style="background:#febc2e"></span>
  <span class="dot" style="background:#28c840"></span>
  <span class="title">portfolio.sh — ${escapeHtml(d.name ?? '')}</span>
</div>
<div class="body">
  <div class="comment"># ${escapeHtml(d.name ?? '')}의 포트폴리오</div>
  <p class="cmd"><span class="prompt">$ </span>whoami</p>
  <p class="out">${escapeHtml(d.name ?? '')} — ${escapeHtml(d.role ?? '')}</p>
  <p class="cmd"><span class="prompt">$ </span>cat about.txt</p>
  <p class="out">${escapeHtml(d.intro ?? '')}</p>
  <p class="cmd"><span class="prompt">$ </span>cat skills.txt</p>
  <p class="skills-out">${skills.map(escapeHtml).join('  ')}</p>
  <p class="cmd"><span class="prompt">$ </span>ls projects/</p>
  ${projects.map((p, i: number) => `
  <div class="project">
    <p class="pfile"><span class="prompt">$ </span>cat projects/0${i+1}-${escapeHtml(p.name ?? '')}.md</p>
    <div class="pbox">
      <h3># ${escapeHtml(p.name ?? '')}</h3>
      <p>${escapeHtml(p.description ?? '')}</p>
      <p class="tech">Tech: ${(Array.isArray(p.tech) ? p.tech : []).map(escapeHtml).join(', ')}</p>
    </div>
  </div>`).join('')}
</div></body></html>`,

            magazine: `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${d.name} - Portfolio</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:${aiResult.backgroundColor};color:${aiResult.textColor};font-family:${ff};min-height:100vh}
.cover{min-height:55vh;display:flex;flex-direction:column;justify-content:flex-end;padding:80px 80px 60px;border-bottom:3px solid ${aiResult.primaryColor}}
.issue{font-size:11px;letter-spacing:5px;color:${aiResult.accentColor};margin-bottom:14px}
h1{font-size:88px;font-weight:900;line-height:.9;color:${aiResult.primaryColor};margin-bottom:20px}
.role{font-size:13px;letter-spacing:4px;opacity:.5}
.main{max-width:820px;margin:0 auto;padding:60px 40px}
.quote{font-size:18px;line-height:2;font-style:italic;border-left:3px solid ${aiResult.accentColor};padding-left:24px;margin-bottom:48px;opacity:.8}
.skills{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:60px}
.skill{background:${aiResult.primaryColor};color:${aiResult.backgroundColor};padding:6px 16px;font-size:12px;border-radius:${r}px}
.project{display:grid;grid-template-columns:80px 1fr;gap:24px;margin-bottom:48px;padding-bottom:48px;border-bottom:1px solid ${aiResult.primaryColor}22}
.pnum{font-size:48px;font-weight:900;color:${aiResult.accentColor};opacity:.3;line-height:1}
.pname{font-size:22px;font-weight:800;margin-bottom:10px;color:${aiResult.primaryColor}}
.pdesc{font-size:14px;line-height:1.8;opacity:.7;margin-bottom:12px}
.ptechs{display:flex;gap:6px;flex-wrap:wrap}
.ptag{font-size:11px;border:1px solid ${aiResult.accentColor};padding:2px 8px;color:${aiResult.accentColor};border-radius:${r}px}
.phigh{font-size:13px;font-style:italic;opacity:.5;margin-top:8px}
</style></head><body>
<section class="cover">
  <p class="issue">ISSUE 01 · ${new Date().getFullYear()} · PORTFOLIO</p>
  <h1>${escapeHtml((d.name ?? '').toUpperCase())}</h1>
  <p class="role">${escapeHtml((d.role ?? '').toUpperCase())}</p>
</section>
<div class="main">
  <p class="quote">${escapeHtml(d.intro ?? '')}</p>
  <div class="skills">${skillTags}</div>
  ${projectItems}
</div></body></html>`,

            grid: `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${d.name} - Portfolio</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:${aiResult.backgroundColor};color:${aiResult.textColor};font-family:${ff};min-height:100vh;padding:80px}
.label{font-size:10px;letter-spacing:4px;color:${aiResult.accentColor};margin-bottom:16px}
h1{font-size:64px;font-weight:900;line-height:1;color:${aiResult.primaryColor};margin-bottom:10px}
.role{font-size:12px;letter-spacing:3px;opacity:.4;margin-bottom:40px}
.intro{font-size:15px;line-height:1.9;opacity:.7;max-width:600px;margin-bottom:60px}
.slabel{font-size:10px;letter-spacing:3px;color:${aiResult.accentColor};margin-bottom:20px}
.skills{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:60px}
.skill{border:1px solid ${aiResult.accentColor};padding:5px 14px;font-size:12px;color:${aiResult.accentColor};border-radius:${r}px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.project{border:1px solid ${aiResult.primaryColor}22;border-top:3px solid ${aiResult.accentColor};padding:24px 22px;border-radius:${r}px;background:${aiResult.primaryColor}08}
.pnum{font-size:28px;font-weight:900;color:${aiResult.accentColor};opacity:.25;margin-bottom:8px}
.pname{font-size:17px;font-weight:700;color:${aiResult.primaryColor};margin-bottom:10px}
.pdesc{font-size:13px;line-height:1.7;opacity:.65;margin-bottom:12px}
.ptechs{display:flex;gap:5px;flex-wrap:wrap}
.ptag{font-size:11px;background:${aiResult.accentColor}22;color:${aiResult.accentColor};padding:2px 8px;border-radius:4px}
.phigh{display:none}
</style></head><body>
<div class="label">PORTFOLIO</div>
<h1>${escapeHtml(d.name ?? '')}</h1>
<p class="role">${escapeHtml((d.role ?? '').toUpperCase())}</p>
<p class="intro">${escapeHtml(d.intro ?? '')}</p>
<div class="slabel">SKILLS</div>
<div class="skills">${skillTags}</div>
<div class="slabel">PROJECTS</div>
<div class="grid">${projectItems}</div>
</body></html>`,
          };

          const minimalHtml = `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${d.name} - Portfolio</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:${aiResult.backgroundColor};color:${aiResult.textColor};font-family:${ff};min-height:100vh}
.hero{max-width:960px;margin:0 auto;padding:100px 80px 80px}
.label{font-size:10px;letter-spacing:4px;color:${aiResult.accentColor};margin-bottom:20px}
h1{font-size:88px;font-weight:900;line-height:1;color:${aiResult.primaryColor};margin-bottom:20px}
.role{font-size:13px;letter-spacing:3px;opacity:.4;margin-bottom:36px}
.intro{font-size:16px;line-height:1.9;opacity:.7;max-width:560px}
.divider{border-top:1px solid ${aiResult.primaryColor}22}
.section{max-width:960px;margin:0 auto;padding:60px 80px}
.slabel{font-size:10px;letter-spacing:3px;color:${aiResult.accentColor};margin-bottom:20px}
.skills{display:flex;gap:10px;flex-wrap:wrap}
.skill{border:1px solid ${aiResult.accentColor};padding:6px 16px;font-size:12px;color:${aiResult.accentColor};border-radius:${r}px}
.project{margin-bottom:48px;padding-bottom:48px;border-bottom:1px solid ${aiResult.primaryColor}15}
.pnum{font-size:11px;color:${aiResult.accentColor};opacity:.5;margin-bottom:8px}
.pname{font-size:26px;font-weight:700;color:${aiResult.primaryColor};margin-bottom:14px}
.pdesc{font-size:15px;line-height:1.8;opacity:.65;margin-bottom:18px}
.ptechs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
.ptag{font-size:11px;border:1px solid ${aiResult.primaryColor}44;padding:3px 12px;opacity:.7;border-radius:${r}px}
.phigh{font-size:12px;color:${aiResult.accentColor};font-style:italic;opacity:.7}
.footer{border-top:1px solid ${aiResult.primaryColor}22;padding:40px 80px;text-align:center;font-size:12px;opacity:.3;max-width:960px;margin:0 auto}
</style></head><body>
<section class="hero">
  <div class="label">PORTFOLIO · ${new Date().getFullYear()}</div>
  <h1>${escapeHtml(d.name ?? '')}</h1>
  <p class="role">${escapeHtml((d.role ?? '').toUpperCase())}</p>
  <p class="intro">${escapeHtml(d.intro ?? '')}</p>
</section>
<div class="divider"></div>
<section class="section">
  <div class="slabel">SKILLS</div>
  <div class="skills">${skillTags}</div>
</section>
<div class="divider"></div>
<section class="section">
  <div class="slabel">PROJECTS</div>
  ${projectItems}
</section>
<div class="footer">${escapeHtml(d.summary ?? '')}</div>
</body></html>`;

          const html = htmlMap[aiResult.layout] ?? minimalHtml;
          const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${d.name.replace(/\s+/g, '-')}-portfolio.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        };

        const renderPreview = () => {
          if (aiResult.layout === 'terminal') return (
            <div style={{ background: aiResult.backgroundColor, color: aiResult.textColor, minHeight: '100%', fontFamily: 'monospace', padding: '48px 60px' }}>
              <div style={{ marginBottom: 8, color: aiResult.accentColor, fontSize: 13 }}># 홍길동의 포트폴리오</div>
              <p style={{ fontSize: 14, marginBottom: 6 }}><span style={{ color: aiResult.primaryColor }}>$ </span>whoami</p>
              <p style={{ fontSize: 13, paddingLeft: 16, marginBottom: 6, opacity: 0.8 }}>홍길동 — 프론트엔드 개발자</p>
              <p style={{ fontSize: 14, marginBottom: 6 }}><span style={{ color: aiResult.primaryColor }}>$ </span>cat about.txt</p>
              <p style={{ fontSize: 13, paddingLeft: 16, lineHeight: 1.8, marginBottom: 6, opacity: 0.7 }}>{aiResult.mood}</p>
              <p style={{ fontSize: 14, marginBottom: 6 }}><span style={{ color: aiResult.primaryColor }}>$ </span>cat skills.txt</p>
              <p style={{ color: aiResult.accentColor, fontSize: 13, paddingLeft: 16, marginBottom: 16 }}>React  TypeScript  Node.js  Docker  AWS</p>
              <p style={{ fontSize: 14, marginBottom: 16 }}><span style={{ color: aiResult.primaryColor }}>$ </span>ls projects/</p>
              {SAMPLE_PROJECTS.map((p, i) => (
                <div key={p.name} style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 13, marginBottom: 8 }}><span style={{ color: aiResult.primaryColor }}>$ </span>cat projects/0{i+1}-{p.name}.md</p>
                  <div style={{ background: `${aiResult.primaryColor}18`, border: `1px solid ${aiResult.primaryColor}33`, borderRadius: 6, padding: '16px 20px' }}>
                    <p style={{ color: aiResult.accentColor, fontWeight: 700, marginBottom: 8 }}># {p.name}</p>
                    <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 8 }}>{p.desc}</p>
                    <p style={{ fontSize: 12, opacity: 0.5 }}>Tech: {p.tech.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          );

          if (aiResult.layout === 'magazine') return (
            <div style={{ background: aiResult.backgroundColor, color: aiResult.textColor, minHeight: '100%', fontFamily: ff }}>
              <section style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '80px 80px 60px', borderBottom: `3px solid ${aiResult.primaryColor}` }}>
                <p style={{ fontSize: 11, letterSpacing: 5, color: aiResult.accentColor, marginBottom: 14 }}>ISSUE 01 · {new Date().getFullYear()} · PORTFOLIO</p>
                <h1 style={{ fontSize: 100, fontWeight: 900, lineHeight: 0.88, color: aiResult.primaryColor, marginBottom: 20 }}>HONG<br />GILDONG</h1>
                <p style={{ fontSize: 13, letterSpacing: 4, opacity: 0.5 }}>FRONTEND DEVELOPER</p>
              </section>
              <section style={{ maxWidth: 860, margin: '0 auto', padding: '60px 40px' }}>
                <p style={{ fontSize: 18, lineHeight: 2, fontStyle: 'italic', borderLeft: `3px solid ${aiResult.accentColor}`, paddingLeft: 24, marginBottom: 48, opacity: 0.8 }}>{aiResult.mood}</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 60 }}>
                  {['React', 'TypeScript', 'Node.js', 'Docker'].map(s => <span key={s} style={{ background: aiResult.primaryColor, color: aiResult.backgroundColor, padding: '6px 16px', fontSize: 12, borderRadius: r }}>{s}</span>)}
                </div>
                {SAMPLE_PROJECTS.map((p, i) => (
                  <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, marginBottom: 40, paddingBottom: 40, borderBottom: `1px solid ${aiResult.primaryColor}22` }}>
                    <div style={{ fontSize: 48, fontWeight: 900, color: aiResult.accentColor, opacity: 0.3, lineHeight: 1 }}>0{i+1}</div>
                    <div>
                      <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: aiResult.primaryColor }}>{p.name}</h3>
                      <p style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.7, marginBottom: 12 }}>{p.desc}</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {p.tech.map(t => <span key={t} style={{ fontSize: 11, border: `1px solid ${aiResult.accentColor}`, padding: '2px 8px', color: aiResult.accentColor, borderRadius: r }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          );

          if (aiResult.layout === 'grid') return (
            <div style={{ background: aiResult.backgroundColor, color: aiResult.textColor, minHeight: '100%', fontFamily: ff, padding: '80px 80px 60px' }}>
              <p style={{ fontSize: 10, letterSpacing: 4, color: aiResult.accentColor, marginBottom: 16 }}>PORTFOLIO</p>
              <h1 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, marginBottom: 10, color: aiResult.primaryColor }}>홍길동</h1>
              <p style={{ fontSize: 12, letterSpacing: 3, opacity: 0.4, marginBottom: 40 }}>FRONTEND DEVELOPER</p>
              <p style={{ fontSize: 15, lineHeight: 1.9, opacity: 0.7, maxWidth: 600, marginBottom: 60 }}>{aiResult.mood}</p>
              <p style={{ fontSize: 10, letterSpacing: 3, color: aiResult.accentColor, marginBottom: 20 }}>SKILLS</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 60 }}>
                {['React', 'TypeScript', 'Node.js', 'Docker', 'AWS'].map(s => <span key={s} style={{ border: `1px solid ${aiResult.accentColor}`, padding: '5px 14px', fontSize: 12, color: aiResult.accentColor, borderRadius: r }}>{s}</span>)}
              </div>
              <p style={{ fontSize: 10, letterSpacing: 3, color: aiResult.accentColor, marginBottom: 20 }}>PROJECTS</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {SAMPLE_PROJECTS.map((p, i) => (
                  <div key={p.name} style={{ border: `1px solid ${aiResult.primaryColor}22`, borderTop: `3px solid ${aiResult.accentColor}`, padding: '24px 22px', borderRadius: r, background: `${aiResult.primaryColor}08` }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: aiResult.accentColor, opacity: 0.25, marginBottom: 8 }}>0{i+1}</div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: aiResult.primaryColor }}>{p.name}</h3>
                    <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.65, marginBottom: 12 }}>{p.desc}</p>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {p.tech.map(t => <span key={t} style={{ fontSize: 11, background: `${aiResult.accentColor}22`, color: aiResult.accentColor, padding: '2px 8px', borderRadius: 4 }}>{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

          // minimal (default)
          return (
            <div style={{ background: aiResult.backgroundColor, color: aiResult.textColor, minHeight: '100%', fontFamily: ff }}>
              <section style={{ maxWidth: 960, margin: '0 auto', padding: '100px 80px 80px' }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: aiResult.accentColor, marginBottom: 20 }}>PORTFOLIO · {new Date().getFullYear()}</div>
                <h1 style={{ fontSize: 88, fontWeight: 900, lineHeight: 1, marginBottom: 20, color: aiResult.primaryColor }}>홍길동</h1>
                <p style={{ fontSize: 13, letterSpacing: 3, opacity: 0.4, marginBottom: 36 }}>FRONTEND DEVELOPER</p>
                <p style={{ fontSize: 16, lineHeight: 1.9, opacity: 0.7, maxWidth: 560 }}>{aiResult.mood}</p>
              </section>
              <div style={{ borderTop: `1px solid ${aiResult.primaryColor}22` }} />
              <section style={{ maxWidth: 960, margin: '0 auto', padding: '60px 80px' }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: aiResult.accentColor, marginBottom: 20 }}>SKILLS</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {['React', 'TypeScript', 'Node.js', 'Docker', 'AWS'].map(s => <span key={s} style={{ border: `1px solid ${aiResult.accentColor}`, padding: '6px 16px', fontSize: 12, color: aiResult.accentColor, borderRadius: r }}>{s}</span>)}
                </div>
              </section>
              <div style={{ borderTop: `1px solid ${aiResult.primaryColor}22` }} />
              <section style={{ maxWidth: 960, margin: '0 auto', padding: '60px 80px 100px' }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: aiResult.accentColor, marginBottom: 32 }}>PROJECTS</div>
                {SAMPLE_PROJECTS.map((p, i) => (
                  <div key={p.name} style={{ marginBottom: 48, paddingBottom: 48, borderBottom: `1px solid ${aiResult.primaryColor}15` }}>
                    <div style={{ fontSize: 11, color: aiResult.accentColor, opacity: 0.5, marginBottom: 8 }}>0{i+1}</div>
                    <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 14, color: aiResult.primaryColor }}>{p.name}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.8, opacity: 0.65, marginBottom: 18 }}>{p.desc}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {p.tech.map(t => <span key={t} style={{ fontSize: 11, border: `1px solid ${aiResult.primaryColor}44`, padding: '3px 12px', opacity: 0.7, borderRadius: r }}>{t}</span>)}
                    </div>
                  </div>
                ))}
              </section>
            </div>
          );
        };

        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* 폴백 안내 배너 */}
            {aiFallback && (
              <div style={{
                background: '#fffbeb', borderBottom: '1px solid #fde68a',
                padding: '10px 24px', fontSize: 13, color: '#92400e',
                display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
              }}>
                <span>⚠️</span>
                <span>AI API 일일 한도 초과 — 키워드 기반 추천 디자인이 적용됐습니다. 내일 다시 시도하거나 API 키를 교체하면 실제 AI 디자인을 받을 수 있어요.</span>
              </div>
            )}
            {/* 포트폴리오 미리보기 전체 */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              {renderPreview()}
            </div>

            {/* 하단 고정 CTA 바 */}
            <div style={{
              flexShrink: 0,
              background: '#fff', borderTop: '1px solid #e8e8e8',
              padding: '16px 32px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16,
            }}>
              {/* 왼쪽: 로고 + 텍스트 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Logo size={32} />
                  <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.5, color: '#111' }}>buildme</span>
                </div>
                <div style={{ width: 1, height: 32, background: '#e8e8e8' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 2 }}>{aiResult.mood}</div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#aaa' }}>{aiResult.layout} · {aiResult.fontStyle} · {aiResult.theme}</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[aiResult.backgroundColor, aiResult.primaryColor, aiResult.accentColor].map((c, i) => (
                        <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: '1.5px solid #e0e0e0' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 버튼 */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => setAiResult(null)}
                  style={{
                    padding: '11px 22px', border: '1px solid #ddd', borderRadius: 4,
                    background: '#fff', color: '#555', fontSize: 13, cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  다시 생성
                </button>
                <button
                  onClick={downloadPortfolioCode}
                  style={{
                    padding: '11px 22px', border: '1px solid #ddd', borderRadius: 4,
                    background: '#fff', color: '#333', fontSize: 13, cursor: 'pointer',
                    fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  코드 다운로드
                </button>
                <button
                  onClick={() => { saveAiDesign(aiResult); window.location.hash = 'resume'; }}
                  style={{
                    padding: '11px 26px', borderRadius: 4, fontSize: 14, fontWeight: 700,
                    border: 'none', cursor: 'pointer',
                    background: '#111', color: '#fff',
                  }}
                >
                  이 디자인으로 포트폴리오 만들기 →
                </button>
              </div>
            </div>
          </div>
        );
      })()}

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

      {/* ── Login required modal ── */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}

