import { useState, useEffect } from 'react';
import MainPage from './components/MainPage';
import TemplatesPage from './components/TemplatesPage';
import SubmitPage from './components/SubmitPage';
import ResumePage from './components/ResumePage';
import GitHubCallbackPage from './components/GitHubCallbackPage';

type Page = 'home' | 'templates' | 'submit' | 'resume' | 'github-callback';

function getPage(): Page {
  // GitHub OAuth 콜백: URL에 ?code= 파라미터가 있을 때
  if (new URLSearchParams(window.location.search).has('code')) return 'github-callback';
  if (window.location.hash === '#templates') return 'templates';
  if (window.location.hash === '#submit') return 'submit';
  if (window.location.hash === '#resume') return 'resume';
  return 'home';
}

export default function App() {
  const [page, setPage] = useState<Page>(getPage);

  useEffect(() => {
    const handler = () => {
      setPage(getPage());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  if (page === 'github-callback') return <GitHubCallbackPage />;
  if (page === 'templates') return <TemplatesPage />;
  if (page === 'submit') return <SubmitPage />;
  if (page === 'resume') return <ResumePage />;
  return <MainPage />;
}
