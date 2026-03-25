'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone,
  Star,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Gift
} from 'lucide-react';
import styles from '../admin.module.css';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/admin/customers');
      const data = await resp.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerActions}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.buttonGroup}>
            <Button variant="outline" size="sm" onClick={fetchCustomers} disabled={isLoading}>
              <RefreshCw size={16} className={isLoading ? styles.spinning : ''} />
            </Button>
            <Button variant="primary" size="sm">
              <UserPlus size={18} /> Add Customer
            </Button>
          </div>
        </div>
      </div>

      <Card className={styles.tableCard}>
        {isLoading ? (
          <div className={styles.loadingTable}>Scanning the roster...</div>
        ) : (
          <>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Sparks</th>
                  <th>Activity</th>
                  <th>Spent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id}>
                    <td>
                      <div className={styles.customerCell}>
                        <strong>{customer.name}</strong>
                        <small>{customer.id.slice(-6).toUpperCase()}</small>
                      </div>
                    </td>
                    <td>
                      <div className={styles.contactCell}>
                        <div className={styles.contactItem}><Mail size={14} /> {customer.email}</div>
                        <div className={styles.contactItem}><Phone size={14} /> {customer.phone}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${customer.status === 'VIP' ? styles.ready : customer.status === 'New' ? styles.preparing : styles.outfordelivery}`}>
                        {customer.status === 'VIP' && <Star size={10} style={{ marginRight: 4 }} />}
                        {customer.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.sparksCell}>
                        <Gift size={14} className={styles.sparksIcon} />
                        {customer.sparks}
                      </div>
                    </td>
                    <td>{customer.orders} orders</td>
                    <td><strong>${customer.totalSpent.toFixed(2)}</strong></td>
                    <td>
                      <div className={styles.tableActions}>
                        <button className={styles.iconBtnSmall}><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className={styles.tableFooter}>
              <span className={styles.tableTotal}>Showing {filteredCustomers.length} of {customers.length} souls</span>
              <div className={styles.pagination}>
                <button className={styles.pageBtn} disabled><ChevronLeft size={16} /></button>
                <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
                <button className={styles.pageBtn}><ChevronRight size={16} /></button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default CustomerManagement;
