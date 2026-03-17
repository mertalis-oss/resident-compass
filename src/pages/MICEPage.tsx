import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Check, Building2, Users, Calendar, DollarSign, Shield, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  { id: 1, title: "Company", icon: Building2 },
  { id: 2, title: "Event", icon: Users },
  { id: 3, title: "Dates", icon: Calendar },
  { id: 4, title: "Budget", icon: DollarSign },
];

const eventTypes = ["Corporate Offsite", "Team Building", "Leadership Retreat", "Annual Conference", "Incentive Trip", "Board Meeting", "Product Launch", "Other"];
const budgetRanges = ["$10,000 - $25,000", "$25,000 - $50,000", "$50,000 - $100,000", "$100,000 - $250,000", "$250,000+"];

interface FormData {
  companyName: string; contactPerson: string; email: string; phone: string;
  eventType: string; paxCount: string; preferredDestination: string;
  startDate: string; endDate: string; flexibility: string;
  budgetRange: string; specialRequirements: string;
}

const MICEPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: "", contactPerson: "", email: "", phone: "",
    eventType: "", paxCount: "", preferredDestination: "",
    startDate: "", endDate: "", flexibility: "",
    budgetRange: "", specialRequirements: "",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => { if (currentStep < 4) setCurrentStep((prev) => prev + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep((prev) => prev - 1); };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await supabase.from('leads').insert({
        name: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        program_scope: `MICE: ${formData.eventType} - ${formData.companyName} - ${formData.paxCount} pax`,
        budget_range: formData.budgetRange,
      });
      toast({ title: "Request Received", description: "Our corporate events team will contact you within 24 hours." });
    } catch {
      toast({ title: "Submitted", description: "Our team will be in touch shortly." });
    }
    setIsSubmitting(false);
    setCurrentStep(1);
    setFormData({ companyName: "", contactPerson: "", email: "", phone: "", eventType: "", paxCount: "", preferredDestination: "", startDate: "", endDate: "", flexibility: "", budgetRange: "", specialRequirements: "" });
  };

  return (
    <Layout>
      <SEOHead
        title="Corporate MICE Events — Southeast Asia | Plan B Asia"
        description="End-to-end corporate event management. Meetings, incentives, conferences, and exhibitions across Southeast Asia."
        schemaType="Service"
        serviceName="Corporate MICE"
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 grain-overlay">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/60" />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-gold" />
              <span className="caption-editorial text-background/70">Corporate MICE Services</span>
            </div>
            <h1 className="heading-display text-background mb-6">
              Visionary Experiences
              <span className="block text-gold">For Your Team</span>
            </h1>
            <p className="body-large text-background/80 max-w-2xl mb-8">
              15+ years of global operations experience. End-to-end professional solutions for meetings, incentive trips, conferences, and exhibitions across Southeast Asia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why SEA */}
      <section className="section-editorial bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-12 gap-8 lg:gap-16">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="col-span-12 lg:col-span-5">
              <p className="caption-editorial text-accent mb-4">Why Southeast Asia?</p>
              <h2 className="heading-section mb-6">The World's Most Dynamic Region for Corporate Events</h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="col-span-12 lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: "Cost Advantage", desc: "Premium experiences at 40-60% less than Western alternatives" },
                  { title: "Infrastructure", desc: "World-class hotels, venues, and transportation networks" },
                  { title: "Time Zone", desc: "Ideal for global teams spanning US, Europe, and APAC" },
                  { title: "Unique Experiences", desc: "From forest retreats to floating conferences" },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-primary pl-6">
                    <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="caption-editorial text-accent mb-4">Full Service</p>
            <h2 className="heading-section text-primary-foreground">From Logistics to Execution</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Venue Selection", "Accommodation", "Ground Transport", "F&B Catering", "Team Activities", "Risk & Insurance", "Visa Support", "AV & Technical", "Translation", "Photo & Video", "Emergency Support", "Event Report"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} className="p-4 bg-primary-foreground/5 border border-primary-foreground/10 text-center hover:bg-primary-foreground/10 transition-colors">
                <Check className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium text-primary-foreground/90">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RFP Form */}
      <section className="section-editorial bg-secondary" id="rfp">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <p className="caption-editorial text-accent mb-4">Request For Proposal</p>
              <h2 className="heading-section mb-4">Let's Plan Your Event</h2>
              <p className="text-muted-foreground">Fill out the form. Our team will return with a customized proposal within 24 hours.</p>
            </motion.div>

            {/* Progress */}
            <div className="flex justify-between mb-12 relative">
              <div className="absolute top-5 left-0 right-0 h-px bg-border" />
              {steps.map((step) => (
                <div key={step.id} className="relative flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${step.id <= currentStep ? "bg-primary text-primary-foreground" : "bg-secondary border border-border text-muted-foreground"}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="mt-2 text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border/50 p-8 lg:p-12">
              {currentStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="font-serif text-2xl mb-6">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Company Name *</Label><Input value={formData.companyName} onChange={(e) => updateFormData("companyName", e.target.value)} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Contact Person *</Label><Input value={formData.contactPerson} onChange={(e) => updateFormData("contactPerson", e.target.value)} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Email *</Label><Input type="email" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone} onChange={(e) => updateFormData("phone", e.target.value)} className="bg-background" /></div>
                  </div>
                </motion.div>
              )}
              {currentStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="font-serif text-2xl mb-6">Event Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Event Type *</Label>
                      <Select value={formData.eventType} onValueChange={(v) => updateFormData("eventType", v)}><SelectTrigger className="bg-background"><SelectValue /></SelectTrigger><SelectContent>{eventTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent></Select>
                    </div>
                    <div className="space-y-2"><Label>Number of Attendees *</Label><Input value={formData.paxCount} onChange={(e) => updateFormData("paxCount", e.target.value)} className="bg-background" /></div>
                    <div className="col-span-1 md:col-span-2 space-y-2"><Label>Preferred Destination</Label><Input value={formData.preferredDestination} onChange={(e) => updateFormData("preferredDestination", e.target.value)} placeholder="e.g. Thailand, Vietnam, Bali" className="bg-background" /></div>
                  </div>
                </motion.div>
              )}
              {currentStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="font-serif text-2xl mb-6">Dates & Timeline</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={formData.startDate} onChange={(e) => updateFormData("startDate", e.target.value)} className="bg-background" /></div>
                    <div className="space-y-2"><Label>End Date</Label><Input type="date" value={formData.endDate} onChange={(e) => updateFormData("endDate", e.target.value)} className="bg-background" /></div>
                    <div className="col-span-1 md:col-span-2 space-y-2"><Label>Flexibility</Label>
                      <Select value={formData.flexibility} onValueChange={(v) => updateFormData("flexibility", v)}><SelectTrigger className="bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="fixed">Fixed dates</SelectItem><SelectItem value="flexible_week">±1 week</SelectItem><SelectItem value="flexible_month">±1 month</SelectItem><SelectItem value="open">Open</SelectItem></SelectContent></Select>
                    </div>
                  </div>
                </motion.div>
              )}
              {currentStep === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="font-serif text-2xl mb-6">Budget & Notes</h3>
                  <div className="space-y-6">
                    <div className="space-y-2"><Label>Budget Range *</Label>
                      <Select value={formData.budgetRange} onValueChange={(v) => updateFormData("budgetRange", v)}><SelectTrigger className="bg-background"><SelectValue /></SelectTrigger><SelectContent>{budgetRanges.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}</SelectContent></Select>
                    </div>
                    <div className="space-y-2"><Label>Special Requirements</Label><Textarea value={formData.specialRequirements} onChange={(e) => updateFormData("specialRequirements", e.target.value)} className="bg-background min-h-[120px]" /></div>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>Back</Button>
                {currentStep < 4 ? (
                  <Button onClick={nextStep} className="bg-primary text-primary-foreground hover:bg-primary/90">Continue</Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MICEPage;
