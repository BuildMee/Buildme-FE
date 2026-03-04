import { useState, useEffect } from 'react';
import MainPage from './components/MainPage';
import TemplatesPage from './components/TemplatesPage';
import SubmitPage from './components/SubmitPage';
import ResumePage from './components/ResumePage';
import GitHubCallbackPage from './components/GitHubCallbackPage';
import MyPage from './components/MyPage';
import GithubPortfolioPage from './components/GithubPortfolioPage';
import TemplateSelectPage from './components/TemplateSelectPage';
import PortfolioResultPage from './components/PortfolioResultPage';
import PublicPortfolioPage from './components/PublicPortfolioPage';
import PricingPage from './components/PricingPage';
import AdminPage from './components/AdminPage';
import LoginModal from './components/LoginModal';

type Page = 'home' | 'templates' | 'submit' | 'resume' | 'github-callback' | 'mypage' | 'github-portfolio' | 'template-select' | 'portfolio-result' | 'portfolio-public' | 'pricing' | 'admin';

function getPage(): Page {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  const savedState = sessionStorage.getItem('oauth_state');

  if (code && state && state === savedState) return 'github-callback';

  if (window.location.hash === '#templates') return 'templates';
  if (window.location.hash === '#submit') return 'submit';
  if (window.location.hash === '#resume') return 'resume';
  if (window.location.hash === '#mypage') return 'mypage';
  if (window.location.hash === '#github-portfolio') return 'github-portfolio';
  if (window.location.hash === '#template-select') return 'template-select';
  if (window.location.hash === '#portfolio-result') return 'portfolio-result';
  if (window.location.hash.startsWith('#portfolio-public/')) return 'portfolio-public';
  if (window.location.hash === '#pricing') return 'pricing';
  if (window.location.hash === '#admin') return 'admin';
  return 'home';
}

const PROTECTED: Page[] = ['resume'];

export default function App() {
  const [page, setPage] = useState<Page>(getPage);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      const next = getPage();
      const isLoggedIn = !!sessionStorage.getItem('access_token');

      if (PROTECTED.includes(next) && !isLoggedIn) {
        // 해시만 제거 (hashchange 재발생 없음)
        window.history.replaceState(null, '', window.location.pathname);
        setLoginModalOpen(true);
        return;
      }

      setPage(next);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const renderPage = () => {
    if (page === 'github-callback') return <GitHubCallbackPage />;
    if (page === 'templates') return <TemplatesPage />;
    if (page === 'submit') return <SubmitPage />;
    if (page === 'resume') return <ResumePage />;
    if (page === 'mypage') return <MyPage />;
    if (page === 'github-portfolio') return <GithubPortfolioPage />;
    if (page === 'template-select') return <TemplateSelectPage />;
    if (page === 'portfolio-result') return <PortfolioResultPage />;
    if (page === 'portfolio-public') return <PublicPortfolioPage />;
    if (page === 'pricing') return <PricingPage />;
    if (page === 'admin') return <AdminPage />;
    return <MainPage />;
  };

  return (
    <>
      {renderPage()}
      {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
    </>
  );
}
