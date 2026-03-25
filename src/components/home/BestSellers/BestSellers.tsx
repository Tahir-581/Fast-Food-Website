'use client';

import React from 'react';
import { useShopStore } from '@/lib/store';
import ProductCard from '@/components/ui/ProductCard/ProductCard';
import Button from '@/components/ui/Button/Button';
import styles from './BestSellers.module.css';

const BestSellers = () => {
  const { categories, fetchMenu } = useShopStore();

  React.useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // Flatten products from all categories and pick the best ones
  const allProducts = categories.flatMap(cat => cat.products || []);
  const bestSellers = allProducts.slice(0, 3); // Simple selection for now

  return (
    <section className={styles.bestSellers}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleInfo}>
            <span className={styles.badge}>FAN FAVORITES</span>
            <h2 className={styles.title}>Most Wanted Melts</h2>
          </div>
          <Button variant="secondary" size="md">View All Menu</Button>
        </div>

        <div className={styles.grid}>
          {bestSellers.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
