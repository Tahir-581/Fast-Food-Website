"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.35 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative flex min-h-[max(100vh,700px)] items-center overflow-hidden bg-background">
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="size-full object-cover brightness-[0.55] contrast-[1.08]"
          poster="/images/hero-poster.jpg"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-meat-burger-being-assembled-43213-large.mp4"
            type="video/mp4"
          />
        </video>
        <div
          className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/30"
          aria-hidden
        />
      </motion.div>

      <div className="relative z-[2] mx-auto w-full max-w-[var(--container-max-width)] px-5 md:px-6">
        <motion.div
          className="max-w-[40rem] space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="secondary" className="rounded-lg px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.25em]">
              Premiere selection
            </Badge>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="font-heading text-[clamp(2.75rem,8vw,4.5rem)] font-black leading-[1.05] tracking-tight text-foreground"
          >
            Elevated fast food.
            <br />
            <span className="text-primary">Redefined.</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Smoke, spice, and precision in every bite. Crafted for the bold — delivered with care.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Link
              href="/menu"
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "h-12 px-8 text-xs font-semibold uppercase tracking-[0.2em]")}
            >
              Explore the collection
            </Link>
            <Link
              href="/menu?category=combos"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 border-border/80 bg-background/30 px-8 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-sm"
              )}
            >
              Curated pairings
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        className="pointer-events-none absolute -left-32 bottom-0 z-[1] size-[28rem] rounded-full bg-primary/25 blur-[120px]"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.2, delay: 0.9 }}
        className="pointer-events-none absolute -right-20 top-1/4 z-[1] size-[22rem] rounded-full bg-primary/20 blur-[100px]"
        aria-hidden
      />
    </section>
  );
};

export default Hero;
