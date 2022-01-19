import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { PostCommentImage } from '../image/entities/post-comment-image.entity';
import { ImageService } from '../image/image.service';

@Injectable({ scope: Scope.REQUEST })
export class CommentLoaders {
  constructor(private readonly postImageService: ImageService) {}

  readonly batchImages = new DataLoader(async (postIds: number[]) => {
    const images = await this.postImageService.getByPostCommentIds(postIds);

    const commentIdToImages: { [key: string]: PostCommentImage[] } = {};

    images.forEach((image) => {
      if (!commentIdToImages[image.commentId]) {
        commentIdToImages[image.commentId] = [image];
      } else {
        commentIdToImages[image.commentId].push(image);
      }
    });

    return postIds.map((id) => commentIdToImages[id] || []);
  });
}
