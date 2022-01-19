import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostTag } from './entities/post-tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(PostTag)
    private readonly postTagRepository: Repository<PostTag>,
  ) {}

  async addToPost(postId: number, tags: string[]) {
    const newPostTags = [];

    for (let tag of tags) {
      const newPostTag = this.postTagRepository.create({ name: tag, postId });
      newPostTags.push(newPostTag);
    }

    const postTags = await this.postTagRepository.save(newPostTags);

    return postTags;
  }

  async getByPostId(postId: number): Promise<PostTag[]> {
    return this.postTagRepository.find({ postId });
  }

  async getByPostIds(ids: number[]): Promise<PostTag[]> {
    return this.postTagRepository
      .createQueryBuilder('postTag')
      .where('postTag.postId IN (:...ids)', { ids })
      .getMany();
  }
}
