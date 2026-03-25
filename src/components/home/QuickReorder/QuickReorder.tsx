'use client';

import React from 'react';
import { History, ArrowRight, Clock } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import styles from './QuickReorder.module.css';

import { useShopStore } from '@/lib/store';

const QuickReorder = () => {
  const { user } = useShopStore();

  if (!user) return null;

  // This would normally come from the user's order history in the store
  const lastOrder = user.orderHistory?.[0] || {
    date: 'Recently',
    itemsCount: 1,
    total: 0,
    mainItem: 'Your Last Order'
  };

  if (lastOrder.total === 0) {
    return (
      <section className={styles.quickReorder}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.content}>
              <h2 className={styles.title}>Welcome Back, {user.name}</h2>
              <p className={styles.description}>Ready for your first forge? Explore the menu below.</p>
            </div>
            <Button variant="primary" size="md" onClick={() => window.location.href = '/menu'}>
              View Menu
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.quickReorder}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <div className={styles.titleInfo}>
              <History size={24} className={styles.historyIcon} />
              <h2 className={styles.title}>Welcome Back, Flavor Seeker</h2>
            </div>
            <p className={styles.description}>
              Ready for your usual? One click away from your favorites.
            </p>
          </div>

          <Card className={styles.reorderCard} hoverable>
            <div className={styles.cardHeader}>
              <div className={styles.timeBadge}>
                <Clock size={14} />
                <span>Last ordered {lastOrder.date}</span>
              </div>
              <span className={styles.price}>${lastOrder.total.toFixed(2)}</span>
            </div>
            
            <div className={styles.cardBody}>
              <h3 className={styles.orderName}>{lastOrder.mainItem}</h3>
              <p className={styles.orderDetails}>And {lastOrder.itemsCount - 1} other items</p>
            </div>

            <div className={styles.cardFooter}>
              <Button variant="primary" size="md" className={styles.reorderBtn}>
                Quick Reorder <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default QuickReorder;
