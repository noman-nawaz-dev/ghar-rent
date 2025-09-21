import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  PropertiesService,
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyFilterDto,
  PropertySortDto,
} from './properties.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { User, PropertyStatus } from '../database/types/database.types';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all properties with filters and pagination' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'propertyType', required: false, type: String })
  @ApiQuery({ name: 'minBedrooms', required: false, type: Number })
  @ApiQuery({ name: 'hasLawn', required: false, type: Boolean })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['newest', 'price-low', 'price-high', 'area-high'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Properties retrieved successfully',
  })
  async findAll(
    @Query('search') search?: string,
    @Query('city') city?: string,
    @Query('minPrice', new ParseIntPipe({ optional: true })) minPrice?: number,
    @Query('maxPrice', new ParseIntPipe({ optional: true })) maxPrice?: number,
    @Query('propertyType') propertyType?: string,
    @Query('minBedrooms', new ParseIntPipe({ optional: true }))
    minBedrooms?: number,
    @Query('hasLawn', new ParseBoolPipe({ optional: true })) hasLawn?: boolean,
    @Query('sortBy')
    sortBy?: 'newest' | 'price-low' | 'price-high' | 'area-high',
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
  ) {
    const filters: PropertyFilterDto = {
      search,
      city,
      minPrice,
      maxPrice,
      propertyType,
      minBedrooms,
      hasLawn,
    };

    const sort: PropertySortDto = {
      sortBy,
      page,
      pageSize,
    };

    return this.propertiesService.findAll(filters, sort);
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search properties' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search term',
  })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'propertyType', required: false, type: String })
  @ApiQuery({ name: 'minBedrooms', required: false, type: Number })
  @ApiQuery({ name: 'hasLawn', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  async search(
    @Query('q') searchTerm: string,
    @Query('city') city?: string,
    @Query('minPrice', new ParseIntPipe({ optional: true })) minPrice?: number,
    @Query('maxPrice', new ParseIntPipe({ optional: true })) maxPrice?: number,
    @Query('propertyType') propertyType?: string,
    @Query('minBedrooms', new ParseIntPipe({ optional: true }))
    minBedrooms?: number,
    @Query('hasLawn', new ParseBoolPipe({ optional: true })) hasLawn?: boolean,
  ) {
    const filters: PropertyFilterDto = {
      city,
      minPrice,
      maxPrice,
      propertyType,
      minBedrooms,
      hasLawn,
    };

    return this.propertiesService.search(searchTerm, filters);
  }

  @Public()
  @Get('cities')
  @ApiOperation({ summary: 'Get all available cities' })
  @ApiResponse({ status: 200, description: 'Cities retrieved successfully' })
  async getCities() {
    return this.propertiesService.getCities();
  }

  @Public()
  @Get('types')
  @ApiOperation({ summary: 'Get all property types' })
  @ApiResponse({
    status: 200,
    description: 'Property types retrieved successfully',
  })
  async getPropertyTypes() {
    return this.propertiesService.getPropertyTypes();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-properties')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user's properties (sellers only)" })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['Available', 'Pending', 'Rented'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'User properties retrieved successfully',
  })
  async getMyProperties(
    @CurrentUser() user: User,
    @Query('status') status?: PropertyStatus,
  ) {
    const filters: PropertyFilterDto = { status };

    return this.propertiesService.getSellerProperties(user.id, filters);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiResponse({ status: 200, description: 'Property retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('seller', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new property (sellers and admins only)' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - sellers and admins only',
  })
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() user: User,
  ) {
    return this.propertiesService.create(createPropertyDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update property' })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only update own properties',
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @CurrentUser() user: User,
  ) {
    return this.propertiesService.update(
      id,
      updatePropertyDto,
      user.id,
      user.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update property status' })
  @ApiResponse({
    status: 200,
    description: 'Property status updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only update own properties',
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: PropertyStatus,
    @CurrentUser() user: User,
  ) {
    return this.propertiesService.updateStatus(id, status, user.id, user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete property' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only delete own properties',
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.propertiesService.remove(id, user.id, user.role);
  }
}
