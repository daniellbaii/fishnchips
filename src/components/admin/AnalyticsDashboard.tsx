'use client';

import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    todaysOrders: number;
    todaysRevenue: number;
    pendingOrders: number;
    readyOrders: number;
  };
  recentTrends: {
    dailyStats: Array<{
      date: string;
      orders: number;
      revenue: number;
    }>;
    popularItems: Array<{
      name: string;
      quantity: number;
      revenue: number;
    }>;
    hourlyDistribution: Array<{
      hour: number;
      orders: number;
    }>;
  };
  orderStatuses: {
    pending: number;
    preparing: number;
    ready: number;
    completed: number;
  };
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?days=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaxValue = (data: number[]) => Math.max(...data, 1);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Unable to load analytics</h3>
          <p className="text-gray-600">Please try again later.</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Analytics Dashboard</h2>
          <p className="text-sm text-gray-600">Business insights and performance metrics</p>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Period:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={1}>Today</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📋</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{analytics.summary.totalOrders}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">💰</div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(analytics.summary.totalRevenue)}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📈</div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(analytics.summary.averageOrderValue)}
              </div>
              <div className="text-sm text-gray-600">Avg Order Value</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🕒</div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{analytics.summary.todaysOrders}</div>
              <div className="text-sm text-gray-600">Today's Orders</div>
              <div className="text-xs text-green-600 font-medium">
                {formatCurrency(analytics.summary.todaysRevenue)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Orders Alert */}
      {(analytics.summary.pendingOrders > 0 || analytics.summary.readyOrders > 0) && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⚠️</div>
            <div>
              <div className="font-semibold text-orange-800">Active Orders Need Attention</div>
              <div className="text-sm text-orange-700">
                {analytics.summary.pendingOrders} pending orders, {analytics.summary.readyOrders} orders ready for pickup
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Revenue</h3>
          <div className="space-y-2">
            {analytics.recentTrends.dailyStats.map((day, index) => {
              const maxRevenue = getMaxValue(analytics.recentTrends.dailyStats.map(d => d.revenue));
              const widthPercent = (day.revenue / maxRevenue) * 100;
              
              return (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600 flex-shrink-0">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="bg-gray-200 rounded-full h-6 relative">
                      <div
                        className="bg-green-500 h-6 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(widthPercent, 2)}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center px-3">
                        <span className="text-sm font-medium text-white">
                          {formatCurrency(day.revenue)} ({day.orders} orders)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analytics.orderStatuses).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)} mr-3`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-600">({count} orders)</span>
                </div>
                <div className="text-lg font-semibold text-gray-800">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Items</h3>
          <div className="space-y-3">
            {analytics.recentTrends.popularItems.slice(0, 8).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.quantity} sold</div>
                </div>
                <div className="text-sm font-semibold text-green-600 ml-4">
                  {formatCurrency(item.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders by Hour</h3>
          <div className="space-y-2">
            {analytics.recentTrends.hourlyDistribution
              .filter(hour => hour.orders > 0)
              .map((hour, index) => {
                const maxOrders = getMaxValue(analytics.recentTrends.hourlyDistribution.map(h => h.orders));
                const widthPercent = (hour.orders / maxOrders) * 100;
                
                return (
                  <div key={index} className="flex items-center">
                    <div className="w-16 text-sm text-gray-600 flex-shrink-0">
                      {hour.hour}:00
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="bg-gray-200 rounded-full h-4 relative">
                        <div
                          className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(widthPercent, 2)}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center px-2">
                          <span className="text-xs font-medium text-white">
                            {hour.orders} orders
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          {analytics.recentTrends.hourlyDistribution.every(h => h.orders === 0) && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-sm">No orders in selected period</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}