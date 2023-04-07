import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CloudinaryModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        cloud_name: 'dmrrqh7at',
        api_key: '515226276357731',
        api_secret: '8y6VxgbRNdXZRxvNEjWhYUIOFEQ',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class NestCloudinaryModule {}
