import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsModule } from './modules/contents/contents.module';
import {CsvModule} from "./modules/csv/csv.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 5432,
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'mydb',
            autoLoadEntities: true, // 엔티티를 자동으로 로드
            synchronize: true, // 개발 환경에서만 true (프로덕션 환경에서는 false)
            logging: true,
        }),
        ContentsModule,
        CsvModule,
    ],
})
export class AppModule {}
