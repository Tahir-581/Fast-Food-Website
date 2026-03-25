'use client';

import React from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { Package, MapPin, CreditCard, ChevronRight, Edit2 } from 'lucide-react';
import styles from '../page.module.css';

interface OrderReviewProps {
  onPlaceOrder: () => void;
  onEditStep: (step: number) => void;
  checkoutData: any;
  cart: any[];
  total: number;
}

const OrderReview: React.FC<OrderReviewProps> = ({ 
  onPlaceOrder, 
  onEditStep, 
  checkoutData, 
  cart, 
  total 
}) => {
  return (
    <div className={styles.stepContainer}>
      <Card className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <Package size={24} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>4. Final Review</h2>
        </div>

        <div className={styles.reviewGrid}>
          {/* Identity Review */}
          <div className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewTitle}>
                <Edit2 size={16} onClick={() => onEditStep(1)} className={styles.editIcon} />
                <span>Contact Info</span>
              </div>
            </div>
            <div className={styles.reviewContent}>
              <p>{checkoutData.identity.email}</p>
              <p className={styles.label}>{checkoutData.identity.isGuest ? 'Guest Order' : 'Logged In'}</p>
            </div>
          </div>

          {/* Fulfillment Review */}
          <div className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewTitle}>
                <MapPin size={16} />
                <span>{checkoutData.fulfillment.method === 'delivery' ? 'Delivery Address' : 'Pickup Location'}</span>
              </div>
              <Edit2 size={16} onClick={() => onEditStep(2)} className={styles.editIcon} />
            </div>
            <div className={styles.reviewContent}>
              <p>{checkoutData.fulfillment.address || '123 Ember St, Suite 400'}</p>
              {checkoutData.fulfillment.instructions && (
                <p className={styles.instructions}>"{checkoutData.fulfillment.instructions}"</p>
              )}
            </div>
          </div>

          {/* Payment Review */}
          <div className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewTitle}>
                <CreditCard size={16} />
                <span>Payment Method</span>
              </div>
              <Edit2 size={16} onClick={() => onEditStep(3)} className={styles.editIcon} />
            </div>
            <div className={styles.reviewContent}>
              <p>{checkoutData.payment.method.toUpperCase()} PAY</p>
              <p className={styles.label}>Ending in **** 9012</p>
            </div>
          </div>
        </div>

        <div className={styles.stepActions}>
          <Button 
            variant="primary" 
            size="lg" 
            fullWidth 
            onClick={onPlaceOrder}
            className={styles.placeOrderBtn}
          >
            Confirm & Place Order — ${total.toFixed(2)} <ChevronRight size={20} />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderReview;
