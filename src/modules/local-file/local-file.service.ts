import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalFile } from './local-file.entity';

@Injectable()
export class LocalFileService {
  constructor(
    @InjectRepository(LocalFile)
    private readonly localFileRepository: Repository<LocalFile>,
    private readonly configService: ConfigService,
  ) {}
  saveData(filename: string): Promise<LocalFile> {
    const domain = this.configService.get<string>('DOMAIN');
    const prefix = this.configService.get<string>('UPLOADED_FILES_PREFIX');
    const path = `${domain}/${prefix}/${filename}`;

    const fileMetadata = this.localFileRepository.create({ filename, path });

    return this.localFileRepository.save(fileMetadata);
  }
}
