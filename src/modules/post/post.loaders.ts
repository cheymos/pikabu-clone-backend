import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { LoaderArgs } from '../../common/types/loader-args.type';
import { PostImage } from '../image/entities/post-image.entity';
import { ImageService } from '../image/image.service';
import { PostComment } from '../post-comment/entities/post-comment.entity';
import { CommentSort } from '../post-comment/enums/comment-sort.enum';
import { PostCommentService } from '../post-comment/post-comment.service';
import { PostTag } from '../post-tag/entities/post-tag.entity';
import { PostTagService } from '../post-tag/post-tag.service';
import { PostVote } from '../vote/entities/post-vote.entity';
import { VoteService } from '../vote/vote.service';

// MENTOR: А можно ли вообще так делать?)
@Injectable({ scope: Scope.REQUEST })
export class PostLoaders {
  constructor(
    private readonly postImageService: ImageService,
    private readonly postTagService: PostTagService,
    private readonly postVoteService: VoteService,
    private readonly postCommentService: PostCommentService,
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

  readonly batchComments = new DataLoader(
    async (params: LoaderArgs<CommentSort>[]) => {
      const ids = params.map((param) => param.id)
      const paginationArgs = params[0].paginationOptions;
      const sortOption = params[0].sortOptions;

      const comments = await this.postCommentService.getByPostIds(
        ids,
        paginationArgs,
        sortOption,
      );

      const postIdToComments: { [key: string]: PostComment[] } = {};

      comments.forEach((comment) => {
        if (!postIdToComments[comment.postId]) {
          postIdToComments[comment.postId] = [comment];
        } else {
          postIdToComments[comment.postId].push(comment);
        }
      });

      return ids.map((id) => postIdToComments[id] || []);
    },
  );
}
