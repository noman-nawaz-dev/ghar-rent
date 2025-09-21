import { PropertyStatus, AreaUnit, PropertyCoordinates } from '../types';

export interface CreatePropertyDto {
  title: string;
  description: string;
  price: number;
  area: number;
  areaUnit: AreaUnit;
  bedrooms: number;
  floors: number;
  kitchens: number;
  hasLawn: boolean;
  additionalInfo?: string;
  address: string;
  city: string;
  images: string[];
  sellerPhone: string;
  sellerName: string;
  propertyType: string;
  coordinates?: PropertyCoordinates;
}

export interface UpdatePropertyDto {
  title?: string;
  description?: string;
  price?: number;
  area?: number;
  areaUnit?: AreaUnit;
  bedrooms?: number;
  floors?: number;
  kitchens?: number;
  hasLawn?: boolean;
  additionalInfo?: string;
  address?: string;
  city?: string;
  images?: string[];
  sellerPhone?: string;
  sellerName?: string;
  status?: PropertyStatus;
  propertyType?: string;
  coordinates?: PropertyCoordinates;
}

export interface PropertyFilterDto {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minBedrooms?: number;
  hasLawn?: boolean;
  status?: PropertyStatus;
  sellerId?: string;
}

export interface PropertySortDto {
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'area-high';
  page?: number;
  pageSize?: number;
}
