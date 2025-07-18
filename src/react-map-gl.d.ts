import * as React from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';

declare module 'react-map-gl' {
  export interface ViewState {
    latitude: number;
    longitude: number;
    zoom: number;
    bearing?: number;
    pitch?: number;
  }

  export interface MapProps {
    /** Mapbox access token */
    mapboxAccessToken: string;
    /** Initial view state */
    initialViewState: ViewState;
    /** Map style */
    mapStyle?: string | mapboxgl.Style;
    /** Callback when the map's viewport changes */
    onMove?: (evt: { viewState: ViewState }) => void;
    /** Children */
    children?: React.ReactNode;
    /** CSS style */
    style?: React.CSSProperties;
    /** Map container ref */
    ref?: React.Ref<MapboxMap>;
  }
  
  export interface MarkerProps {
    /** Longitude of the marker */
    longitude: number;
    /** Latitude of the marker */
    latitude: number;
    /** Marker content */
    children?: React.ReactNode;
    /** Anchor position */
    anchor?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /** Callback when the marker is clicked */
    onClick?: (event: any) => void;
    /** Callback when the marker is dragged */
    onDragStart?: (event: any) => void;
    /** Callback when the marker is dragged */
    onDrag?: (event: any) => void;
    /** Callback when the marker is dragged */
    onDragEnd?: (event: any) => void;
    /** Whether the marker is draggable */
    draggable?: boolean;
    /** Offset */
    offset?: [number, number];
  }
  
  export interface NavigationControlProps {
    /** Position on the map */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /** Show compass */
    showCompass?: boolean;
    /** Show zoom */
    showZoom?: boolean;
    /** Visualize pitch */
    visualizePitch?: boolean;
  }

  export const Map: React.FC<MapProps>;
  export const Marker: React.FC<MarkerProps>;
  export const NavigationControl: React.FC<NavigationControlProps>;
}
