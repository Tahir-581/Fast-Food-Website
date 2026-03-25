import React from 'react';
import styles from './MenuSkeleton.module.css';

const MenuSkeleton = () => {
  return (
    <div className={styles.skeletonGrid}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonText} />
            <div className={styles.skeletonFooter}>
              <div className={styles.skeletonPrice} />
              <div className={styles.skeletonButton} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuSkeleton;
