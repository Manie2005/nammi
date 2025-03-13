import { Module } from '@nestjs/common';
import { TaskCreatorService } from './task-creator.service';
import { TaskCreatorController } from './task-creator.controller';
import { Task } from 'src/entity/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
@Module({
  imports:[TypeOrmModule.forFeature([Task]),
UserModule,],
  providers: [TaskCreatorService],
  controllers: [TaskCreatorController]
})
export class TaskCreatorModule {}
