'use client';

import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import OrderCard from '@/components/admin/OrderCard';
import { AdminLoadingState, OrdersLoadingState } from '@/components/admin/AdminLoadingState';
import { TabLoadingState } from '@/components/admin/TabLoadingState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Order } from '@/types';
import { ORDER_STATUS_CONFIG, TIMING, API_ENDPOINTS } from '@/lib/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { formatTime, formatDate } from '@/lib/utils';

// Lazy load heavy components that are not always visible
const BusinessHoursManager = lazy(() => import('@/components/admin/BusinessHoursManager'));
const InventoryManager = lazy(() => import('@/components/admin/InventoryManager'));
const AnalyticsDashboard = lazy(() => import('@/components/admin/AnalyticsDashboard'));

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'hours' | 'inventory' | 'analytics'>('orders');
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
      
      const response = await fetch(API_ENDPOINTS.ORDERS);
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
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${orderId}`, {
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

  // Debounced refresh to prevent excessive API calls
  const debouncedRefresh = useDebounce(() => {
    if (typeof document !== 'undefined' && !document.hidden) {
      fetchOrders();
    }
  }, 1000);

  useEffect(() => {
    fetchOrders();
    
    // Auto-refresh with debounced calls
    const interval = setInterval(() => {
      debouncedRefresh();
    }, TIMING.AUTO_REFRESH_INTERVAL);
    
    // Also refresh when user returns to tab
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        debouncedRefresh();
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
  }, [fetchOrders, debouncedRefresh]);

  // Memoize filtered orders to prevent unnecessary recalculations
  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      filterStatus === 'all' || order.status === filterStatus
    );
  }, [orders, filterStatus]);

  // Memoize order counts for filter buttons
  const orderCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      completed: orders.filter(o => o.status === 'completed').length
    };
  }, [orders]);

  // Remove duplicate format functions - now using utils

  if (loading) {
    return <AdminLoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-medium text-secondary">{error}</h2>
          <Button onClick={() => {
            setError(null);
            setLoading(true);
            fetchOrders(true);
          }} className="mt-4">Try Again</Button>
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
                    fetchOrders(true);
                    setNewOrderCount(0);
                  }} 
                  variant="secondary"
                  size="sm"
                  className="text-xs px-3 py-2"
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <>⏳ <span className="hidden sm:inline ml-1">Refreshing...</span></>
                  ) : (
                    <>🔄 <span className="hidden sm:inline ml-1">Refresh</span></>
                  )}
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
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-border">
            <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-coastal text-coastal'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📋 Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-coastal text-coastal'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Analytics
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'inventory'
                    ? 'border-coastal text-coastal'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📦 Inventory
              </button>
              <button
                onClick={() => setActiveTab('hours')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'hours'
                    ? 'border-coastal text-coastal'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🕒 Business Hours
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <>
            {/* Filter Buttons - Mobile Scrollable */}
        <div className="mb-6">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max pb-2">
              {[
                { key: 'all', label: 'All Orders', count: orderCounts.all },
                { key: 'pending', label: 'Pending', count: orderCounts.pending },
                { key: 'preparing', label: 'Preparing', count: orderCounts.preparing },
                { key: 'ready', label: 'Ready', count: orderCounts.ready },
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
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
              />
            ))}
          </div>
        )}
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <Suspense fallback={<TabLoadingState />}>
            <AnalyticsDashboard />
          </Suspense>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <Suspense fallback={<TabLoadingState />}>
            <InventoryManager />
          </Suspense>
        )}

        {/* Business Hours Tab */}
        {activeTab === 'hours' && (
          <Suspense fallback={<TabLoadingState />}>
            <BusinessHoursManager />
          </Suspense>
        )}
      </main>
    </div>
  );
}