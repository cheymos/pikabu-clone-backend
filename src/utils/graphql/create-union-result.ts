import { createUnionType } from '@nestjs/graphql';

export const createUnionResult = (name: string, ...types: any[]) =>
  createUnionType({
    name,
    types: () => types,
  });
