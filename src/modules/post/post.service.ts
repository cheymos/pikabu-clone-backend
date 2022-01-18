import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInputError } from 'apollo-server-express';
import { Repository } from 'typeorm';
import { PaginationArgs } from '../../common/graphql/args/pagination.args';
import { NotFoundError } from '../../common/graphql/errors/not-found.error';
import { PaginationInfo } from '../../common/graphql/types/pagination-result.type';
import { ImageService } from '../image/image.service';
import { TagService } from '../tag/tag.service';
import { Post } from './entities/post.entity';
import { CreatePostData } from './inputs/create-post-data.input';
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
  async getAll({ page, perPage }: PaginationArgs): Promise<PostPagination> {
    if (page < 1 || perPage < 1)
      throw new UserInputError('Page and perPage must not be less than 1');

    const skip = page * perPage - perPage;

    const [items, totalItems] = await this.postRepository.findAndCount({
      skip,
      take: perPage,
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
}
