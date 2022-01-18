import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Post,
  PostComment,
  PostCommentImage,
  PostImage,
  PostTag
} from './entities';
import { PostLoaders } from './post.loaders';
import { PostResolver } from './post.resolver';
import { PostImageService } from './services/post-image.service';
import { PostTagService } from './services/post-tag.service';
import { PostService } from './services/post.service';

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
  providers: [PostResolver, PostService, PostImageService, PostTagService, PostLoaders],
})
export class PostModule {}
