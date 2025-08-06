import QuantityControls from '@/components/ui/QuantityControls';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    selectedCustomizations?: {
      batter?: string;
      size?: string;
      cooking?: string;
      sauce?: string;
    };
  };
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
  showCustomizations?: boolean;
}

export default function CartItem({ 
  item, 
  onQuantityChange, 
  onRemove, 
  showCustomizations = true 
}: CartItemProps) {
  const handleIncrease = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  return (
    <div className="bg-warm-white p-4 rounded-lg border border-border hover:border-coastal transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-2">
          <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
          
          {/* Customizations */}
          {showCustomizations && item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
            <div className="text-xs text-secondary mt-1">
              {Object.entries(item.selectedCustomizations).map(([key, value]) => 
                value && (
                  <span key={key} className="inline-block bg-seafoam bg-opacity-20 text-coastal px-2 py-1 rounded mr-1 mb-1">
                    {value}
                  </span>
                )
              )}
            </div>
          )}
          
          <div className="text-sm text-secondary mt-1">
            ${item.price.toFixed(2)} × {item.quantity}
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-bold text-accent">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center justify-between">
        <QuantityControls
          quantity={item.quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          min={0}
        />
      </div>
    </div>
  );
}