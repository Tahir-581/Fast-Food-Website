'use client';

import React, { useState, useEffect } from 'react';
import { useShopStore } from '@/lib/store';
import Button from '@/components/ui/Button/Button';
import { CreditCard, Truck, MapPin, Phone, User, ChevronRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';

const CheckoutPage = () => {
  const { data: session } = useSession();
  const { cart, getTotalPrice, clearCart } = useShopStore();
  const [isOrdering, setIsOrdering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');

  const subtotal = getTotalPrice();
  const deliveryFee = deliveryMethod === 'delivery' ? (subtotal > 40 ? 0 : 5.00) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);
    
    try {
      const payload = {
        items: cart,
        subtotal,
        tax,
        deliveryFee,
        total,
        type: deliveryMethod.toUpperCase(),
        address: deliveryMethod === 'delivery' ? '123 Midnight St, Night City' : 'STUDIO_PICKUP'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Order failed');
      
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      alert('Transaction failed. Please refine your selection.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (isSuccess) {
    return (
      <main className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle2 size={80} strokeWidth={1.5} />
          </div>
          <h1 className={styles.successTitle}>It’s Official.</h1>
          <p className={styles.successText}>
            Your order is being prioritized. 
            We’ll notify you when the magic starts. Check your Studio for real-time tracking.
          </p>
          <div className={styles.successActions}>
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/studio'}>
              Track in Studio
            </Button>
            <Button variant="secondary" size="lg" onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.checkoutPage}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.mainContent}>
            <h1 className={styles.title}>Secure <span className={styles.highlight}>Checkout</span></h1>
            
            <div className={styles.steps}>
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.stepNumber}>1</div>
                  <h2 className={styles.sectionTitle}>Delivery Details</h2>
                </div>
                <div className={styles.methodToggle}>
                  <button 
                    className={`${styles.methodBtn} ${deliveryMethod === 'delivery' ? styles.active : ''}`}
                    onClick={() => setDeliveryMethod('delivery')}
                  >
                    <Truck size={20} />
                    <span>Concierge Delivery</span>
                  </button>
                  <button 
                    className={`${styles.methodBtn} ${deliveryMethod === 'pickup' ? styles.active : ''}`}
                    onClick={() => setDeliveryMethod('pickup')}
                  >
                    <ShoppingBag size={20} />
                    <span>Studio Pickup</span>
                  </button>
                </div>
              </section>

              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.stepNumber}>2</div>
                  <h2 className={styles.sectionTitle}>Contact Information</h2>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <User size={18} />
                    <input type="text" placeholder="Full Name" defaultValue={session?.user?.name || ''} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <Phone size={18} />
                    <input type="tel" placeholder="Phone Number" required />
                  </div>
                </div>
              </section>

              {deliveryMethod === 'delivery' && (
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.stepNumber}>3</div>
                    <h2 className={styles.sectionTitle}>Delivery Address</h2>
                  </div>
                  <div className={styles.addressInput}>
                    <MapPin size={18} />
                    <input type="text" placeholder="Street Address, Apt / Suite" required />
                  </div>
                </section>
              )}

              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.stepNumber}>{deliveryMethod === 'delivery' ? 4 : 3}</div>
                  <h2 className={styles.sectionTitle}>Secure Payment</h2>
                </div>
                <div className={styles.paymentCard}>
                  <div className={styles.cardHeader}>
                    <CreditCard size={20} />
                    <span>Credit or Debit Card</span>
                  </div>
                  <div className={styles.cardForm}>
                    <input type="text" placeholder="Card Number" className={styles.fullWidth} />
                    <div className={styles.cardRow}>
                      <input type="text" placeholder="MM / YY" />
                      <input type="text" placeholder="CVC" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.orderSummary}>
              <h3 className={styles.summaryTitle}>Review Selection</h3>
              <div className={styles.itemsList}>
                {cart.map(item => (
                  <div key={item.customizationId || item.id} className={styles.summaryItem}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemQty}>{item.quantity}x</span>
                      <div>
                        <span className={styles.itemName}>{item.name}</span>
                        {item.customizations && item.customizations.length > 0 && (
                          <div className={styles.itemMods}>
                            {item.customizations.map((mod: any) => (
                              <span key={mod.id} className={styles.modLabel}>
                                + {mod.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={styles.itemPrice}>
                      ${((item.basePrice || item.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className={styles.bill}>
                <div className={styles.row}>
                  <span>Selection Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.row}>
                  <span>{deliveryMethod === 'delivery' ? 'Concierge Delivery' : 'Service Fee'}</span>
                  <span>{deliveryFee === 0 ? 'COMPLIMENTARY' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className={styles.row}>
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className={`${styles.row} ${styles.total}`}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                fullWidth 
                className={styles.placeOrderBtn}
                onClick={handlePlaceOrder}
                loading={isOrdering}
                disabled={cart.length === 0}
              >
                Complete Order <ChevronRight size={18} />
              </Button>
              
              <p className={styles.terms}>
                By completing this order, you agree to the Midnight & Ember Terms of Service.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
