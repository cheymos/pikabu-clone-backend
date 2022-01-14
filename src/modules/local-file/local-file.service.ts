import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalFile } from './local-file.entity';

@Injectable()
export class LocalFileService {
  constructor(
    @InjectRepository(LocalFile)
    private readonly localFileRepository: Repository<LocalFile>,
  ) {}
  saveData(filename: string, path: string): Promise<LocalFile> {
    const fileMetadata = new LocalFile(filename, path);

    return this.localFileRepository.save(fileMetadata);
  }
}
