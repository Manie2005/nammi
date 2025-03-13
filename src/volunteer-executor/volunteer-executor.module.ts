import { Module } from '@nestjs/common';
import { VolunteerExecutorController } from './volunteer-executor.controller';
import { VolunteerExecutorService } from './volunteer-executor.service';

@Module({
  controllers: [VolunteerExecutorController],
  providers: [VolunteerExecutorService]
})
export class VolunteerExecutorModule {}
