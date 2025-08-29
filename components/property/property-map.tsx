"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useTheme } from 'next-themes';
import { MapPin } from 'lucide-react';

// Make sure to set your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN';

interface PropertyMapProps {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: string;
  propertyTitle: string;
  price: number;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ 
  coordinates, 
  address, 
  propertyTitle, 
  price 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const { resolvedTheme } = useTheme();

  const getMapStyle = (theme?: string) => {
    if ((theme || '').toLowerCase() === 'dark') {
      return 'mapbox://styles/mapbox/dark-v11';
    }
    return 'mapbox://styles/mapbox/streets-v12';
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: getMapStyle(resolvedTheme ?? 'light'),
        center: [coordinates.longitude, coordinates.latitude],
        zoom: 15,
        scrollZoom: true,
        dragPan: true,
        dragRotate: false,
        pitchWithRotate: false,
        touchZoomRotate: false
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.innerHTML = `
        <div style="
          background: #059669;
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          position: relative;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
        " 
        onmouseover="this.style.transform='scale(1.05)'" 
        onmouseout="this.style.transform='scale(1)'"
        >
          PKR ${formatPrice(price)}/month
          <div style="
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid #059669;
          "></div>
        </div>
      `;

      // Add marker to map
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .addTo(map.current);

      // Create popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        className: 'property-popup'
      }).setHTML(`
        <div style="padding: 16px; min-width: 250px; font-family: inherit;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 16px; color: #111827;">
            ${propertyTitle}
          </h3>
          <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
            ${address}
          </p>
          <div style="
            background: #f0fdf4;
            border: 1px solid #dcfce7;
            border-radius: 8px;
            padding: 8px 12px;
            display: inline-block;
          ">
            <p style="margin: 0; color: #059669; font-weight: 600; font-size: 16px;">
              PKR ${formatPrice(price)}/month
            </p>
          </div>
        </div>
      `);

      // Add click event to marker
      markerElement.addEventListener('click', () => {
        popup.setLngLat([coordinates.longitude, coordinates.latitude])
              .addTo(map.current!);
      });

      // Helper to add custom area source/layer (reused after style changes)
      const addPropertyAreaLayer = () => {
        if (!map.current) return;
        const sourceId = 'property-area';
        const layerId = 'property-area-circle';
        if (map.current.getLayer(layerId)) return;
        if (map.current.getSource(sourceId)) {
          try { map.current.removeSource(sourceId); } catch {}
        }
        map.current.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [coordinates.longitude, coordinates.latitude]
            },
            properties: {}
          }
        });

        map.current.addLayer({
          id: layerId,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-radius': 50,
            'circle-color': '#059669',
            'circle-opacity': 0.1,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#059669',
            'circle-stroke-opacity': 0.3
          }
        });
      };

      // Handle map load
      map.current.on('load', () => {
        setMapLoaded(true);
        addPropertyAreaLayer();
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError(true);
      });

      // Re-add layer after any future style changes
      map.current.on('style.load', () => {
        addPropertyAreaLayer();
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates, address, propertyTitle, price]);

  // React to theme changes by switching base style
  useEffect(() => {
    if (!map.current) return;
    try {
      const newStyle = getMapStyle(resolvedTheme ?? 'light');
      if (map.current.getStyle()?.sprite?.includes(newStyle)) return;
      map.current.setStyle(newStyle);
    } catch (e) {
      // no-op
    }
  }, [resolvedTheme]);

  if (mapError) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center p-8 border border-border">
        <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground text-center mb-2">Unable to load map</p>
        <p className="text-sm text-muted-foreground text-center">{address}</p>
        <p className="text-xs text-muted-foreground mt-2">Please check your internet connection</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-border">
      <div 
        ref={mapContainer} 
        className="aspect-video bg-muted"
        style={{ minHeight: '350px' }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="text-muted-foreground">Loading property location...</p>
          </div>
        </div>
      )}
      
      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        © Mapbox
      </div>
    </div>
  );
};
