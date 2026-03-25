'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  RefreshCcw,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import styles from '../admin.module.css';

const InventoryManagement = () => {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/admin/inventory');
      const data = await resp.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const adjustStock = async (productId: string, delta: number) => {
    const item = items.find(i => i.id === productId);
    const currentStock = item?.inventory?.stock || 0;
    const newStock = Math.max(0, currentStock + delta);

    try {
      const resp = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, stock: newStock })
      });
      if (resp.ok) {
        setItems(prev => prev.map(i => i.id === productId ? {
          ...i,
          inventory: { ...(i.inventory || {}), stock: newStock }
        } : i));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = items.filter(i => (i.inventory?.stock || 0) <= (i.inventory?.threshold || 10)).length;

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerActions}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={fetchInventory} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? styles.spinning : ''} /> Sync
          </Button>
          <Button variant="primary" size="sm">
            <Plus size={18} /> Add Stock
          </Button>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Low Stock Alerts</span>
            <span className={styles.statValue}>{lowStockCount} Items</span>
          </div>
        </Card>
      </div>

      <Card className={styles.tableCard}>
        {isLoading ? (
          <div className={styles.loadingTable}>Auditing the vault...</div>
        ) : (
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const stock = item.inventory?.stock || 0;
                const threshold = item.inventory?.threshold || 10;
                const isLow = stock <= threshold;
                
                return (
                  <tr key={item.id}>
                    <td><span className={styles.productName}>{item.name}</span></td>
                    <td>{item.category?.name}</td>
                    <td>
                      <div className={styles.stockLevel}>
                        <strong>{stock} {item.inventory?.unit || 'pcs'}</strong>
                        <div className={styles.stockAction}>
                          <button className={styles.stockBtn} onClick={() => adjustStock(item.id, 1)}><ArrowUp size={12} /></button>
                          <button className={styles.stockBtn} onClick={() => adjustStock(item.id, -1)}><ArrowDown size={12} /></button>
                        </div>
                      </div>
                    </td>
                    <td>{threshold} {item.inventory?.unit || 'pcs'}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${isLow ? styles.preparing : styles.ready}`}>
                        {isLow ? 'Low Stock' : 'Healthy'}
                      </span>
                    </td>
                    <td>
                      <Button variant="ghost" size="sm">History</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default InventoryManagement;
