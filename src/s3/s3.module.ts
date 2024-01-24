import { DynamicModule, Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3ModuleOptions } from './interfaces/s3.interfaces';

@Module({})
export class S3Module {
  static forRoot(options: S3ModuleOptions): DynamicModule {
    return {
      module: S3Module,
      providers: [
        {
          provide: 'S3_MODULE_OPTIONS',
          useValue: options,
        },
        S3Service,
      ],
      exports: [S3Service],
    };
  }
}
