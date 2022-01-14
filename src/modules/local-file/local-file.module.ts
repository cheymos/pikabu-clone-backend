import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalFileController } from './local-file.controller';
import { LocalFile } from './local-file.entity';
import { LocalFileService } from './local-file.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocalFile])],
  providers: [LocalFileService],
  controllers: [LocalFileController],
})
export class LocalFileModule {}
