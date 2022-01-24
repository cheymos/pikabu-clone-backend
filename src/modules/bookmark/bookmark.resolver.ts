import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserId } from '../../common/decorators/user-id.decorator';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { createUnionResult } from '../../utils/graphql';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from './entities/bookmark.entity';
import { ItemNotFoundError } from './errors/item-not-found.error';
import { CreateBookmarkData } from './inputs/create-bookmark-data.input';

@Resolver(() => Bookmark)
export class BookmarkResolver {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BookmarkResult)
  bookmarkCreate(
    @Args('data') data: CreateBookmarkData,
    @UserId() userId: string,
  ): Promise<Bookmark | ItemNotFoundError> {
    return this.bookmarkService.create(data, userId);
  }
}

const BookmarkResult = createUnionResult(
  'BookmarkResult',
  Bookmark,
  ItemNotFoundError,
);
