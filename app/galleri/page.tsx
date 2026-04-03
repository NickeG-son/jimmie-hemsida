import GalleryCarousel from "@/components/gallery-carousel";
import { client, urlFor } from "@/sanity/client";

export default async function GalleriRootPage() {
  // Fetch all categories that have a cover image!
  const categories = await client.fetch(`
    *[_type == "category"] {
      _id,
      title,
      "slug": slug.current,
      description,
      mainImage
    }
  `);

  return (
    <div className="w-full py-18 lg:py-24">
      <h1 className="mb-6 text-center text-4xl font-bold tracking-widest uppercase md:text-5xl">
        Portfolios
      </h1>

      <GalleryCarousel items={categories} slugPrefix="/galleri" />
    </div>
  );
}
