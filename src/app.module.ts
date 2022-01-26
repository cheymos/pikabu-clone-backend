import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { JwtStrategy } from './common/jwt.strategy';
import { TypeOrmConfig } from './configs/typeorm';
import { BookmarkModule } from './modules/bookmark/bookmark.module';
import { ImageModule } from './modules/image/image.module';
import { LocalFileModule } from './modules/local-file/local-file.module';
import { PostCommentModule } from './modules/post-comment/post-comment.module';
import { PostTagModule } from './modules/post-tag/post-tag.module';
import { PostModule } from './modules/post/post.module';
import { VoteModule } from './modules/vote/vote.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    PostModule,
    LocalFileModule,
    ImageModule,
    PostTagModule,
    PostCommentModule,
    VoteModule,
    BookmarkModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
