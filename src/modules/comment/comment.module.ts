import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from '../image/image.module';
import { PostModule } from '../post/post.module';
import { CommentLoaders } from './comment.loader';
import { CommentService } from './comment.service';
import { PostComment } from './entities/post-comment.entity';
import { PostCommentResolver } from './post-comment.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment]), PostModule, ImageModule],
  providers: [CommentService, CommentLoaders, PostCommentResolver],
  exports: [CommentService],
})
export class CommentModule {}
