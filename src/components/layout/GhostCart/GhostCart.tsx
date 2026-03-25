'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useShopStore } from '@/lib/store';
import styles from './GhostCart.module.css';

const GhostCart = () => {
  const { cart, isCartOpen, setIsCartOpen, getTotalPrice } = useShopStore();
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = getTotalPrice();

  // Only show if there are items and the main drawer is NOT open
  if (totalItems === 0 || isCartOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.ghostBar}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsCartOpen(true)}
      >
        <div className={styles.container}>
          <div className={styles.info}>
            <div className={styles.bagWrapper}>
              <ShoppingBag size={18} />
              <span className={styles.badge}>{totalItems}</span>
            </div>
            <div className={styles.text}>
              <span className={styles.label}>Your Selection</span>
              <span className={styles.price}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <div className={styles.action}>
            <span>View Bag</span>
            <ArrowRight size={16} />
          </div>
        </div>
        
        {/* Cinematic Under-glow */}
        <div className={styles.glow} />
      </motion.div>
    </AnimatePresence>
  );
};

export default GhostCart;
