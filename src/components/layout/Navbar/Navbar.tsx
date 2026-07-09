"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Menu as MenuIcon, User, Search, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useShopStore } from "@/lib/store";
import { useUIStore } from "@/lib/store/ui";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { href: "/menu", label: "The Collection" },
  { href: "/locations", label: "Our Kitchens" },
  { href: "/rewards", label: "The Craft" },
] as const;

const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const user = session?.user;
  const { getTotalItems, setIsCartOpen } = useShopStore();
  const { setAuthOpen } = useUIStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[1000] flex h-20 items-center transition-all duration-300 ease-out",
        isScrolled || isSearchOpen
          ? "h-[4.375rem] border-b border-border/80 bg-background/75 shadow-lg shadow-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[var(--container-max-width)] items-center justify-between gap-4 px-5 md:px-6",
          isSearchOpen && "gap-5"
        )}
      >
        <Link
          href="/"
          className={cn(
            "font-heading flex shrink-0 items-center gap-1 text-lg font-extrabold tracking-tight text-foreground md:text-xl",
            isSearchOpen && "hidden lg:flex"
          )}
        >
          <span>Midnight</span>
          <span className="text-primary">&</span>
          <span>Ember</span>
        </Link>

        <div
          className={cn(
            "hidden items-center gap-8 lg:flex",
            isSearchOpen && "hidden"
          )}
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <div
            ref={searchRef}
            className={cn(
              "flex min-w-0 items-center gap-2 rounded-xl transition-all duration-300",
              isSearchOpen &&
                "lg:max-w-md lg:flex-1 border border-border/80 bg-muted/40 px-3 py-1.5"
            )}
          >
            <button
              type="button"
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:size-10"
              )}
              aria-label={isSearchOpen ? "Close search" : "Open search"}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X className="size-5" /> : <Search className="size-5" />}
            </button>
            {isSearchOpen && (
              <Input
                autoFocus
                type="search"
                placeholder="What are you craving?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            )}
          </div>

          <button
            type="button"
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:size-10",
              isSearchOpen && "hidden lg:inline-flex"
            )}
            onClick={() => (user ? router.push("/dashboard") : setAuthOpen(true))}
            aria-label={user ? "Account" : "Sign in"}
          >
            <User className={cn("size-5", user && "text-primary")} />
          </button>

          <button
            type="button"
            className={cn(
              "relative inline-flex size-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:size-10",
              isSearchOpen && "hidden lg:inline-flex"
            )}
            onClick={() => setIsCartOpen(true)}
            aria-label={`Shopping bag${totalItems > 0 ? `, ${totalItems} items` : ""}`}
          >
            <ShoppingCart className="size-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-[1.125rem] items-center justify-center rounded-full bg-primary text-[0.65rem] font-bold text-primary-foreground ring-2 ring-background">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          <Link
            href="/menu"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "hidden h-11 px-7 text-xs font-semibold uppercase tracking-[0.2em] lg:inline-flex",
              isSearchOpen && "hidden"
            )}
          >
            Order Now
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("lg:hidden", isSearchOpen && "hidden")}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon className="size-5" />
          </Button>
        </div>
      </div>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-full border-l-border/80 bg-card p-0 sm:max-w-sm">
          <SheetHeader className="border-b border-border/60 p-6 text-left">
            <SheetTitle className="font-heading text-xl tracking-tight">Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3.5 font-heading text-lg font-semibold text-foreground transition-colors hover:bg-muted/50"
              >
                {label}
              </Link>
            ))}
            <Separator className="my-3 bg-border/60" />
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3.5 font-heading text-lg font-semibold text-primary"
              >
                Studio — {user?.name ?? "Account"}
              </Link>
            ) : (
              <button
                type="button"
                className="rounded-xl px-4 py-3.5 text-left font-heading text-lg font-semibold text-primary transition-colors hover:bg-muted/50"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setAuthOpen(true);
                }}
              >
                Welcome back / Join the circle
              </button>
            )}
            <Link
              href="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mt-4 flex h-12 w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.2em]"
              )}
            >
              Order now
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
