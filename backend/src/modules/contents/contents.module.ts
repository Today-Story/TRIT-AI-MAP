import { Module,OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsService } from './contents.service';
import { Content } from './content.entity';
import { CsvService} from "../csv/csv.service";
import { CsvModule} from "../csv/csv.module";
import {ContentsController} from "./contents.controller";

@Module({
  imports: [
      TypeOrmModule.forFeature([Content]),
      CsvModule,
      UsersModule,
  ],
  controllers: [ContentsController],
  providers: [ContentsService, CsvService],
  exports: [TypeOrmModule],
})
export class ContentsModule implements OnModuleInit{
  constructor(
      private readonly csvService: CsvService,
      private readonly contentService: ContentsService,
  ) {}

  async onModuleInit() {
    console.log('CSV 데이터 마이그레이션 (contents)');
    try {
      const data = await this.csvService.readContentCsv();
      await this.contentService.saveContents(data);
      console.log('Contents 데이터 마이그레이션 완료');
    } catch (error) {
      console.error('Contents 데이터 마이그레이션 중 오류 발생:', error);
    }
  }
}
