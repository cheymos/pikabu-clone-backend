import { PaginationArgs } from '../graphql/args/pagination.args';

export interface LoaderArgs<sortType> {
  paginationOptions: PaginationArgs;
  sortOptions: sortType[];
  id: number;
}
