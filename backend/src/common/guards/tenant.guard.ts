import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { TENANT_CONTEXT } from '../../database/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user && user.businessId) {
      TENANT_CONTEXT.run({ businessId: user.businessId }, () => {});
      return true;
    }
    return true; // allow routes without businessId (e.g., auth)
  }
}
