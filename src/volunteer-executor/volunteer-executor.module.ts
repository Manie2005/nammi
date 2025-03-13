import { Module } from '@nestjs/common';
import { VolunteerExecutorController } from './volunteer-executor.controller';
import { VolunteerExecutorService } from './volunteer-executor.service';
import { Executor } from 'src/entity/executor.entity';
import { Task } from 'src/entity/task.entity';
import { User } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Executor, Task, User])],
  controllers: [VolunteerExecutorController],
  providers: [VolunteerExecutorService]
})
export class VolunteerExecutorModule {}
