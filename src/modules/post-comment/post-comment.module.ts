import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from '../image/image.module';
import { PostModule } from '../post/post.module';
import { VoteModule } from '../vote/vote.module';
import { PostComment } from './entities/post-comment.entity';
import { PostCommentLoaders } from './post-comment.loader';
import { PostCommentResolver } from './post-comment.resolver';
import { PostCommentService } from './post-comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment]), PostModule, ImageModule, VoteModule],
  providers: [PostCommentService, PostCommentLoaders, PostCommentResolver],
  exports: [PostCommentService, TypeOrmModule.forFeature([PostComment])],
})
export class PostCommentModule {}
