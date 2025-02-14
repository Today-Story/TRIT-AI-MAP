import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsModule } from './modules/contents/contents.module';
import { ProductsModule } from './modules/products/products.module';
import { CsvModule } from "./modules/csv/csv.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../.env',  // ✅ 루트 경로의 .env 파일을 명시적으로 로드
            isGlobal: true,  // 모든 모듈에서 환경 변수 사용 가능
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV !== 'production',
        }),
        CsvModule,
        ContentsModule,
        ProductsModule,
    ],
})
export class AppModule {}
