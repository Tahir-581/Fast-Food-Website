'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Flame } from 'lucide-react';
import { Product } from '@/lib/mockData';
import { useShopStore } from '@/lib/store';
import Badge from '@/components/ui/Badge/Badge';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useShopStore((state) => state.addItem);
  const setSelectedDrawerProduct = useShopStore((state) => state.setSelectedDrawerProduct);

  const p = product as Product & { basePrice?: number; imageUrl?: string };
  const unitPrice = Number(p.price ?? p.basePrice ?? 0);
  const imageUrl = p.imageUrl ?? p.image;

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card 
        padding="none" 
        hoverable 
        className={styles.productCard}
        onClick={() => setSelectedDrawerProduct(product)}
      >
        <div className={styles.imageWrapper}>
          {imageUrl ? (
            <div className={styles.imageContainer}>
              <Image 
                src={imageUrl} 
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.productImage}
                priority={product.id.startsWith('b1')} // Priority for first burger
              />
            </div>
          ) : (
            <div className={styles.imagePlaceholder}>
              <div className={styles.glow} />
              <span className={styles.categoryIcon}>{product.id.startsWith('b') ? '🍔' : product.id.startsWith('s') ? '🍟' : '🥤'}</span>
            </div>
          )}

        <div className={styles.badgeWrapper}>
          {product.tags?.map(tag => (
            <Badge 
              key={tag}
              variant={tag === 'Bestseller' ? 'warning' : tag === 'Spicy' ? 'error' : 'info'} 
              size="sm" 
              className={styles.badge}
            >
              {tag.toUpperCase()}
            </Badge>
          ))}
          {product.category === 'burgers' && (
            <Badge variant="success" size="sm" className={styles.badge}>CUSTOMIZABLE</Badge>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{product.name}</h3>
          <span className={styles.price}>${unitPrice.toFixed(2)}</span>
        </div>
        
        <p className={styles.description}>{product.description}</p>

        <div className={styles.footer}>
          <div className={styles.info}>
            <Flame size={14} className={styles.flameIcon} />
            <span>{product.calories != null ? `${product.calories} kcal` : '—'}</span>
          </div>
          
          <Button 
            size="sm" 
            variant="primary" 
            className={styles.addButton}
            onClick={(e) => {
              e.stopPropagation();
              addItem(product);
            }}
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>
    </Card>
    </motion.div>
  );
};

export default ProductCard;

