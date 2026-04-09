import { useTranslation } from 'react-i18next';
import { Shield, Globe, UserCheck } from 'lucide-react';
import { getDomainScope } from '@/hooks/useDomainScope';

export default function TrustBar() {
  const { t } = useTranslation();
  const scope = getDomainScope();

  return (
    <div className="w-full bg-primary/5 border-b border-border/30">
      <div className="container flex items-center justify-center gap-6 md:gap-10 h-10 text-xs tracking-[0.1em] text-muted-foreground">
        {scope === 'tr' ? (
          <>
            <span className="flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-primary" />
              10+ Yıllık Turizm & Operasyon Deneyimi
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <UserCheck className="h-3 w-3 text-primary" />
              Kişiye Özel 360° Yaşam Kurulumu
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-primary" />
              15+ Years International Experience
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-primary" />
              Multi-Country Execution
            </span>
            <span className="flex items-center gap-1.5">
              <UserCheck className="h-3 w-3 text-primary" />
              Private Advisory Model
            </span>
          </>
        )}
      </div>
    </div>
  );
}
