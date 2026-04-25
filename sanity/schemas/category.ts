import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Kategorier",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL-länk",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      type: "text",
    }),
    defineField({
      name: "mainImage",
      title: "Omslagsbild för kategori",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "isAggregated",
      title: "Aggregerad kategori (visa alla bilder)",
      type: "boolean",
      initialValue: false,
      description:
        "Om aktiverad visas bilder från ALLA kategorier i denna kategori, utan att du behöver lägga till dem manuellt. Använd för t.ex. 'Alla fotografier'.",
    }),
  ],
});
