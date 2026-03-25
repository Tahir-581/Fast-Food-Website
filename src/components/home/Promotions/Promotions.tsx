import React from 'react';
import Button from '@/components/ui/Button/Button';
import styles from './Promotions.module.css';

const promotions = [
  {
    id: 1,
    title: 'Family Feast',
    description: '4 Burgers, 2 Large Fries, and 4 Drinks for a special price.',
    discount: '20% OFF',
    image: '👨‍👩‍👧‍👦',
  },
  {
    id: 2,
    title: 'Midnight Spark',
    description: 'Get a free Smoked Vanilla Shake with any order over $30.',
    discount: 'FREE SHAKE',
    image: '✨',
  },
];

const Promotions = () => {
  return (
    <section className={styles.promotions}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Ignite the Flavor</h2>
          <p className={styles.subtitle}>Limited time sparks you don't want to miss.</p>
        </div>

        <div className={styles.promoGrid}>
          {promotions.map((promo) => (
            <div key={promo.id} className={styles.promoCard}>
              <div className={styles.promoContent}>
                <span className={styles.discountBadge}>{promo.discount}</span>
                <h3 className={styles.promoTitle}>{promo.title}</h3>
                <p className={styles.promoDesc}>{promo.description}</p>
                <Button variant="primary" size="md">Claim Deal</Button>
              </div>
              <div className={styles.promoImage}>
                <span className={styles.emoji}>{promo.image}</span>
                <div className={styles.glow} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Promotions;
