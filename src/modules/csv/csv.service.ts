import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as path from 'path';
import { ContentCategory} from "../contents/content.entity";

@Injectable()
export class CsvService {
    async readCsv(): Promise<any[]> {
        // 프로젝트 루트 기준으로 data 폴더 위치 설정
        const baseDir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
        const filePath = path.join(process.cwd(), baseDir, 'data', 'content.csv');

        // 파일 존재 여부 체크
        if (!fs.existsSync(filePath)) {
            throw new Error(`CSV 파일이 존재하지 않습니다: ${filePath}`);
        }

        const results: any[] = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (data) => {
                    const formattedData = {
                        postNumber: Number(data['게시물 번호']?.trim()),
                        title: data['제목']?.trim() || '',
                        url: data['URL']?.trim() || '',
                        author: data['작성자']?.trim() || '',
                        authorId: data['작성자 ID']?.trim() || '',
                        createdAt: data['작성시각'] ? new Date(data['작성시각']) : null,
                        views: Number(data['조회수']) || 0,
                        likes: Number(data['좋아요']) || 0,
                        category: this.mapCategory(data['카테고리']) || ContentCategory.ALL,
                        location: this.formatLocation(data['위치']),
                    };

                    results.push(formattedData);
                })
                .on('end', () => {
                    results.forEach((item, index) => {
                        item.id = index +1;
                    })
                    console.log(`✅ CSV 파일에서 읽은 총 데이터 개수: ${results.length}`);
                    resolve(results);
                })
                .on('error', (err) => reject(err));
        });
    }

    private mapCategory(category: string | undefined): ContentCategory {
        if (!category) {
            throw new Error('카테고리 값이 비어 있습니다.');
        }

        const upperCategory = category.trim().toUpperCase();

        if (!Object.values(ContentCategory).includes(upperCategory as ContentCategory)) {
            throw new Error(`잘못된 카테고리 값: ${upperCategory}`);
        }

        return upperCategory as ContentCategory;
    }


    private formatLocation(location: string | undefined): string | null {
        if (!location || location.trim() === '{}' || location.trim() === '') return null;

        return location
            .replace(/{|}/g, '')
            .replace(/"/g, '')
            .split(',')
            .map((url) => url.trim())
            .filter((url) => url !== '')
            .join(', ');
    }


}
