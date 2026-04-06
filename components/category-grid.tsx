import { motion } from "motion/react";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import { GalleryImage } from "@/lib/types";
import { Maximize } from "lucide-react";

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
  return (
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
      className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:grid-cols-3"
    >
      {images.map((image: GalleryImage) => (
        <motion.div
          layout
          layoutId={`photo-${image.slug}`}
          key={image._id}
          variants={variantItem}
          className="relative h-96 w-full cursor-pointer overflow-hidden rounded-lg"
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
  );
}
