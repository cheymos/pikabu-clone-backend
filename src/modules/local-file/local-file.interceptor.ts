import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
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

    constructor() {
      const destination = join(__dirname, '..', '..', 'public', 'uploaded');

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
