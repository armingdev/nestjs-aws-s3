import {ConflictException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsCommand, CopyObjectCommand, CreateBucketCommand, DeleteBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


@Injectable()
export class S3Service {
    private s3Client: S3Client = new S3Client({ region: 'your-region' });

    async uploadFile(bucket: string, key: string, body: Buffer) {
        try {
            return await this.s3Client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body }));
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error uploading file: ${error.message}`);
            }
        }
    }

    async getFile(bucket: string, key: string) {
        try {
            return await this.s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'NoSuchKey') {
                    throw new NotFoundException(`File not found: ${key}`);
                }
                throw new InternalServerErrorException(`Error getting file: ${error.message}`);
            }
        }
    }

    async deleteFile(bucket: string, key: string) {
        try {
            return await this.s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error deleting file: ${error.message}`);
            }
        }
    }

    async listFiles(bucket: string) {
        try {
            return await this.s3Client.send(new ListObjectsCommand({ Bucket: bucket }));
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error listing files: ${error.message}`);
            }
        }
    }

    async copyFile(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string) {
        try {
            return await this.s3Client.send(new CopyObjectCommand({ CopySource: `${sourceBucket}/${sourceKey}`, Bucket: destBucket, Key: destKey }));
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error copying file: ${error.message}`);
            }
        }
    }

    async createBucket(bucket: string) {
        try {
            return await this.s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'BucketAlreadyExists') {
                    throw new ConflictException(`Bucket already exists: ${bucket}`);
                }
                throw new InternalServerErrorException(`Error creating bucket: ${error.message}`);
            }
        }
    }

    async deleteBucket(bucket: string) {
        try {
            return await this.s3Client.send(new DeleteBucketCommand({ Bucket: bucket }));
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error deleting bucket: ${error.message}`);
            }
        }
    }

    async getSignedUrl(bucket: string, key: string, expires: number) {
        try {
            const command = new GetObjectCommand({ Bucket: bucket, Key: key });
            return await getSignedUrl(this.s3Client, command, { expiresIn: expires });
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error getting signed URL: ${error.message}`);
            }
        }
    }

    async moveFile(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string) {
        try {
            await this.copyFile(sourceBucket, sourceKey, destBucket, destKey);
            await this.deleteFile(sourceBucket, sourceKey);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error moving file: ${error.message}`);
            }
        }
    }
}
