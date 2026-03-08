import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X } from 'lucide-react';

export default function ConciergeButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[60] h-14 px-5 rounded-full bg-secondary text-secondary-foreground shadow-xl flex items-center gap-2 hover:scale-[1.02] transition-all duration-500 ease-out"
        aria-label={t('concierge.label')}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="text-sm font-medium hidden sm:inline">{t('concierge.label')}</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[59] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-card border border-border shadow-2xl p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {t('concierge.label')}
            </h3>
            <p className="text-sm text-muted-foreground">
              Connect with our concierge team directly via your preferred channel.
            </p>
            <div className="space-y-3">
              <a
                href={`https://wa.me/905551234567?text=${encodeURIComponent('Hello, I would like to learn more about Plan B Asia services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-secondary/50 hover:bg-muted/50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-green-600/10 flex items-center justify-center">
                  <span className="text-lg">💬</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Instant response</p>
                </div>
              </a>
              <a
                href="https://t.me/planbasia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-secondary/50 hover:bg-muted/50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-lg">✈️</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Telegram</p>
                  <p className="text-xs text-muted-foreground">Secure messaging</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
