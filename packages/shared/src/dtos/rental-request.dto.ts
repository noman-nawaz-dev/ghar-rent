import { RequestStatus } from '../types';

export interface CreateRentalRequestDto {
  propertyId: string;
  proposedPrice: number;
  duration: number;
  message?: string;
}

export interface UpdateRentalRequestDto {
  proposedPrice?: number;
  duration?: number;
  message?: string;
  status?: RequestStatus;
}

export interface RentalRequestFilterDto {
  propertyId?: string;
  buyerId?: string;
  sellerId?: string;
  status?: RequestStatus;
  page?: number;
  pageSize?: number;
}
