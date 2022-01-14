import { ExecutionContext, Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard as AG } from '@nestjs/passport';
import { AuthenticationError } from 'apollo-server-express';

@Injectable()
export class AuthGuard extends AG('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    return super.canActivate(new ExecutionContextHost([req]));
  }

  override handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new AuthenticationError('Not authenticated');
    }

    return user;
  }
}
