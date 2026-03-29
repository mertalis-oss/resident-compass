import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDomainScope } from '@/hooks/useDomainScope';

/**
 * Synchronous language resolver + auto-redirect for TR domain.
 * Runs once on mount and on location change.
 */
export default function LanguageRouter() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const scope = getDomainScope();

  useEffect(() => {
    // Set html lang attribute
    const lang = scope === 'tr' ? 'tr' : 'en';
    document.documentElement.lang = lang;

    // Force language sync before render
    if (scope === 'tr' && i18n.language !== 'tr') {
      i18n.changeLanguage('tr');
    }

    // Auto-redirect: TR domain on root "/" → /tr
    if (scope === 'tr' && location.pathname === '/') {
      // Only redirect if not already on /tr
      navigate('/tr', { replace: true });
    }
  }, [scope, location.pathname, i18n, navigate]);

  // Also handle global domain with Turkish browser
  useEffect(() => {
    if (scope === 'global' && location.pathname === '/') {
      const browserLang = navigator.language?.toLowerCase() || '';
      if (browserLang.startsWith('tr')) {
        i18n.changeLanguage('tr');
      }
    }
  }, []);

  return null;
}
