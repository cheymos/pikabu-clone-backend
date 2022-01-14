import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Post } from './post.entity';

@ObjectType()
@Entity('post_tags')
export class PostTag extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field(() => Post)
  @ManyToOne(() => Post)
  post?: Post;

  @Field(() => Int)
  @Column()
  postId: number;

  constructor(name: string, postId: number) {
    super();

    this.name = name;
    this.postId = postId;
  }
}
