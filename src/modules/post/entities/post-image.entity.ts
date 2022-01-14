import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { LocalFile } from '../../local-file/local-file.entity';
import { Post } from './post.entity';

@ObjectType()
@Entity()
export class PostImage extends BaseEntity {
  @Field(() => LocalFile)
  @OneToOne(() => LocalFile)
  file: LocalFile;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.images)
  post?: Post;

  @Field(() => Int)
  @Column()
  postId: number;

  constructor(file: LocalFile, postId: number) {
    super();
    this.file = file;
    this.postId = postId;
  }
}
