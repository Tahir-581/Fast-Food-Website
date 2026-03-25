'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card/Card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Clock,
  ArrowUpRight,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import styles from './admin.module.css';

const DashboardOverview = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/admin/analytics');
      const json = await resp.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading && !data) {
    return <div className={styles.loadingFull}>Synchronizing performance streams...</div>;
  }

  const stats = [
    { 
      label: 'Gross Receipts', 
      value: `$${(data?.metrics?.totalRevenue || 0).toFixed(2)}`, 
      trend: '+0%', 
      up: true, 
      icon: DollarSign, 
      color: '#f59e0b' 
    },
    { 
      label: 'Selection Volume', 
      value: data?.metrics?.totalOrdersCount || 0, 
      trend: '+0%', 
      up: true, 
      icon: ShoppingBag, 
      color: '#3b82f6' 
    },
    { 
      label: 'Active Fulfillment', 
      value: data?.metrics?.pendingOrdersCount || 0, 
      trend: 'Live', 
      up: true, 
      icon: Clock, 
      color: '#6366f1' 
    },
    { 
      label: 'Member Circle', 
      value: data?.metrics?.totalUsersCount || 0, 
      trend: 'Growth', 
      up: true, 
      icon: Users, 
      color: '#10b981' 
    },
  ];

  return (
    <div className={styles.dashboardOverview}>
      <div className={styles.dashboardHeader}>
        <div className={styles.headerTitleGrp}>
          <h2 className={styles.pageTitle}>Performance Brief</h2>
          <p className={styles.pageSub}>Strategic insights for your culinary ecosystem.</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchAnalytics} disabled={isLoading}>
          <RefreshCw size={18} className={isLoading ? styles.spinning : ''} />
        </button>
      </div>


      {/* Stats Grid */}
      <div className={styles.dashboardGrid}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={`${styles.statTrend} ${stat.up ? styles.trendUp : styles.trendDown}`}>
                  {stat.up ? <ArrowUpRight size={12} /> : <TrendingDown size={12} />}
                  {stat.trend}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className={styles.sectionGrid}>
        {/* Sales by Category Chart Placeholder */}
        <Card className={styles.chartCard}>
          <div className={styles.sectionHeaderSmall}>
            <h3 className={styles.sectionTitleSmall}>Category Performance</h3>
          </div>
          <div className={styles.categoryStatsList}>
             {data?.categoryStats?.map((cat: any, i: number) => (
               <div key={i} className={styles.categoryStatRow}>
                 <span className={styles.catNameText}>{cat.name}</span>
                 <div className={styles.catProgressWrap}>
                    <div 
                      className={styles.catProgressBar} 
                      style={{ width: `${Math.min(100, (cat.orderCount / (data.metrics.totalOrdersCount || 1)) * 100)}%` }}
                    ></div>
                 </div>
                 <span className={styles.catValueText}>{cat.orderCount} orders</span>
               </div>
             ))}
             {(!data?.categoryStats || data.categoryStats.length === 0) && (
               <div className={styles.emptyPrompt}>No category data calculated.</div>
             )}
          </div>
        </Card>

        {/* Recent Orders Table */}
        <Card className={styles.ordersCard}>
          <div className={styles.sectionHeaderSmall}>
            <h3 className={styles.sectionTitleSmall}>Live Orders</h3>
            <a href="/admin/orders" className={styles.viewAllBtn}>View All</a>
          </div>
          <div className={styles.ordersList}>
            {data?.recentOrders?.map((order: any) => (
              <div key={order.id} className={styles.orderRow}>
                <div className={styles.orderIdInfo}>
                  <span className={styles.orderId}>#{order.id.slice(-6).toUpperCase()}</span>
                  <span className={styles.orderTime}>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={styles.orderCustomer}>
                  <span className={styles.customerName}>{order.user?.name || 'Guest'}</span>
                </div>
                <div className={styles.orderStatus}>
                  <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase().replace(/ /g, '')]}`}>
                    {order.status}
                  </span>
                </div>
                <div className={styles.orderTotal}>
                  <strong>${order.total.toFixed(2)}</strong>
                </div>
                <button className={styles.actionBtn}>
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
            {(!data?.recentOrders || data.recentOrders.length === 0) && (
              <div className={styles.emptyPrompt}>The void awaits its first order.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
