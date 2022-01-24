import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from '../comment/comment.module';
import { PostModule } from '../post/post.module';
import { BookmarkResolver } from './bookmark.resolver';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from './entities/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark]), PostModule, CommentModule],
  providers: [BookmarkResolver, BookmarkService],
})
export class BookmarkModule {}
