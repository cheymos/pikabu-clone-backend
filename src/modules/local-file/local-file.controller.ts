import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LocalFile } from './local-file.entity';
import { LocalFilesInterceptor } from './local-file.interceptor';
import { LocalFileService } from './local-file.service';

@Controller('files')
export class LocalFileController {
  constructor(private readonly localFileService: LocalFileService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(LocalFilesInterceptor('file'))
  uploadFile(
    @UploadedFile() { filename }: Express.Multer.File,
  ): Promise<LocalFile> {
    return this.localFileService.saveData(filename);
  }
}
