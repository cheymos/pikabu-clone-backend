import { createUnionType } from '@nestjs/graphql';

export const createUnionResult = (...types: any[]) =>
  createUnionType({
    name: `${types[0].name}Result`,
    types: () => types,
  });
