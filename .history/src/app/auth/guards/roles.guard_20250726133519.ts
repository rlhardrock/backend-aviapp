import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UtilsService } from 'src/app/utils/utils.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private utils: UtilsService,
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No se definieron roles: acceso libre
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new ForbiddenException('No se encontró información de rol en el token');
    }
    const userRole = this.utils.capitalizeFirstLetter(user.role); // Normalizamos el rol a Letra-Capital
    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException(`Acceso denegado para el rol ${userRole}`);
    }
    return true;
  }
}
