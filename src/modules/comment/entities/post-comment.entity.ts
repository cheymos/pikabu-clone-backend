import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PostCommentImage } from '../../image/entities/post-comment-image.entity';
import { Post } from '../../post/entities/post.entity';

@ObjectType()
@Entity('post_comments')
export class PostComment extends BaseEntity {
  @Field()
  @Column()
  text: string;

  @Field(() => [PostCommentImage], { nullable: 'items' })
  @ManyToOne(
    () => PostCommentImage,
    (postCommentImage) => postCommentImage.comment,
  )
  images: PostCommentImage[];

  @HideField()
  @ManyToOne(() => Post)
  post?: Post;

  @HideField()
  @Column()
  postId: number;

  @Field()
  @Column()
  ownerId: string;
}
