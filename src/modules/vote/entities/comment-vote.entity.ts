import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostComment } from '../../comment/entities/post-comment.entity';
import { VoteValue } from '../enums/vote-value.enum';

@ObjectType()
@Entity('comment_votes')
export class CommentVote {
  @HideField()
  @PrimaryGeneratedColumn()
  readonly id: number;

  @HideField()
  @ManyToOne(() => PostComment, (post) => post.votes)
  comment?: PostComment;

  @HideField()
  @Column()
  commentId: number;

  @Field(() => VoteValue)
  @Column({ type: 'enum', enum: VoteValue })
  value: VoteValue;

  @Field()
  @Column()
  ownerId: string;
}
