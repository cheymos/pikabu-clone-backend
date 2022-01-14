import { InputType, PickType } from '@nestjs/graphql';
import { Post } from '../entities';

@InputType()
export class PostData extends PickType(
  Post,
  ['title', 'description'],
  InputType,
) {}
