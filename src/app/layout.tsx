import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import CartDrawer from "@/components/layout/CartDrawer/CartDrawer";
import ProductDrawer from "@/components/layout/ProductDrawer/ProductDrawer";
import AuthDrawer from "@/components/layout/AuthDrawer/AuthDrawer";
import GhostCart from "@/components/layout/GhostCart/GhostCart";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Midnight & Ember | Premium Fast Food Experience",
  description: "High-end fast food ordering platform with seamless UX and modern design.",
};

const THEME_BOOTSTRAP = `(function(){var e=document.documentElement,t=["light","dark"];function n(){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}try{var o=localStorage.getItem("theme")||"dark",r="system"===o?n():o;t.forEach(function(t){e.classList.remove(t)}),e.classList.add(r),("light"===r||"dark"===r)&&(e.style.colorScheme=r)}catch(i){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, outfit.variable)}>
      <head>
        {/* Sync theme before paint. */}
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[2000] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <ProductDrawer />
          <AuthDrawer />
          <GhostCart />
        </Providers>
      </body>
    </html>
  );
}
