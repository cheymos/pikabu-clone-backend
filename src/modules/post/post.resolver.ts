import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IdArg } from '../../common/decorators/id-arg.decorator';
import { UserId } from '../../common/decorators/user-id.decorator';
import { NotFoundError } from '../../common/graphql/errors/not-found.error';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { createUnionResult } from '../../utils/graphql';
import { Post } from './entities';
import { PostData } from './inputs/post-data.input';
import { PostService } from './services/post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => PostResult)
  post(@IdArg() id: number): Promise<Post | NotFoundError> {
    return this.postService.getById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  postCreate(
    @Args('data') data: PostData,
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
