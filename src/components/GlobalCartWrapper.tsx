'use client';

import React, { useState, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import CartSidebar from '@/components/cart/CartSidebar';
import { useCart } from '@/contexts/CartContext';

interface GlobalCartContextType {
  showCartSidebar: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const GlobalCartContext = createContext<GlobalCartContextType | undefined>(undefined);

export function useGlobalCart() {
  const context = useContext(GlobalCartContext);
  if (!context) {
    throw new Error('useGlobalCart must be used within a GlobalCartWrapper');
  }
  return context;
}

export default function GlobalCartWrapper({ children }: { children: React.ReactNode }) {
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const { cart, customerInfo, getTotalPrice, clearCart, setCustomerInfo } = useCart();
  const pathname = usePathname();
  
  // Don't show global cart on order page (it has its own local cart sidebar)
  const isOrderPage = pathname === '/order';

  const openCart = () => setShowCartSidebar(true);
  const closeCart = () => setShowCartSidebar(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (cart.length === 0) {
        alert('Please add items to your cart before ordering.');
        return;
      }
      if (!customerInfo.name || !customerInfo.phone) {
        alert('Please fill in your name and phone number.');
        return;
      }
      
      // Calculate total
      const total = getTotalPrice();
      
      // Submit order to database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          customerEmail: customerInfo.email || undefined,
          items: cart,
          total,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }
      
      if (data.success) {
        alert(data.message);
        clearCart();
        setCustomerInfo({ name: '', phone: '', email: '' });
        closeCart();
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was an error submitting your order. Please try again.');
    }
  };

  const contextValue: GlobalCartContextType = {
    showCartSidebar,
    openCart,
    closeCart,
  };

  return (
    <GlobalCartContext.Provider value={contextValue}>
      {children}
      
      {/* Global Cart Sidebar - Only show on non-order pages */}
      {!isOrderPage && (
        <CartSidebar
          isOpen={showCartSidebar}
          onClose={closeCart}
          onSubmitOrder={handleSubmitOrder}
        />
      )}
    </GlobalCartContext.Provider>
  );
}