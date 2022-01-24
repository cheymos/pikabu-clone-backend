import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class BaseError {
  @Field()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
