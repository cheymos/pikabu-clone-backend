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

  async addToPost(postId: number, imagePaths: string[]): Promise<PostImage[]> {
    const postImages = [];

    for (let imagePath of imagePaths) {
      const newPostImage = this.postImageRepository.create({
        filePath: imagePath,
        postId,
      });
      const postImage = await this.postImageRepository.save(newPostImage);

      postImages.push(postImage);
    }

    return postImages;
  }

  async getByPostIds(ids: number[]): Promise<PostImage[]> {
    return this.postImageRepository
      .createQueryBuilder('postImage')
      .where('postImage.postId IN (:...ids)', { ids })
      .getMany();
  }
}
