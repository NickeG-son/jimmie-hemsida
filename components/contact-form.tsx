"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";

import { submitContactForm } from "@/app/actions/contact";
import { contactSchema } from "@/lib/schemas";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Info } from "lucide-react";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const urlRef = searchParams.get("ref") ?? "";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    error?: string;
    success?: boolean;
  } | null>(null);

  // If there's a ref in the URL we always show the field.
  // Otherwise the user must check the box to reveal it.
  const [askingAboutPhoto, setAskingAboutPhoto] = useState(!!urlRef);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema as any),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      imageReferenceId: urlRef,
    },
  });

  // Keep the field in sync if the URL param changes after mount
  useEffect(() => {
    if (urlRef) {
      form.setValue("imageReferenceId", urlRef);
      setAskingAboutPhoto(true);
    }
  }, [urlRef, form]);

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("message", values.message);
    if (values.imageReferenceId) {
      formData.append("imageReferenceId", values.imageReferenceId);
    }

    const result = await submitContactForm(formData);

    setMessage(result);
    setLoading(false);

    if (result.success) {
      form.reset();
      setAskingAboutPhoto(!!urlRef);
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
        {/* NAME */}
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
                placeholder="Ditt namn"
                disabled={loading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* EMAIL */}
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
                placeholder="Din e-postadress"
                disabled={loading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* PHOTO REFERENCE — hidden behind checkbox unless URL ?ref= set */}
        {!urlRef && (
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium select-none">
            <input
              type="checkbox"
              className="size-4 cursor-pointer accent-current"
              checked={askingAboutPhoto}
              onChange={(e) => {
                setAskingAboutPhoto(e.target.checked);
                if (!e.target.checked) {
                  form.setValue("imageReferenceId", "");
                }
              }}
            />
            Frågor om specifikt foto?
          </label>
        )}

        <AnimatePresence initial={false}>
          {askingAboutPhoto && (
            <motion.div
              key="ref-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <Controller
                name="imageReferenceId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Bildens referens-ID{" "}
                      <span className="text-muted-foreground font-normal">
                        (valfritt)
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            type="button"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Info size={16} />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            align="center"
                            className="bg-muted max-w-xs rounded-full text-white"
                          >
                            <p>
                              Här kan du skriva in bildens referens-ID som du
                              hittar i galleriet om du klickar för att förstora
                              bilden.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="t.ex. REF-001"
                      disabled={loading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* MESSAGE */}
        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Skriv ett meddelande</FieldLabel>
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
