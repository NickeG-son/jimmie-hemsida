"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MenuItem, Category } from "@/lib/types";
import { cn } from "@/lib/utils";
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

export default function AnimatedMenu({
  menuItems,
  categories,
  className,
  open,
  setOpen,
  xPos,
}: {
  menuItems: MenuItem[];
  categories: Category[];
  className?: string;
  open: string;
  setOpen: (open: string) => void;
  xPos?: number;
}) {
  const activeMenu = menuItems.find((item) => item._id === open);

  return (
    <AnimatePresence mode="wait">
      {open && activeMenu && activeMenu.isDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -80, scale: 0 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.2 },
          }}
          exit={{ opacity: 0, y: -80, scale: 0.0 }}
          onMouseEnter={() => setOpen(activeMenu._id)}
          onMouseLeave={() => setOpen("")}
          style={{ left: xPos ? `${xPos}px` : "50%" }}
          className={cn(
            "fixed top-[95px] z-40 min-w-[200px] -translate-x-1/2 rounded-3xl bg-black/20 p-4 pt-4 shadow-lg backdrop-blur-md before:absolute before:inset-x-0 before:-top-10 before:h-12 before:bg-transparent",
            className,
          )}
        >
          {/* Uses the new custom dropdownItems from Sanity, falling back to all categories if empty */}
          <motion.ul
            variants={ulVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col gap-2"
          >
            {(activeMenu.dropdownItems && activeMenu.dropdownItems.length > 0
              ? activeMenu.dropdownItems
              : categories.map((c) => ({ ...c, _type: "category" as const }))
            ).map((item) => (
              <motion.li variants={liVariants} key={item._id}>
                <Link
                  href={
                    item._type === "category"
                      ? `/galleri/${item.slug}`
                      : `/${item.slug}`
                  }
                  onClick={() => setOpen("")}
                  className="flex w-full rounded-md px-6 py-3 no-underline transition-colors hover:bg-white/20"
                >
                  <div className="text-base leading-none font-medium text-white">
                    {item.title}
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
