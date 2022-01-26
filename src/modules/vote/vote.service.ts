import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlreadyVotedError } from '../../common/graphql/errors/already-voted.error';
import { NotFoundError } from '../../common/graphql/errors/not-found.error';
import { PostComment } from '../post-comment/entities/post-comment.entity';
import { Post } from '../post/entities/post.entity';
import { CommentVote } from './entities/comment-vote.entity';
import { PostVote } from './entities/post-vote.entity';
import { VoteValue } from './enums/vote-value.enum';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(PostVote)
    private readonly postVoteRepository: Repository<PostVote>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    @InjectRepository(CommentVote)
    private readonly commentVoteRepository: Repository<CommentVote>,
  ) {}

  async addLikeToPost(
    postId: number,
    voteValue: VoteValue,
    userId: string,
  ): Promise<Post | AlreadyVotedError | NotFoundError> {
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

  async addLikeToComment(
    commentId: number,
    voteValue: VoteValue,
    userId: string,
  ): Promise<PostComment | AlreadyVotedError | NotFoundError> {
    const comment = await this.postCommentRepository
      .createQueryBuilder('comments')
      .andWhereInIds(commentId)
      .leftJoinAndSelect('comments.votes', 'commentVotes')
      .getOne();

    if (!comment) return new NotFoundError('Comment not found');

    const vote = comment.votes?.find((vote) => vote.ownerId === userId);

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

    const newCommentVote = this.commentVoteRepository.create({
      id: vote?.id,
      commentId: commentId,
      value: voteValue,
      ownerId: userId,
    });

    const commentVote = await this.commentVoteRepository.save(newCommentVote);
    comment.votes?.push(commentVote);

    return comment;
  }

  async getByPostIds(ids: number[]): Promise<PostVote[]> {
    return this.postVoteRepository
      .createQueryBuilder('postVote')
      .where('postVote.postId IN (:...ids)', { ids })
      .getMany();
  }

  async getByCommentIds(ids: number[]): Promise<CommentVote[]> {
    return this.commentVoteRepository
      .createQueryBuilder('commentVote')
      .where('commentVote.commentId IN (:...ids)', { ids })
      .getMany();
  }

  private getPhraseVoteError(likeValue: VoteValue) {
    return likeValue === VoteValue.LIKE ? 'liked' : 'disliked';
  }
}
