// @ts-nocheck
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Reveal from "./ui/Reveal";
import { faqs } from "@/lib/content";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-28 px-6 lg:px-10 bg-paperdim border-t border-charcoal/10">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center">
          <span className="tag-mono text-[12px] uppercase text-red">Questions</span>
          <h2 className="font-display text-[34px] lg:text-[44px] mt-3 text-charcoal">
            Before you book a call.
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 0.04}>
                <div className="bg-paper border border-charcoal/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-charcoal"
                  >
                    {item.q}
                    <motion.span
                      animate={{ rotate: open ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-red shrink-0"
                    >
                      <Plus size={20} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 0.8, 0.28, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-[14.5px] text-charcoal/70 leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
