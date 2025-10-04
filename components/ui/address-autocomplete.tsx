"use client";

import React, { useState, useRef, useEffect } from 'react';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext, GeoapifyApiKey } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface AddressAutoCompleteProps {
  value?: string;
  onChange?: (address: string, coordinates?: { latitude: number; longitude: number }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  inputHeight?: string;
  inputStyle?: React.CSSProperties;
}

export const AddressAutoComplete: React.FC<AddressAutoCompleteProps> = ({
  value = '',
  onChange,
  placeholder = "Enter address...",
  className,
  disabled = false,
  error = false,
  inputHeight = "48px",
  inputStyle,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | undefined>();
  const { theme } = useTheme();


  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handlePlaceSelect = (place: any) => {
    if (place && place.properties) {
      const address = place.properties.formatted;
      const lat = place.geometry.coordinates[1]; // GeoJSON format: [longitude, latitude]
      const lng = place.geometry.coordinates[0];
      
      setInputValue(address);
      setCoordinates({ latitude: lat, longitude: lng });
      
      if (onChange) {
        onChange(address, { latitude: lat, longitude: lng });
      }
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue, coordinates);
    }
  };

  return (
    <div className={cn("relative", className)}>
            <GeoapifyContext apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || ""}>
        <GeoapifyGeocoderAutocomplete
          placeholder={placeholder}
          value={inputValue}
          onUserInput={handleInputChange}
          placeSelect={handlePlaceSelect}


        countryCodes={['pk']} // Restrict to Pakistan
        lang="en"
        limit={10}
        filterByCountryCode={['pk']}
        skipIcons={true}
        addDetails={true}
        skipSelectionOnArrowKey={false}
        allowNonVerifiedHouseNumber={true}
        allowNonVerifiedStreet={true}
        biasByCountryCode={['pk']}
        biasByRect={{
          lon1: 60.8729, // Western boundary of Pakistan
          lat1: 23.6345, // Southern boundary of Pakistan
          lon2: 77.8375, // Eastern boundary of Pakistan
          lat2: 37.0841, // Northern boundary of Pakistan
        }}
        />
      </GeoapifyContext>
      
      {/* Custom styling to match your design system */}
      <style jsx global>{`
        .geoapify-autocomplete-input {
          height: ${inputHeight} !important;
          width: 100% !important;
          border-radius: 6px !important;
          border: 1px solid hsl(var(--input)) !important;
          background-color: hsl(var(--background)) !important;
          padding: 8px 12px !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
          color: hsl(var(--foreground)) !important;
          outline: none !important;
          box-shadow: none !important;
          ${inputStyle ? Object.entries(inputStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value} !important;`).join(' ') : ''}
        }
        
        .geoapify-autocomplete-input:focus {
          outline: none !important;
          border-color: hsl(var(--ring)) !important;
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2) !important;
        }
        
        .geoapify-autocomplete-input::placeholder {
          color: hsl(var(--muted-foreground)) !important;
          opacity: 1 !important;
        }
        
        /* Dropdown items container */
        .geoapify-autocomplete-items {
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          right: 0 !important;
          background: ${theme === 'dark' ? 'hsl(var(--card))' : 'hsl(var(--popover))'} !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 6px !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
          z-index: 50 !important;
          margin-top: 2px !important;
        }
        
        /* Individual dropdown items */
        .geoapify-autocomplete-item {
          padding: 8px 12px !important;
          cursor: pointer !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          transition: background-color 0.2s ease !important;
        }
        
        .geoapify-autocomplete-item:last-child {
          border-bottom: none !important;
        }
        
        .geoapify-autocomplete-item:hover {
          background-color: hsl(var(--accent)) !important;
        }
        
        .geoapify-autocomplete-item.selected {
          background-color: hsl(var(--accent)) !important;
        }
        
        /* Address text styling */
        .geoapify-autocomplete-item .address {
          display: flex !important;
          flex-direction: column !important;
          gap: 2px !important;
        }
        
        .geoapify-autocomplete-item .main-part {
          color: ${theme === 'dark' ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))'} !important;
        }
        
        .geoapify-autocomplete-item .secondary-part {
          color: ${theme === 'dark' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))'} !important;
        }
        
      `}</style>
    </div>
  );
};
