import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('bucket')
  async createBucket(@Body('bucketName') bucketName: string) {
    await this.s3Service.createBucket(bucketName);
  }

  @Post('upload')
  async uploadFile(
    @Body('bucketName') bucketName: string,
    @Body('key') key: string,
    @Body('body') body: string,
  ) {
    await this.s3Service.uploadFile(bucketName, key, Buffer.from(body));
  }

  @Get('file/:bucketName/:key')
  async getFile(
    @Param('bucketName') bucketName: string,
    @Param('key') key: string,
  ) {
    const file = await this.s3Service.getFile(bucketName, key);
    return file.toString();
  }
}
