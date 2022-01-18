import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { PostImage, PostTag } from './entities';
import { PostImageService } from './services/post-image.service';
import { PostTagService } from './services/post-tag.service';

@Injectable({ scope: Scope.REQUEST })
export class PostLoaders {
  constructor(
    private readonly postImageService: PostImageService,
    private readonly postTagService: PostTagService,
  ) {}

  readonly batchImages = new DataLoader(async (postIds: number[]) => {
    const images = await this.postImageService.getByPostIds(postIds);

    const postIdToImages: { [key: string]: PostImage[] } = {};

    images.forEach((image) => {
      if (!postIdToImages[image.postId]) {
        postIdToImages[image.postId] = [image];
      } else {
        postIdToImages[image.postId].push(image);
      }
    });

    return postIds.map((id) => postIdToImages[id] || []);
  });

  readonly batchTags = new DataLoader(async (tagIds: number[]) => {
    const tags = await this.postTagService.getByPostIds(tagIds);

    const postIdToTags: { [key: string]: PostTag[] } = {};

    tags.forEach((tag) => {
      if (!postIdToTags[tag.postId]) {
        postIdToTags[tag.postId] = [tag];
      } else {
        postIdToTags[tag.postId].push(tag);
      }
    });

    return tagIds.map((id) => postIdToTags[id] || []);
  });
}
