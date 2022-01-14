import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Post } from './post.entity';

@ObjectType()
@Entity()
export class PostImage extends BaseEntity {
  @Field()
  @Column()
  file: string;

  @Field(() => Post)
  @ManyToOne(() => Post, post => post.images)
  post?: Post;

  @Field(() => Int)
  @Column()
  postId: number;

  constructor(file: string, postId: number) {
    super();
    this.file = file;
    this.postId = postId;
  }
}
