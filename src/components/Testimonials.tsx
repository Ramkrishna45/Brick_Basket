// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import Reveal from "./ui/Reveal";
import { testimonials } from "@/lib/content";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 lg:py-32 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal className="max-w-xl">
          <span className="tag-mono text-[12px] uppercase text-red">Client Voices</span>
          <h2 className="font-display text-[34px] lg:text-[44px] mt-3 text-charcoal">
            Peace of mind, mostly.
          </h2>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-full flex flex-col bg-paperdim border border-charcoal/10 rounded-2xl p-6 hover:border-red/30 hover:shadow-xl hover:shadow-charcoal/10 transition-shadow"
              >
                <p className="text-[14.5px] text-charcoal/80 leading-relaxed flex-1">&quot;{t.quote}&quot;</p>
                <div className="mt-5 pt-4 border-t border-charcoal/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red/15 text-red font-mono text-[12px] font-semibold flex items-center justify-center shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[14px] text-charcoal">{t.name}</p>
                    <p className="tag-mono text-[11.5px] text-charcoal/50">{t.tag}</p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
