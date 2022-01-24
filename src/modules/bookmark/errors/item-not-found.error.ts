import { ObjectType } from '@nestjs/graphql';
import { BaseError } from '../../../common/graphql/errors/base.error';

@ObjectType({ implements: () => BaseError })
export class ItemNotFoundError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}
