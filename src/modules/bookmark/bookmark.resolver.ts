import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql';
import { UserId } from '../../common/decorators/user-id.decorator';
import { PaginationArgs } from '../../common/graphql/args/pagination.args';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { createUnionResult } from '../../utils/graphql';
import { BookmarkLoaders } from './bookmark.loaders';
import { BookmarkService } from './bookmark.service';
import { Bookmark, ItemField } from './entities/bookmark.entity';
import { ItemNotFoundError } from './errors/item-not-found.error';
import { CreateBookmarkData } from './inputs/create-bookmark-data.input';
import { BookmarkPagination } from './types/bookmark-pagination.type';

@Resolver(() => Bookmark)
export class BookmarkResolver {
  constructor(
    private readonly bookmarkService: BookmarkService,
    private readonly bookmarkLoaders: BookmarkLoaders,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => BookmarkPagination)
  bookmarks(
    @Args() paginationOptions: PaginationArgs,
    @UserId() userId: string,
  ): Promise<BookmarkPagination> {
    return this.bookmarkService.getAll(paginationOptions, userId);
  }

  @ResolveField(() => ItemField)
  item(@Parent() { itemId, type }: Bookmark) {
    return this.bookmarkLoaders.batchItems.load({ itemId, type });
  }

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
