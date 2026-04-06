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
      description: 'e.g., "Om Mig" or "Galleri"',
    }),
    defineField({
      name: "link",
      title: "Link URL",
      type: "string",
      description:
        'e.g., "/om-mig" or "/kontakt". (Leave blank if this is just a Dropdown trigger)',
    }),
    defineField({
      name: "isDropdown",
      title: "Has Dropdown Menu?",
      type: "boolean",
      initialValue: false,
      description:
        "If turned ON, you can add specific Categories or Pages below to be displayed in the dropdown menu.",
    }),
    defineField({
      name: "order",
      title: "Order (1, 2, 3...)",
      type: "number",
      validation: (Rule) => Rule.required(),
      description: "Used to sort the menu items from left to right.",
    }),
    defineField({
      name: "dropdownItems",
      title: "Dropdown Items",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }, { type: "page" }] }],
      hidden: ({ parent }) => !parent.isDropdown, // Only show if isDropdown is true
    }),
  ],
});
