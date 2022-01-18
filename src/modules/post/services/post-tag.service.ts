import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostTag } from '../entities';

@Injectable()
export class PostTagService {
  constructor(
    @InjectRepository(PostTag)
    private readonly postTagRepository: Repository<PostTag>,
  ) {}

  async addTagsToPost(postId: number, tags: string[]) {
    const postTags = [];

    for (let tag of tags) {
      const newPostTag = this.postTagRepository.create({ name: tag, postId });
      const postTag = await this.postTagRepository.save(newPostTag);

      postTags.push(postTag);
    }

    return postTags;
  }

  async getTagsByPostId(postId: number): Promise<PostTag[]> {
    return this.postTagRepository.find({ postId });
  }

  async getByPostIds(ids: number[]): Promise<PostTag[]> {
    return this.postTagRepository
      .createQueryBuilder('postTag')
      .where('postTag.postId IN (:...ids)', { ids })
      .getMany();
  }
}
