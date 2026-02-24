import { useState, useEffect } from 'react';
import MainPage from './components/MainPage';
import TemplatesPage from './components/TemplatesPage';
import SubmitPage from './components/SubmitPage';
import ResumePage from './components/ResumePage';

type Page = 'home' | 'templates' | 'submit' | 'resume';

function getPage(): Page {
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

  if (page === 'templates') return <TemplatesPage />;
  if (page === 'submit') return <SubmitPage />;
  if (page === 'resume') return <ResumePage />;
  return <MainPage />;
}
