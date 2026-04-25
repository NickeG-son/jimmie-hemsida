import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Sidor",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Sidrubrik",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "t.ex. 'Om mig' eller 'Priser'",
    }),
    defineField({
      name: "slug",
      title: "URL-länk",
      type: "slug",
      options: {
        source: "title", // If he types "Om mig", it auto-generates "/om-mig"!
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: "Denna definierar unikt sidans URL.",
    }),
    defineField({
      name: "mainImage",
      title: "Omslagsbild (Frivillig)",
      type: "image",
      options: {
        hotspot: true, // Let him crop the face!
      },
    }),
    defineField({
      name: "mobileImage",
      title: "Mobil Omslagsbild (Frivillig)",
      type: "image",
      options: {
        hotspot: true, // Let him crop the face!
      },
    }),
    defineField({
      name: "body",
      title: "Brödtext",
      type: "array",
      // By putting 'block' here, Sanity instantly gives him a huge rich-text editor
      // with B, I, U, Lists, H1, H2, Quotes! He can even inject images between paragraphs.
      of: [{ type: "block" }, { type: "image" }],
    }),
    defineField({
      name: "socialLinks",
      title: "Sociala Medier",
      type: "array",
      description:
        "Lägg till sociala medier-konton. Varje länk visas med rätt ikon på kontaktsidan.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Plattform",
              type: "string",
              description:
                "Välj vilken plattform det är — ikonen väljs automatiskt.",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Twitter / X", value: "twitter" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "Vimeo", value: "vimeo" },
                  { title: "Pinterest", value: "pinterest" },
                  { title: "Annan länk", value: "link" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "Länk (URL)",
              type: "url",
              validation: (Rule) => Rule.required(),
              description: "t.ex. https://www.instagram.com/jimmiefoto",
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
  ],
});
