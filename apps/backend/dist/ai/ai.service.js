"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AiService = class AiService {
    configService;
    geminiApiKey;
    constructor(configService) {
        this.configService = configService;
        this.geminiApiKey = this.configService.get('GEMINI_API_KEY') || '';
    }
    async generatePriceSuggestion(request) {
        try {
            if (!this.geminiApiKey) {
                throw new Error('Gemini API key not configured');
            }
            const prompt = this.buildPriceSuggestionPrompt(request);
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.geminiApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 2048,
                    },
                }),
            });
            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }
            const data = await response.json();
            let responseText = '';
            try {
                responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            }
            catch (error) {
                throw new Error('Failed to parse Gemini response');
            }
            let analysisResult;
            try {
                const cleanedText = responseText
                    .replace(/```json\n?|\n?```/g, '')
                    .trim();
                analysisResult = JSON.parse(cleanedText);
            }
            catch (error) {
                const priceMatch = responseText.match(/\d+/);
                const fallbackPrice = priceMatch ? parseInt(priceMatch[0], 10) : null;
                return {
                    price: fallbackPrice,
                    analysis: undefined,
                    error: 'Detailed analysis unavailable, showing basic price estimate',
                    success: fallbackPrice !== null,
                };
            }
            if (!analysisResult.suggestedPrice ||
                isNaN(analysisResult.suggestedPrice)) {
                throw new Error('Invalid price suggestion received');
            }
            return {
                price: analysisResult.suggestedPrice,
                priceRange: analysisResult.priceRange,
                analysis: analysisResult.analysis,
                recommendations: analysisResult.recommendations,
                success: true,
            };
        }
        catch (error) {
            console.error('Price suggestion error:', error);
            return {
                price: null,
                error: error.message ||
                    'Failed to generate price suggestion. Please try again.',
                success: false,
            };
        }
    }
    buildPriceSuggestionPrompt(data) {
        return `
You are a professional real estate appraiser specializing in Pakistani rental markets. Analyze the following property details and provide a comprehensive rental price assessment.

PROPERTY DETAILS:
- Type: ${data.propertyType}
- Area: ${data.area} ${data.areaUnit}
- Location: ${data.address}, ${data.city}
- Bedrooms: ${data.bedrooms}
- Floors: ${data.floors}
- Kitchens: ${data.kitchens}
- Has Lawn: ${data.hasLawn ? 'Yes' : 'No'}
- Furnishing: ${data.furnishingStatus || 'Not specified'}
- Additional Info: ${data.additionalInfo || 'None provided'}

ANALYSIS REQUIREMENTS:
1. Consider current Pakistani real estate market trends (2024-2025)
2. Factor in city-specific pricing (major cities like Lahore, Karachi, Islamabad command higher prices)
3. Analyze area unit conversion (1 Kanal = 20 Marla)
4. Consider property type premiums (Villa > House > Apartment > Portion)
5. Account for furnishing status (Furnished properties typically rent 20-30% higher)
6. Factor in additional features (lawn, multiple floors, extra kitchens)
7. Consider location within city (premium areas like DHA, Bahria Town, etc.)

PRICING FACTORS FOR PAKISTAN:
- Lahore: Premium areas (DHA, Gulberg, Cantonment) - High rates
- Karachi: Clifton, Defence, Gulshan - Premium pricing
- Islamabad: F-sectors, E-sectors, I-sectors - Government employee area pricing
- Other cities: Adjust based on local economic conditions

RESPONSE FORMAT:
Provide your analysis in this JSON format:
{
  "suggestedPrice": [monthly rent in PKR as integer],
  "priceRange": {
    "min": [minimum suggested price],
    "max": [maximum suggested price]
  },
  "analysis": {
    "basePrice": [base price before adjustments],
    "adjustments": [
      {
        "factor": "location premium/discount",
        "impact": "+/- percentage or amount",
        "reasoning": "brief explanation"
      },
      {
        "factor": "property size",
        "impact": "+/- percentage or amount", 
        "reasoning": "brief explanation"
      },
      {
        "factor": "furnishing status",
        "impact": "+/- percentage or amount",
        "reasoning": "brief explanation"
      }
    ],
    "marketInsights": "Current market conditions and trends affecting this property type and location"
  },
  "recommendations": [
    "Specific recommendations for optimal pricing strategy"
  ]
}

Important: Return valid JSON only, no additional text or formatting.
`;
    }
    async validatePropertyData(data) {
        if (!data.propertyType || data.propertyType.trim() === '') {
            throw new common_1.BadRequestException('Property type is required');
        }
        if (!data.area || data.area <= 0) {
            throw new common_1.BadRequestException('Valid area is required');
        }
        if (!data.areaUnit || !['Marla', 'Kanal'].includes(data.areaUnit)) {
            throw new common_1.BadRequestException('Valid area unit (Marla or Kanal) is required');
        }
        if (!data.address || data.address.trim() === '') {
            throw new common_1.BadRequestException('Address is required');
        }
        if (!data.city || data.city.trim() === '') {
            throw new common_1.BadRequestException('City is required');
        }
        if (data.bedrooms < 0) {
            throw new common_1.BadRequestException('Bedrooms cannot be negative');
        }
        if (data.floors < 0) {
            throw new common_1.BadRequestException('Floors cannot be negative');
        }
        if (data.kitchens < 0) {
            throw new common_1.BadRequestException('Kitchens cannot be negative');
        }
    }
    async generatePropertyDescription(propertyData) {
        return 'AI-generated descriptions coming soon';
    }
    async suggestPropertyTags(propertyData) {
        return ['Coming Soon'];
    }
    async analyzeMarketTrends(city) {
        return { message: 'Market trend analysis coming soon' };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map