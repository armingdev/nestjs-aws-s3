import { GetObjectCommandOutput } from '@aws-sdk/client-s3';

export class GetFileChain {
    private readonly result: Promise<GetObjectCommandOutput>;
    private readonly bucket: string;
    private readonly key: string;

    constructor(bucket: string, key: string, result: Promise<GetObjectCommandOutput>) {
        this.bucket = bucket;
        this.key = key;
        this.result = result;
    }

    async withMetaData(): Promise<{ ContentType: string; ContentLength: number; LastModified: Date; }> {
        const response = await this.result;

        return {
            ContentType: response.ContentType ?? 'unknown',
            ContentLength: response.ContentLength ?? 0,
            LastModified: response.LastModified ?? new Date(0)
        };
    }



    async withDownloadLink(): Promise<string> {
        await this.result;
        return `https://${this.bucket}.s3.amazonaws.com/${this.key}`;
    }
}
