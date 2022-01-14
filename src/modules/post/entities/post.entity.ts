import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { PostImage } from '.';
import { BaseEntity } from '../../../common/entities/base.entity';

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

  @Field(() => [PostImage], { nullable: 'items' })
  @OneToMany(() => PostImage, (postImage) => postImage.post, { eager: true })
  images: PostImage[];

  @Field()
  @Column()
  ownerId: string;
}
