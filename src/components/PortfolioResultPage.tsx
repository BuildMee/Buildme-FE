import Navbar from './Navbar';
import { getPortfolioData, getSelectedTemplate, PortfolioData } from '../utils/templates';

const DUMMY: PortfolioData = {
  name: '홍길동',
  role: '프론트엔드 개발자',
  intro: '사용자 경험을 중시하는 프론트엔드 개발자입니다. React와 TypeScript를 주력으로 다양한 웹 서비스를 개발해왔습니다.',
  skills: ['React', 'TypeScript', 'Node.js', 'Docker', 'AWS'],
  projects: [
    { name: 'E-commerce Platform', description: '대용량 트래픽을 처리하는 쇼핑몰 플랫폼. MSA 구조로 설계하여 안정적인 서비스를 구현했습니다.', tech: ['React', 'Node.js', 'PostgreSQL'], highlights: '월 100만 PV 처리, 결제 전환율 23% 향상' },
    { name: 'Real-time Chat App', description: 'WebSocket 기반의 실시간 채팅 서비스. 1:1 및 그룹 채팅을 지원합니다.', tech: ['React', 'Socket.io', 'Redis'], highlights: '동시 접속 5,000명 처리, 메시지 지연 50ms 이하' },
  ],
  summary: '3년간의 프론트엔드 경험을 바탕으로 사용자 중심의 서비스를 개발하는 개발자',
};

/* ── 템플릿별 레이아웃 ── */

function MinimalDark({ data }: { data: PortfolioData }) {
  return (
    <div style={{ background: '#111', color: '#fff', minHeight: '100vh', fontFamily: 'monospace' }}>
      {/* Hero */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '100px 40px 80px' }}>
        <div style={{ fontSize: 12, letterSpacing: 4, color: '#555', marginBottom: 20 }}>PORTFOLIO · {new Date().getFullYear()}</div>
        <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 1, marginBottom: 24, textTransform: 'uppercase' }}>{data.name}</h1>
        <p style={{ fontSize: 14, color: '#888', letterSpacing: 2, marginBottom: 32 }}>{data.role.toUpperCase()}</p>
        <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.8, maxWidth: 560 }}>{data.intro}</p>
      </section>

      <div style={{ borderTop: '1px solid #222' }} />

      {/* Skills */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: '#555', marginBottom: 20 }}>SKILLS</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {data.skills.map(s => (
            <span key={s} style={{ border: '1px solid #333', padding: '6px 16px', fontSize: 12, color: '#aaa' }}>{s}</span>
          ))}
        </div>
      </section>

      <div style={{ borderTop: '1px solid #222' }} />

      {/* Projects */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: '#555', marginBottom: 32 }}>PROJECTS</div>
        {data.projects.map((p, i) => (
          <div key={p.name} style={{ marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid #1a1a1a' }}>
            <div style={{ fontSize: 12, color: '#444', marginBottom: 8 }}>0{i + 1}</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>{p.name}</h3>
            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.8, marginBottom: 16 }}>{p.description}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {p.tech.map(t => <span key={t} style={{ fontSize: 11, color: '#555', border: '1px solid #2a2a2a', padding: '3px 10px' }}>{t}</span>)}
            </div>
            <p style={{ fontSize: 12, color: '#666', fontStyle: 'italic' }}>{p.highlights}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #222', padding: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#333' }}>{data.summary}</p>
      </div>
    </div>
  );
}

function CleanWhite({ data }: { data: PortfolioData }) {
  return (
    <div style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '100px 40px 60px' }}>
        <p style={{ fontSize: 11, letterSpacing: 4, color: '#aaa', marginBottom: 16, fontFamily: 'sans-serif' }}>PORTFOLIO</p>
        <h1 style={{ fontSize: 56, fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>{data.name}</h1>
        <div style={{ borderBottom: '2px solid #111', paddingBottom: 20, marginBottom: 32 }}>
          <p style={{ fontSize: 12, letterSpacing: 3, color: '#999', fontFamily: 'sans-serif' }}>{data.role.toUpperCase()}</p>
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.9, color: '#444' }}>{data.intro}</p>
      </section>

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px 60px' }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: '#aaa', marginBottom: 20, fontFamily: 'sans-serif' }}>SKILLS</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {data.skills.map(s => (
            <span key={s} style={{ border: '1px solid #ddd', padding: '5px 14px', fontSize: 12, color: '#666', fontFamily: 'sans-serif' }}>{s}</span>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px 80px' }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: '#aaa', marginBottom: 32, fontFamily: 'sans-serif' }}>PROJECTS</p>
        {data.projects.map((p) => (
          <div key={p.name} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid #f0f0f0' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{p.name}</h3>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 12 }}>{p.description}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10, fontFamily: 'sans-serif' }}>
              {p.tech.map(t => <span key={t} style={{ fontSize: 11, color: '#999', background: '#f8f8f8', padding: '3px 10px' }}>{t}</span>)}
            </div>
            <p style={{ fontSize: 13, color: '#aaa', fontStyle: 'italic' }}>{p.highlights}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function BlueAccent({ data }: { data: PortfolioData }) {
  return (
    <div style={{ background: '#f8faff', color: '#111', minHeight: '100vh', display: 'flex' }}>
      {/* 사이드바 */}
      <div style={{ width: 280, background: '#fff', borderRight: '1px solid #e8f0fe', padding: '60px 32px', display: 'flex', flexDirection: 'column', gap: 40, flexShrink: 0 }}>
        <div style={{ borderLeft: '4px solid #2563eb', paddingLeft: 16 }}>
          <p style={{ fontSize: 11, letterSpacing: 2, color: '#2563eb', marginBottom: 6 }}>PORTFOLIO</p>
          <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>{data.name}</h1>
          <p style={{ fontSize: 12, color: '#2563eb', marginTop: 4 }}>{data.role}</p>
        </div>
        <div>
          <p style={{ fontSize: 10, letterSpacing: 2, color: '#aaa', marginBottom: 12 }}>SKILLS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data.skills.map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, background: '#2563eb', borderRadius: '50%' }} />
                <span style={{ fontSize: 13, color: '#444' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 */}
      <div style={{ flex: 1, padding: '60px 48px' }}>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#555', marginBottom: 48, maxWidth: 600 }}>{data.intro}</p>
        <p style={{ fontSize: 11, letterSpacing: 3, color: '#2563eb', marginBottom: 28 }}>PROJECTS</p>
        {data.projects.map((p) => (
          <div key={p.name} style={{ background: '#fff', border: '1px solid #e8f0fe', borderLeft: '4px solid #2563eb', padding: '24px 28px', marginBottom: 20, borderRadius: '0 8px 8px 0' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{p.name}</h3>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 12 }}>{p.description}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {p.tech.map(t => <span key={t} style={{ fontSize: 11, color: '#2563eb', background: '#eff6ff', padding: '3px 10px', borderRadius: 4 }}>{t}</span>)}
            </div>
            <p style={{ fontSize: 12, color: '#888' }}>{p.highlights}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Terminal({ data }: { data: PortfolioData }) {
  return (
    <div style={{ background: '#0d1117', color: '#e6edf3', minHeight: '100vh', fontFamily: 'monospace' }}>
      {/* 윈도우 바 */}
      <div style={{ background: '#161b22', padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center', borderBottom: '1px solid #21262d' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, display: 'inline-block' }} />)}
        <span style={{ marginLeft: 12, fontSize: 12, color: '#888' }}>portfolio.sh — {data.name}</span>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ color: '#6e7681', fontSize: 13 }}># Welcome to {data.name}'s portfolio</p>
          <p style={{ fontSize: 13 }}><span style={{ color: '#58a6ff' }}>$ </span>whoami</p>
          <p style={{ color: '#adbac7', fontSize: 13, paddingLeft: 16 }}>{data.name} — {data.role}</p>
          <p style={{ fontSize: 13 }}><span style={{ color: '#58a6ff' }}>$ </span>cat about.txt</p>
          <p style={{ color: '#adbac7', fontSize: 13, paddingLeft: 16, lineHeight: 1.8 }}>{data.intro}</p>
          <p style={{ fontSize: 13 }}><span style={{ color: '#58a6ff' }}>$ </span>cat skills.txt</p>
          <p style={{ color: '#3fb950', fontSize: 13, paddingLeft: 16 }}>{data.skills.join('  ')}</p>
          <p style={{ fontSize: 13 }}><span style={{ color: '#58a6ff' }}>$ </span>ls projects/</p>
          {data.projects.map((p, i) => (
            <div key={p.name} style={{ paddingLeft: 16 }}>
              <p style={{ color: '#adbac7', fontSize: 13 }}>{String(i + 1).padStart(2, '0')}/ {p.name}/</p>
            </div>
          ))}
        </div>

        {data.projects.map((p, i) => (
          <div key={p.name} style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 13 }}><span style={{ color: '#58a6ff' }}>$ </span>cat projects/{String(i + 1).padStart(2, '0')}/{p.name}/README.md</p>
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 6, padding: '20px 24px', marginTop: 8 }}>
              <p style={{ color: '#f0883e', fontSize: 14, fontWeight: 700, marginBottom: 8 }}># {p.name}</p>
              <p style={{ color: '#adbac7', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{p.description}</p>
              <p style={{ color: '#6e7681', fontSize: 12 }}>Tech: {p.tech.join(', ')}</p>
              <p style={{ color: '#3fb950', fontSize: 12, marginTop: 4 }}>→ {p.highlights}</p>
            </div>
          </div>
        ))}

        <p style={{ fontSize: 13 }}><span style={{ color: '#58a6ff' }}>$ </span><span style={{ display: 'inline-block', width: 8, height: 14, background: '#58a6ff', verticalAlign: 'middle' }} /></p>
      </div>
    </div>
  );
}

function Magazine({ data }: { data: PortfolioData }) {
  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh' }}>
      {/* 커버 */}
      <section style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '80px 60px', borderBottom: '3px solid #111' }}>
        <p style={{ fontSize: 11, letterSpacing: 5, color: '#999', marginBottom: 16 }}>ISSUE 01 · {new Date().getFullYear()} · PORTFOLIO</p>
        <h1 style={{ fontSize: 96, fontWeight: 900, lineHeight: 0.9, color: '#111', marginBottom: 20 }}>{data.name.toUpperCase()}</h1>
        <p style={{ fontSize: 14, letterSpacing: 4, color: '#888' }}>{data.role.toUpperCase()}</p>
      </section>

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 40px' }}>
        <p style={{ fontSize: 18, lineHeight: 2, color: '#333', fontStyle: 'italic', borderLeft: '3px solid #111', paddingLeft: 24, marginBottom: 48 }}>{data.intro}</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 60 }}>
          {data.skills.map(s => <span key={s} style={{ background: '#111', color: '#f5f0e8', padding: '6px 16px', fontSize: 12, letterSpacing: 1 }}>{s}</span>)}
        </div>

        {data.projects.map((p, i) => (
          <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid #ddd8d0' }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#ddd8d0', lineHeight: 1 }}>0{i + 1}</div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{p.name}</h3>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8, marginBottom: 12 }}>{p.description}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {p.tech.map(t => <span key={t} style={{ fontSize: 11, color: '#888', border: '1px solid #ccc', padding: '2px 8px' }}>{t}</span>)}
              </div>
              <p style={{ fontSize: 13, color: '#888', fontStyle: 'italic' }}>{p.highlights}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function NeonDark({ data }: { data: PortfolioData }) {
  return (
    <div style={{ background: '#0a0a0f', color: '#fff', minHeight: '100vh' }}>
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '100px 40px 60px' }}>
        <div style={{ height: 2, width: 80, background: '#a855f7', boxShadow: '0 0 16px #a855f7', marginBottom: 32 }} />
        <h1 style={{ fontSize: 68, fontWeight: 900, lineHeight: 1, marginBottom: 16 }}>{data.name}</h1>
        <p style={{ fontSize: 13, letterSpacing: 4, color: '#a855f7', textShadow: '0 0 8px #a855f7', marginBottom: 32 }}>{data.role.toUpperCase()}</p>
        <p style={{ fontSize: 15, color: '#888', lineHeight: 1.9, maxWidth: 560 }}>{data.intro}</p>
      </section>

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 40px 60px' }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: '#a855f7', marginBottom: 20 }}>SKILLS</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {data.skills.map(s => (
            <span key={s} style={{ border: '1px solid #a855f7', padding: '6px 16px', fontSize: 12, color: '#a855f7', boxShadow: '0 0 8px #a855f744' }}>{s}</span>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 40px 80px' }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: '#a855f7', marginBottom: 32 }}>PROJECTS</p>
        {data.projects.map((p) => (
          <div key={p.name} style={{ marginBottom: 32, border: '1px solid #1a1a2e', padding: '28px 32px', borderRadius: 8, background: '#0f0f1a', borderTop: '2px solid #a855f7' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: '#fff' }}>{p.name}</h3>
            <p style={{ fontSize: 14, color: '#777', lineHeight: 1.8, marginBottom: 14 }}>{p.description}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {p.tech.map(t => <span key={t} style={{ fontSize: 11, color: '#a855f7', background: '#1a0a2e', padding: '3px 10px', borderRadius: 4 }}>{t}</span>)}
            </div>
            <p style={{ fontSize: 12, color: '#555', fontStyle: 'italic' }}>{p.highlights}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ── 템플릿 맵 ── */
const TEMPLATE_MAP: Record<string, React.ComponentType<{ data: PortfolioData }>> = {
  'minimal-dark': MinimalDark,
  'clean-white':  CleanWhite,
  'blue-accent':  BlueAccent,
  'terminal':     Terminal,
  'grid':         CleanWhite,
  'magazine':     Magazine,
  'neo':          MinimalDark,
  'hacker':       Terminal,
  'editorial':    CleanWhite,
  'neon':         NeonDark,
};

export default function PortfolioResultPage() {
  const templateId = getSelectedTemplate() ?? 'minimal-dark';
  const data = getPortfolioData() ?? DUMMY;
  const TemplateComponent = TEMPLATE_MAP[templateId] ?? MinimalDark;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 상단 툴바 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#fff', borderBottom: '1px solid #e8e8e8',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 52,
      }}>
        <Navbar />
        <div style={{ display: 'flex', gap: 8, position: 'absolute', right: 24 }}>
          <button
            onClick={() => history.back()}
            style={{ padding: '7px 16px', border: '1px solid #ddd', borderRadius: 6, background: '#fff', fontSize: 13, cursor: 'pointer', color: '#666' }}
          >
            ← 돌아가기
          </button>
          <button
            disabled
            style={{ padding: '7px 20px', border: 'none', borderRadius: 6, background: '#ccc', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'not-allowed' }}
            aria-disabled="true"
          >
            공유하기 (준비 중)
          </button>
        </div>
      </div>

      {/* 포트폴리오 본문 */}
      <div style={{ flex: 1 }}>
        <TemplateComponent data={data} />
      </div>
    </div>
  );
}
