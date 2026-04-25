import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroSlide",
  title: "Startsida",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Länkad kategori",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
      description:
        "Välj en kategori — titel och beskrivning visas automatiskt.",
    }),
    defineField({
      name: "heroImage",
      title: "Omslagsbild",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      description:
        "Helskärmsbild för denna sektion. Bäst i liggande / brett format.",
    }),
    defineField({
      name: "buttonText",
      title: "Knapptext",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Texten på knappen.",
    }),
    defineField({
      name: "order",
      title: "Ordning",
      type: "number",
      description: "Lägre siffra = visas först. t.ex. 1, 2, 3...",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "category.title",
      media: "heroImage",
      order: "order",
    },
      prepare({ title, media, order }) {
      return {
        title: `${order}. ${title ?? "Ingen kategori vald"}`,
        media,
      };
    },
  },
});
