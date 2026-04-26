"use server";

import { createClient } from "next-sanity";
import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas";

// ✏️ Change this to your friend's email address whenever needed!
// Nu hämtas mailen säkert från Vercel istället för att vara inskriven här
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "";

const writeClient = createClient({
  projectId: "gr97dtx7",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(formData: FormData) {
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    message: formData.get("message") as string,
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { name, email, message } = validatedFields.data;

  try {
    // Save to Sanity Inbox
    await writeClient.create({
      _type: "contactSubmission",
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    });

    // Send email notification via Resend
    await resend.emails.send({
      from: "JimmieJimmie.com <onboarding@resend.dev>", // ✏️ when ready to go live, you can verify jimmiejimmie.com in the Resend dashboard and change the from: to something like kontakt@jimmiejimmie.com
      to: NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `Ny förfrågan från ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="border-bottom: 2px solid #111; padding-bottom: 8px;">Ny förfrågan via JimmieJimmie.com</h2>
          <p><strong>Namn:</strong> ${name}</p>
          <p><strong>E-post:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Meddelande:</strong></p>
          <blockquote style="border-left: 4px solid #ccc; margin: 0; padding: 12px 16px; background: #f9f9f9;">
            ${message.replace(/\n/g, "<br/>")}
          </blockquote>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">Skickat från kontaktformuläret på JimmieJimmie.com</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Något gick fel. Försök igen." };
  }
}
