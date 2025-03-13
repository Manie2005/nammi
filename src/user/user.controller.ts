import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from 'src/entity/user.entity';
import { LoginDto } from 'src/dto/login.dto';
import { VerifyOtpDto } from 'src/dto/verify-otp.dto';

@Controller('user') 
export class UserController {
  constructor(private userservice: UserService) {}

  @Post('register')
  async register(@Body() body: { email?: string; walletAddress?: string; password: string; role: UserRole }) {
      return this.userservice.createuser(body.email, body.walletAddress, body.password, body.role);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userservice.login(loginDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      return await this.userservice.verifyOtp(verifyOtpDto);
    } catch (error) {
      throw new BadRequestException('Invalid or expired OTP');
    }
  }
}
