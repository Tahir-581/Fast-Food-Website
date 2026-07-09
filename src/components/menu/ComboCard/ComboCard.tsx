import React from 'react';
import { Plus, Flame, Star } from 'lucide-react';
import { Product } from '@/lib/mockData';
import { useShopStore } from '@/lib/store';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Card from '@/components/ui/Card/Card';
import styles from './ComboCard.module.css';

interface ComboCardProps {
  product: Product;
}

const ComboCard: React.FC<ComboCardProps> = ({ product }) => {
  const addItem = useShopStore((state) => state.addItem);
  const setSelectedDrawerProduct = useShopStore((state) => state.setSelectedDrawerProduct);
  const p = product as Product & { basePrice?: number };
  const unitPrice = Number(p.price ?? p.basePrice ?? 0);

  return (
    <Card 
      padding="none" 
      hoverable 
      className={styles.comboCard}
      onClick={() => setSelectedDrawerProduct(product)}
    >
      <div className={styles.imageWrapper}>
        <div className={styles.imagePlaceholder}>
          <div className={styles.glow} />
          <span className={styles.categoryIcon}>🍱</span>
        </div>
        <div className={styles.badgeWrapper}>
          <Badge variant="default" className={styles.comboBadge}>
            <Star size={14} fill="currentColor" /> BEST VALUE COMBO
          </Badge>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.name}>{product.name}</h2>
          <div className={styles.priceTag}>
            <span className={styles.oldPrice}>${(unitPrice * 1.2).toFixed(2)}</span>
            <span className={styles.price}>${unitPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <p className={styles.description}>{product.description}</p>

        <div className={styles.footer}>
          <div className={styles.meta}>
            <div className={styles.info}>
              <Flame size={16} className={styles.flameIcon} />
              <span>{product.calories} kcal</span>
            </div>
            <span className={styles.dot}>•</span>
            <span className={styles.includes}>Includes Fries & Drink</span>
          </div>
          
          <Button
            type="button"
            size="lg"
            variant="default"
            className={styles.addButton}
            onClick={(e) => {
              e.stopPropagation();
              addItem(product);
            }}
          >
            Add Combo <Plus size={20} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ComboCard;
