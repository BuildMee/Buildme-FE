import styles from '../styles/Hero.module.css';

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Grid lines */}
      <div className={styles.gridLines}>
        <div className={styles.gridLine} />
        <div className={styles.gridLine} />
        <div className={styles.gridLine} />
        <div className={styles.gridLine} />
      </div>

      {/* Watermark B */}
      <div className={styles.watermark}>
        <svg
          width="600"
          height="600"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="50"
            y="80"
            textAnchor="middle"
            fontFamily="'Syne', sans-serif"
            fontWeight="800"
            fontSize="100"
            fill="#0A0A0A"
          >
            B
          </text>
        </svg>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.label}>Developer Portfolio Generator</p>
        <h1 className={styles.headline}>
          BUILD
          <br />
          YOUR<span className={styles.accent}>SELF.</span>
        </h1>
        <p className={styles.subtext}>
          GitHub 연동으로 5분 만에 완성하는 개발자 포트폴리오.
          <br />
          AI가 당신의 코드를 분석하고, 당신만의 포트폴리오를 만듭니다.
        </p>
        <div className={styles.ctaGroup}>
          <button className={styles.primaryBtn}>
            <GitHubIcon />
            GitHub로 시작하기
          </button>
          <button className={styles.secondaryBtn}>데모 보기</button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <span className={styles.scrollLine} />
        Scroll to explore
      </div>
    </section>
  );
}
