import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PostComment } from '../../comment/entities/post-comment.entity';

@ObjectType()
@Entity('post_comment_images')
export class PostCommentImage extends BaseEntity {
  @Field()
  @Column()
  filePath: string;

  @HideField()
  @ManyToOne(() => PostComment)
  comment?: PostComment;

  @HideField()
  @Column()
  commentId: number;
}
