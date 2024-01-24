// import { Test, TestingModule } from '@nestjs/testing';
// import { S3Service } from './s3.service';
// import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3';
//
// describe('S3Service', () => {
//   let service: S3Service;
//   let s3Client: S3Client;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         S3Service,
//         {
//           provide: S3Client,
//           useValue: {
//             send: jest.fn(),
//           },
//         },
//       ],
//     }).compile();
//
//     service = module.get<S3Service>(S3Service);
//     s3Client = module.get<S3Client>(S3Client);
//   });
//
//   it('should upload a file successfully', async () => {
//     const bucket = 'test-bucket';
//     const key = 'test-key';
//     const body = Buffer.from('test data');
//     const result = { /* expected result */ };
//
//     jest.spyOn(s3Client, 'send').mockResolvedValueOnce(result);
//
//     expect(await service.uploadFile(bucket, key, body)).toEqual(result);
//     expect(s3Client.send).toHaveBeenCalledWith(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body }));
//   });
//
//   it('should retrieve a file successfully', async () => {
//     const bucket = 'test-bucket';
//     const key = 'test-key';
//     const result = { /* expected result */ };
//
//     jest.spyOn(s3Client, 'send').mockResolvedValueOnce(result);
//
//     expect(await service.getFile(bucket, key)).toEqual(result);
//     expect(s3Client.send).toHaveBeenCalledWith(new GetObjectCommand({ Bucket: bucket, Key: key }));
//   });
//
//   it('should delete a file successfully', async () => {
//     const bucket = 'test-bucket';
//     const key = 'test-key';
//     const result = { /* expected result */ };
//
//     jest.spyOn(s3Client, 'send').mockResolvedValueOnce(result);
//
//     await expect(service.deleteFile(bucket, key)).resolves.toEqual(result);
//   });
//
//   it('should list files successfully', async () => {
//     const bucket = 'test-bucket';
//     const result = { /* expected result */ };
//
//     jest.spyOn(s3Client, 'send').mockResolvedValueOnce(result);
//
//     expect(await service.listFiles(bucket)).toEqual(result);
//   });
//
//   it('should copy a file successfully', async () => {
//     const sourceBucket = 'source-bucket';
//     const sourceKey = 'source-key';
//     const destBucket = 'dest-bucket';
//     const destKey = 'dest-key';
//     const result = { /* expected result */ };
//
//     jest.spyOn(s3Client, 'send').mockResolvedValueOnce(result);
//
//     await expect(service.copyFile(sourceBucket, sourceKey, destBucket, destKey)).resolves.toEqual(result);
//   });
//
//   it('should create a bucket successfully', async () => {
//     const bucket = 'new-bucket';
//     const result = { /* expected result */ };
//
//     jest.spyOn(s3Client, 'send').mockResolvedValueOnce(result);
//
//     await expect(service.createBucket(bucket)).resolves.toEqual(result);
//   });
//
//   it('should delete a bucket successfully', async () => {
//     const bucket = 'test-bucket';
//     const result = { /* expected result */ };
//
//     jest.spyOn(s3Client, 'send').mockResolvedValueOnce(result);
//
//     await expect(service.deleteBucket(bucket)).resolves.toEqual(result);
//   });
//
//   it('should get a signed URL successfully', async () => {
//     const bucket = 'test-bucket';
//     const key = 'test-key';
//     const expires = 900; // seconds
//     const signedUrl = 'https://example.com/signed-url';
//
//     jest.spyOn(s3Client, 'getSignedUrl').mockResolvedValueOnce(signedUrl);
//
//     const result = await service.getSignedUrl(bucket, key, expires);
//     expect(result).toEqual(signedUrl);
//   });
//
//   it('should move a file successfully', async () => {
//     const sourceBucket = 'source-bucket';
//     const sourceKey = 'source-key';
//     const destBucket = 'dest-bucket';
//     const destKey = 'dest-key';
//     const copyResult = { /* expected copy result */ };
//     const deleteResult = { /* expected delete result */ };
//
//     jest.spyOn(s3Client, 'send')
//         .mockResolvedValueOnce(copyResult) // for copy
//         .mockResolvedValueOnce(deleteResult); // for delete
//
//     await expect(service.moveFile(sourceBucket, sourceKey, destBucket, destKey)).resolves.toBeUndefined();
//   });
// });
