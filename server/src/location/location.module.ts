import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { DatabaseModule } from 'src/database/database-module';
import { LocationService } from './location.services';

@Module({
  imports: [DatabaseModule],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
