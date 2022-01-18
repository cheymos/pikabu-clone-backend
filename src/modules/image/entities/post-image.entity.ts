import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Post } from '../../post/entities/post.entity';

@ObjectType()
@Entity()
export class PostImage extends BaseEntity {
  @Field()
  @Column()
  filePath: string;

  @HideField()
  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  post?: Post;

  @HideField()
  @Column()
  postId: number;
}
