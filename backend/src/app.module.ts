import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsModule } from './modules/contents/contents.module';
import { ProductsModule } from './modules/products/products.module';
import { CsvModule} from "./modules/csv/csv.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10) ,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true, // 엔티티를 자동으로 로드
            synchronize: true, // 개발 환경에서만 true (프로덕션 환경에서는 false)
            logging: true,
        }),
        CsvModule,
        ContentsModule,
        ProductsModule,
    ],
})
export class AppModule {}
