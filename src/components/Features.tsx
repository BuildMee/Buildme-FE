import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from '../styles/Features.module.css';

interface Feature {
  number: string;
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    number: '01',
    icon: '{}',
    title: 'GitHub 자동 연동',
    description:
      'OAuth 한 번으로 모든 레포지토리를 불러옵니다. Public, Private 모두 지원. 원하는 프로젝트만 골라 포트폴리오에 추가.',
  },
  {
    number: '02',
    icon: 'AI',
    title: 'AI 프로젝트 분석',
    description:
      '코드 구조, 사용 기술, 커밋 패턴을 AI가 분석합니다. 프로젝트 설명과 핵심 기여를 자동으로 작성해 줍니다.',
  },
  {
    number: '03',
    icon: '///',
    title: '디자인 커스터마이징',
    description:
      '레퍼런스 이미지나 텍스트로 원하는 스타일을 전달하면, AI가 그에 맞는 디자인으로 포트폴리오를 생성합니다.',
  },
  {
    number: '04',
    icon: '->',
    title: 'PDF / 웹사이트 출력',
    description:
      '완성된 포트폴리오를 PDF로 다운로드하거나, 자동 생성된 웹사이트 링크로 공유하세요. 언제든 업데이트 가능.',
  },
];

export default function Features() {
  const [sectionRef, sectionVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.08 });

  return (
    <section ref={sectionRef} className={styles.section}>
      <p
        className={`${styles.sectionLabel} animate-on-scroll ${sectionVisible ? 'visible' : ''}`}
      >
        Features
      </p>
      <h2
        className={`${styles.sectionTitle} animate-on-scroll stagger-1 ${
          sectionVisible ? 'visible' : ''
        }`}
      >
        EVERYTHING YOU NEED TO SHIP YOUR PORTFOLIO
      </h2>

      <div className={styles.grid}>
        {features.map((feature, i) => (
          <div
            key={feature.number}
            className={`${styles.card} animate-on-scroll stagger-${i + 2} ${
              sectionVisible ? 'visible' : ''
            }`}
          >
            <div className={styles.cardNumber}>{feature.number}</div>
            <div className={styles.cardIcon}>
              <span>{feature.icon}</span>
            </div>
            <h3 className={styles.cardTitle}>{feature.title}</h3>
            <p className={styles.cardDesc}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
