"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SERVICES_LIST } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
};

export default function ServicesPage() {
  return (
    <div className="pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-amber-600/20 text-amber-300 border-amber-600/30">Our Services</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything You Need to Build Right
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            From blueprint to handover, we manage every aspect of your home construction with
            professionalism, transparency, and care.
          </p>
        </div>
      </div>

      {/* Services */}
      <section className="py-16 px-4 sm:px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SERVICES_LIST.map((service, i) => (
              <motion.div
                key={service.id}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="group flex gap-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-amber-300 hover:shadow-md transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 group-hover:bg-amber-100 transition-colors flex-shrink-0">
                  <service.lucideIcon className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{service.title}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">{service.description}</p>
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Includes</div>
                    <ul className="space-y-1.5">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-lg">
                      <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">Ideal for: </span>
                      <span className="text-xs text-amber-600 dark:text-amber-500">{service.idealFor}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Ready to get started?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Get a free consultation and let us help you plan your perfect home.
          </p>
          <Button render={<Link href="/enquiry" />} size="lg" className="bg-amber-600 hover:bg-amber-700 gap-2">
            Get Free Consultation <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
