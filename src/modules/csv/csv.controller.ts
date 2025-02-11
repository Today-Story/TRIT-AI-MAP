import { Controller, Get } from '@nestjs/common';
import { CsvService } from './csv.service';
import { ContentsService } from '../contents/contents.service';

@Controller('csv')
export class CsvController {
    constructor(
        private readonly csvService: CsvService,
        private readonly contentsService: ContentsService,
    ) {}

    @Get('migrate')
    async migrateCsvData(): Promise<string> {
        console.log('CSV 데이터 마이그레이션 시작');

        const data = await this.csvService.readCsv(); // ✅ 매개변수 없이 호출

        if (!data.length) {
            return 'No data found in CSV file';
        }

        await this.contentsService.saveContents(data);
        return '✅ CSV data migration completed.';
    }
}
