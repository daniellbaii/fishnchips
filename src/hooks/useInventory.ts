import { useState, useEffect } from 'react';
import { menuItems } from '@/data/menuItems';
import { MenuItem, MenuCategory } from '@/types';

interface ExtendedMenuItem extends MenuItem {
  isAvailable: boolean;
  isOutOfStock: boolean;
  lastUpdated: string | null;
}

export function useInventory() {
  const [inventory, setInventory] = useState<ExtendedMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory');
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
      
      const data = await response.json();
      
      // Merge inventory data with menu items to include customizations
      const mergedItems: ExtendedMenuItem[] = data.items.map((item: any) => {
        const menuItem = menuItems.find(m => m.id === item.id);
        return {
          ...menuItem,
          ...item,
          customizations: menuItem?.customizations || {}
        } as ExtendedMenuItem;
      });
      
      setInventory(mergedItems);
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Fallback to static menu items with default availability
      const fallbackItems: ExtendedMenuItem[] = menuItems.map(item => ({
        ...item,
        isAvailable: true,
        isOutOfStock: false,
        lastUpdated: null
      }));
      setInventory(fallbackItems);
    } finally {
      setLoading(false);
    }
  };

  // Get available items (not disabled, but include out-of-stock items)
  const availableItems = inventory.filter(item => item.isAvailable);

  // Get items by category, filtered by availability
  const getItemsByCategory = (category: string) => {
    if (category === 'all') {
      return availableItems;
    }
    if (category === 'popular') {
      return availableItems.filter(item => item.popular);
    }
    return availableItems.filter(item => item.category === category);
  };

  return {
    inventory,
    availableItems,
    loading,
    error,
    getItemsByCategory,
    refetch: fetchInventory
  };
}