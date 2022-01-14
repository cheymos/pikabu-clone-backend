import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PostData {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [String])
  imagePaths: string[];
}
