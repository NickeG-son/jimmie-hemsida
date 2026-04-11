"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent, motion } from "motion/react";
import { Button } from "../../ui/button";

import { MenuItem, Category } from "@/lib/types";
import Link from "next/link";

import { House, MenuIcon } from "lucide-react";
import Logo from "@/app/assets/images/jj-logo.png";

import Image from "next/image";
import AnimatedMenu from "./animated-menu";
import AnimatedMenuMobile from "./animated-menu-mobile";
import { usePathname } from "next/navigation";
import { InstagramIcon } from "@/app/assets/icons/instagram-icon";
import { YoutubeIcon } from "@/app/assets/icons/youtube-icon";
import { cn } from "@/lib/utils";

interface HeaderProps {
  menuItems: MenuItem[];
  categories: Category[];
}

export default function Header({ menuItems, categories }: HeaderProps) {
  const isStartPage = usePathname() === "/";
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [laptopMenuOpen, setLaptopMenuOpen] = useState<string>("");
  const [dropdownX, setDropdownX] = useState(0);
  const [linkIsHovered, setLinkIsHovered] = useState("");

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
      <motion.div
        layout
        style={{
          left: isStartPage ? 0 : "auto",
          right: isStartPage ? 0 : "1rem",
          margin: isStartPage ? "0 auto" : "0",
          width: isStartPage ? "4rem" : "52px",
          height: isStartPage ? "4rem" : "52px",
        }}
        className="fixed top-4 z-50 flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-3 lg:hidden"
      >
        <Link
          href="/"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          scroll={false}
        >
          <Image
            src={Logo.src}
            width={100}
            height={100}
            alt="Logo"
            className="object-cover mix-blend-darken"
          />
        </Link>
      </motion.div>
      <header
        className={`fixed right-0 bottom-4 left-0 z-50 mx-4 rounded-full bg-black/30 shadow-lg backdrop-blur-md transition-all duration-500 md:mx-8 lg:top-4 lg:bottom-[unset] lg:left-1/2 lg:-translate-x-1/2`}
      >
        <div
          className={`flex items-center justify-between px-2 py-2 transition-all duration-500`}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            scroll={false}
            className="bg-muted flex size-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full p-3 text-xl font-bold tracking-widest lg:size-12"
          >
            <House className="lg:hidden" />
            <Image
              src={Logo.src}
              width={100}
              height={100}
              alt="Logo"
              className="hidden object-cover invert lg:block"
            />
          </Link>

          {/* Navigation Links - Center */}
          <div className="hidden items-center gap-4 lg:flex">
            {menuItems.map((item) => (
              <Link
                key={item._id}
                href={item.link || "#"}
                onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (item.isDropdown) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setDropdownX(rect.left + rect.width / 2);
                    setLaptopMenuOpen(item._id);
                  } else setLinkIsHovered(item._id);
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (item.isDropdown) {
                    setLaptopMenuOpen("");
                  } else setLinkIsHovered("");
                }}
                className={cn(
                  "",
                  item.isDropdown
                    ? "relative text-lg before:absolute before:inset-x-0 before:-bottom-12 before:h-12 before:bg-transparent"
                    : "relative",
                )}
              >
                {item.title}
                {!item.isDropdown && linkIsHovered === item._id && (
                  <motion.span
                    className="absolute -bottom-2 left-0 h-[1px] bg-white"
                    initial={{ scaleX: 0, width: "100%" }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    style={{ originX: 0.5 }} // 0.5 betyder 50% (mitten)
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  />
                )}
              </Link>
            ))}
          </div>

          <Link
            href="https://www.instagram.com/svensson4x4/"
            className="bg-muted z-30 flex size-14 flex-shrink-0 flex-col items-center justify-center rounded-full p-1 lg:hidden"
          >
            <InstagramIcon className="size-6" />
          </Link>
          <Link
            href="https://www.youtube.com/@Svensson7"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-muted z-30 flex size-14 flex-shrink-0 flex-col items-center justify-center rounded-full p-1 lg:hidden"
          >
            <YoutubeIcon className="size-6" />
          </Link>
          <Button
            variant="link"
            size="icon"
            className="bg-muted z-30 flex size-14 flex-shrink-0 flex-col rounded-full p-1 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon className="size-6" />
          </Button>
          <div className="hidden size-12 lg:block" />
        </div>
      </header>
      <AnimatedMenu
        menuItems={menuItems}
        categories={categories}
        open={laptopMenuOpen}
        setOpen={setLaptopMenuOpen}
        xPos={dropdownX}
      />
      <AnimatedMenuMobile
        menuItems={menuItems}
        categories={categories}
        open={mobileMenuOpen}
        setOpen={setMobileMenuOpen}
      />
    </>
  );
}
