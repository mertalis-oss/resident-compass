import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { toast } from 'sonner';

const leadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  country: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(20).optional(),
  whatsapp: z.string().trim().max(20).optional(),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  scope: z.string().trim().max(1000).optional(),
});

export default function PlanBForm() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [utm, setUtm] = useState({ utm_source: '', utm_campaign: '', utm_medium: '' });
  const [form, setForm] = useState({ name: '', email: '', country: '', phone: '', whatsapp: '', timeline: '', budget: '', scope: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtm({
      utm_source: params.get('utm_source') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_medium: params.get('utm_medium') || '',
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = leadSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message || 'Please check your inputs.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('leads').insert({
      name: form.name,
      email: form.email,
      country: form.country,
      phone: form.phone || null,
      whatsapp: form.whatsapp || null,
      timeline: form.timeline || null,
      budget_range: form.budget || null,
      interest: null,
      consent_marketing: true,
      utm_source: utm.utm_source || null,
      utm_campaign: utm.utm_campaign || null,
      utm_medium: utm.utm_medium || null,
    });
    setLoading(false);
    if (error) {
      toast.error('Something went wrong. Please try again.');
      return;
    }
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
    <section id="lead-form" className="py-20">
      <div className="container max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4 text-foreground">
          {t('form.title')}
        </h2>
        <p className="text-muted-foreground text-center mb-10 text-sm">
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
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">{t('form.country')}</Label>
              <Input id="country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">{t('form.whatsapp')}</Label>
              <Input id="whatsapp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} maxLength={20} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('form.timeline')}</Label>
              <Select onValueChange={(v) => setForm({ ...form, timeline: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">{t('form.immediate')}</SelectItem>
                  <SelectItem value="3months">{t('form.threeMonths')}</SelectItem>
                  <SelectItem value="6months">{t('form.sixMonths')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('form.budget')}</Label>
              <Select onValueChange={(v) => setForm({ ...form, budget: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="<5k">Under $5,000</SelectItem>
                  <SelectItem value="5k-15k">$5,000 — $15,000</SelectItem>
                  <SelectItem value="15k-50k">$15,000 — $50,000</SelectItem>
                  <SelectItem value="50k+">$50,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scope">{t('form.scope')}</Label>
            <Textarea id="scope" value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} rows={3} maxLength={1000} placeholder="e.g. DTV visa + tax optimization + relocation logistics" />
          </div>
          <Button type="submit" size="lg" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base" disabled={loading}>
            {loading ? 'Submitting…' : t('form.submit')}
          </Button>
        </form>
      </div>
    </section>
  );
}
