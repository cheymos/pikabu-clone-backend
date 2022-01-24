import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BookmarkType } from '../enums/bookmark-type.enum';

@ObjectType()
@Entity('bookmarks')
export class Bookmark {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field(() => Int)
  @Column()
  itemId: number;

  @Field(() => BookmarkType)
  @Column({ type: 'enum', enum: BookmarkType })
  type: BookmarkType;

  @Field()
  @Column()
  ownerId: string;
}
