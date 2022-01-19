import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlreadyVotedError } from '../../common/graphql/errors/already-voted.error';
import { NotFoundError } from '../../common/graphql/errors/not-found.error';
import { Post } from '../post/entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { LikeValue } from './enums/like-value.enum';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async addLikeToPost(
    postId: number,
    likeValue: LikeValue,
    userId: string,
  ): Promise<Post | AlreadyVotedError | NotFoundError> {
    // 4 queries
    // const post = await this.postRepository.findOne({
    //   where: { id: postId },
    //   relations: ['likes'],
    // });

    // 3 queries
    const post = await this.postRepository
      .createQueryBuilder('posts')
      .andWhereInIds(postId)
      .innerJoinAndSelect('posts.likes', 'postLikes')
      .getOne();

    if (!post) return new NotFoundError('Post not found');

    const vote = post.likes?.find((like) => like.ownerId === userId);

    if (vote && vote.value === likeValue) {
      const errorVotePhrase = this.getPhraseVoteError(likeValue);

      return new AlreadyVotedError(
        `The current user has already ${errorVotePhrase}`,
      );
    }

    if (vote && vote.value !== likeValue) {
      likeValue = likeValue !== LikeValue.YES ? LikeValue.NO : LikeValue.YES;
    }

    const likeCandidate = this.postLikeRepository.create({
      id: vote?.id,
      postId: postId,
      value: likeValue,
      ownerId: userId,
    });

    const postLike = await this.postLikeRepository.save(likeCandidate);
    post.likes?.push(postLike);

    return post;
  }

  private getPhraseVoteError(likeValue: LikeValue) {
    return likeValue === LikeValue.YES ? 'liked' : 'disliked';
  }
}
