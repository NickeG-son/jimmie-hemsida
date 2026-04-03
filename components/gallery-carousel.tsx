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
import { motion } from "motion/react";

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

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);

    api.on("select", () => {
      // Do something on select.
    });
    api.on("scroll", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
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
        <CarouselContent>
          {items.map((item: any, index: number) => (
            <CarouselItem
              data-active-slide={index + 1 === current}
              key={item._id}
              className={cn(
                "flex min-h-[calc(100dvh-280px)] basis-full lg:basis-2/4",
              )}
            >
              <Link
                className="group relative mx-4 overflow-hidden rounded-2xl lg:mx-0"
                href={`${slugPrefix}/${item.slug}`}
              >
                {/* The Cover Image */}
                {item.mainImage ? (
                  <Image
                    src={urlFor(item.mainImage).width(800).height(450).url()}
                    alt={item.title}
                    width={800}
                    height={450}
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

                {/* The Text Overlay */}

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-6 text-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
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

                <div className="absolute bottom-6 left-6 transition-opacity duration-500 group-hover:opacity-0">
                  <h2 className="text-xl font-bold tracking-widest text-white uppercase drop-shadow-md">
                    {item.title}
                  </h2>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mx-auto mt-4 flex items-center justify-center gap-4">
          <CarouselPrevious className="" absolute={false} />
          <CarouselDots />
          <CarouselNext absolute={false} />
        </div>
      </Carousel>
    </motion.div>
  );
}
