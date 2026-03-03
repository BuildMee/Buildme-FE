import { useState, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../styles/ResumePage.module.css';
import { TEMPLATES, saveSelectedTemplate, getSelectedTemplate, savePortfolioData, clearAiDesign } from '../utils/templates';
import { savePortfolioToServer, uploadResumeAndAnalyze } from '../utils/portfolioApi';
import { PREVIEWS } from './TemplatePreviews';

type Step = 'upload' | 'info' | 'analyzing' | 'detail' | 'template' | 'done';

export default function ResumePage() {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');
  const [blog, setBlog] = useState('');
  const [skills, setSkills] = useState('');
  const [highlights, setHighlights] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>(getSelectedTemplate() ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
    saveSelectedTemplate(id);
  };

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

  const goToNextAfterDetail = () => {
    const preSelected = getSelectedTemplate();
    setStep(preSelected ? 'done' : 'template');
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setStep('analyzing');
    const result = await uploadResumeAndAnalyze({ file, name, role });
    if (!result.success) {
      alert(result.message ?? 'AI 분석에 실패했어요. 다시 시도해주세요.');
      setStep('info');
      return;
    }
    if (result.portfolio) {
      const p = result.portfolio;
      if (p.intro) setBio(p.intro);
      if (p.skills?.length) setSkills(p.skills.join(', '));
      if (p.github) setGithub(p.github);
      if (p.blog) setBlog(p.blog);
      if (p.summary) setHighlights(p.summary);
    }
    setStep('detail');
  };

  const STEP_LABELS = ['이력서 업로드', '기본 정보', '상세 정보', '템플릿 선택', '완성'];
  const STEP_KEYS: Step[] = ['upload', 'info', 'detail', 'template', 'done'];

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
          {STEP_LABELS.map((s, i) => (
            <div key={i} className={styles.stepGroup}>
              <div className={`${styles.step} ${step === STEP_KEYS[i] ? styles.stepActive : ''}`}>
                <div className={styles.stepNum}>0{i + 1}</div>
                <div className={styles.stepText}>{s}</div>
              </div>
              {i < STEP_LABELS.length - 1 && <div className={styles.stepArrow}>→</div>}
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
                onClick={handleAnalyze}
              >
                AI 분석 시작 →
              </button>
            </div>
          </div>
        )}

        {/* ── Step analyzing: AI 분석 중 ── */}
        {step === 'analyzing' && (
          <div className={`${styles.card} ${styles.cardCenter}`}>
            <div style={{ width: 48, height: 48, border: '3px solid #eee', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 24 }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h2 className={styles.cardTitle}>AI가 이력서를 분석 중이에요</h2>
            <p className={styles.cardDesc}>PDF 텍스트 추출 후 포트폴리오 초안을 생성하고 있어요.<br />잠시만 기다려주세요.</p>
          </div>
        )}

        {/* ── Step 3: 상세 정보 (선택) ── */}
        {step === 'detail' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>상세 정보 입력</h2>
            <p className={styles.cardDesc}>
              입력할수록 포트폴리오 완성도가 높아져요.
              <span style={{ marginLeft: 8, fontSize: 12, color: '#aaa', fontWeight: 400 }}>선택사항</span>
            </p>

            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label}>한 줄 자기소개</label>
                <input
                  className={styles.input}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="예: 사용자 경험을 중시하는 프론트엔드 개발자입니다."
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>주요 기술 스택</label>
                <input
                  className={styles.input}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="예: React, TypeScript, Node.js, Docker"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>GitHub URL</label>
                <input
                  className={styles.input}
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>블로그 / 웹사이트</label>
                <input
                  className={styles.input}
                  value={blog}
                  onChange={(e) => setBlog(e.target.value)}
                  placeholder="https://myblog.com"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>강조하고 싶은 점</label>
                <textarea
                  className={styles.input}
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                  placeholder="이력서에 담기 어려운 경험, 프로젝트 포인트, 수상 이력 등 자유롭게 작성하세요."
                  rows={4}
                  style={{ resize: 'vertical', minHeight: 96 }}
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={() => setStep('info')}>← 이전</button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={styles.cancelBtn} onClick={goToNextAfterDetail}>건너뛰기</button>
                <button className={styles.nextBtn} onClick={goToNextAfterDetail}>
                  다음 →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: 템플릿 선택 (좌우 분할) ── */}
        {step === 'template' && (() => {
          const previewId = selectedTemplate || TEMPLATES[0].id;
          const Preview = PREVIEWS[previewId] ?? PREVIEWS['minimal-dark'];
          return (
            <div style={{ display: 'flex', width: '100%', minHeight: 560, border: '1px solid #e8e8e8', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>

              {/* 왼쪽: 미리보기 */}
              <div style={{ flex: '0 0 52%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e8e8e8' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: '#aaa', marginBottom: 1 }}>PREVIEW</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{TEMPLATES.find(t => t.id === previewId)?.name}</div>
                  </div>
                  <span style={{ fontSize: 11, padding: '2px 10px', background: '#f0f0f0', borderRadius: 20, color: '#666' }}>
                    {TEMPLATES.find(t => t.id === previewId)?.category}
                  </span>
                </div>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: 440 }}>
                  <Preview />
                </div>
              </div>

              {/* 오른쪽: 목록 + 버튼 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '20px 20px 0', borderBottom: '1px solid #e8e8e8', paddingBottom: 16 }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 3 }}>템플릿 선택</h2>
                  <p style={{ fontSize: 12, color: '#888' }}>포트폴리오에 적용할 템플릿을 선택하세요.</p>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {TEMPLATES.map((t) => {
                    const isSelected = selectedTemplate === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => handleSelectTemplate(t.id)}
                        style={{
                          padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
                          border: isSelected ? '2px solid #000' : '2px solid #e8e8e8',
                          background: isSelected ? '#f8f8f8' : '#fff',
                          transition: 'all 0.15s',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{t.name}</div>
                          <div style={{ fontSize: 11, color: '#888' }}>{t.description}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <span style={{ fontSize: 10, padding: '2px 8px', background: '#f0f0f0', borderRadius: 20, color: '#666' }}>{t.category}</span>
                          {isSelected && <span style={{ fontSize: 14, fontWeight: 700 }}>✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ padding: '14px 20px', borderTop: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className={styles.cancelBtn} onClick={() => setStep('detail')}>← 이전</button>
                  <button
                    className={`${styles.nextBtn} ${!selectedTemplate ? styles.nextBtnDisabled : ''}`}
                    disabled={!selectedTemplate}
                    onClick={() => setStep('done')}
                  >
                    포트폴리오 생성하기 →
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Step 5: 완료 ── */}
        {step === 'done' && (
          <div className={`${styles.card} ${styles.cardCenter}`}>
            <div className={styles.doneIcon}>✓</div>
            <h2 className={styles.doneTitle}>생성 완료</h2>
            <p className={styles.doneDesc}>
              <strong>{TEMPLATES.find((t) => t.id === selectedTemplate)?.name ?? ''}</strong> 템플릿으로<br />
              포트폴리오 초안이 준비됐어요.
            </p>
            <div className={styles.doneActions}>
              <button
                className={styles.nextBtn}
                onClick={() => {
                  const portfolioData = {
                    name,
                    role,
                    intro: bio,
                    skills: skills.split(',').map(s => s.trim()).filter(Boolean),
                    projects: [],
                    summary: highlights,
                    github: github || undefined,
                    blog: blog || undefined,
                  };
                  savePortfolioData(portfolioData);

                  const token = sessionStorage.getItem('access_token');
                  if (token) {
                    savePortfolioToServer({
                      title: `${name || '내'}의 포트폴리오`,
                      templateId: selectedTemplate || 'minimal-dark',
                      data: portfolioData,
                    }).catch(() => {});
                  }

                  clearAiDesign();
                  window.location.hash = 'portfolio-result';
                }}
              >
                포트폴리오 확인하기 →
              </button>
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
