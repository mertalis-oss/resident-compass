import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { trackPostHogEvent } from '@/lib/posthog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle } from 'lucide-react';

interface Props {
  variant?: 'individual' | 'mice';
  defaultDestination?: string;
  source_page: string;
}

const VALID_DESTINATIONS = ['thailand', 'vietnam', 'cambodia', 'global'];

function cleanWhatsApp(raw: string): string {
  return raw.replace(/[^\d+]/g, '').replace(/(?!^\+)\+/g, '');
}

export default function AdvisoryForm({ variant, defaultDestination, source_page }: Props) {
  const { t } = useTranslation();
  const safeVariant = variant || 'individual';
  const resolvedDefault = defaultDestination && VALID_DESTINATIONS.includes(defaultDestination) ? defaultDestination : 'global';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [destination, setDestination] = useState(resolvedDefault);
  const [timeline, setTimeline] = useState('');
  const [notes, setNotes] = useState('');
  // MICE fields
  const [company, setCompany] = useState('');
  const [eventType, setEventType] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [eventDestination, setEventDestination] = useState('');
  const [eventDates, setEventDates] = useState('');
  // Honeypot
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  const destinations = t('advisory.destinations', { returnObjects: true }) as Record<string, string>;
  const timelines = t('advisory.timelines', { returnObjects: true }) as Record<string, string>;
  const groupSizes = t('advisory.groupSizes', { returnObjects: true }) as Record<string, string>;
  const eventTypes = t('advisory.eventTypes', { returnObjects: true }) as Record<string, string>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const normalizedEmail = email.trim().toLowerCase();
    const cleanedWhatsapp = cleanWhatsApp(whatsapp);

    // Anti-bot: if honeypot filled, skip DB but show success
    if (honeypot) {
      setSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => successRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      return;
    }

    const quizAnswers: Record<string, string> = {
      source_page,
      submitted_at: new Date().toISOString(),
      fingerprint: `${normalizedEmail}-${source_page}-${safeVariant}`,
      referrer: typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct',
    };

    if (safeVariant === 'mice') {
      Object.assign(quizAnswers, { company, eventType, groupSize, eventDestination, eventDates, notes });
    } else {
      Object.assign(quizAnswers, { destination, timeline, notes });
    }

    try {
      await supabase.from('leads').insert({
        name,
        email: normalizedEmail,
        customer_whatsapp: cleanedWhatsapp || null,
        source_domain: typeof window !== 'undefined' ? window.location.hostname || 'unknown' : 'unknown',
        created_from: safeVariant === 'mice' ? 'mice_form' : 'advisory_form',
        quiz_answers: quizAnswers,
      });
    } catch {
      // Silent fail — always show success
    }

    // Analytics fires AFTER DB call
    trackPostHogEvent(
      safeVariant === 'mice' ? 'mice_form_submitted' : 'advisory_form_submitted',
      {
        source_page,
        variant: safeVariant,
        destination: (safeVariant === 'mice' ? eventDestination : destination) || 'unspecified',
        timeline: (safeVariant === 'mice' ? 'unspecified' : timeline) || 'unspecified',
      },
      true
    );

    setSuccess(true);
    setIsSubmitting(false);
    setTimeout(() => successRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div ref={successRef} className="min-h-[420px]">
      {success ? (
        <div className="min-h-[420px] flex items-center justify-center animate-fade-in">
          <div className="text-center max-w-md mx-auto space-y-6 px-6">
            <CheckCircle className="w-16 h-16 text-accent mx-auto" />
            <h3 className="font-heading text-2xl text-foreground">
              {t('advisory.successMessage')}
            </h3>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto px-6 py-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adv-name">{t('advisory.nameLabel')}</Label>
              <Input id="adv-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adv-email">{t('advisory.emailLabel')}</Label>
              <Input id="adv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adv-whatsapp">{t('advisory.whatsappLabel')}</Label>
            <Input id="adv-whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder={t('advisory.whatsappPlaceholder')} maxLength={20} />
          </div>

          {safeVariant === 'mice' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="adv-company">{t('advisory.companyLabel')}</Label>
                <Input id="adv-company" value={company} onChange={(e) => setCompany(e.target.value)} required maxLength={100} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('advisory.eventTypeLabel')}</Label>
                  <Select value={eventType} onValueChange={setEventType} required>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(eventTypes).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('advisory.groupSizeLabel')}</Label>
                  <Select value={groupSize} onValueChange={setGroupSize} required>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(groupSizes).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('advisory.eventDestinationLabel')}</Label>
                  <Select value={eventDestination} onValueChange={setEventDestination}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(destinations).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adv-dates">{t('advisory.eventDatesLabel')}</Label>
                  <Input id="adv-dates" value={eventDates} onChange={(e) => setEventDates(e.target.value)} placeholder={t('advisory.eventDatesPlaceholder')} required maxLength={100} />
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('advisory.destinationLabel')}</Label>
                <Select value={destination} onValueChange={setDestination} required>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(destinations).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('advisory.timelineLabel')}</Label>
                <Select value={timeline} onValueChange={setTimeline} required>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(timelines).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="adv-notes">{t('advisory.notesLabel')}</Label>
            <Textarea id="adv-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('advisory.notesPlaceholder')} rows={3} maxLength={1000} />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full btn-luxury-gold text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto">
            {isSubmitting ? t('advisory.submitting') : t('advisory.submitLabel')}
          </Button>
        </form>
      )}
    </div>
  );
}
