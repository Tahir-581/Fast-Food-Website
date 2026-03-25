'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Settings2,
  XCircle,
  X,
  Save,
  RefreshCw,
  Loader2,
  Trash
} from 'lucide-react';
import styles from '../admin.module.css';

const ModifiersManagement = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/admin/modifiers');
      const data = await resp.json();
      setGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const openDrawer = (group: any = null) => {
    setEditingGroup(group || {
      name: '',
      minSelection: 0,
      maxSelection: 1,
      isRequired: false,
      options: [{ name: '', price: 0 }]
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingGroup(null);
  };

  const addOption = () => {
    setEditingGroup({
      ...editingGroup,
      options: [...editingGroup.options, { name: '', price: 0 }]
    });
  };

  const removeOption = (idx: number) => {
    setEditingGroup({
      ...editingGroup,
      options: editingGroup.options.filter((_: any, i: number) => i !== idx)
    });
  };

  const updateOption = (idx: number, field: string, value: any) => {
    const newOptions = [...editingGroup.options];
    newOptions[idx] = { ...newOptions[idx], [field]: value };
    setEditingGroup({ ...editingGroup, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = editingGroup.id ? 'PATCH' : 'POST';
      const url = editingGroup.id ? `/api/admin/modifiers/${editingGroup.id}` : '/api/admin/modifiers';
      
      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGroup)
      });
      
      if (resp.ok) {
        fetchGroups();
        closeDrawer();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteGroup = async (id: string) => {
    if (!confirm('Are you certain? This will remove this customization option from ALL products it is linked to.')) return;
    try {
      const resp = await fetch(`/api/admin/modifiers/${id}`, { method: 'DELETE' });
      if (resp.ok) {
        setGroups(prev => prev.filter(g => g.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerActions}>
          <div className={styles.pageTitleInfo}>
            <p className={styles.description}>Manage add-ons, toppings, and product customization options.</p>
          </div>
          <div className={styles.buttonGroup}>
            <Button variant="outline" size="sm" onClick={fetchGroups} disabled={isLoading}>
              <RefreshCw size={16} className={isLoading ? styles.spinning : ''} />
            </Button>
            <Button variant="primary" size="sm" onClick={() => openDrawer()}>
              <Plus size={18} /> Create Modifier Group
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingTable}>Calibrating modifiers...</div>
      ) : (
        <div className={styles.modifiersList}>
          {groups.map((group) => (
            <Card key={group.id} className={styles.modifierCard}>
              <div className={styles.modifierHeader}>
                <div className={styles.modifierTitleGrp}>
                  <Settings2 size={20} className={styles.modifierIcon} />
                  <h3 className={styles.modifierGroupName}>{group.name}</h3>
                  {group.isRequired && <span className={styles.requiredBadge}>Required</span>}
                </div>
                <div className={styles.modifierMeta}>
                  <span>Max: {group.maxSelection}</span>
                  <span className={styles.productCountBadge}>{group._count?.products || 0} Products</span>
                </div>
                <div className={styles.categoryActions}>
                  <button className={styles.iconBtnSmall} onClick={() => openDrawer(group)}><Edit2 size={16} /></button>
                  <button className={styles.iconBtnSmall} onClick={() => deleteGroup(group.id)}><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div className={styles.modifierItems}>
                {group.options?.map((option: any) => (
                  <div key={option.id} className={styles.modifierItemTag}>
                    {option.name} <small>(+${option.price.toFixed(2)})</small>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Side Drawer Component */}
      {isDrawerOpen && (
        <div className={styles.drawerOverlay} onClick={closeDrawer}>
          <form className={styles.drawerContent} onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>{editingGroup?.id ? 'Edit Modifier Group' : 'New Modifier Group'}</h2>
              <button type="button" className={styles.closeBtn} onClick={closeDrawer}><X size={24} /></button>
            </div>
            
            <div className={styles.drawerBody}>
              <div className={styles.formGroup}>
                <label>Group Name</label>
                <input 
                  type="text" 
                  value={editingGroup?.name} 
                  onChange={e => setEditingGroup({...editingGroup, name: e.target.value})}
                  className={styles.adminInput} 
                  placeholder="e.g. Burger Toppings"
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Min Selection</label>
                  <input 
                    type="number" 
                    value={editingGroup?.minSelection} 
                    onChange={e => setEditingGroup({...editingGroup, minSelection: e.target.value})}
                    className={styles.adminInput} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Max Selection</label>
                  <input 
                    type="number" 
                    value={editingGroup?.maxSelection} 
                    onChange={e => setEditingGroup({...editingGroup, maxSelection: e.target.value})}
                    className={styles.adminInput} 
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={editingGroup?.isRequired}
                    onChange={e => setEditingGroup({...editingGroup, isRequired: e.target.checked})}
                  />
                  Required for checkout
                </label>
              </div>

              <div className={styles.optionsDivider}>Options</div>
              
              <div className={styles.optionsList}>
                {editingGroup?.options.map((opt: any, idx: number) => (
                  <div key={idx} className={styles.optionRow}>
                    <input 
                      type="text" 
                      placeholder="Option Name"
                      value={opt.name}
                      onChange={e => updateOption(idx, 'name', e.target.value)}
                      className={styles.adminInput}
                      required
                    />
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="Price"
                      value={opt.price}
                      onChange={e => updateOption(idx, 'price', e.target.value)}
                      className={styles.adminInput}
                      style={{ width: '100px' }}
                    />
                    <button type="button" className={styles.removeBtn} onClick={() => removeOption(idx)}>
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <Plus size={16} /> Add Option
                </Button>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <Button type="button" variant="outline" onClick={closeDrawer} style={{ flex: 1 }}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSaving} style={{ flex: 1 }}>
                {isSaving ? <Loader2 className={styles.spinning} /> : <Save size={18} />}
                {editingGroup?.id ? 'Update Group' : 'Create Group'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ModifiersManagement;
