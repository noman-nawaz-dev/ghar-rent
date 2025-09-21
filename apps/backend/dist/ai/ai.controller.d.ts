import { AiService, PriceSuggestionRequest } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generatePriceSuggestion(request: PriceSuggestionRequest): Promise<import("./ai.service").PriceSuggestionResponse>;
    generatePropertyDescription(propertyData: any): Promise<{
        description: string;
        success: boolean;
    }>;
    suggestPropertyTags(propertyData: any): Promise<{
        tags: string[];
        success: boolean;
    }>;
    analyzeMarketTrends(city: string): Promise<any>;
}
