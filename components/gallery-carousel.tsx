"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/client";
import React from "react";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useSessionIndicator } from "@/hooks/use-session-indicator";

export default function GalleryCarousel({
  items,
  slugPrefix,
}: {
  items: any[];
  slugPrefix: string;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(1);
  const [count, setCount] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const sessionAllows = useSessionIndicator("hint-carousel-tap");
  const [showTapIndicator, setShowTapIndicator] = React.useState(false);

  React.useEffect(() => {
    if (!sessionAllows) return;
    setShowTapIndicator(true);
    const timer = setTimeout(() => setShowTapIndicator(false), 4000);
    return () => clearTimeout(timer);
  }, [sessionAllows]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);

    api.on("pointerDown", () => setShowTapIndicator(false));
    api.on("scroll", () => {
      setCurrent((prev) => {
        const next = api.selectedScrollSnap() + 1;
        if (prev !== next) {
          const total = api.scrollSnapList().length;
          let diff = next - prev;
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;
          if (diff !== 0) {
            setDirection(diff > 0 ? 1 : -1);
          }
        }
        return next;
      });
    });
  }, [api]);

  const activeTitle = items[current - 1]?.title;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
          slidesToScroll: 1,
          containScroll: false,
        }}
      >
        <CarouselContent className="ml-0 lg:-ml-4">
          {items.map((item: any, index: number) => (
            <CarouselItem
              data-active-slide={index + 1 === current}
              key={item._id}
              className={cn(
                "flex min-h-dvh basis-full pl-0 lg:min-h-[calc(100dvh-280px)] lg:basis-2/4 lg:pl-4",
              )}
            >
              <Link
                className="group relative overflow-hidden lg:mx-0 lg:rounded-4xl"
                href={`${slugPrefix}/${item.slug}`}
              >
                {/* The Cover Image */}
                {item.mainImage ? (
                  <Image
                    src={urlFor(item.mainImage).width(1920).height(1080).url()}
                    alt={item.title}
                    width={1920}
                    height={1080}
                    className={cn(
                      "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-60",
                    )}
                  />
                ) : (
                  // Fallback if he forgot to upload a cover image
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}

                {/* Mobile Tap Indicator */}
                <AnimatePresence>
                  {index + 1 === current && showTapIndicator && (
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
                            <div className="h-3 w-3 rounded-full bg-white"></div>
                          </div>
                        </div>
                        <span className="rounded-full bg-black/30 px-3 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                          Tryck för att se mer
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* The Text Overlay */}

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-6 text-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <h2 className="mb-2 text-2xl font-bold tracking-widest uppercase">
                    {item.title}
                  </h2>
                  {item.description && (
                    <p className="line-clamp-2 text-sm text-gray-200">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Permanent Bottom Title if you don't hover */}

                <div className="absolute bottom-[170px] left-1/2 hidden -translate-x-1/2 transition-opacity duration-500 group-hover:opacity-0 lg:bottom-6 lg:left-6 lg:flex lg:-translate-x-0">
                  <h2 className="text-xl font-bold tracking-widest text-white uppercase drop-shadow-md">
                    {item.title}
                  </h2>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="pointer-events-none absolute bottom-[155px] left-1/2 z-10 flex -translate-x-1/2 overflow-hidden rounded-full bg-black/20 px-4 py-1.5 backdrop-blur-md lg:hidden">
          <AnimatePresence mode="popLayout">
            {activeTitle ? (
              <motion.h2
                key={activeTitle}
                initial={{ opacity: 0, x: direction === 1 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 1 ? -50 : 50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="uppercas text-lg font-bold tracking-widest whitespace-nowrap text-white"
              >
                {activeTitle}
              </motion.h2>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="absolute bottom-[100px] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center justify-center gap-1 overflow-hidden rounded-full bg-black/20 p-1.5 backdrop-blur-md lg:relative lg:bottom-0 lg:left-0 lg:mx-auto lg:mt-4 lg:-translate-x-0 lg:bg-transparent lg:p-0">
          <div className="flex items-center gap-2 lg:gap-3">
            <CarouselPrevious
              className="lg:size-10 lg:[&_svg]:!size-6"
              absolute={false}
            />
            <CarouselDots />
            <CarouselNext
              className="lg:size-10 lg:[&_svg]:!size-6"
              absolute={false}
            />
          </div>
        </div>
      </Carousel>
    </motion.div>
  );
}
