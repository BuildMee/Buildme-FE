export interface TemplateInfo {
  id: string;
  name: string;
  category: string;
  description: string;
}

// 무료 플랜에서 사용 불가한 Pro 전용 템플릿 ID
export const PRO_TEMPLATE_IDS: string[] = ['neo', 'hacker', 'editorial', 'neon'];

export const TEMPLATES: TemplateInfo[] = [
  { id: 'minimal-dark', name: 'Minimal Dark', category: 'dark', description: '심플하고 다크한 개발자 감성' },
  { id: 'clean-white', name: 'Clean White', category: 'minimal', description: '깔끔하고 밝은 미니멀 스타일' },
  { id: 'blue-accent', name: 'Blue Accent', category: 'creative', description: '블루 포인트의 창의적 레이아웃' },
  { id: 'terminal', name: 'Terminal', category: 'tech', description: '터미널 감성의 개발자 특화 템플릿' },
  { id: 'grid', name: 'Grid', category: 'minimal', description: '그리드 기반의 정갈한 구조' },
  { id: 'magazine', name: 'Magazine', category: 'creative', description: '매거진 스타일의 개성 있는 레이아웃' },
  { id: 'neo', name: 'Neo Brutalist', category: 'minimal', description: '강렬한 네오 브루탈리즘 스타일' },
  { id: 'hacker', name: 'Hacker Mode', category: 'tech', description: '해커 감성의 다크 터미널 스타일' },
  { id: 'editorial', name: 'Editorial', category: 'creative', description: '에디토리얼 매거진 레이아웃' },
  { id: 'neon', name: 'Neon Dark', category: 'dark', description: '네온 포인트의 다크 테마' },
];

export function saveSelectedTemplate(id: string) {
  sessionStorage.setItem('selected_template', id);
}

export function getSelectedTemplate(): string | null {
  return sessionStorage.getItem('selected_template');
}

export function clearSelectedTemplate() {
  sessionStorage.removeItem('selected_template');
}

export interface PortfolioData {
  name: string;
  role: string;
  intro: string;
  skills: string[];
  projects: {
    name: string;
    description: string;
    tech: string[];
    highlights: string;
  }[];
  summary: string;
  github?: string;
  blog?: string;
}

export function savePortfolioData(data: PortfolioData) {
  sessionStorage.setItem('portfolio_data', JSON.stringify(data));
}

function isPortfolioProject(value: unknown): value is PortfolioData['projects'][number] {
  const p = value as PortfolioData['projects'][number];
  return !!p
    && typeof p.name === 'string'
    && typeof p.description === 'string'
    && Array.isArray(p.tech)
    && p.tech.every((t) => typeof t === 'string')
    && typeof p.highlights === 'string';
}

function isPortfolioData(value: unknown): value is PortfolioData {
  const v = value as PortfolioData;
  return !!v
    && typeof v.name === 'string'
    && typeof v.role === 'string'
    && typeof v.intro === 'string'
    && typeof v.summary === 'string'
    && Array.isArray(v.skills)
    && v.skills.every((s) => typeof s === 'string')
    && Array.isArray(v.projects)
    && v.projects.every(isPortfolioProject)
    && (v.github === undefined || typeof v.github === 'string')
    && (v.blog === undefined || typeof v.blog === 'string');
}

export interface AiDesign {
  theme: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontStyle: string;
  layout: string;
  mood: string;
}

export function saveAiDesign(design: AiDesign) {
  sessionStorage.setItem('ai_design', JSON.stringify(design));
}

function isAiDesign(value: unknown): value is AiDesign {
  const v = value as AiDesign;
  return (
    !!v &&
    typeof v.theme === 'string' &&
    typeof v.primaryColor === 'string' &&
    typeof v.accentColor === 'string' &&
    typeof v.backgroundColor === 'string' &&
    typeof v.textColor === 'string' &&
    typeof v.fontStyle === 'string' &&
    typeof v.layout === 'string' &&
    typeof v.mood === 'string'
  );
}

export function getAiDesign(): AiDesign | null {
  const raw = sessionStorage.getItem('ai_design');
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isAiDesign(parsed) ? parsed : null;
  } catch { return null; }
}

export function clearAiDesign() {
  sessionStorage.removeItem('ai_design');
}

export function getPortfolioData(): PortfolioData | null {
  const raw = sessionStorage.getItem('portfolio_data');
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isPortfolioData(parsed) ? parsed : null;
  } catch { return null; }
}
