import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationArgs } from '../../common/graphql/args/pagination.args';
import { PaginationInfo } from '../../common/graphql/types/pagination-result.type';
import { PostComment } from '../post-comment/entities/post-comment.entity';
import { Post } from '../post/entities/post.entity';
import { Bookmark } from './entities/bookmark.entity';
import { BookmarkType } from './enums/bookmark-type.enum';
import { ItemNotFoundError } from './errors/item-not-found.error';
import { CreateBookmarkData } from './inputs/create-bookmark-data.input';
import { BookmarkPagination } from './types/bookmark-pagination.type';

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

  async getAll(
    { page, perPage }: PaginationArgs,
    userId: string,
  ): Promise<BookmarkPagination> {
    const skip = page * perPage - perPage;

    const [items, totalItems] = await this.bookmarkRepository.findAndCount({
      where: { ownerId: userId },
      skip,
      take: perPage,
    });

    const currentPerPage = items.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    const pageInfo = new PaginationInfo({
      page,
      perPage: currentPerPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    });

    return { items, pageInfo };
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
