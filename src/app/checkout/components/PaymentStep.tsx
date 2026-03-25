'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card/Card';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import { CreditCard, Tag, CheckCircle, Lock, ChevronRight } from 'lucide-react';
import styles from '../page.module.css';

interface PaymentStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  total: number;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ onNext, onBack, total }) => {
  const [method, setMethod] = useState<'card' | 'apple' | 'google'>('card');
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const handleApplyPromo = () => {
    if (promoCode) {
      setIsPromoApplied(true);
    }
  };

  const handleNext = () => {
    onNext({ method, promoCode });
  };

  return (
    <div className={styles.stepContainer}>
      <Card className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <CreditCard size={24} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>3. Payment Method</h2>
        </div>

        <div className={styles.paymentOptions}>
          <button
            className={`${styles.paymentBtnWide} ${method === 'apple' ? styles.active : ''}`}
            onClick={() => setMethod('apple')}
          >
            <div className={styles.paymentIconPlaceholder}>Apple Pay</div>
          </button>
          <button
            className={`${styles.paymentBtnWide} ${method === 'google' ? styles.active : ''}`}
            onClick={() => setMethod('google')}
          >
            <div className={styles.paymentIconPlaceholder}>Google Pay</div>
          </button>
        </div>

        <div className={styles.divider}>
          <span>OR PAY WITH CARD</span>
        </div>

        <div className={styles.cardForm}>
          <Input label="Card Number" placeholder="**** **** **** ****" fullWidth icon={<Lock size={16} />} />
          <div className={styles.row}>
            <Input label="Expiry Date" placeholder="MM/YY" fullWidth />
            <Input label="CVC" placeholder="***" fullWidth />
          </div>
        </div>

        <div className={styles.promoSection}>
          <div className={styles.promoHeader}>
            <Tag size={18} />
            <span>Promo Code</span>
          </div>
          <div className={styles.promoInputRow}>
            <input
              type="text"
              placeholder="Enter code"
              className={styles.promoInput}
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={isPromoApplied}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleApplyPromo}
              disabled={!promoCode || isPromoApplied}
            >
              {isPromoApplied ? <CheckCircle size={18} /> : 'Apply'}
            </Button>
          </div>
          {isPromoApplied && (
            <span className={styles.promoSuccess}>Promo code applied! -$5.00</span>
          )}
        </div>

        <div className={styles.trustShield}>
          <Lock size={16} />
          <span>Your payment is secure and encrypted by AES-256</span>
        </div>

        <div className={styles.stepActions}>
          <Button variant="ghost" onClick={onBack}>Go Back</Button>
          <Button variant="primary" size="lg" onClick={handleNext}>
            Final Review <ChevronRight size={20} />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentStep;
