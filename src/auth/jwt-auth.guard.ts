import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as dotenv from 'dotenv';

dotenv.config(); // ✅ Ensure environment variables are loaded

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No Authorization Header Provided');
      throw new UnauthorizedException('Missing or invalid authentication token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'nammi' });
      console.log('✅ Decoded JWT:', decoded);

      request.user = decoded; // ✅ Attach user info to request
      return true;
    } catch (error) {
      console.error('❌ JWT Verification Failed:', error.message);
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
