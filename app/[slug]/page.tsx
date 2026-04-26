import { client, urlFor } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { notFound } from "next/navigation";

// Since we are in Next 15+, `params` is a Promise!
export default async function GenericPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Fetch the exact page that matches the slug
  const page = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      mainImage,
      mobileImage,
      body,
    }`,
    { slug },
  );

  // 2. If no page is found in Sanity (e.g., they typed a wrong URL), drop out and show the Next.js 404 page
  if (!page) {
    notFound();
  }

  // 3. This tells Portable Text how to style his paragraphs and headers using Tailwind!
  const customComponents = {
    block: {
      h1: ({ children }: any) => (
        <h1 className="mt-12 mb-6 text-4xl font-bold">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="mt-10 mb-4 text-3xl font-bold">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="mt-8 mb-4 text-2xl font-bold">{children}</h3>
      ),
      normal: ({ children }: any) => (
        <p className="mb-6 text-lg leading-relaxed text-gray-800 dark:text-gray-300">
          {children}
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="my-6 border-l-4 border-gray-300 pl-4 text-gray-600 italic dark:border-gray-500 dark:text-gray-400">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="mb-6 list-disc space-y-2 pl-8">{children}</ul>
      ),
      number: ({ children }: any) => (
        <ol className="mb-6 list-decimal space-y-2 pl-8">{children}</ol>
      ),
    },
  };

  return (
    <article className="w-full pb-20 lg:pb-0">
      {/* Dynamic Title */}

      {/* Dynamic Header Image (If he uploaded one) */}
      {page.mainImage && (
        <div className="relative mb-16 w-full overflow-hidden shadow-xl">
          <Image
            src={urlFor(page.mainImage).width(1600).height(700).url()}
            alt={page.title}
            className="hidden aspect-[unset] w-screen object-cover lg:flex"
            width={1920}
            height={1080}
          />
          <Image
            src={urlFor(page.mobileImage).width(1600).height(700).url()}
            alt={page.title}
            className="flex aspect-square w-full object-cover lg:hidden"
            width={1920}
            height={1080}
          />
          <h1 className="absolute bottom-6 left-6 z-10 max-w-4xl text-center text-4xl font-bold tracking-widest uppercase md:text-5xl lg:bottom-8 lg:left-8">
            {page.title}
          </h1>
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        {/* Dynamic Rich Text from Sanity */}
        <div className="mx-auto w-full">
          {page.body && (
            <PortableText value={page.body} components={customComponents} />
          )}
        </div>
      </div>
    </article>
  );
}
