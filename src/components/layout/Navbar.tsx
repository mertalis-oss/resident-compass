import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import logoWhite from "@/assets/White_Seffaf.png";
import logoColor from "@/assets/Logo-_Seffaf.png";

const langs = [
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
  { code: 'hi', label: 'HI' },
] as const;

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const navLinks = [
    { name: t('nav.residency'), href: "/dtv-vize" },
    { name: t('nav.expeditions'), href: "/adventure" },
    { name: t('nav.wellness'), href: "/wellness" },
    { name: t('nav.corporate'), href: "/mice" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link to="/" className="relative z-50">
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
                <img
                  src={isScrolled ? logoColor : logoWhite}
                  alt="Plan B Asia"
                  className="h-12 md:h-14 w-auto transition-all duration-500"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} className="relative group">
                  <span className={`text-sm uppercase tracking-[0.12em] font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-foreground/80 hover:text-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground'
                  }`}>
                    {link.name}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-500 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* CTA + Lang */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={`flex items-center gap-1 text-sm transition-colors ${
                    isScrolled ? 'text-foreground/70 hover:text-foreground' : 'text-primary-foreground/70 hover:text-primary-foreground'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  {i18n.language.toUpperCase()}
                </button>
                {langOpen && (
                  <div className="absolute top-full right-0 mt-2 py-1 bg-card border border-border rounded-sm shadow-xl min-w-[60px]">
                    {langs.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false); }}
                        className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors ${
                          i18n.language === l.code ? 'text-accent font-semibold' : 'text-foreground'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-luxury-outline text-xs"
                >
                  {t('nav.getStarted')}
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={`lg:hidden relative z-50 p-2 ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background lg:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex flex-col items-center justify-center h-full gap-6"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className="font-serif text-2xl md:text-3xl tracking-tight hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Lang Switcher */}
              <div className="flex gap-2 mt-4">
                {langs.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => i18n.changeLanguage(l.code)}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      i18n.language === l.code
                        ? 'bg-accent text-accent-foreground border-accent'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Link to="/login">
                  <button className="btn-luxury-primary">{t('nav.getStarted')}</button>
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
