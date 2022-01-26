import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentModule } from '../post-comment/post-comment.module';
import { PostModule } from '../post/post.module';
import { CommentVote } from './entities/comment-vote.entity';
import { PostVote } from './entities/post-vote.entity';
import { VoteService } from './vote.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostVote, CommentVote]),
    forwardRef(() => PostModule),
    forwardRef(() => PostCommentModule),
  ],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
