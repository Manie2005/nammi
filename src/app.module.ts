import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TaskCreatorModule } from './task-creator/task-creator.module';
import { VolunteerExecutorModule } from './volunteer-executor/volunteer-executor.module';
import { User } from './entity/user.entity';
import { Task } from './entity/task.entity';
import { Executor } from './entity/executor.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ Load environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '08060918471',
      database: 'Nammi',
      autoLoadEntities: true,
      entities: [User, Task, Executor],
      synchronize:false,
      logging: false,
    }),
    UserModule, 
    TaskCreatorModule,
    VolunteerExecutorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
