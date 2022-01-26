import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostTag } from './entities/post-tag.entity';
import { PostTagService } from './post-tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostTag])],
  providers: [PostTagService],
  exports: [PostTagService],
})
export class PostTagModule {}
