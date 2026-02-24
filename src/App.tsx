import { useState, useEffect } from 'react';
import MainPage from './components/MainPage';
import TemplatesPage from './components/TemplatesPage';
import SubmitPage from './components/SubmitPage';
import ResumePage from './components/ResumePage';
import GitHubCallbackPage from './components/GitHubCallbackPage';

type Page = 'home' | 'templates' | 'submit' | 'resume' | 'github-callback';

function getPage(): Page {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  const savedState = sessionStorage.getItem('oauth_state');

  // code와 state 둘 다 있고, state가 저장된 값과 일치할 때만 콜백 페이지로 이동
  if (code && state && state === savedState) return 'github-callback';

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
