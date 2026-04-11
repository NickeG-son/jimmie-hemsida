"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { urlFor } from "@/sanity/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GalleryImage } from "@/lib/types";
import {
  Aperture,
  ArrowLeftIcon,
  Camera,
  Timer,
  Smartphone,
  InfoIcon,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import CategoryGrid from "@/components/category-grid";
import { useIsMobile } from "@/hooks/use-mobile";
import CategoryGridMobile from "@/components/category-grid-mobile";

export default function ClientContent({
  images,
  category,
}: {
  images: GalleryImage[];
  category: string;
}) {
  const [detaildId, setDetaildId] = useState<string | null>(null);
  const detaildPhoto = images.find(
    (image: GalleryImage) => image.slug === detaildId,
  );
  const [hasOpenedPhoto, setHasOpenedPhoto] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [hideUi, setHideUi] = useState(false);
  const [showRotateIndicator, setShowRotateIndicator] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (detaildId) {
      setHasOpenedPhoto(true);
      if (isMobile && isPortrait) {
        setShowRotateIndicator(true);
        const timer = setTimeout(() => setShowRotateIndicator(false), 4000);
        return () => clearTimeout(timer);
      }
    } else {
      setShowRotateIndicator(false);
    }
  }, [detaildId, isMobile, isPortrait]);

  useEffect(() => {
    if (isMobile) {
      setHideUi(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkScreen = () => {
        setIsPortrait(window.innerHeight > window.innerWidth);
      };
      checkScreen();

      window.addEventListener("resize", checkScreen);
      return () => window.removeEventListener("resize", checkScreen);
    }
  }, []);

  return (
    <div
      className={cn(
        "relative min-h-[100dvh] w-full overflow-hidden",
        detaildId ? "" : "h-full w-full",
      )}
    >
      <div
        className={cn(
          "h-full w-full px-4 pt-8.5 pb-26 transition-opacity duration-300 lg:px-8 lg:pt-24 lg:pb-8",
          detaildId ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <h1 className="mb-4 text-center text-2xl font-bold tracking-widest uppercase lg:mb-0 lg:text-5xl">
          {category}
        </h1>

        <Link
          href="/galleri"
          className="bg-muted hover:bg-input/50 fixed top-6 left-4 z-10 flex min-h-13 w-fit min-w-13 flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-2 py-2 text-sm tracking-widest uppercase backdrop-blur-md transition-colors duration-300 hover:!no-underline lg:absolute lg:top-23 lg:left-8 lg:px-4 lg:py-4"
        >
          <ArrowLeftIcon className="size-5" />
          <span className="hidden lg:flex">Tillbaka till Galleri</span>
        </Link>
        {isMobile ? (
          <CategoryGridMobile
            images={images}
            setDetaildId={setDetaildId}
            skipAnimation={hasOpenedPhoto}
          />
        ) : (
          <CategoryGrid
            images={images}
            setDetaildId={setDetaildId}
            skipAnimation={hasOpenedPhoto}
          />
        )}
      </div>

      <AnimatePresence>
        {detaildPhoto && (
          <motion.div
            layout
            layoutId={`photo-${detaildPhoto.slug}`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black lg:absolute lg:z-0 lg:rounded-3xl lg:bg-black/20 lg:backdrop-blur-md"
          >
            {/* 
                  This is the magic wrapper!
                  On portrait mobile screens, it forces the entire UI to rotate 90 degrees 
                  and swap its width/height to fill the screen perfectly sideways!
                  On landscape or desktop, it stays normal.
                */}
            <motion.div
              initial={{
                rotate: 0,
                width: isMobile && isPortrait ? "100dvh" : "100%",
                height: isMobile && isPortrait ? "100dvw" : "100%",
              }}
              animate={{
                rotate: isMobile && isPortrait ? 90 : 0,
                width: isMobile && isPortrait ? "100dvh" : "100%",
                height: isMobile && isPortrait ? "100dvw" : "100%",
              }}
              exit={{
                rotate: 0,
                width: isMobile && isPortrait ? "100dvh" : "100%",
                height: isMobile && isPortrait ? "100dvw" : "100%",
              }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
              className="relative flex shrink-0 items-center justify-center overflow-hidden"
            >
              <Image
                src={urlFor(detaildPhoto.mainImage)
                  .width(1920)
                  .height(1080)
                  .url()}
                alt={detaildPhoto.title}
                fill
                priority
                className="z-0 object-cover"
              />

              <AnimatePresence>
                {showRotateIndicator && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center lg:hidden"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute h-16 w-16 animate-ping rounded-full bg-white/40"></div>
                        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-md">
                          <motion.div
                            animate={{ rotate: [0, -90, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: "easeInOut",
                            }}
                          >
                            <Smartphone className="size-6 text-white" />
                          </motion.div>
                        </div>
                      </div>
                      <span className="rounded-full bg-black/30 px-3 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                        Vänd telefonen
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* UI OVERLAYS - Placed INSIDE the rotated wrapper so they match orientation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="pointer-events-none absolute inset-0 z-10 flex flex-col p-4 lg:p-8"
              >
                {/* Top Bar: Close Button */}
                <div className="flex w-full flex-col justify-start gap-4 lg:absolute lg:top-23 lg:left-8 lg:flex-row">
                  <Button
                    variant="ghost"
                    onClick={() => setDetaildId(null)}
                    className="pointer-events-auto size-13 cursor-pointer rounded-full bg-black/30 p-0 text-sm tracking-widest text-white uppercase backdrop-blur-md hover:bg-black/60 hover:text-white lg:w-fit lg:px-6 lg:py-6"
                  >
                    <ArrowLeftIcon className="size-5" />
                    <span className="hidden lg:flex">Tillbaka</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setHideUi(!hideUi)}
                    className="pointer-events-auto size-13 cursor-pointer rounded-full bg-black/30 p-0 text-sm tracking-widest text-white uppercase backdrop-blur-md hover:bg-black/60 hover:text-white"
                  >
                    {hideUi ? (
                      <InfoIcon className="size-5" />
                    ) : (
                      <EyeOff className="size-5" />
                    )}
                  </Button>
                </div>

                <div className="flex-1" />

                {/* Bottom / Right Layout */}
                <AnimatePresence>
                  {!hideUi && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="pointer-events-auto absolute top-4 right-4 flex w-fit flex-col items-start gap-4 lg:top-28 lg:right-12 lg:bottom-12 lg:w-[400px] lg:items-stretch lg:justify-start lg:gap-8"
                      >
                        {/* Text Box */}
                        <div className="flex w-full flex-col rounded-3xl bg-black/40 p-6 text-white backdrop-blur-md lg:flex-1 lg:p-10">
                          <h1 className="text-sm font-bold tracking-widest uppercase lg:mt-4 lg:text-3xl">
                            {detaildPhoto.title || detaildPhoto.slug}
                          </h1>
                          {detaildPhoto.description && (
                            <p className="mt-4 text-sm leading-relaxed text-white/80 lg:text-base">
                              {detaildPhoto.description}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        className="absolute bottom-4 left-1/2 flex w-fit -translate-x-1/2 flex-wrap gap-4 rounded-3xl bg-black/40 p-2 text-white backdrop-blur-md empty:hidden"
                      >
                        {detaildPhoto.iso && (
                          <div className="flex items-center gap-3 font-medium">
                            <Camera className="size-5 text-white/50" /> ISO{" "}
                            {detaildPhoto.iso}
                          </div>
                        )}
                        {detaildPhoto.aperture && (
                          <div className="flex items-center gap-3 font-medium">
                            <Aperture className="size-5 text-white/50" />{" "}
                            {detaildPhoto.aperture}
                          </div>
                        )}
                        {detaildPhoto.shutterSpeed && (
                          <div className="flex items-center gap-3 font-medium">
                            <Timer className="size-5 text-white/50" />{" "}
                            {detaildPhoto.shutterSpeed}
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
