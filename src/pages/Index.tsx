import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Formations } from "@/components/Formations";
import { WhyUs } from "@/components/WhyUs";
import { Realisations } from "@/components/Realisations";
import { News } from "@/components/News";
import { Gallery } from "@/components/Gallery";
import { TestimonialsPartners } from "@/components/TestimonialsPartners";
import { CtaFees } from "@/components/CtaFees";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Formations />
        <WhyUs />
        <Realisations />
        <News />
        <Gallery />
        <TestimonialsPartners />
        <CtaFees />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
