import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Shield, FileCheck, Wallet } from "lucide-react";
import logoDark from "@/assets/Dark_Seffaf.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16">
          <img src={logoDark} alt="Plan B Asia" className="h-10" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#programs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Programs</a>
            <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Get Started <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="container max-w-4xl text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-wider uppercase rounded-full bg-secondary/20 text-secondary">
            Atropox OÜ — Expat Mobility OS
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            Your Plan B<br />
            <span className="text-secondary">Starts in Asia</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Holistic relocation, visa management, compliance monitoring, and fintech payments — all in one platform built for digital nomads, expats, and global citizens.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              Explore Programs <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Book a Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="services" className="py-20 bg-card">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            The Expat Mobility OS
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
            Everything you need to relocate, stay compliant, and thrive abroad.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Globe, title: "Visa Programs", desc: "DTV, Elite, Wellness, MICE, Retirement — expert guidance for every pathway." },
              { icon: Shield, title: "Compliance Monitoring", desc: "Automated 90-day alerts, entry/exit tracking, and document verification." },
              { icon: FileCheck, title: "Document Management", desc: "Secure cloud storage with role-based access for all your critical files." },
              { icon: Wallet, title: "Fintech Payments", desc: "Seamless Stripe integration with multi-currency support (THB, TRY, USD, EUR)." },
            ].map((feature) => (
              <div key={feature.title} className="group p-6 rounded-lg border bg-background hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Visa Programs
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
            Choose the program that fits your lifestyle and goals.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Digital Nomad (DTV)", desc: "5-year multi-entry visa for remote workers and freelancers.", tag: "Most Popular" },
              { name: "Thailand Elite", desc: "Premium long-stay visa with VIP airport services and government concierge.", tag: "Premium" },
              { name: "Wellness Visa", desc: "For those seeking medical or wellness-focused relocation.", tag: "New" },
            ].map((program) => (
              <div key={program.name} className="relative p-6 rounded-lg border bg-card hover:border-secondary/50 transition-colors">
                <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">
                  {program.tag}
                </span>
                <h3 className="text-lg font-semibold mb-2 pr-16">{program.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{program.desc}</p>
                <Button variant="outline" size="sm">Learn More</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-primary-foreground">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoDark} alt="Plan B Asia" className="h-8 brightness-200" />
            <span className="text-sm opacity-70">© {new Date().getFullYear()} Atropox OÜ. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm opacity-70">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
