import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSessionId, getStoredUtms } from '@/lib/utmStorage';
import { captureCTAClick } from '@/lib/tracking';
import { handleVipWhatsAppClick, buildWaUrl } from '@/lib/vipWhatsApp';

type Intent = 'exploring' | 'planning_6_12' | 'relocating_now';
type Timeline = 'later' | '3m' | 'now';
type Budget = 'under_3k' | '3_to_10k' | 'over_10k';

interface Props {
  open: boolean;
  onClose: () => void;
  sourceSite?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const intentMap = { exploring: 0, planning_6_12: 1, relocating_now: 2 } as const;
const timelineMap = { later: 0, '3m': 1, 'now': 2 } as const;
const budgetMap = { under_3k: 0, '3_to_10k': 1, over_10k: 2 } as const;

export default function SimplifiedAssessmentModal({ open, onClose, sourceSite }: Props) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);
  const lastSubmitRef = useRef<number>(0);
  const formStartTime = useRef<number>(Date.now());
  const vipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickLock = useRef(false);

  const [step, setStep] = useState<'intent' | 'timeline' | 'budget' | 'email'>('intent');
  const [intent, setIntent] = useState<Intent | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showVipEscape, setShowVipEscape] = useState(false);

  const { finalScore, isHighIntent } = useMemo(() => {
    const intentScore = intent ? intentMap[intent] : 0;
    const timelineScore = timeline ? timelineMap[timeline] : 0;
    const budgetScore = budget ? budgetMap[budget] : 0;
    const baseScore = intentScore + timelineScore + budgetScore;
    const bonus = (intentScore >= 1 && timelineScore >= 1 && baseScore < 5) ? 1 : 0;
    const final = baseScore + bonus;
    return { finalScore: final, isHighIntent: final >= 5 };
  }, [intent, timeline, budget]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [open]);

  // Auto-reset on close
  useEffect(() => {
    if (open) {
      formStartTime.current = Date.now();
      return;
    }
    setStep('intent');
    setIntent(null);
    setTimeline(null);
    setBudget(null);
    setEmail('');
    setConsent(false);
    setHoneypot('');
    setSubmitted(false);
    setShowVipEscape(false);
    submittingRef.current = false;
    lastSubmitRef.current = 0;
    if (vipTimer.current) { clearTimeout(vipTimer.current); vipTimer.current = null; }
  }, [open]);

  // Step-change scroll (Safari-safe, no smooth)
  useEffect(() => {
    modalRef.current?.scrollTo({ top: 0 });
  }, [step]);

  // VIP 2s reveal — only for hot leads after submit
  useEffect(() => {
    if (isHighIntent && submitted) {
      setShowVipEscape(false);
      if (vipTimer.current) { clearTimeout(vipTimer.current); vipTimer.current = null; }
      vipTimer.current = setTimeout(() => setShowVipEscape(true), 2000);
    }
    return () => {
      if (vipTimer.current) { clearTimeout(vipTimer.current); vipTimer.current = null; }
    };
  }, [isHighIntent, submitted]);

  const safeNavigate = (path: string) => {
    if (typeof window !== 'undefined' && window.location.pathname === path) return;
    onClose();
    navigate(path);
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.location.pathname !== path) {
          window.location.href = path;
        }
      }, 200);
    });
  };

  const handleSubmit = async () => {
    // Guards top-to-bottom, network last
    if (submittingRef.current === true) return;
    if (honeypot && honeypot.trim().length > 0) return;
    if (Date.now() - formStartTime.current < 1200) return;

    const normalizedEmail = email
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[.,;]+$/, '');

    if (!EMAIL_RE.test(normalizedEmail)) return;
    if (!consent) return;
    if (!intent || !timeline || !budget) return;
    if (Date.now() - lastSubmitRef.current < 2000) return;

    if (import.meta.env.DEV) {
      console.info('[SCORE SYNC]', { intent, timeline, budget, finalScore });
    }

    submittingRef.current = true;
    lastSubmitRef.current = Date.now();

    const utms = getStoredUtms();
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const now = new Date();

    const payload = {
      email: normalizedEmail,
      source_domain: typeof window !== 'undefined' ? window.location.hostname || 'unknown' : 'unknown',
      created_from: 'simplified_assessment',
      language: i18n?.language || 'en',
      session_id: getSessionId(),
      submit_iso: now.toISOString(),
      submit_timestamp: now.getTime(),
      intent,
      timeline,
      budget,
      score: finalScore,
      funnel_stage: isHighIntent ? 'hot' : 'warm',
      utm_source_first: utms.utm_source || null,
      utm_medium_first: utms.utm_medium || null,
      utm_campaign_first: utms.utm_campaign || null,
      utm_source_last: params.get('utm_source') || utms.utm_source || null,
      utm_medium_last: params.get('utm_medium') || utms.utm_medium || null,
      utm_campaign_last: params.get('utm_campaign') || utms.utm_campaign || null,
      quiz_answers: {
        intent, timeline, budget, score: finalScore,
        submitted_at: now.toISOString(),
        source: 'hero_modal',
      },
    };

    try {
      const { error } = await supabase.from('leads').insert(payload);
      if (error) throw error;
      try {
        captureCTAClick({
          type: isHighIntent ? 'assessment_submit_hot' : 'assessment_submit_warm',
          site: sourceSite,
        });
      } catch (err) {
        if (import.meta.env.DEV) console.warn('[Tracking failed]', err);
      }
      setSubmitted(true);
    } catch (err) {
      if (import.meta.env.DEV) console.error('[LEAD INSERT FAILED]', err);
    } finally {
      submittingRef.current = false;
    }
  };

  if (!open) return null;

  const optionBtn = (active: boolean) =>
    `w-full text-left px-5 py-4 border rounded-md transition-opacity duration-[120ms] ease-out ${
      active
        ? 'border-accent bg-accent/5 text-foreground'
        : 'border-border bg-background hover:opacity-80 text-foreground/80'
    }`;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-foreground/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-background w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-opacity duration-[120ms]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Honeypot */}
        <input
          type="text"
          name="company_website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="p-8 md:p-10">
          {!submitted ? (
            <>
              {step === 'intent' && (
                <div className="space-y-5">
                  <p className="caption-editorial text-muted-foreground tracking-[0.25em]">STEP 1 OF 4</p>
                  <h2 className="font-heading text-2xl text-foreground">What brings you here?</h2>
                  <div className="space-y-3 pt-2">
                    {([
                      ['relocating_now', 'I want to relocate fully'],
                      ['planning_6_12', 'Planning within 6–12 months'],
                      ['exploring', 'Exploring options'],
                    ] as [Intent, string][]).map(([k, label]) => (
                      <button
                        key={k}
                        onClick={() => { setIntent(k); setStep('timeline'); }}
                        className={optionBtn(intent === k)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'timeline' && (
                <div className="space-y-5">
                  <p className="caption-editorial text-muted-foreground tracking-[0.25em]">STEP 2 OF 4</p>
                  <h2 className="font-heading text-2xl text-foreground">When do you need to move?</h2>
                  <div className="space-y-3 pt-2">
                    {([
                      ['now', 'Within 1 month'],
                      ['3m', 'Within 3 months'],
                      ['later', 'No fixed timeline'],
                    ] as [Timeline, string][]).map(([k, label]) => (
                      <button
                        key={k}
                        onClick={() => { setTimeline(k); setStep('budget'); }}
                        className={optionBtn(timeline === k)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'budget' && (
                <div className="space-y-5">
                  <p className="caption-editorial text-muted-foreground tracking-[0.25em]">STEP 3 OF 4</p>
                  <h2 className="font-heading text-2xl text-foreground">Investment range?</h2>
                  <div className="space-y-3 pt-2">
                    {([
                      ['over_10k', '$10,000+'],
                      ['3_to_10k', '$3,000 – $10,000'],
                      ['under_3k', 'Under $3,000'],
                    ] as [Budget, string][]).map(([k, label]) => (
                      <button
                        key={k}
                        onClick={() => { setBudget(k); setStep('email'); }}
                        className={optionBtn(budget === k)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'email' && (
                <div className="space-y-5">
                  <p className="caption-editorial text-muted-foreground tracking-[0.25em]">STEP 4 OF 4</p>
                  <h2 className="font-heading text-2xl text-foreground">Where should we send your shortlist?</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Availability is limited this week — typically 3–5 slots.
                  </p>
                  <div className="space-y-3 pt-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      maxLength={255}
                      className="text-base"
                      autoComplete="email"
                    />
                    <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5"
                      />
                      <span>
                        I agree to be contacted regarding this inquiry. See{' '}
                        <a href="/privacy-policy" target="_blank" className="underline hover:opacity-80">Privacy Policy</a>.
                      </span>
                    </label>
                    <Button
                      onClick={handleSubmit}
                      disabled={!EMAIL_RE.test(email.trim().toLowerCase().replace(/\s+/g, '').replace(/[.,;]+$/, '')) || !consent}
                      className="w-full btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : isHighIntent ? (
            // HOT state
            <div className="space-y-6 text-center py-4 animate-fade-in">
              <p className="caption-editorial text-accent tracking-[0.25em]">PRIORITY ACCESS</p>
              <h2 className="font-heading text-2xl text-foreground">Your case fits our priority track.</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Based on your answers, you qualify for a structured advisory engagement.
              </p>
              <div className="pt-2 space-y-3">
                <Button
                  onClick={() => safeNavigate('/checkout/advisory')}
                  className="w-full btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
                >
                  Begin Advisory
                </Button>
                {showVipEscape && (
                  <a
                    href={buildWaUrl('VIP_MODAL', finalScore, sourceSite) ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleVipWhatsAppClick(e, 'VIP_MODAL', clickLock, finalScore, sourceSite)}
                    className="block opacity-40 hover:opacity-80 transition-opacity duration-[120ms] text-[11px] text-muted-foreground tracking-wide pt-2 animate-fade-in"
                  >
                    Direct line (existing clients & qualified cases)
                  </a>
                )}
              </div>
            </div>
          ) : (
            // WARM state
            <div className="space-y-5 text-center py-4 animate-fade-in">
              <p className="caption-editorial text-muted-foreground tracking-[0.25em]">RECEIVED</p>
              <h2 className="font-heading text-2xl text-foreground">Thank you.</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                We'll reach out if there's a strong fit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
