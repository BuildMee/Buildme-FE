/* 모든 템플릿 미리보기 컴포넌트 — TemplateSelectPage / ResumePage 공유 */

export function PreviewMinimalDark() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#111', color: '#fff', padding: '48px 44px', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#555' }}>PORTFOLIO · 2025</div>
      <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1 }}>KIM<br />DEVELOPER</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['React', 'TypeScript', 'Node.js'].map(s => (
          <span key={s} style={{ border: '1px solid #333', padding: '4px 12px', fontSize: 11, borderRadius: 2, color: '#aaa' }}>{s}</span>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #222', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['01 — E-commerce Platform', '02 — Real-time Chat App', '03 — CI/CD Dashboard'].map(p => (
          <div key={p} style={{ fontSize: 13, color: '#666' }}>{p}</div>
        ))}
      </div>
    </div>
  );
}

export function PreviewCleanWhite() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', color: '#111', padding: '48px 44px', fontFamily: 'Georgia, serif', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#aaa', fontFamily: 'sans-serif' }}>PORTFOLIO</div>
      <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1 }}>Portfolio</div>
      <div style={{ borderBottom: '2px solid #111', paddingBottom: 16 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: '#999', fontFamily: 'sans-serif' }}>FULL-STACK DEVELOPER</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: '#aaa', fontFamily: 'sans-serif' }}>EXPERIENCE</div>
        {['Frontend Lead — 2022-Present', 'Software Engineer — 2020-2022'].map(e => (
          <div key={e} style={{ fontSize: 13, color: '#555' }}>{e}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: '#aaa', fontFamily: 'sans-serif' }}>PROJECTS</div>
        {['Design System Library', 'API Gateway Service'].map(p => (
          <div key={p} style={{ fontSize: 13, color: '#555' }}>{p}</div>
        ))}
      </div>
    </div>
  );
}

export function PreviewBlueAccent() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#f8faff', display: 'flex' }}>
      <div style={{ width: 6, background: '#2563eb', flexShrink: 0 }} />
      <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: '#2563eb' }}>PORTFOLIO</div>
        <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.1, color: '#111' }}>Lee<br />Seongjin</div>
        <div style={{ fontSize: 12, color: '#2563eb', letterSpacing: 2 }}>FRONTEND ENGINEER</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {[80, 65, 90, 55].map((w, i) => (
            <div key={i} style={{ height: 4, width: `${w}%`, background: '#2563eb', borderRadius: 2, opacity: 0.3 + i * 0.15 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PreviewTerminal() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0d1117', color: '#e6edf3', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#161b22', padding: '10px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />)}
        <span style={{ marginLeft: 8, fontSize: 11, color: '#888' }}>portfolio.sh</span>
      </div>
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ color: '#6e7681', fontSize: 13 }}># portfolio.sh</div>
        <div style={{ fontSize: 13 }}><span style={{ color: '#58a6ff' }}>$ </span>whoami</div>
        <div style={{ fontSize: 13, color: '#adbac7' }}>Park Jiwon — Backend Developer</div>
        <div style={{ fontSize: 13 }}><span style={{ color: '#58a6ff' }}>$ </span>ls projects/</div>
        <div style={{ fontSize: 13, color: '#adbac7' }}>auth-service/&nbsp; api-gateway/&nbsp; k8s-config/</div>
        <div style={{ fontSize: 13 }}><span style={{ color: '#58a6ff' }}>$ </span><span style={{ display: 'inline-block', width: 8, height: 14, background: '#58a6ff', verticalAlign: 'middle' }} /></div>
      </div>
    </div>
  );
}

export function PreviewGrid() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '2fr 1fr 1fr' }}>
      <div style={{ gridColumn: '1 / 3', borderBottom: '1px solid #e5e5e5', borderRight: '1px solid #e5e5e5', padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: '#aaa' }}>NAME</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#111' }}>Choi Minseo</div>
      </div>
      {[['PROJECT', 'Dashboard'], ['STACK', 'Go, Docker'], ['PROJECT', 'CLI Tool'], ['YEAR', '2025']].map(([label, val], i) => (
        <div key={i} style={{ borderBottom: '1px solid #e5e5e5', borderRight: i % 2 === 0 ? '1px solid #e5e5e5' : 'none', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: '#aaa' }}>{label}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>{val}</div>
        </div>
      ))}
    </div>
  );
}

export function PreviewMagazine() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#f5f0e8', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '48px 44px', gap: 12 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#999' }}>ISSUE 01 · 2025</div>
      <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 0.95, color: '#111' }}>JUNG<br />HANA</div>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#888' }}>CREATIVE DEVELOPER</div>
    </div>
  );
}

export function PreviewNeo() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ border: '3px solid #000', boxShadow: '6px 6px 0 #000', padding: '40px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: '#000', marginBottom: 12 }}>PORTFOLIO</div>
        <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, color: '#000' }}>OH<br />MINSU</div>
        <div style={{ marginTop: 16, fontSize: 11, letterSpacing: 3, borderTop: '2px solid #000', paddingTop: 12 }}>FRONTEND</div>
      </div>
    </div>
  );
}

export function PreviewHacker() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#000', color: '#00ff41', fontFamily: 'monospace', padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: '#00ff41', opacity: 0.5, letterSpacing: 2 }}>INIT_PORTFOLIO v2.0</div>
      <div style={{ fontSize: 13, opacity: 0.7 }}>ACCESS: GRANTED</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>&gt; JUNG_MINHO</div>
      <div style={{ fontSize: 13, opacity: 0.7 }}>SKILL[]: React&nbsp; Node&nbsp; AWS&nbsp; Docker</div>
      <div style={{ fontSize: 13, opacity: 0.7 }}>PROJ[]: 12 &nbsp; STARS: 847</div>
      <div style={{ fontSize: 13, opacity: 0.7 }}>STATUS: SEEKING_OPPORTUNITY</div>
      <div style={{ marginTop: 'auto', height: 1, background: '#00ff41', opacity: 0.3 }} />
    </div>
  );
}

export function PreviewEditorial() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 72, fontWeight: 900, color: '#eee', lineHeight: 1 }}>03</div>
      <div>
        <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, color: '#111', marginBottom: 16 }}>LEE<br />SOOJIN</div>
        <div style={{ borderTop: '2px solid #111', paddingTop: 12 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: '#888' }}>UI/UX DEVELOPER</div>
        </div>
      </div>
    </div>
  );
}

export function PreviewNeon() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0a0a0f', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '48px 44px', gap: 14 }}>
      <div style={{ height: 2, width: 60, background: '#a855f7', boxShadow: '0 0 12px #a855f7' }} />
      <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, color: '#fff' }}>PARK<br />JIYEON</div>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#a855f7', textShadow: '0 0 8px #a855f7' }}>FULL-STACK</div>
    </div>
  );
}

export const PREVIEWS: Record<string, React.ComponentType> = {
  'minimal-dark': PreviewMinimalDark,
  'clean-white':  PreviewCleanWhite,
  'blue-accent':  PreviewBlueAccent,
  'terminal':     PreviewTerminal,
  'grid':         PreviewGrid,
  'magazine':     PreviewMagazine,
  'neo':          PreviewNeo,
  'hacker':       PreviewHacker,
  'editorial':    PreviewEditorial,
  'neon':         PreviewNeon,
};
