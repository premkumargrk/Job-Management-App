import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from './job/job.module';
import { LocationModule } from './location/location.module';
import { DatabaseModule } from './database/database-module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    JobModule,
    LocationModule,
  ],
})
export class AppModule {}
