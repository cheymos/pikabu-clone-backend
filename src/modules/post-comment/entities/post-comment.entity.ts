import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
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
  @OneToMany(() => PostCommentImage, (image) => image.comment)
  images?: PostCommentImage[];

  @Field(() => [CommentVote], { nullable: 'items' })
  @OneToMany(() => CommentVote, (commentVote) => commentVote.comment)
  votes?: CommentVote[];

  @Field(() => Int)
  @Column({ default: 0 })
  likes: number;

  @Field(() => Int)
  @Column({ default: 0 })
  dislikes: number;

  @HideField()
  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
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
