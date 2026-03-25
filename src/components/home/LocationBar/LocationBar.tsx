'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Truck, ShoppingBag } from 'lucide-react';
import styles from './LocationBar.module.css';

const LocationBar = () => {
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');

  return (
    <section className={styles.locationBar}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.typeSelector}>
            <button 
              className={`${styles.typeBtn} ${orderType === 'delivery' ? styles.active : ''}`}
              onClick={() => setOrderType('delivery')}
            >
              <Truck size={18} />
              <span>Delivery</span>
            </button>
            <button 
              className={`${styles.typeBtn} ${orderType === 'pickup' ? styles.active : ''}`}
              onClick={() => setOrderType('pickup')}
            >
              <ShoppingBag size={18} />
              <span>Pickup</span>
            </button>
          </div>

          <div className={styles.inputWrapper}>
            <MapPin size={18} className={styles.pinIcon} />
            <input 
              type="text" 
              placeholder={orderType === 'delivery' ? "Enter delivery address..." : "Find a store near you..."} 
              className={styles.input}
            />
            <button className={styles.locateBtn}>
              <Navigation size={18} />
            </button>
          </div>

          <button className={styles.submitBtn}>
            Confirm
          </button>
        </div>
      </div>
    </section>
  );
};

export default LocationBar;
