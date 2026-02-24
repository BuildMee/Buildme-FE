import { useState, useEffect } from 'react';
import MainPage from './components/MainPage';
import TemplatesPage from './components/TemplatesPage';

type Page = 'home' | 'templates';

function getPage(): Page {
  return window.location.hash === '#templates' ? 'templates' : 'home';
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

  return page === 'templates' ? <TemplatesPage /> : <MainPage />;
}
