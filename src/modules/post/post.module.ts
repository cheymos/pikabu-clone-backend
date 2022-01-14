import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Post,
  PostComment,
  PostCommentImage,
  PostImage,
  PostTag
} from './entities';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      PostTag,
      PostImage,
      PostComment,
      PostCommentImage,
    ]),
  ],
  providers: [PostResolver, PostService],
})
export class PostModule {}
