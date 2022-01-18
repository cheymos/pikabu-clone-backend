import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class PaginationResult<T> {
  @Field()
  items: T[];

  @Field()
  pageInfo: PaginationInfo;
}

@ObjectType()
export class PaginationInfo {
  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  perPage: number;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;
}
