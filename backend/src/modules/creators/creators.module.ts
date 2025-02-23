import {Module, OnModuleInit} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorsController } from './controller/creators.controller';
import { CreatorsService } from './services/creators.service';
import {CsvService} from "../csv/csv.service";
import {Creators} from "./entities/creators.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Creators])],
  controllers: [CreatorsController],
  providers: [CreatorsService, CsvService],
  exports: [TypeOrmModule, CreatorsService],
})
export class CreatorsModule implements OnModuleInit {
  constructor(private readonly userService: CreatorsService) {}

  async onModuleInit() {
    console.log('CSV 데이터 마이그레이션 (creators)');
    await this.userService.saveUsers();
  }
}