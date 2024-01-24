# nestjs-aws-s3

This is a simple, clean, and easy-to-use NestJS module for Amazon S3 integration, leveraging the latest AWS SDK v3. It's designed for quick integration and minimal setup, making your development process smoother.

## Features

- Easy integration with AWS S3 for NestJS applications.
- Clean and optimized codebase.
- Wide range of S3 functionalities.

## Installation

```bash
npm install nestjs-aws-s3
```

## Configuration

In your NestJS module:

```typescript
import { S3Module } from 'nestjs-aws-s3';

@Module({
  imports: [
    S3Module.forRoot({
      defaultServiceOptions: {
        region: 'us-east-1',
        credentials: {
          accessKeyId: 'your-access-key',
          secretAccessKey: 'your-secret-key',
        },
      },
    }),
    // ... other imports
  ],
})
export class AppModule {}
```

## Usage
### Upload a File

```typescript
@Injectable()
export class YourService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadFile(file: Buffer, bucket: string, key: string) {
    return this.s3Service.uploadFile(bucket, key, file);
  }
}
```

### Retrieve a File

```typescript
export class YourService {
    constructor(private readonly s3Service: S3Service) {
    }

    async getFile(bucket: string, key: string) {
        return this.s3Service.getFile(bucket, key);
    }
}
```

### Delete a File

```typescript
export class YourService {
    constructor(private readonly s3Service: S3Service) {
    }

    async deleteFile(bucket: string, key: string) {
        return this.s3Service.deleteFile(bucket, key);
    }
}
```
## Supported Methods

The `nestjs-aws-s3` package includes a variety of methods for interacting with AWS S3, including:

- `uploadFile(bucket: string, key: string, body: Buffer)`: Upload a file to a specified bucket.
- `getFile(bucket: string, key: string)`: Retrieve a file from a specified bucket.
- `deleteFile(bucket: string, key: string)`: Delete a file from a specified bucket.
- `listFiles(bucket: string)`: List all files in a specified bucket.
- `copyFile(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string)`: Copy a file within or across buckets.
- `createBucket(bucket: string)`: Create a new S3 bucket.
- `deleteBucket(bucket: string)`: Delete an S3 bucket.
- `getSignedUrl(bucket: string, key: string, expires: number)`: Generate a signed URL for a file.
- `moveFile(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string)`: Move a file within or across buckets.

These methods provide comprehensive coverage of common S3 operations, simplifying the process of integrating AWS S3 into your NestJS applications.


## Contributing
Feel free to contribute, report issues, and request features!

## License
This project is licensed under the ISC License.
