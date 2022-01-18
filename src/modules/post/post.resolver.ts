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
import { NotFoundError } from '../../common/graphql/errors/not-found.error';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { createUnionResult } from '../../utils/graphql';
import { PostImage } from '../image/entities/post-image.entity';
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
}

const PostResult = createUnionResult(Post, NotFoundError);

// FIXME: Not working :(
// export const Result = (...types: any[]) =>
//   createUnionType({
//     name: `${types[0].name}Result`,
//     types: () => types,
//   });
