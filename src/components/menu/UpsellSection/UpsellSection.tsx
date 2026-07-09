import React from 'react';
import { Plus, Sparkles, Salad, CupSoda } from "lucide-react";
import { products } from "@/lib/mockData";
import { useShopStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import Card from '@/components/ui/Card/Card';
import styles from './UpsellSection.module.css';

const UpsellSection = () => {
  const addItem = useShopStore((state) => state.addItem);
  
  // Example upsell items: Charcoal Fries and Smoked Vanilla Shake
  const upsellItems = products.filter(p => ['s1', 'd1'].includes(p.id));

  if (upsellItems.length === 0) return null;

  return (
    <section className={styles.upsellSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <Sparkles size={20} className={styles.sparkleIcon} />
            <h3 className={styles.title}>Complete Your Spark</h3>
          </div>
          <p className={styles.subtitle}>Our chefs recommend these pairings.</p>
        </div>

        <div className={styles.grid}>
          {upsellItems.map((item) => (
            <Card key={item.id} glass className={styles.upsellCard}>
              <div className={styles.itemInfo}>
                <span className={styles.icon}>
                  {item.category === "sides" ? (
                    <Salad className="size-6 text-primary" strokeWidth={1.5} />
                  ) : (
                    <CupSoda className="size-6 text-primary" strokeWidth={1.5} />
                  )}
                </span>
                <div className={styles.text}>
                  <h4>{item.name}</h4>
                  <span className={styles.price}>+${item.price.toFixed(2)}</span>
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className={styles.addBtn}
                onClick={() => addItem(item)}
                aria-label={`Add ${item.name}`}
              >
                <Plus size={16} />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpsellSection;
