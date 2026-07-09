"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Truck, UtensilsCrossed } from "lucide-react";
import { useShopStore } from "@/lib/store";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const FREE_DELIVERY_THRESHOLD = 40;

function cartItemUnitPrice(item: any): number {
  const base = item.basePrice ?? item.price ?? 0;
  const modSum = (item.customizations || []).reduce(
    (sum: number, m: { price?: number }) => sum + (m?.price ?? 0),
    0
  );
  return base + modSum;
}

function productListPrice(p: any): number {
  return p.basePrice ?? p.price ?? 0;
}

const listVariants = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0 },
};

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeItem, getTotalPrice, addItem, categories } =
    useShopStore();

  const totalPrice = getTotalPrice();
  const deliveryProgress = Math.min((totalPrice / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const amountToFree = Math.max(FREE_DELIVERY_THRESHOLD - totalPrice, 0);

  const upsellItems = useMemo(() => {
    const relevantCategories = categories.filter((c: any) => c.slug === "sides" || c.slug === "drinks");
    const allRelevantProducts = relevantCategories.flatMap((c: any) => c.products || []);
    const cartIds = cart.map((item: any) => item.id);

    return allRelevantProducts.filter((p: any) => !cartIds.includes(p.id)).slice(0, 3);
  }, [cart, categories]);

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full max-w-[min(100vw,28rem)] flex-col border-l-border/80 bg-card p-0 sm:max-w-md"
      >
        <SheetHeader className="flex shrink-0 flex-row items-center justify-between gap-4 border-b border-border/60 px-5 py-4 text-left sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <ShoppingBag className="size-5" />
            </div>
            <SheetTitle className="font-heading text-lg font-semibold tracking-tight">Your bag</SheetTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 rounded-full"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close bag"
          >
            <X className="size-5" />
          </Button>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="px-5 py-5 sm:px-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/50 text-primary ring-1 ring-border/60">
                  <UtensilsCrossed className="size-8" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">Your bag is empty</h3>
                  <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                    Add something delicious — your next favorite is on the menu.
                  </p>
                </div>
                <Link
                  href="/menu"
                  onClick={() => setIsCartOpen(false)}
                  className={cn(buttonVariants({ variant: "default", size: "lg" }), "mt-2 flex h-11 items-center justify-center px-8")}
                >
                  Browse menu
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6 rounded-xl border border-border/60 bg-muted/25 p-4 ring-1 ring-inset ring-white/5">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Truck className="size-4 text-primary" />
                    <span>
                      {amountToFree > 0
                        ? `$${amountToFree.toFixed(2)} away from free delivery`
                        : "You unlocked free delivery"}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary/90 to-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${deliveryProgress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <motion.div className="space-y-3" variants={listVariants} initial="hidden" animate="visible">
                  <AnimatePresence mode="popLayout">
                    {cart.map((item: any) => {
                      const lineKey = item.customizationId || item.id;
                      return (
                        <motion.div
                          key={lineKey}
                          layout
                          variants={itemVariants}
                          exit={{ opacity: 0, scale: 0.98 }}
                          className="rounded-xl border border-border/50 bg-card/80 p-4 shadow-sm ring-1 ring-inset ring-white/[0.04]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-heading text-sm font-semibold text-foreground">{item.name}</h4>
                              <p className="mt-1 text-sm font-medium text-primary">
                                ${cartItemUnitPrice(item).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-0.5">
                              <button
                                type="button"
                                className="inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-background/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                onClick={() => updateQuantity(lineKey, item.quantity - 1)}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="size-4" />
                              </button>
                              <span className="min-w-[1.5rem] text-center text-sm font-semibold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-background/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                onClick={() => updateQuantity(lineKey, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus className="size-4" />
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="mt-3 text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-destructive hover:underline"
                            onClick={() => removeItem(lineKey)}
                          >
                            Remove
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>

                {upsellItems.length > 0 && (
                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      <Sparkles className="size-3.5" />
                      <span>Premiere pairings</span>
                    </div>
                    <div className="space-y-2">
                      {upsellItems.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 py-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">+${productListPrice(item).toFixed(2)}</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            className="shrink-0 rounded-full border-primary/30"
                            onClick={() => addItem(item)}
                            aria-label={`Add ${item.name}`}
                          >
                            <Plus className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {cart.length > 0 && (
          <div className="shrink-0 border-t border-border/60 bg-card/95 px-5 py-5 backdrop-blur-md sm:px-6">
            <div className="mb-4 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold tabular-nums text-foreground">${totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Taxes and fees calculated at checkout.</p>
            </div>
            <Separator className="mb-4 bg-border/60" />
            <Button
              className="h-12 w-full gap-2 text-sm font-semibold"
              onClick={() => {
                setIsCartOpen(false);
                window.location.href = "/cart";
              }}
            >
              View selection
              <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
