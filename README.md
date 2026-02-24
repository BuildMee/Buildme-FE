# Buildme — 개발자 포트폴리오 생성기

> GitHub 연동 또는 이력서 업로드만으로 AI가 5분 안에 포트폴리오 초안을 완성해주는 서비스

<br />

## 프로젝트 소개

**Buildme**는 개발자가 자신의 포트폴리오를 빠르고 쉽게 만들 수 있도록 돕는 서비스입니다.
GitHub 레포지토리를 연동하거나 이력서를 업로드하면 AI가 자동으로 포트폴리오 초안을 생성합니다.
다양한 템플릿을 제공하며, 커뮤니티에서 공유된 템플릿도 사용할 수 있습니다.

<br />

## 주요 기능

| 기능 | 설명 |
|------|------|
| **GitHub 연동** | 레포지토리 분석 후 프로젝트 자동 정리 |
| **이력서 업로드** | PDF 이력서 기반 포트폴리오 초안 생성 |
| **템플릿 갤러리** | Minimal / Dark / Creative / Tech 카테고리 |
| **커뮤니티 템플릿** | 사용자가 직접 제작한 템플릿 공유 및 사용 |
| **AI 커스텀 디자인** | 원하는 스타일을 입력하면 AI가 맞춤 디자인 생성 |

<br />

## 기술 스택

- **Framework** : React 19 + TypeScript
- **Build Tool** : Vite
- **Styling** : CSS Modules
- **Font** : Bebas Neue, Syne, Space Mono
- **Package Manager** : npm

<br />

## 프로젝트 구조

```
src/
├── components/
│   ├── Navbar.tsx          # 상단 네비게이션
│   ├── MainPage.tsx        # 메인 랜딩 페이지
│   ├── TemplatesPage.tsx   # 커뮤니티 템플릿 갤러리
│   ├── SubmitPage.tsx      # 템플릿 제출 폼
│   ├── Footer.tsx          # 푸터
│   └── Logo.tsx            # 로고 SVG 컴포넌트
├── styles/                 # CSS Modules
└── App.tsx                 # 해시 기반 라우팅
```

<br />

## 페이지 라우팅

| URL | 페이지 |
|-----|--------|
| `/` | 메인 랜딩 페이지 |
| `/#templates` | 커뮤니티 템플릿 갤러리 |
| `/#submit` | 템플릿 제출 폼 |

<br />

## 로컬 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

<br />

## 팀

| 역할 | 이름 |
|------|------|
| FE 개발 | [@hdudwo](https://github.com/hdudwo) |

<br />

## 관련 레포

- **FE** : [BuildMee/Buildme-FE](https://github.com/BuildMee/Buildme-FE)
- **BE** : [BuildMee/Buildme-BE](https://github.com/BuildMee/Buildme-BE)
