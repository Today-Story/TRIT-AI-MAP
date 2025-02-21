import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsModule } from './modules/contents/contents.module';
import { BusinessModule } from './modules/business/business.module';
import { CsvModule} from "./modules/csv/csv.module";
import {CreatorsModule} from "./modules/creators/creators.module";
import { AuthModule } from './modules/auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        // ✅ .env 파일 로드 설정 추가
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: join(__dirname, '../../.env'), // ✅ 명확한 경로 설정
        }),

        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 5433,
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'mydatabase',
            autoLoadEntities: true, // 엔티티를 자동으로 로드
            synchronize: true, // 개발 환경에서만 true (프로덕션 환경에서는 false)
            logging: ['error'],
        }),
        CreatorsModule,
        ContentsModule,
        BusinessModule,
        CsvModule,
        AuthModule,
        UsersModule,
    ],
})
export class AppModule {}
