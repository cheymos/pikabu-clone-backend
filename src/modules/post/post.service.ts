import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from '../../common/graphql/errors/not-found.error';
import { ImageService } from '../image/image.service';
import { TagService } from '../tag/tag.service';
import { Post } from './entities/post.entity';
import { CreatePostData } from './inputs/create-post-data.input';

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

  async getAll(): Promise<Post[]> {
    return this.postRepository.find();
  }
}
