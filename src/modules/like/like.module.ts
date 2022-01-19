import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../post/post.module';
import { PostLike } from './entities/post-like.entity';
import { LikeService } from './like.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike]), forwardRef(() => PostModule)],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
