import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { createUnionResult } from '../../../utils/graphql';
import { PostComment } from '../../comment/entities/post-comment.entity';
import { Post } from '../../post/entities/post.entity';
import { BookmarkType } from '../enums/bookmark-type.enum';

export const ItemField = createUnionResult('Item', Post, PostComment);

@ObjectType()
@Entity('bookmarks')
export class Bookmark {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field(() => Int)
  @Column()
  itemId: number;

  @Field(() => ItemField)
  item: Post | PostComment;

  @Field(() => BookmarkType)
  @Column({ type: 'enum', enum: BookmarkType })
  type: BookmarkType;

  @Field()
  @Column()
  ownerId: string;
}
