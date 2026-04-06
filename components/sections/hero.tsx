"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { HeroSlide } from "@/lib/types";

export default function HeroSection({ slides }: { slides: HeroSlide[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const index = Math.min(
        Math.floor(progress * slides.length),
        slides.length - 1,
      );
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress, slides.length]);

  useEffect(() => {
    // Enable native smooth scroll-snapping on the HTML element only when Hero is mounted
    document.documentElement.classList.add("snap-y", "snap-mandatory");
    return () => {
      document.documentElement.classList.remove("snap-y", "snap-mandatory");
    };
  }, []);

  if (!slides.length) return null;

  const slide = slides[activeIndex];

  return (
    <div
      ref={containerRef}
      style={{ height: `${slides.length * 100}dvh` }}
      className="relative w-full"
    >
      {/* Invisible snap points to force scrolling to firmly stop at EACH slide one-by-one */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-0 flex flex-col">
        {slides.map((s) => (
          <div
            key={s._id}
            className="h-[100dvh] w-full snap-start snap-always"
          />
        ))}
      </div>

      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        {/* All images stacked — cross-fade by animating opacity only */}
        {slides.map((s, i) => (
          <motion.div
            key={s._id}
            className="absolute inset-0"
            // z-index: active image is always on top so it fades IN over the old
            style={{ zIndex: i === activeIndex ? 2 : 1 }}
            animate={{ opacity: i === activeIndex ? 1 : 0 }}
            // initial={false} prevents the first image from also animating in on mount
            initial={false}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <Image
              src={s.heroImage}
              alt={s.category.title}
              fill
              priority={i === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
          </motion.div>
        ))}

        {/* Text overlay — separate AnimatePresence, slides up with each change */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="pointer-events-auto absolute right-0 bottom-16 left-0 p-10 md:p-20 lg:bottom-0"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              {/*   <p className="mb-3 text-xs font-semibold tracking-[0.4em] text-white/60 uppercase">
                Portfolio
              </p> */}
              <h2 className="mb-4 text-5xl font-bold tracking-widest text-white uppercase md:text-7xl">
                {slide.category.title}
              </h2>
              {slide.category.description && (
                <p className="mb-8 max-w-md text-base text-white/80 md:text-lg">
                  {slide.category.description}
                </p>
              )}
              <Link
                href={`/galleri/${slide.category.slug}`}
                className="inline-flex items-center gap-3 border border-white px-8 py-3 text-sm font-semibold tracking-[0.2em] text-white uppercase transition-all duration-300 hover:bg-white hover:text-black"
              >
                {slide.buttonText || "Se Portfolio"} <span>→</span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide indicators */}
        <div className="absolute top-1/2 right-8 z-10 flex -translate-y-1/2 flex-col gap-3">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-[2px] transition-all duration-500 ${
                i === activeIndex ? "w-10 bg-white" : "w-4 bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/50"
          animate={{ opacity: activeIndex === 0 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-xs tracking-widest uppercase">Scrolla ner</span>
          <motion.div
            className="h-8 w-[1px] bg-white/40"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
