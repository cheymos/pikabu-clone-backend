import { Args, ID } from '@nestjs/graphql';

export const IdArg = () => Args('id', { type: () => ID });
