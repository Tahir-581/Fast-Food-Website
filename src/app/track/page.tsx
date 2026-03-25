'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ShoppingBag, Clock, CheckCircle2, Truck, Loader2, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import Link from 'next/link';
import styles from './page.module.css';

const TrackPage = () => {
  const { data: session } = useSession();
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLatestOrder = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLatestOrder(data[0]); // Most recent
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchLatestOrder();
  }, [session]);

  if (isLoading) {
    return (
      <main className={styles.trackPage}>
        <div className={styles.loadingState}>
          <Loader2 className={styles.spinner} size={48} />
          <p>Connecting to the kitchen manifold...</p>
        </div>
      </main>
    );
  }

  if (!latestOrder) {
    return (
      <main className={styles.trackPage}>
        <div className={styles.emptyState}>
          <ShoppingBag size={64} opacity={0.3} />
          <h2>No Active Magic.</h2>
          <p>Your journey with Midnight & Ember hasn't started yet.</p>
          <Link href="/menu">
            <Button variant="primary" size="lg">Explore the Menu</Button>
          </Link>
        </div>
      </main>
    );
  }

  const steps = [
    { key: 'PENDING', label: 'Ordered', icon: ShoppingBag },
    { key: 'PREPARING', label: 'In the Forge', icon: Clock },
    { key: 'READY', label: 'Ready', icon: CheckCircle2 },
    { key: 'DELIVERED', label: 'In Your Hands', icon: Truck },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === latestOrder.status);

  return (
    <main className={styles.trackPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/studio" className={styles.backLink}>
            <ArrowLeft size={20} /> Studio
          </Link>
          <h1 className={styles.title}>Track Your <span className={styles.highlight}>Magic</span></h1>
          <p className={styles.orderId}>#{latestOrder.id.slice(-6).toUpperCase()}</p>
        </div>

        <div className={styles.stepper}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isActive = index === currentStepIndex;

            return (
              <div key={step.key} className={`${styles.step} ${isCompleted ? styles.completed : ''} ${isActive ? styles.active : ''}`}>
                <div className={styles.stepIcon}>
                  <Icon size={24} />
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
                {index < steps.length - 1 && <div className={styles.connector} />}
              </div>
            );
          })}
        </div>

        <div className={styles.detailsLayout}>
          <Card className={styles.infoCard}>
            <h3 className={styles.cardTitle}>Live Status</h3>
            <div className={styles.statusDisplay}>
              <div className={styles.statusPulse} data-status={latestOrder.status} />
              <span className={styles.statusText}>{latestOrder.status}</span>
            </div>
            <p className={styles.timestamp}>Estimated arrival: 25-35 mins</p>
          </Card>

          <Card className={styles.itemsCard}>
            <h3 className={styles.cardTitle}>Your Selection</h3>
            <div className={styles.itemsList}>
              {latestOrder.items.map((item: any) => (
                <div key={item.id} className={styles.item}>
                  <span className={styles.qty}>{item.quantity}x</span>
                  <span className={styles.name}>{item.nameAtPurchase}</span>
                  <span className={styles.price}>${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className={styles.totalRow}>
              <span>Total Bill</span>
              <span>${latestOrder.total.toFixed(2)}</span>
            </div>
          </Card>
        </div>

        <footer className={styles.footer}>
          <Button variant="outline" size="sm" onClick={fetchLatestOrder}>
            <RefreshCw size={16} /> Update Status
          </Button>
        </footer>
      </div>
    </main>
  );
};

// Simplified icon since we can't import everything twice
const RefreshCw = ({ size, className }: any) => <Loader2 size={size} className={className} />;

export default TrackPage;
