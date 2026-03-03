import { ComponentType, useEffect, useState } from 'react';
import Logo from './Logo';
import { getPortfolioData, getSelectedTemplate, getAiDesign, clearAiDesign } from '../utils/templates';
import type { PortfolioData, AiDesign } from '../utils/templates';
import { sharePortfolio } from '../utils/portfolioApi';

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

/* ── AI 커스텀 템플릿 ── */
function AiCustom({ data, design }: { data: PortfolioData; design: AiDesign }) {
  const ff = design.fontStyle === 'monospace' ? 'monospace'
    : design.fontStyle === 'serif' ? 'Georgia, serif'
    : '-apple-system, BlinkMacSystemFont, sans-serif';
  const radius = design.layout === 'minimal' ? 0 : design.layout === 'grid' ? 4 : 12;

  if (design.layout === 'terminal') {
    return (
      <div style={{ background: design.backgroundColor, color: design.textColor, minHeight: '100vh', fontFamily: 'monospace' }}>
        <div style={{ background: `${design.primaryColor}22`, padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center', borderBottom: `1px solid ${design.primaryColor}44` }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, display: 'inline-block' }} />)}
          <span style={{ marginLeft: 12, fontSize: 12, color: design.accentColor }}>portfolio.sh — {data.name}</span>
        </div>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px' }}>
          <p style={{ color: design.accentColor, fontSize: 13, marginBottom: 8 }}># {data.name}'s Portfolio</p>
          <p style={{ fontSize: 13, marginBottom: 6 }}><span style={{ color: design.primaryColor }}>$ </span>whoami</p>
          <p style={{ fontSize: 13, paddingLeft: 16, marginBottom: 6, opacity: 0.8 }}>{data.name} — {data.role}</p>
          <p style={{ fontSize: 13, marginBottom: 6 }}><span style={{ color: design.primaryColor }}>$ </span>cat about.txt</p>
          <p style={{ fontSize: 13, paddingLeft: 16, lineHeight: 1.8, marginBottom: 6, opacity: 0.7 }}>{data.intro}</p>
          <p style={{ fontSize: 13, marginBottom: 6 }}><span style={{ color: design.primaryColor }}>$ </span>cat skills.txt</p>
          <p style={{ color: design.accentColor, fontSize: 13, paddingLeft: 16, marginBottom: 6 }}>{data.skills.join('  ')}</p>
          <p style={{ fontSize: 13, marginBottom: 16 }}><span style={{ color: design.primaryColor }}>$ </span>ls projects/</p>
          {data.projects.map((p, i) => (
            <div key={p.name} style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, marginBottom: 8 }}><span style={{ color: design.primaryColor }}>$ </span>cat projects/0{i+1}-{p.name}.md</p>
              <div style={{ background: `${design.primaryColor}11`, border: `1px solid ${design.primaryColor}33`, borderRadius: 6, padding: '20px 24px' }}>
                <p style={{ color: design.accentColor, fontSize: 14, fontWeight: 700, marginBottom: 8 }}># {p.name}</p>
                <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 10, opacity: 0.8 }}>{p.description}</p>
                <p style={{ fontSize: 12, opacity: 0.5 }}>Tech: {p.tech.join(', ')}</p>
                <p style={{ color: design.primaryColor, fontSize: 12, marginTop: 4 }}>→ {p.highlights}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (design.layout === 'magazine') {
    return (
      <div style={{ background: design.backgroundColor, color: design.textColor, minHeight: '100vh', fontFamily: ff }}>
        <section style={{ minHeight: '55vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '80px 60px', borderBottom: `3px solid ${design.primaryColor}` }}>
          <p style={{ fontSize: 11, letterSpacing: 5, color: design.accentColor, marginBottom: 14 }}>ISSUE 01 · {new Date().getFullYear()} · PORTFOLIO</p>
          <h1 style={{ fontSize: 88, fontWeight: 900, lineHeight: 0.9, color: design.primaryColor, marginBottom: 20 }}>{data.name.toUpperCase()}</h1>
          <p style={{ fontSize: 13, letterSpacing: 4, opacity: 0.6 }}>{data.role.toUpperCase()}</p>
        </section>
        <section style={{ maxWidth: 820, margin: '0 auto', padding: '60px 40px' }}>
          <p style={{ fontSize: 18, lineHeight: 2, fontStyle: 'italic', borderLeft: `3px solid ${design.accentColor}`, paddingLeft: 24, marginBottom: 48, opacity: 0.8 }}>{data.intro}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 60 }}>
            {data.skills.map(s => <span key={s} style={{ background: design.primaryColor, color: design.backgroundColor, padding: '6px 16px', fontSize: 12, letterSpacing: 1, borderRadius: radius }}>{s}</span>)}
          </div>
          {data.projects.map((p, i) => (
            <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, marginBottom: 48, paddingBottom: 48, borderBottom: `1px solid ${design.primaryColor}33` }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: design.accentColor, lineHeight: 1, opacity: 0.4 }}>0{i+1}</div>
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: design.primaryColor }}>{p.name}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 12, opacity: 0.75 }}>{p.description}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {p.tech.map(t => <span key={t} style={{ fontSize: 11, border: `1px solid ${design.accentColor}`, padding: '2px 8px', color: design.accentColor, borderRadius: radius }}>{t}</span>)}
                </div>
                <p style={{ fontSize: 13, fontStyle: 'italic', opacity: 0.5 }}>{p.highlights}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }

  if (design.layout === 'grid') {
    return (
      <div style={{ background: design.backgroundColor, color: design.textColor, minHeight: '100vh', fontFamily: ff }}>
        <section style={{ maxWidth: 960, margin: '0 auto', padding: '80px 40px 60px' }}>
          <p style={{ fontSize: 10, letterSpacing: 4, color: design.accentColor, marginBottom: 16 }}>PORTFOLIO</p>
          <h1 style={{ fontSize: 58, fontWeight: 900, lineHeight: 1, marginBottom: 10, color: design.primaryColor }}>{data.name}</h1>
          <p style={{ fontSize: 12, letterSpacing: 3, opacity: 0.5, marginBottom: 24 }}>{data.role.toUpperCase()}</p>
          <p style={{ fontSize: 15, lineHeight: 1.9, opacity: 0.75, maxWidth: 600 }}>{data.intro}</p>
        </section>
        <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px 60px' }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: design.accentColor, marginBottom: 16 }}>SKILLS</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {data.skills.map(s => <span key={s} style={{ border: `1px solid ${design.accentColor}`, padding: '5px 14px', fontSize: 12, color: design.accentColor, borderRadius: radius }}>{s}</span>)}
          </div>
        </section>
        <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px 80px' }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: design.accentColor, marginBottom: 24 }}>PROJECTS</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {data.projects.map((p, i) => (
              <div key={p.name} style={{ border: `1px solid ${design.primaryColor}33`, borderTop: `3px solid ${design.accentColor}`, padding: '24px 22px', borderRadius: radius, background: `${design.primaryColor}08` }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: design.accentColor, opacity: 0.3, marginBottom: 8 }}>0{i+1}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: design.primaryColor }}>{p.name}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 12, opacity: 0.7 }}>{p.description}</p>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                  {p.tech.map(t => <span key={t} style={{ fontSize: 11, background: `${design.accentColor}22`, color: design.accentColor, padding: '2px 8px', borderRadius: 4 }}>{t}</span>)}
                </div>
                <p style={{ fontSize: 12, opacity: 0.5, fontStyle: 'italic' }}>{p.highlights}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // minimal (default)
  return (
    <div style={{ background: design.backgroundColor, color: design.textColor, minHeight: '100vh', fontFamily: ff }}>
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '100px 40px 80px' }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: design.accentColor, marginBottom: 20 }}>PORTFOLIO · {new Date().getFullYear()}</div>
        <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 1, marginBottom: 20, color: design.primaryColor }}>{data.name}</h1>
        <p style={{ fontSize: 13, letterSpacing: 3, opacity: 0.5, marginBottom: 32 }}>{data.role.toUpperCase()}</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, opacity: 0.75, maxWidth: 560 }}>{data.intro}</p>
      </section>
      <div style={{ borderTop: `1px solid ${design.primaryColor}22` }} />
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: design.accentColor, marginBottom: 20 }}>SKILLS</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {data.skills.map(s => <span key={s} style={{ border: `1px solid ${design.accentColor}`, padding: '6px 16px', fontSize: 12, color: design.accentColor, borderRadius: radius }}>{s}</span>)}
        </div>
      </section>
      <div style={{ borderTop: `1px solid ${design.primaryColor}22` }} />
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: design.accentColor, marginBottom: 32 }}>PROJECTS</div>
        {data.projects.map((p, i) => (
          <div key={p.name} style={{ marginBottom: 48, paddingBottom: 48, borderBottom: `1px solid ${design.primaryColor}15` }}>
            <div style={{ fontSize: 11, color: design.accentColor, opacity: 0.5, marginBottom: 8 }}>0{i+1}</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: design.primaryColor }}>{p.name}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.7, marginBottom: 16 }}>{p.description}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {p.tech.map(t => <span key={t} style={{ fontSize: 11, border: `1px solid ${design.primaryColor}44`, padding: '3px 10px', opacity: 0.7, borderRadius: radius }}>{t}</span>)}
            </div>
            <p style={{ fontSize: 12, color: design.accentColor, fontStyle: 'italic' }}>{p.highlights}</p>
          </div>
        ))}
      </section>
      <div style={{ borderTop: `1px solid ${design.primaryColor}22`, padding: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, opacity: 0.3 }}>{data.summary}</p>
      </div>
    </div>
  );
}

/* ── 템플릿 맵 ── */
export const TEMPLATE_MAP: Record<string, ComponentType<{ data: PortfolioData }>> = {
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
  const data = getPortfolioData();
  const aiDesign = getAiDesign();
  const TemplateComponent = TEMPLATE_MAP[templateId] ?? MinimalDark;

  const [shareState, setShareState] = useState<'idle' | 'loading' | 'copied' | 'clipboard-error' | 'api-error'>('idle');
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // ai_design을 한 번 소비한 뒤 정리 — 이후 재방문 시 stale 디자인이 남지 않도록
  useEffect(() => {
    if (aiDesign) clearAiDesign();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShare = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      alert('공유 기능은 로그인 후 이용할 수 있습니다.');
      return;
    }
    if (!data) return;

    setShareState('loading');
    setShareUrl(null); // 재시도 시 이전 URL 초기화
    const result = await sharePortfolio({
      title: `${data.name}의 포트폴리오`,
      templateId: getSelectedTemplate() ?? 'minimal-dark',
      data,
    });

    if (result.success && result.token) {
      const url = `${window.location.origin}${window.location.pathname}#portfolio-public/${result.token}`;
      setShareUrl(url);
      try {
        await navigator.clipboard.writeText(url);
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 2500);
      } catch {
        // 클립보드 실패 시 URL을 화면에 노출해 수동 복사 가능하게
        setShareState('clipboard-error');
      }
    } else {
      // API 실패 — shareUrl은 null 유지
      setShareState('api-error');
    }
  };

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ fontSize: 16, color: '#888' }}>포트폴리오 데이터가 없습니다.</p>
        <button
          onClick={() => { window.location.hash = ''; }}
          style={{ padding: '10px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 인쇄 시 툴바 숨김 */}
      <style>{`@media print { #portfolio-toolbar { display: none !important; } }`}</style>

      {/* 상단 툴바 */}
      <div id="portfolio-toolbar" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#fff', borderBottom: '1px solid #e8e8e8',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 52, gap: 12,
      }}>
        {/* 왼쪽: 로고 */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <Logo size={28} />
          <span style={{ fontWeight: 700, fontSize: 15, color: '#111', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>buildme</span>
        </a>

        {/* 오른쪽: 배지 + 버튼들 */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {aiDesign && (
            <span style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 20,
              background: `${aiDesign.primaryColor}22`, color: aiDesign.primaryColor,
              border: `1px solid ${aiDesign.primaryColor}44`, letterSpacing: 1, flexShrink: 0,
            }}>
              AI 디자인 적용됨
            </span>
          )}
          <button
            onClick={() => history.back()}
            style={{ padding: '7px 16px', border: '1px solid #ddd', borderRadius: 6, background: '#fff', fontSize: 13, cursor: 'pointer', color: '#666', flexShrink: 0 }}
          >
            ← 돌아가기
          </button>
          <button
            onClick={() => window.print()}
            style={{ padding: '7px 16px', border: '1px solid #ddd', borderRadius: 6, background: '#fff', fontSize: 13, cursor: 'pointer', color: '#333', flexShrink: 0, fontWeight: 500 }}
          >
            PDF 저장
          </button>
          <button
            onClick={handleShare}
            disabled={shareState === 'loading'}
            style={{
              padding: '7px 20px', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600,
              cursor: shareState === 'loading' ? 'wait' : 'pointer', flexShrink: 0,
              background: shareState === 'copied' ? '#16a34a' : shareState === 'clipboard-error' ? '#b45309' : shareState === 'api-error' ? '#dc2626' : '#000',
              color: '#fff', transition: 'background 0.2s',
            }}
          >
            {shareState === 'loading' ? '생성 중...' : shareState === 'copied' ? '✓ 링크 복사됨!' : shareState === 'clipboard-error' ? '링크 생성됨' : shareState === 'api-error' ? '오류 발생' : '공유하기'}
          </button>
        </div>

        {/* 클립보드 실패 시 수동 복사용 URL 표시 */}
        {shareState === 'clipboard-error' && shareUrl && (
          <div style={{
            position: 'absolute', top: 52, right: 24,
            background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8,
            padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', gap: 8, zIndex: 200,
          }}>
            <input
              readOnly
              value={shareUrl}
              onFocus={(e) => e.target.select()}
              style={{ border: 'none', outline: 'none', fontSize: 12, color: '#444', width: 280, background: 'transparent' }}
            />
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl).then(() => { setShareState('copied'); setShareUrl(null); setTimeout(() => setShareState('idle'), 2500); })}
              style={{ padding: '4px 10px', background: '#000', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer', flexShrink: 0 }}
            >
              복사
            </button>
          </div>
        )}
      </div>

      {/* 포트폴리오 본문: AI 디자인이 있으면 AiCustom, 없으면 선택된 템플릿 */}
      <div style={{ flex: 1 }}>
        {aiDesign
          ? <AiCustom data={data} design={aiDesign} />
          : <TemplateComponent data={data} />
        }
      </div>
    </div>
  );
}
