import {PutObjectAclCommand, PutObjectCommandOutput, S3Client} from '@aws-sdk/client-s3';

export class UploadFileChain {
    private readonly bucket: string;
    private readonly key: string;
    private readonly result: Promise<PutObjectCommandOutput>;
    private s3Client: S3Client;

    constructor(bucket: string, key: string, result: Promise<PutObjectCommandOutput>, s3Client: S3Client) {
        this.bucket = bucket;
        this.key = key;
        this.result = result;
        this.s3Client = s3Client;
    }

    async withUrl(): Promise<string> {
        await this.result;
        return `https://${this.bucket}.s3.amazonaws.com/${this.key}`;
    }

    async withPublicAccess(allowPublicAccess: boolean): Promise<void> {
        const acl = allowPublicAccess ? 'public-read' : 'private';
        await this.s3Client.send(new PutObjectAclCommand({ Bucket: this.bucket, Key: this.key, ACL: acl }));
    }
}
