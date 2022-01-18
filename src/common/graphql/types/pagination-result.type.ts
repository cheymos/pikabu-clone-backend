import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

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

  constructor(fields: PaginationInfo) {
    Object.assign(this, fields);
  }
}
export function PaginationResult<T>(classRef: Type<T>): Type<IPaginatedType<T>> {

  @ObjectType({ isAbstract: true })
  class PaginationResult<T> {
    @Field(() => [classRef])
    items: T[];

    @Field()
    pageInfo: PaginationInfo;
  }

  return PaginationResult;
};

export interface IPaginatedType<T> {
  items: T[]
  pageInfo: PaginationInfo;
}
