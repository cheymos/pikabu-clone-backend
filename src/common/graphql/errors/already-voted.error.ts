import { Field, ObjectType } from '@nestjs/graphql';
import { Error } from './base.error';

@ObjectType({ implements: () => Error })
export class AlreadyVotedError extends Error {
  @Field()
  readonly message: string;

  constructor(message: string) {
    super();

    this.message = message;
  }
}
