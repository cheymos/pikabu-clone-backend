import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInputError } from 'apollo-server-express';
import { FindConditions, MoreThan, Repository } from 'typeorm';
import { PaginationArgs } from '../../common/graphql/args/pagination.args';
import { NotFoundError } from '../../common/graphql/errors/not-found.error';
import { PaginationInfo } from '../../common/graphql/types/pagination-result.type';
import { ImageService } from '../image/image.service';
import { TagService } from '../tag/tag.service';
import { Post } from './entities/post.entity';
import { PostSort } from './enums/post-sort.enum';
import { CreatePostData } from './inputs/create-post-data.input';
import { PostFilter, PostGroup } from './inputs/post-filter.input';
import { PostPagination } from './types/post-pagination.type';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly postImageService: ImageService,
    private readonly postTagService: TagService,
  ) {}

  async getById(id: number): Promise<Post | NotFoundError> {
    const post = await this.postRepository.findOne(id);

    if (!post) return new NotFoundError('Post not found');

    return post;
  }

  async create(
    { title, description, imagePaths, tags }: CreatePostData,
    userId: string,
  ): Promise<Post> {
    const newPost = this.postRepository.create({
      title,
      description,
      ownerId: userId,
    });
    const post = await this.postRepository.save(newPost);

    if (Array.isArray(imagePaths) && imagePaths.length)
      post.images = await this.postImageService.addToPost(post.id, imagePaths);

    if (Array.isArray(tags) && tags.length)
      post.tags = await this.postTagService.addToPost(post.id, tags);

    return post;
  }

  // MENTOR: Логику с пагинацией лучше вынести из сервиса?
  async getAll(
    { page, perPage }: PaginationArgs,
    sortOption?: PostSort[],
    filterOptions?: PostFilter,
  ): Promise<PostPagination> {
    if (page < 1 || perPage < 1)
      throw new UserInputError('Page and perPage must not be less than 1');

    const skip = page * perPage - perPage;

    const [items, totalItems] = await this.postRepository.findAndCount({
      skip,
      take: perPage,
      order: this.getFieldOrder(sortOption),
      where: this.getFilter(filterOptions),
      relations: ['comments'],
    });

    const totalPages = Math.ceil(totalItems / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const currentPerPage = items.length;

    const pageInfo = new PaginationInfo({
      page,
      perPage: currentPerPage,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    });

    return { items, pageInfo };
  }

  // FIXME: Rewrite this
  private getFilter(filterOptions?: PostFilter): FindConditions<Post> {
    const conditions: FindConditions<Post> = {};

    if (!filterOptions) return conditions;

    const { group } = filterOptions;

    if (group === PostGroup.RECENT) {
      conditions.createdAt = MoreThan(this.getYesterdayDate());
    }

    return conditions;
  }

  private getFieldOrder(sortOptions?: PostSort[]) {
    if (!Array.isArray(sortOptions) || !sortOptions.length) return undefined;

    const order: PostOrderType = {};

    for (const option of sortOptions) {
      switch (option) {
        case PostSort.DATE_ASC:
          order.createdAt = 'ASC';
          break;
        case PostSort.DATE_DESC:
          order.createdAt = 'DESC';
          break;
        case PostSort.LIKE_ASC:
          order.likes = 'ASC';
          break;
        case PostSort.LIKE_DESC:
          order.likes = 'DESC';
          break;
      }
    }

    return order;
  }

  private getYesterdayDate() {
    return new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  }
}

export type PostOrderType = { [key in keyof Post]?: 'ASC' | 'DESC' | 1 | -1 };
