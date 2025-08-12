import React from 'react';
import { Card } from './Card';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`animate-pulse bg-stone-200 rounded ${className}`}></div>;
};

export const CourseCardSkeleton: React.FC = () => {
  return (
    <Card>
      <div className="flex justify-between mb-3">
        <div>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <Skeleton className="h-3 w-32 mt-4" />
      <Skeleton className="h-8 w-24 mt-3" />
    </Card>
  );
};

export const StatTilesSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="flex flex-col p-4">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <Skeleton className="h-6 w-16 mt-1" />
        </Card>
      ))}
    </div>
  );
};

export const MapSectionSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="w-full h-56 bg-stone-200 rounded-lg"></div>
    </Card>
  );
};
