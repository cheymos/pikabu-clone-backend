import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { PostCommentImage } from '../image/entities/post-comment-image.entity';
import { ImageService } from '../image/image.service';
import { CommentVote } from '../vote/entities/comment-vote.entity';
import { VoteService } from '../vote/vote.service';

@Injectable({ scope: Scope.REQUEST })
export class PostCommentLoaders {
  constructor(
    private readonly postImageService: ImageService,
    private readonly voteService: VoteService,
  ) {}

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

  readonly batchVotes = new DataLoader(async (voteIds: number[]) => {
    const votes = await this.voteService.getByCommentIds(voteIds);

    const commentIdToVotes: { [key: string]: CommentVote[] } = {};

    votes.forEach((vote) => {
      if (!commentIdToVotes[vote.commentId]) {
        commentIdToVotes[vote.commentId] = [vote];
      } else {
        commentIdToVotes[vote.commentId].push(vote);
      }
    });

    return voteIds.map((id) => commentIdToVotes[id] || []);
  });
}
