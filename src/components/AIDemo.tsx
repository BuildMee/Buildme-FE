import { useEffect, useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from '../styles/AIDemo.module.css';

interface TerminalLine {
  type: 'prompt' | 'output' | 'highlight' | 'success';
  text: string;
  promptSymbol?: string;
}

const terminalLines: TerminalLine[] = [
  { type: 'prompt', promptSymbol: '$', text: 'buildme analyze --repo heoyoungjae/nakgo-algo' },
  { type: 'output', text: '' },
  { type: 'output', text: '[scanning] Repository cloned successfully.' },
  { type: 'output', text: '[scanning] Analyzing 47 files across 12 directories...' },
  { type: 'output', text: '' },
  { type: 'highlight', text: '> Tech Stack Detected:' },
  { type: 'output', text: '  TypeScript, React, Node.js, PostgreSQL, Docker' },
  { type: 'output', text: '' },
  { type: 'highlight', text: '> Project Summary (auto-generated):' },
  {
    type: 'output',
    text: '  "알고리즘 문제 풀이를 공유하고 토론하는 플랫폼.',
  },
  {
    type: 'output',
    text: '   실시간 코드 에디터와 AI 기반 풀이 분석을 지원합니다."',
  },
  { type: 'output', text: '' },
  { type: 'highlight', text: '> Key Contributions:' },
  { type: 'output', text: '  - 실시간 WebSocket 코드 에디터 구현' },
  { type: 'output', text: '  - JWT 기반 인증 시스템 설계' },
  { type: 'output', text: '  - CI/CD 파이프라인 구축 (GitHub Actions)' },
  { type: 'output', text: '' },
  { type: 'success', text: '[done] Analysis complete. Portfolio entry generated.' },
];

export default function AIDemo() {
  const [sectionRef, sectionVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (!sectionVisible) return;

    setVisibleLines(0);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setVisibleLines(current);
      if (current >= terminalLines.length) {
        clearInterval(interval);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [sectionVisible]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <p
        className={`${styles.sectionLabel} animate-on-scroll ${sectionVisible ? 'visible' : ''}`}
      >
        AI Analysis
      </p>
      <h2
        className={`${styles.sectionTitle} animate-on-scroll stagger-1 ${
          sectionVisible ? 'visible' : ''
        }`}
      >
        AI가 이렇게 분석해요
      </h2>

      <div
        className={`${styles.terminal} animate-on-scroll stagger-2 ${
          sectionVisible ? 'visible' : ''
        }`}
      >
        <div className={styles.terminalHeader}>
          <span className={styles.terminalDot} />
          <span className={styles.terminalDot} />
          <span className={styles.terminalDot} />
          <span className={styles.terminalTitle}>buildme-cli v1.0.0</span>
        </div>
        <div className={styles.terminalBody}>
          {terminalLines.map((line, i) => (
            <div
              key={i}
              className={`${styles.line} ${i < visibleLines ? styles.visible : ''}`}
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              {line.promptSymbol && <span className={styles.prompt}>{line.promptSymbol}</span>}
              <span
                className={
                  line.type === 'highlight'
                    ? styles.highlight
                    : line.type === 'success'
                    ? styles.success
                    : line.type === 'prompt'
                    ? styles.command
                    : styles.output
                }
              >
                {line.text}
              </span>
            </div>
          ))}
          {visibleLines >= terminalLines.length && <span className={styles.cursor} />}
        </div>
      </div>
    </section>
  );
}
