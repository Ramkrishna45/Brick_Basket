import Hero from "@/components/Hero";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Platform from "@/components/Platform";
import Pricing from "@/components/Pricing";
import Differentiators from "@/components/Differentiators";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <>
            <main id="top">
        <Hero />
        <Process />
        <Services />
        <Gallery />
        <Platform />
        <Pricing />
        <Differentiators />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
          </>
  );
}
