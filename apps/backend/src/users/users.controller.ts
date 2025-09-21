import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService, UpdateUserDto, UserFilterDto } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../database/types/database.types';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(@Query() filters: UserFilterDto) {
    return this.usersService.findAll(filters);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  async getMe(@CurrentUser() user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  @Get('me/stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user statistics' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
  })
  async getMyStats(@CurrentUser() user: User) {
    return this.usersService.getUserStats(user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/stats')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user statistics by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserStats(@Param('id') id: string) {
    return this.usersService.getUserStats(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only update own profile',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    return this.usersService.update(id, updateUserDto, user.id);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.usersService.remove(id, user.id);
  }
}
