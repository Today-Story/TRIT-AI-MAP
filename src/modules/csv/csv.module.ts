import { Module, OnModuleInit } from '@nestjs/common';
import { CsvService } from './csv.service';
import {ContentsService} from "../contents/contents.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import { Content} from "../contents/content.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Content])],
    providers: [CsvService, ContentsService],
    exports: [CsvService],
})
export class CsvModule implements OnModuleInit{
    constructor(
        private readonly csvService: CsvService,
        private readonly contentsService: ContentsService,
    ) {}

    async onModuleInit(){
        try{
            const data = await this.csvService.readCsv();
            await this.contentsService.saveContents(data);
        }catch (error) {
            console.log('CSV 마이그레이션 중 오류 발생:', error);
        }
    }
}
