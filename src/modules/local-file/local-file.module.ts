import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalFile } from './entities/local-file.entity';
import { LocalFileController } from './local-file.controller';
import { LocalFileService } from './local-file.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocalFile])],
  providers: [LocalFileService],
  controllers: [LocalFileController],
})
export class LocalFileModule {}
