import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export abstract class BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;
}
