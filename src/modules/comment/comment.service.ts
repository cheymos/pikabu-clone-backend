import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { POST_NOT_FOUND } from '../../common/constants/error.constants';
import { PaginationArgs } from '../../common/graphql/args/pagination.args';
import { NotFoundError } from '../../common/graphql/errors/not-found.error';
import { ImageService } from '../image/image.service';
import { Post } from '../post/entities/post.entity';
import { PostComment } from './entities/post-comment.entity';
import { CreatePostCommentData } from './inputs/create-post-comment-data.input';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(PostComment)
    private readonly commentRepository: Repository<PostComment>,
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

    const newComment = this.commentRepository.create({
      text,
      postId,
      ownerId: userId,
    });

    const comment = await this.commentRepository.save(newComment);

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
  ): Promise<PostComment[]> {
    const skip = page * perPage - perPage;

    return this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.postId IN (:...ids)', { ids })
      .take(perPage)
      .skip(skip)
      .getMany();
  }
}
