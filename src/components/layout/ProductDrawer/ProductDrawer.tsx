"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Flame, Minus, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useShopStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const ProductDrawer = () => {
  const { selectedDrawerProduct, setSelectedDrawerProduct, addItem } = useShopStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<any[]>([]);

  const product: any = selectedDrawerProduct;
  const basePrice = product?.price || product?.basePrice || 0;

  const modifierPrice = selectedModifiers.reduce((sum: number, mod: any) => sum + (mod.priceModifier || 0), 0);
  const totalPrice = (basePrice + modifierPrice) * quantity;

  const isSelectionValid = (product?.modifierGroups || []).every((group: any) => {
    if (!group.isRequired || group.minSelection === 0) return true;
    const selectedInGroup = selectedModifiers.filter((m: any) =>
      group.options.some((o: any) => o.id === m.id)
    ).length;
    return selectedInGroup >= group.minSelection;
  });

  const handleClose = () => {
    setSelectedDrawerProduct(null);
    setQuantity(1);
    setSelectedModifiers([]);
  };

  const handleAddToCart = () => {
    if (!isSelectionValid) return;

    const customizations = selectedModifiers.map((m: any) => ({
      id: m.id,
      name: m.name,
      price: m.priceModifier,
    }));

    if (selectedDrawerProduct) {
      addItem(selectedDrawerProduct, quantity, customizations);
      handleClose();
    }
  };

  const toggleModifier = (group: any, option: any) => {
    setSelectedModifiers((prev: any[]) => {
      const isSelected = prev.some((m: any) => m.id === option.id);

      if (isSelected) {
        return prev.filter((m: any) => m.id !== option.id);
      }

      const selectedInGroup = prev.filter((m: any) => group.options.some((o: any) => o.id === m.id));

      if (group.maxSelection === 1) {
        const filtered = prev.filter((m: any) => !group.options.some((o: any) => o.id === m.id));
        return [...filtered, option];
      }

      if (selectedInGroup.length < group.maxSelection) {
        return [...prev, option];
      }

      return prev;
    });
  };

  const modifierGroups = product?.modifierGroups || [];
  const open = !!selectedDrawerProduct;

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
    >
      <SheetContent
        side="right"
        showCloseButton
        className="flex w-full max-w-[min(100vw,32rem)] flex-col border-l-border/80 bg-card p-0 sm:max-w-lg"
      >
        {product && (
          <>
            <SheetHeader className="shrink-0 space-y-3 border-b border-border/60 bg-gradient-to-b from-muted/40 to-card px-5 py-6 text-left sm:px-6">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-primary">Product studio</p>
              <SheetTitle className="font-heading pr-10 text-2xl font-bold leading-tight tracking-tight">
                {product.name}
              </SheetTitle>
            </SheetHeader>

            <ScrollArea className="min-h-0 flex-1">
              <div className="border-b border-border/60 bg-muted/20 px-5 py-6 sm:px-6">
                <div className="grid grid-cols-[minmax(0,140px)_1fr] items-center gap-5 sm:grid-cols-[160px_1fr] sm:gap-8">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border/60 bg-black/40 shadow-inner ring-1 ring-inset ring-white/5">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="200px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-primary">
                        <Sparkles className="size-10" strokeWidth={1.25} />
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-heading text-2xl font-bold text-primary">${basePrice.toFixed(2)}</span>
                      {product.calories && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Flame className="size-4 text-primary/80" />
                          <span>{product.calories} kcal</span>
                        </div>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-10 px-5 py-8 sm:px-6">
                {modifierGroups.map((group: any) => (
                  <section key={group.id} className="space-y-4">
                    <div>
                      <h3 className="font-heading text-base font-semibold text-foreground">{group.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {group.minSelection > 0
                          ? `Selection required (min ${group.minSelection})`
                          : `Optional (max ${group.maxSelection})`}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {group.options.map((option: any) => {
                        const isSelected = selectedModifiers.some((m) => m.id === option.id);
                        return (
                          <motion.button
                            key={option.id}
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleModifier(group, option)}
                            className={cn(
                              "relative flex flex-col gap-1 rounded-2xl border p-4 text-left transition-colors",
                              isSelected
                                ? "border-primary bg-primary/10 shadow-[0_0_0_1px] shadow-primary/40"
                                : "border-border/60 bg-muted/20 hover:border-primary/50 hover:bg-muted/35"
                            )}
                          >
                            <span className="text-sm font-semibold text-foreground">{option.name}</span>
                            {option.priceModifier > 0 && (
                              <span className="text-xs font-bold text-primary">+${option.priceModifier.toFixed(2)}</span>
                            )}
                            {isSelected && (
                              <motion.span
                                layoutId="product-option-check"
                                className="absolute right-3 top-3 text-primary"
                              >
                                <Sparkles className="size-4" />
                              </motion.span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </ScrollArea>

            <div className="shrink-0 border-t border-border/60 bg-card/95 px-5 py-5 backdrop-blur-md sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center justify-center gap-1 rounded-xl border border-border/60 bg-muted/30 p-1 sm:justify-start">
                  <button
                    type="button"
                    className="inline-flex size-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-5" />
                  </button>
                  <span className="min-w-[2.5rem] text-center text-base font-bold tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    className="inline-flex size-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-5" />
                  </button>
                </div>
                <Button
                  className="h-12 flex-1 text-sm font-semibold sm:h-12"
                  disabled={!isSelectionValid}
                  onClick={handleAddToCart}
                >
                  Add to bag — ${totalPrice.toFixed(2)}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ProductDrawer;
