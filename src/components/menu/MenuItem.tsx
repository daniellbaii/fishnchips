interface MenuItemBase {
  name: string;
  price: number;
  description?: string;
  image?: string;
  popular?: boolean;
  customizations?: any;
}

interface MenuItemListProps {
  item: MenuItemBase;
  variant: 'list';
}

interface MenuItemCardProps {
  item: MenuItemBase;
  variant: 'card';
  onAddToCart?: () => void;
  isLoading?: boolean;
}

type MenuItemProps = MenuItemListProps | MenuItemCardProps;

export default function MenuItem(props: MenuItemProps) {
  const { item, variant } = props;

  if (variant === 'list') {
    return (
      <li className="flex justify-between items-center py-3 border-b border-border last:border-b-0">
        <span className="font-medium text-foreground">{item.name}</span>
        <span className="text-warm font-bold text-lg">${item.price.toFixed(2)}</span>
      </li>
    );
  }

  if (variant === 'card') {
    const { onAddToCart, isLoading } = props;
    
    return (
      <div className="group relative">
        <div className="menu-card hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1">
          {/* Price Badge */}
          <div className="absolute top-4 right-4 bg-accent text-white font-bold px-3 py-1 rounded-full text-lg shadow-lg z-10">
            ${item.price.toFixed(2)}
          </div>
          
          {/* Popular Badge */}
          {item.popular && (
            <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
              ⭐ Popular
            </div>
          )}

          <div className="p-6">
            {/* Food Image */}
            <div className="text-center mb-4">
              <div className="text-7xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {item.image || '🍽️'}
              </div>
              
              {/* Item Info */}
              <h4 className="text-xl display-font text-coastal mb-2">{item.name}</h4>
              {item.description && (
                <p className="text-sm text-secondary mb-4 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              )}
              
              {/* Customization Indicator */}
              {item.customizations && (
                <div className="inline-flex items-center text-xs bg-seafoam bg-opacity-20 text-coastal px-3 py-1 rounded-full mb-4">
                  <span className="mr-1">⚙️</span>
                  Customizable
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="space-y-2">
              <button
                onClick={onAddToCart}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-coastal hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : item.customizations ? (
                  'Customize & Add'
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}