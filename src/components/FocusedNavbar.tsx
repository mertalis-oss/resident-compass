import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDomainScope } from '@/hooks/useDomainScope';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import logoDark from '@/assets/Dark_Seffaf.png';
import logoWhite from '@/assets/White_Seffaf.png';

interface NavGroup {
  label: string;
  items: { to: string; label: string }[];
}

const TR_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Vizeler',
    items: [
      { to: '/tr/dtv-vize', label: 'Tayland DTV' },
    ],
  },
  {
    label: 'Yaşam',
    items: [
      { to: '/tr/soft-power', label: 'Soft Power / Eğitim' },
      { to: '/tr/expeditions', label: 'Keşifler' },
      { to: '/tr/nomad-incubator', label: 'Kuluçka Merkezi' },
      { to: '/tr/mice', label: 'Kurumsal / MICE' },
    ],
  },
];

const EN_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Visas',
    items: [
      { to: '/visas/thailand-dtv', label: 'Thailand DTV' },
      { to: '/visas/soft-power', label: 'Soft Power' },
    ],
  },
  {
    label: 'Relocation',
    items: [
      { to: '/relocation/nomad-incubator', label: 'Nomad Incubator' },
    ],
  },
  {
    label: 'Experiences',
    items: [
      { to: '/experiences/expeditions', label: 'Expeditions' },
      { to: '/experiences/wellness', label: 'Wellness' },
    ],
  },
  {
    label: 'Corporate',
    items: [
      { to: '/corporate/mice', label: 'MICE & Events' },
    ],
  },
];

const langs = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
] as const;

export default function FocusedNavbar() {
  const { t, i18n } = useTranslation();
  const scope = useDomainScope();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (scope === 'tr' && i18n.language !== 'tr') {
      i18n.changeLanguage('tr');
    }
  }, [scope, i18n]);

  const navGroups = scope === 'tr' ? TR_NAV_GROUPS : EN_NAV_GROUPS;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
        scrolled ? 'bg-corporate-navy shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to={scope === 'tr' ? '/tr' : '/'}>
          <img src={logoWhite} alt="Plan B Asia" className="h-9 md:h-10 transition-all duration-500" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navGroups.map((group) => {
            let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
            return (
              <div
                key={group.label}
                className="relative group"
                onMouseEnter={() => {
                  if (hoverTimeout) clearTimeout(hoverTimeout);
                  hoverTimeout = setTimeout(() => setOpenGroup(group.label), 120);
                }}
                onMouseLeave={() => {
                  if (hoverTimeout) clearTimeout(hoverTimeout);
                  setOpenGroup((prev) => (prev === group.label ? null : prev));
                }}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-holistic/80 hover:text-holistic transition-colors duration-300 py-2">
                  {group.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {openGroup === group.label && (
                  <div className="absolute top-full left-0 mt-0 py-2 bg-corporate-navy/95 backdrop-blur-md border border-border/20 rounded-md shadow-xl min-w-[200px] z-50">
                    {group.items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block px-4 py-2.5 text-sm text-holistic/70 hover:text-holistic hover:bg-holistic/5 transition-colors"
                        onClick={() => setOpenGroup(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Language Switcher — only on global domain */}
          {scope === 'en' && (
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
                  {langs.map((l) => (
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
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-holistic" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-corporate-navy border-t border-border/20 px-6 py-6 space-y-2">
          {navGroups.map((group) => (
            <div key={group.label}>
              <button
                onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
                className="flex items-center justify-between w-full text-sm font-medium text-holistic/80 hover:text-holistic py-2"
              >
                {group.label}
                <ChevronDown className={`h-4 w-4 transition-transform ${openGroup === group.label ? 'rotate-180' : ''}`} />
              </button>
              {openGroup === group.label && (
                <div className="pl-4 space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="block text-sm text-holistic/60 hover:text-holistic py-2"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {scope === 'en' && (
            <div className="flex gap-2 pt-4 border-t border-border/20">
              {langs.map((l) => (
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
        </div>
      )}
    </nav>
  );
}
