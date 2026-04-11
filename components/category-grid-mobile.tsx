import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import { GalleryImage } from "@/lib/types";
import { LayoutGrid, Maximize, Square } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

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
  const [layout, setLayout] = useState("list");

  return (
    <div className="flex flex-col gap-4 pt-4">
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-muted fixed right-7 bottom-[105px] z-10 ml-auto flex size-13 cursor-pointer items-center justify-center rounded-full"
        onClick={() => {
          if (layout === "list") setLayout("grid");
          else setLayout("list");
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
        className={`grid gap-6 ${layout === "list" ? "grid-cols-1" : "grid-cols-2"}`}
      >
        {images.map((image: GalleryImage) => (
          <motion.div
            layout
            layoutId={`photo-${image.slug}`}
            key={image._id}
            variants={variantItem}
            className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-4xl"
            onClick={() => setDetaildId(image.slug)}
          >
            <Image
              src={urlFor(image.mainImage).width(1920).height(1080).url()}
              alt={image.title}
              fill
              className="object-cover"
            />
            <Maximize className="absolute top-4 right-4 size-10 rounded-full bg-black/20 p-2 text-white backdrop-blur-md" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
