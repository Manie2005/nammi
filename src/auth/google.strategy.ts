import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, // Ensure this is defined in your .env file
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Ensure this is defined in your .env file
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // Update this to your callback URL
      scope: ['email', 'profile'], // Requested scopes
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user); // Pass the user object to the request
  }
}