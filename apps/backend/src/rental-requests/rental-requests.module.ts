import { Module } from '@nestjs/common';
import { RentalRequestsService } from './rental-requests.service';
import { RentalRequestsController } from './rental-requests.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RentalRequestsController],
  providers: [RentalRequestsService],
  exports: [RentalRequestsService],
})
export class RentalRequestsModule {}
