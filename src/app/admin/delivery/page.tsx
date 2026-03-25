'use client';

import React from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { 
  Plus, 
  MapPin, 
  Clock, 
  DollarSign,
  Trash2,
  Edit2
} from 'lucide-react';
import styles from '../admin.module.css';

const deliveryZones = [
  { name: 'Downtown Core', radius: '3km', fee: '$2.50', minOrder: '$15.00', time: '20-30m', status: 'Active' },
  { name: 'Uptown District', radius: '5km', fee: '$4.50', minOrder: '$20.00', time: '35-45m', status: 'Active' },
  { name: 'West Side', radius: '8km', fee: '$7.00', minOrder: '$30.00', time: '50-60m', status: 'Active' },
];

export default function DeliverySettings() {
  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerActions}>
          <div className={styles.pageTitleInfo}>
            <p className={styles.description}>Define delivery radiuses, fees, and estimated times for different areas.</p>
          </div>
          <Button variant="primary" size="sm">
            <Plus size={18} /> Add Delivery Zone
          </Button>
        </div>
      </div>

      <div className={styles.categoryGrid}>
        {deliveryZones.map((zone, i) => (
          <Card key={i} className={styles.zoneCard}>
            <div className={styles.zoneHeader}>
              <div className={styles.zoneTitleGrp}>
                <MapPin size={20} className={styles.zoneIcon} />
                <h3 className={styles.zoneName}>{zone.name}</h3>
              </div>
              <div className={styles.categoryActions}>
                <button className={styles.iconBtnSmall}><Edit2 size={16} /></button>
                <button className={styles.iconBtnSmall}><Trash2 size={16} /></button>
              </div>
            </div>
            
            <div className={styles.zoneDetails}>
              <div className={styles.zoneDetailItem}>
                <DollarSign size={14} />
                <span>Fee: {zone.fee}</span>
              </div>
              <div className={styles.zoneDetailItem}>
                <Clock size={14} />
                <span>Time: {zone.time}</span>
              </div>
              <div className={styles.zoneDetailItem}>
                <small>Min Order: {zone.minOrder}</small>
              </div>
            </div>

            <div className={styles.zoneFooter}>
               <div className={styles.statusToggle}>
                  <span className={`${styles.statusDot} ${styles.activeDot}`}></span>
                  <span>{zone.status}</span>
               </div>
               <span className={styles.radiusBadge}>{zone.radius} Radius</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
