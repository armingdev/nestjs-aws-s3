import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsCommand,
    CopyObjectCommand,
    CreateBucketCommand,
    DeleteBucketCommand,
    DeleteObjectsCommand,
    DeleteObjectsCommandOutput,
    DeleteObjectCommandOutput,
    DeleteBucketCommandOutput,
    CreateBucketCommandOutput, CopyObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { UploadFileChain } from './chains/uploadFileChain';
import { GetFileChain } from './chains/getFileChain';
import { ListFilesChain } from './chains/listFilesChain';

@Injectable()
export class S3Service {
    private s3Client: S3Client = new S3Client({ region: 'your-region' });

    async uploadFile(bucket: string, key: string, body: Buffer): Promise<UploadFileChain> {
        try {
            const result = this.s3Client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body }));
            return new UploadFileChain(bucket, key, result, this.s3Client);
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error uploading file to ${bucket}/${key}: ${error.message}`);
            }
            throw error;
        }
    }


    async getFile(bucket: string, key: string): Promise<GetFileChain> {
        try {
            const result = this.s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
            return new GetFileChain(bucket, key, result);
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'NoSuchKey') {
                    throw new NotFoundException(`File not found: ${key}`);
                }
                throw new InternalServerErrorException(`Error getting file: ${error.message}`);
            }
            throw error;
        }
    }

    async deleteFile(bucket: string, key: string): Promise<DeleteObjectCommandOutput> {
        try {
            return await this.s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error deleting file: ${error.message}`);
            }
            throw error;
        }
    }

    async deleteFiles(bucket: string, keys: string[]): Promise<DeleteObjectsCommandOutput> {
        try {
            const deleteObjects = keys.map((Key) => ({ Key }));
            return await this.s3Client.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: deleteObjects } }));
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error deleting files: ${error.message}`);
            }
            throw error;
        }
    }

    async listFiles(bucket: string): Promise<ListFilesChain> {
        try {
            const result = this.s3Client.send(new ListObjectsCommand({ Bucket: bucket }));
            return new ListFilesChain(result);
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error listing files: ${error.message}`);
            }
            throw error;
        }
    }

    async copyFile(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<CopyObjectCommandOutput> {
        try {
            return await this.s3Client.send(new CopyObjectCommand({ CopySource: `${sourceBucket}/${sourceKey}`, Bucket: destBucket, Key: destKey }));
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error copying file: ${error.message}`);
            }
            throw error;
        }
    }

    async createBucket(bucket: string): Promise<CreateBucketCommandOutput> {
        try {
            return await this.s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'BucketAlreadyExists') {
                    throw new ConflictException(`Bucket already exists: ${bucket}`);
                }
                throw new InternalServerErrorException(`Error creating bucket: ${error.message}`);
            }
            throw error;
        }
    }

    async deleteBucket(bucket: string): Promise<DeleteBucketCommandOutput> {
        try {
            return await this.s3Client.send(new DeleteBucketCommand({ Bucket: bucket }));
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error deleting bucket: ${error.message}`);
            }
            throw error;
        }
    }

    async getSignedUrl(bucket: string, key: string, expires: number): Promise<string> {
        try {
            const command = new GetObjectCommand({ Bucket: bucket, Key: key });
            return await getSignedUrl(this.s3Client, command, { expiresIn: expires });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error getting signed URL: ${error.message}`);
            }
            throw error;
        }
    }

    async moveFile(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<void> {
        try {
            await this.copyFile(sourceBucket, sourceKey, destBucket, destKey);
            await this.deleteFile(sourceBucket, sourceKey);
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(`Error moving file: ${error.message}`);
            }
            throw error;
        }
    }
}
