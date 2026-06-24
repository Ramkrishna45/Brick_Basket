"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.1 } }),
};

export default function PlansPage() {
  return (
    <div className="pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-amber-600/20 text-amber-300 border-amber-600/30">Transparent Pricing</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            No hidden costs. Milestone-based payments tied to construction progress.
            Pay only when stages are completed and verified.
          </p>
        </div>
      </div>

      {/* Plans */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-16">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                custom={i} variants={fadeUp} initial="hidden" animate="visible"
                className={cn(
                  "relative bg-white rounded-2xl border p-7",
                  plan.isPopular
                    ? "border-amber-500 shadow-xl shadow-amber-100 md:scale-105 md:-mt-2"
                    : "border-slate-200 hover:border-amber-300 hover:shadow-md transition-all"
                )}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-600 text-white border-0 px-4">⭐ Most Popular</Badge>
                  </div>
                )}

                <div className={cn("inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wide",
                  plan.isPopular ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                )}>
                  {plan.name}
                </div>

                <div className="mb-2">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-400 text-sm ml-1">{plan.priceUnit}</span>
                </div>
                <div className="text-sm text-slate-500 mb-1">📐 {plan.sqftRange}</div>
                <div className="text-sm text-slate-500 mb-5">⏱ Duration: {plan.duration}</div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 pb-6 border-b border-slate-100">
                  {plan.description}
                </p>

                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">What&apos;s Included</div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f.name} className="flex items-center gap-2.5 text-sm">
                      {f.included
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        : <XCircle className="h-4 w-4 text-slate-200 flex-shrink-0" />}
                      <span className={f.included ? "text-slate-700" : "text-slate-400 line-through decoration-slate-200"}>
                        {f.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg mb-6">
                  <span className="font-medium text-slate-700">Ideal for: </span>{plan.idealFor}
                </div>

                <Button render={<Link href="/enquiry" />} className={cn("w-full gap-2",
                  plan.isPopular ? "bg-amber-600 hover:bg-amber-700 text-white" : "border-slate-300 hover:border-amber-400 hover:text-amber-700"
                )} variant={plan.isPopular ? "default" : "outline"}>
                    Choose {plan.name} <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Comparison note */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center"
          >
            <h3 className="font-semibold text-slate-900 mb-2">Not sure which plan is right for you?</h3>
            <p className="text-slate-600 text-sm mb-4">
              Our team will help you choose the best plan based on your requirements, budget, and timeline.
              The consultation is completely free.
            </p>
            <Button render={<Link href="/enquiry" />} className="bg-amber-600 hover:bg-amber-700 gap-2">
              Get Free Advice <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Payment milestone info */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-3">How Milestone Payments Work</h2>
            <p className="text-slate-500">You pay as work progresses — not all at once.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { pct: "10%", stage: "Booking", desc: "Agreement signing & design" },
              { pct: "15%", stage: "Foundation", desc: "Excavation & foundation work" },
              { pct: "40%", stage: "Structure", desc: "Columns, walls & slab" },
              { pct: "35%", stage: "Finishing", desc: "MEP, plastering & handover" },
            ].map((m, i) => (
              <motion.div
                key={m.stage}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="text-center p-5 rounded-xl bg-slate-50 border border-slate-200"
              >
                <div className="text-2xl font-bold text-amber-600 mb-1">{m.pct}</div>
                <div className="font-semibold text-slate-900 text-sm mb-1">{m.stage}</div>
                <div className="text-xs text-slate-500">{m.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
