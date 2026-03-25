'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Flame, Minus, Plus } from 'lucide-react';
import { useShopStore } from '@/lib/store';
import Button from '@/components/ui/Button/Button';
import styles from './ProductDrawer.module.css';

const ProductDrawer = () => {
  const { selectedDrawerProduct, setSelectedDrawerProduct, addItem } = useShopStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<any[]>([]);

  const product: any = selectedDrawerProduct;
  const basePrice = product?.price || product?.basePrice || 0;
  
  // Flatten modifiers for easier calculation
  // Calculation logic with relational data
  const modifierPrice = selectedModifiers.reduce((sum: number, mod: any) => sum + (mod.priceModifier || 0), 0);
  const totalPrice = (basePrice + modifierPrice) * quantity;

  // Validation logic
  const isSelectionValid = (product?.modifierGroups || []).every((group: any) => {
    if (!group.isRequired || group.minSelection === 0) return true;
    const selectedInGroup = selectedModifiers.filter((m: any) => 
      group.options.some((o: any) => o.id === m.id)
    ).length;
    return selectedInGroup >= group.minSelection;
  });

  const handleClose = () => {
    setSelectedDrawerProduct(null);
    setQuantity(1);
    setSelectedModifiers([]);
  };

  const handleAddToCart = () => {
    if (!isSelectionValid) return;
    
    // Store customization details
    const customizations = selectedModifiers.map((m: any) => ({
      id: m.id,
      name: m.name,
      price: m.priceModifier
    }));

    if (selectedDrawerProduct) {
      addItem(selectedDrawerProduct, quantity, customizations);
      handleClose();
    }
  };

  const toggleModifier = (group: any, option: any) => {
    setSelectedModifiers((prev: any[]) => {
      const isSelected = prev.some((m: any) => m.id === option.id);
      
      if (isSelected) {
        // Only allow unselecting if it doesn't violate minSelection (simplified for UI)
        return prev.filter((m: any) => m.id !== option.id);
      }

      const selectedInGroup = prev.filter((m: any) => 
        group.options.some((o: any) => o.id === m.id)
      );

      if (group.maxSelection === 1) {
        // Radio logic
        const filtered = prev.filter((m: any) => !group.options.some((o: any) => o.id === m.id));
        return [...filtered, option];
      }

      if (selectedInGroup.length < group.maxSelection) {
        return [...prev, option];
      }

      return prev;
    });
  };

  const modifierGroups = product?.modifierGroups || [];

  return (
    <AnimatePresence>
      {selectedDrawerProduct && (
        <motion.div 
          className={styles.overlay} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div 
            className={styles.drawer} 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className={styles.header}>
              <div className={styles.headerTitle}>
                <span className={styles.studioLabel}>PRODUCT STUDIO</span>
                <h2 className={styles.productTitle}>{product.name}</h2>
              </div>
              <button className={styles.closeBtn} onClick={handleClose}>
                <X size={24} />
              </button>
            </header>

            <div className={styles.content}>
              <div className={styles.visualSection}>
                <div className={styles.imagePlaceholder}>
                  {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill
                      className={styles.productImg}
                    />
                  ) : (
                    <div className={styles.glowIcon}>✦</div>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.meta}>
                    <span className={styles.price}>${basePrice.toFixed(2)}</span>
                    {product.calories && (
                      <div className={styles.calories}>
                        <Flame size={14} />
                        <span>{product.calories} kcal</span>
                      </div>
                    )}
                  </div>
                  <p className={styles.description}>{product.description}</p>
                </div>
              </div>

              <div className={styles.customizationWrapper}>
                {modifierGroups.map((group: any) => (
                  <section key={group.id} className={styles.customizationGroup}>
                    <div className={styles.groupHeader}>
                      <div>
                        <h3 className={styles.groupTitle}>{group.name}</h3>
                        <p className={styles.groupSubtitle}>
                          {group.minSelection > 0 
                            ? `Selection required (min ${group.minSelection})` 
                            : `Optional enhancements (max ${group.maxSelection})`}
                        </p>
                      </div>
                    </div>
                    <div className={styles.optionsList}>
                      {group.options.map((option: any) => {
                        const isSelected = selectedModifiers.some(m => m.id === option.id);
                        return (
                          <motion.button 
                            key={option.id} 
                            whileTap={{ scale: 0.98 }}
                            className={`${styles.optionBtn} ${isSelected ? styles.active : ''}`}
                            onClick={() => toggleModifier(group, option)}
                          >
                            <span className={styles.optionName}>{option.name}</span>
                            {option.priceModifier > 0 && (
                              <span className={styles.optionPrice}>+${option.priceModifier.toFixed(2)}</span>
                            )}
                            {isSelected && <motion.div layoutId="check" className={styles.check}>✦</motion.div>}
                          </motion.button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <footer className={styles.footer}>
              <div className={styles.footerControls}>
                <div className={styles.quantityWrapper}>
                  <button 
                    className={styles.qtyBtn} 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={18} />
                  </button>
                  <span className={styles.quantity}>{quantity}</span>
                  <button 
                    className={styles.qtyBtn} 
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                
                <Button 
                  variant="primary" 
                  size="lg" 
                  fullWidth 
                  onClick={handleAddToCart}
                  disabled={!isSelectionValid}
                  className={styles.submitBtn}
                >
                  Confirm — ${totalPrice.toFixed(2)}
                </Button>
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

  );
};


export default ProductDrawer;
