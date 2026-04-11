"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { submitContactForm } from "@/app/actions/contact";
import { contactSchema } from "@/lib/schemas";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// The brand new Shadcn Field primitives!
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    error?: string;
    success?: boolean;
  } | null>(null);

  const form = useForm<z.infer<typeof contactSchema>>({
    // Move the 'as any' inside the parentheses!
    resolver: zodResolver(contactSchema as any),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("message", values.message);

    const result = await submitContactForm(formData);

    setMessage(result);
    setLoading(false);

    if (result.success) {
      form.reset();
    }
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-2xl space-y-6 rounded-4xl border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-center text-2xl font-bold tracking-widest uppercase">
        Skicka In Förfrågan
      </h3>

      {message?.error && (
        <div className="rounded-lg border border-red-200 bg-red-100/50 p-4 text-sm font-medium text-red-600">
          {message.error}
        </div>
      )}
      {message?.success && (
        <div className="rounded-lg border border-green-200 bg-green-100/50 p-4 text-center text-sm font-medium text-green-700">
          Tack för ditt meddelande! Jimmie återkommer så fort som möjligt.
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* NAME CONTROLLER */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>För- och efternamn</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Jimmie"
                disabled={loading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* EMAIL CONTROLLER */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>E-postadress</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="foto@jimmiejimmie.com"
                disabled={loading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* MESSAGE CONTROLLER */}
        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Din idé</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                rows={5}
                aria-invalid={fieldState.invalid}
                placeholder="Berätta lite om vad du vill ha hjälp med..."
                disabled={loading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          className="mt-8 w-full font-bold tracking-widest uppercase"
          disabled={loading}
          size="lg"
        >
          {loading ? "SKICKAR..." : "SKICKA"}
        </Button>
      </form>
    </div>
  );
}
