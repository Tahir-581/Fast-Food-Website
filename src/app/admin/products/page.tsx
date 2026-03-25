'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Copy,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Image as ImageIcon,
  RefreshCw,
  Loader2
} from 'lucide-react';
import styles from '../admin.module.css';

const ProductListings = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/admin/products');
      const data = await resp.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const resp = await fetch('/api/menu'); // Or a specific admin categories API
      const data = await resp.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openDrawer = (product: any = null) => {
    setEditingProduct(product || {
      name: '',
      slug: '',
      description: '',
      basePrice: 0,
      calories: 0,
      categoryId: categories[0]?.id || '',
      imageUrl: '',
      dietaryTags: []
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = editingProduct.id ? 'PATCH' : 'POST';
      const url = editingProduct.id ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      
      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      
      if (resp.ok) {
        fetchProducts();
        closeDrawer();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you certain you wish to delete this item?')) return;
    try {
      const resp = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (resp.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerActions}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={fetchProducts} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? styles.spinning : ''} />
          </Button>
          <Button variant="primary" size="sm" onClick={() => openDrawer()}>
            <Plus size={18} /> Add Product
          </Button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        {isLoading ? (
          <div className={styles.loadingTable}>Injecting data stream...</div>
        ) : (
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.productThumb}>
                         {product.imageUrl ? (
                           <img src={product.imageUrl} alt={product.name} className={styles.thumbImg} />
                         ) : (
                           <ImageIcon size={20} color="#f59e0b" />
                         )}
                      </div>
                      <div className={styles.productInfo}>
                        <span className={styles.productName}>{product.name}</span>
                        <span className={styles.productSlug}>/{product.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className={styles.categoryBadge}>{product.category?.name}</span></td>
                  <td><strong>${product.basePrice.toFixed(2)}</strong></td>
                  <td><small>{product._count?.orderItems || 0} orders</small></td>
                  <td>
                    <div className={styles.tableActions}>
                      <button className={styles.iconBtnSmall} onClick={() => openDrawer(product)}><Edit2 size={16} /></button>
                      <button className={styles.iconBtnSmall} onClick={() => deleteProduct(product.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <div className={styles.tableFooter}>
          <span className={styles.tableTotal}>Showing {filteredProducts.length} of {products.length} products</span>
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled><ChevronLeft size={16} /></button>
            <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
            <button className={styles.pageBtn}><ChevronRight size={16} /></button>
          </div>
        </div>
      </Card>

      {/* Side Drawer Component */}
      {isDrawerOpen && (
        <div className={styles.drawerOverlay} onClick={closeDrawer}>
          <form className={styles.drawerContent} onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>{editingProduct?.id ? 'Edit Product' : 'Add New Product'}</h2>
              <button type="button" className={styles.closeBtn} onClick={closeDrawer}><X size={24} /></button>
            </div>
            
            <div className={styles.drawerBody}>
              <div className={styles.formGroup}>
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={editingProduct?.name} 
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  className={styles.adminInput} 
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Slug</label>
                <input 
                  type="text" 
                  value={editingProduct?.slug} 
                  onChange={e => setEditingProduct({...editingProduct, slug: e.target.value})}
                  className={styles.adminInput} 
                  placeholder="midnight-wagyu"
                  required
                />
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Base Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={editingProduct?.basePrice} 
                    onChange={e => setEditingProduct({...editingProduct, basePrice: parseFloat(e.target.value)})}
                    className={styles.adminInput} 
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Calories</label>
                  <input 
                    type="number" 
                    value={editingProduct?.calories} 
                    onChange={e => setEditingProduct({...editingProduct, calories: parseInt(e.target.value)})}
                    className={styles.adminInput} 
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Category</label>
                <select 
                  className={styles.adminSelect} 
                  value={editingProduct?.categoryId}
                  onChange={e => setEditingProduct({...editingProduct, categoryId: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Image URL</label>
                <input 
                  type="text" 
                  value={editingProduct?.imageUrl || ''} 
                  onChange={e => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                  className={styles.adminInput} 
                  placeholder="https://..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Modifier Groups</label>
                <div className={styles.modifierList}>
                  {(editingProduct?.modifierGroups || []).map((group: any, gIdx: number) => (
                    <div key={gIdx} className={styles.modifierGroupItem}>
                      <input 
                        type="text" 
                        value={group.name} 
                        onChange={e => {
                          const newGroups = [...editingProduct.modifierGroups];
                          newGroups[gIdx].name = e.target.value;
                          setEditingProduct({...editingProduct, modifierGroups: newGroups});
                        }}
                        placeholder="Group Name (e.g. Choose Protein)"
                        className={styles.adminInputSmall}
                      />
                      <div className={styles.optionsGrid}>
                        {(group.options || []).map((opt: any, oIdx: number) => (
                          <div key={oIdx} className={styles.optionRow}>
                            <input type="text" value={opt.name} className={styles.adminInputTiny} readOnly />
                            <span className={styles.optionPriceLabel}>+${opt.priceModifier}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" type="button" className={styles.addBtn}>
                    <Plus size={14} /> Add Group
                  </Button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  className={styles.adminTextarea} 
                  rows={4} 
                  value={editingProduct?.description || ''}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                ></textarea>
              </div>

            </div>

            <div className={styles.drawerFooter}>
              <Button type="button" variant="outline" onClick={closeDrawer} style={{ flex: 1 }}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSaving} style={{ flex: 1 }}>
                {isSaving ? <Loader2 className={styles.spinning} /> : <Save size={18} />}
                {editingProduct?.id ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductListings;
