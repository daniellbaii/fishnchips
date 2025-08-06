import React from 'react';
import Button from '@/components/ui/Button';
import CartItem from '@/components/menu/CartItem';
import { useModal } from '@/hooks/useModal';
import { useCart } from '@/contexts/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (e: React.FormEvent) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  onSubmitOrder
}: CartSidebarProps) {
  const { cart, customerInfo, setCustomerInfo, updateCartItemQuantity, removeFromCart, getTotalPrice } = useCart();
  // Handle modal behavior
  useModal({ isOpen, onClose });

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 md:max-w-lg bg-warm-white shadow-2xl z-[70] transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-warm-white border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🛍️</span>
              <h3 className="text-xl display-font text-coastal">Your Cart</h3>
            </div>
            <Button
              onClick={onClose}
              variant="secondary"
              size="sm"
              className="w-8 h-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 border-0 flex items-center justify-center"
            >
              ✕
            </Button>
          </div>
          {cart.length > 0 && (
            <div className="bg-accent text-white text-sm font-bold px-2 py-1 rounded-full mt-2 w-fit">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </div>
          )}
        </div>

        <div className="p-6">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4 opacity-50">🍽️</div>
              <p className="text-secondary font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-secondary">Add some delicious items from our menu!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item, index) => (
                  <CartItem
                    key={`${item.id}-${index}`}
                    item={item}
                    onQuantityChange={updateCartItemQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>

              {/* Order Total */}
              <div className="bg-gradient-to-r from-accent to-accent-light p-4 rounded-lg mb-6 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Order Total</span>
                  <span className="text-2xl font-bold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="text-sm opacity-90 mt-1">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items • Ready in 15-20 min
                </div>
              </div>

              {/* Customer Details Form */}
              <form onSubmit={onSubmitOrder} className="space-y-6">
                <div className="text-center mb-4">
                  <div className="text-2xl mb-2">📋</div>
                  <h4 className="text-lg casual-font text-coastal">Your Details</h4>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Name *</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full p-4 text-base border-2 border-border focus:border-coastal rounded-lg bg-warm-white transition-colors duration-200 text-foreground min-h-[48px]"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Phone *</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full p-4 text-base border-2 border-border focus:border-coastal rounded-lg bg-warm-white transition-colors duration-200 text-foreground min-h-[48px]"
                    placeholder="Your phone number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Email</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full p-4 text-base border-2 border-border focus:border-coastal rounded-lg bg-warm-white transition-colors duration-200 text-foreground min-h-[48px]"
                    placeholder="your@email.com (optional)"
                  />
                </div>
                <Button
                  type="submit"
                  variant="warm"
                  size="lg"
                  className="w-full py-4 font-bold"
                >
                  🍽️ Place Order for Pickup
                </Button>
              </form>

              <div className="mt-6 p-4 bg-seafoam bg-opacity-10 rounded-lg border border-seafoam border-opacity-30">
                <div className="text-center">
                  <div className="text-2xl mb-2">📞</div>
                  <p className="text-sm text-secondary font-medium">
                    We'll call you when your order is ready for pickup
                  </p>
                  <p className="text-xs text-secondary mt-1">
                    Usually ready in 15-20 minutes
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}