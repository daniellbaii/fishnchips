'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MenuItem from '@/components/menu/MenuItem';
import Button from '@/components/ui/Button';
import CartSidebar from '@/components/cart/CartSidebar';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  popular?: boolean;
  customizations?: {
    batter?: string[];
    size?: string[];
    cooking?: string[];
    sauce?: string[];
  };
}

interface CartItem extends MenuItem {
  quantity: number;
  selectedCustomizations?: {
    batter?: string;
    size?: string;
    cooking?: string;
    sauce?: string;
  };
}

const menuItems: MenuItem[] = [
  { 
    id: 'barramundi', 
    name: 'Barramundi', 
    price: 12.50, 
    category: 'fish',
    description: 'Premium Australian barramundi, fresh caught and perfectly seasoned',
    image: '🐟',
    popular: true,
    customizations: {
      batter: ['Traditional', 'Tempura', 'Gluten-Free'],
      cooking: ['Fried', 'Grilled']
    }
  },
  { 
    id: 'snapper', 
    name: 'Snapper', 
    price: 13.00, 
    category: 'fish',
    description: 'Local Perth snapper, delicate and flaky with a golden crisp',
    image: '🐟',
    customizations: {
      batter: ['Traditional', 'Tempura', 'Gluten-Free'],
      cooking: ['Fried', 'Grilled']
    }
  },
  { 
    id: 'flathead', 
    name: 'Flathead', 
    price: 11.50, 
    category: 'fish',
    description: 'Sweet and tender flathead with our signature beer batter',
    image: '🐟',
    customizations: {
      batter: ['Traditional', 'Tempura', 'Gluten-Free'],
      cooking: ['Fried', 'Grilled']
    }
  },
  { 
    id: 'whiting', 
    name: 'Whiting', 
    price: 10.50, 
    category: 'fish',
    description: 'Delicate whiting fillets, perfect for first-time fish lovers',
    image: '🐟',
    customizations: {
      batter: ['Traditional', 'Tempura', 'Gluten-Free'],
      cooking: ['Fried', 'Grilled']
    }
  },
  { 
    id: 'regular-chips', 
    name: 'Regular Chips', 
    price: 4.50, 
    category: 'sides',
    description: 'Hand-cut potatoes, crispy outside and fluffy inside',
    image: '🍟',
    popular: true,
    customizations: {
      sauce: ['Tomato', 'Aioli', 'Tartare', 'Vinegar', 'None']
    }
  },
  { 
    id: 'large-chips', 
    name: 'Large Chips', 
    price: 6.50, 
    category: 'sides',
    description: 'Perfect for sharing - our famous hand-cut chips',
    image: '🍟',
    customizations: {
      sauce: ['Tomato', 'Aioli', 'Tartare', 'Vinegar', 'None']
    }
  },
  { 
    id: 'potato-scallops', 
    name: 'Potato Scallops', 
    price: 2.50, 
    category: 'sides',
    description: 'Thinly sliced potato in crispy golden batter - $2.50 each',
    image: '🥔'
  },
  { 
    id: 'dim-sims', 
    name: 'Dim Sims', 
    price: 3.00, 
    category: 'sides',
    description: 'Traditional steamed dim sims with soy dipping sauce - $3.00 each',
    image: '🥟'
  },
  { 
    id: 'prawns', 
    name: 'Prawns (6 pieces)', 
    price: 8.50, 
    category: 'seafood',
    description: 'Succulent tiger prawns in light, crispy batter',
    image: '🦐',
    customizations: {
      batter: ['Traditional', 'Tempura']
    }
  },
  { 
    id: 'calamari', 
    name: 'Calamari Rings', 
    price: 7.50, 
    category: 'seafood',
    description: 'Tender calamari rings, lightly seasoned and perfectly fried',
    image: '🦑'
  },
  { 
    id: 'crab-sticks', 
    name: 'Crab Sticks (4 pieces)', 
    price: 6.00, 
    category: 'seafood',
    description: 'Golden fried crab sticks with sweet chili dipping sauce',
    image: '🦀'
  },
];

export default function OrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [showCustomization, setShowCustomization] = useState<string | null>(null);
  const [tempCustomizations, setTempCustomizations] = useState<{
    batter?: string;
    size?: string;
    cooking?: string;
    sauce?: string;
  }>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [showCartSidebar, setShowCartSidebar] = useState<boolean>(false);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (showCustomization) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCustomization]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showCustomization) {
        setShowCustomization(null);
        setTempCustomizations({});
      }
    };

    if (showCustomization) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showCustomization]);

  const addToCart = async (item: MenuItem, customizations?: {
    batter?: string;
    size?: string;
    cooking?: string;
    sauce?: string;
  }) => {
    setIsAddingToCart(item.id);
    
    // Simulate brief loading for user feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCart(prevCart => {
      const cartItemWithCustomizations = {
        ...item,
        selectedCustomizations: customizations,
        quantity: 1
      };
      
      // Check if exact same item with same customizations exists
      const existingItemIndex = prevCart.findIndex(cartItem => 
        cartItem.id === item.id && 
        JSON.stringify(cartItem.selectedCustomizations) === JSON.stringify(customizations)
      );
      
      if (existingItemIndex !== -1) {
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [...prevCart, cartItemWithCustomizations];
    });
    
    setIsAddingToCart(null);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.customizations && Object.keys(item.customizations).length > 0) {
      setShowCustomization(item.id);
      setTempCustomizations({});
    } else {
      addToCart(item);
    }
  };

  const handleCustomizationSubmit = (item: MenuItem) => {
    addToCart(item, tempCustomizations);
    setShowCustomization(null);
    setTempCustomizations({});
  };

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };


  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Please add items to your cart before ordering.');
      return;
    }
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Please fill in your name and phone number.');
      return;
    }
    
    alert(`Order submitted! We'll call you at ${customerInfo.phone} when it's ready for pickup.`);
    setCart([]);
    setCustomerInfo({ name: '', phone: '', email: '' });
  };

  const fishItems = menuItems.filter(item => item.category === 'fish');
  const sidesItems = menuItems.filter(item => item.category === 'sides');
  const seafoodItems = menuItems.filter(item => item.category === 'seafood');
  const popularItems = menuItems.filter(item => item.popular);

  const getFilteredItems = () => {
    switch (activeCategory) {
      case 'fish': return fishItems;
      case 'sides': return sidesItems;
      case 'seafood': return seafoodItems;
      case 'popular': return popularItems;
      default: return menuItems;
    }
  };

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️', count: menuItems.length },
    { id: 'popular', name: 'Popular', icon: '⭐', count: popularItems.length },
    { id: 'fish', name: 'Fresh Fish', icon: '🐟', count: fishItems.length },
    { id: 'sides', name: 'Sides', icon: '🍟', count: sidesItems.length },
    { id: 'seafood', name: 'Seafood', icon: '🦐', count: seafoodItems.length },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        cart={cart} 
        onCartClick={() => setShowCartSidebar(true)} 
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍽️</div>
          <h2 className="text-3xl md:text-4xl display-font text-foreground mb-3">
            Order Online
          </h2>
          <p className="text-secondary max-w-2xl mx-auto">Build your perfect meal and we'll have it ready for pickup</p>
        </div>

        {/* Category Tabs */}
        <div className="overflow-x-auto scrollbar-hide mb-8">
          <div className="flex justify-start sm:justify-center gap-2 p-4 bg-warm-white rounded-xl shadow-sm min-w-max sm:min-w-0 px-4 sm:px-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[44px] ${
                activeCategory === category.id
                  ? 'bg-coastal text-white shadow-md'
                  : 'text-secondary hover:bg-muted-warm hover:text-coastal'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeCategory === category.id
                  ? 'bg-accent bg-opacity-20 text-white'
                  : 'bg-muted-warm text-secondary'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {getFilteredItems().map(item => (
            <MenuItem
              key={item.id}
              item={item}
              variant="card"
              onAddToCart={() => handleItemClick(item)}
              isLoading={isAddingToCart === item.id}
            />
          ))}
        </div>

        {/* Empty State */}
        {getFilteredItems().length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-secondary mb-2">No items found</h3>
            <p className="text-secondary">Try selecting a different category</p>
          </div>
        )}
      </main>

      {/* Enhanced Customization Modal */}
      {showCustomization && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => {
            setShowCustomization(null);
            setTempCustomizations({});
          }}
        >
          <div 
            className="bg-warm-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const item = menuItems.find(i => i.id === showCustomization);
              if (!item) return null;
              
              return (
                <>
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-warm-white border-b border-border p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl display-font text-coastal">Customize Your Order</h3>
                      <Button
                        onClick={() => setShowCustomization(null)}
                        variant="secondary"
                        size="sm"
                        className="w-8 h-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 border-0 flex items-center justify-center"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Item Info */}
                    <div className="text-center mb-8">
                      <div className="text-6xl mb-3">{item.image}</div>
                      <h4 className="text-2xl display-font text-coastal mb-2">{item.name}</h4>
                      <p className="text-secondary mb-4 leading-relaxed">{item.description}</p>
                    </div>

                    {/* Customization Options */}
                    <div className="space-y-6">
                      {item.customizations?.batter && (
                        <div>
                          <label className="block text-base font-semibold mb-3 text-coastal">
                            🥞 Choose Your Batter
                          </label>
                          <div className="grid grid-cols-1 gap-3">
                            {item.customizations.batter.map(option => (
                              <button
                                key={option}
                                onClick={() => setTempCustomizations(prev => ({...prev, batter: option}))}
                                className={`p-4 text-left rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                  tempCustomizations.batter === option
                                    ? 'bg-coastal text-white border-coastal shadow-lg'
                                    : 'bg-white border-border hover:border-coastal hover:shadow-md'
                                }`}
                              >
                                <div className="font-medium">{option}</div>
                                {option === 'Traditional' && <div className="text-sm opacity-75">Classic beer batter recipe</div>}
                                {option === 'Tempura' && <div className="text-sm opacity-75">Light and crispy Japanese style</div>}
                                {option === 'Gluten-Free' && <div className="text-sm opacity-75">Made with rice flour</div>}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.customizations?.cooking && (
                        <div>
                          <label className="block text-base font-semibold mb-3 text-coastal">
                            🔥 Cooking Method
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {item.customizations.cooking.map(option => (
                              <button
                                key={option}
                                onClick={() => setTempCustomizations(prev => ({...prev, cooking: option}))}
                                className={`p-4 text-center rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                  tempCustomizations.cooking === option
                                    ? 'bg-coastal text-white border-coastal shadow-lg'
                                    : 'bg-white border-border hover:border-coastal hover:shadow-md'
                                }`}
                              >
                                <div className="font-medium">{option}</div>
                                <div className="text-sm opacity-75 mt-1">
                                  {option === 'Fried' ? 'Traditional deep fried' : 'Healthier grilled option'}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.customizations?.sauce && (
                        <div>
                          <label className="block text-base font-semibold mb-3 text-coastal">
                            🍯 Choose Your Sauce
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {item.customizations.sauce.map(option => (
                              <button
                                key={option}
                                onClick={() => setTempCustomizations(prev => ({...prev, sauce: option}))}
                                className={`p-3 text-center rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                  tempCustomizations.sauce === option
                                    ? 'bg-coastal text-white border-coastal shadow-lg'
                                    : 'bg-white border-border hover:border-coastal hover:shadow-md'
                                }`}
                              >
                                <div className="font-medium">{option}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 mt-8 pt-6 border-t border-border">
                      <Button
                        onClick={() => setShowCustomization(null)}
                        variant="secondary"
                        size="lg"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleCustomizationSubmit(item)}
                        variant="coastal"
                        size="lg"
                        className="flex-2 shadow-lg hover:shadow-xl"
                      >
                        Add to Cart • ${item.price.toFixed(2)}
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
      
      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={showCartSidebar}
        onClose={() => setShowCartSidebar(false)}
        cart={cart}
        customerInfo={customerInfo}
        onCustomerInfoChange={setCustomerInfo}
        onQuantityChange={updateCartItemQuantity}
        onRemove={removeFromCart}
        onSubmitOrder={handleSubmitOrder}
      />
      
      <Footer />
    </div>
  );
}