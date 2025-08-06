'use client';

import React, { useState, useEffect } from 'react';

interface RestaurantStatus {
  isOpen: boolean;
  isTemporarilyClosed: boolean;
  closureReason: string | null;
  currentTime: string;
  nextOpenTime: string | null;
}

export default function RestaurantStatus() {
  const [status, setStatus] = useState<RestaurantStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    
    // Update every 5 minutes
    const interval = setInterval(fetchStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/restaurant-status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching restaurant status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !status) {
    return null; // Don't show anything while loading
  }

  if (status.isOpen) {
    return (
      <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-6">
        <div className="flex items-center">
          <span className="text-xl mr-3">🟢</span>
          <div>
            <div className="font-semibold">We're Open!</div>
            <div className="text-sm">Place your order now for pickup</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6">
      <div className="flex items-center">
        <span className="text-xl mr-3">🔴</span>
        <div>
          <div className="font-semibold">We're Currently Closed</div>
          <div className="text-sm">
            {status.closureReason}
            {status.nextOpenTime && (
              <div className="mt-1">
                Next opening: {status.nextOpenTime}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}