import React, { Suspense } from 'react';
import { Card } from './Card';
import { Map as MapIcon, Loader } from 'lucide-react';
import type { Course } from '../types';

// Lazy load the actual map component
const MapSection = React.lazy(() => import('./MapSection').then(module => ({ default: module.MapSection })));

interface LazyMapSectionProps {
  courses: Course[];
  loading?: boolean;
}

const MapSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-semibold flex items-center gap-1.5">
        <MapIcon size={16} className="text-emerald-500" />
        Recent Courses
      </h2>
    </div>
    <div className="relative rounded-lg overflow-hidden">
      <div className="w-full h-56 bg-stone-100 flex items-center justify-center">
        <Loader size={24} className="animate-spin text-emerald-500" />
      </div>
    </div>
  </Card>
);

export const LazyMapSection: React.FC<LazyMapSectionProps> = ({ courses, loading = false }) => {
  return (
    <Suspense fallback={<MapSkeleton />}>
      <MapSection courses={courses} loading={loading} />
    </Suspense>
  );
};
