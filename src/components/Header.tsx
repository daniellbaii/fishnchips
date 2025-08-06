'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useGlobalCart } from '@/components/GlobalCartWrapper';

interface HeaderProps {
  onCartClick?: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, getTotalItems } = useCart();
  const { openCart } = useGlobalCart();
  
  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick(); // Use local handler if provided (for order page)
    } else {
      openCart(); // Use global cart handler for other pages
    }
  };

  return (
    <header className="bg-warm-white coastal-shadow sticky top-0 z-50 wave-border">
      <nav className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-xl sm:text-2xl md:text-3xl display-font text-coastal flex-1 min-w-0">
            <Link href="/" className="hover:text-primary-dark transition-colors block truncate">
              <span className="hidden sm:inline">Mount Pleasant Fish and Chips</span>
              <span className="sm:hidden">Mount Pleasant F&C</span>
            </Link>
          </h1>
          
          {/* Desktop Navigation */}
          <ul className="hidden lg:flex space-x-6 items-center">
            <li>
              <Link 
                href="/order" 
                className="hover:text-coastal transition-all duration-300 font-medium text-sm xl:text-base"
              >
                Order
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className="hover:text-coastal transition-all duration-300 font-medium text-sm xl:text-base"
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="hover:text-coastal transition-all duration-300 font-medium text-sm xl:text-base"
              >
                Contact
              </Link>
            </li>
            <li>
              <button
                onClick={handleCartClick}
                className="relative btn-warm cursor-pointer flex items-center space-x-2 min-h-[44px] min-w-[44px] px-4 py-2"
                aria-label={`Shopping cart with ${getTotalItems()} items`}
              >
                <span>🛍️</span>
                <span className="hidden xl:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </li>
          </ul>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Cart Button for Mobile */}
            <button
              onClick={handleCartClick}
              className="relative btn-warm cursor-pointer flex items-center justify-center min-h-[44px] min-w-[44px] p-2"
              aria-label={`Shopping cart with ${getTotalItems()} items`}
            >
              <span className="text-xl">🛍️</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] p-2 text-coastal hover:text-primary-dark transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border mt-4 pt-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/order"
                  className="py-3 px-4 hover:bg-muted-warm hover:text-coastal transition-all duration-300 font-medium rounded-lg text-center min-h-[44px] flex items-center justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  📋 Order Online
                </Link>
              </li>
              <li>
                <Link 
                  href="/#about"
                  className="py-3 px-4 hover:bg-muted-warm hover:text-coastal transition-all duration-300 font-medium rounded-lg text-center min-h-[44px] flex items-center justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🏖️ About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/#contact"
                  className="py-3 px-4 hover:bg-muted-warm hover:text-coastal transition-all duration-300 font-medium rounded-lg text-center min-h-[44px] flex items-center justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  📍 Contact
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}