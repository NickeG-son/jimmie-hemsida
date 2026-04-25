import { defineField, defineType } from "sanity";

export default defineType({
  name: "menuItem",
  title: "Menyval",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "t.ex. 'Om Mig' eller 'Galleri'",
    }),
    defineField({
      name: "link",
      title: "URL-länk",
      type: "string",
      description:
        "t.ex. '/om-mig' eller '/kontakt'. (Lämna tomt om detta bara är en flik med rullgardinsmeny)",
    }),
    defineField({
      name: "isDropdown",
      title: "Har en rullgardinsmeny?",
      type: "boolean",
      initialValue: false,
      description:
        "Om ikryssad, kan du lägga till specifika Kategorier eller Sidor nedan som ska visas i rullgardinsmenyn.",
    }),
    defineField({
      name: "order",
      title: "Ordning (1, 2, 3...)",
      type: "number",
      validation: (Rule) => Rule.required(),
      description: "Används för att sortera menyvalen från vänster till höger.",
    }),
    defineField({
      name: "dropdownItems",
      title: "Menyval i rullgardinen",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }, { type: "page" }] }],
      hidden: ({ parent }) => !parent.isDropdown, // Only show if isDropdown is true
    }),
  ],
});
