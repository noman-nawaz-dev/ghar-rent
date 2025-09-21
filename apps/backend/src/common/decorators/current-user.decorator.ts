import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../database/types/database.types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
