import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostComment } from '../comment/entities/post-comment.entity';
import { Post } from '../post/entities/post.entity';
import { Bookmark } from './entities/bookmark.entity';
import { BookmarkType } from './enums/bookmark-type.enum';
import { ItemNotFoundError } from './errors/item-not-found.error';
import { CreateBookmarkData } from './inputs/create-bookmark-data.input';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
  ) {}
  async create(
    { itemId, type }: CreateBookmarkData,
    userId: string,
  ): Promise<Bookmark | ItemNotFoundError> {
    const entityExists = await this.checkExists(type, itemId);

    if (!entityExists) {
      return new ItemNotFoundError('Item by itemId not found');
    }
    const newBookmark = this.bookmarkRepository.create({
      itemId,
      type,
      ownerId: userId,
    });

    return this.bookmarkRepository.save(newBookmark);
  }

  private async checkExists(type: BookmarkType, id: number) {
    if (type === BookmarkType.Post) {
      const post = await this.postRepository.findOne(id);
      return Boolean(post);
    } else if (type === BookmarkType.Comment) {
      const comment = await this.postCommentRepository.findOne(id);
      return Boolean(comment);
    } else {
      throw new Error('Invalid bookmark type');
    }
  }
}
