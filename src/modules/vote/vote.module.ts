import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../post/post.module';
import { PostVote } from './entities/post-vote.entity';
import { VoteService } from './vote.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostVote]), forwardRef(() => PostModule)],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
