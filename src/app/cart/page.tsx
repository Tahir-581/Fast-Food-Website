"use client";

import React from "react";
import Link from "next/link";
import { useShopStore } from "@/lib/store";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  Info,
  CreditCard,
  Sparkles,
  UtensilsCrossed,
  Sandwich,
  Salad,
  CupSoda,
} from "lucide-react";

function lineKey(item: { customizationId?: string; id: string }) {
  return item.customizationId || item.id;
}

function unitPrice(item: {
  basePrice?: number;
  price?: number;
  customizations?: { price?: number }[];
}): number {
  const base = item.basePrice ?? item.price ?? 0;
  const mods = (item.customizations || []).reduce((s, m) => s + (m.price ?? 0), 0);
  return base + mods;
}

const CartPage = () => {
  const { cart, updateQuantity, removeItem, getTotalPrice } = useShopStore();
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 40 ? 0 : 5;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  if (cart.length === 0) {
    return (
      <main className="mesh-bg flex min-h-[70vh] items-center justify-center px-5 py-24">
        <div className="glass-panel max-w-md rounded-3xl p-10 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <UtensilsCrossed className="size-8" strokeWidth={1.5} />
          </div>
          <h1 className="font-heading mt-6 text-2xl font-bold tracking-tight text-foreground">Your bag is empty</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Explore the menu and add something you love — we will hold it here for you.
          </p>
          <Link
            href="/menu"
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "mt-8 inline-flex h-12 px-10")}
          >
            Discover the menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mesh-bg min-h-screen pb-20 pt-24 md:pt-28">
      <div className="mx-auto max-w-[var(--container-max-width)] px-5 md:px-6">
        <div className="mb-10">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Continue browsing
          </Link>
          <h1 className="font-heading mt-4 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Your <span className="text-primary">order bag</span>
          </h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-start">
          <div className="space-y-4">
            {cart.map((item) => {
              const key = lineKey(item);
              const u = unitPrice(item);
              const cat = (item as { category?: string }).category;
              return (
                <Card
                  key={key}
                  className="overflow-hidden border-border/60 bg-card/80 py-0 shadow-md ring-1 ring-border/40"
                >
                  <CardContent className="flex gap-4 p-4 sm:p-5">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-muted/50 text-primary ring-1 ring-border/50 sm:size-20">
                      {cat === "burgers" ? (
                        <Sandwich className="size-8" strokeWidth={1.25} />
                      ) : cat === "sides" ? (
                        <Salad className="size-8" strokeWidth={1.25} />
                      ) : (
                        <CupSoda className="size-8" strokeWidth={1.25} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-heading text-base font-semibold text-foreground">{item.name}</h3>
                        <button
                          type="button"
                          className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          onClick={() => removeItem(key)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      {item.customizations && item.customizations.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.customizations.map((c) => (
                            <span
                              key={typeof c === "object" && c && "id" in c ? (c as { id: string }).id : String(c)}
                              className="rounded-md bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              {typeof c === "object" && c && "name" in c ? (c as { name: string }).name : String(c)}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-muted/25 p-1">
                          <button
                            type="button"
                            className="inline-flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            onClick={() => updateQuantity(key, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                          <button
                            type="button"
                            className="inline-flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            onClick={() => updateQuantity(key, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>
                        <span className="text-lg font-bold tabular-nums text-primary">${(u * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <aside className="lg:sticky lg:top-28">
            <Card className="border-border/60 bg-card/90 shadow-xl ring-1 ring-border/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Order summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    Delivery
                    <Truck className="size-3.5" />
                  </span>
                  <span className={cn("tabular-nums font-medium", deliveryFee === 0 && "text-primary")}>
                    {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Est. tax</span>
                  <span className="tabular-nums text-foreground">${tax.toFixed(2)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex items-start gap-2 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
                    <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    <span>Add ${(40 - subtotal).toFixed(2)} more for complimentary delivery.</span>
                  </div>
                )}
                <Separator className="bg-border/60" />
                <div className="flex justify-between text-base font-semibold text-foreground">
                  <span>Total</span>
                  <span className="tabular-nums text-primary">${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 border-t border-border/60 bg-muted/20">
                <Link
                  href="/checkout"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "h-12 w-full gap-2 text-sm font-semibold"
                  )}
                >
                  Secure checkout
                  <CreditCard className="size-4" />
                </Link>
                <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
                  <Sparkles className="size-3.5 text-primary" />
                  Earn {(total * 5).toFixed(0)} sparks with this order
                </p>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
