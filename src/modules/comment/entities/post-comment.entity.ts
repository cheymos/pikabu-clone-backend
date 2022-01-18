import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Post } from '../../post/entities/post.entity';

@ObjectType()
@Entity('post_comments')
export class PostComment extends BaseEntity {
  @Field()
  @Column()
  text: string;

  @Field(() => Int)
  @Column()
  rating: number = 0;

  @Field(() => Post)
  @ManyToOne(() => Post)
  post?: Post;

  @Field(() => Int)
  @Column()
  postId: number;

  @Field()
  @Column()
  ownerId: string;
}
