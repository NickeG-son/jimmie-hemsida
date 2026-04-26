import { Category } from "@/lib/types";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  // Dela upp arrayen: Hitta "huvudkategorin" och de övriga
  const mainCategory = categories.find((cat) => cat.slug === "fotografier");
  const subCategories = categories.filter((cat) => cat.slug !== "fotografier");

  // Vi kollar om användaren har valt något annat än huvudkategorin (eller tomt)
  const isFiltering =
    selectedCategory !== "" && selectedCategory !== "fotografier";

  return (
    <div className="flex gap-2 pt-2 lg:pt-4">
      <AnimatePresence mode="popLayout">
        {/* FÖRSTA KNAPPEN: Byter mellan "Alla fotografier" och "X" */}
        <motion.button
          key={isFiltering ? "close-btn" : "main-btn"}
          layout
          layoutId="main-toggle"
          onClick={() => onCategoryChange("")}
          className={cn(
            "bg-muted flex cursor-pointer items-center justify-center rounded-full text-sm font-medium",
            !isFiltering && "cursor-default",
            !selectedCategory && isFiltering && "hover:bg-input/50",
          )}
        >
          {isFiltering ? (
            <motion.div className="p-1" layout>
              <X className="size-5" />
            </motion.div>
          ) : (
            <motion.span className="px-2 py-1" layout>
              {mainCategory?.title || "Alla"}
            </motion.span>
          )}
        </motion.button>

        {/* SUB-KATEGORIER: Camping, Wildlife etc. */}
        {subCategories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;

          // Om vi filtrerar, visa bara den valda kategorin bredvid X:et
          if (isFiltering && !isSelected) return null;

          return (
            <motion.button
              key={cat.slug}
              layout
              layoutId={cat.slug}
              onClick={() => onCategoryChange(cat.slug)}
              className={cn(
                "bg-muted flex cursor-pointer items-center rounded-full text-sm font-medium transition-colors duration-300",
                isSelected && "bg-white text-black",
                !isSelected && "hover:bg-white hover:text-black",
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.span className="px-2 py-1" layout>
                {cat.title}
              </motion.span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
