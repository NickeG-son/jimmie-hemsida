import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactSubmission",
  title: "Meddelanden",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Namn",
      type: "string",
      readOnly: true, // Prevents accidental editing in the Studio
    }),
    defineField({
      name: "email",
      title: "E-postadress",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "message",
      title: "Meddelande",
      type: "text",
      readOnly: true,
    }),
    defineField({
      name: "createdAt",
      title: "Mottaget den",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email", // Shows the email as the subtitle in the Studio list!
    },
  },
});
