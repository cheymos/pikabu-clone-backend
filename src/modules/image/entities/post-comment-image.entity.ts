import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Post } from '../../post/entities/post.entity';

@ObjectType()
@Entity('post_comment_images')
export class PostCommentImage extends BaseEntity {
  @Field()
  @Column()
  file: string;

  @Field(() => Post)
  @ManyToOne(() => Post)
  post?: Post;

  @Field(() => Int)
  @Column()
  postId: number;
}
