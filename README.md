<div align="center">

# 🛠️ Buildme — Frontend

**AI 기반 포트폴리오 자동 생성 서비스**

이력서 PDF를 업로드하거나 GitHub 레포를 연결하면,
AI가 자동으로 포트폴리오를 생성해드립니다.

<br/>

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

</div>

---

## 📌 소개

**Buildme**는 개발자를 위한 AI 포트폴리오 자동 생성 서비스입니다.
이력서를 업로드하거나 GitHub 레포지토리를 분석해 포트폴리오를 자동으로 만들고,
다양한 템플릿으로 꾸며 공유 링크로 배포할 수 있습니다.

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 📄 이력서 분석 | PDF 업로드 → AI 자동 포트폴리오 생성 |
| 🐙 GitHub 연동 | 레포지토리 분석 → 프로젝트 자동 추출 |
| 🎨 템플릿 선택 | Minimal Dark, Clean White, Terminal 등 10가지 테마 |
| 🤖 AI 디자인 | 프롬프트 기반 커스텀 디자인 생성 |
| 💾 포트폴리오 저장 | 로그인 후 서버에 저장 및 목록 관리 |
| ✏️ 포트폴리오 편집 | 저장된 포트폴리오 내용 수정 |
| 🔗 공유 링크 | 30일 유효 공개 링크 생성 (비로그인 열람 가능) |
| 👤 마이페이지 | 포트폴리오 · 이력서 목록 관리 |

---

## 🔐 로그인

- **GitHub OAuth** — GitHub 계정으로 로그인
- **Google OAuth** — Google 계정으로 로그인

---

## 🗂️ 프로젝트 구조

```
src/
├── components/
│   ├── MainPage.tsx             # 랜딩 메인
│   ├── ResumePage.tsx           # 이력서 업로드
│   ├── GithubPortfolioPage.tsx  # GitHub 레포 분석
│   ├── TemplateSelectPage.tsx   # 템플릿 선택
│   ├── PortfolioResultPage.tsx  # 포트폴리오 결과 + 공유
│   ├── PortfolioEditPage.tsx    # 포트폴리오 편집
│   ├── PublicPortfolioPage.tsx  # 공유 링크 공개 뷰
│   ├── MyPage.tsx               # 마이페이지
│   └── ...
├── utils/
│   ├── templates.ts             # PortfolioData 타입 & sessionStorage 헬퍼
│   └── portfolioApi.ts          # 서버 API 함수 모음
├── styles/                      # CSS Modules
└── App.tsx                      # 해시 기반 라우팅
```

---

## ⚙️ 기술 스택

| 분류 | 기술 |
|------|------|
| 언어 | TypeScript |
| 프레임워크 | React 19 |
| 빌드 도구 | Vite |
| 스타일링 | CSS Modules |
| 라우팅 | Hash-based Routing (라이브러리 없음) |

---

## 🚀 시작하기

### 1. 설치

```bash
git clone https://github.com/BuildMee/Buildme-FE.git
cd Buildme-FE
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성합니다:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. 개발 서버 실행

```bash
npm run dev
```

> [!NOTE]
> 백엔드 서버 [Buildme-BE](https://github.com/BuildMee/Buildme-BE)가 함께 실행되어야 합니다.

---

## 🔗 관련 레포지토리

- **Backend** → [Buildme-BE](https://github.com/BuildMee/Buildme-BE)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/BuildMee">BuildMee</a></sub>
</div>
