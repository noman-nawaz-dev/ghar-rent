export declare enum UserRole {
    BUYER = "buyer",
    SELLER = "seller",
    ADMIN = "admin"
}
export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    createdAt: Date;
}
export declare enum PropertyStatus {
    AVAILABLE = "Available",
    PENDING = "Pending",
    RENTED = "Rented"
}
export declare enum AreaUnit {
    MARLA = "Marla",
    KANAL = "Kanal"
}
export interface PropertyCoordinates {
    latitude: number;
    longitude: number;
}
export interface Property {
    id: string;
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
    sellerId: string;
    sellerPhone: string;
    sellerName: string;
    listedDate: Date;
    status: PropertyStatus;
    propertyType: string;
    coordinates?: PropertyCoordinates;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum RequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export interface RentalRequest {
    id: string;
    propertyId: string;
    buyerId: string;
    proposedPrice: number;
    duration: number;
    message?: string;
    status: RequestStatus;
    createdAt: Date;
    updatedAt: Date;
}
export interface PriceSuggestionRequest {
    propertyType: string;
    area: number;
    areaUnit: AreaUnit;
    address: string;
    city: string;
    bedrooms: number;
    floors: number;
    kitchens: number;
    hasLawn: boolean;
    furnishingStatus?: string;
    additionalInfo?: string;
}
export interface PriceSuggestionResponse {
    price: number | null;
    priceRange?: {
        min: number;
        max: number;
    };
    analysis?: {
        basePrice: number;
        adjustments: Array<{
            factor: string;
            impact: string;
            reasoning: string;
        }>;
        marketInsights: string;
    };
    recommendations?: string[];
    success: boolean;
    error?: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}
export interface PropertySearchFilters {
    search?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    minBedrooms?: number;
    hasLawn?: boolean;
}
export interface PropertySortOptions {
    sortBy: 'newest' | 'price-low' | 'price-high' | 'area-high';
    page?: number;
    pageSize?: number;
}
export interface UploadResponse {
    success: boolean;
    data?: {
        publicId: string;
        secureUrl: string;
        url: string;
        width: number;
        height: number;
        format: string;
        resourceType: string;
    };
    error?: string;
}
//# sourceMappingURL=index.d.ts.map