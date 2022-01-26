import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from '../image/image.module';
import { PostCommentModule } from '../post-comment/post-comment.module';
import { PostTagModule } from '../post-tag/post-tag.module';
import { VoteModule } from '../vote/vote.module';
import { Post } from './entities/post.entity';
import { PostLoaders } from './post.loaders';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    ImageModule,
    PostTagModule,
    forwardRef(() => PostCommentModule),
    VoteModule,
  ],
  providers: [PostResolver, PostService, PostLoaders],
  exports: [PostService, TypeOrmModule.forFeature([Post])],
})
export class PostModule {}
