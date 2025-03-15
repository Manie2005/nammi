import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot(), 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'nammi', 
      signOptions: { expiresIn: '15m' }, 
    }),
  ],
  providers: [UserService,JwtAuthGuard],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule,JwtAuthGuard],
})
export class UserModule {}
