'use client';

import React from 'react';
import Link from 'next/link';
import { useShopStore } from '@/lib/store';
import Button from '@/components/ui/Button/Button';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, Truck, Info, CreditCard, Sparkles } from 'lucide-react';
import styles from './page.module.css';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, getTotalPrice } = useShopStore();
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 40 ? 0 : 5.00;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  if (cart.length === 0) {
    return (
      <main className={styles.emptyContainer}>
        <div className={styles.emptyContent}>
          <div className={styles.emptyIcon}>🥡</div>
          <h1 className={styles.title}>Your bag is empty</h1>
          <p className={styles.description}>
            It looks like you haven't added anything to your bag yet. 
            Explore our menu to find your next favorite meal.
          </p>
          <Link href="/menu">
            <Button variant="primary" size="lg">Discover the Menu</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.cartPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/menu" className={styles.backLink}>
            <ArrowLeft size={18} />
            <span>Continue Browsing</span>
          </Link>
          <h1 className={styles.title}>Your <span className={styles.highlight}>Order Bag</span></h1>
        </div>

        <div className={styles.layout}>
          {/* Item List */}
          <div className={styles.itemList}>
            {cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <span className={styles.emoji}>{item.category === 'burgers' ? '🍔' : '🍟'}</span>
                </div>
                
                <div className={styles.itemDetails}>
                  <div className={styles.itemHeader}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  {item.customizations && item.customizations.length > 0 && (
                    <div className={styles.customs}>
                      {item.customizations.map((c, i) => (
                        <span key={i} className={styles.customTag}>{c}</span>
                      ))}
                    </div>
                  )}

                  <div className={styles.itemFooter}>
                    <div className={styles.quantityControls}>
                      <button 
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button 
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <aside className={styles.summary}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              
              <div className={styles.summaryRows}>
                <div className={styles.row}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.row}>
                  <div className={styles.rowLabel}>
                    <span>Estimated Delivery</span>
                    <Truck size={14} className={styles.labelIcon} />
                  </div>
                  <span className={deliveryFee === 0 ? styles.free : ''}>
                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className={styles.row}>
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              {deliveryFee > 0 && (
                <div className={styles.progressBanner}>
                  <Info size={14} />
                  <span>Add ${(40 - subtotal).toFixed(2)} for free delivery</span>
                </div>
              )}

              <div className={styles.totalRow}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link href="/checkout">
                <Button variant="primary" size="lg" fullWidth className={styles.checkoutBtn}>
                  Secure Checkout <CreditCard size={18} />
                </Button>
              </Link>

              <div className={styles.guarantee}>
                <Sparkles size={14} />
                <span>Earn {(total * 5).toFixed(0)} Sparks with this order</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
