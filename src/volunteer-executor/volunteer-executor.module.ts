import { Module } from '@nestjs/common';
import { VolunteerExecutorController } from './volunteer-executor.controller';
import { VolunteerExecutorService } from './volunteer-executor.service';
import { Executor } from 'src/entity/executor.entity';
import { Task } from 'src/entity/task.entity';
import { User } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskCreatorModule } from 'src/task-creator/task-creator.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [JwtModule.register({}),
    TypeOrmModule.forFeature([Executor, Task, User]),
TaskCreatorModule],
  controllers: [VolunteerExecutorController],
  providers: [VolunteerExecutorService]
})
export class VolunteerExecutorModule {}
