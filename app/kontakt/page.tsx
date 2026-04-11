import { client, urlFor } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link as LinkIcon } from "lucide-react";
import ContactForm from "@/components/contact-form";
import { InstagramIcon } from "../assets/icons/instagram-icon";
import { FacebookIcon } from "../assets/icons/facebook-icon";
import { YoutubeIcon } from "../assets/icons/youtube-icon";

// Inline SVG brand icons (lucide-react v1+ removed all brand icons)

const BRAND_ICONS: Record<string, React.ElementType> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
};

// Human-readable labels shown in the tooltip / aria-label
const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  twitter: "Twitter / X",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  vimeo: "Vimeo",
  pinterest: "Pinterest",
  link: "Länk",
};

type SocialLink = { platform: string; url: string };

export default async function KontaktPage() {
  const page = await client.fetch(
    `*[_type == "page" && slug.current == "kontakt"][0]{
      title,
      mainImage,
      body,
      socialLinks,
    }`,
  );

  if (!page) {
    notFound();
  }

  const customComponents = {
    block: {
      normal: ({ children }: any) => <p className="mb-4">{children}</p>,
    },
  };

  return (
    <article className="pb-24 lg:pb-8">
      {/* Title */}
      {page.mainImage && (
        <div className="relative mb-16 w-full overflow-hidden shadow-xl">
          <Image
            src={urlFor(page.mainImage).width(1600).height(700).url()}
            alt={page.title}
            className="aspect-square w-full object-cover lg:aspect-video"
            width={1920}
            height={1080}
          />
          <h1 className="absolute bottom-6 left-6 z-10 max-w-4xl text-center text-4xl font-bold tracking-widest uppercase md:text-5xl lg:bottom-8 lg:left-8">
            {page.title}
          </h1>
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      <div className="mx-auto flex max-w-4xl flex-col px-4 lg:px-8">
        {/* Sanity body text */}
        <div className="mx-auto w-full max-w-2xl text-center text-lg leading-relaxed text-gray-800 dark:text-gray-300">
          {page.body && (
            <PortableText value={page.body} components={customComponents} />
          )}
        </div>

        {/* Social Media Links */}
        {page.socialLinks && page.socialLinks.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {page.socialLinks.map((link: SocialLink) => {
              const Icon = BRAND_ICONS[link.platform] ?? LinkIcon;
              const label = SOCIAL_LABELS[link.platform] ?? link.platform;
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 hover:border-gray-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-500"
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </a>
              );
            })}
          </div>
        )}

        {/* Contact Form */}

        <ContactForm />
      </div>
    </article>
  );
}
