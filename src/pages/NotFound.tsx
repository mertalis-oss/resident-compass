import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getDomainScope } from '@/hooks/useDomainScope';

export default function NotFound() {
  const location = useLocation();
  const scope = getDomainScope();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  // Smart redirect: avoid aggressive asset redirects that cause SEO loops
  const isAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|map|json)$/i.test(location.pathname);
  if (isAsset) {
    return null; // Don't redirect asset 404s
  }

  return <Navigate to={scope === 'tr' ? '/tr' : '/'} replace />;
}
