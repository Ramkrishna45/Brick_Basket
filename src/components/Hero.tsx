// @ts-nocheck
"use client";
import Link from "next/link";

import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedCounter from "./ui/AnimatedCounter";


const headlineLine1 = "Your home, built";
const headlineLine2 = "in the open.";

// Word-by-word stagger for the headline. Split into arrays so each word
// animates in independently - the one deliberately "loud" motion moment on
// the page; everything below settles into a quieter reveal pattern.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};
const word = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 0.8, 0.28, 1] } },
};

export default function Hero() {
  
  return (
    <section className="paper-texture pt-32 pb-20 lg:pt-40 lg:pb-28 px-6 lg:px-10 border-b border-charcoal/10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="tag-mono inline-block text-[12px] uppercase text-red bg-red/10 px-3 py-1.5 rounded-full mb-6"
          >
            Construction · Accountable by Design
          </motion.span>

          <motion.h1
            variants={container}
            initial="hidden"
            animate="show"
            className="font-display text-[42px] leading-[1.08] sm:text-[54px] lg:text-[64px] text-charcoal tracking-tight"
          >
            <span className="block flex flex-wrap gap-x-4">
              {headlineLine1.split(" ").map((w, i) => (
                <motion.span key={i} variants={word}>
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="block flex flex-wrap gap-x-4 italic text-red">
              {headlineLine2.split(" ").map((w, i) => (
                <motion.span key={i} variants={word}>
                  {w}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-[18px] lg:text-[19px] leading-relaxed text-charcoal/75 max-w-[520px]"
          >
            Brick Basket pairs licensed engineers and vetted site crews with a live
            tracking platform - so every wall, wire, and rupee is visible from your
            first enquiry to the day you get the keys.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.62 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link href="/enquiry" className="bg-red hover:bg-red-dark text-paper font-semibold px-7 py-3.5 rounded-full transition-colors">Book a Free Consultation</Link>
            <a
              href="#platform"
              className="inline-flex items-center gap-2 font-semibold text-charcoal border border-charcoal/25 hover:border-charcoal px-7 py-3.5 rounded-full transition-colors"
            >
              See a Live Site Feed <span aria-hidden>→</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-14 grid grid-cols-3 max-w-md gap-6 border-t border-charcoal/10 pt-7"
          >
            <div>
              <p className="font-mono text-[26px] font-semibold text-charcoal">
                <AnimatedCounter target={480} />
              </p>
              <p className="text-[13px] text-charcoal/60 mt-1">Homes delivered</p>
            </div>
            <div>
              <p className="font-mono text-[26px] font-semibold text-charcoal">
                <AnimatedCounter target={11} suffix=" cities" />
              </p>
              <p className="text-[13px] text-charcoal/60 mt-1">Active build sites</p>
            </div>
            <div>
              <p className="font-mono text-[26px] font-semibold text-charcoal">
                <AnimatedCounter target={4.8} decimals={1} suffix="/5" />
              </p>
              <p className="text-[13px] text-charcoal/60 mt-1">Client rating</p>
            </div>
          </motion.div>
        </div>

        {/* Hero visual: real house photo with a floating "live site feed"
            card overlapping it - the product's core promise, shown rather
            than described. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 0.8, 0.28, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[440px]">
            <div className="rounded-[1.75rem] overflow-hidden shadow-2xl shadow-charcoal/25 border border-charcoal/10 aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=900&q=80"
                alt="Modern house built by Brick Basket"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 440px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
            </div>

            {/* floating live-tracking card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 w-[230px] rounded-2xl bg-ink text-paper p-4 shadow-2xl shadow-charcoal/40 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-[10.5px] font-mono text-green-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  LIVE SITE FEED
                </span>
              </div>
              <p className="text-[12px] font-semibold leading-snug">
                Wall framing complete - 1st floor
              </p>
              <p className="text-[11px] text-paper/60 mt-1">Priya M. · Site Engineer</p>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-mono text-paper/50 mb-1">
                  <span>MILESTONE 3/6</span><span>62%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "62%" }}
                    transition={{ duration: 1.2, delay: 1 }}
                    className="h-full bg-red rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* small badge */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-6 -right-4 bg-paper rounded-xl shadow-xl border border-charcoal/10 px-4 py-3"
            >
              <p className="tag-mono text-[10px] text-charcoal/50 uppercase">Warranty</p>
              <p className="font-display text-[18px] text-charcoal leading-none mt-0.5">10 yrs</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
