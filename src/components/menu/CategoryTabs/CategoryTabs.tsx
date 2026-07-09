"use client";

import React from "react";
import { Sandwich, Salad, CupSoda, IceCream, UtensilsCrossed } from "lucide-react";
import { useShopStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  activeCategory: string;
  setActiveCategory: (slug: string) => void;
}

function CategoryIcon({ slug }: { slug: string }) {
  const className = "size-4 shrink-0";
  switch (slug) {
    case "burgers":
      return <Sandwich className={className} strokeWidth={2} />;
    case "sides":
      return <Salad className={className} strokeWidth={2} />;
    case "drinks":
      return <CupSoda className={className} strokeWidth={2} />;
    case "desserts":
      return <IceCream className={className} strokeWidth={2} />;
    default:
      return <UtensilsCrossed className={className} strokeWidth={2} />;
  }
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, setActiveCategory }) => {
  const { categories } = useShopStore();

  return (
    <nav aria-label="Menu categories" className="w-full min-w-0">
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {categories.map((category: any) => {
          const active = activeCategory === category.slug;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.slug)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "border-primary/50 bg-primary/15 text-foreground shadow-sm shadow-primary/10"
                  : "border-border/60 bg-card/50 text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground"
              )}
            >
              <CategoryIcon slug={category.slug} />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryTabs;
