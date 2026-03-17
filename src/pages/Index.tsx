import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { Portals } from "@/components/home/Portals";
import { TrustSignals } from "@/components/home/TrustSignals";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { CTASection } from "@/components/home/CTASection";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Plan B Asia — Sovereign Mobility Architecture"
        description="Architecting sovereign mobility for founders and global citizens. Visa programs, wellness, and strategic relocation in Southeast Asia."
        schemaType="Organization"
      />
      <Hero />
      <Philosophy />
      <Portals />
      <TrustSignals />
      <ServicesGrid />
      <CTASection />
    </Layout>
  );
};

export default Index;
