import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/MyPage.module.css';

interface Portfolio {
  id: string;
  name: string;
  template: string;
  createdAt: string;
}

interface Resume {
  id: string;
  fileName: string;
  uploadedAt: string;
}

interface Payment {
  id: string;
  item: string;
  amount: string;
  date: string;
  status: '완료' | '취소';
}

// 더미 데이터
const dummyPortfolios: Portfolio[] = [
  { id: '1', name: '내 첫 번째 포트폴리오', template: 'Minimal Dark', createdAt: '2026.02.10' },
  { id: '2', name: '프론트엔드 개발자 포트폴리오', template: 'Terminal', createdAt: '2026.02.20' },
];

const dummyResumes: Resume[] = [
  { id: '1', fileName: '허영재_이력서_2026.pdf', uploadedAt: '2026.02.18' },
];

const dummyPayments: Payment[] = [
  { id: '1', item: 'Pro 플랜 1개월', amount: '9,900원', date: '2026.02.01', status: '완료' },
  { id: '2', item: 'Pro 플랜 1개월', amount: '9,900원', date: '2026.01.01', status: '완료' },
];

type Tab = 'portfolio' | 'resume' | 'payment';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<Tab>('portfolio');
  const [portfolios, setPortfolios] = useState(dummyPortfolios);
  const [resumes, setResumes] = useState(dummyResumes);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    const provider = sessionStorage.getItem('auth_provider');
    if (!token) return;

    if (provider === 'google') {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data: { name?: string }) => {
          if (data.name) setUserName(data.name);
        })
        .catch(() => {});
    } else {
      fetch('http://localhost:3001/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data: { success: boolean; user?: { name?: string; login?: string } }) => {
          if (data.success && data.user) {
            setUserName(data.user.name || data.user.login || null);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('auth_provider');
    window.location.hash = '';
  };

  const deletePortfolio = (id: string) => {
    setPortfolios((prev) => prev.filter((p) => p.id !== id));
  };

  const deleteResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.headerLabel}>MY ACCOUNT</p>
          <h1 className={styles.headerTitle}>
            {userName ? `${userName}` : '마이페이지'}
          </h1>
          {userName && <p className={styles.headerSub}>안녕하세요, {userName}님</p>}
        </div>
      </section>

      <div className={styles.body}>
        {/* 탭 */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'portfolio' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            내 포트폴리오
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'resume' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            이력서 관리
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'payment' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            결제 내역
          </button>
        </div>

        {/* 포트폴리오 탭 */}
        {activeTab === 'portfolio' && (
          <div className={styles.section}>
            {portfolios.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyText}>아직 만든 포트폴리오가 없어요.</p>
                <a href="#resume" className={styles.emptyBtn}>포트폴리오 만들기 →</a>
              </div>
            ) : (
              <div className={styles.list}>
                {portfolios.map((p) => (
                  <div key={p.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{p.name}</div>
                      <div className={styles.itemMeta}>{p.template} · {p.createdAt}</div>
                    </div>
                    <div className={styles.itemActions}>
                      <button className={styles.editBtn}>수정</button>
                      <button className={styles.deleteBtn} onClick={() => deletePortfolio(p.id)}>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 이력서 탭 */}
        {activeTab === 'resume' && (
          <div className={styles.section}>
            {resumes.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyText}>업로드된 이력서가 없어요.</p>
                <a href="#resume" className={styles.emptyBtn}>이력서 업로드 →</a>
              </div>
            ) : (
              <div className={styles.list}>
                {resumes.map((r) => (
                  <div key={r.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemIcon}>📄</div>
                      <div>
                        <div className={styles.itemName}>{r.fileName}</div>
                        <div className={styles.itemMeta}>업로드 · {r.uploadedAt}</div>
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <a href="#resume" className={styles.editBtn}>재업로드</a>
                      <button className={styles.deleteBtn} onClick={() => deleteResume(r.id)}>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 결제 내역 탭 */}
        {activeTab === 'payment' && (
          <div className={styles.section}>
            {dummyPayments.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyText}>결제 내역이 없어요.</p>
              </div>
            ) : (
              <div className={styles.list}>
                {dummyPayments.map((pay) => (
                  <div key={pay.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{pay.item}</div>
                      <div className={styles.itemMeta}>{pay.date}</div>
                    </div>
                    <div className={styles.itemRight}>
                      <div className={styles.payAmount}>{pay.amount}</div>
                      <div className={`${styles.payStatus} ${pay.status === '완료' ? styles.payDone : styles.payCanceled}`}>
                        {pay.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 로그아웃 */}
        <div className={styles.logoutSection}>
          <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
