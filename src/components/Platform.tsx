"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Camera, FolderLock, IndianRupee, Bell } from "lucide-react";
import Reveal from "./ui/Reveal";
import { useRef } from "react";

const features = [
  {
    icon: Camera,
    title: "Real-Time Site Feed",
    body: "Daily geo-tagged photos, short site videos, and written engineer remarks - timestamped and delivered whether you're two streets or two continents away.",
  },
  {
    icon: FolderLock,
    title: "Digital Repository",
    body: "Quotes, architectural drawings, material receipts, and appliance warranties - stored in one secure vault you'll still have use for years after handover.",
  },
  {
    icon: IndianRupee,
    title: "Milestone Payments",
    body: "Payments are tied to verified construction stages, not the calendar. You approve the site update; only then does the next tranche become due.",
  },
];

export default function Platform() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const isPhoneInView = useInView(phoneRef, { once: true, margin: "-10%" });

  return (
    <section id="platform" className="py-24 lg:py-32 px-6 lg:px-10 bg-ink text-paper relative overflow-hidden">
      {/* Blueprint grid texture */}
      <div className="blueprint-grid absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative grid lg:grid-cols-[1fr_0.85fr] gap-16 items-start">

        {/* ── Left column: copy + feature cards ── */}
        <div>
          <Reveal className="max-w-xl">
            <span className="tag-mono text-[12px] uppercase text-red">The Platform</span>
            <h2 className="font-display text-[34px] lg:text-[44px] mt-3">
              The site, in your pocket.
            </h2>
            {/* Tagline */}
            <p className="mt-3 tag-mono text-[13px] text-paper/50 uppercase tracking-widest">
              Built for Peace of Mind
            </p>
            <p className="mt-4 text-paper/70">
              Everything a construction manager would tell you, minus the phone tag.
            </p>
          </Reveal>

          {/* Feature cards */}
          <div className="mt-14 space-y-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.12}>
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="group flex gap-5 bg-white/[0.04] border border-paper/10 rounded-2xl p-6 cursor-default
                             hover:bg-white/[0.08] hover:border-paper/20 transition-colors duration-200"
                >
                  {/* Icon container - lights up on hover */}
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-ink border border-paper/15 flex items-center justify-center
                                  group-hover:border-red/60 group-hover:bg-red/10 transition-colors duration-200">
                    <f.icon size={20} className="text-paper/60 group-hover:text-red transition-colors duration-200" />
                  </div>

                  <div>
                    <h3 className="font-display text-[20px]">{f.title}</h3>
                    <p className="text-[14.5px] text-paper/60 mt-2 leading-relaxed">{f.body}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Trust strip */}
          <Reveal className="mt-10 pt-8 border-t border-paper/10 flex flex-wrap items-center gap-6">
            {[
              { label: "ISO 9001 Certified" },
              { label: "End-to-end encrypted" },
              { label: "Available 24 / 7" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2">
                <span className="tag-mono text-[11px] text-paper/50 uppercase">{t.label}</span>
              </div>
            ))}
          </Reveal>
        </div>

        {/* - Right column: phone mockup - */}
        <Reveal className="hidden lg:block sticky top-28">
          <div ref={phoneRef} className="relative w-[300px] mx-auto">

            {/* Subtle drop shadow ring to lift the phone off the dark bg */}
            <div className="absolute -inset-4 rounded-[3rem] border border-paper/5" />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-[2.2rem] bg-charcoal p-3 shadow-2xl shadow-black/60 border border-white/10"
            >
              {/* Phone screen */}
              <div className="rounded-[1.6rem] overflow-hidden bg-paper">

                {/* Status bar */}
                <div className="flex items-center justify-between px-5 pt-4 pb-2">
                  <span className="font-mono text-[11px] text-charcoal/50">9:41</span>
                  <span className="flex items-center gap-1.5 text-[11px] font-mono text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse2" /> LIVE
                  </span>
                </div>

                {/* Site photo */}
                <div className="mx-4 mt-2 rounded-xl overflow-hidden relative aspect-[4/3]">
                  <Image
                    src="https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=700&q=80"
                    alt="Live construction site update"
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-2 left-2 tag-mono text-[10px] text-paper bg-black/50 px-2 py-0.5 rounded">
                    STAGE 3 · EXCAVATION
                  </span>
                </div>

                {/* Animated notification badge */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={isPhoneInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="mx-4 mt-3 flex items-start gap-2.5 p-3 rounded-xl bg-ink/90 border border-paper/10"
                >
                  <div className="w-7 h-7 shrink-0 rounded-lg bg-red/20 flex items-center justify-center mt-0.5">
                    <Bell size={13} className="text-red" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-paper leading-snug">
                      Stage 3 signed off by Engineer
                    </p>
                    <p className="text-[10px] text-paper/50 mt-0.5">Tap to review &amp; approve payment</p>
                  </div>
                </motion.div>

                {/* Engineer note */}
                <div className="mx-4 mt-2 mb-2 p-3 rounded-lg bg-white/70 border border-charcoal/10">
                  <p className="text-[12px] font-semibold text-charcoal">Site Engineer - Priya M.</p>
                  <p className="text-[12px] text-charcoal/70 mt-1 leading-snug">
                    Excavation complete to design depth. Soil compaction test passed. Ready for footing layout.
                  </p>
                </div>

                {/* Milestone progress */}
                <div className="mx-4 mb-5">
                  <div className="flex justify-between text-[11px] font-mono text-charcoal/60 mb-1">
                    <span>MILESTONE 1 / 6</span><span>18%</span>
                  </div>
                  <div className="h-2 rounded-full bg-charcoal/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isPhoneInView ? { width: "18%" } : {}}
                      transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 0.8, 0.28, 1] }}
                      className="h-full bg-red rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating stat badge */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={isPhoneInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="absolute -right-14 top-24 bg-paper border border-charcoal/10 rounded-xl px-4 py-3 shadow-xl"
            >
              <p className="tag-mono text-[10px] text-charcoal/50 uppercase">Warranty</p>
              <p className="font-display text-[20px] text-charcoal leading-none mt-0.5">10 yrs</p>
            </motion.div>

            {/* Floating update count */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={isPhoneInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 1.25 }}
              className="absolute -left-14 bottom-28 bg-ink border border-paper/10 rounded-xl px-4 py-3 shadow-xl"
            >
              <p className="tag-mono text-[10px] text-paper/50 uppercase">Updates today</p>
              <p className="font-display text-[20px] text-paper leading-none mt-0.5">12 new</p>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
