import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostImage } from '../entities';

@Injectable()
export class PostImageService {
  constructor(
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
  ) {}

  async getByPostId(postId: number): Promise<PostImage[]> {
    return this.postImageRepository.find({ postId });
  }
}
