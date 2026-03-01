import { GitHubIcon } from './Icons';
import styles from '../styles/Hero.module.css';

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
