'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  Printer,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Package,
  User,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import styles from '../admin.module.css';

const OrdersManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(`/api/admin/orders${filter !== 'All' ? `?status=${filter.toUpperCase()}` : ''}`);
      const data = await resp.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetail = async (id: string) => {
    setIsDetailLoading(true);
    try {
      const resp = await fetch(`/api/admin/orders/${id}`);
      const data = await resp.json();
      setSelectedOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  useEffect(() => {
    if (selectedOrderId) {
      fetchOrderDetail(selectedOrderId);
    } else {
      setSelectedOrder(null);
    }
  }, [selectedOrderId]);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const resp = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus.toUpperCase() })
      });
      if (resp.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus.toUpperCase() } : o));
        if (selectedOrder?.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus.toUpperCase() });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.id.includes(searchTerm);
    return matchesSearch;
  });

  const printReceipt = (order: any) => {
    alert(`Generating high-fidelity receipt for #${order.id.slice(-6).toUpperCase()}...`);
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerActions}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search orders, customers..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={fetchOrders} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? styles.spinning : ''} /> Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      <div className={styles.tabsRow}>
        {['All', 'PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'].map(tab => (
          <button 
            key={tab} 
            className={`${styles.tabBtn} ${filter === tab ? styles.active : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
            <span className={styles.tabCount}>
              {tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      <Card className={styles.tableCard}>
        {isLoading ? (
          <div className={styles.loadingTable}>Injecting data stream...</div>
        ) : (
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Status</th>
                <th>Total</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td><strong>#{order.id.slice(-6).toUpperCase()}</strong></td>
                  <td>
                    <div className={styles.customerCell}>
                      <span>{order.user?.name || 'Guest'}</span>
                      <small>{order.user?.email}</small>
                    </div>
                  </td>
                  <td>{order.type}</td>
                  <td>
                    <select 
                      className={`${styles.statusSelect} ${styles[order.status.toLowerCase().replace(/ /g, '')]}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PREPARING">Preparing</option>
                      <option value="READY">Ready</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td><strong>${order.total.toFixed(2)}</strong></td>
                  <td>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>
                    <div className={styles.tableActions}>
                      <button className={styles.iconBtnSmall} title="View Details" onClick={() => setSelectedOrderId(order.id)}><Eye size={16} /></button>
                      <button className={styles.iconBtnSmall} title="Print Receipt" onClick={() => printReceipt(order)}><Printer size={16} /></button>
                      <button className={styles.iconBtnSmall}><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {filteredOrders.length === 0 && !isLoading && (
          <div className={styles.emptyTable}>No orders found in this dimension.</div>
        )}
        
        <div className={styles.tableFooter}>
          <span className={styles.tableTotal}>Showing {filteredOrders.length} of {orders.length} orders</span>
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled><ChevronLeft size={16} /></button>
            <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
            <button className={styles.pageBtn}><ChevronRight size={16} /></button>
          </div>
        </div>
      </Card>

      {/* Detail Drawer */}
      {selectedOrderId && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedOrderId(null)}>
          <div className={styles.drawerContent} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>Order Summary</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedOrderId(null)}><X size={24} /></button>
            </div>

            {isDetailLoading ? (
              <div className={styles.loadingDrawer}>Reconstructing the audit trail...</div>
            ) : selectedOrder ? (
              <div className={styles.drawerBody}>
                <div className={styles.orderDetailHeader}>
                  <div className={styles.headerMain}>
                    <span className={styles.orderIdLarge}>#{selectedOrder.id.slice(-6).toUpperCase()}</span>
                    <span className={`${styles.statusBadge} ${styles[selectedOrder.status.toLowerCase().replace(/ /g, '')]}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className={styles.headerSub}>
                    <Clock size={14} /> {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <h4 className={styles.sectionHeading}><User size={16} /> Customer Intelligence</h4>
                  <div className={styles.customerGrid}>
                    <div className={styles.customerInfoItem}>
                      <label>Name</label>
                      <span>{selectedOrder.user?.name || 'Guest Checkout'}</span>
                    </div>
                    <div className={styles.customerInfoItem}>
                      <label>Email</label>
                      <span>{selectedOrder.user?.email || 'N/A'}</span>
                    </div>
                    {selectedOrder.user?.phone && (
                      <div className={styles.customerInfoItem}>
                        <label>Phone</label>
                        <span>{selectedOrder.user?.phone}</span>
                      </div>
                    )}
                    <div className={styles.customerInfoItem}>
                      <label>Address</label>
                      <span className={styles.addressText}><MapPin size={12} /> {selectedOrder.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <h4 className={styles.sectionHeading}><Package size={16} /> Itemized Manifest</h4>
                  <div className={styles.itemsList}>
                    {selectedOrder.items?.map((item: any) => (
                      <div key={item.id} className={styles.orderDetailItem}>
                        <div className={styles.itemQuantity}>{item.quantity}x</div>
                        <div className={styles.itemInfo}>
                          <span className={styles.itemName}>{item.nameAtPurchase}</span>
                          {item.customizations && (
                            <small className={styles.itemCustoms}>
                              {JSON.parse(item.customizations).map((c: any) => c.name).join(', ')}
                            </small>
                          )}
                        </div>
                        <div className={styles.itemPrice}>${(item.priceAtPurchase * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <h4 className={styles.sectionHeading}><CreditCard size={16} /> Financial Breakdown</h4>
                  <div className={styles.billingSummary}>
                    <div className={styles.billingRow}>
                      <span>Subtotal</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className={styles.billingRow}>
                      <span>Tax</span>
                      <span>${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className={styles.billingRow}>
                      <span>Delivery Fee</span>
                      <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className={`${styles.billingRow} ${styles.billingTotal}`}>
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className={styles.drawerFooter}>
               <Button variant="outline" onClick={() => printReceipt(selectedOrder)} style={{ flex: 1 }}>
                 <Printer size={18} /> Print Manifest
               </Button>
               {selectedOrder?.status !== 'DELIVERED' && selectedOrder?.status !== 'CANCELLED' && (
                 <Button 
                   variant="primary" 
                   onClick={() => updateOrderStatus(selectedOrder.id, 'DELIVERED')}
                   style={{ flex: 1 }}
                 >
                   <CheckCircle2 size={18} /> Complete Order
                 </Button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
