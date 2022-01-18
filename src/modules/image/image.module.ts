import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentImage } from './entities/post-comment-image.entity';
import { PostImage } from './entities/post-image.entity';
import { ImageService } from './image.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostImage, PostCommentImage])],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
