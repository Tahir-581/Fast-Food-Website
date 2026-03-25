'use client';

import React, { useState } from 'react';
import { User, Lock, Bell, CreditCard, Shield, Smartphone } from 'lucide-react';
import { useShopStore } from '@/lib/store';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import Card from '@/components/ui/Card/Card';
import styles from './ProfileSettings.module.css';

const ProfileSettings = () => {
  const { user } = useShopStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  if (!user) return null;

  return (
    <Card className={styles.settingsCard}>
      <div className={styles.layout}>
        {/* Sidebar Tabs */}
        <aside className={styles.sidebar}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Profile Info
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'security' ? styles.active : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Lock size={18} /> Password & Security
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} /> Notifications
          </button>
        </aside>

        {/* Content Area */}
        <div className={styles.content}>
          {activeTab === 'profile' && (
            <div className={styles.tabContent}>
              <h2 className={styles.tabTitle}>Personal Identity</h2>
              <p className={styles.tabSubtitle}>Manage your public profile and contact information.</p>
              
              <div className={styles.formGrid}>
                <div className={styles.row}>
                  <Input label="First Name" defaultValue={user.name.split(' ')[0]} fullWidth />
                  <Input label="Last Name" defaultValue={user.name.split(' ')[1] || ''} fullWidth />
                </div>
                <Input label="Email Address" defaultValue={user.email} fullWidth disabled />
                <Input label="Phone Number" placeholder="+1 (555) 000-0000" fullWidth />
              </div>
              <Button variant="primary" size="md" className={styles.saveBtn}>Update Profile</Button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className={styles.tabContent}>
              <h2 className={styles.tabTitle}>Shield & Security</h2>
              <p className={styles.tabSubtitle}>Update your password and manage two-factor authentication.</p>
              
              <div className={styles.formGrid}>
                <Input type="password" label="Current Password" fullWidth />
                <Input type="password" label="New Password" fullWidth />
                <Input type="password" label="Confirm New Password" fullWidth />
              </div>

              <div className={styles.twoFactor}>
                <div className={styles.tfInfo}>
                  <Smartphone size={24} className={styles.tfIcon} />
                  <div className={styles.tfText}>
                    <strong>Two-Factor Authentication</strong>
                    <p>Add an extra layer of security to your Spark Hub.</p>
                  </div>
                </div>
                <button className={styles.enableBtn}>Enable</button>
              </div>

              <Button variant="primary" size="md" className={styles.saveBtn}>Save New Password</Button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className={styles.tabContent}>
              <h2 className={styles.tabTitle}>Preferences</h2>
              <p className={styles.tabSubtitle}>Choose how we notify you about your sizzles and sparks.</p>
              
              <div className={styles.prefList}>
                <div className={styles.prefItem}>
                  <div className={styles.prefText}>
                    <strong>Order Updates</strong>
                    <p>Real-time updates on your order progress via SMS.</p>
                  </div>
                  <input type="checkbox" defaultChecked className={styles.toggle} />
                </div>
                <div className={styles.prefItem}>
                  <div className={styles.prefText}>
                    <strong>Spark Rewards</strong>
                    <p>Alerts when you earn or can redeem sparks for free food.</p>
                  </div>
                  <input type="checkbox" defaultChecked className={styles.toggle} />
                </div>
                <div className={styles.prefItem}>
                  <div className={styles.prefText}>
                    <strong>Exclusive Promos</strong>
                    <p>Special "Midnight Melt" deals and weekend fire-sales.</p>
                  </div>
                  <input type="checkbox" className={styles.toggle} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileSettings;
