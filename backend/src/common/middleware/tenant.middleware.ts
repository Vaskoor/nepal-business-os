import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TENANT_CONTEXT } from '../../database/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const businessId = req.user && (req.user as any).businessId;
    if (businessId) {
      TENANT_CONTEXT.run({ businessId }, () => next());
    } else {
      next();
    }
  }
}
