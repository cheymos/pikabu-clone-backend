import { registerEnumType } from '@nestjs/graphql';

export enum PostSort {
  createdAt_ASC,
  createdAt_DESC,
  likes_ASC,
  likes_DESC,
}

registerEnumType(PostSort, { name: 'PostSort' });
