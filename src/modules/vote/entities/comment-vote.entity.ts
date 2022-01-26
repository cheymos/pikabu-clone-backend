import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PostComment } from '../../post-comment/entities/post-comment.entity';
import { VoteValue } from '../enums/vote-value.enum';

@ObjectType()
@Entity('comment_votes')
export class CommentVote extends BaseEntity {
  @HideField()
  @ManyToOne(() => PostComment, (post) => post.votes, { onDelete: 'CASCADE' })
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
