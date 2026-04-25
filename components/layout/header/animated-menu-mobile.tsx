"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MenuItem, Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Contact,
  ImageIcon,
  Mail,
  MenuIcon,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const liVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
    },
  },
};
const ulVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.2,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function AnimatedMenuMobile({
  menuItems,
  categories,
  className,
  open,
  setOpen,
}: {
  menuItems: MenuItem[];
  categories: Category[];
  className?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, opacity: 0 }}
          animate={{
            width: "calc(100% - 32px)",
            height: "auto",
            bottom: 104,
            right: 16,
            borderRadius: 32,
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 1,
            },
          }}
          exit={{ bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, opacity: 0 }}
          className={cn(
            "fixed isolate z-[60] bg-black/30 p-6 !backdrop-blur-md overflow-hidden",
            className,
          )}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.1 } }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            className="size-full"
          >
            <Button
              variant="link"
              size="icon"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 p-0"
            >
            <X className="size-8" />
          </Button>
            <ul className="flex flex-col gap-4 overflow-hidden">
            {menuItems.map((item) => (
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                key={item._id}
                className="overflow-hidden"
              >
                {item.isDropdown ? (
                  <>
                    <div className="flex w-full items-center gap-2">
                      <Link
                        href={item.link || "#"}
                        onClick={() => setOpen(false)}
                        className="text-foreground flex items-center gap-2 py-2 text-xl font-medium tracking-widest uppercase"
                      >
                        {item.title.toLowerCase() === "galleri" ? (
                          <ImageIcon />
                        ) : (
                          <User />
                        )}
                        {item.title}
                      </Link>
                      <Button
                        variant="link"
                        size="icon"
                        className="flex-1 justify-start focus:ring-0 focus:outline-none focus-visible:!ring-transparent"
                        onClick={() => setOpenDropdown(!openDropdown)}
                      >
                        <ChevronDown
                          className={cn(
                            "transition-transform",
                            openDropdown ? "rotate-180" : "",
                          )}
                        />
                      </Button>
                    </div>
                    <AnimatePresence>
                      {openDropdown && (
                        <motion.ul
                          variants={ulVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ duration: 0.2 }}
                          className="grid w-[300px]"
                        >
                          <>
                            <motion.li key="seAll" variants={liVariants}>
                              <Link
                                href={item.link || "#"}
                                onClick={() => {
                                  setOpen(false);
                                  window.scrollTo(0, 0);
                                }}
                                scroll={false}
                                className="flex px-2 py-2 no-underline transition-colors outline-none select-none"
                              >
                                <div className="bg-muted/30 flex w-fit rounded-full px-4 py-2 text-base leading-none font-medium">
                                  Se allt i {item.title}
                                </div>
                              </Link>
                            </motion.li>
                            {/* Mobile Dropdown Mapping */}
                            {(item.dropdownItems &&
                            item.dropdownItems.length > 0
                              ? item.dropdownItems
                              : categories.map((c) => ({
                                  ...c,
                                  _type: "category" as const,
                                }))
                            ).map((subItem) => (
                              <motion.li
                                variants={liVariants}
                                key={subItem._id}
                              >
                                <Link
                                  href={
                                    subItem._type === "category"
                                      ? `/galleri/${subItem.slug}`
                                      : `/${subItem.slug}`
                                  }
                                  onClick={() => {
                                    setOpen(false);
                                    window.scrollTo(0, 0);
                                  }}
                                  scroll={false}
                                  className="flex w-full rounded-md px-6 py-4 no-underline transition-colors outline-none select-none"
                                >
                                  <div className="text-base leading-none font-medium">
                                    {subItem.title}
                                  </div>
                                </Link>
                              </motion.li>
                            ))}
                          </>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    key={item._id}
                    href={item.link || "#"}
                    onClick={() => setOpen(false)}
                    className="text-foreground flex items-center gap-2 py-2 text-lg font-medium tracking-widest uppercase"
                  >
                    {item.title.toLowerCase() === "galleri" ? (
                      <ImageIcon />
                    ) : item.title.toLowerCase() === "kontakt" ? (
                      <Mail />
                    ) : item.title.toLowerCase() === "om mig" ? (
                      <User />
                    ) : (
                      <User />
                    )}
                    {item.title}
                  </Link>
                )}
              </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
