import React from 'react';
import { Skeleton, SkeletonText, SkeletonButton } from '@/components/ui/Skeleton';

export const TabLoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Skeleton height={28} width={200} className="mb-2" />
          <SkeletonText lines={2} className="w-80" />
        </div>
        <div className="flex gap-2">
          <SkeletonButton />
          <SkeletonButton />
        </div>
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-warm-white rounded-lg border border-border p-6">
          <Skeleton height={24} width={150} className="mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted-warm rounded-lg">
                <SkeletonText lines={2} className="w-1/2" />
                <SkeletonButton className="w-20" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-warm-white rounded-lg border border-border p-6">
          <Skeleton height={24} width={180} className="mb-4" />
          <div className="space-y-3">
            <SkeletonText lines={4} />
            <div className="flex gap-2 mt-4">
              <SkeletonButton />
              <SkeletonButton />
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional content */}
      <div className="bg-warm-white rounded-lg border border-border p-6">
        <Skeleton height={24} width={120} className="mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="p-4 bg-muted-warm rounded-lg">
              <Skeleton height={20} width="60%" className="mb-2" />
              <Skeleton height={32} width="80%" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};