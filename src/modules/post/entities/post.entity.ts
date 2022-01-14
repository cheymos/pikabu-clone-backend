import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
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
  @Column()
  rating: number = 0;

  @Field()
  @Column()
  ownerId: string;

  constructor(title: string, description: string, ownerId: string) {
    super();

    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
  }
}
