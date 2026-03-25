'use client';

import React, { useEffect, useState } from 'react';
import { Package, ChefHat, Bike, CheckCircle, Clock } from 'lucide-react';
import Card from '@/components/ui/Card/Card';
import styles from './page.module.css';

const OrderTrackingPage = () => {
  const [status, setStatus] = useState(1); // 0: Received, 1: Prep, 2: Out, 3: Delivered

  // Simulate progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(prev => (prev < 3 ? prev + 1 : prev));
    }, 5000);
    return () => clearTimeout(timer);
  }, [status]);

  const steps = [
    { id: 0, label: 'Order Received', icon: Package },
    { id: 1, label: 'In the Kitchen', icon: ChefHat },
    { id: 2, label: 'Out for Delivery', icon: Bike },
    { id: 3, label: 'Delivered', icon: CheckCircle },
  ];

  return (
    <div className={styles.trackingPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Track Your Order</h1>
          <p className={styles.orderId}>Order #9382104</p>
        </div>

        <section className={styles.statusSection}>
          <div className={styles.progressBar}>
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`${styles.step} ${status >= step.id ? styles.active : ''} ${status === step.id ? styles.current : ''}`}
              >
                <div className={styles.iconWrapper}>
                  <step.icon size={24} />
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
                {index < steps.length - 1 && <div className={styles.line} />}
              </div>
            ))}
          </div>
        </section>

        <div className={styles.detailsGrid}>
          <Card className={styles.estimateCard}>
            <div className={styles.cardHeader}>
              <Clock size={20} className={styles.primaryIcon} />
              <h3>Estimated Time</h3>
            </div>
            <p className={styles.timeValue}>12 - 18 mins</p>
            <p className={styles.subtitle}>Arriving at 12:45 PM</p>
          </Card>

          <Card className={styles.courierCard}>
            <div className={styles.cardHeader}>
              <Bike size={20} className={styles.primaryIcon} />
              <h3>Your Courier</h3>
            </div>
            <div className={styles.courierInfo}>
              <div className={styles.avatar}>T</div>
              <div>
                <p className={styles.courierName}>Tahir</p>
                <p className={styles.courierRating}>⭐ 4.9 (2.4k orders)</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
