'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { 
  Plus, 
  Tag, 
  Calendar, 
  Trash2, 
  Edit2,
  Trophy,
  X,
  Save,
  RefreshCw,
  Loader2
} from 'lucide-react';
import styles from '../admin.module.css';

const PromotionsManagement = () => {
  const [promos, setPromos] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPromos = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/admin/promotions');
      const data = await resp.json();
      setPromos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const openDrawer = (promo: any = null) => {
    setEditingPromo(promo || {
      code: '',
      type: 'PERCENT',
      value: 0,
      minOrderValue: 0,
      usageLimit: null,
      expiresAt: '',
      isActive: true
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingPromo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = editingPromo.id ? 'PATCH' : 'POST';
      const url = editingPromo.id ? `/api/admin/promotions/${editingPromo.id}` : '/api/admin/promotions';
      
      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPromo)
      });
      
      if (resp.ok) {
        fetchPromos();
        closeDrawer();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const deletePromo = async (id: string) => {
    if (!confirm('Are you certain? This promotion will be permanently erased.')) return;
    try {
      const resp = await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' });
      if (resp.ok) {
        setPromos(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const topPerformer = promos.length > 0 ? promos.reduce((prev, current) => (prev.usedCount > current.usedCount) ? prev : current) : null;

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerActions}>
          <div className={styles.pageTitleInfo}>
            <p className={styles.description}>Create and manage discount codes, flash sales, and loyalty rewards.</p>
          </div>
          <div className={styles.buttonGroup}>
            <Button variant="outline" size="sm" onClick={fetchPromos} disabled={isLoading}>
              <RefreshCw size={16} className={isLoading ? styles.spinning : ''} />
            </Button>
            <Button variant="primary" size="sm" onClick={() => openDrawer()}>
              <Plus size={18} /> Create Promotion
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Trophy size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Top Performer</span>
            <span className={styles.statValue}>{topPerformer ? topPerformer.code : 'N/A'}</span>
          </div>
        </Card>
      </div>

      <Card className={styles.tableCard}>
        {isLoading ? (
          <div className={styles.loadingTable}>Distilling calculations...</div>
        ) : (
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Promo Code</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Usage</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map(promo => (
                <tr key={promo.id}>
                  <td>
                    <div className={styles.promoCodeCell}>
                      <Tag size={16} className={styles.promoIcon} />
                      <strong>{promo.code}</strong>
                    </div>
                  </td>
                  <td><span className={styles.discountBadge}>{promo.type === 'PERCENT' ? `${promo.value}%` : `$${promo.value.toFixed(2)}`}</span></td>
                  <td>{promo.type}</td>
                  <td>{promo.usedCount} times</td>
                  <td>
                    <div className={styles.expiryCell}>
                      <Calendar size={14} /> {promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : 'Never'}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${promo.isActive ? styles.ready : styles.cancelled}`}>
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.tableActions}>
                      <button className={styles.iconBtnSmall} onClick={() => openDrawer(promo)}><Edit2 size={16} /></button>
                      <button className={styles.iconBtnSmall} onClick={() => deletePromo(promo.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Side Drawer */}
      {isDrawerOpen && (
        <div className={styles.drawerOverlay} onClick={closeDrawer}>
          <form className={styles.drawerContent} onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>{editingPromo?.id ? 'Edit Promotion' : 'New Promotion'}</h2>
              <button type="button" className={styles.closeBtn} onClick={closeDrawer}><X size={24} /></button>
            </div>
            
            <div className={styles.drawerBody}>
              <div className={styles.formGroup}>
                <label>Promo Code</label>
                <input 
                  type="text" 
                  value={editingPromo?.code} 
                  onChange={e => setEditingPromo({...editingPromo, code: e.target.value.toUpperCase()})}
                  className={styles.adminInput} 
                  placeholder="e.g. MIDNIGHT25"
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select 
                    className={styles.adminSelect} 
                    value={editingPromo?.type}
                    onChange={e => setEditingPromo({...editingPromo, type: e.target.value})}
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Value</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={editingPromo?.value} 
                    onChange={e => setEditingPromo({...editingPromo, value: e.target.value})}
                    className={styles.adminInput} 
                    required
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Min Order ($)</label>
                  <input 
                    type="number" 
                    value={editingPromo?.minOrderValue} 
                    onChange={e => setEditingPromo({...editingPromo, minOrderValue: e.target.value})}
                    className={styles.adminInput} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Usage Limit</label>
                  <input 
                    type="number" 
                    value={editingPromo?.usageLimit || ''} 
                    onChange={e => setEditingPromo({...editingPromo, usageLimit: e.target.value})}
                    className={styles.adminInput} 
                    placeholder="Infinite"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Expiry Date</label>
                <input 
                  type="date" 
                  value={editingPromo?.expiresAt ? new Date(editingPromo.expiresAt).toISOString().split('T')[0] : ''} 
                  onChange={e => setEditingPromo({...editingPromo, expiresAt: e.target.value})}
                  className={styles.adminInput} 
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={editingPromo?.isActive}
                    onChange={e => setEditingPromo({...editingPromo, isActive: e.target.checked})}
                  />
                  Active and usable
                </label>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <Button type="button" variant="outline" onClick={closeDrawer} style={{ flex: 1 }}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSaving} style={{ flex: 1 }}>
                {isSaving ? <Loader2 className={styles.spinning} /> : <Save size={18} />}
                {editingPromo?.id ? 'Update Promotion' : 'Create Promotion'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PromotionsManagement;
