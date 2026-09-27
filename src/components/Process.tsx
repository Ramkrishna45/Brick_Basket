// @ts-nocheck
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { processSteps } from "@/lib/content";

// ── Scroll speed ──────────────────────────────────────────────────────────────
// Each step occupies this many vh of scrollable track.
// 60vh = noticeably faster than the previous 110vh; still readable on mobile.
const STEP_VH = 60;

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepListRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hasSeenAll, setHasSeenAll] = useState(false);
  const [showHint, setShowHint] = useState(true);
  // Tracks the section's effective height — collapses instantly when step 7 is hit
  const [sectionHeight, setSectionHeight] = useState(`${processSteps.length * STEP_VH}vh`);

  // hasSeenAll via ref so the scroll listener never goes stale
  const hasSeenAllRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Phase 1 — scroll drives the active step
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (hasSeenAllRef.current) return;

      const idx = Math.min(
        Math.floor(v * processSteps.length),
        processSteps.length - 1
      );

      setActive(idx);
      if (v > 0.02) setShowHint(false);
    });
  }, [scrollYProgress]);

  // Listen for when the section is completely scrolled out of view upwards.
  // We silently collapse it behind the user's back so there is zero layout jump!
  useEffect(() => {
    if (hasSeenAll) return;
    const onScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.bottom < 0) {
          hasSeenAllRef.current = true;
          setHasSeenAll(true);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasSeenAll]);

  // Listen for anchor link jumps to instantly collapse the section before scrolling
  useEffect(() => {
    const onNavJump = () => {
      if (!hasSeenAllRef.current) {
        hasSeenAllRef.current = true;
        setHasSeenAll(true);
      }
    };
    window.addEventListener("nav-jump", onNavJump as EventListener);
    return () => window.removeEventListener("nav-jump", onNavJump as EventListener);
  }, []);

  // When step 7 is reached, instantly shrink the section to its natural height
  // and adjust the scroll position so there's no visual jump or broken anchor links.
  useLayoutEffect(() => {
    if (hasSeenAll && sectionRef.current && sectionHeight !== "auto") {
      const el = sectionRef.current;
      const oldHeight = el.getBoundingClientRect().height;
      
      // CRITICAL: Read scroll position BEFORE modifying the DOM height.
      // If we shrink the DOM first, the browser might silently clamp scrollY!
      const currentScroll = window.scrollY;
      
      // Force it temporarily to measure the new natural height immediately
      const oldStyleHeight = el.style.height;
      el.style.height = "auto";
      const newHeight = el.getBoundingClientRect().height;
      
      const diff = oldHeight - newHeight;
      
      // If the page shrank and the user is currently scrolled past the top of this section
      // we calculate the precise layout offset and explicitly set the new scroll position.
      if (diff > 0 && currentScroll > el.offsetTop) {
        const targetY = currentScroll - diff;
        window.scrollTo({ top: targetY, behavior: "instant" });
      }
      
      // Restore inline style and update React state to persist it
      el.style.height = oldStyleHeight;
      setSectionHeight("auto");
    }
  }, [hasSeenAll, sectionHeight]);

  // Phase 2 — clicking a step (after all seen) changes the active step
  const handleStepClick = (i: number) => {
    if (!hasSeenAll) return;
    setActive(i);
  };

  // Auto-scroll the step list on mobile so the active step stays in view
  useEffect(() => {
    if (stepListRef.current) {
      const activeItem = stepListRef.current.querySelector(`[data-step="${active}"]`);
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [active]);

  const step = processSteps[active];

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative"
      style={{ height: sectionHeight }}
    >
      {/* ── Sticky viewport panel ── */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex flex-col px-4 sm:px-6 lg:px-10 py-6 lg:py-10">

        {/* ── Header ── */}
        <div className="max-w-2xl mx-auto text-center shrink-0">
          <span className="tag-mono text-[12px] uppercase text-red">How We Work</span>
          <h2 className="font-display text-[28px] sm:text-[36px] lg:text-[42px] mt-2 text-charcoal">
            Seven steps, zero surprises.
          </h2>
          <p className="mt-3 text-[14px] lg:text-[15px] text-charcoal/70 max-w-xl mx-auto leading-relaxed">
            From the first phone call to the day you get your keys - every step
            is scoped, scheduled, and visible before it happens.
          </p>
        </div>

        {/* ── Main grid ── */}
        <div className="flex-1 mt-6 max-w-6xl mx-auto w-full grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 items-start min-h-0">

          {/* Desktop photo panel */}
          <div className="hidden lg:flex flex-col h-full">
            <div className="relative flex-1 rounded-[1.75rem] overflow-hidden border border-charcoal/10 shadow-2xl shadow-charcoal/15">
              <AnimatePresence mode="sync">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 0.8, 0.28, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="45vw"
                    className="object-cover"
                    priority={active === 0}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7">
                <span className="tag-mono text-[11px] text-paper/60">
                  STEP {step.id} / {String(processSteps.length).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[24px] text-paper mt-1.5 leading-tight">
                  {step.title}
                </h3>
              </div>
            </div>
          </div>

          {/* ── Step list ── */}
          <div ref={stepListRef} className="flex flex-col justify-start overflow-y-auto min-h-0 pb-12 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* Interactive mode banner */}
            <AnimatePresence>
              {hasSeenAll && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-3"
                >
                  <div className="flex items-center gap-2 bg-red/8 border border-red/20 rounded-xl px-4 py-2.5">
                    <p className="tag-mono text-[10px] text-red uppercase tracking-wide">
                      Tap any step to explore
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {processSteps.map((s, i) => {
              const isActive = i === active;
              const isPast = i < active;

              return (
                <div
                  key={s.id}
                  data-step={i}
                  onClick={() => handleStepClick(i)}
                  className={`relative flex gap-4 lg:gap-5 ${
                    hasSeenAll ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  {/* Rail */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="flex items-center justify-center w-5 h-5">
                      {isActive ? (
                        <motion.span
                          layoutId="active-dot"
                          className="w-[18px] h-[18px] rounded-full bg-red block border-[3px] border-red/20"
                        />
                      ) : isPast ? (
                        <span className="w-3 h-3 rounded-full bg-red block" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border-2 border-charcoal/25 bg-paper block" />
                      )}
                    </div>
                    {i < processSteps.length - 1 && (
                      <span
                        className={`w-px flex-1 transition-colors duration-500 ${
                          isPast ? "bg-red/60" : "bg-charcoal/15"
                        }`}
                        style={{ minHeight: 20 }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 pb-4 lg:pb-5 rounded-lg transition-colors duration-150 ${
                      hasSeenAll && !isActive
                        ? "hover:bg-charcoal/4 px-2 -mx-2"
                        : ""
                    }`}
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span
                        className={`tag-mono text-[11px] transition-colors duration-300 ${
                          isActive ? "text-red" : "text-charcoal/35"
                        }`}
                      >
                        {s.id}
                      </span>
                      <h3
                        className={`font-display transition-all duration-300 ${
                          isActive
                            ? "text-[19px] lg:text-[21px] text-charcoal"
                            : "text-[17px] lg:text-[19px] text-charcoal/45"
                        }`}
                      >
                        {s.title}
                      </h3>
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 0.8, 0.28, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-[13.5px] lg:text-[14.5px] text-charcoal/65 leading-relaxed mt-2 max-w-md">
                            {s.body}
                          </p>
                          {/* Mobile image */}
                          <div className="lg:hidden relative mt-3 aspect-[21/9] sm:aspect-[16/9] rounded-xl overflow-hidden border border-charcoal/10 shrink-0">
                            <Image
                              src={s.image}
                              alt={s.title}
                              fill
                              sizes="90vw"
                              className="object-cover"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="shrink-0 max-w-6xl mx-auto w-full mt-4">
          <div className="flex items-center gap-3">
            <span className="tag-mono text-[10px] text-charcoal/40 shrink-0">
              {String(active + 1).padStart(2, "0")} / {String(processSteps.length).padStart(2, "0")}
            </span>
            <div className="flex-1 flex gap-1">
              {processSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-[3px] flex-1 rounded-full transition-colors duration-400 ${
                    i <= active ? "bg-red" : "bg-charcoal/12"
                  }`}
                />
              ))}
            </div>

            {/* Hint: scroll during phase 1, interactive in phase 2 */}
            <AnimatePresence mode="wait">
              {!hasSeenAll && showHint && (
                <motion.span
                  key="scroll-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="tag-mono text-[10px] text-charcoal/35 shrink-0 flex items-center gap-1"
                >
                  scroll
                  <motion.span
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    ↓
                  </motion.span>
                </motion.span>
              )}
              {hasSeenAll && (
                <motion.span
                  key="interactive-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="tag-mono text-[10px] text-red/60 shrink-0"
                >
                  interactive ✓
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
