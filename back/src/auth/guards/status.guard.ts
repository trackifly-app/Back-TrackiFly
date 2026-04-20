import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UserStatus } from '../../common/enums/user-status.enum';

@Injectable()
export class StatusGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado, verifique el AuthGuard');
    }

    if (user.status !== UserStatus.APPROVED) {
      throw new ForbiddenException(
        `Acceso denegado: el estatus de su cuenta es ${user.status}. Requiere estar aprobado.`,
      );
    }

    return true;
  }
}
