import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { join } from 'path';

export const LocalFilesInterceptor = (
  fieldName: string,
): Type<NestInterceptor> => {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    private readonly fileInterceptor: NestInterceptor;

    constructor(private readonly configService: ConfigService) {
      const prefix = this.configService.get('UPLOADED_FILES_PREFIX') as string;
      const destination = join(__dirname, '..', '..', '..', 'public', prefix);

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
        }),
      };

      this.fileInterceptor = new (FileInterceptor(fieldName, multerOptions))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }

  return mixin(MixinInterceptor);
};
