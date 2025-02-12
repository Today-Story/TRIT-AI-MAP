import { Module, OnModuleInit } from '@nestjs/common';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Product} from "./products.entity";
import {CsvService} from "../csv/csv.service";
import { CsvModule} from "../csv/csv.module";
import { ProductsController} from "./products.controller";


@Module({
  imports: [
      TypeOrmModule.forFeature([Product]),
      CsvModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, CsvService],
  exports: [TypeOrmModule],
})


export class ProductsModule implements OnModuleInit {
  constructor(
      private readonly csvService: CsvService,
      private readonly productService: ProductsService,
  ) {}

  async onModuleInit() {
    console.log('CSV 데이터 마이그레이션 (products)');
    try {
      const data = await this.csvService.readProductCsv();
      await this.productService.saveProducts(data);
      console.log('Products 데이터 마이그레이션 완료');
    } catch (error) {
      console.error('❌ Products 데이터 마이그레이션 중 오류 발생:', error);
    }
  }
}