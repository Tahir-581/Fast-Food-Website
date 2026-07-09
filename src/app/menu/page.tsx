'use client';

import React, { useMemo, useEffect } from 'react';
import { useShopStore } from '@/lib/store';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard/ProductCard';
import CategoryTabs from '@/components/menu/CategoryTabs/CategoryTabs';
import OmniSearch from '@/components/menu/OmniSearch/OmniSearch';
import ComboCard from '@/components/menu/ComboCard/ComboCard';
import UpsellSection from '@/components/menu/UpsellSection/UpsellSection';
import styles from "./page.module.css";
import MenuSkeleton from "@/components/menu/MenuSkeleton/MenuSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const MenuPage = () => {
  const { categories, fetchMenu, isLoading } = useShopStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const activeCategory = searchParams.get('category') || 'burgers';
  const dietaryFilter = searchParams.get('dietary');
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu, activeCategory, dietaryFilter, searchQuery]);

  const setActiveCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', slug);
    router.push(`/menu?${params.toString()}`, { scroll: false });
  };

  const currentCategory = useMemo(() => {
    return categories.find((c: any) => c.slug === activeCategory) || categories[0];
  }, [categories, activeCategory]);

  const filteredProducts = useMemo(() => {
    if (!currentCategory) return [];
    
    return currentCategory.products.filter((product: any) => {
      const matchesSearch = !searchQuery || 
                            product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDietary = !dietaryFilter || 
                             (product.dietaryTags && product.dietaryTags.toUpperCase().includes(dietaryFilter.toUpperCase()));

      return matchesSearch && matchesDietary;
    });
  }, [currentCategory, searchQuery, dietaryFilter]);

  // Featured logic
  const featuredProduct = useMemo(() => {
    if (!searchQuery && !dietaryFilter && filteredProducts.length > 0) {
      return filteredProducts[0];
    }
    return null;
  }, [searchQuery, dietaryFilter, filteredProducts]);

  const displayProducts = useMemo(() => {
    if (featuredProduct) {
      return filteredProducts.filter((p: any) => p.id !== featuredProduct.id);
    }
    return filteredProducts;
  }, [filteredProducts, featuredProduct]);

  if (isLoading && categories.length === 0) {
    return (
      <main className={cn(styles.menuPage, "mesh-bg")}>
        <div className={styles.container}>
          <MenuSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className={cn(styles.menuPage, "mesh-bg")}>
      <header className={styles.hero}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className={styles.badge}>CURATED COLLECTION</span>
            <h1 className={styles.title}>
              {currentCategory?.name || 'The Forbidden List'}
            </h1>
            <p className={styles.subtitle}>
              Flame-licked signatures, harvested accompaniments, and artisanal elixirs.
            </p>
          </motion.div>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.container}>
          <div className={styles.controlsWrapper}>
            <CategoryTabs 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory} 
            />
            <OmniSearch />
          </div>
        </div>
      </div>

      <section className={styles.menuContent}>
        <div className={styles.container}>
          <AnimatePresence mode="popLayout">
            <motion.div 
              key={`${activeCategory}-${searchQuery}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.productGrid}
            >
              {featuredProduct && <ComboCard product={featuredProduct} />}
              
              {displayProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <div className={styles.emptyState}>
              <div className="flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-muted/30 text-primary">
                <Sparkles className="size-8" strokeWidth={1.25} />
              </div>
              <h3>Nothing matches the frequency</h3>
              <p>Your search returned no matches. Adjust your filters to discover the embers.</p>
              <Button type="button" variant="outline" className="mt-2" onClick={() => router.push("/menu?category=burgers")}>
                Reset selection
              </Button>
            </div>
          )}
        </div>
      </section>

      <UpsellSection />
    </main>
  );
};

export default MenuPage;
