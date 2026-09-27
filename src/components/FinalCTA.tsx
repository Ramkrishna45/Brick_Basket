"use client";

import Image from "next/image";
import Reveal from "./ui/Reveal";
import { useComingSoon } from "./ui/ComingSoonModal";

export default function FinalCTA() {
  const { open: openModal } = useComingSoon();

  return (
    <section id="contact" className="relative py-24 lg:py-28 px-6 lg:px-10 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?auto=format&fit=crop&w=1600&q=70"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-red/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-red/60 to-red/70" />
      </div>

      <Reveal className="max-w-4xl mx-auto text-center relative text-paper">
        <h2 className="font-display text-[36px] lg:text-[50px] leading-tight">
          Break ground with confidence.
        </h2>
        <p className="mt-5 text-paper/90 text-[17px] max-w-xl mx-auto">
          Talk to an engineer about your plot, your budget, and your timeline - no
          obligation, and no pressure. We&apos;ll walk you through the app on the same call.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <button
            onClick={openModal}
            className="bg-ink hover:bg-charcoal text-paper font-semibold px-8 py-4 rounded-full transition-colors"
          >
            Book a Free Consultation
          </button>
          <a
            href="mailto:hello@brickbasket.in"
            className="border border-paper/50 hover:border-paper font-semibold px-8 py-4 rounded-full transition-colors"
          >
            hello@brickbasket.in
          </a>
        </div>
          +91 98765 43210 · Mon-Sat, 9am-7pm IST
      </Reveal>
    </section>
  );
}
