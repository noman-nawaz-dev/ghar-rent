import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AiService, PriceSuggestionRequest } from './ai.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('AI Services')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('price-suggestion')
  @Roles('seller', 'admin', 'buyer')
  @ApiOperation({ summary: 'Get AI-powered price suggestion for a property' })
  @ApiResponse({
    status: 201,
    description: 'Price suggestion generated successfully',
    schema: {
      type: 'object',
      properties: {
        price: { type: 'number', nullable: true },
        priceRange: {
          type: 'object',
          properties: {
            min: { type: 'number' },
            max: { type: 'number' },
          },
        },
        analysis: {
          type: 'object',
          properties: {
            basePrice: { type: 'number' },
            adjustments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  factor: { type: 'string' },
                  impact: { type: 'string' },
                  reasoning: { type: 'string' },
                },
              },
            },
            marketInsights: { type: 'string' },
          },
        },
        recommendations: {
          type: 'array',
          items: { type: 'string' },
        },
        success: { type: 'boolean' },
        error: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid property data' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - sellers and admins only',
  })
  async generatePriceSuggestion(@Body() request: PriceSuggestionRequest) {
    await this.aiService.validatePropertyData(request);
    return this.aiService.generatePriceSuggestion(request);
  }

  @Post('property-description')
  @Roles('seller', 'admin', 'buyer')
  @ApiOperation({
    summary: 'Generate AI-powered property description (Coming Soon)',
  })
  @ApiResponse({
    status: 201,
    description: 'Property description generated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - sellers and admins only',
  })
  async generatePropertyDescription(@Body() propertyData: any) {
    return {
      description:
        await this.aiService.generatePropertyDescription(propertyData),
      success: true,
    };
  }

  @Post('property-tags')
  @Roles('seller', 'admin', 'buyer')
  @ApiOperation({
    summary: 'Generate AI-suggested property tags (Coming Soon)',
  })
  @ApiResponse({
    status: 201,
    description: 'Property tags generated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - sellers and admins only',
  })
  async suggestPropertyTags(@Body() propertyData: any) {
    return {
      tags: await this.aiService.suggestPropertyTags(propertyData),
      success: true,
    };
  }

  @Post('market-trends')
  @Roles('admin', 'buyer')
  @ApiOperation({
    summary: 'Analyze market trends for a city (Coming Soon, Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Market trends analyzed successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - admin only' })
  async analyzeMarketTrends(@Body('city') city: string): Promise<any> {
    return this.aiService.analyzeMarketTrends(city);
  }
}
