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
// MICEWizard — 3-step corporate RFP intake for MICE
//
// Mirrors the MultiStepWizard component pattern (progress dots, framer-motion
// slide, brand voice) but collects the fields a MICE proposal actually needs:
//   Step 1 — Company & you (company name, contact, email)
//   Step 2 — Event brief (type, group size, destination, dates)
//   Step 3 — Budget & notes (range, optional freeform)
//
// Uses AdvisoryForm's mice branch shape on submit so the existing
// submit-lead schema keeps working: created_from = "mice_wizard",
// quiz_answers carries the event fields.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  source_page: string;
}

type Step = 1 | 2 | 3;

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function MICEWizard({ source_page }: Props) {
  const { t } = useTranslation();

  const [step, setStep] = useState<Step>(1);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  const eventTypes = t('miceWizard.eventTypes', { returnObjects: true }) as Record<string, string>;
  const groupSizes = t('miceWizard.groupSizes', { returnObjects: true }) as Record<string, string>;
  const destinations = t('miceWizard.destinations', { returnObjects: true }) as Record<string, string>;
  const budgets = t('miceWizard.budgets', { returnObjects: true }) as Record<string, string>;

  useEffect(() => {
    trackPostHogEvent('mice_wizard_step_view', { step, source_page }, false);
  }, [step, source_page]);

  const step1Valid =
    companyName.trim().length >= 1 && contactName.trim().length >= 1 && EMAIL_RE.test(email.trim());
  const step2Valid = eventType && groupSize && destination;

  const goNext = () => {
    if (step === 1 && !step1Valid) return;
    if (step === 2 && !step2Valid) return;
    trackPostHogEvent('mice_wizard_step_completed', { step, source_page }, false);
    setStep((s) => Math.min(3, (s + 1) as Step));
  };
  const goBack = () => setStep((s) => Math.max(1, (s - 1) as Step));

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const normalizedEmail = email.trim().toLowerCase();

    if (honeypot) {
      setSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => successRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      return;
    }

    const quizAnswers = {
      source_page,
      submitted_at: new Date().toISOString(),
      fingerprint: `${normalizedEmail}-${source_page}-mice`,
      referrer: typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct',
      company: companyName,
      eventType,
      groupSize,
      eventDestination: destination,
      eventDates: dates,
      budget,
      notes,
    };

    try {
      await supabase.functions.invoke('submit-lead', {
        body: {
          name: contactName,
          email: normalizedEmail,
          source_domain: typeof window !== 'undefined' ? window.location.hostname || 'unknown' : 'unknown',
          created_from: 'mice_wizard',
          quiz_answers: quizAnswers,
          company_website: honeypot || null,
        },
      });
    } catch {
      // Silent — always show success.
    }

    trackPostHogEvent(
      'mice_wizard_submit',
      {
        source_page,
        eventType: eventType || 'unspecified',
        groupSize: groupSize || 'unspecified',
        destination: destination || 'unspecified',
        budget: budget || 'unspecified',
      },
      true,
    );
    trackPixelEvent('Lead', { content_name: 'mice_wizard', content_category: destination || 'thailand' });
    trackTikTokEvent('SubmitForm', { content_name: 'mice_wizard', content_category: destination || 'thailand' });

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
            {t('miceWizard.successTitle', { defaultValue: 'Got it. Working on it.' })}
          </h3>
          <p className="text-muted-foreground">
            {t('miceWizard.successBody', {
              defaultValue:
                "Preliminary proposal within 3 business days. Full scope in 5-7. Urgent dates go into a priority queue.",
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={successRef} className="max-w-xl mx-auto px-6 py-8">
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
            key="mice-step1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="font-heading text-2xl text-foreground">
                {t('miceWizard.step1Title', { defaultValue: 'Şirket ve sen' })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('miceWizard.step1Sub', { defaultValue: 'Kime yazıyoruz? Kısaca tanışalım.' })}
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mice-company">{t('miceWizard.companyLabel', { defaultValue: 'Şirket adı' })}</Label>
                <Input
                  id="mice-company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  maxLength={120}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mice-contact">{t('miceWizard.contactLabel', { defaultValue: 'İletişim adı' })}</Label>
                  <Input
                    id="mice-contact"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mice-email">{t('miceWizard.emailLabel', { defaultValue: 'E-posta' })}</Label>
                  <Input
                    id="mice-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={255}
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={goNext}
              disabled={!step1Valid}
              className="w-full btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
            >
              {t('miceWizard.continue', { defaultValue: 'Devam' })} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="mice-step2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="font-heading text-2xl text-foreground">
                {t('miceWizard.step2Title', { defaultValue: 'Etkinlik özeti' })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('miceWizard.step2Sub', {
                  defaultValue: 'Ne tipte etkinlik, kaç kişi, nerede? Kesin karar gerekmez.',
                })}
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('miceWizard.eventTypeLabel', { defaultValue: 'Etkinlik tipi' })}</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(eventTypes).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('miceWizard.groupSizeLabel', { defaultValue: 'Katılımcı sayısı' })}</Label>
                  <Select value={groupSize} onValueChange={setGroupSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(groupSizes).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('miceWizard.destinationLabel', { defaultValue: 'Destinasyon' })}</Label>
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
                  <Label htmlFor="mice-dates">
                    {t('miceWizard.datesLabel', { defaultValue: 'Yaklaşık tarih' })}
                    <span className="text-muted-foreground text-xs ml-2">
                      ({t('miceWizard.optional', { defaultValue: 'opsiyonel' })})
                    </span>
                  </Label>
                  <Input
                    id="mice-dates"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    placeholder={t('miceWizard.datesPlaceholder', { defaultValue: 'Ör. Ekim 2026 veya Q4' })}
                    maxLength={100}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={goBack}
                variant="outline"
                className="text-xs tracking-[0.15em] uppercase"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('miceWizard.back', { defaultValue: 'Geri' })}
              </Button>
              <Button
                onClick={goNext}
                disabled={!step2Valid}
                className="flex-1 btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
              >
                {t('miceWizard.continue', { defaultValue: 'Devam' })} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="mice-step3"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="font-heading text-2xl text-foreground">
                {t('miceWizard.step3Title', { defaultValue: 'Bütçe ve detay' })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('miceWizard.step3Sub', {
                  defaultValue: 'Bütçe aralığı ve varsa kısa not. Detayı sohbette açarız.',
                })}
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('miceWizard.budgetLabel', { defaultValue: 'Bütçe aralığı' })}</Label>
                <Select value={budget} onValueChange={setBudget}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(budgets).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mice-notes">
                  {t('miceWizard.notesLabel', { defaultValue: 'Kısa not' })}
                  <span className="text-muted-foreground text-xs ml-2">
                    ({t('miceWizard.optional', { defaultValue: 'opsiyonel' })})
                  </span>
                </Label>
                <Textarea
                  id="mice-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('miceWizard.notesPlaceholder', {
                    defaultValue: 'Beklentiler, özel talepler, sürpriz kısıtlar. Hepsi işimize yarar.',
                  })}
                  rows={4}
                  maxLength={1500}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={goBack} variant="outline" className="text-xs tracking-[0.15em] uppercase">
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('miceWizard.back', { defaultValue: 'Geri' })}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto"
              >
                {isSubmitting
                  ? t('miceWizard.submitting', { defaultValue: 'Gönderiliyor…' })
                  : t('miceWizard.submit', { defaultValue: 'Talebi Gönder' })}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
