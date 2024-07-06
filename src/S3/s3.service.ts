import { Injectable } from '@nestjs/common';
import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      endpoint: this.configService.get('LOCALSTACK_ENDPOINT'),
      forcePathStyle: true,
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async createBucket(bucketName: string): Promise<void> {
    try {
      const command = new CreateBucketCommand({ Bucket: bucketName });
      await this.s3.send(command);
    } catch (error) {
      console.error('Error creating bucket:', error);
      throw error;
    }
  }

  async uploadFile(
    bucketName: string,
    key: string,
    body: Buffer,
  ): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
      });
      await this.s3.send(command);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getFile(bucketName: string, key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      const data = await this.s3.send(command);
      const streamToBuffer = (stream: Readable): Promise<Buffer> =>
        new Promise((resolve, reject) => {
          const chunks: any[] = [];
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('error', reject);
          stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
      return streamToBuffer(data.Body as Readable);
    } catch (error) {
      console.error('Error getting file:', error);
      throw error;
    }
  }
}
