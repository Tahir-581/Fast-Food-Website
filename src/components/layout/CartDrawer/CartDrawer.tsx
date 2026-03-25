'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Truck } from 'lucide-react';
import { useShopStore } from '@/lib/store';
import Button from '@/components/ui/Button/Button';
import styles from './CartDrawer.module.css';

const FREE_DELIVERY_THRESHOLD = 40;

function cartItemUnitPrice(item: any): number {
  const base = item.basePrice ?? item.price ?? 0;
  const modSum = (item.customizations || []).reduce(
    (sum: number, m: { price?: number }) => sum + (m?.price ?? 0),
    0
  );
  return base + modSum;
}

function productListPrice(p: any): number {
  return p.basePrice ?? p.price ?? 0;
}

const listVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeItem, getTotalPrice, addItem, categories } = useShopStore();

  const totalPrice = getTotalPrice();
  const deliveryProgress = Math.min((totalPrice / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const amountToFree = Math.max(FREE_DELIVERY_THRESHOLD - totalPrice, 0);

  const upsellItems = useMemo(() => {
    // Flatten products from sides and drinks categories
    const relevantCategories = categories.filter((c: any) => 
      c.slug === 'sides' || c.slug === 'drinks'
    );
    const allRelevantProducts = relevantCategories.flatMap((c: any) => c.products || []);
    const cartIds = cart.map((item: any) => item.id);
    
    return allRelevantProducts
      .filter((p: any) => !cartIds.includes(p.id))
      .slice(0, 3);
  }, [cart, categories]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div 
          className={styles.overlay} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div 
            className={styles.drawer} 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >

            <header className={styles.header}>
              <div className={styles.titleWrapper}>
                <ShoppingBag size={20} className={styles.bagIcon} />
                <h2 className={styles.title}>Your Bag</h2>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
                <X size={24} />
              </button>
            </header>

            <div className={styles.content}>
              {cart.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🥡</div>
                  <h3 className={styles.emptyTitle}>Your bag is empty</h3>
                  <p className={styles.emptyText}>Your bag is waiting for its first selection.</p>
                  <Button 
                    variant="primary" 
                    size="md" 
                    onClick={() => setIsCartOpen(false)}
                  >
                    Start Ordering
                  </Button>
                </div>
              ) : (
                <>
                  {/* Free Delivery Tracker */}
                  <div className={styles.deliveryTracker}>
                    <div className={styles.trackerHeader}>
                      <Truck size={16} />
                      <span>
                        {amountToFree > 0 
                          ? `$${amountToFree.toFixed(2)} away from FREE delivery` 
                          : 'You earned FREE delivery!'}
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <motion.div 
                        className={styles.progressFill} 
                        initial={{ width: 0 }}
                        animate={{ width: `${deliveryProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <motion.div 
                    className={styles.itemList}
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <AnimatePresence mode="popLayout">
                      {cart.map((item: any) => {
                        const lineKey = item.customizationId || item.id;
                        return (
                        <motion.div 
                          key={lineKey} 
                          layout
                          variants={itemVariants}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={styles.cartItem}
                        >
                          <div className={styles.itemMain}>
                            <div className={styles.itemInfo}>
                              <h4 className={styles.itemName}>{item.name}</h4>
                              <p className={styles.itemPrice}>${cartItemUnitPrice(item).toFixed(2)}</p>
                            </div>
                            
                            <div className={styles.quantityControls}>
                              <button 
                                className={styles.qtyBtn}
                                onClick={() => updateQuantity(lineKey, item.quantity - 1)}
                              >
                                <Minus size={14} />
                              </button>
                              <span className={styles.qtyValue}>{item.quantity}</span>
                              <button 
                                className={styles.qtyBtn}
                                onClick={() => updateQuantity(lineKey, item.quantity + 1)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                          <button className={styles.removeBtn} onClick={() => removeItem(lineKey)}>
                            Remove
                          </button>
                        </motion.div>
                      );})}
                    </AnimatePresence>
                  </motion.div>

                  {/* Quick Upsell Section */}
                  {upsellItems.length > 0 && (
                    <motion.div 
                      className={styles.upsellSection}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className={styles.upsellHeader}>
                        <Sparkles size={14} className={styles.sparkle} />
                        <span>PREMIERE PAIRINGS</span>
                      </div>
                      <div className={styles.upsellList}>
                        {upsellItems.map((item: any) => (
                          <div key={item.id} className={styles.upsellItem}>
                            <div className={styles.upsellInfo}>
                              <span className={styles.upsellEmoji}>
                                {item.category === 'sides' ? '🍟' : '🥤'}
                              </span>
                              <div className={styles.upsellText}>
                                <p className={styles.upsellName}>{item.name}</p>
                                <p className={styles.upsellPrice}>+${productListPrice(item).toFixed(2)}</p>
                              </div>
                            </div>
                            <button 
                              className={styles.upsellAdd}
                              onClick={() => addItem(item)}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {cart.length > 0 && (
              <footer className={styles.footer}>
                <div className={styles.summary}>
                  <div className={styles.row}>
                    <span>Selection Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <p className={styles.taxNote}>Taxes and fees calculated at checkout</p>
                </div>
                
                <div className={styles.footerActions}>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth 
                    className={styles.checkoutBtn}
                    onClick={() => {
                      setIsCartOpen(false);
                      window.location.href = '/cart';
                    }}
                  >
                    View Selection <ArrowRight size={18} />
                  </Button>
                </div>
              </footer>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default CartDrawer;
