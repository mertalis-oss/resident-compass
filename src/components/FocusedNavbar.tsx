import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDomainScope } from '@/hooks/useDomainScope';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';
import logoDark from '@/assets/Dark_Seffaf.png';
import logoWhite from '@/assets/White_Seffaf.png';

const TR_NAV_ITEMS = [
  { to: '/tr/dtv-vize', label: 'Vize & Oturum' },
  { to: '/tr/nomad-incubator', label: 'Kuluçka' },
  { to: '/tr/soft-power', label: 'Eğitim & Yaşam' },
  { to: '/tr/expeditions', label: 'Keşifler' },
  { to: '/tr/mice', label: 'Kurumsal' },
] as const;

const langs = [
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
  { code: 'hi', label: 'HI' },
] as const;

export default function FocusedNavbar() {
  const { t, i18n } = useTranslation();
  const scope = useDomainScope();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Force TR language on TR domain before first render flicker
  useEffect(() => {
    if (scope === 'tr' && i18n.language !== 'tr') {
      i18n.changeLanguage('tr');
    }
  }, [scope, i18n]);

  const navLinks = scope === 'tr'
    ? TR_NAV_ITEMS.map(item => ({ to: item.to, label: item.label }))
    : [
        { to: '/residency/dtv-thailand', label: t('nav.residency') },
        { to: '/wellness/thailand-retreat', label: t('nav.wellness') },
        { to: '/corporate-retreats/mice-thailand', label: t('nav.corporate') },
        { to: '/expeditions/ha-giang-motor-expedition', label: t('nav.expeditions') },
      ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
        scrolled ? 'bg-corporate-navy shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to={scope === 'tr' ? '/tr' : '/'}>
          <img
            src={logoWhite}
            alt="Plan B Asia"
            className="h-9 md:h-10 transition-all duration-500"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-holistic/80 hover:text-holistic transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}

          {/* Language Switcher — only on global domain */}
          {scope === 'global' && (
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-sm text-holistic/70 hover:text-holistic transition-colors"
              >
                <Globe className="h-4 w-4" />
                {i18n.language.toUpperCase()}
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 py-1 bg-card border border-border rounded-md shadow-xl min-w-[60px]">
                  {langs.filter(l => l.code !== 'tr').map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false); }}
                      className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors ${
                        i18n.language === l.code ? 'text-secondary font-semibold' : 'text-foreground'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Login accessible only via direct URL — invisible to public */}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-holistic"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-corporate-navy border-t border-border/20 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-holistic/80 hover:text-holistic py-2"
            >
              {link.label}
            </Link>
          ))}
          {scope === 'global' && (
            <div className="flex gap-2 pt-2">
              {langs.filter(l => l.code !== 'tr').map((l) => (
                <button
                  key={l.code}
                  onClick={() => { i18n.changeLanguage(l.code); }}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    i18n.language === l.code
                      ? 'bg-secondary text-secondary-foreground border-secondary'
                      : 'border-border/30 text-holistic/60'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
          {/* Login accessible only via direct URL — invisible to public */}
        </div>
      )}
    </nav>
  );
}
