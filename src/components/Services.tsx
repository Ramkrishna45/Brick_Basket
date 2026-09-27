// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import Reveal from "./ui/Reveal";
import { services } from "@/lib/content";

export default function Services() {
  return (
    <section id="services" className="py-24 lg:py-28 px-6 lg:px-10 bg-paperdim border-y border-charcoal/10">
      <div className="max-w-7xl mx-auto">
        <Reveal className="max-w-xl">
          <span className="tag-mono text-[12px] uppercase text-red">On the Ground</span>
          <h2 className="font-display text-[34px] lg:text-[44px] mt-3 text-charcoal">
            Real engineering, not just an app.
          </h2>
          <p className="mt-4 text-charcoal/70">The platform is the window. This is what happens behind it.</p>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <Reveal key={s.tag} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-full bg-paper border border-charcoal/10 rounded-2xl p-7 hover:shadow-xl hover:shadow-charcoal/10 hover:border-red/30 transition-shadow"
              >
                <span className="tag-mono text-[12px] text-red">{s.tag}</span>
                <h3 className="font-display text-[21px] mt-3 text-charcoal">{s.title}</h3>
                <p className="text-[14.5px] text-charcoal/70 mt-2 leading-relaxed">{s.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
