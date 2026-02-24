import { useState, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/ResumePage.module.css';

type Step = 'upload' | 'info' | 'done';

export default function ResumePage() {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') setFile(dropped);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.headerLabel}>RESUME UPLOAD</p>
          <h1 className={styles.headerTitle}>이력서로<br />시작하기</h1>
          <p className={styles.headerSub}>
            이력서를 업로드하면 AI가 분석해서 포트폴리오 초안을 완성합니다.
          </p>
        </div>
        <div className={styles.steps}>
          {['이력서 업로드', 'AI 분석', '포트폴리오 완성'].map((s, i) => (
            <div key={i} className={styles.stepGroup}>
              <div className={`${styles.step} ${i === 0 && step === 'upload' ? styles.stepActive : ''} ${i === 1 && step === 'info' ? styles.stepActive : ''} ${i === 2 && step === 'done' ? styles.stepActive : ''}`}>
                <div className={styles.stepNum}>0{i + 1}</div>
                <div className={styles.stepText}>{s}</div>
              </div>
              {i < 2 && <div className={styles.stepArrow}>→</div>}
            </div>
          ))}
        </div>
      </section>

      <div className={styles.body}>

        {/* ── Step 1: 업로드 ── */}
        {step === 'upload' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>이력서 업로드</h2>
            <p className={styles.cardDesc}>PDF 형식의 이력서를 업로드해주세요.</p>

            <div
              className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''} ${file ? styles.dropzoneDone : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className={styles.fileInput}
                onChange={handleFile}
              />
              {file ? (
                <>
                  <div className={styles.fileIcon}>✓</div>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileSize}>{(file.size / 1024).toFixed(0)} KB</div>
                  <div className={styles.fileChange}>다른 파일 선택</div>
                </>
              ) : (
                <>
                  <div className={styles.uploadIcon}>
                    <UploadIcon />
                  </div>
                  <div className={styles.dropText}>PDF를 여기에 드래그하거나 클릭해서 선택</div>
                  <div className={styles.dropHint}>최대 10MB · PDF만 가능</div>
                </>
              )}
            </div>

            <div className={styles.actions}>
              <a href="#" className={styles.cancelBtn}>취소</a>
              <button
                className={`${styles.nextBtn} ${!file ? styles.nextBtnDisabled : ''}`}
                disabled={!file}
                onClick={() => setStep('info')}
              >
                다음 →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: 기본 정보 ── */}
        {step === 'info' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>기본 정보 입력</h2>
            <p className={styles.cardDesc}>AI 분석에 활용할 정보를 입력해주세요.</p>

            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label}>이름 <span className={styles.req}>*</span></label>
                <input
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>직군 <span className={styles.req}>*</span></label>
                <input
                  className={styles.input}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="예: 프론트엔드 개발자"
                />
              </div>
            </div>

            <div className={styles.fileTag}>
              <span className={styles.fileTagIcon}>📄</span>
              {file?.name}
            </div>

            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={() => setStep('upload')}>← 이전</button>
              <button
                className={`${styles.nextBtn} ${!name || !role ? styles.nextBtnDisabled : ''}`}
                disabled={!name || !role}
                onClick={() => setStep('done')}
              >
                AI 분석 시작
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: 완료 ── */}
        {step === 'done' && (
          <div className={`${styles.card} ${styles.cardCenter}`}>
            <div className={styles.doneIcon}>✓</div>
            <h2 className={styles.doneTitle}>분석 완료</h2>
            <p className={styles.doneDesc}>
              AI가 이력서를 분석했습니다.<br />
              포트폴리오 초안이 준비됐어요.
            </p>
            <div className={styles.doneActions}>
              <button className={styles.nextBtn}>포트폴리오 확인하기 →</button>
              <a href="#templates" className={styles.cancelBtn}>템플릿 선택하기</a>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
