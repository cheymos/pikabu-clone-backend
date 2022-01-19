import { registerEnumType } from '@nestjs/graphql';

export enum PostSort {
  DATE_ASC,
  DATE_DESC,
  LIKE_ASC,
  LIKE_DESC,
}

registerEnumType(PostSort, { name: 'PostSort' });
