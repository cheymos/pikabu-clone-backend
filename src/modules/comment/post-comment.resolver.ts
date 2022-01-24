import { UseGuards } from '@nestjs/common';
import { Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { IdArg } from '../../common/decorators/id-arg.decorator';
import { UserId } from '../../common/decorators/user-id.decorator';
import { AlreadyVotedError } from '../../common/graphql/errors/already-voted.error';
import { NotFoundError } from '../../common/graphql/errors/not-found.error';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { createUnionResult } from '../../utils/graphql';
import { PostCommentImage } from '../image/entities/post-comment-image.entity';
import { CommentVote } from '../vote/entities/comment-vote.entity';
import { VoteValue } from '../vote/enums/vote-value.enum';
import { VoteService } from '../vote/vote.service';
import { CommentLoaders } from './comment.loader';
import { PostComment } from './entities/post-comment.entity';

@Resolver(() => PostComment)
export class PostCommentResolver {
  constructor(
    private readonly postCommentLoaders: CommentLoaders,
    private readonly voteService: VoteService,
  ) {}

  @ResolveField(() => [PostCommentImage])
  images(@Parent() { id }: PostComment): Promise<PostCommentImage[]> {
    return this.postCommentLoaders.batchImages.load(id);
  }

  @ResolveField(() => [CommentVote])
  votes(@Parent() { id }: PostComment) {
    return this.postCommentLoaders.batchVotes.load(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PostCommentResult)
  postCommentLike(
    @IdArg() commentId: number,
    @UserId() userId: string,
  ): Promise<PostComment | AlreadyVotedError | NotFoundError> {
    return this.voteService.addLikeToComment(commentId, VoteValue.LIKE, userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PostCommentResult)
  postCommentDisLike(
    @IdArg() commentId: number,
    @UserId() userId: string,
  ): Promise<PostComment | AlreadyVotedError | NotFoundError> {
    return this.voteService.addLikeToComment(
      commentId,
      VoteValue.DISLIKE,
      userId,
    );
  }
}

const PostCommentResult = createUnionResult(
  'PostCommentResult',
  PostComment,
  AlreadyVotedError,
  NotFoundError,
);
