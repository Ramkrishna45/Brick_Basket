// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Reveal from "./ui/Reveal";
import { pricingPlans } from "@/lib/content";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center max-w-xl mx-auto">
          <span className="tag-mono text-[12px] uppercase text-red">Packages</span>
          <h2 className="font-display text-[34px] lg:text-[44px] mt-3 text-charcoal">
            One rate, quoted upfront.
          </h2>
          <p className="mt-4 text-charcoal/70">
            Priced per square foot. No hidden escalation clauses - what&apos;s in the BOQ is
            what you pay for.
          </p>
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-3 gap-7 items-start">
          {pricingPlans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`h-full relative rounded-2xl p-8 ${
                  plan.highlight
                    ? "bg-ink text-paper shadow-2xl shadow-charcoal/30 lg:-translate-y-4"
                    : "bg-paperdim border border-charcoal/10"
                }`}
              >
                {plan.badge && (
                  <span className="tag-mono absolute -top-3 left-8 bg-red text-paper text-[11px] uppercase px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <h3 className={`font-display text-[24px] ${plan.highlight ? "mt-2" : ""} ${plan.highlight ? "text-paper" : "text-charcoal"}`}>
                  {plan.name}
                </h3>
                <p className={`text-[14px] mt-1 ${plan.highlight ? "text-paper/60" : "text-charcoal/60"}`}>
                  {plan.tagline}
                </p>
                <p className={`font-mono text-[38px] font-semibold mt-6 ${plan.highlight ? "text-paper" : "text-charcoal"}`}>
                  ₹{plan.rate}
                  <span className={`text-[15px] font-normal ${plan.highlight ? "text-paper/50" : "text-charcoal/50"}`}>
                    /sq.ft
                  </span>
                </p>
                <ul className={`mt-7 space-y-3 text-[14.5px] ${plan.highlight ? "text-paper/80" : "text-charcoal/75"}`}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check size={16} className="text-red shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-8 block text-center font-semibold rounded-full py-3 transition-colors ${
                    plan.highlight
                      ? "bg-red hover:bg-red-dark text-paper"
                      : "border border-charcoal/25 hover:border-charcoal text-charcoal"
                  }`}
                >
                  Get a Quote
                </a>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center text-[13px] text-charcoal/50 mt-8">
          Rates cover core construction (structure to finish). Land, approvals, and
          interior furnishing quoted separately.
        </Reveal>
      </div>
    </section>
  );
}
