import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/SubmitPage.module.css';

type Category = 'minimal' | 'dark' | 'creative' | 'tech';

interface FormData {
  name: string;
  category: Category | '';
  description: string;
  previewUrl: string;
  githubUrl: string;
  author: string;
  tags: string;
}

const CATEGORIES: { value: Category; label: string; desc: string }[] = [
  { value: 'minimal', label: 'MINIMAL', desc: '깔끔하고 단순한 디자인' },
  { value: 'dark', label: 'DARK', desc: '다크 테마 기반' },
  { value: 'creative', label: 'CREATIVE', desc: '개성 있는 창의적 레이아웃' },
  { value: 'tech', label: 'TECH', desc: '개발자 감성의 기술적 디자인' },
];

export default function SubmitPage() {
  const [form, setForm] = useState<FormData>({
    name: '',
    category: '',
    description: '',
    previewUrl: '',
    githubUrl: '',
    author: '',
    tags: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isValid = form.name && form.category && form.description && form.author;

  if (submitted) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.successWrap}>
          <div className={styles.successBox}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>제출 완료</h2>
            <p className={styles.successDesc}>
              템플릿이 성공적으로 제출되었습니다.<br />
              검토 후 커뮤니티 갤러리에 등록됩니다.
            </p>
            <a href="#templates" className={styles.successLink}>템플릿 갤러리로 돌아가기 →</a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── Header ── */}
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.headerLabel}>CONTRIBUTE</p>
          <h1 className={styles.headerTitle}>SUBMIT<br />TEMPLATE</h1>
          <p className={styles.headerSub}>
            직접 만든 포트폴리오 템플릿을 커뮤니티와 공유하세요.
          </p>
        </div>
        <div className={styles.headerSteps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>01</div>
            <div className={styles.stepText}>템플릿 정보 입력</div>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepNum}>02</div>
            <div className={styles.stepText}>검토 (1-3일)</div>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepNum}>03</div>
            <div className={styles.stepText}>갤러리 등록</div>
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <div className={styles.formWrap}>
        <form className={styles.form} onSubmit={handleSubmit}>

          {/* 기본 정보 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>기본 정보</h2>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>
                  템플릿 이름 <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="예: Neo Brutalist"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  작성자 / GitHub ID <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="예: oh_minsu"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                카테고리 <span className={styles.required}>*</span>
              </label>
              <div className={styles.categoryGrid}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`${styles.catCard} ${form.category === cat.value ? styles.catCardActive : ''}`}
                    onClick={() => setForm((prev) => ({ ...prev, category: cat.value }))}
                  >
                    <div className={styles.catLabel}>{cat.label}</div>
                    <div className={styles.catDesc}>{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                설명 <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textarea}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="템플릿의 특징, 사용 대상, 디자인 컨셉을 설명해주세요."
                rows={4}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>태그</label>
              <input
                className={styles.input}
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="예: React, TypeScript, Portfolio (쉼표로 구분)"
              />
              <p className={styles.hint}>검색 노출에 사용됩니다.</p>
            </div>
          </div>

          {/* 링크 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>링크</h2>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>미리보기 URL</label>
                <input
                  className={styles.input}
                  name="previewUrl"
                  value={form.previewUrl}
                  onChange={handleChange}
                  placeholder="https://your-template-demo.vercel.app"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>GitHub 레포 URL</label>
                <input
                  className={styles.input}
                  name="githubUrl"
                  value={form.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
          </div>

          {/* 약관 */}
          <div className={styles.section}>
            <div className={styles.notice}>
              <span className={styles.noticeIcon}>!</span>
              <p className={styles.noticeText}>
                제출된 템플릿은 buildme 커뮤니티 가이드라인 검토 후 등록됩니다.
                오픈소스 라이선스를 준수해야 하며, 저작권을 침해하지 않아야 합니다.
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            <a href="#templates" className={styles.cancelBtn}>취소</a>
            <button
              type="submit"
              className={`${styles.submitBtn} ${!isValid ? styles.submitBtnDisabled : ''}`}
              disabled={!isValid}
            >
              템플릿 제출하기 →
            </button>
          </div>

        </form>
      </div>

      <Footer />
    </div>
  );
}
