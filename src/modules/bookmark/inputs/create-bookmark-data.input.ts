import { Field, InputType, Int } from '@nestjs/graphql';
import { BookmarkType } from '../enums/bookmark-type.enum';

@InputType()
export class CreateBookmarkData {
  @Field(() => Int)
  itemId: number;

  @Field(() => BookmarkType)
  type: BookmarkType;
}
