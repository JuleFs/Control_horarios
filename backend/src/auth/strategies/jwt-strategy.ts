// backend/src/auth/strategies/jwt-strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    // Use a dummy secret since we're not really validating JWTs anymore
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // Ignore expiration for our simplified auth
      secretOrKey: 'dummy-secret',
    });
  }

  // This will be called by Passport.js
  async validate(payload: any) {
    // In a token-less approach, this method would normally be more robust
    // For now, we'll just return a simple user object
    return {
      id: payload.user.id,
      correo: payload.user.correo,
      nombre: payload.user.nombre,
      userType: payload.user.userType
    };
  }
}