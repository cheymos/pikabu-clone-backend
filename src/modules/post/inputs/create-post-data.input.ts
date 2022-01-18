import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostData {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [String], { nullable: true })
  imagePaths: string[];

  @Field(() => [String], { nullable: true })
  tags: string[];
}
