import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePostCommentData {
  @Field()
  text: string;

  @Field(() => [String], { nullable: true })
  imagePaths: string[];

  @Field(() => Int)
  postId: number;
}
