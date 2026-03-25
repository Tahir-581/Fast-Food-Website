'use client';

import React from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  ArrowUpRight,
  PieChart
} from 'lucide-react';
import styles from '../admin.module.css';

export default function AnalyticsReports() {
  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerActions}>
          <div className={styles.datePicker}>
            <Calendar size={18} className={styles.searchIcon} />
            <select className={styles.adminSelect} style={{ width: 220, paddingLeft: 44 }}>
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>Year to Date</option>
            </select>
          </div>
          <Button variant="outline" size="sm">
            <Download size={16} /> Download Report
          </Button>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statInfo}>
             <span className={styles.statLabel}>Revenue Growth</span>
             <span className={styles.statValue}>+24.5%</span>
             <span className={styles.trendUp}><ArrowUpRight size={14} /> Over previous period</span>
          </div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statInfo}>
             <span className={styles.statLabel}>Conversion Rate</span>
             <span className={styles.statValue}>3.8%</span>
             <span className={styles.trendUp}><ArrowUpRight size={14} /> +0.5% increase</span>
          </div>
        </Card>
      </div>

      <div className={styles.sectionGrid}>
        <Card className={styles.chartCard} style={{ gridColumn: 'span 2' }}>
           <div className={styles.sectionHeaderSmall}>
             <h3 className={styles.sectionTitleSmall}>Weekly Sales Distribution</h3>
           </div>
           <div className={styles.placeholderChartLarge}>
              {/* Complex placeholder for a multi-line chart */}
              <div className={styles.chartVisual}></div>
           </div>
        </Card>
      </div>
    </div>
  );
}
