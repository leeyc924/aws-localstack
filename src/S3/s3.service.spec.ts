// test/s3.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';

describe('S3Service', () => {
  let service: S3Service;
  const bucketName = 'test-bucket';
  const fileName = 'test-file.txt';
  const fileContent = 'Hello, LocalStack!';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [S3Service],
    }).compile();

    service = module.get<S3Service>(S3Service);

    try {
      await service.createBucket(bucketName);
    } catch (error) {
      // 버킷이 이미 존재하는 경우를 처리
      if (error.name !== 'BucketAlreadyOwnedByYou') {
        throw error;
      }
    }
  });

  describe('when creating a bucket', () => {
    it('should create a bucket successfully', async () => {
      await expect(
        service.createBucket('another-bucket'),
      ).resolves.not.toThrow();
    });
  });

  describe('when uploading a file', () => {
    it('should upload a file successfully', async () => {
      await expect(
        service.uploadFile(bucketName, fileName, Buffer.from(fileContent)),
      ).resolves.not.toThrow();
    });
  });

  describe('when downloading a file', () => {
    it('should download the file with correct content', async () => {
      await service.uploadFile(bucketName, fileName, Buffer.from(fileContent));
      const downloadedFile = await service.getFile(bucketName, fileName);
      expect(downloadedFile.toString()).toEqual(fileContent);
    });
  });
});
