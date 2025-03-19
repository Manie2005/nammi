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
      host: 'bwdlwhlaeu18gdnnmsmd-postgresql.services.clever-cloud.com',
      port: 50013,
      username: 'uyemhu2vpkujwldy8l6o',
      password: 'S0Gtjn7War9ZdKCtTosElkFwtFC6w5',
      database: 'bwdlwhlaeu18gdnnmsmd',
      autoLoadEntities: true,
      entities: [User, Task, Executor],
      synchronize: false,
      logging: true,
    }),
    UserModule, 
    TaskCreatorModule,
    VolunteerExecutorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
