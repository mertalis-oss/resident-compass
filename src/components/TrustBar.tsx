import { useTranslation } from 'react-i18next';
import { Shield, Eye, Users } from 'lucide-react';

export default function TrustBar() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-primary/5 border-b border-border/30">
      <div className="container flex items-center justify-center gap-6 md:gap-10 h-10 text-xs tracking-[0.1em] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Shield className="h-3 w-3 text-primary" />
          {t('trustBar.secure', { defaultValue: 'Secure process' })}
        </span>
        <span className="hidden sm:flex items-center gap-1.5">
          <Eye className="h-3 w-3 text-primary" />
          {t('trustBar.noHidden', { defaultValue: 'No hidden fees' })}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-3 w-3 text-primary" />
          {t('trustBar.realHuman', { defaultValue: 'Real human support' })}
        </span>
      </div>
    </div>
  );
}
