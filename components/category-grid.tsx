import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import { GalleryImage } from "@/lib/types";
import { ArrowUp, LayoutGrid, MailIcon, Maximize, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { flushSync } from "react-dom";

const variantItem = {
  hidden: { opacity: 0, y: 40 },
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
  const [layout, setLayout] = useState("grid");
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showToolTip, setShowToolTip] = useState<string>();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShowScrollUp(true);
      } else {
        setShowScrollUp(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col gap-4 pt-4">
      <Button
        variant="outline"
        size="icon"
        className="bg-muted ml-auto size-13 cursor-pointer lg:absolute lg:top-23 lg:right-8"
        onClick={() => {
          const imagesElems = document.querySelectorAll("[data-photo-slug]");
          let targetSlug: string | null = null;
          let targetOffset = 0;

          // Anchor to the first visible item near the top
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

              const scrollOpts: any = {
                top: absoluteTop - targetOffset,
                behavior: "instant",
              };
              window.scrollTo(scrollOpts);
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
      </Button>
      <AnimatePresence>
        {showScrollUp && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="bg-muted hover:bg-input/50 fixed right-6 bottom-8 z-10 ml-auto flex size-13 cursor-pointer items-center justify-center rounded-full transition-colors duration-300"
            onClick={() => {
              if (showScrollUp) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <motion.span
              key="grid"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <ArrowUp className="size-6" />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        variants={{
          visible: {
            transition: {
              duration: 0.4,
              delayChildren: 0.1,
              staggerChildren: 0.1,
            },
          },
        }}
        initial={skipAnimation ? "visible" : "hidden"}
        animate="visible"
        className={`grid gap-4 lg:gap-8 ${layout === "list" ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"}`}
      >
        {images.map((image: GalleryImage, index: number) => (
          <motion.div
            layout
            layoutId={`photo-${image.slug}`}
            key={image._id}
            data-photo-slug={image.slug}
            variants={variantItem}
            className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-4xl"
            onClick={() => setDetaildId(image.slug)}
          >
            <Image
              src={urlFor(image.mainImage).width(1920).height(1080).url()}
              alt={image.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 6 ? true : false}
              className="object-cover transition-all duration-300 group-hover:scale-105"
            />
            <Maximize className="absolute top-4 right-4 size-10 rounded-full bg-black/20 p-2 text-white backdrop-blur-md" />

            <Link
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setShowToolTip(image.slug)}
              onMouseLeave={() => setShowToolTip("")}
              className="absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full bg-black/20 p-2 text-white backdrop-blur-md"
              href={`/kontakt?ref=${image.referenceId}`}
            >
              <MailIcon />
            </Link>
            <AnimatePresence>
              {showToolTip === image.slug && (
                <motion.span
                  layout
                  key="tooltip"
                  className="pointer-events-none absolute right-4 bottom-4 flex items-center justify-center rounded-full bg-black/20 px-3 text-xs whitespace-nowrap text-white backdrop-blur-md"
                  style={{ height: 40 }}
                  initial={{ opacity: 0, width: 40, translateX: 0 }}
                  animate={{ opacity: 1, width: "auto", translateX: -45 }}
                  exit={{ opacity: 0, width: 40, translateX: 0 }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.3 } }}
                    exit={{ opacity: 0, transition: { duration: 0 } }}
                  >
                    Kontakta mig om detta fotot
                  </motion.span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
