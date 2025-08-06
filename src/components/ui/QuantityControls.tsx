import React from 'react';

interface QuantityControlsProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function QuantityControls({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  min = 0, 
  max,
  className = '' 
}: QuantityControlsProps) {
  const canDecrease = quantity > min;
  const canIncrease = max ? quantity < max : true;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={onDecrease}
        disabled={!canDecrease}
        className="w-8 h-8 bg-accent bg-opacity-10 hover:bg-opacity-20 text-accent rounded-full flex items-center justify-center font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
        aria-label={`Decrease quantity to ${Math.max(quantity - 1, min)}`}
      >
        -
      </button>
      <span 
        className="bg-coastal text-white px-3 py-1 rounded-full text-sm font-bold min-w-[2.5rem] text-center"
        aria-label={`Current quantity: ${quantity}`}
      >
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={!canIncrease}
        className="w-8 h-8 bg-seafoam bg-opacity-20 hover:bg-opacity-30 text-seafoam rounded-full flex items-center justify-center font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
        aria-label={`Increase quantity to ${max ? Math.min(quantity + 1, max) : quantity + 1}`}
      >
        +
      </button>
    </div>
  );
}