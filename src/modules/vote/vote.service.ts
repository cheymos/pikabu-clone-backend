import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlreadyVotedError } from '../../common/graphql/errors/already-voted.error';
import { NotFoundError } from '../../common/graphql/errors/not-found.error';
import { Post } from '../post/entities/post.entity';
import { PostVote } from './entities/post-vote.entity';
import { VoteValue } from './enums/vote-value.enum';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(PostVote)
    private readonly postVoteRepository: Repository<PostVote>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async addLikeToPost(
    postId: number,
    voteValue: VoteValue,
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
      .leftJoinAndSelect('posts.votes', 'postVotes')
      .getOne();

    if (!post) return new NotFoundError('Post not found');

    const vote = post.votes?.find((vote) => vote.ownerId === userId);

    if (vote && vote.value === voteValue) {
      const errorVotePhrase = this.getPhraseVoteError(voteValue);

      return new AlreadyVotedError(
        `The current user has already ${errorVotePhrase}`,
      );
    }

    if (vote && vote.value !== voteValue) {
      voteValue =
        voteValue !== VoteValue.LIKE ? VoteValue.DISLIKE : VoteValue.LIKE;
    }

    const newPostVote = this.postVoteRepository.create({
      id: vote?.id,
      postId: postId,
      value: voteValue,
      ownerId: userId,
    });

    const postVote = await this.postVoteRepository.save(newPostVote);
    post.votes?.push(postVote);

    return post;
  }

  async getByPostIds(ids: number[]): Promise<PostVote[]> {
    return this.postVoteRepository
      .createQueryBuilder('postVote')
      .where('postVote.postId IN (:...ids)', { ids })
      .getMany();
  }

  private getPhraseVoteError(likeValue: VoteValue) {
    return likeValue === VoteValue.LIKE ? 'liked' : 'disliked';
  }
}
