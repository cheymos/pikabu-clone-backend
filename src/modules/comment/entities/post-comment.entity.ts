import { Field, HideField, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PostCommentImage } from '../../image/entities/post-comment-image.entity';
import { Post } from '../../post/entities/post.entity';
import { CommentVote } from '../../vote/entities/comment-vote.entity';

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

  @Field(() => [CommentVote], { nullable: 'items' })
  @OneToMany(() => CommentVote, (commentVote) => commentVote.comment)
  votes?: CommentVote[];

  @HideField()
  @ManyToOne(() => Post)
  post?: Post;

  @HideField()
  @Column()
  postId: number;

  @Field()
  @Column()
  ownerId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
