import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { LikeValue } from '../enums/like-value.enum';

@ObjectType()
@Entity('post_likes')
export class PostLike {
  @HideField()
  @PrimaryGeneratedColumn()
  readonly id: number;

  @HideField()
  @ManyToOne(() => Post, (post) => post.likes)
  post?: Post;

  @HideField()
  @Column()
  postId: number;

  @Field(() => LikeValue)
  @Column({ type: 'enum', enum: LikeValue })
  value: LikeValue;

  @Field()
  @Column()
  ownerId: string;
}
