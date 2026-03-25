'use client';

import React from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { 
  Plus, 
  Image as ImageIcon, 
  ExternalLink,
  Trash2,
  Edit2,
  Eye
} from 'lucide-react';
import styles from '../admin.module.css';

const banners = [
  { id: 'B-001', title: 'Midnight Combo Special', placement: 'Home Hero', status: 'Active', clicks: '1,240' },
  { id: 'B-002', title: 'Weekend Late Night Deal', placement: 'Home Hero', status: 'Scheduled', clicks: '0' },
  { id: 'B-003', title: 'Free Delivery Promo', placement: 'Cart Drawer', status: 'Active', clicks: '450' },
];

export default function BannerManagement() {
  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerActions}>
          <div className={styles.pageTitleInfo}>
            <p className={styles.description}>Manage promotional banners and hero content across the platform.</p>
          </div>
          <Button variant="primary" size="sm">
            <Plus size={18} /> New Banner
          </Button>
        </div>
      </div>

      <div className={styles.categoryGrid}>
        {banners.map((banner, i) => (
          <Card key={i} className={styles.bannerCard}>
            <div className={styles.bannerPreviewPlaceholder}>
              <ImageIcon size={48} className={styles.bannerIcon} />
              <div className={styles.bannerBadge}>{banner.status}</div>
            </div>
            <div className={styles.bannerInfoBody}>
              <h3 className={styles.bannerTitleText}>{banner.title}</h3>
              <span className={styles.placementTag}>{banner.placement}</span>
              <div className={styles.bannerStats}>
                <div className={styles.bannerStatItem}>
                  <Eye size={14} /> <span>{banner.clicks} clicks</span>
                </div>
              </div>
            </div>
            <div className={styles.bannerFooter}>
              <Button variant="outline" size="sm" style={{ flex: 1 }}>
                <Edit2 size={14} /> Edit
              </Button>
              <button className={styles.iconBtnSmall}><Trash2 size={16} /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
