import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PostImage } from '../../image/entities/post-image.entity';
import { PostTag } from '../../tag/entities/post-tag.entity';

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

  @Field()
  @Column()
  ownerId: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
