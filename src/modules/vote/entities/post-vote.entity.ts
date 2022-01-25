import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { VoteValue } from '../enums/vote-value.enum';

@ObjectType()
@Entity('post_votes')
export class PostVote {
  @HideField()
  @PrimaryGeneratedColumn()
  readonly id: number;

  @HideField()
  @ManyToOne(() => Post, (post) => post.votes, { onDelete: 'CASCADE' })
  post?: Post;

  @HideField()
  @Column()
  postId: number;

  @Field(() => VoteValue)
  @Column({ type: 'enum', enum: VoteValue })
  value: VoteValue;

  @Field()
  @Column()
  ownerId: string;
}
