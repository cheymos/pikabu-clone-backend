import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql';
import { IdArg } from '../../common/decorators/id-arg.decorator';
import { UserId } from '../../common/decorators/user-id.decorator';
import { PaginationArgs } from '../../common/graphql/args/pagination.args';
import { AlreadyVotedError } from '../../common/graphql/errors/already-voted.error';
import { NotFoundError } from '../../common/graphql/errors/not-found.error';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { createUnionResult } from '../../utils/graphql';
import { PostImage } from '../image/entities/post-image.entity';
import { PostComment } from '../post-comment/entities/post-comment.entity';
import { CommentSort } from '../post-comment/enums/comment-sort.enum';
import { CreatePostCommentData } from '../post-comment/inputs/create-post-comment-data.input';
import { PostCommentService } from '../post-comment/post-comment.service';
import { PostTag } from '../post-tag/entities/post-tag.entity';
import { PostVote } from '../vote/entities/post-vote.entity';
import { VoteValue } from '../vote/enums/vote-value.enum';
import { VoteService } from '../vote/vote.service';
import { Post } from './entities/post.entity';
import { PostSort } from './enums/post-sort.enum';
import { CreatePostData } from './inputs/create-post-data.input';
import { PostFilter } from './inputs/post-filter.input';
import { PostLoaders } from './post.loaders';
import { PostService } from './post.service';
import { PostPagination } from './types/post-pagination.type';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly postLoaders: PostLoaders,
    private readonly voteService: VoteService,
    private readonly postCommentService: PostCommentService,
  ) {}

  @Query(() => PostResult)
  post(@IdArg() id: number): Promise<Post | NotFoundError> {
    return this.postService.getById(id);
  }

  @Query(() => PostPagination)
  posts(
    @Args() paginationArgs: PaginationArgs,
    @Args('postSort', { type: () => [PostSort], nullable: true })
    sortOptions: PostSort[],
    @Args('postFilter', { type: () => PostFilter, nullable: true })
    filterOptions: PostFilter,
  ): Promise<PostPagination> {
    return this.postService.getAll(paginationArgs, sortOptions, filterOptions);
  }

  @Query(() => [Post], { nullable: 'items' })
  postSearch(
    @Args('title', { type: () => String }) title: string,
  ): Promise<Post[]> {
    return this.postService.getManyByTitle(title);
  }

  @ResolveField(() => [PostImage])
  async images(@Parent() { id, images }: Post): Promise<PostImage[]> {
    if (images) return images;

    return this.postLoaders.batchImages.load(id);
  }

  @ResolveField(() => [PostTag])
  async tags(@Parent() { id, tags }: Post): Promise<PostTag[]> {
    if (tags) return tags;

    return this.postLoaders.batchTags.load(id);
  }

  @ResolveField(() => [PostVote])
  async votes(@Parent() { id, votes }: Post): Promise<PostVote[]> {
    if (votes) return votes;

    return this.postLoaders.batchVotes.load(id);
  }

  @ResolveField(() => [PostComment])
  async comments(
    @Args() paginationOptions: PaginationArgs,
    @Args('CommentSort', { type: () => [CommentSort], nullable: true })
    sortOptions: CommentSort[],
    @Parent() { id, comments }: Post,
  ): Promise<PostComment[]> {
    if (comments) return comments;

    return this.postLoaders.batchComments.load({
      paginationOptions,
      id,
      sortOptions,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  postCreate(
    @Args('data') data: CreatePostData,
    @UserId() userId: string,
  ): Promise<Post> {
    return this.postService.create(data, userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PostLikeResult)
  postLike(
    @IdArg() postId: number,
    @UserId() userId: string,
  ): Promise<Post | AlreadyVotedError | NotFoundError> {
    return this.voteService.addLikeToPost(postId, VoteValue.LIKE, userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PostLikeResult)
  async postDisLike(
    @IdArg() postId: number,
    @UserId() userId: string,
  ): Promise<Post | AlreadyVotedError | NotFoundError> {
    return this.voteService.addLikeToPost(postId, VoteValue.DISLIKE, userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PostResult)
  async postAddComment(
    @Args('data') data: CreatePostCommentData,
    @UserId() userId: string,
  ): Promise<Post | NotFoundError> {
    return this.postCommentService.addToPost(data, userId);
  }
}

const PostResult = createUnionResult('PostResult', Post, NotFoundError);
const PostLikeResult = createUnionResult(
  'PostLikeResult',
  Post,
  AlreadyVotedError,
  NotFoundError,
);

// FIXME: Not working :(
// export const Result = (...types: any[]) =>
//   createUnionType({
//     name: `${types[0].name}Result`,
//     types: () => types,
//   });
