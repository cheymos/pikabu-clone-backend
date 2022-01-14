import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { JwtStrategy } from './common/jwt.strategy';
import { TypeOrmConfig } from './configs/typeorm.config';
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    PostModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
