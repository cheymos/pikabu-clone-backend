import { registerEnumType } from '@nestjs/graphql';

export enum BookmarkType {
  Post,
  Comment,
}

registerEnumType(BookmarkType, { name: 'BookmarkType' });
