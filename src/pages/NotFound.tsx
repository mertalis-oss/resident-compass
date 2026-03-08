import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocation, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FocusedNavbar from '@/components/FocusedNavbar';

export default function NotFound() {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <FocusedNavbar />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-8xl font-heading font-bold text-muted-foreground/30 mb-6">404</p>
          <p className="text-lg font-body text-muted-foreground mb-8">
            {t('notFound.message')}
          </p>
          <Link to="/">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> {t('notFound.cta')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
