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
import { LikeValue } from '../like/enums/like-value.enum';
import { LikeService } from '../like/like.service';
import { PostTag } from '../tag/entities/post-tag.entity';
import { Post } from './entities/post.entity';
import { CreatePostData } from './inputs/create-post-data.input';
import { PostLoaders } from './post.loaders';
import { PostService } from './post.service';
import { PostPagination } from './types/post-pagination.type';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly postLoaders: PostLoaders,
    private readonly likeService: LikeService,
  ) {}

  @Query(() => PostResult)
  post(@IdArg() id: number): Promise<Post | NotFoundError> {
    return this.postService.getById(id);
  }

  @Query(() => PostPagination)
  posts(@Args() paginationArgs: PaginationArgs): Promise<PostPagination> {
    return this.postService.getAll(paginationArgs);
  }

  @ResolveField(() => [PostImage])
  images(@Parent() { id, images }: Post) {
    if (images) return images;

    return this.postLoaders.batchImages.load(id);
  }

  @ResolveField(() => [PostTag])
  tags(@Parent() { id, tags }: Post) {
    if (tags) return tags;

    return this.postLoaders.batchTags.load(id);
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
    return this.likeService.addLikeToPost(postId, LikeValue.YES, userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PostLikeResult)
  async postDisLike(
    @IdArg() postId: number,
    @UserId() userId: string,
  ): Promise<Post | AlreadyVotedError | NotFoundError> {
    return this.likeService.addLikeToPost(postId, LikeValue.NO, userId);
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
