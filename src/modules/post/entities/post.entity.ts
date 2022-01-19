import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PostImage } from '../../image/entities/post-image.entity';
import { PostTag } from '../../tag/entities/post-tag.entity';
import { PostVote } from '../../vote/entities/post-vote.entity';

@ObjectType()
@Entity('posts')
export class Post extends BaseEntity {
  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field(() => Int)
  @Column({ default: 0 })
  rating: number;

  // MENTOR: Eage or not?
  @Field(() => [PostImage], { nullable: 'items' })
  @OneToMany(() => PostImage, (postImage) => postImage.post)
  images?: PostImage[];

  @Field(() => [PostTag], { nullable: 'items' })
  @OneToMany(() => PostTag, (postTag) => postTag.post)
  tags?: PostTag[];

  @Field(() => [PostVote], { nullable: 'items' })
  @OneToMany(() => PostVote, (postLike) => postLike.post)
  votes?: PostVote[];

  @Field(() => Int)
  @Column({ default: 0 })
  likes: number;

  @Field(() => Int)
  @Column({ default: 0 })
  dislikes: number;

  @Field()
  @Column()
  ownerId: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
