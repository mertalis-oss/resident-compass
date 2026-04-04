import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';
import { trackPostHogEvent } from '@/lib/posthog';
import { getStoredUtms } from '@/lib/utmStorage';

const leadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  customer_whatsapp: z.string().trim().max(20).optional(),
});

interface PlanBFormProps {
  serviceId?: string;
  onSubmitSuccess?: () => void;
}

export default function PlanBForm({ serviceId }: PlanBFormProps) {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', customer_whatsapp: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = leadSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message || 'Please check your inputs.');
      return;
    }
    setLoading(true);

    const utms = getStoredUtms();
    const params = new URLSearchParams(window.location.search);

    const { error } = await supabase.from('leads').insert({
      name: form.name,
      email: form.email,
      customer_whatsapp: form.customer_whatsapp || null,
      source_domain: window.location.hostname,
      created_from: utms.utm_source || params.get('utm_source') || 'website',
      service_id: serviceId || null,
    });
    setLoading(false);
    if (error) {
      toast.error(t('form.error', { defaultValue: 'Something went wrong. Please try again.' }));
      return;
    }
    trackEvent('lead_form_submit', { source: 'plan_b_form' });
    trackPostHogEvent('lead_form_submit', { source: 'plan_b_form' });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div id="lead-form" className="text-center py-16 transition-all duration-500 ease-out">
        <p className="text-lg font-heading text-foreground">{t('form.success')}</p>
      </div>
    );
  }

  return (
    <section id="lead-form" className="section-editorial">
      <div className="container max-w-2xl">
        <h2 className="heading-section text-center mb-4 text-foreground">
          {t('form.title')}
        </h2>
        <p className="text-muted-foreground text-center mb-10 body-editorial">
          {t('hero.ctaSub')}
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('form.name')}</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('form.email')}</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={255} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">{t('form.whatsapp')}</Label>
            <Input id="whatsapp" value={form.customer_whatsapp} onChange={(e) => setForm({ ...form, customer_whatsapp: e.target.value })} maxLength={20} />
          </div>
          <Button type="submit" size="lg" className="w-full btn-luxury-primary" disabled={loading}>
            {loading ? t('form.submitting', { defaultValue: 'Submitting…' }) : t('form.submit')}
          </Button>
        </form>
      </div>
    </section>
  );
}
