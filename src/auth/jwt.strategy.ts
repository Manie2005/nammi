import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ✅ Extracts correctly
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'nammi'), // ✅ Ensure correct secret
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, role: payload.role }; // ✅ Ensure role is returned
  }
}
