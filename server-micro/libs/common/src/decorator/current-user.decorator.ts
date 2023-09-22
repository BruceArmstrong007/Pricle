import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUserByContext = (context: ExecutionContext) => {
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user;
  }
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);

export type CurrentUserType = {
  userID: string,
  username: string;
  email: string;
  verified: boolean;
};
