"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { Button } from "../../ui/button";

import Menu from "./menu";
import { MenuItem, Category } from "@/lib/types";
import Link from "next/link";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import MobileMenu from "./mobile-menu";
import { MenuIcon } from "lucide-react";
import Logo from "@/app/assets/images/jj-logo.png";

import Image from "next/image";

interface HeaderProps {
  menuItems: MenuItem[];
  categories: Category[];
}

export default function Header({ menuItems, categories }: HeaderProps) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // useMotionValueEvent är det moderna sättet att lyssna på värden
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50 && !isScrolled) {
      setIsScrolled(true);
    } else if (latest <= 50 && isScrolled) {
      setIsScrolled(false);
    }
  });

  return (
    <>
      <Link
        href="/"
        className="fixed top-4 left-1/2 z-50 flex size-18 flex-shrink-0 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-white p-3 lg:hidden"
      >
        <Image
          src={Logo.src}
          width={100}
          height={100}
          alt="Logo"
          className="object-cover mix-blend-darken"
        />
      </Link>
      <header
        className={`fixed right-0 bottom-4 left-0 z-50 mx-4 rounded-full bg-black/20 shadow-lg backdrop-blur-md transition-all duration-500 md:mx-8 lg:top-4 lg:bottom-[unset]`}
      >
        <div
          className={`flex items-center justify-between px-3 py-3 transition-all duration-500`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="bg-muted flex size-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full p-3 text-xl font-bold tracking-widest lg:size-12"
          >
            <Image
              src={Logo.src}
              width={100}
              height={100}
              alt="Logo"
              className="object-cover invert"
            />
          </Link>

          {/* Navigation Links - Center */}
          <Menu menuItems={menuItems} categories={categories} />

          <Button
            variant="link"
            size="icon"
            className="bg-muted z-30 flex size-14 flex-shrink-0 flex-col rounded-full p-1 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon className="size-6" />
          </Button>

          <div className="flex hidden items-center justify-end gap-4 lg:flex">
            <Link
              className={`hover:!bg-transparent ${navigationMenuTriggerStyle()} `}
              href="/kontakt"
            >
              Kontakt
            </Link>
            {/*     <ThemeToggle /> */}
          </div>
        </div>
      </header>
      <MobileMenu
        menuItems={menuItems}
        categories={categories}
        open={mobileMenuOpen}
        setOpen={setMobileMenuOpen}
      />
    </>
  );
}
