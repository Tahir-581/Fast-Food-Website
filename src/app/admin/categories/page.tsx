'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Move,
  X,
  Save,
  RefreshCw,
  Loader2
} from 'lucide-react';
import styles from '../admin.module.css';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/admin/categories');
      const data = await resp.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openDrawer = (category: any = null) => {
    setEditingCategory(category || {
      name: '',
      slug: '',
      icon: '🍔',
      description: '',
      displayOrder: categories.length
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = editingCategory.id ? 'PATCH' : 'POST';
      const url = editingCategory.id ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
      
      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory)
      });
      
      if (resp.ok) {
        fetchCategories();
        closeDrawer();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you certain you wish to delete this category? (All linked products will remain but will be uncategorized)')) return;
    try {
      const resp = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (resp.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
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
            <p className={styles.description}>Organize your menu by creating and managing categories.</p>
          </div>
          <div className={styles.buttonGroup}>
            <Button variant="outline" size="sm" onClick={fetchCategories} disabled={isLoading}>
              <RefreshCw size={16} className={isLoading ? styles.spinning : ''} />
            </Button>
            <Button variant="primary" size="sm" onClick={() => openDrawer()}>
              <Plus size={18} /> New Category
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingTable}>Gathering the branches...</div>
      ) : (
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <Card key={category.id} className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIconLarge}>{category.icon}</div>
                <div className={styles.categoryMeta}>
                  <h3 className={styles.categoryName}>{category.name}</h3>
                  <span className={styles.categorySub}>{category._count?.products || 0} Products Linked</span>
                </div>
                <div className={styles.categoryActions}>
                  <button className={styles.iconBtnSmall} onClick={() => openDrawer(category)}><Edit2 size={16} /></button>
                  <button className={styles.iconBtnSmall} onClick={() => deleteCategory(category.id)}><Trash2 size={16} /></button>
                </div>
              </div>
              <div className={styles.categoryPreview}>
                <span className={styles.previewLabel}>Order: {category.displayOrder}</span>
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
              <h2 className={styles.drawerTitle}>{editingCategory?.id ? 'Edit Category' : 'Add New Category'}</h2>
              <button type="button" className={styles.closeBtn} onClick={closeDrawer}><X size={24} /></button>
            </div>
            
            <div className={styles.drawerBody}>
              <div className={styles.formGroup}>
                <label>Category Name</label>
                <input 
                  type="text" 
                  value={editingCategory?.name} 
                  onChange={e => setEditingCategory({...editingCategory, name: e.target.value})}
                  className={styles.adminInput} 
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Slug</label>
                  <input 
                    type="text" 
                    value={editingCategory?.slug} 
                    onChange={e => setEditingCategory({...editingCategory, slug: e.target.value})}
                    className={styles.adminInput} 
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Icon (Emoji)</label>
                  <input 
                    type="text" 
                    value={editingCategory?.icon} 
                    onChange={e => setEditingCategory({...editingCategory, icon: e.target.value})}
                    className={styles.adminInput} 
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Display Order</label>
                <input 
                  type="number" 
                  value={editingCategory?.displayOrder} 
                  onChange={e => setEditingCategory({...editingCategory, displayOrder: e.target.value})}
                  className={styles.adminInput} 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  className={styles.adminTextarea} 
                  rows={4} 
                  value={editingCategory?.description || ''}
                  onChange={e => setEditingCategory({...editingCategory, description: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <Button type="button" variant="outline" onClick={closeDrawer} style={{ flex: 1 }}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSaving} style={{ flex: 1 }}>
                {isSaving ? <Loader2 className={styles.spinning} /> : <Save size={18} />}
                {editingCategory?.id ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
