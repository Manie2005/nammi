import { Module } from '@nestjs/common';
import { TaskCreatorService } from './task-creator.service';
import { TaskCreatorController } from './task-creator.controller';
import { Task } from 'src/entity/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ConfigModule } from '@nestjs/config'; // ✅ Import ConfigModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ConfigModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'nammi', 
      signOptions: { expiresIn: '15m' }, 
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
  ],
  providers: [TaskCreatorService, JwtStrategy], 
  controllers: [TaskCreatorController],
})
export class TaskCreatorModule {}
