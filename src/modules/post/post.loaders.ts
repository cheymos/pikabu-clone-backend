import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { PostImage } from './entities';
import { PostImageService } from './services/post-image.service';

@Injectable({ scope: Scope.REQUEST })
export class PostLoaders {
  constructor(private readonly postImageService: PostImageService) {}

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
}
