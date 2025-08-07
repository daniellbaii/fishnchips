import React from 'react';
import { SkeletonCard, Skeleton, SkeletonButton } from '@/components/ui/Skeleton';

export const AdminLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="bg-warm-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <Skeleton height={28} width={200} className="mb-1" />
              <Skeleton height={16} width={150} />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <Skeleton height={20} width={100} />
                <Skeleton height={20} width={80} />
              </div>
              
              <div className="flex items-center gap-2">
                <SkeletonButton />
                <SkeletonButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Navigation Skeleton */}
        <div className="mb-6">
          <div className="border-b border-border">
            <nav className="flex space-x-2 sm:space-x-8">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} height={32} width={100} className="mb-2" />
              ))}
            </nav>
          </div>
        </div>

        {/* Filter Buttons Skeleton */}
        <div className="mb-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <SkeletonButton key={i} className="w-28" />
            ))}
          </div>
        </div>

        {/* Orders List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  );
};

export const OrdersLoadingState: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};