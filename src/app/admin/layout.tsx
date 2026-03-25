'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Settings, 
  Users, 
  BarChart3, 
  Bell, 
  Search,
  Package,
  Truck,
  CreditCard,
  Gift,
  FileText,
  ShieldCheck,
  Megaphone,
  Box,
  Flame
} from 'lucide-react';
import styles from './admin.module.css';

const navItems = [
  { label: 'Performance Brief', icon: LayoutDashboard, href: '/admin', group: 'Core' },
  { label: 'Live Fulfillment', icon: ShoppingBag, href: '/admin/orders', group: 'Ecosystem' },
  { label: 'Archive Management', icon: Box, href: '/admin/products', group: 'Ecosystem' },
  { label: 'Categories', icon: Layers, href: '/admin/categories', group: 'Ecosystem' },
  { label: 'Modifiers', icon: Settings, href: '/admin/modifiers', group: 'Ecosystem' },
  { label: 'Inventory Archives', icon: Package, href: '/admin/inventory', group: 'Architecture' },
  { label: 'Promotions', icon: Gift, href: '/admin/promotions', group: 'Outreach' },
  { label: 'Banners', icon: Megaphone, href: '/admin/banners', group: 'Outreach' },
  { label: 'Member Circle', icon: Users, href: '/admin/customers', group: 'Guest Circle' },
  { label: 'Delivery Logistics', icon: Truck, href: '/admin/delivery', group: 'Configuration' },
  { label: 'Revenue Streams', icon: CreditCard, href: '/admin/payments', group: 'Configuration' },
  { label: 'System Controls', icon: Settings, href: '/admin/settings', group: 'Configuration' },
  { label: 'Strategic Insights', icon: BarChart3, href: '/admin/analytics', group: 'Intelligence' },
  { label: 'Fulfillment Logs', icon: FileText, href: '/admin/logs', group: 'Infrastructure' },
  { label: 'Staff Governance', icon: ShieldCheck, href: '/admin/roles', group: 'Infrastructure' },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const groupedNav = navItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Flame size={24} className={styles.logoIcon} strokeWidth={3} />
          <span className={styles.logoText}>Control Room</span>
        </div>

        <nav className={styles.sidebarNav}>
          {Object.entries(groupedNav).map(([group, items]) => (
            <div key={group} className={styles.navGroup}>
              <h3 className={styles.groupLabel}>{group}</h3>
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>JD</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>John Doe</span>
              <span className={styles.userRole}>Super Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContainer}>
        <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.pageTitle}>
          {navItems.find(i => i.href === pathname)?.label || 'Overview'}
        </h1>
      </div>

      <div className={styles.headerRight}>
        {/* Omni-Search */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Omni-Search (⌘K)" className={styles.searchInput} />
          </div>
          <div className={styles.searchDropdown}>
            <div className={styles.searchGroup}>
              <h4 className={styles.searchGroupLabel}>Recent Orders</h4>
              <div className={styles.searchResult}>
                <ShoppingBag size={16} className={styles.resultIcon} />
                <div className={styles.resultInfo}>
                  <span className={styles.resultTitle}>#ORD-7742 - Alyx Vance</span>
                  <span className={styles.resultSub}>$42.50 • Pending</span>
                </div>
              </div>
            </div>
            <div className={styles.searchGroup}>
              <h4 className={styles.searchGroupLabel}>Products</h4>
              <div className={styles.searchResult}>
                <Box size={16} className={styles.resultIcon} />
                <div className={styles.resultInfo}>
                  <span className={styles.resultTitle}>Midnight Wagyu Burger</span>
                  <span className={styles.resultSub}>In Stock • $18.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <button className={styles.quickActionBtn} title="Quick Actions">
          <Flame size={20} />
        </button>

        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.notificationDot}></span>
        </button>
      </div>
    </header>

        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
