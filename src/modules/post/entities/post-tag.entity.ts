import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Post } from './post.entity';

@ObjectType()
@Entity('post_tags')
export class PostTag extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @HideField()
  @ManyToOne(() => Post)
  post?: Post;

  @HideField()
  @Column()
  postId: number;
}
