import { registerEnumType } from '@nestjs/graphql';

export enum CommentSort {
  DATE_ASC,
  DATE_DESC,
  LIKE_ASC,
  LIKE_DESC,
}

registerEnumType(CommentSort, { name: 'CommentSort' });
