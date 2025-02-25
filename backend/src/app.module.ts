import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsModule } from './modules/contents/contents.module';
import { BusinessModule } from './modules/business/business.module';
import { CsvModule} from "./modules/csv/csv.module";
import {CreatorsModule} from "./modules/creators/creators.module";
import { AuthModule } from './modules/auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { CampaignModule } from './modules/campaign/campaign.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: join(__dirname, '../../.env'),
        }),

        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            username: process.env.DB_USER ,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
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
        CampaignModule,
    ],
})
export class AppModule {}
