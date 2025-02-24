import { Module, OnModuleInit } from '@nestjs/common';
import { BusinessService } from './business.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {CsvService} from "../csv/csv.service";
import { CsvModule} from "../csv/csv.module";
import { BusinessController} from "./business.controller";
import {Business} from "./entities/business.entity";
import {Creator} from "../creators/entities/creators.entity";
import {User} from "../users/user.entity";


@Module({
  imports: [
      TypeOrmModule.forFeature([Business, Creator, User]),
      CsvModule,
  ],
  controllers: [BusinessController],
  providers: [BusinessService, CsvService],
  exports: [TypeOrmModule],
})


export class BusinessModule implements OnModuleInit {
  constructor(
      private readonly csvService: CsvService,
      private readonly productService: BusinessService,
  ) {}

  async onModuleInit() {
    console.log('CSV 데이터 마이그레이션 (business)');
    try {
      const data = await this.csvService.readProductCsv();
      await this.productService.saveProducts(data);
      console.log('Products 데이터 마이그레이션 완료');
    } catch (error) {
      console.error('❌ Products 데이터 마이그레이션 중 오류 발생:', error);
    }
  }
}