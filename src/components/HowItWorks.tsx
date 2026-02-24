import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from '../styles/HowItWorks.module.css';

interface Step {
  number: string;
  keyword: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: '01',
    keyword: 'CONNECT',
    title: 'GitHub 계정 연동',
    description:
      'GitHub OAuth로 로그인하면 레포지토리를 자동으로 불러옵니다. 포트폴리오에 넣을 프로젝트를 선택하세요.',
  },
  {
    number: '02',
    keyword: 'ANALYZE',
    title: 'AI 프로젝트 분석',
    description:
      'AI가 코드베이스, README, 커밋 히스토리를 분석해 프로젝트 설명, 기술 스택, 기여도를 자동 생성합니다.',
  },
  {
    number: '03',
    keyword: 'BUILD',
    title: '포트폴리오 생성',
    description:
      '원하는 디자인 레퍼런스를 넣으면 AI가 그 스타일로 포트폴리오를 완성합니다. PDF 또는 웹사이트로 출력.',
  },
];

export default function HowItWorks() {
  const [sectionRef, sectionVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={sectionRef} className={styles.section}>
      <p
        className={`${styles.sectionLabel} animate-on-scroll ${sectionVisible ? 'visible' : ''}`}
      >
        How It Works
      </p>

      <div className={styles.steps}>
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={`${styles.step} animate-on-scroll stagger-${i + 2} ${
              sectionVisible ? 'visible' : ''
            }`}
          >
            <span className={styles.stepNumber}>{step.number}</span>
            <span className={styles.stepKeyword}>{step.keyword}</span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDesc}>{step.description}</p>
          </div>
        ))}
      </div>

      <div
        className={`${styles.connector} animate-on-scroll stagger-5 ${
          sectionVisible ? 'visible' : ''
        }`}
      >
        <span className={styles.connectorLine} />
        <span className={styles.connectorDot} />
        <span className={styles.connectorLine} />
        <span className={styles.connectorDot} />
        <span className={styles.connectorLine} />
      </div>
    </section>
  );
}
