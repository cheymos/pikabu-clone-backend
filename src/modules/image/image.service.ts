import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostCommentImage } from './entities/post-comment-image.entity';
import { PostImage } from './entities/post-image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
    @InjectRepository(PostCommentImage)
    private readonly postCommentImageRepository: Repository<PostCommentImage>,
  ) {}

  async getByPostId(postId: number): Promise<PostImage[]> {
    return this.postImageRepository.find({ postId });
  }

  async addToPost(postId: number, imagePaths: string[]): Promise<PostImage[]> {
    const newPostImages = [];

    for (let imagePath of imagePaths) {
      const newPostImage = this.postImageRepository.create({
        filePath: imagePath,
        postId,
      });

      newPostImages.push(newPostImage);
    }

    const postImages = await this.postImageRepository.save(newPostImages);

    return postImages;
  }

  async addToComment(
    commentId: number,
    imagePaths: string[],
  ): Promise<PostCommentImage[]> {
    const newImages = [];

    for (let imagePath of imagePaths) {
      const newImage = this.postCommentImageRepository.create({
        filePath: imagePath,
        commentId,
      });

      newImages.push(newImage);
    }

    const commentImages = await this.postCommentImageRepository.save(newImages);

    return commentImages;
  }

  async getByPostIds(ids: number[]): Promise<PostImage[]> {
    return this.postImageRepository
      .createQueryBuilder('postImage')
      .where('postImage.postId IN (:...ids)', { ids })
      .getMany();
  }

  async getByPostCommentIds(ids: number[]): Promise<PostCommentImage[]> {
    return this.postCommentImageRepository
      .createQueryBuilder('postCommentImage')
      .where('postCommentImage.commentId IN (:...ids)', { ids })
      .getMany();
  }
}
