'use client';

import React, { useState } from 'react';
import { useShopStore } from '@/lib/store';
import Button from '@/components/ui/Button/Button';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  LogOut, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';
import styles from './page.module.css';

const DashboardPage = () => {
  const { user, logout } = useShopStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'rewards'>('orders');

  // Mock data for dashboard
  const orders = [
    { 
      id: 'MB-9284', 
      date: 'Oct 24, 2026', 
      status: 'Preparing', 
      total: 32.50, 
      items: ['Midnight Wagyu Burger', 'Charcoal Fries'] 
    },
    { 
      id: 'MB-8102', 
      date: 'Oct 15, 2026', 
      status: 'Delivered', 
      total: 18.99, 
      items: ['Ember Spicy Chicken', 'Smoked Vanilla Shake'] 
    }
  ];

  const addresses = [
    { id: 1, label: 'Home', address: '123 Midnight Lane, Ember City, EC 90210', isDefault: true },
    { id: 2, label: 'Office', address: '456 Business Blvd, Tech Plaza, EC 90300', isDefault: false }
  ];

  if (!user) {
    return (
      <div className={styles.loginPrompt}>
        <h1 className={styles.title}>Welcome to <span className={styles.highlight}>Midnight</span></h1>
        <p>Please log in to view your dashboard and track orders.</p>
        <Button variant="primary" size="lg" onClick={() => window.location.href = '/'}>
          Go to Homepage
        </Button>
      </div>
    );
  }

  return (
    <main className={styles.dashboard}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.userBrief}>
            <div className={styles.avatar}>
              <User size={32} />
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{user.name}</h2>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>

          <nav className={styles.nav}>
            <button 
              className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={20} />
              <span>Orders</span>
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'rewards' ? styles.active : ''}`}
              onClick={() => setActiveTab('rewards')}
            >
              <Sparkles size={20} />
              <span>Sparks Rewards</span>
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'addresses' ? styles.active : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <MapPin size={20} />
              <span>Addresses</span>
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              <span>Profile Settings</span>
            </button>
            <hr className={styles.divider} />
            <button className={styles.logoutBtn} onClick={() => { logout(); window.location.href = '/'; }}>
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        <section className={styles.mainContent}>
          {activeTab === 'orders' && (
            <div className={styles.tabPanel}>
              <h1 className={styles.panelTitle}>Order History</h1>
              <div className={styles.orderList}>
                {orders.map(order => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div className={styles.orderMeta}>
                        <span className={styles.orderId}>{order.id}</span>
                        <span className={styles.orderDate}>{order.date}</span>
                      </div>
                      <div className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                        {order.status === 'Preparing' ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                        {order.status}
                      </div>
                    </div>
                    <div className={styles.orderBody}>
                      <div className={styles.orderItems}>
                        {order.items.join(', ')}
                      </div>
                      <div className={styles.orderTotal}>
                        Total: <strong>${order.total.toFixed(2)}</strong>
                      </div>
                    </div>
                    <div className={styles.orderFooter}>
                      <Button variant="secondary" size="sm">Track Order</Button>
                      <Button variant="outline" size="sm">Reorder</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className={styles.tabPanel}>
              <h1 className={styles.panelTitle}>Sparks Rewards</h1>
              <div className={styles.rewardsCard}>
                <div className={styles.rewardsHeader}>
                  <div className={styles.sparksCount}>
                    <Sparkles size={40} className={styles.sparkleIcon} />
                    <div className={styles.countInfo}>
                      <span className={styles.count}>{user.sparks}</span>
                      <span className={styles.label}>Total Sparks Earned</span>
                    </div>
                  </div>
                </div>
                <div className={styles.tierInfo}>
                  <p>You're 250 Sparks away from a <strong>Free Midnight Wagyu Burger</strong>!</p>
                  <div className={styles.tierBar}>
                    <div className={styles.tierProgress} style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className={styles.tabPanel}>
              <div className={styles.panelHeader}>
                <h1 className={styles.panelTitle}>Saved Addresses</h1>
                <Button variant="secondary" size="sm">
                  <Plus size={16} /> Add New
                </Button>
              </div>
              <div className={styles.addressList}>
                {addresses.map(addr => (
                  <div key={addr.id} className={styles.addressCard}>
                    <div className={styles.addressInfo}>
                      <div className={styles.addressLabel}>
                        <h3 className={styles.labelTitle}>{addr.label}</h3>
                        {addr.isDefault && <span className={styles.defaultBadge}>Default</span>}
                      </div>
                      <p className={styles.fullAddress}>{addr.address}</p>
                    </div>
                    <div className={styles.addressActions}>
                      <button className={styles.editBtn}>Edit</button>
                      <button className={styles.deleteBtn}><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
