import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as path from "node:path";

@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            },
        });
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    }

    async uploadFile(
        file: Express.Multer.File,
        category: 'profile' | 'campaign',
        userType?: 'creator' | 'company' | 'normal'
    ): Promise<string> {
        const folderMap: Record<string, string> = {
            // 프로필용 폴더
            'profile_creator': 'profiles/creator',
            'profile_company': 'profiles/company',
            'profile_normal': 'profiles/normal',
            // 캠페인용 폴더
            'campaign': 'campaigns',
        };

        const keyPrefix = userType ? `profile_${userType}` : 'profile_user';
        const folderPath = folderMap[keyPrefix] || 'profiles/others';

        // 파일 확장자 추출 (.jpeg, .png 등)
        const extension = path.extname(file.originalname);
        const fileName = `${uuidv4()}${extension}`;

        const key = `${folderPath}/${fileName}`;

        const uploadParams = {
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        await this.s3Client.send(new PutObjectCommand(uploadParams));

        // 파일 URL 반환 (폴더 경로 포함)
        return `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
    }
}
