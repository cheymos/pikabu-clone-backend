import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInputError } from 'apollo-server-express';
import { Repository } from 'typeorm';
import { PaginationArgs } from '../../common/graphql/args/pagination.args';
import { NotFoundError } from '../../common/graphql/errors/not-found.error';
import { PaginationInfo } from '../../common/graphql/types/pagination-result.type';
import { ImageService } from '../image/image.service';
import { PostTagService } from '../post-tag/post-tag.service';
import { Post } from './entities/post.entity';
import { PostSort } from './enums/post-sort.enum';
import { CreatePostData } from './inputs/create-post-data.input';
import { PostFilter, PostGroup } from './inputs/post-filter.input';
import { PostPagination } from './types/post-pagination.type';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly imageService: ImageService,
    private readonly postTagService: PostTagService,
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
      post.images = await this.imageService.addToPost(post.id, imagePaths);

    if (Array.isArray(tags) && tags.length)
      post.tags = await this.postTagService.addToPost(post.id, tags);

    return post;
  }

  // FIXME: Decompose this!
  async getAll(
    { page, perPage }: PaginationArgs,
    sortOptions?: PostSort[],
    postFiler?: PostFilter,
  ): Promise<PostPagination> {
    if (page < 1 || perPage < 1)
      throw new UserInputError('Page and perPage must not be less than 1');

    const skip = page * perPage - perPage;
    const queryBuilder = this.postRepository
      .createQueryBuilder('p')
      .skip(skip)
      .take(perPage)
      .innerJoinAndSelect('p.tags', 't');

    if (sortOptions) {
      sortOptions.forEach((sort) => {
        const [field, order] = this.getOrderCondition(sort);
        queryBuilder.addOrderBy(`p.${field}`, order);
      });
    }

    if (postFiler && postFiler.tags) {
      queryBuilder.andWhere('t.name IN (:...names)', { names: postFiler.tags });
    }

    if (postFiler && postFiler.group !== undefined) {
      if (postFiler.group === PostGroup.BEST) {
        queryBuilder.addOrderBy('p.likes');
      } else if (postFiler.group === PostGroup.HOT) {
        queryBuilder.addOrderBy('p.commentsCount', 'DESC');
      } else if (postFiler.group === PostGroup.RECENT) {
        queryBuilder.andWhere(
          `p.createdAt > current_timestamp - interval '1 day'`,
        );
      }
    }

    const [items, totalItems] = await queryBuilder.getManyAndCount();

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

  private getOrderCondition(sortOption: PostSort): OrderConditionType {
    return PostSort[sortOption].toString().split('_') as OrderConditionType;
  }
}

export type OrderConditionType = [field: string, order: 'ASC' | 'DESC'];
