import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './entity/user.entity';
import { TaskCreatorModule } from './task-creator/task-creator.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
type:'postgres',
host:'localhost',
port:5432,
username:'postgres',
password:'08060918471',
database:'Nammi',
autoLoadEntities:true,
entities:[User],
synchronize:true,
logging:false,
    }),
    UserModule,
    TaskCreatorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
