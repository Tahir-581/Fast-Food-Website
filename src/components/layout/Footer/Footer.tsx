"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Camera, Globe, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="relative border-t border-border/60 bg-card/40 mesh-bg">
      <div className="mx-auto max-w-[var(--container-max-width)] px-5 py-16 md:px-6 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="lg:col-span-1">
            <Link href="/" className="font-heading inline-flex flex-wrap items-baseline gap-1 text-xl font-extrabold tracking-tight text-foreground">
              <span>Midnight</span>
              <span className="text-primary">&</span>
              <span>Ember</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Modern flavors, premium ingredients, and a commitment to speed and quality. Fast food, elevated.
            </p>

            <div className="glass-panel mt-8 rounded-2xl p-5">
              <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">Elevate your inbox</h3>
              <p className="mt-1 text-xs text-muted-foreground">Exclusive drops and secret menu notes.</p>
              <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
                <Input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 flex-1 border-border/60 bg-background/50"
                />
                <Button type="submit" size="icon" className="size-10 shrink-0 rounded-xl" aria-label="Subscribe">
                  <ArrowRight className="size-4" />
                </Button>
              </form>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-primary">Menu</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <Link href="/menu" className="transition-colors hover:text-foreground">
                  Full menu
                </Link>
              </li>
              <li>
                <Link href="/menu" className="transition-colors hover:text-foreground">
                  Burgers
                </Link>
              </li>
              <li>
                <Link href="/menu" className="transition-colors hover:text-foreground">
                  Sides
                </Link>
              </li>
              <li>
                <Link href="/menu" className="transition-colors hover:text-foreground">
                  Drinks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-primary">Support</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/locations" className="transition-colors hover:text-foreground">
                  Find a store
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-foreground">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="transition-colors hover:text-foreground">
                  Delivery
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-primary">Company</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="transition-colors hover:text-foreground">
                  Our story
                </Link>
              </li>
              <li>
                <Link href="/careers" className="transition-colors hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="transition-colors hover:text-foreground">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-foreground">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-border/50" />

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-center text-xs text-muted-foreground sm:text-left">
            © {new Date().getFullYear()} Midnight & Ember. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="https://instagram.com"
              className="inline-flex size-11 items-center justify-center rounded-xl border border-border/50 bg-muted/20 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              aria-label="Instagram"
            >
              <Camera className="size-5" />
            </Link>
            <Link
              href="https://twitter.com"
              className="inline-flex size-11 items-center justify-center rounded-xl border border-border/50 bg-muted/20 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              aria-label="Social"
            >
              <Globe className="size-5" />
            </Link>
            <Link
              href="https://facebook.com"
              className="inline-flex size-11 items-center justify-center rounded-xl border border-border/50 bg-muted/20 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              aria-label="Facebook"
            >
              <Users className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
