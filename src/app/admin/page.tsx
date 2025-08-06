'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Order } from '@/types';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  preparing: 'bg-blue-100 text-blue-800 border-blue-200',
  ready: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusLabels = {
  pending: '⏳ Pending',
  preparing: '👨‍🍳 Preparing',
  ready: '✅ Ready',
  completed: '✅ Completed',
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [newOrderCount, setNewOrderCount] = useState(0);
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = useCallback(async (showSpinner: boolean = false) => {
    try {
      if (showSpinner) setIsRefreshing(true);
      
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      
      // Check for new orders using functional setState to avoid dependency on orders
      setOrders(prevOrders => {
        if (prevOrders.length > 0) {
          const newOrders = data.filter((order: Order) => 
            !prevOrders.find(existingOrder => existingOrder.id === order.id)
          );
          if (newOrders.length > 0) {
            setNewOrderCount(prev => prev + newOrders.length);
            // Play notification sound (optional)
            if (typeof window !== 'undefined' && newOrders.length > 0) {
              // Simple notification sound using Web Audio API
              try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.1;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
              } catch (e) {
                // Ignore audio errors
              }
            }
          }
        }
        return data;
      });
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []); // Remove orders dependency to prevent infinite loop

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order');
      
      const data = await response.json();
      if (data.success) {
        // Update local state
        setOrders(prev => prev.map(order => 
          order.id === orderId ? data.order : order
        ));
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if API fails
      router.push('/admin/login');
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Auto-refresh every 30 seconds, but only when tab is visible
    const interval = setInterval(() => {
      // Only refresh if the page is visible (not in background tab)
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchOrders();
      }
    }, 30000);
    
    // Also refresh when user returns to tab
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchOrders();
      }
    };
    
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    return () => {
      clearInterval(interval);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [fetchOrders]);

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍟</div>
          <h2 className="text-xl font-medium text-secondary">Loading orders...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-medium text-secondary">{error}</h2>
          <Button onClick={fetchOrders} className="mt-4">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-warm-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl display-font text-coastal mb-1">Restaurant Admin</h1>
              <p className="text-secondary text-sm">Mount Pleasant Fish & Chips</p>
            </div>
            
            {/* Mobile: Stack vertically, Desktop: Horizontal */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {/* New Orders Alert */}
              {newOrderCount > 0 && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse w-fit">
                  {newOrderCount} New Order{newOrderCount > 1 ? 's' : ''}!
                </div>
              )}
              
              {/* Stats Row */}
              <div className="flex items-center gap-3 text-xs sm:text-sm text-secondary">
                <span className="font-medium">
                  📊 {filteredOrders.length} orders
                </span>
                <span className="hidden sm:inline">
                  🕒 {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => {
                    fetchOrders();
                    setNewOrderCount(0);
                  }} 
                  variant="secondary"
                  size="sm"
                  className="text-xs px-3 py-2"
                >
                  🔄 <span className="hidden sm:inline ml-1">Refresh</span>
                </Button>
                <Button 
                  onClick={handleLogout} 
                  variant="secondary"
                  size="sm"
                  className="text-xs px-3 py-2 border border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  🚪 <span className="hidden sm:inline ml-1">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Buttons - Mobile Scrollable */}
        <div className="mb-6">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max pb-2">
              {[
                { key: 'all', label: 'All Orders', count: orders.length },
                { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
                { key: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
                { key: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setFilterStatus(filter.key)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg border transition-colors text-sm whitespace-nowrap ${
                    filterStatus === filter.key
                      ? 'bg-coastal text-white border-coastal'
                      : 'bg-warm-white text-secondary border-border hover:border-coastal hover:text-coastal'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-secondary mb-2">No orders found</h3>
            <p className="text-secondary">
              {filterStatus === 'all' ? 'No orders have been placed yet.' : `No ${filterStatus} orders.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-warm-white rounded-lg border border-border p-4 sm:p-6">
                {/* Mobile: Stack header info vertically, Desktop: Side by side */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-coastal text-lg">
                      Order #{order.id.slice(-6)}
                    </h3>
                    <div className="text-secondary text-sm space-y-1">
                      <p>{formatDate(order.createdAt)} at {formatTime(order.createdAt)}</p>
                      {order.estimatedReady && (
                        <p className="text-accent font-medium">
                          Est. ready: {formatTime(order.estimatedReady)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Mobile: Full width, Desktop: Right aligned */}
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                    <span className="font-bold text-lg text-coastal">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Mobile: Stack sections, Desktop: Side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Customer Info */}
                  <div className="bg-muted-warm p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      👤 Customer Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="text-secondary font-medium min-w-[60px]">Name:</span> 
                        <span className="font-medium text-foreground">{order.customerName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="text-secondary font-medium min-w-[60px]">Phone:</span> 
                        <span className="font-medium text-foreground">{order.customerPhone}</span>
                      </div>
                      {order.customerEmail && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <span className="text-secondary font-medium min-w-[60px]">Email:</span> 
                          <span className="font-medium text-foreground break-all">{order.customerEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-muted-warm p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      🍽️ Order Items
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="border-b border-border last:border-b-0 pb-2 last:pb-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-sm sm:text-base block">
                                {item.quantity}x {item.name}
                              </span>
                              {item.selectedCustomizations && (
                                <div className="text-xs text-secondary mt-1 leading-relaxed">
                                  {Object.entries(item.selectedCustomizations)
                                    .filter(([_, value]) => value)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(', ')}
                                </div>
                              )}
                            </div>
                            <span className="font-bold text-sm sm:text-base text-coastal flex-shrink-0">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Update Buttons */}
                <div className="mt-4 sm:mt-6 pt-4 border-t border-border">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {order.status === 'pending' && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        variant="coastal"
                        size="sm"
                        className="w-full sm:w-auto justify-center sm:justify-start"
                      >
                        👨‍🍳 Start Preparing
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        variant="warm"
                        size="sm"
                        className="w-full sm:w-auto justify-center sm:justify-start"
                      >
                        ✅ Mark Ready
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        variant="secondary"
                        size="sm"
                        className="w-full sm:w-auto justify-center sm:justify-start"
                      >
                        ✅ Mark Completed
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}