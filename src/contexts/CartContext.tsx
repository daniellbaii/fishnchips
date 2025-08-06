'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CustomerInfo } from '@/types';

interface CartContextType {
  cart: CartItem[];
  customerInfo: CustomerInfo;
  addToCart: (item: CartItem) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('fishandchips-cart');
        const savedCustomerInfo = localStorage.getItem('fishandchips-customer');
        
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
        
        if (savedCustomerInfo) {
          setCustomerInfo(JSON.parse(savedCustomerInfo));
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fishandchips-cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart]);

  // Save customer info to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fishandchips-customer', JSON.stringify(customerInfo));
      } catch (error) {
        console.error('Error saving customer info to localStorage:', error);
      }
    }
  }, [customerInfo]);

  const addToCart = (newItem: CartItem) => {
    setCart(prevCart => {
      // Check if exact same item with same customizations exists
      const existingItemIndex = prevCart.findIndex(cartItem => 
        cartItem.id === newItem.id && 
        JSON.stringify(cartItem.selectedCustomizations) === JSON.stringify(newItem.selectedCustomizations)
      );
      
      if (existingItemIndex !== -1) {
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + newItem.quantity }
            : cartItem
        );
      }
      
      return [...prevCart, newItem];
    });
  };

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fishandchips-cart');
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const contextValue: CartContextType = {
    cart,
    customerInfo,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    setCustomerInfo,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}