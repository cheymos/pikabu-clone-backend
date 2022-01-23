import { Field, InputType, registerEnumType } from '@nestjs/graphql';

@InputType()
export class PostFilter {
  @Field(() => [String], { nullable: true })
  tags: string[];

  @Field(() => PostGroup, { nullable: true })
  group: PostGroup;
}

export enum PostGroup {
  RECENT,
  HOT,
  BEST,
}

registerEnumType(PostGroup, { name: 'PostGroup' });
