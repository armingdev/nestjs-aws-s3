import { S3ClientConfig } from '@aws-sdk/client-s3';

export interface S3ModuleOptions {
    defaultServiceOptions: S3ClientConfig;
}
