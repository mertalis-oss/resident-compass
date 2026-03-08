import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import ConciergeButton from '@/components/ConciergeButton';
import { ArrowRight, ArrowLeft, CheckCircle, Globe, DollarSign, Briefcase, Clock } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';

const nationalities = [
  'American', 'British', 'Canadian', 'Australian', 'German', 'French', 'Dutch', 'Swedish',
  'Turkish', 'Indian', 'Japanese', 'Korean', 'Singaporean', 'Emirati', 'Brazilian', 'Other',
];

const incomeRanges = [
  { value: '3000-5000', label: '$3,000 — $5,000/mo', score: 15 },
  { value: '5000-10000', label: '$5,000 — $10,000/mo', score: 25 },
  { value: '10000-25000', label: '$10,000 — $25,000/mo', score: 30 },
  { value: '25000+', label: '$25,000+/mo', score: 35 },
];

const workTypes = [
  { value: 'founder', label: 'Founder / CEO', score: 25 },
  { value: 'freelancer', label: 'Freelancer / Consultant', score: 20 },
  { value: 'employee', label: 'Remote Employee', score: 15 },
  { value: 'investor', label: 'Investor / FIRE', score: 22 },
];

const timelines = [
  { value: 'immediate', label: 'Immediate (< 1 month)', score: 10 },
  { value: '3months', label: 'Within 3 months', score: 8 },
  { value: '6months', label: 'Within 6 months', score: 5 },
  { value: 'exploring', label: 'Just exploring', score: 2 },
];

const leadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  whatsapp: z.string().trim().max(20).optional(),
});

export default function VisaCalculator() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [nationality, setNationality] = useState('');
  const [income, setIncome] = useState('');
  const [workType, setWorkType] = useState('');
  const [timeline, setTimeline] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' });

  const calculateScore = () => {
    let score = 0;
    const inc = incomeRanges.find((r) => r.value === income);
    const wt = workTypes.find((r) => r.value === workType);
    const tl = timelines.find((r) => r.value === timeline);
    if (inc) score += inc.score;
    if (wt) score += wt.score;
    if (tl) score += tl.score;
    if (nationality && !['Other'].includes(nationality)) score += 15;
    else score += 5;
    return Math.min(score, 100);
  };

  const score = calculateScore();

  const nextStep = () => {
    if (step === 4) {
      setShowResult(true);
    } else {
      setStep(step + 1);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!nationality;
    if (step === 2) return !!income;
    if (step === 3) return !!workType;
    if (step === 4) return !!timeline;
    return false;
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = leadSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message || 'Please check your inputs.');
      return;
    }
    setLoading(true);
    const params = new URLSearchParams(window.location.search);
    const { error } = await supabase.from('leads').insert({
      name: form.name,
      email: form.email,
      whatsapp: form.whatsapp || null,
      country: nationality,
      timeline,
      budget_range: income,
      mobility_score: score,
      consent_marketing: true,
      utm_source: params.get('utm_source') || 'calculator',
      utm_campaign: params.get('utm_campaign') || null,
      utm_medium: params.get('utm_medium') || null,
    });
    setLoading(false);
    if (error) {
      toast.error('Something went wrong. Please try again.');
      return;
    }
    setSubmitted(true);
  };

  const stepIcons = [Globe, DollarSign, Briefcase, Clock];
  const stepLabels = ['Nationality', 'Income', 'Work Type', 'Timeline'];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="DTV Visa Eligibility Calculator — Plan B Asia"
        description="Calculate your Digital Nomad Visa eligibility and strategic mobility score for Thailand's DTV program."
        schemaType="Service"
        serviceName="DTV Visa Eligibility Calculator"
      />
      <FocusedNavbar />

      <section className="pt-32 pb-10 md:pt-44 md:pb-16 bg-corporate-navy text-holistic">
        <div className="container max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight mb-4">
            Visa Eligibility Calculator
          </h1>
          <p className="text-lg text-holistic/70 max-w-xl mx-auto">
            Assess your eligibility for Thailand's Digital Nomad Visa in 60 seconds.
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="container max-w-2xl py-8">
        <div className="flex items-center justify-between mb-8">
          {stepLabels.map((label, i) => {
            const Icon = stepIcons[i];
            const isActive = step > i || showResult;
            return (
              <div key={label} className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isActive && step > i + 1 ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={`text-[10px] font-medium tracking-wider uppercase ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Glassmorphism Card */}
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-xl p-8 md:p-10">
          {!showResult ? (
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-heading font-semibold text-foreground">What is your nationality?</h2>
                  <p className="text-sm text-muted-foreground">This determines visa-free entry and DTV eligibility pathways.</p>
                  <Select value={nationality} onValueChange={setNationality}>
                    <SelectTrigger><SelectValue placeholder="Select nationality" /></SelectTrigger>
                    <SelectContent>
                      {nationalities.map((n) => (
                        <SelectItem key={n} value={n}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-heading font-semibold text-foreground">What is your monthly income?</h2>
                  <p className="text-sm text-muted-foreground">DTV applications require proof of sustainable remote income.</p>
                  <div className="grid grid-cols-1 gap-3">
                    {incomeRanges.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setIncome(r.value)}
                        className={`p-4 rounded-lg border text-left text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${
                          income === r.value ? 'border-secondary bg-secondary/10 text-foreground' : 'border-border text-muted-foreground hover:border-secondary/30'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-heading font-semibold text-foreground">What is your remote work type?</h2>
                  <p className="text-sm text-muted-foreground">Your professional classification influences the optimal visa pathway.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {workTypes.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setWorkType(r.value)}
                        className={`p-4 rounded-lg border text-left text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${
                          workType === r.value ? 'border-secondary bg-secondary/10 text-foreground' : 'border-border text-muted-foreground hover:border-secondary/30'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-heading font-semibold text-foreground">What is your relocation timeline?</h2>
                  <p className="text-sm text-muted-foreground">Urgency affects strategy and preparation requirements.</p>
                  <div className="grid grid-cols-1 gap-3">
                    {timelines.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setTimeline(r.value)}
                        className={`p-4 rounded-lg border text-left text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${
                          timeline === r.value ? 'border-secondary bg-secondary/10 text-foreground' : 'border-border text-muted-foreground hover:border-secondary/30'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                ) : <div />}
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  {step === 4 ? 'See My Score' : 'Continue'} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : !showForm ? (
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">Your Strategic Mobility Score</h2>
              <div className="relative w-40 h-40 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" className="stroke-muted" />
                  <circle
                    cx="60" cy="60" r="54" fill="none" strokeWidth="8"
                    strokeDasharray={`${(score / 100) * 339.3} 339.3`}
                    strokeLinecap="round"
                    className="stroke-secondary transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-heading font-bold text-foreground">{score}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {score >= 70
                  ? 'You have a strong eligibility profile for Thailand\'s Digital Nomad Visa. A structured application pathway is recommended.'
                  : score >= 40
                  ? 'You have moderate eligibility. Strategic document preparation can significantly improve your position.'
                  : 'Your profile may require additional documentation. Our team can assess alternative visa pathways.'}
              </p>
              <Button
                size="lg"
                onClick={() => setShowForm(true)}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base px-8"
              >
                Unlock Your Personalized Strategic Report <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-xs text-muted-foreground">Free PDF report delivered to your inbox within 24 hours.</p>
            </div>
          ) : !submitted ? (
            <div className="space-y-6">
              <h2 className="text-xl font-heading font-semibold text-foreground text-center">Receive Your Strategic Report</h2>
              <p className="text-sm text-muted-foreground text-center">Enter your details to receive your personalized DTV eligibility report.</p>
              <form onSubmit={handleSubmitLead} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="calc-name">Full Name</Label>
                  <Input id="calc-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calc-email">Email</Label>
                  <Input id="calc-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={255} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calc-whatsapp">WhatsApp (Optional)</Label>
                  <Input id="calc-whatsapp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} maxLength={20} />
                </div>
                <Button type="submit" size="lg" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" disabled={loading}>
                  {loading ? 'Submitting…' : 'Get My Report'}
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="h-12 w-12 text-secondary mx-auto" />
              <h2 className="text-xl font-heading font-semibold text-foreground">Report Request Received</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your personalized strategic report will be delivered to your inbox within 24 hours. Our concierge team may reach out for additional context.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-corporate-navy text-holistic mt-20">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-holistic/50">© {new Date().getFullYear()} Atropox OÜ. All rights reserved.</span>
          <div className="flex gap-6 text-sm text-holistic/50">
            <a href="#" className="hover:text-holistic/80 transition-colors">Privacy</a>
            <a href="#" className="hover:text-holistic/80 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
      <ConciergeButton />
    </div>
  );
}
