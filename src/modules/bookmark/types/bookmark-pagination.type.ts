import { ObjectType } from '@nestjs/graphql';
import { PaginationResult } from '../../../common/graphql/types/pagination-result.type';
import { Bookmark } from '../entities/bookmark.entity';

@ObjectType()
export class BookmarkPagination extends PaginationResult<Bookmark>(Bookmark) {}
