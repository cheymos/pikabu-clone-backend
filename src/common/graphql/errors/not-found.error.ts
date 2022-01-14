import { Field, ObjectType } from '@nestjs/graphql';
import { Error } from './base.error';

@ObjectType({ implements: () => Error })
export class NotFoundError extends Error {
  @Field()
  readonly message: string;

  constructor(message: string) {
    super();

    this.message = message;
  }
}
