import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import ConciergeButton from '@/components/ConciergeButton';
import { ArrowRight, ArrowLeft, CheckCircle, Globe, DollarSign, Briefcase, Clock, Target, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { trackPostHogEvent } from '@/lib/posthog';

/* ── Data ── */
const goals = [
  { value: 'relocate', label: 'Relocate permanently' },
  { value: 'remote-base', label: 'Set up a remote base' },
  { value: 'tax-optimize', label: 'Tax optimization' },
  { value: 'explore', label: 'Explore before committing' },
];

const incomeRanges = [
  { value: 'under-3000', label: 'Under $3,000 / mo', score: 15 },
  { value: '3000-5000', label: '$3,000 — $5,000 / mo', score: 30 },
  { value: '5000-10000', label: '$5,000 — $10,000 / mo', score: 35 },
  { value: '10000+', label: '$10,000+ / mo', score: 35 },
];

const nationalities = [
  { value: 'american', label: 'American', group: 'tier1' },
  { value: 'british', label: 'British', group: 'tier1' },
  { value: 'canadian', label: 'Canadian', group: 'tier1' },
  { value: 'australian', label: 'Australian', group: 'tier1' },
  { value: 'german', label: 'German', group: 'tier1' },
  { value: 'french', label: 'French', group: 'tier1' },
  { value: 'dutch', label: 'Dutch', group: 'tier1' },
  { value: 'swedish', label: 'Swedish', group: 'tier1' },
  { value: 'japanese', label: 'Japanese', group: 'tier1' },
  { value: 'korean', label: 'Korean', group: 'tier1' },
  { value: 'singaporean', label: 'Singaporean', group: 'tier1' },
  { value: 'emirati', label: 'Emirati', group: 'tier1' },
  { value: 'turkish', label: 'Turkish', group: 'tier2' },
  { value: 'indian', label: 'Indian', group: 'tier2' },
  { value: 'brazilian', label: 'Brazilian', group: 'tier2' },
  { value: 'other', label: 'Other', group: 'tier2' },
];

const timelines = [
  { value: 'immediate', label: 'Immediate (< 1 month)', score: 15 },
  { value: '3months', label: 'Within 3 months', score: 15 },
  { value: '6months', label: 'Within 6 months', score: 10 },
  { value: 'exploring', label: 'Just exploring', score: 5 },
];

const workTypes = [
  { value: 'founder', label: 'Founder / CEO', score: 20 },
  { value: 'freelancer', label: 'Freelancer / Consultant', score: 18 },
  { value: 'employee', label: 'Remote Employee', score: 15 },
  { value: 'investor', label: 'Investor / FIRE', score: 20 },
];

/* ── Helpers ── */
function safeGetAnswers(): Record<string, string> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('planb_answers');
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && (typeof parsed !== 'object' || Array.isArray(parsed))) throw new Error('invalid');
    return parsed;
  } catch {
    localStorage.removeItem('planb_answers');
    return null;
  }
}

function safeSaveAnswers(answers: Record<string, string>) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('planb_answers', JSON.stringify(answers)); } catch {}
}

/* ── Scoring: Max 100 ── */
function calculateScore(answers: Record<string, string>): number {
  let score = 0;
  const nat = nationalities.find(n => n.value === answers.step3);
  if (nat?.group === 'tier1') score += 20; else if (nat) score += 15;
  const inc = incomeRanges.find(r => r.value === answers.step2);
  if (inc) score += inc.score;
  const wt = workTypes.find(r => r.value === answers.step5);
  if (wt) score += wt.score;
  const tl = timelines.find(r => r.value === answers.step4);
  if (tl) score += tl.score;
  return Math.min(score, 100);
}

function getRecommendation(score: number) {
  if (score >= 70) return { tier: 'high', slug: 'dtv-thailand' };
  if (score >= 40) return { tier: 'medium', slug: 'dtv-thailand' };
  return { tier: 'low', slug: 'dtv-thailand' };
}

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const TOTAL_STEPS = 5;

export default function MobilityAssessment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>(() => safeGetAnswers() || {});
  const [phase, setPhase] = useState<'quiz' | 'email' | 'result'>('quiz');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const trackedSteps = useRef(new Set<number>());
  const resultEventFired = useRef(false);

  // Direct entry bypass: force step 1 if no answers
  useEffect(() => {
    if (!answers.step1) setStep(1);
  }, []);

  // Track step views (spam guard)
  useEffect(() => {
    if (phase === 'quiz' && !trackedSteps.current.has(step)) {
      trackedSteps.current.add(step);
      trackPostHogEvent('quiz_step_viewed', { step }, false);
    }
  }, [step, phase]);

  const setAnswer = (key: string, value: string) => {
    const stepNum = parseInt(key.replace('step', ''));
    // Delete subsequent answers when changing a previous answer
    const updated = { ...answers };
    for (let i = stepNum + 1; i <= TOTAL_STEPS; i++) {
      delete updated[`step${i}`];
    }
    updated[key] = value;
    setAnswers(updated);
    safeSaveAnswers(updated);
  };

  const canProceed = () => !!answers[`step${step}`];

  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // All questions answered — go to email capture
      setPhase('email');
    }
  };

  const prevStep = () => {
    if (phase === 'email') { setPhase('quiz'); return; }
    if (step > 1) setStep(step - 1);
  };

  const score = calculateScore(answers);
  const recommendation = getRecommendation(score);

  const handleEmailSubmit = async () => {
    const trimmed = email.toLowerCase().trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error(t('quiz.invalidEmail', { defaultValue: 'Please enter a valid email address.' }));
      return;
    }

    setIsSubmitting(true);
    try {
      // STEP 1: Upsert lead
      const normalizedHost = typeof window !== 'undefined' ? window.location.hostname.replace(/^www\./i, '').toLowerCase().replace(/\.$/, '') : '';
      const { data: leadData, error: leadErr } = await supabase.from('leads').insert({
        email: trimmed,
        source_domain: normalizedHost,
        created_from: 'quiz',
        score,
        quiz_answers: answers,
      }).select('id').single();

      if (leadErr) throw leadErr;

      // STEP 2: Track email_submitted
      trackPostHogEvent('email_submitted', { source: 'quiz', score }, true);

      // STEP 3: Store lead_id (try/catch)
      if (leadData?.id) {
        try {
          localStorage.setItem('planb_lead_id', leadData.id);
          localStorage.setItem('planb_lead_email', trimmed);
        } catch {}
      }

      trackPostHogEvent('mobility_assessment_completed', { score, recommendation: recommendation.tier }, true);
      setPhase('result');
    } catch (err) {
      console.error(err);
      toast.error(t('quiz.submitError', { defaultValue: 'Something went wrong. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Result page event dedupe
  useEffect(() => {
    if (phase === 'result' && !resultEventFired.current) {
      resultEventFired.current = true;
      trackPostHogEvent('quiz_result_viewed', { score, tier: recommendation.tier }, true);
    }
  }, [phase]);

  const hasLeadId = typeof window !== 'undefined' && (() => { try { return !!localStorage.getItem('planb_lead_id'); } catch { return false; } })();

  const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
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

  const stepIcons = [Target, DollarSign, Globe, Clock, Briefcase];
  const stepLabels = [
    t('quiz.goalLabel', { defaultValue: 'Goal' }),
    t('quiz.incomeLabel', { defaultValue: 'Income' }),
    t('quiz.passportLabel', { defaultValue: 'Passport' }),
    t('quiz.timelineLabel', { defaultValue: 'Timeline' }),
    t('quiz.workLabel', { defaultValue: 'Work' }),
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={t('quiz.seoTitle', { defaultValue: 'Strategic Mobility Assessment — Plan B Asia' })}
        description={t('quiz.seoDesc', { defaultValue: 'Assess your strategic mobility index for Southeast Asian residency programs.' })}
        schemaType="Service"
        serviceName="Strategic Mobility Assessment"
      />
      <FocusedNavbar />
      <TrustBar />

      {/* Hero */}
      <section className="pt-32 pb-10 md:pt-44 md:pb-16 bg-corporate-navy text-holistic">
        <div className="container max-w-3xl text-center px-6">
          <p className="text-xs tracking-[0.4em] uppercase text-holistic/50 mb-6 font-body">
            {t('quiz.confidentialLabel', { defaultValue: 'Confidential Assessment' })}
          </p>
          <h1 className="text-4xl md:text-6xl font-heading font-normal tracking-tight leading-[0.95] mb-6">
            {t('quiz.heroTitle', { defaultValue: 'Strategic Mobility Assessment' })}
          </h1>
          <p className="text-base text-holistic/60 max-w-lg mx-auto font-body font-light leading-relaxed">
            {t('quiz.heroSub', { defaultValue: 'A 60-second evaluation of your eligibility profile for sovereign residency pathways in Southeast Asia.' })}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-2xl px-6 py-10">
        {/* Progress Bar */}
        {phase === 'quiz' && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-body">
                {t('quiz.stepOf', { defaultValue: `Step ${step} of ${TOTAL_STEPS}`, step, total: TOTAL_STEPS })}
              </span>
              <span className="text-xs text-muted-foreground font-body">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
            </div>
            <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
            <div className="flex items-center justify-between mt-4">
              {stepLabels.map((label, i) => {
                const Icon = stepIcons[i];
                const isComplete = step > i + 1;
                const isActive = step === i + 1;
                return (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isComplete ? 'bg-secondary text-secondary-foreground' : isActive ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                    }`}>
                      {isComplete ? <CheckCircle className="h-3.5 w-3.5 stroke-[1.5]" /> : <Icon className="h-3.5 w-3.5 stroke-[1.5]" />}
                    </div>
                    <span className={`text-[9px] tracking-[0.2em] uppercase font-body hidden sm:block ${isActive || isComplete ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Glassmorphism Card */}
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-xl p-8 md:p-12">
          <AnimatePresence mode="wait">
            {phase === 'quiz' && (
              <motion.div key={`step-${step}`} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: 'easeOut' }}>
                {/* Q1: Goal */}
                {step === 1 && (
                  <div className="space-y-5">
                    <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body">{t('quiz.stepI', { defaultValue: 'Step I' })}</p>
                    <h2 className="text-2xl font-heading font-normal tracking-tight text-foreground">
                      {t('quiz.q1Title', { defaultValue: 'What is your primary goal?' })}
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      {t('quiz.q1Sub', { defaultValue: 'This helps us recommend the right pathway for you.' })}
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      {goals.map(g => (
                        <OptionButton key={g.value} selected={answers.step1 === g.value} onClick={() => setAnswer('step1', g.value)}>
                          {t(`quiz.goal_${g.value}`, { defaultValue: g.label })}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Q2: Income */}
                {step === 2 && (
                  <div className="space-y-5">
                    <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body">{t('quiz.stepII', { defaultValue: 'Step II' })}</p>
                    <h2 className="text-2xl font-heading font-normal tracking-tight text-foreground">
                      {t('quiz.q2Title', { defaultValue: 'What is your monthly income?' })}
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      {t('quiz.q2Sub', { defaultValue: 'DTV applications require proof of sustainable remote income.' })}
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      {incomeRanges.map(r => (
                        <OptionButton key={r.value} selected={answers.step2 === r.value} onClick={() => setAnswer('step2', r.value)}>
                          {r.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Q3: Passport */}
                {step === 3 && (
                  <div className="space-y-5">
                    <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body">{t('quiz.stepIII', { defaultValue: 'Step III' })}</p>
                    <h2 className="text-2xl font-heading font-normal tracking-tight text-foreground">
                      {t('quiz.q3Title', { defaultValue: 'What is your nationality?' })}
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      {t('quiz.q3Sub', { defaultValue: 'Nationality determines visa-free entry and DTV eligibility pathways.' })}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {nationalities.map(n => (
                        <OptionButton key={n.value} selected={answers.step3 === n.value} onClick={() => setAnswer('step3', n.value)}>
                          {n.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Q4: Timeline */}
                {step === 4 && (
                  <div className="space-y-5">
                    <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body">{t('quiz.stepIV', { defaultValue: 'Step IV' })}</p>
                    <h2 className="text-2xl font-heading font-normal tracking-tight text-foreground">
                      {t('quiz.q4Title', { defaultValue: 'What is your relocation timeline?' })}
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      {t('quiz.q4Sub', { defaultValue: 'Urgency affects strategy and preparation requirements.' })}
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      {timelines.map(r => (
                        <OptionButton key={r.value} selected={answers.step4 === r.value} onClick={() => setAnswer('step4', r.value)}>
                          {t(`quiz.timeline_${r.value}`, { defaultValue: r.label })}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Q5: Work Type */}
                {step === 5 && (
                  <div className="space-y-5">
                    <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body">{t('quiz.stepV', { defaultValue: 'Step V' })}</p>
                    <h2 className="text-2xl font-heading font-normal tracking-tight text-foreground">
                      {t('quiz.q5Title', { defaultValue: 'What is your remote work type?' })}
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      {t('quiz.q5Sub', { defaultValue: 'Your professional classification influences the optimal visa pathway.' })}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {workTypes.map(r => (
                        <OptionButton key={r.value} selected={answers.step5 === r.value} onClick={() => setAnswer('step5', r.value)}>
                          {t(`quiz.work_${r.value}`, { defaultValue: r.label })}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-10">
                  {step > 1 ? (
                    <Button variant="outline" onClick={prevStep} className="text-xs tracking-[0.15em] uppercase">
                      <ArrowLeft className="mr-2 h-3.5 w-3.5" /> {t('quiz.back', { defaultValue: 'Back' })}
                    </Button>
                  ) : <div />}
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs tracking-[0.15em] uppercase px-8 transition-all duration-500 ease-out hover:scale-[1.02]"
                  >
                    {step === TOTAL_STEPS
                      ? t('quiz.seeScore', { defaultValue: 'See My Score' })
                      : t('quiz.continue', { defaultValue: 'Continue' })}
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Email Capture */}
            {phase === 'email' && (
              <motion.div key="email" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="space-y-8 text-center">
                <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body">
                  {t('quiz.almostDone', { defaultValue: 'Almost Done' })}
                </p>
                <h2 className="text-2xl md:text-3xl font-heading font-normal tracking-tight text-foreground">
                  {t('quiz.unlockTitle', { defaultValue: 'Unlock Your Private Strategic Report' })}
                </h2>
                <p className="text-sm text-muted-foreground font-body">
                  {t('quiz.emailMicrocopy', { defaultValue: 'Takes 10 seconds. No spam. Just your plan.' })}
                </p>
                <div className="max-w-sm mx-auto space-y-4">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('quiz.emailPlaceholder', { defaultValue: 'your@email.com' })}
                    className="h-12 text-center"
                    maxLength={255}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                  />
                  <Button
                    onClick={handleEmailSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs tracking-[0.15em] uppercase py-6 h-auto transition-all duration-500 ease-out hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('quiz.unlocking', { defaultValue: 'Unlocking your plan...' })}</>
                    ) : (
                      <>{t('quiz.getReport', { defaultValue: 'Get My Report' })} <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                  <Button variant="ghost" onClick={prevStep} className="text-xs text-muted-foreground">
                    <ArrowLeft className="mr-1 h-3 w-3" /> {t('quiz.back', { defaultValue: 'Back' })}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Result Page = Sales Page */}
            {phase === 'result' && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="text-center space-y-8">
                {!recommendation ? (
                  <div className="py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">{t('quiz.matching', { defaultValue: "We're matching you to the best pathway..." })}</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body">
                      {t('quiz.resultLabel', { defaultValue: 'Assessment Complete' })}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-heading font-normal tracking-tight text-foreground">
                      {t('quiz.mobilityIndex', { defaultValue: 'Your Strategic Mobility Index' })}
                    </h2>

                    {/* Score Ring */}
                    <div className="relative w-44 h-44 mx-auto">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" strokeWidth="6" className="stroke-muted" />
                        <motion.circle
                          cx="60" cy="60" r="54" fill="none" strokeWidth="6" strokeLinecap="round"
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

                    {/* Psychological boost */}
                    <p className="text-sm text-accent font-body font-medium">
                      {t('quiz.topPercent', { defaultValue: "Based on your answers, you're in the top 18% of applicants eligible for this route." })}
                    </p>
                    <p className="text-xs text-muted-foreground font-body italic">
                      {t('quiz.topPercentSub', { defaultValue: 'Based on internal eligibility benchmarks.' })}
                    </p>

                    {/* Score description */}
                    <p className="text-sm text-muted-foreground max-w-md mx-auto font-body leading-relaxed">
                      {score >= 70
                        ? t('quiz.scoreHigh', { defaultValue: 'You have a strong eligibility profile. A structured application strategy is recommended.' })
                        : score >= 40
                        ? t('quiz.scoreMed', { defaultValue: 'You have moderate eligibility. Strategic document preparation can significantly improve your position.' })
                        : t('quiz.scoreLow', { defaultValue: 'Your profile may require additional documentation. Our team can assess alternative pathways.' })}
                    </p>

                    {/* Session recovery */}
                    {hasLeadId && (
                      <p className="text-xs text-muted-foreground italic">
                        {t('quiz.resumeNote', { defaultValue: 'You can resume your application anytime.' })}
                      </p>
                    )}

                    {/* Main CTA */}
                    <div className="pt-4 space-y-4">
                      <Button
                        size="lg"
                        onClick={() => {
                          trackPostHogEvent('cta_clicked', { source: 'quiz_result', service: recommendation.slug, score }, true);
                          setTimeout(() => {
                            try { navigate(`/residency/${recommendation.slug}?checkout=true`); } catch { window.location.href = `/residency/${recommendation.slug}?checkout=true`; }
                          }, 150);
                        }}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs tracking-[0.15em] uppercase px-10 py-6 h-auto transition-all duration-500 ease-out hover:scale-[1.02]"
                      >
                        {t('quiz.startProcess', { defaultValue: 'Start Your Process' })} <ArrowRight className="ml-3 h-4 w-4" />
                      </Button>
                      <p className="text-xs text-muted-foreground font-body">
                        {t('quiz.secureCheckout', { defaultValue: 'Secure checkout. Instant confirmation.' })}
                      </p>

                      {/* Alternative (overchoice prevention) */}
                      <div className="pt-6 opacity-60 hover:opacity-100 transition-opacity">
                        <p className="text-xs text-muted-foreground mb-2">{t('quiz.altLabel', { defaultValue: 'Or explore an alternative:' })}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/residency/dtv-thailand')}
                          className="text-xs tracking-[0.15em] uppercase"
                        >
                          {t('quiz.viewServices', { defaultValue: 'View All Services' })}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
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
            <a href="/privacy-policy" className="hover:text-holistic/70 transition-colors duration-500">{t('footer.privacy', { defaultValue: 'Privacy' })}</a>
            <a href="/terms-of-service" className="hover:text-holistic/70 transition-colors duration-500">{t('footer.terms', { defaultValue: 'Terms' })}</a>
          </div>
        </div>
      </footer>
      <ConciergeButton />
    </div>
  );
}
