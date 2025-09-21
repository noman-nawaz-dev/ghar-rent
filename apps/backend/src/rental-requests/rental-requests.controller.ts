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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  RentalRequestsService,
  CreateRentalRequestDto,
  UpdateRentalRequestDto,
  RentalRequestFilterDto,
} from './rental-requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, RequestStatus } from '../database/types/database.types';

@ApiTags('Rental Requests')
@Controller('rental-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RentalRequestsController {
  constructor(private readonly rentalRequestsService: RentalRequestsService) {}

  @Get()
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all rental requests (Admin only)' })
  @ApiQuery({ name: 'propertyId', required: false, type: String })
  @ApiQuery({ name: 'buyerId', required: false, type: String })
  @ApiQuery({ name: 'sellerId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: RequestStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Rental requests retrieved successfully',
  })
  async findAll(
    @Query('propertyId') propertyId?: string,
    @Query('buyerId') buyerId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('status') status?: RequestStatus,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
  ) {
    const filters: RentalRequestFilterDto = {
      propertyId,
      buyerId,
      sellerId,
      status,
      page,
      pageSize,
    };

    return this.rentalRequestsService.findAll(filters);
  }

  @Get('my-requests')
  @Roles('buyer')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current buyer's rental requests" })
  @ApiQuery({ name: 'status', required: false, enum: RequestStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Buyer requests retrieved successfully',
  })
  async getMyRequests(
    @CurrentUser() user: User,
    @Query('status') status?: RequestStatus,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
  ) {
    const filters: RentalRequestFilterDto = { status, page, pageSize };
    return this.rentalRequestsService.getBuyerRequests(user.id, filters);
  }

  @Get('my-property-requests')
  @Roles('seller', 'admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get rental requests for current seller's properties",
  })
  @ApiQuery({ name: 'status', required: false, enum: RequestStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Seller property requests retrieved successfully',
  })
  async getMyPropertyRequests(
    @CurrentUser() user: User,
    @Query('status') status?: RequestStatus,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
  ) {
    const filters: RentalRequestFilterDto = { status, page, pageSize };
    return this.rentalRequestsService.getSellerRequests(user.id, filters);
  }

  @Get('property/:propertyId')
  @Roles('seller', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get rental requests for a specific property' })
  @ApiQuery({ name: 'status', required: false, enum: RequestStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Property requests retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only view requests for own properties',
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async getPropertyRequests(
    @Param('propertyId') propertyId: string,
    @CurrentUser() user: User,
    @Query('status') status?: RequestStatus,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
  ) {
    const filters: RentalRequestFilterDto = { status, page, pageSize };
    return this.rentalRequestsService.getPropertyRequests(
      propertyId,
      user.id,
      user.role,
      filters,
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get rental request by ID' })
  @ApiResponse({
    status: 200,
    description: 'Rental request retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Rental request not found' })
  async findOne(@Param('id') id: string) {
    return this.rentalRequestsService.findOne(id);
  }

  @Post()
  @Roles('buyer')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new rental request (buyers only)' })
  @ApiResponse({
    status: 201,
    description: 'Rental request created successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - buyers only' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - already have pending request for this property',
  })
  async create(
    @Body() createRentalRequestDto: CreateRentalRequestDto,
    @CurrentUser() user: User,
  ) {
    return this.rentalRequestsService.create(createRentalRequestDto, user.id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update rental request' })
  @ApiResponse({
    status: 200,
    description: 'Rental request updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only update related requests',
  })
  @ApiResponse({ status: 404, description: 'Rental request not found' })
  async update(
    @Param('id') id: string,
    @Body() updateRentalRequestDto: UpdateRentalRequestDto,
    @CurrentUser() user: User,
  ) {
    return this.rentalRequestsService.update(
      id,
      updateRentalRequestDto,
      user.id,
      user.role,
    );
  }

  @Put(':id/approve')
  @Roles('seller', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve rental request (sellers and admins only)' })
  @ApiResponse({
    status: 200,
    description: 'Rental request approved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - sellers and admins only',
  })
  @ApiResponse({ status: 404, description: 'Rental request not found' })
  async approve(@Param('id') id: string, @CurrentUser() user: User) {
    return this.rentalRequestsService.approveRequest(id, user.id, user.role);
  }

  @Put(':id/reject')
  @Roles('seller', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject rental request (sellers and admins only)' })
  @ApiResponse({
    status: 200,
    description: 'Rental request rejected successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - sellers and admins only',
  })
  @ApiResponse({ status: 404, description: 'Rental request not found' })
  async reject(@Param('id') id: string, @CurrentUser() user: User) {
    return this.rentalRequestsService.rejectRequest(id, user.id, user.role);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete rental request' })
  @ApiResponse({
    status: 200,
    description: 'Rental request deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only delete own requests',
  })
  @ApiResponse({ status: 404, description: 'Rental request not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.rentalRequestsService.remove(id, user.id, user.role);
  }
}
