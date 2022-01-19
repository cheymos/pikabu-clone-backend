import { registerEnumType } from '@nestjs/graphql';

export enum LikeValue {
  NO = -1,
  YES = 1,
}

registerEnumType(LikeValue, { name: 'LikeValue' });
