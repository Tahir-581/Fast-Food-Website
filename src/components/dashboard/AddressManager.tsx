'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Home, Briefcase, Map as MapIcon } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import Input from '@/components/ui/Input/Input';
import styles from './AddressManager.module.css';

interface Address {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

const AddressManager = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 'a1', label: 'Home Base', address: '123 Ember St, San Francisco, CA 94103', isDefault: true, type: 'home' },
    { id: 'a2', label: 'The Forge', address: '555 Tech Way, Suite 400, San Francisco, CA 94107', isDefault: false, type: 'work' },
  ]);

  const [isAdding, setIsAdding] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home size={20} />;
      case 'work': return <Briefcase size={20} />;
      default: return <MapIcon size={20} />;
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Ember Map</h2>
          <p className={styles.subtitle}>Manage your delivery locations for faster checkout.</p>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => setIsAdding(true)}
          className={styles.addBtn}
        >
          <Plus size={18} /> Add New Address
        </Button>
      </header>

      <div className={styles.grid}>
        {addresses.map((addr) => (
          <Card key={addr.id} className={`${styles.addrCard} ${addr.isDefault ? styles.default : ''}`}>
            <div className={styles.addrHeader}>
              <div className={styles.addrLabel}>
                <span className={styles.iconWrapper}>{getIcon(addr.type)}</span>
                <strong>{addr.label}</strong>
                {addr.isDefault && <span className={styles.badge}>Default</span>}
              </div>
              <button className={styles.deleteBtn}>
                <Trash2 size={16} />
              </button>
            </div>
            <p className={styles.addressText}>{addr.address}</p>
            <div className={styles.addrActions}>
              <button className={styles.actionBtn}>Edit</button>
              {!addr.isDefault && <button className={styles.actionBtn}>Set as Default</button>}
            </div>
          </Card>
        ))}

        {isAdding && (
          <Card className={`${styles.addrCard} ${styles.newCard}`}>
            <div className={styles.addForm}>
              <Input label="Label (e.g. Home)" placeholder="Home" fullWidth />
              <Input label="Full Address" placeholder="Street, City, Zip" fullWidth />
              <div className={styles.formActions}>
                <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button variant="primary" size="sm">Save Address</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddressManager;
