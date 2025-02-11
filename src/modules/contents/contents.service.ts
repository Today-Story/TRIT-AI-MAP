import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './content.entity';

@Injectable()
export class ContentsService {
    constructor(
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,
    ) {
    }

    async saveContents(contents: any[]): Promise<void> {
        if (!contents.length) {
            console.log('저장할 데이터가 없습니다.');
            return;
        }
        try {
            console.log(`${contents.length}개의 데이터를 저장합니다.`);

            // CSV 파일 순서대로 ID를 부여
            contents.forEach((item, index) => {
                item.id = index + 1;
            });

            await this.contentRepository.insert(contents);

            console.log('CSV 데이터 저장 완료.');
        } catch (error) {
            console.log('데이터 저장 중 오류 발생:', error);
        }
    }
}