import { Query, Resolver } from '@nestjs/graphql';
import { Post } from './entities';

@Resolver(() => Post)
export class PostResolver {
  @Query(() => Post)
  post() {}
}
