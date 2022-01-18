import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostTag } from './entities/post-tag.entity';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostTag])],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
