// @ts-nocheck
"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "./ui/Reveal";
import { differentiators } from "@/lib/content";
import { X, Check } from "lucide-react";

export default function Differentiators() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <section id="why-us" className="py-24 lg:py-28 px-6 lg:px-10 bg-paperdim border-y border-charcoal/10">
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="tag-mono text-[12px] uppercase text-red">Why Brick Basket</span>
          <h2 className="font-display text-[34px] lg:text-[44px] mt-3 text-charcoal">
            Old Way vs. Our Way.
          </h2>
          <p className="mt-4 text-charcoal/65 text-[16px]">
            Hover any row to see exactly what we retired - and what replaced it.
          </p>
        </Reveal>

        {/* ── Comparison block ── */}
        <div className="mt-14">

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto_1fr]">
            <motion.div
              initial={{ clipPath: "inset(0 0 0 100%)" }}
              whileInView={{ clipPath: "inset(0 0 0 0%)" }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.55, ease: [0.16, 0.8, 0.28, 1] }}
              className="bg-paper border border-charcoal/12 border-b-0 rounded-t-2xl px-5 py-4 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-charcoal/10 border border-charcoal/15 flex items-center justify-center shrink-0">
                <X size={15} className="text-charcoal/50" />
              </div>
              <div>
                <p className="tag-mono text-[11px] uppercase text-charcoal/45 tracking-wide">Typical Contractor</p>
                <p className="font-display text-[17px] text-charcoal mt-0.5">The Traditional Way</p>
              </div>
            </motion.div>

            {/* VS badge */}
            <div className="flex items-end justify-center px-4 pb-1">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                className="w-10 h-10 rounded-full bg-ink border-2 border-red flex items-center justify-center shadow-md"
              >
                <span className="tag-mono text-[10px] text-red font-bold">VS</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.55, ease: [0.16, 0.8, 0.28, 1] }}
              className="bg-ink border border-paper/10 border-b-0 rounded-t-2xl px-5 py-4 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-red/20 border border-red/30 flex items-center justify-center shrink-0">
                <Check size={15} className="text-red" />
              </div>
              <div>
                <p className="tag-mono text-[11px] uppercase text-paper/45 tracking-wide">Brick Basket</p>
                <p className="font-display text-[17px] text-paper mt-0.5">The Brick Basket Way</p>
              </div>
            </motion.div>
          </div>

          {/* Rows */}
          {differentiators.map((row, i) => (
            <ComparisonRow
              key={i}
              index={i}
              old={row.old}
              now={row.now}
              isLast={i === differentiators.length - 1}
              isHovered={hoveredRow === i}
              isAnyHovered={hoveredRow !== null}
              onHover={() => setHoveredRow(i)}
              onLeave={() => setHoveredRow(null)}
            />
          ))}

          {/* Bottom cap */}
          <div className="grid grid-cols-[1fr_auto_1fr]">
            <div className="bg-paper border border-charcoal/12 border-t-0 rounded-b-2xl h-3" />
            <div className="w-[72px]" />
            <div className="bg-ink border border-paper/10 border-t-0 rounded-b-2xl h-3" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Individual comparison row ───────────────────────────────────────────────

function ComparisonRow({
  index,
  old,
  now,
  isLast,
  isHovered,
  isAnyHovered,
  onHover,
  onLeave,
}: {
  index: number;
  old: string;
  now: string;
  isLast: boolean;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, margin: "-8%" });
  const delay = index * 0.08;

  return (
    <motion.div
      ref={rowRef}
      className="grid grid-cols-[1fr_auto_1fr]"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      animate={{ 
        filter: isAnyHovered && !isHovered ? "blur(2.5px)" : "blur(0px)",
        opacity: 1 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >

      {/* - Traditional cell - strikethrough on hover - */}
      <motion.div
        initial={{ clipPath: "inset(0 0 0 100%)" }}
        animate={isInView ? { clipPath: "inset(0 0 0 0%)" } : {}}
        transition={{ duration: 0.55, delay, ease: [0.16, 0.8, 0.28, 1] }}
        className={`bg-paper border-x border-charcoal/12 px-5 py-5 flex items-start gap-3.5 ${
          !isLast ? "border-b border-charcoal/10" : ""
        }`}
      >
        {/* ✗ icon fades out slightly on hover */}
        <motion.div
          animate={{ opacity: isHovered ? 0.3 : 1 }}
          transition={{ duration: 0.25 }}
          className="w-5 h-5 rounded-full bg-charcoal/10 border border-charcoal/20 flex items-center justify-center shrink-0 mt-0.5"
        >
          <X size={10} className="text-charcoal/40" />
        </motion.div>

        {/* Text + animated strikethrough line */}
        <div className="relative flex-1">
          <motion.p
            animate={{ opacity: isHovered ? 0.45 : 0.7 }}
            transition={{ duration: 0.25 }}
            className="text-[14.5px] text-charcoal leading-snug"
          >
            {old}
          </motion.p>

          {/* Strikethrough line - draws left to right on hover */}
          <motion.span
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full bg-charcoal/55 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.38, ease: [0.16, 0.8, 0.28, 1] }}
          />
        </div>
      </motion.div>

      {/* Center connector */}
      <div className="flex items-stretch justify-center w-[72px]">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.4, delay: delay + 0.2, ease: "easeOut" }}
          style={{ originY: 0 }}
          className="w-px my-0 bg-charcoal/15"
        />
      </div>

      {/* - Brick Basket cell - lifts on hover - */}
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
        transition={{ duration: 0.55, delay: delay + 0.08, ease: [0.16, 0.8, 0.28, 1] }}
        className={`relative h-full ${isHovered ? "z-10" : ""}`}
      >
        {/* Inner wrapper that holds the background and physically lifts */}
        <motion.div
          className={`bg-ink border-x border-paper/10 px-5 py-5 flex items-start gap-3.5 w-full h-full ${
            !isLast ? "border-b border-paper/[0.08]" : ""
          }`}
          animate={
            isHovered
              ? { y: -7, boxShadow: "0 18px 44px rgba(28,33,38,0.45)", borderRadius: "12px", scale: 1.02 }
              : { y: 0, boxShadow: "0 0px 0px rgba(28,33,38,0)", borderRadius: "0px", scale: 1 }
          }
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
        >
          {/* ✓ icon scales up on hover */}
          <motion.div
            animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className="w-5 h-5 rounded-full bg-red/15 border border-red/25 flex items-center justify-center shrink-0 mt-0.5"
          >
            <Check size={10} className="text-red" />
          </motion.div>

          <motion.p
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
            className="text-[14.5px] text-paper leading-snug"
          >
            {now}
          </motion.p>
        </motion.div>
      </motion.div>

    </motion.div>
  );
}
