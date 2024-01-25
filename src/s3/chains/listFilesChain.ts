import { ListObjectsCommandOutput } from '@aws-sdk/client-s3';

export class ListFilesChain {
    private readonly result: Promise<ListObjectsCommandOutput>;

    constructor(result: Promise<ListObjectsCommandOutput>) {
        this.result = result;
    }

    async listFilesWithFilter(prefix?: string, suffix?: string): Promise<any[]> {
        const response = await this.result;
        return response.Contents?.filter(file =>
            (prefix ? file.Key?.startsWith(prefix) : true) &&
            (suffix ? file.Key?.endsWith(suffix) : true)
        ) || [];
    }

    async getBucketSize(): Promise<number> {
        const response = await this.result;
        return response.Contents?.reduce((total, file) => total + (file.Size || 0), 0) || 0;
    }
}
