import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import { GalleryImage } from "@/lib/types";
import { ArrowUp, LayoutGrid, MailIcon, Maximize, Square } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { flushSync } from "react-dom";

const variantItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function CategoryGrid({
  images,
  setDetaildId,
  skipAnimation,
}: {
  images: GalleryImage[];
  setDetaildId: (id: string) => void;
  skipAnimation?: boolean;
}) {
  const [layout, setLayout] = useState("list");
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showToolTip, setShowToolTip] = useState(true);
  const [visibleCount, setVisibleCount] = useState(16);

  // Infinity scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        setVisibleCount((prev) => Math.min(prev + 12, images.length));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [images.length]);

  // Scroll-to-top knapp
  useEffect(() => {
    const handleScrollToggle = () => setShowScrollUp(window.scrollY > 400);
    window.addEventListener("scroll", handleScrollToggle);
    return () => window.removeEventListener("scroll", handleScrollToggle);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowToolTip(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-4 pt-4">
      {/* --- SWITCH LAYOUT BUTTON --- */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-muted fixed right-6 bottom-[95px] z-20 ml-auto flex size-14 cursor-pointer items-center justify-center rounded-full shadow-lg"
        onClick={() => {
          const imagesElems = document.querySelectorAll("[data-photo-slug]");
          let targetSlug: string | null = null;
          let targetOffset = 0;

          for (let i = 0; i < imagesElems.length; i++) {
            const el = imagesElems[i];
            const rect = el.getBoundingClientRect();
            if (rect.bottom > 120 && rect.top < window.innerHeight) {
              const attr = el.getAttribute("data-photo-slug");
              if (attr) {
                targetSlug = attr;
                targetOffset = rect.top;
                break;
              }
            }
          }

          flushSync(() => {
            setLayout((prev) => (prev === "list" ? "grid" : "list"));
          });

          if (targetSlug) {
            const newEl = document.querySelector(
              `[data-photo-slug="${targetSlug}"]`,
            );
            if (newEl) {
              const rect = newEl.getBoundingClientRect();
              const absoluteTop = window.scrollY + rect.top;
              window.scrollTo({
                top: absoluteTop - targetOffset,
                behavior: "instant",
              });
            }
          }
        }}
      >
        <AnimatePresence mode="popLayout">
          {layout === "grid" ? (
            <motion.span
              key="list"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Square className="size-6" />
            </motion.span>
          ) : (
            <motion.span
              key="grid"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <LayoutGrid className="size-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* --- SCROLL UP BUTTON --- */}
      <AnimatePresence>
        {showScrollUp && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="bg-muted fixed bottom-[95px] left-6 z-20 flex size-14 cursor-pointer items-center justify-center rounded-full shadow-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp className="size-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* --- GRID CONTAINER --- */}
      <div
        className={`grid ${layout === "list" ? "grid-cols-1 gap-6" : "grid-cols-2 gap-4"}`}
      >
        {images.slice(0, visibleCount).map((image, index) => (
          <motion.div
            layout // <--- TILLBAKA! Möjliggör mjuk växling
            layoutId={`photo-${image.slug}`} // <--- TILLBAKA! Kopplar samman elementen vid växling
            key={image._id}
            data-photo-slug={image.slug}
            variants={variantItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            transition={{
              layout: { duration: 0.4, ease: "easeInOut" }, // Specifik transition för layout-växlingen
              delay: index < 12 ? index * 0.05 : 0,
              duration: 0.3,
            }}
            className="bg-muted relative aspect-square w-full cursor-pointer overflow-hidden rounded-4xl"
            onClick={() => setDetaildId(image.slug)}
          >
            <Image
              src={urlFor(image.mainImage)
                .width(layout === "grid" ? 500 : 1000)
                .auto("format")
                .quality(layout === "grid" ? 75 : 100)
                .url()}
              alt={image.title}
              fill
              sizes="(max-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority={index < 4}
            />

            <Maximize className="absolute top-2 right-2 size-10 rounded-full bg-black/40 p-2 text-white" />

            <Link
              className="absolute right-2 bottom-2 flex size-10 items-center justify-center rounded-full bg-black/40 p-2 text-white"
              href={`/kontakt?ref=${image.referenceId}`}
              onClick={(e) => e.stopPropagation()}
            >
              <MailIcon className="size-5" />
            </Link>

            <AnimatePresence>
              {showToolTip && index === 0 && (
                <motion.span
                  layout
                  key="tooltip"
                  className="absolute right-2 bottom-2 flex items-center justify-center rounded-full bg-black/40 px-3 text-xs whitespace-nowrap text-white"
                  style={{ height: 40 }}
                  initial={{ opacity: 0, width: 40, translateX: 0 }}
                  animate={{ opacity: 1, width: "auto", translateX: -45 }}
                  exit={{ opacity: 0, width: 40, translateX: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    Kontakta mig om detta fotot
                  </motion.span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
