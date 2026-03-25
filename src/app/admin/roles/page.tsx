'use client';

import React from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Edit2, 
  Trash2,
  Lock
} from 'lucide-react';
import styles from '../admin.module.css';

const roles = [
  { name: 'Super Admin', users: 2, permissions: 'All Access', status: 'System' },
  { name: 'Store Manager', users: 5, permissions: 'Orders, Products, Inventory', status: 'Custom' },
  { name: 'Kitchen Staff', users: 8, permissions: 'Orders Only', status: 'Custom' },
];

export default function RolesManagement() {
  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerActions}>
          <div className={styles.pageTitleInfo}>
            <p className={styles.description}>Manage administrative access and define granular permissions for your team.</p>
          </div>
          <Button variant="primary" size="sm">
            <Plus size={18} /> Create New Role
          </Button>
        </div>
      </div>

      <div className={styles.categoryGrid}>
        {roles.map((role, i) => (
          <Card key={i} className={styles.roleCard}>
            <div className={styles.roleHeader}>
              <div className={styles.roleIconLarge}>
                {role.status === 'System' ? <Lock size={24} /> : <ShieldCheck size={24} />}
              </div>
              <div className={styles.categoryMeta}>
                 <h3 className={styles.categoryName}>{role.name}</h3>
                 <span className={styles.categorySub}>{role.users} Active Users</span>
              </div>
              {role.status !== 'System' && (
                <div className={styles.categoryActions}>
                  <button className={styles.iconBtnSmall}><Edit2 size={16} /></button>
                  <button className={styles.iconBtnSmall}><Trash2 size={16} /></button>
                </div>
              )}
            </div>
            <div className={styles.rolePermissions}>
              <span className={styles.permissionLabel}>Key Permissions:</span>
              <p className={styles.permissionText}>{role.permissions}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
