import { ObjectType } from '@nestjs/graphql';
import { PaginationResult } from '../../../common/graphql/types/pagination-result.type';
import { Post } from '../entities/post.entity';

@ObjectType()
export class PostPagination extends PaginationResult<Post>(Post) {}
