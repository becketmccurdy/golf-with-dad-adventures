import React from 'react';
import { Map as MapIcon, Loader } from 'lucide-react';
import { Card } from './Card';
import MapLibreGL from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Course } from '../types';

interface MapSectionProps {
  courses: Course[];
  loading?: boolean;
}

export const MapSection: React.FC<MapSectionProps> = ({ courses, loading = false }) => {
  const mapRef = React.useRef<MapLibreGL.Map | null>(null);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const markersRef = React.useRef<MapLibreGL.Marker[]>([]);

  // Initialize the map once
  React.useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new MapLibreGL.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json', // Open source tile provider
      center: [-95.7129, 37.0902], // Default center of US
      zoom: 3,
    });

    mapRef.current.addControl(new MapLibreGL.NavigationControl(), 'top-right');

    return () => {
      // Remove map on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when courses change
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Filter out courses with valid coordinates
    const validCourses = courses.filter(
      (course) =>
        course.lat !== 0 &&
        course.lng !== 0 &&
        course.lat !== undefined &&
        course.lng !== undefined,
    );

    if (validCourses.length === 0) return;

    const bounds = new MapLibreGL.LngLatBounds();

    validCourses.forEach((course) => {
      const markerEl = document.createElement('div');
      markerEl.className = 'marker';
      markerEl.style.width = '24px';
      markerEl.style.height = '24px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.backgroundColor = '#10b981';
      markerEl.style.border = '2px solid white';
      markerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

      const popup = new MapLibreGL.Popup({ offset: 25 }).setHTML(
        `<strong>${course.name}</strong><br>${course.location}`,
      );

      const marker = new MapLibreGL.Marker(markerEl)
        .setLngLat([course.lng, course.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([course.lng, course.lat]);
    });

    // Fit map to bounds with padding
    map.fitBounds(bounds, { padding: 50, maxZoom: 12 });
  }, [courses]);
  
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold flex items-center gap-1.5">
          <MapIcon size={16} className="text-emerald-500" />
          Recent Courses
        </h2>
      </div>
      
      <div className="relative rounded-lg overflow-hidden">
        <div
          ref={mapContainerRef}
          className="w-full h-56 bg-stone-100"
          role="img"
          aria-label="Map showing recent courses"
        />
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80" role="status" aria-busy="true" aria-live="polite">
            <Loader size={24} className="animate-spin text-emerald-500" aria-label="Loading map" />
          </div>
        )}
        
  {!loading && courses.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
            <p className="text-stone-500 text-sm">No courses to display</p>
          </div>
        )}
      </div>
    </Card>
  );
};
