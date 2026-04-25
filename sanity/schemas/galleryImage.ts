import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryImage",
  title: "Fotografier",
  type: "document",
  fieldsets: [
    {
      name: "cameraSettings",
      title: "Kamerainställningar",
      description: "t.ex. ISO 100, f/1.8, 1/200s",
      options: {
        collapsible: true, // Gör att man kan fälla ihop rubriken
        collapsed: false, // Den är öppen som standard
      },
    },
  ],
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
    }),
    defineField({
      name: "referenceId",
      title: "Referens-ID",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Bild",
      type: "image",
      options: {
        hotspot: true, // Allows him to crop/focus the image in the admin panel!
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "category" }], // This links it to the Category schema!
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      type: "text",
    }),
    defineField({
      name: "productInfo",
      title: "Produktinformation",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Plats",
      type: "string",
    }),
    defineField({
      name: "iso",
      title: "ISO",
      type: "number",
      fieldset: "cameraSettings", // Samma namn som i fieldsets ovan
    }),
    defineField({
      name: "aperture",
      title: "Bländare",
      type: "string",
      fieldset: "cameraSettings",
    }),
    defineField({
      name: "shutterSpeed",
      title: "Slutartid",
      type: "string",
      fieldset: "cameraSettings",
    }),
  ],
});
