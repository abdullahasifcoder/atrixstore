import { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setError(null);
      const response = await api.get('/api/admin/orders?limit=1000');
      setOrders(response.data.orders || []);
      setFilteredOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert('Error updating order status');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Pending' },
      processing: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500', label: 'Processing' },
      shipped: { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500', label: 'Shipped' },
      delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Delivered' },
      cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', label: 'Cancelled' },
    };
    return configs[status] || configs.pending;
  };

  const stats = {
    total: orders.length,
    paid: orders.filter(o => o.paymentStatus === 'paid').length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    revenue: orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0),
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={() => { setLoading(true); fetchOrders(); }}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track all customer orders</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Orders', value: stats.total, color: 'indigo' },
          { label: 'Paid', value: stats.paid, color: 'emerald' },
          { label: 'Pending', value: stats.pending, color: 'amber' },
          { label: 'Processing', value: stats.processing, color: 'violet' },
          { label: 'Revenue', value: `$${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-700' :
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-700' :
                stat.color === 'amber' ? 'bg-amber-50 text-amber-700' :
                'bg-violet-50 text-violet-700'
              }`}>
                {stat.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order #, customer name, or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="text-slate-500 font-medium">No orders found</p>
                      <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-indigo-600">
                          #{order.orderNumber || order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customerName || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                          {order.orderItems?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-gray-900">
                          ${parseFloat(order.total).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'paid' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {order.paymentStatus === 'paid' ? '✓ Paid' : '✗ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Order #{selectedOrder.orderNumber || selectedOrder.id}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Customer</p>
                  <p className="font-medium text-gray-900">{selectedOrder.customerName || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerEmail || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                  <p className="font-medium text-gray-900">{selectedOrder.shippingAddress || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.shippingCity}, {selectedOrder.shippingState} {selectedOrder.shippingPostalCode}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Order Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">${parseFloat(selectedOrder.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-900">${parseFloat(selectedOrder.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gray-900">${parseFloat(selectedOrder.shippingCost || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-indigo-600">${parseFloat(selectedOrder.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Items ({selectedOrder.orderItems?.length || 0})</p>
                <div className="space-y-2">
                  {selectedOrder.orderItems?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div>
                          <p className="font-medium text-gray-900">{item.productName || 'Unknown Product'}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
