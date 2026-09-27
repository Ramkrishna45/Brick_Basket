// @ts-nocheck
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Reveal from "./ui/Reveal";
import { galleryImages } from "@/lib/content";

// This grid exists to make "real-time tracking" tangible rather than
// asserted: it's the same kind of photo a client would see land in their
// app, just surfaced here as proof. Hover zoom + a lightweight lightbox
// give it the tactile, premium feel the rest of the page promises.
export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-24 lg:py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal className="max-w-xl">
          <span className="tag-mono text-[12px] uppercase text-red">From the Live Feed</span>
          <h2 className="font-display text-[34px] lg:text-[44px] mt-3 text-charcoal">
            What you&apos;d see in the app today.
          </h2>
          <p className="mt-4 text-charcoal/70">
            A sample of the daily updates clients across our active sites are
            looking at right now.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {galleryImages.map((img, i) => (
            <Reveal key={img.caption} delay={i * 0.06} className={i === 0 ? "col-span-2 row-span-2" : ""}>
              <motion.button
                onClick={() => setActive(i)}
                whileHover={{ scale: 0.98 }}
                className={`group relative w-full overflow-hidden rounded-2xl border border-charcoal/10 block ${
                  i === 0 ? "aspect-square md:aspect-auto md:h-full" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <p className="tag-mono text-[10.5px] text-paper/90">{img.caption}</p>
                  <p className="text-[12px] text-paper/70 mt-0.5">{img.site}</p>
                </div>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-3xl w-full aspect-[4/3] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[active].src}
                alt={galleryImages[active].caption}
                fill
                sizes="90vw"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-ink/90 to-transparent">
                <p className="tag-mono text-[12px] text-paper/90">{galleryImages[active].caption}</p>
                <p className="text-[13px] text-paper/70 mt-1">{galleryImages[active].site}</p>
              </div>
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-ink/60 text-paper flex items-center justify-center hover:bg-red transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
