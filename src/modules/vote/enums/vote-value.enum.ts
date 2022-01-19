import { registerEnumType } from '@nestjs/graphql';

export enum VoteValue {
  DISLIKE = -1,
  LIKE = 1,
}

registerEnumType(VoteValue, { name: 'VoteValue' });
