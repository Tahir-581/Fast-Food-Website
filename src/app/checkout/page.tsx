"use client";

import React, { useState } from "react";
import { useShopStore } from "@/lib/store";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Truck,
  MapPin,
  Phone,
  User,
  ChevronRight,
  CheckCircle2,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const CheckoutPage = () => {
  const { data: session } = useSession();
  const { cart, getTotalPrice, clearCart } = useShopStore();
  const [isOrdering, setIsOrdering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");

  const subtotal = getTotalPrice();
  const deliveryFee = deliveryMethod === "delivery" ? (subtotal > 40 ? 0 : 5) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);

    try {
      const payload = {
        items: cart,
        subtotal,
        tax,
        deliveryFee,
        total,
        type: deliveryMethod.toUpperCase(),
        address: deliveryMethod === "delivery" ? "123 Midnight St, Night City" : "STUDIO_PICKUP",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Order failed");

      setIsSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      alert("Transaction failed. Please refine your selection.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="mesh-bg flex min-h-[80vh] items-center justify-center px-5 py-24">
        <Card className="max-w-lg border-border/60 bg-card/95 text-center shadow-2xl ring-1 ring-border/50 backdrop-blur-md">
          <CardContent className="space-y-6 p-10">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/15 text-primary">
              <CheckCircle2 className="size-12" strokeWidth={1.25} />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">It&apos;s official</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your order is being prioritized. We&apos;ll notify you when it&apos;s on the way. Track anytime from your
              studio.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/studio" className={cn(buttonVariants({ variant: "default", size: "lg" }), "h-11 px-8")}>
                Track in studio
              </Link>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 border-border/70 px-8")}
              >
                Return home
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mesh-bg min-h-screen pb-20 pt-24 md:pt-28">
      <div className="mx-auto max-w-[var(--container-max-width)] px-5 md:px-6">
        <h1 className="font-heading mb-10 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
          Secure <span className="text-primary">checkout</span>
        </h1>

        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-start">
          <div className="space-y-10">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  1
                </span>
                <h2 className="font-heading text-lg font-semibold text-foreground">Fulfillment</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("delivery")}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    deliveryMethod === "delivery"
                      ? "border-primary/50 bg-primary/10 shadow-sm shadow-primary/10"
                      : "border-border/60 bg-card/50 hover:border-border"
                  )}
                >
                  <Truck className="size-5 text-primary" />
                  <span className="font-medium text-foreground">Concierge delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    deliveryMethod === "pickup"
                      ? "border-primary/50 bg-primary/10 shadow-sm shadow-primary/10"
                      : "border-border/60 bg-card/50 hover:border-border"
                  )}
                >
                  <ShoppingBag className="size-5 text-primary" />
                  <span className="font-medium text-foreground">Studio pickup</span>
                </button>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  2
                </span>
                <h2 className="font-heading text-lg font-semibold text-foreground">Contact</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="co-name">Full name</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="co-name"
                      name="name"
                      className="h-11 pl-10"
                      placeholder="Jordan Lee"
                      defaultValue={session?.user?.name ?? ""}
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co-phone">Phone</Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="co-phone"
                      name="phone"
                      type="tel"
                      className="h-11 pl-10"
                      placeholder="+1 (555) 000-0000"
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>
            </section>

            {deliveryMethod === "delivery" && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    3
                  </span>
                  <h2 className="font-heading text-lg font-semibold text-foreground">Address</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co-address">Street address</Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="co-address"
                      name="address"
                      className="h-11 pl-10"
                      placeholder="123 Midnight Ave, Apt 4"
                      required
                      autoComplete="street-address"
                    />
                  </div>
                </div>
              </section>
            )}

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {deliveryMethod === "delivery" ? 4 : 3}
                </span>
                <h2 className="font-heading text-lg font-semibold text-foreground">Payment</h2>
              </div>
              <Card className="border-border/60 bg-card/70 py-0">
                <CardHeader className="flex flex-row items-center gap-2 border-b border-border/50 py-4">
                  <CreditCard className="size-5 text-primary" />
                  <CardTitle className="text-base font-medium">Card</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <div className="space-y-2">
                    <Label htmlFor="co-card">Card number</Label>
                    <Input id="co-card" name="card" placeholder="4242 4242 4242 4242" className="h-11" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="co-exp">Expiry</Label>
                      <Input id="co-exp" placeholder="MM / YY" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="co-cvc">CVC</Label>
                      <Input id="co-cvc" placeholder="123" className="h-11" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28">
            <Card className="border-border/60 bg-card/90 shadow-xl ring-1 ring-border/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-56 space-y-3 overflow-y-auto pr-1 text-sm">
                  {cart.map((item) => (
                    <div key={item.customizationId || item.id} className="flex justify-between gap-3 border-b border-border/40 pb-3 last:border-0">
                      <div className="min-w-0">
                        <span className="font-medium text-foreground">
                          {item.quantity}× {item.name}
                        </span>
                        {item.customizations && item.customizations.length > 0 && (
                          <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                            {item.customizations.map((mod: { id: string; name: string }) => (
                              <div key={mod.id}>+ {mod.name}</div>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="shrink-0 tabular-nums text-foreground">
                        ${(((item.basePrice || item.price || 0) +
                          (item.customizations || []).reduce((s: number, m: { price?: number }) => s + (m.price ?? 0), 0)) *
                          item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="bg-border/60" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="tabular-nums text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{deliveryMethod === "delivery" ? "Delivery" : "Service"}</span>
                    <span className="tabular-nums text-foreground">
                      {deliveryFee === 0 ? "Complimentary" : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span className="tabular-nums text-foreground">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-base font-semibold text-foreground">
                    <span>Total</span>
                    <span className="tabular-nums text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 border-t border-border/60 bg-muted/15">
                <Button
                  type="button"
                  className="h-12 w-full gap-2 text-sm font-semibold"
                  onClick={handlePlaceOrder}
                  disabled={cart.length === 0 || isOrdering}
                >
                  {isOrdering ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Placing order…
                    </>
                  ) : (
                    <>
                      Complete order
                      <ChevronRight className="size-4" />
                    </>
                  )}
                </Button>
                <p className="text-center text-[0.65rem] leading-relaxed text-muted-foreground">
                  By completing this order, you agree to the Midnight & Ember terms of service.
                </p>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
