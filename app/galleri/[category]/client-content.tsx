"use client";

import GalleryCarousel from "@/components/gallery-carousel";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { urlFor } from "@/sanity/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GalleryImage } from "@/lib/types";
import {
  Aperture,
  ApertureIcon,
  ArrowLeftIcon,
  Camera,
  CameraIcon,
  Timer,
} from "lucide-react";
import Link from "next/link";
import CategoryGrid from "@/components/category-grid";

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
  const [hasLoaded, setHasLoaded] = useState(false); // Track initial load
  const [screenState, setScreenState] = useState({
    isPortrait: false,
    isMobile: false,
  });
  const [hideUi, setHideUi] = useState(false);

  useEffect(() => {
    setHasLoaded(true);

    if (typeof window !== "undefined") {
      const checkScreen = () => {
        setScreenState({
          isPortrait: window.innerHeight > window.innerWidth,
          isMobile: window.innerWidth < 1024,
        });
      };
      checkScreen();

      window.addEventListener("resize", checkScreen);
      return () => window.removeEventListener("resize", checkScreen);
    }
  }, []);

  console.log(detaildPhoto);
  console.log(images);

  return (
    <div
      className={cn(
        "relative min-h-[100dvh] w-full overflow-hidden",
        detaildId ? "" : "h-full w-full px-4 py-24 lg:px-8",
      )}
    >
      {!detaildId ? (
        <>
          <h1 className="mb-4 text-center text-2xl font-bold tracking-widest uppercase lg:text-5xl">
            {category}
          </h1>
          <div className="bg-muted fixed top-6 left-6 z-10 flex w-fit min-w-13 flex-shrink-0 cursor-pointer items-center justify-center rounded-full px-2 py-2 backdrop-blur-md lg:absolute lg:top-22 lg:left-8 lg:bg-black/20 lg:px-4 lg:py-3">
            <Link
              href="/galleri"
              className="cursor-pointer hover:!no-underline"
            >
              <Button
                variant="link"
                className="text-foreground flex cursor-pointer items-center gap-1 px-0 text-sm tracking-widest uppercase transition-colors"
              >
                <ArrowLeftIcon className="size-5" />
                <span className="hidden lg:flex">Tillbaka till Galleri</span>
              </Button>
            </Link>
          </div>
          <CategoryGrid
            images={images}
            setDetaildId={setDetaildId}
            skipAnimation={hasLoaded}
          />
        </>
      ) : (
        <>
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
                  initial={{ rotate: 0, width: "100%", height: "100%" }}
                  animate={
                    screenState.isMobile && screenState.isPortrait
                      ? { rotate: 90, width: "100dvh", height: "100dvw" }
                      : { rotate: 0, width: "100%", height: "100%" }
                  }
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

                  {/* UI OVERLAYS - Placed INSIDE the rotated wrapper so they match orientation */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pointer-events-none absolute inset-0 z-10 flex flex-col p-6 lg:p-8"
                  >
                    {/* Top Bar: Close Button */}
                    <div className="flex w-full justify-start">
                      <Button
                        variant="ghost"
                        onClick={() => setDetaildId(null)}
                        className="pointer-events-auto size-13 cursor-pointer rounded-full bg-black/40 p-0 text-sm tracking-widest text-white uppercase backdrop-blur-md hover:bg-black/60 hover:text-white lg:px-6 lg:py-6"
                      >
                        <ArrowLeftIcon className="size-5" />
                        <span className="hidden lg:flex">Tillbaka</span>
                      </Button>
                    </div>

                    <div className="flex-1" />

                    {/* Bottom / Right Layout */}
                    <div className="pointer-events-auto absolute top-4 right-4 flex w-fit flex-col items-start gap-4 lg:top-28 lg:right-12 lg:bottom-12 lg:w-[400px] lg:items-stretch lg:justify-start lg:gap-8">
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
                    </div>
                    {/* Camera Stats */}
                    <div className="absolute bottom-4 left-1/2 flex w-fit -translate-x-1/2 flex-wrap gap-4 rounded-3xl bg-black/40 p-2 text-white backdrop-blur-md empty:hidden">
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
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
