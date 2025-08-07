import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-warm-white py-8 coastal-shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-lg display-font text-coastal mb-1">
              Mount Pleasant Fish & Chips
            </h3>
            <p className="text-sm text-secondary">
              Since 1985 • Perth, Australia
            </p>
          </div>

          {/* Quick Links */}
          <nav className="flex space-x-6 text-sm">
            <Link 
              href="/order" 
              className="text-secondary hover:text-coastal transition-colors"
            >
              Order
            </Link>
            <Link 
              href="/about" 
              className="text-secondary hover:text-coastal transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-secondary hover:text-coastal transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-secondary">
              &copy; {currentYear} All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}