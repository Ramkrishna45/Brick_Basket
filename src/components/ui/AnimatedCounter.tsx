"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

export default function AnimatedCounter({
  target,
  decimals = 0,
  suffix = "",
  prefix = "",
  className = "",
}: {
  target: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 3.5,
      ease: [0, 1, 0.2, 1], // Aggressive deceleration: starts extremely fast, visibly slows down at the end
      onUpdate(v) {
        setValue(v);
      }
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}
