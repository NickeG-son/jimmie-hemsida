import { client } from "../../../sanity/client";
import ClientContent from "./client-content";

export default async function GalleryCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  // Fetch the category to check if it's an aggregated "show all" category
  const categoryDoc = await client.fetch<{
    _id: string;
    isAggregated?: boolean;
  } | null>(
    `*[_type == "category" && slug.current == $category][0]{ _id, isAggregated }`,
    { category },
  );
  const categories = await client.fetch<
    { _id: string; title: string; slug: string; isAggregated?: boolean }[]
  >(
    `*[_type == "category"] | order(_createdAt desc) { _id, title, "slug": slug.current, isAggregated }`,
  );

  const isAggregated = categoryDoc?.isAggregated === true;

  const imageQuery = `{
    _id,
    title,
    "slug": slug.current,
    "mainImage": image,
    referenceId,
    description,
    iso,
    aperture,
    shutterSpeed,
    category->{
      _id,
      title,
      "slug": slug.current,
      isAggregated
    }
  }`;

  const images = await client.fetch(
    isAggregated
      ? `*[_type == "galleryImage"] | order(_createdAt desc) ${imageQuery}`
      : `*[_type == "galleryImage" && category->slug.current == $category] ${imageQuery}`,
    isAggregated ? {} : { category },
  );

  return (
    <ClientContent
      images={images}
      category={category}
      categories={categories}
    />
  );
}
