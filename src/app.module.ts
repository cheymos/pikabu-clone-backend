import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { JwtStrategy } from './common/jwt.strategy';
import { TypeOrmConfig } from './configs/typeorm.config';
import { CommentModule } from './modules/comment/comment.module';
import { ImageModule } from './modules/image/image.module';
import { LocalFileModule } from './modules/local-file/local-file.module';
import { PostModule } from './modules/post/post.module';
import { TagModule } from './modules/tag/tag.module';
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
    TagModule,
    CommentModule,
    VoteModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
