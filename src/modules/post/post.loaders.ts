import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { PostImage } from '../image/entities/post-image.entity';
import { ImageService } from '../image/image.service';
import { PostTag } from '../tag/entities/post-tag.entity';
import { TagService } from '../tag/tag.service';
import { PostVote } from '../vote/entities/post-vote.entity';
import { VoteService } from '../vote/vote.service';

// MENTOR: А можно ли вообще так делать?)
@Injectable({ scope: Scope.REQUEST })
export class PostLoaders {
  constructor(
    private readonly postImageService: ImageService,
    private readonly postTagService: TagService,
    private readonly postVoteService: VoteService,
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

  readonly batchVotes = new DataLoader(async (voteIds: number[]) => {
    const votes = await this.postVoteService.getByPostIds(voteIds);

    const postIdToVotes: { [key: string]: PostVote[] } = {};

    votes.forEach((vote) => {
      if (!postIdToVotes[vote.postId]) {
        postIdToVotes[vote.postId] = [vote];
      } else {
        postIdToVotes[vote.postId].push(vote);
      }
    });

    return voteIds.map((id) => postIdToVotes[id] || []);
  });
}
