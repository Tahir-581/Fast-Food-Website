'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail,
  Clock,
  Save,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import styles from '../admin.module.css';

const StoreSettings = () => {
  const [settings, setSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/admin/settings');
      const data = await resp.json();
      const settingsMap = Array.isArray(data) ? data.reduce((acc: any, s: any) => {
        acc[s.key] = s.value;
        return acc;
      }, {}) : {};
      
      // Default values if missing
      const defaults = {
        store_name: 'Midnight & Ember',
        store_email: 'hello@midnightember.com',
        store_phone: '+1 (555) 0987',
        store_address: '123 Neon Street, Cyber District, Metropolis',
        busy_mode: 'false'
      };

      setSettings({ ...defaults, ...settingsMap });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = Object.entries(settings).map(([key, value]) => ({ key, value }));
      const resp = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload })
      });
      if (resp.ok) {
        alert('Universal configuration updated.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  if (isLoading) return <div className={styles.loadingFull}>Calibrating sensors...</div>;

  const isBusy = settings.busy_mode === 'true';

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerActions}>
          <div className={styles.pageTitleInfo}>
            <p className={styles.description}>Update your restaurant profile, contact details, and operational hours.</p>
          </div>
          <div className={styles.buttonGroup}>
             <button 
                className={`${styles.busyToggle} ${isBusy ? styles.busyActive : ''}`}
                onClick={() => updateSetting('busy_mode', isBusy ? 'false' : 'true')}
             >
                <div className={styles.busyIndicator}></div>
                {isBusy ? 'Busy Mode Active' : 'Normal Operations'}
             </button>
            <Button variant="primary" size="md" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 size={18} className={styles.spinning} /> : <Save size={18} />}
              Save All Changes
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.settingsGrid}>
        <Card className={styles.settingsSection}>
          <div className={styles.sectionHeaderSmall}>
            <h3 className={styles.sectionTitleSmall}>General Information</h3>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Restaurant Name</label>
              <input 
                type="text" 
                value={settings.store_name} 
                onChange={e => updateSetting('store_name', e.target.value)}
                className={styles.adminInput} 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Official Email</label>
              <input 
                type="email" 
                value={settings.store_email} 
                onChange={e => updateSetting('store_email', e.target.value)}
                className={styles.adminInput} 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Primary Phone</label>
              <input 
                type="text" 
                value={settings.store_phone} 
                onChange={e => updateSetting('store_phone', e.target.value)}
                className={styles.adminInput} 
              />
            </div>
          </div>
        </Card>

        <Card className={styles.settingsSection}>
          <div className={styles.sectionHeaderSmall}>
            <h3 className={styles.sectionTitleSmall}>Store Location</h3>
          </div>
          <div className={styles.formGroup}>
            <label>Physical Address</label>
            <textarea 
              className={styles.adminTextarea} 
              rows={3}
              value={settings.store_address}
              onChange={e => updateSetting('store_address', e.target.value)}
            ></textarea>
          </div>
        </Card>

        {isBusy && (
          <div className={styles.alertBannerBusy}>
            <AlertCircle size={20} />
            <div>
              <strong>Busy Mode is currently active.</strong>
              <p>Delivery estimates are automatically increased by 15 minutes globally.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreSettings;
