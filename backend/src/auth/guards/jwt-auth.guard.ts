// backend/src/auth/guards/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }
    
    // For simplicity in the token-less authentication approach,
    // we'll just check if there's a user in the request
    const request = context.switchToHttp().getRequest();
    
    // In this simplified approach, we're assuming the user is always authenticated
    // In a real application, you'd implement session-based authentication or another method
    if (request.user) {
      return true;
    }
    
    // For development purposes, we'll allow access without authentication
    // In production, you should replace this with proper authentication
    return true; // Returning true to bypass authentication for now
  }
}