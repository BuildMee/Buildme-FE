import { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/PricingPage.module.css';

const FREE_FEATURES = [
  '포트폴리오 3개 저장',
  '기본 템플릿 6종',
  '이력서 업로드 1개',
  'PDF 내보내기',
  '공유 링크 생성 (30일)',
];

const PRO_FEATURES = [
  '포트폴리오 무제한 저장',
  '모든 템플릿 무제한',
  '이력서 업로드 무제한',
  'PDF 내보내기',
  '공유 링크 생성 (무기한)',
  'AI 분석 월 50회',
  '커스텀 도메인 연결',
  '우선 고객 지원',
];

export default function PricingPage() {
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current !== null) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleSubscribe = () => {
    if (toastTimeoutRef.current !== null) clearTimeout(toastTimeoutRef.current);
    setToastVisible(true);
    toastTimeoutRef.current = window.setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── Header ── */}
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.headerLabel}>PRICING</p>
          <h1 className={styles.headerTitle}>심플한 요금제</h1>
          <p className={styles.headerSub}>
            필요한 만큼만 사용하세요. 언제든지 업그레이드하거나 취소할 수 있어요.
          </p>
        </div>
      </section>

      {/* ── Plans ── */}
      <div className={styles.plans}>

        {/* Free */}
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <p className={styles.planLabel}>FREE</p>
            <div className={styles.priceRow}>
              <span className={styles.price}>₩0</span>
              <span className={styles.pricePer}> / 월</span>
            </div>
            <p className={styles.planDesc}>포트폴리오를 처음 시작하는 분들을 위한 플랜</p>
          </div>
          <ul className={styles.featureList}>
            {FREE_FEATURES.map((f) => (
              <li key={f} className={styles.featureItem}>
                <CheckIcon />
                {f}
              </li>
            ))}
          </ul>
          <button className={styles.currentBtn} disabled aria-label="현재 사용 중인 무료 플랜입니다">현재 플랜</button>
        </div>

        {/* Pro */}
        <div className={`${styles.card} ${styles.cardPro}`}>
          <div className={styles.proBadge}>POPULAR</div>
          <div className={styles.cardTop}>
            <p className={styles.planLabel}>PRO</p>
            <div className={styles.priceRow}>
              <span className={styles.price}>₩9,900</span>
              <span className={styles.pricePer}> / 월</span>
            </div>
            <p className={styles.planDesc}>진지하게 취업을 준비하는 개발자를 위한 플랜</p>
          </div>
          <ul className={styles.featureList}>
            {PRO_FEATURES.map((f) => (
              <li key={f} className={styles.featureItem}>
                <CheckIcon pro />
                {f}
              </li>
            ))}
          </ul>
          <button className={styles.subscribeBtn} onClick={handleSubscribe}>
            Pro 시작하기 →
          </button>
        </div>

      </div>

      {/* ── FAQ ── */}
      <section className={styles.faq}>
        <div className={styles.faqInner}>
          <h2 className={styles.faqTitle}>자주 묻는 질문</h2>
          <div className={styles.faqList}>
            {[
              { q: '언제든지 취소할 수 있나요?', a: '네, 구독은 언제든 취소 가능하며 다음 결제일 이전까지 Pro 기능을 계속 사용할 수 있어요.' },
              { q: 'Free 플랜에서 만든 포트폴리오는 어떻게 되나요?', a: 'Pro로 업그레이드해도, 다시 Free로 돌아가도 기존에 만든 포트폴리오는 사라지지 않아요.' },
              { q: '결제 수단은 무엇을 지원하나요?', a: '신용카드, 체크카드, 카카오페이, 네이버페이 등 주요 결제 수단을 지원할 예정이에요.' },
            ].map((item) => (
              <div key={item.q} className={styles.faqItem}>
                <p className={styles.faqQ}>{item.q}</p>
                <p className={styles.faqA}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* ── Toast ── */}
      {toastVisible && (
        <div className={styles.toast}>
          🚀 결제 기능은 곧 출시될 예정이에요!
        </div>
      )}
    </div>
  );
}

function CheckIcon({ pro }: { pro?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="7" fill={pro ? '#000' : '#e8e8e8'} />
      <path d="M4 7l2 2 4-4" stroke={pro ? '#fff' : '#999'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
