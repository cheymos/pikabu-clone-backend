import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PostCommentImage } from '../image/entities/post-comment-image.entity';
import { CommentLoaders } from './comment.loader';
import { PostComment } from './entities/post-comment.entity';

@Resolver(() => PostComment)
export class PostCommentResolver {
  constructor(private readonly postCommentLoaders: CommentLoaders) {}

  @ResolveField(() => [PostCommentImage])
  images(@Parent() { id }: PostComment): Promise<PostCommentImage[]> {
    return this.postCommentLoaders.batchImages.load(id);
  }
}
