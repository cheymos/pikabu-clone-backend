import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { POST_NOT_FOUND } from '../../common/constants/error.constants';
import { PaginationArgs } from '../../common/graphql/args/pagination.args';
import { NotFoundError } from '../../common/graphql/errors/not-found.error';
import { ImageService } from '../image/image.service';
import { Post } from '../post/entities/post.entity';
import { PostComment } from './entities/post-comment.entity';
import { CommentSort } from './enums/comment-sort.enum';
import { CreatePostCommentData } from './inputs/create-post-comment-data.input';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    private readonly imageService: ImageService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async addToPost(
    { text, postId, imagePaths }: CreatePostCommentData,
    userId: string,
  ): Promise<Post | NotFoundError> {
    const post = await this.postRepository.findOne(postId, {
      relations: ['comments', 'comments.images'],
    });

    if (!post) return new NotFoundError(POST_NOT_FOUND);

    const newComment = this.postCommentRepository.create({
      text,
      postId,
      ownerId: userId,
    });

    const comment = await this.postCommentRepository.save(newComment);

    if (Array.isArray(imagePaths) && imagePaths.length) {
      comment.images = await this.imageService.addToComment(
        comment.id,
        imagePaths,
      );
    }

    post.comments?.push(comment);

    return post;
  }

  async getByPostIds(
    ids: number[],
    { page, perPage }: PaginationArgs,
    sortOption: CommentSort[],
  ): Promise<PostComment[]> {
    const skip = page * perPage - perPage;
    const fieldOrder = this.getFieldOrder(sortOption);

    return this.postCommentRepository
      .createQueryBuilder('comment')
      .where('comment.postId IN (:...ids)', { ids })
      .take(perPage)
      .skip(skip)
      .orderBy(fieldOrder)
      .getMany();
  }

  private getFieldOrder(sortOptions: CommentSort[]) {
    if (!Array.isArray(sortOptions) || !sortOptions.length) return {};

    const order: CommentOrderType = {};

    for (const option of sortOptions) {
      switch (option) {
        case CommentSort.DATE_ASC:
          order['comment.createdAt'] = 'ASC';
          break;
        case CommentSort.DATE_DESC:
          order['comment.createdAt'] = 'DESC';
          break;
        case CommentSort.LIKE_ASC:
          order['likes'] = 'ASC';
          break;
        case CommentSort.LIKE_DESC:
          order['likes'] = 'DESC';
          break;
      }
    }

    return order;
  }
}

export type CommentOrderType = {
  [columnName: string]: 'ASC' | 'DESC';
};
