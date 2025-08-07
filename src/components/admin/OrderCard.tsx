import React, { memo } from 'react';
import Button from '@/components/ui/Button';
import { Order } from '@/types';
import { ORDER_STATUS_CONFIG, ORDER_STATUS } from '@/lib/constants';
import { formatTime, formatDate, formatCurrency } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: string) => void;
}

const OrderCard = memo<OrderCardProps>(({ order, onUpdateStatus }) => {
  return (
    <div className="bg-warm-white rounded-lg border border-border p-4 sm:p-6">
      {/* Mobile: Stack header info vertically, Desktop: Side by side */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-coastal text-lg">
            Order #{order.id.slice(-6)}
          </h3>
          <div className="text-secondary text-sm space-y-1">
            <p>{formatDate(order.createdAt)} at {formatTime(order.createdAt)}</p>
            {order.estimatedReady && (
              <p className="text-accent font-medium">
                Est. ready: {formatTime(order.estimatedReady)}
              </p>
            )}
          </div>
        </div>
        
        {/* Mobile: Full width, Desktop: Right aligned */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${ORDER_STATUS_CONFIG[order.status]?.className || ''}`}>
            {ORDER_STATUS_CONFIG[order.status]?.label || order.status}
          </span>
          <span className="font-bold text-lg text-coastal">
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>

      {/* Mobile: Stack sections, Desktop: Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Customer Info */}
        <div className="bg-muted-warm p-3 sm:p-4 rounded-lg">
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
            👤 Customer Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-secondary font-medium min-w-[60px]">Name:</span> 
              <span className="font-medium text-foreground">{order.customerName}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-secondary font-medium min-w-[60px]">Phone:</span> 
              <span className="font-medium text-foreground">{order.customerPhone}</span>
            </div>
            {order.customerEmail && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-secondary font-medium min-w-[60px]">Email:</span> 
                <span className="font-medium text-foreground break-all">{order.customerEmail}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-muted-warm p-3 sm:p-4 rounded-lg">
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
            🍽️ Order Items
          </h4>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={`${item.name}-${index}`} className="border-b border-border last:border-b-0 pb-2 last:pb-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm sm:text-base block">
                      {item.quantity}x {item.name}
                    </span>
                    {item.selectedCustomizations && (
                      <div className="text-xs text-secondary mt-1 leading-relaxed">
                        {Object.entries(item.selectedCustomizations)
                          .filter(([_, value]) => value)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-sm sm:text-base text-coastal flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Update Buttons */}
      <div className="mt-4 sm:mt-6 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {order.status === ORDER_STATUS.PENDING && (
            <Button
              onClick={() => onUpdateStatus(order.id, ORDER_STATUS.PREPARING)}
              variant="coastal"
              size="sm"
              className="w-full sm:w-auto justify-center sm:justify-start"
            >
              👨‍🍳 Start Preparing
            </Button>
          )}
          {order.status === ORDER_STATUS.PREPARING && (
            <Button
              onClick={() => onUpdateStatus(order.id, ORDER_STATUS.READY)}
              variant="warm"
              size="sm"
              className="w-full sm:w-auto justify-center sm:justify-start"
            >
              ✅ Mark Ready
            </Button>
          )}
          {order.status === ORDER_STATUS.READY && (
            <Button
              onClick={() => onUpdateStatus(order.id, ORDER_STATUS.COMPLETED)}
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto justify-center sm:justify-start"
            >
              ✅ Mark Completed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

OrderCard.displayName = 'OrderCard';

export default OrderCard;