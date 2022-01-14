import { Field, ID, InterfaceType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@InterfaceType()
@Entity()
export abstract class BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;
}
