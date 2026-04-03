"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { MenuItem, Category } from "@/lib/types";

interface MenuProps {
  menuItems: MenuItem[];
  categories: Category[];
}

export default function Menu({ menuItems, categories }: MenuProps) {
  const router = useRouter();

  return (
    <NavigationMenu
      className="hidden md:flex"
      viewportClassName="bg-black/30 backdrop-blur-md text-white border-0 shadow-lg rounded-2xl"
    >
      <NavigationMenuList className="h-full">
        {menuItems.map((item) => (
          <NavigationMenuItem key={item._id}>
            {item.isDropdown ? (
              // --- SCENARIO A: IT IS A DROPDOWN (e.g. "Galleri") ---
              <>
                <NavigationMenuTrigger
                  onClick={() => {
                    if (item.link) router.push(item.link);
                  }}
                  className="h-full cursor-pointer transition-all hover:!bg-transparent focus:!bg-transparent data-open:hover:!bg-transparent data-open:focus:!bg-transparent data-popup-open:!bg-transparent data-popup-open:hover:!bg-transparent"
                >
                  {item.title}
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    {/* Look here! We are looping through the Categories! */}
                    {categories.map((category) => (
                      <li key={category._id}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/galleri/${category.slug}`}
                            className="hover:bg-accent hover:text-accent-foreground block w-fit space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                          >
                            <div className="text-sm leading-none font-medium">
                              {category.title}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              // --- SCENARIO B: IT IS A NORMAL LINK (e.g. "Om Mig") ---
              <NavigationMenuLink
                asChild
                className={`hover:!bg-transparent ${navigationMenuTriggerStyle()} `}
              >
                <Link href={item.link || "#"}>{item.title}</Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
