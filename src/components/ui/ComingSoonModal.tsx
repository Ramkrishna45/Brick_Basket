"use client";

import { createContext, useCallback, useContext, useEffect, useState, FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import UnderConstructionSVG from "./UnderConstructionSVG";

// ─── Utils ──────────────────────────────────────────────────────────────────

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

export function getRemainingTime(targetDate: Date) {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  }

  const secondsInMs = 1000;
  const minutesInMs = secondsInMs * 60;
  const hoursInMs = minutesInMs * 60;
  const daysInMs = hoursInMs * 24;

  const days = Math.floor(diff / daysInMs);
  const hours = Math.floor((diff % daysInMs) / hoursInMs);
  const minutes = Math.floor((diff % hoursInMs) / minutesInMs);
  const seconds = Math.floor((diff % minutesInMs) / secondsInMs);

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
}

const TARGET_DATE = new Date("2026-08-15T10:00:00");

// ─── Circular Progress ──────────────────────────────────────────────────────

export interface CircularProgressProps {
  progress: number;
  timer: string;
  content?: string;
  color?: string;
}

export const CircularProgress: FC<CircularProgressProps> = ({
  progress,
  timer,
  content,
  color = '#FF4522',
}) => {
  return (
    <div
      className="relative grid aspect-square size-[100px] sm:size-[151px] place-content-center rounded-full before:absolute before:bottom-[24px] sm:before:bottom-[44px] before:left-1/2 before:-translate-x-1/2 before:text-xs sm:before:text-2xl before:text-charcoal before:font-sans before:content-[attr(data-content)] after:flex after:aspect-square after:size-[90px] sm:after:size-[140px] after:justify-center after:rounded-full after:bg-[#fdfdfc] after:pt-6 sm:after:pt-8 after:text-xl sm:after:text-4xl after:font-display after:font-medium after:text-charcoal after:tabular-nums after:content-[attr(data-progress)]"
      style={{ background: `conic-gradient(#D7D7D7 ${progress}%, ${color} 0)` }}
      data-progress={timer}
      data-content={content}
    />
  )
}

// ─── Context ────────────────────────────────────────────────────────────────

interface ModalCtx {
  open: () => void;
}

const ModalContext = createContext<ModalCtx>({ open: () => {} });

export function useComingSoon() {
  return useContext(ModalContext);
}

// ─── Modal UI ───────────────────────────────────────────────────────────────

function ModalInner({ onClose }: { onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState(getRemainingTime(TARGET_DATE));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(getRemainingTime(TARGET_DATE));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Focus trap & ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on the timer

  return createPortal(
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{ backgroundColor: "rgba(28, 33, 38, 0.85)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="cs-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[900px] my-auto bg-[#fdfdfc] border border-charcoal/15 rounded-[2rem] shadow-2xl flex flex-col items-center px-4 py-12 sm:p-12 md:p-14 mt-auto mb-auto"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 text-charcoal/50 hover:bg-charcoal/10 hover:text-charcoal transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Text section */}
        <div className="text-center mb-8 w-full flex flex-col items-center justify-center space-y-3">
          <h1 
            id="cs-title"
            className="text-[36px] sm:text-[46px] md:text-[56px] font-display font-bold text-charcoal leading-[1.1] m-0"
          >
            Under Construction
          </h1>
          <h2 className="text-[22px] sm:text-[28px] md:text-[32px] font-sans font-medium text-red m-0">
            Coming Soon.....
          </h2>
          <p className="text-[15px] sm:text-[18px] md:text-[20px] font-sans text-charcoal/60 max-w-2xl m-0 mt-2">
            We’re working on something great — stay with us while we bring it to life.
          </p>
        </div>

        {/* SVG Graphic */}
        <div className="w-full max-w-[300px] sm:max-w-[400px] mb-8">
          <UnderConstructionSVG className="w-full h-auto drop-shadow-md" />
        </div>

        {/* Timer Section */}
        <section className="w-full mt-2">
          <div className="flex w-full flex-wrap justify-center gap-4 sm:gap-8 md:gap-10">
            <CircularProgress
              progress={100 - (Number(timeLeft.days) / 365) * 100}
              timer={timeLeft.days}
              content="Days"
              color="#FF4522"
            />
            <CircularProgress
              progress={100 - (Number(timeLeft.hours) / 24) * 100}
              timer={timeLeft.hours}
              content="Hours"
              color="#1C2126"
            />
            <CircularProgress
              progress={100 - (Number(timeLeft.minutes) / 60) * 100}
              timer={timeLeft.minutes}
              content="Minutes"
              color="#FF4522"
            />
            <CircularProgress
              progress={100 - (Number(timeLeft.seconds) / 60) * 100}
              timer={timeLeft.seconds}
              content="Seconds"
              color="#1C2126"
            />
          </div>
        </section>

        {/* Template animations */}
        <style>{`
          #clock {
              animation: clockHand 5s infinite linear;
              transform-box: fill-box;
              transform-origin: bottom;
          }
          #leftTree, #righTree {
              animation: tree 2s ease-in-out infinite alternate;
              transform-box: fill-box;
              transform-origin: bottom;
          }
          #man {
              animation: manBody 1s ease-in-out infinite alternate;
              transform-box: fill-box;
              transform-origin: bottom;
          }
          #pc-circle {
              fill: #6ace66;
              stroke-width: 4;
              animation: change-light 4s linear infinite alternate;
          }
          @keyframes clockHand {
              from { transform: rotateZ(0deg); }
              to { transform: rotateZ(-360deg); }
          }
          @keyframes manBody {
              from { transform: rotateX(0deg); }
              to { transform: rotateX(10deg); }
          }
          @keyframes tree {
              from { transform: rotateZ(10deg); }
              to { transform: rotateZ(-20deg); }
          }
          @keyframes change-light {
              0% { stroke: #cd61f8; }
              25% { stroke: #6ace66; }
              75% { stroke: #2995c0; }
              100% { stroke: #e92949; }
          }
        `}</style>
      </motion.div>
    </motion.div>,
    document.body
  );
}

// ─── Provider (wrap the whole app) ──────────────────────────────────────────

export function ComingSoonProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  return (
    <ModalContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>{visible && <ModalInner onClose={close} />}</AnimatePresence>
    </ModalContext.Provider>
  );
}
