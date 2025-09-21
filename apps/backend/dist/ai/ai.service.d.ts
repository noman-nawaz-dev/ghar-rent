import { ConfigService } from '@nestjs/config';
import { AreaUnit } from '../database/types/database.types';
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
export declare class AiService {
    private configService;
    private geminiApiKey;
    constructor(configService: ConfigService);
    generatePriceSuggestion(request: PriceSuggestionRequest): Promise<PriceSuggestionResponse>;
    private buildPriceSuggestionPrompt;
    validatePropertyData(data: PriceSuggestionRequest): Promise<void>;
    generatePropertyDescription(propertyData: any): Promise<string>;
    suggestPropertyTags(propertyData: any): Promise<string[]>;
    analyzeMarketTrends(city: string): Promise<any>;
}
