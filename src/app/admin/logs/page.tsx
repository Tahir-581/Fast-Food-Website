'use client';

import React from 'react';
import Card from '@/components/ui/Card/Card';
import { 
  History, 
  Filter, 
  Search,
  User,
  Clock
} from 'lucide-react';
import styles from '../admin.module.css';

const logs = [
  { id: '1', user: 'John Doe', action: 'Changed product price', target: 'Midnight Wagyu Burger', time: '2 mins ago' },
  { id: '2', user: 'Jane Smith', action: 'Applied promo code', target: 'MIDNIGHT25', time: '15 mins ago' },
  { id: '3', user: 'System', action: 'Auto-updated inventory', target: 'Wagyu Beef Patties', time: '1 hour ago' },
  { id: '4', user: 'Admin', action: 'Created new delivery zone', target: 'Uptown District', time: '3 hours ago' },
];

export default function AuditLogs() {
  return (
    <div className={styles.adminPage}>
      <Card className={styles.tableCard}>
        <div className={styles.tableHeaderSection}>
           <div className={styles.searchBar}>
             <Search size={18} className={styles.searchIcon} />
             <input type="text" placeholder="Search logs..." className={styles.searchInput} />
           </div>
        </div>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Target</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>
                  <div className={styles.userCell}>
                    <User size={14} /> {log.user}
                  </div>
                </td>
                <td>{log.action}</td>
                <td><strong>{log.target}</strong></td>
                <td>
                  <div className={styles.timeCell}>
                    <Clock size={14} /> {log.time}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
