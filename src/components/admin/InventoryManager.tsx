'use client';

import React, { useState, useEffect } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  popular?: boolean;
  isAvailable: boolean;
  isOutOfStock: boolean;
  lastUpdated: string | null;
}

interface InventoryData {
  items: InventoryItem[];
}

const CATEGORY_NAMES = {
  fish: 'Fish',
  sides: 'Sides', 
  seafood: 'Seafood'
};

const CATEGORY_EMOJIS = {
  fish: '🐟',
  sides: '🍟',
  seafood: '🦐'
};

export default function InventoryManager() {
  const [inventory, setInventory] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/inventory');
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInventoryItem = async (itemId: string, isAvailable: boolean, isOutOfStock: boolean) => {
    setUpdating(itemId);
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          isAvailable,
          isOutOfStock
        }),
      });

      if (response.ok) {
        // Update local state
        setInventory(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.map(item =>
              item.id === itemId
                ? { ...item, isAvailable, isOutOfStock, lastUpdated: new Date().toISOString() }
                : item
            )
          };
        });
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (item: InventoryItem) => {
    if (!item.isAvailable) return 'bg-gray-100 text-gray-600';
    if (item.isOutOfStock) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (item: InventoryItem) => {
    if (!item.isAvailable) return 'Disabled';
    if (item.isOutOfStock) return 'Out of Stock';
    return 'Available';
  };

  const filteredItems = inventory?.items.filter(item => {
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const statusMatch = filterStatus === 'all' ||
      (filterStatus === 'available' && item.isAvailable && !item.isOutOfStock) ||
      (filterStatus === 'out-of-stock' && item.isOutOfStock) ||
      (filterStatus === 'disabled' && !item.isAvailable);
    
    return categoryMatch && statusMatch;
  }) || [];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Inventory Management</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage item availability and stock status
        </p>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_NAMES).map(([key, name]) => (
                <option key={key} value={key}>
                  {CATEGORY_EMOJIS[key as keyof typeof CATEGORY_EMOJIS]} {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Items</option>
              <option value="available">Available</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Item Info */}
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-3xl flex-shrink-0">{item.image}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      {item.popular && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Popular
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item)}`}>
                        {getStatusText(item)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                      <span>
                        {CATEGORY_EMOJIS[item.category as keyof typeof CATEGORY_EMOJIS]}{' '}
                        {CATEGORY_NAMES[item.category as keyof typeof CATEGORY_NAMES]}
                      </span>
                      {item.lastUpdated && (
                        <span>Updated: {new Date(item.lastUpdated).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:items-end">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateInventoryItem(item.id, true, false)}
                      disabled={updating === item.id || (item.isAvailable && !item.isOutOfStock)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        item.isAvailable && !item.isOutOfStock
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-green-600 hover:bg-green-700 text-white disabled:opacity-50'
                      }`}
                    >
                      {updating === item.id ? 'Updating...' : '✅ Available'}
                    </button>
                    
                    <button
                      onClick={() => updateInventoryItem(item.id, true, true)}
                      disabled={updating === item.id || (item.isAvailable && item.isOutOfStock)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        item.isAvailable && item.isOutOfStock
                          ? 'bg-red-500 text-white cursor-default'
                          : 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50'
                      }`}
                    >
                      {updating === item.id ? 'Updating...' : '🚫 Out of Stock'}
                    </button>
                    
                    <button
                      onClick={() => updateInventoryItem(item.id, false, false)}
                      disabled={updating === item.id || !item.isAvailable}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        !item.isAvailable
                          ? 'bg-gray-500 text-white cursor-default'
                          : 'bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50'
                      }`}
                    >
                      {updating === item.id ? 'Updating...' : '❌ Disable'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No items found</h3>
            <p className="text-gray-600">
              {filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters to see more items.'
                : 'No inventory items available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}