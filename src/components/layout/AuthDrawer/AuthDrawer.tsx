"use client";

import React, { useState } from "react";
import { Mail, Lock, Sparkles, Smartphone, Globe, Loader2 } from "lucide-react";
import { useUIStore } from "@/lib/store/ui";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const AuthDrawer = () => {
  const { isAuthOpen, setAuthOpen, showNotification } = useUIStore();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Authentication failed. Please verify your credentials.");
        } else {
          showNotification("success", "Welcome back to the Studio.");
          setAuthOpen(false);
        }
      } else {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Registration failed.");
        } else {
          showNotification("success", "Studio account created. Welcome to the Circle.");
          setMode("login");
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isAuthOpen} onOpenChange={setAuthOpen}>
      <SheetContent
        side="right"
        showCloseButton
        className="flex w-full max-w-[min(100vw,26rem)] flex-col border-l-border/80 bg-card p-0 sm:max-w-md"
      >
        <SheetHeader className="space-y-2 border-b border-border/60 px-5 py-6 text-left sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Sparkles className="size-6" />
            </div>
            <div>
              <SheetTitle className="font-heading text-xl font-semibold tracking-tight">
                {mode === "login" ? "Welcome back" : "Join the circle"}
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in to access your studio and saved orders."
                  : "Create an account to earn rewards on every order."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6 sm:px-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key={error}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-muted/25 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Globe className="size-4" />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-muted/25 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Smartphone className="size-4" />
              Apple
            </button>
          </div>

          <div className="relative my-6">
            <Separator className="bg-border/60" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              or email
            </span>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="auth-name">Full name</Label>
                <div className="relative">
                  <Sparkles className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="auth-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 pl-10"
                    required
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="auth-email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="auth-password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10"
                  required
                />
              </div>
            </div>

            {mode === "login" && (
              <button
                type="button"
                className="self-start text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                Forgot password?
              </button>
            )}

            <Button type="submit" className="mt-2 h-12 w-full text-sm font-semibold" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Please wait
                </>
              ) : mode === "login" ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "New here?" : "Already a member?"}{" "}
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
              }}
            >
              {mode === "login" ? "Create an account" : "Sign in instead"}
            </button>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AuthDrawer;
