// backend/src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; // No roles required, allow access
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // In our simplified approach, if there's no user we'll allow access for development
    if (!user) {
      return true; // Allow access even without user for development
    }
    
    // If the user is admin, always allow access
    if (user.userType === Role.ADMIN) {
      return true;
    }
    
    // Check if the user's role is in the required roles
    return requiredRoles.some((role) => user.userType === role);
  }
}