import { ObjectType } from '@nestjs/graphql';
import { BaseError } from './base.error';

@ObjectType({ implements: () => BaseError })
export class NotFoundError extends BaseError {}
