import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import ConciergeButton from '@/components/ConciergeButton';
import { ArrowRight, ArrowLeft, CheckCircle, Globe, DollarSign, Briefcase, Clock } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

/* ── Data ── */

const nationalities = [
  { value: 'american', label: 'American', group: 'tier1' },
  { value: 'british', label: 'British', group: 'tier1' },
  { value: 'canadian', label: 'Canadian', group: 'tier1' },
  { value: 'australian', label: 'Australian', group: 'tier1' },
  { value: 'german', label: 'German', group: 'tier1' },
  { value: 'french', label: 'French', group: 'tier1' },
  { value: 'dutch', label: 'Dutch', group: 'tier1' },
  { value: 'swedish', label: 'Swedish', group: 'tier1' },
  { value: 'turkish', label: 'Turkish', group: 'tier2' },
  { value: 'indian', label: 'Indian', group: 'tier2' },
  { value: 'japanese', label: 'Japanese', group: 'tier1' },
  { value: 'korean', label: 'Korean', group: 'tier1' },
  { value: 'singaporean', label: 'Singaporean', group: 'tier1' },
  { value: 'emirati', label: 'Emirati', group: 'tier1' },
  { value: 'brazilian', label: 'Brazilian', group: 'tier2' },
  { value: 'other', label: 'Other', group: 'tier2' },
];

const incomeRanges = [
  { value: '3000-5000', label: '$3,000 — $5,000 / mo', score: 30 },
  { value: '5000-10000', label: '$5,000 — $10,000 / mo', score: 35 },
  { value: '10000-25000', label: '$10,000 — $25,000 / mo', score: 35 },
  { value: '25000+', label: '$25,000+ / mo', score: 35 },
];

const workTypes = [
  { value: 'founder', label: 'Founder / CEO', score: 20 },
  { value: 'freelancer', label: 'Freelancer / Consultant', score: 18 },
  { value: 'employee', label: 'Remote Employee', score: 15 },
  { value: 'investor', label: 'Investor / FIRE', score: 20 },
];

const timelines = [
  { value: 'immediate', label: 'Immediate (< 1 month)', score: 15 },
  { value: '3months', label: 'Within 3 months', score: 15 },
  { value: '6months', label: 'Within 6 months', score: 10 },
  { value: 'exploring', label: 'Just exploring', score: 5 },
];

/* ── Scoring: Max 100 ── */
// Nationality: EU/US/UK/AUS = +20, else +15
// Income: >$5k = +35, >$3k = +30
// Work: Founder/Investor +20, Freelancer +18, Employee +15
// Timeline: <3mo = +15, 6mo = +10, exploring = +5

const leadSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Please enter a valid email').max(255),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{6,14}$/, 'Enter a valid international number (e.g. +1234567890)')
    .max(20),
  preferredContact: z.enum(['whatsapp', 'email'], {
    required_error: 'Please select a contact preference',
  }),
});

type LeadFormValues = z.infer<typeof leadSchema>;

/* ── Animation variants ── */
const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function MobilityAssessment() {
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

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: '', email: '', whatsapp: '', preferredContact: 'whatsapp' },
  });

  const calculateScore = () => {
    let score = 0;

    // Nationality scoring
    const nat = nationalities.find((n) => n.value === nationality);
    if (nat?.group === 'tier1') score += 20;
    else score += 15;

    // Income scoring
    const inc = incomeRanges.find((r) => r.value === income);
    if (inc) score += inc.score;

    // Work type scoring (already in data)
    const wt = workTypes.find((r) => r.value === workType);
    if (wt) score += wt.score;

    // Timeline scoring
    const tl = timelines.find((r) => r.value === timeline);
    if (tl) score += tl.score;

    return Math.min(score, 100);
  };

  const score = calculateScore();

  const nextStep = () => {
    if (step === 4) {
      setShowResult(true);
      trackEvent('mobility_assessment_completed', { score, nationality, income, workType, timeline });
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

  const handleSubmitLead = async (values: LeadFormValues) => {
    setLoading(true);
    const params = new URLSearchParams(window.location.search);
    const { error } = await supabase.from('leads').insert({
      name: values.name,
      email: values.email,
      customer_whatsapp: values.whatsapp || null,
      source_domain: window.location.hostname,
      created_from: params.get('utm_source') || 'calculator',
      score,
      quiz_answers: { nationality, income, workType, timeline },
    });
    setLoading(false);
    if (error) {
      toast.error('Something went wrong. Please try again.');
      return;
    }
    trackEvent('lead_form_submit', { source: 'mobility_assessment', score });
    setSubmitted(true);
  };

  const stepIcons = [Globe, DollarSign, Briefcase, Clock];
  const stepLabels = ['Nationality', 'Income', 'Work Type', 'Timeline'];

  const OptionButton = ({
    selected,
    onClick,
    children,
  }: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`p-5 rounded-lg border text-left text-sm font-body tracking-wide transition-all duration-500 ease-out hover:scale-[1.02] ${
        selected
          ? 'border-secondary bg-secondary/10 text-foreground'
          : 'border-border text-muted-foreground hover:border-secondary/30'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Strategic Mobility Assessment — Plan B Asia"
        description="Assess your strategic mobility index for Southeast Asian residency programs. Confidential evaluation for founders and global citizens."
        schemaType="Service"
        serviceName="Strategic Mobility Assessment"
      />
      <FocusedNavbar />

      {/* Hero */}
      <section className="pt-32 pb-10 md:pt-44 md:pb-16 bg-corporate-navy text-holistic">
        <div className="container max-w-3xl text-center px-6">
          <p className="text-xs tracking-[0.4em] uppercase text-holistic/50 mb-6 font-body">
            Confidential Assessment
          </p>
          <h1 className="text-4xl md:text-6xl font-heading font-normal tracking-tight leading-[0.95] mb-6">
            Strategic Mobility Assessment
          </h1>
          <p className="text-base text-holistic/60 max-w-lg mx-auto font-body font-light leading-relaxed">
            A 60-second evaluation of your eligibility profile for sovereign residency pathways in Southeast Asia.
          </p>
        </div>
      </section>

      {/* Progress */}
      <div className="container max-w-2xl px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          {stepLabels.map((label, i) => {
            const Icon = stepIcons[i];
            const isComplete = step > i + 1 || showResult;
            const isActive = step === i + 1 && !showResult;
            return (
              <div key={label} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isComplete
                      ? 'bg-secondary text-secondary-foreground'
                      : isActive
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle className="h-4 w-4 stroke-[1.5]" />
                  ) : (
                    <Icon className="h-4 w-4 stroke-[1.5]" />
                  )}
                </div>
                <span
                  className={`text-[10px] tracking-[0.3em] uppercase font-body ${
                    isActive || isComplete ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Glassmorphism Card */}
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-xl p-8 md:p-12">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={`step-${step}`}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {step === 1 && (
                  <div className="space-y-5">
                    <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body">Step I</p>
                    <h2 className="text-2xl font-heading font-normal tracking-tight text-foreground">
                      What is your nationality?
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      Nationality determines visa-free entry and DTV eligibility pathways.
                    </p>
                    <Select value={nationality} onValueChange={setNationality}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {nationalities.map((n) => (
                          <SelectItem key={n.value} value={n.value}>
                            {n.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body">Step II</p>
                    <h2 className="text-2xl font-heading font-normal tracking-tight text-foreground">
                      What is your monthly income?
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      DTV applications require proof of sustainable remote income.
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      {incomeRanges.map((r) => (
                        <OptionButton key={r.value} selected={income === r.value} onClick={() => setIncome(r.value)}>
                          {r.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body">Step III</p>
                    <h2 className="text-2xl font-heading font-normal tracking-tight text-foreground">
                      What is your remote work type?
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      Your professional classification influences the optimal visa pathway.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {workTypes.map((r) => (
                        <OptionButton
                          key={r.value}
                          selected={workType === r.value}
                          onClick={() => setWorkType(r.value)}
                        >
                          {r.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body">Step IV</p>
                    <h2 className="text-2xl font-heading font-normal tracking-tight text-foreground">
                      What is your relocation timeline?
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      Urgency affects strategy and preparation requirements.
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      {timelines.map((r) => (
                        <OptionButton
                          key={r.value}
                          selected={timeline === r.value}
                          onClick={() => setTimeline(r.value)}
                        >
                          {r.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-10">
                  {step > 1 ? (
                    <Button variant="outline" onClick={() => setStep(step - 1)} className="text-xs tracking-[0.15em] uppercase">
                      <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs tracking-[0.15em] uppercase px-8 transition-all duration-500 ease-out hover:scale-[1.02]"
                  >
                    {step === 4 ? 'See My Score' : 'Continue'}{' '}
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ) : !showForm ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center space-y-8"
              >
                <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body">
                  Assessment Complete
                </p>
                <h2 className="text-2xl md:text-3xl font-heading font-normal tracking-tight text-foreground">
                  Your Strategic Mobility Index
                </h2>
                <div className="relative w-44 h-44 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" strokeWidth="6" className="stroke-muted" />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      strokeWidth="6"
                      strokeLinecap="round"
                      className="stroke-secondary"
                      initial={{ strokeDasharray: '0 339.3' }}
                      animate={{ strokeDasharray: `${(score / 100) * 339.3} 339.3` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-heading font-normal text-foreground">{score}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground max-w-md mx-auto font-body leading-relaxed">
                  {score >= 70
                    ? 'You have a strong eligibility profile for sovereign residency pathways. A structured application strategy is recommended.'
                    : score >= 40
                    ? 'You have moderate eligibility. Strategic document preparation can significantly improve your position.'
                    : 'Your profile may require additional documentation. Our team can assess alternative pathways.'}
                </p>
                <div className="pt-4 space-y-3">
                  <Button
                    size="lg"
                    onClick={() => setShowForm(true)}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto transition-all duration-500 ease-out hover:scale-[1.02]"
                  >
                    Unlock Your Private Strategic Report
                    <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground font-body">
                    Confidential PDF report delivered within 24 hours.
                  </p>
                </div>
              </motion.div>
            ) : !submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="space-y-8"
              >
                <div className="text-center">
                  <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 font-body">
                    Private Report
                  </p>
                  <h2 className="text-2xl font-heading font-normal tracking-tight text-foreground">
                    Receive Your Strategic Report
                  </h2>
                  <p className="text-sm text-muted-foreground mt-3 font-body">
                    Your details are held in strict confidence.
                  </p>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmitLead)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs tracking-[0.2em] uppercase font-body">Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={100} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs tracking-[0.2em] uppercase font-body">Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" maxLength={255} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs tracking-[0.2em] uppercase font-body">
                            WhatsApp Number
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+1 234 567 8900" maxLength={20} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs tracking-[0.2em] uppercase font-body">
                            Preferred Contact Method
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-6 pt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="whatsapp" id="contact-whatsapp" />
                                <Label htmlFor="contact-whatsapp" className="text-sm font-body cursor-pointer">
                                  WhatsApp
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="email" id="contact-email" />
                                <Label htmlFor="contact-email" className="text-sm font-body cursor-pointer">
                                  Email
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs tracking-[0.15em] uppercase py-6 h-auto transition-all duration-500 ease-out hover:scale-[1.02]"
                      disabled={loading}
                    >
                      {loading ? 'Submitting…' : 'Get My Report'}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center py-10 space-y-6"
              >
                <CheckCircle className="h-10 w-10 text-secondary mx-auto stroke-[1.5]" />
                <h2 className="text-2xl font-heading font-normal tracking-tight text-foreground">
                  Report Request Received
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto font-body leading-relaxed">
                  Your personalized strategic report will be delivered to your inbox within 24 hours. Our concierge team
                  may reach out for additional context.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-16 bg-corporate-navy border-t border-holistic/10 mt-20">
        <div className="container max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs text-holistic/40 tracking-[0.2em] uppercase font-body">
            © {new Date().getFullYear()} Atropox OÜ
          </span>
          <div className="flex gap-10 text-xs text-holistic/40 tracking-[0.2em] uppercase font-body">
            <a href="#" className="hover:text-holistic/70 transition-colors duration-500">Privacy</a>
            <a href="#" className="hover:text-holistic/70 transition-colors duration-500">Terms</a>
          </div>
        </div>
      </footer>
      <ConciergeButton />
    </div>
  );
}
