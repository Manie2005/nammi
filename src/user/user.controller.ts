import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserRole } from 'src/entity/user.entity';
import { LoginDto } from 'src/dto/login.dto';
import { VerifyOtpDto } from 'src/dto/verify-otp.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userservice: UserService) {}

  @Post('register')
  async register(
    @Body() body: { email?: string; walletAddress?: string; password: string; role: UserRole }
  ) {
    return this.userservice.createuser(body.email, body.walletAddress, body.password, body.role);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userservice.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.userservice.googleLogin(req.user);
  }

  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  async appleAuth() {
    // Redirects user to Apple Sign-In page
  }

  @Get('apple/callback')
  @UseGuards(AuthGuard('apple'))
  async appleAuthRedirect(@Req() req) {
    return this.userservice.appleLogin(req.user);
  }

  @Post('wallet-login')
  async walletLogin(@Body() walletLoginDto: { walletAddress: string; signedMessage: string }) {
    const { walletAddress, signedMessage } = walletLoginDto;

    if (!walletAddress || !signedMessage) {
      throw new BadRequestException('Wallet address and signed message are required');
    }

    return this.userservice.walletLogin(walletAddress, signedMessage);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      return await this.userservice.verifyOtp(verifyOtpDto.email, verifyOtpDto.otpCode);
    } catch (error) {
      throw new BadRequestException('Invalid or expired OTP');
    }
  }
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
      return this.userservice.logout(req.user.userId);
  }
}
