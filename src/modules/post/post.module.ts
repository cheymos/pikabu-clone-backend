import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from '../comment/comment.module';
import { ImageModule } from '../image/image.module';
import { TagModule } from '../tag/tag.module';
import { VoteModule } from '../vote/vote.module';
import { Post } from './entities/post.entity';
import { PostLoaders } from './post.loaders';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    ImageModule,
    TagModule,
    CommentModule,
    VoteModule,
  ],
  providers: [PostResolver, PostService, PostLoaders],
  exports: [PostService, TypeOrmModule.forFeature([Post])],
})
export class PostModule {}
