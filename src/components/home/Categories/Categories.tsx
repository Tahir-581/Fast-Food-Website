'use client';

import React from 'react';
import Link from 'next/link';
import { useShopStore } from '@/lib/store';
import styles from './Categories.module.css';

const Categories = () => {
  const { categories, fetchMenu } = useShopStore();

  React.useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        <div className={styles.scrollWrapper}>
          {categories.map((category: any) => (
            <Link 
              key={category.id} 
              href={`/menu?category=${category.slug}`}
              className={styles.categoryCard}
            >
              <span className={styles.icon}>
                {category.slug === 'burgers' ? '🍔' : 
                 category.slug === 'sides' ? '🍟' : 
                 category.slug === 'drinks' ? '🥤' : '🍨'}
              </span>
              <span className={styles.name}>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
