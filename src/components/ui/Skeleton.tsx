import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  rounded = 'md',
  children
}) => {
  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md', 
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  const style = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height })
  };

  return (
    <div
      className={clsx(
        'bg-gray-200 animate-pulse',
        roundedClass[rounded],
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

// Specific skeleton components for common patterns
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className 
}) => (
  <div className={clsx('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height={16}
        width={i === lines - 1 ? '75%' : '100%'}
        className="last:w-3/4"
      />
    ))}
  </div>
);

export const SkeletonButton: React.FC<{ className?: string }> = ({ className }) => (
  <Skeleton className={clsx('h-10 w-24', className)} rounded="md" />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('bg-warm-white rounded-lg border border-border p-4 sm:p-6', className)}>
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
      <div className="flex-1">
        <Skeleton height={24} width={120} className="mb-2" />
        <SkeletonText lines={2} className="w-3/4" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton height={24} width={80} rounded="full" />
        <Skeleton height={24} width={60} />
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <div className="bg-muted-warm p-3 sm:p-4 rounded-lg">
        <Skeleton height={20} width={150} className="mb-3" />
        <SkeletonText lines={3} />
      </div>
      <div className="bg-muted-warm p-3 sm:p-4 rounded-lg">
        <Skeleton height={20} width={120} className="mb-3" />
        <SkeletonText lines={4} />
      </div>
    </div>
    
    <div className="mt-4 sm:mt-6 pt-4 border-t border-border">
      <div className="flex gap-2">
        <SkeletonButton />
        <SkeletonButton />
      </div>
    </div>
  </div>
);