"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import { ReactNode } from "react";

// Every scroll reveal on the page routes through this one component so the
// timing/easing feels consistent. `useReducedMotion` collapses it to an
// instant fade for anyone with that OS preference set, per the quality
// floor in the design brief.
export default function Reveal({
  children,
  delay = 0,
  y = 18,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const shouldReduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduce ? 0.01 : 0.7, delay, ease: [0.16, 0.8, 0.28, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
