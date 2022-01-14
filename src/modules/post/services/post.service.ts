import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from '../../../common/graphql/errors/not-found.error';
import { Post, PostImage } from '../entities';
import { PostData } from '../inputs/post-data.input';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
  ) {}

  async getById(id: number): Promise<Post | NotFoundError> {
    const post = await this.postRepository.findOne(id);

    if (!post) return new NotFoundError('Post not found');

    return post;
  }

  async create(
    { title, description, imagePaths }: PostData,
    userId: string,
  ): Promise<Post> {
    const newPost = new Post(title, description, userId);
    const post = await this.postRepository.save(newPost);
    post.images = [];

    for (let imagePath of imagePaths) {
      const newPostImage = new PostImage(imagePath, post.id);
      const postImage = await this.postImageRepository.save(newPostImage);

      post.images.push(postImage);
    }

    return post;
  }
}
