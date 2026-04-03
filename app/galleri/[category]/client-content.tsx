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

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  console.log(detaildPhoto);
  console.log(images);

  return (
    <div
      className={cn(
        "relative min-h-[100dvh] w-full overflow-hidden",
        detaildId ? "" : "h-full w-full px-8 py-18 lg:py-24",
      )}
    >
      {!detaildId ? (
        <>
          <h1 className="mb-8 text-center text-4xl font-bold tracking-widest uppercase">
            {category}
          </h1>
          <div className="sticky top-12 left-8 z-10 w-fit rounded-full bg-black/20 px-4 py-3 backdrop-blur-md lg:absolute lg:top-28 lg:left-8">
            <Link href="/galleri">
              <Button
                variant="link"
                className="text-foreground cursor-pointer text-sm tracking-widest uppercase transition-colors"
              >
                ← Tillbaka till Galleri
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
          <div className="absolute top-28 left-8 z-10 w-fit rounded-full bg-black/20 px-4 py-3 backdrop-blur-md">
            <Button
              variant="link"
              onClick={() => setDetaildId(null)}
              className="text-foreground cursor-pointer text-sm tracking-widest uppercase transition-colors"
            >
              ← Tillbaka till {category}
            </Button>
          </div>
          <AnimatePresence>
            {detaildPhoto && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: "100%" }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: "100%" }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-28 right-8 bottom-8 z-10 flex flex-col rounded-3xl bg-black/20 p-8 backdrop-blur-md"
                >
                  <h1 className="mt-8 text-4xl font-bold tracking-widest uppercase md:text-6xl">
                    {detaildPhoto?.title || detaildPhoto?.slug}
                  </h1>

                  {detaildPhoto?.description && (
                    <p className="text-foreground mt-4 max-w-2xl">
                      {detaildPhoto.description}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  layout
                  layoutId={`photo-${detaildPhoto.slug}`}
                  className="absolute top-0 right-0 bottom-0 left-0 flex flex-col rounded-3xl bg-black/20 p-8 backdrop-blur-md"
                >
                  <Image
                    src={urlFor(detaildPhoto.mainImage)
                      .width(800)
                      .height(450)
                      .url()}
                    alt={detaildPhoto.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {detaildPhoto && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-4 rounded-full bg-black/20 px-8 py-3 backdrop-blur-md"
                >
                  {detaildPhoto?.iso && (
                    <p className="text-foreground flex max-w-2xl items-center gap-2">
                      <Camera className="size-5" />
                      {detaildPhoto.iso}
                    </p>
                  )}
                  {detaildPhoto?.aperture && (
                    <p className="text-foreground flex max-w-2xl items-center gap-2">
                      <Aperture className="size-5" />
                      {detaildPhoto.aperture}
                    </p>
                  )}

                  {detaildPhoto?.shutterSpeed && (
                    <p className="text-foreground flex max-w-2xl items-center gap-2">
                      <Timer className="size-5" />
                      {detaildPhoto.shutterSpeed}
                    </p>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
