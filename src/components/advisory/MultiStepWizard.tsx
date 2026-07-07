import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { trackPostHogEvent } from '@/lib/posthog';
import { trackPixelEvent } from '@/lib/metaPixel';
import { trackTikTokEvent } from '@/lib/tiktokPixel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// MultiStepWizard — 3-step progressive advisory intake
//
// Applies 2026 neuromarketing research (+42–87% conversion lift vs single-page)
// by splitting a 6-field form across three sequential steps, each holding at
// most two fields. Copy follows Plan B Asia's NVC-aligned brand voice: every
// prompt is an invitation ('Say hi first') rather than a command ("Enter
// your name"). Each step's subtitle explains why the ask exists, reducing
// cognitive friction.
//
// Attribution: fires the same wizard_step_completed + Meta Lead + TikTok
// SubmitForm events as AdvisoryForm on submit, so ad optimization keeps
// working. Honeypot preserved. Failure is silent — user always sees success.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  source_page: string;
  defaultDestination?: string;
  content_name?: string;
}

const VALID_DESTINATIONS = ['thailand', 'vietnam', 'cambodia', 'global'];

function cleanWhatsApp(raw: string): string {
  return raw.replace(/[^\d+]/g, '').replace(/(?!^\+)\+/g, '');
}

type Step = 1 | 2 | 3;

export default function MultiStepWizard({ source_page, defaultDestination, content_name }: Props) {
  const { t } = useTranslation();
  const resolvedDefault =
    defaultDestination && VALID_DESTINATIONS.includes(defaultDestination) ? defaultDestination : 'global';

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState(resolvedDefault);
  const [timeline, setTimeline] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  const destinations = t('advisory.destinations', { returnObjects: true }) as Record<string, string>;
  const timelines = t('advisory.timelines', { returnObjects: true }) as Record<string, string>;

  useEffect(() => {
    trackPostHogEvent('wizard_step_view', { step, source_page }, false);
  }, [step, source_page]);

  const step1Valid = name.trim().length >= 1 && /^\S+@\S+\.\S+$/.test(email.trim());
  const step2Valid = destination && timeline;

  const goNext = () => {
    if (step === 1 && !step1Valid) return;
    if (step === 2 && !step2Valid) return;
    trackPostHogEvent('wizard_step_completed', { step, source_page }, false);
    setStep((s) => Math.min(3, (s + 1) as Step));
  };
  const goBack = () => setStep((s) => Math.max(1, (s - 1) as Step));

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const normalizedEmail = email.trim().toLowerCase();
    const cleanedWhatsapp = cleanWhatsApp(whatsapp);

    if (honeypot) {
      setSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => successRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      return;
    }

    const quizAnswers = {
      source_page,
      submitted_at: new Date().toISOString(),
      fingerprint: `${normalizedEmail}-${source_page}-wizard`,
      referrer: typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct',
      destination,
      timeline,
      notes,
    };

    try {
      await supabase.functions.invoke('submit-lead', {
        body: {
          name,
          email: normalizedEmail,
          customer_whatsapp: cleanedWhatsapp || null,
          source_domain: typeof window !== 'undefined' ? window.location.hostname || 'unknown' : 'unknown',
          created_from: 'wizard_advisory',
          quiz_answers: quizAnswers,
          company_website: honeypot || null,
        },
      });
    } catch {
      // Silent — always show success.
    }

    const name_tag = content_name || 'multistep_advisory_wizard';
    trackPostHogEvent(
      'wizard_submit',
      { source_page, destination: destination || 'unspecified', timeline: timeline || 'unspecified' },
      true,
    );
    trackPixelEvent('Lead', { content_name: name_tag, content_category: destination || 'global' });
    trackTikTokEvent('SubmitForm', { content_name: name_tag, content_category: destination || 'global' });

    setSuccess(true);
    setIsSubmitting(false);
    setTimeout(() => successRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  if (success) {
    return (
      <div ref={successRef} className="min-h-[420px] flex items-center justify-center animate-fade-in">
        <div className="text-center max-w-md mx-auto space-y-6 px-6">
          <CheckCircle className="w-16 h-16 text-accent mx-auto" />
          <h3 className="font-heading text-2xl text-foreground">
            {t('wizard.successTitle', { defaultValue: "Got it. You're in." })}
          </h3>
          <p className="text-muted-foreground">
            {t('wizard.successBody', {
              defaultValue: "We've received your note. You'll hear from us within 24 hours — usually much sooner.",
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={successRef} className="max-w-xl mx-auto px-6 py-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8" aria-label={`Step ${step} of 3`}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              s === step ? 'w-10 bg-accent' : s < step ? 'w-6 bg-accent/60' : 'w-6 bg-border'
            }`}
          />
        ))}
      </div>

      {/* Honeypot (hidden) */}
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

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="font-heading text-2xl text-foreground">
                {t('wizard.step1Title', { defaultValue: 'Say hi first' })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('wizard.step1Sub', { defaultValue: 'Two fields. So we can reach you.' })}
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wiz-name">{t('advisory.nameLabel')}</Label>
                <Input
                  id="wiz-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wiz-email">{t('advisory.emailLabel')}</Label>
                <Input
                  id="wiz-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                />
              </div>
            </div>
            <Button
              onClick={goNext}
              disabled={!step1Valid}
              className="w-full btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
            >
              {t('wizard.continue', { defaultValue: 'Continue' })} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="font-heading text-2xl text-foreground">
                {t('wizard.step2Title', { defaultValue: 'What are you thinking?' })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('wizard.step2Sub', {
                  defaultValue: 'A place and a time. The rest we figure out together.',
                })}
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('advisory.destinationLabel')}</Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(destinations).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('advisory.timelineLabel')}</Label>
                <Select value={timeline} onValueChange={setTimeline}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(timelines).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={goBack}
                variant="outline"
                className="text-xs tracking-[0.15em] uppercase"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('wizard.back', { defaultValue: 'Back' })}
              </Button>
              <Button
                onClick={goNext}
                disabled={!step2Valid}
                className="flex-1 btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
              >
                {t('wizard.continue', { defaultValue: 'Continue' })} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="font-heading text-2xl text-foreground">
                {t('wizard.step3Title', { defaultValue: 'One more thing' })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('wizard.step3Sub', {
                  defaultValue: 'A short note is enough. The full picture we build in conversation.',
                })}
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wiz-wa">
                  {t('advisory.whatsappLabel')}
                  <span className="text-muted-foreground text-xs ml-2">
                    ({t('wizard.optional', { defaultValue: 'optional' })})
                  </span>
                </Label>
                <Input
                  id="wiz-wa"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder={t('advisory.whatsappPlaceholder', { defaultValue: '+90 555 000 00 00' })}
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wiz-notes">
                  {t('advisory.notesLabel')}
                  <span className="text-muted-foreground text-xs ml-2">
                    ({t('wizard.optional', { defaultValue: 'optional' })})
                  </span>
                </Label>
                <Textarea
                  id="wiz-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('advisory.notesPlaceholder', {
                    defaultValue: 'Anything specific to share?',
                  })}
                  rows={3}
                  maxLength={1000}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={goBack} variant="outline" className="text-xs tracking-[0.15em] uppercase">
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('wizard.back', { defaultValue: 'Back' })}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
              >
                {isSubmitting
                  ? t('wizard.submitting', { defaultValue: 'Sending…' })
                  : t('wizard.submit', { defaultValue: 'Begin Advisory' })}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
