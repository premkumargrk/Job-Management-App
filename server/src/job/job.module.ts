import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { DatabaseModule } from 'src/database/database-module';

@Module({
  imports: [DatabaseModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
