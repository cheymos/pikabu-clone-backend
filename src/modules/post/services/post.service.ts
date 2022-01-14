import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from '../../../common/graphql/errors/not-found.error';
import { Post } from '../entities';
import { PostData } from '../inputs/post-data.input';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async getById(id: number): Promise<Post | NotFoundError> {
    const post = await this.postRepository.findOne(id);

    if (!post) return new NotFoundError('Post not found');

    return post;
  }

  create({ title, description }: PostData, userId: string): Promise<Post> {
    const post = new Post(title, description, userId);

    return this.postRepository.save(post);
  }
}
