import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header/header";
import { ThemeProvider } from "@/components/theme-provider";
import { client } from "@/sanity/client";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jimmie Jimmie",
  description: "Foto galleri",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = await client.fetch(`
    *[_type == "menuItem"] | order(order asc) {
      _id,
      title,
      link,
      isDropdown,
      dropdownItems[]->{ 
        _type,
        _id,
        title,
        "slug": slug.current
      }
    }
  `);
  const categories = await client.fetch(`
    *[_type == "category"] {
      _id,
      title,
      "slug": slug.current,
      description
    }
  `);
  return (
    <>
      <html
        lang="sv"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="bg-background flex h-dvh flex-col">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Header menuItems={menuItems} categories={categories} />
            <main className="flex w-full flex-1 flex-col items-center justify-between">
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
