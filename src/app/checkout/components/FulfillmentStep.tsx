'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card/Card';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import { MapPin, ShoppingBag, Truck, Map, Clock, ChevronRight } from 'lucide-react';
import styles from '../page.module.css';

interface FulfillmentStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const FulfillmentStep: React.FC<FulfillmentStepProps> = ({ onNext, onBack }) => {
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [time, setTime] = useState('ASAP');

  const commonInstructions = ["Leave at door", "Call upon arrival", "Hand to me"];

  const handleNext = () => {
    onNext({ method, address, instructions, time });
  };

  return (
    <div className={styles.stepContainer}>
      <Card className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <MapPin size={24} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>2. How do you want it?</h2>
        </div>

        <div className={styles.methodToggle}>
          <button
            className={`${styles.toggleBtn} ${method === 'delivery' ? styles.active : ''}`}
            onClick={() => setMethod('delivery')}
          >
            <Truck size={20} />
            <span>Delivery</span>
          </button>
          <button
            className={`${styles.toggleBtn} ${method === 'pickup' ? styles.active : ''}`}
            onClick={() => setMethod('pickup')}
          >
            <ShoppingBag size={20} />
            <span>Pickup</span>
          </button>
        </div>

        <div className={styles.fulfillmentForm}>
          {method === 'delivery' ? (
            <div className={styles.deliveryForm}>
              <Input
                label="Delivery Address"
                placeholder="Start typing your address..."
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                icon={<Map size={18} />}
              />
              <div className={styles.miniMap}>
                <div className={styles.mapPlaceholder}>
                  <MapPin size={32} />
                  <span>Confirming your location...</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Delivery Instructions</label>
                <div className={styles.instructionTags}>
                  {commonInstructions.map(tag => (
                    <button
                      key={tag}
                      className={`${styles.tagBtn} ${instructions === tag ? styles.active : ''}`}
                      onClick={() => setInstructions(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <textarea
                  className={styles.textarea}
                  placeholder="Apartment number, building name, or special instructions..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className={styles.pickupForm}>
              <Card className={styles.storeCard}>
                <div className={styles.storeInfo}>
                  <strong>Midnight & Ember — Downtown</strong>
                  <span>123 Ember St, Suite 400</span>
                  <span>Open until 2:00 AM</span>
                </div>
                <Button variant="outline" size="sm">Change Store</Button>
              </Card>
            </div>
          )}

          <div className={styles.timeSection}>
            <div className={styles.sectionHeaderSmall}>
              <Clock size={18} />
              <h3>Order Time</h3>
            </div>
            <div className={styles.timeOptions}>
              <button
                className={`${styles.timeBtn} ${time === 'ASAP' ? styles.active : ''}`}
                onClick={() => setTime('ASAP')}
              >
                ASAP (25-35 mins)
              </button>
              <button
                className={`${styles.timeBtn} ${time === 'scheduled' ? styles.active : ''}`}
                onClick={() => setTime('scheduled')}
              >
                Schedule for later
              </button>
            </div>
          </div>

          <div className={styles.stepActions}>
            <Button variant="ghost" onClick={onBack}>Go Back</Button>
            <Button variant="primary" size="lg" onClick={handleNext}>
              Payment & Review <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FulfillmentStep;
