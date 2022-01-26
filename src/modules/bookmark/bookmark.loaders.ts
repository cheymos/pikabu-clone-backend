import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { Repository } from 'typeorm';
import { PostComment } from '../post-comment/entities/post-comment.entity';
import { Post } from '../post/entities/post.entity';
import { BookmarkType } from './enums/bookmark-type.enum';

@Injectable({ scope: Scope.REQUEST })
export class BookmarkLoaders {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
  ) {}

  readonly batchItems = new DataLoader(async (items: ItemsType[]) => {
    const postIds: number[] = [];
    const postCommentsIds: number[] = [];

    items.forEach(({ type, itemId }) => {
      if (type === BookmarkType.Comment) {
        postCommentsIds.push(itemId);
      } else {
        postIds.push(itemId);
      }
    });

    const postsPromise = this.postRepository.findByIds(postIds);
    const postCommentsPromise =
      this.postCommentRepository.findByIds(postCommentsIds);

    const [posts, postComments] = await Promise.all([
      postsPromise,
      postCommentsPromise,
    ]);

    return items.map(({ itemId, type }) =>
      type === BookmarkType.Comment
        ? postComments.find((c) => c.id === itemId)
        : posts.find((p) => p.id === itemId),
    );
  });
}

export interface ItemsType {
  itemId: number;
  type: BookmarkType;
}
