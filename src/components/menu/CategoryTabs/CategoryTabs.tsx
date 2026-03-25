import React from 'react';
import { useShopStore } from '@/lib/store';
import styles from './CategoryTabs.module.css';

interface CategoryTabsProps {
  activeCategory: string;
  setActiveCategory: (slug: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, setActiveCategory }) => {
  const { categories } = useShopStore();

  return (
    <nav className={styles.categoryTabs}>
      <div className={styles.container}>
        <div className={styles.scrollWrapper}>
          {categories.map((category: any) => (
            <button
              key={category.id}
              className={`${styles.tab} ${activeCategory === category.slug ? styles.active : ''}`}
              onClick={() => setActiveCategory(category.slug)}
            >
              <span className={styles.icon}>
                {category.slug === 'burgers' ? '🍔' : 
                 category.slug === 'sides' ? '🍟' : 
                 category.slug === 'drinks' ? '🥤' : '🍨'}
              </span>
              <span className={styles.name}>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryTabs;
