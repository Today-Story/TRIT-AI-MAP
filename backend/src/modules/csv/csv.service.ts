import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as path from 'path';
import { ContentCategory } from '../contents/content.entity';
import { ProductCategory } from '../products/products.entity';

@Injectable()
export class CsvService {
    async readContentCsv(): Promise<any[]> {
        return this.readCsvFile('content.csv', this.formatContentData.bind(this));
    }

    async readProductCsv(): Promise<any[]> {
        return this.readCsvFile('product.csv', this.formatProductData.bind(this));
    }

    private async readCsvFile(filename: string, formatter: (data: any) => any): Promise<any[]> {
        const baseDir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
        const filePath = path.join(process.cwd(), baseDir, 'data', filename);

        if (!fs.existsSync(filePath)) {
            throw new Error(`CSV 파일이 존재하지 않습니다: ${filePath}`);
        }

        const results: any[] = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (data) => {
                    const formattedData = this.normalizeCsvKeys(data);
                    results.push(formatter(formattedData));
                })
                .on('end', () => {
                    console.log(`${filename}에서 불러온 데이터 개수: ${results.length}`);
                    resolve(results);
                })
                .on('error', (err) => reject(err));
        });
    }

    private normalizeCsvKeys(data: any): any {
        const normalizedData: any = {};
        Object.keys(data).forEach((key) => {
            const cleanKey = key.replace(/\ufeff/g, '').trim();
            normalizedData[cleanKey] = data[key];
        });
        return normalizedData;
    }

    private formatContentData(data: any) {
        console.log("CSV 데이터:", data); // CSV 데이터를 콘솔에 출력하여 확인
    
        return {
            postNumber: Number(data['게시물 번호']?.trim()),
            title: data['제목']?.trim() || '',
            url: data['URL']?.trim() || '',
            author: data['작성자']?.trim() || '',
            authorId: data['작성자 ID']?.trim() || '',
            createdAt: data['작성시각'] ? new Date(data['작성시각']) : null,
            views: Number(data['조회수']) || 0,
            likes: Number(data['좋아요']) || 0,
            category: this.mapContentCategory(data['카테고리']) || ContentCategory.ALL,
            location: this.formatLocation(data['위치']),
            latitude: this.parseLatitudeLongitude(data['위도']),
            longitude: this.parseLatitudeLongitude(data['경도']),
        };
    }
    
    private parseLatitudeLongitude(value: string | undefined): number | null {
        console.log("위도/경도 원본 값:", value); // 디버깅 로그 추가
    
        if (!value || value.trim() === '') return null;
        const numValue = Number(value.trim());
        
        console.log("변환된 숫자 값:", numValue); // 변환 결과 확인
    
        return isNaN(numValue) ? null : numValue;
    }

    private formatProductData(data: any) {
        return {
            name: data['서비스명']?.trim() || null,
            category: this.mapProductCategory(data['카테고리']),
            price: data['서비스가']?.trim() || null,
            company: data['회사명']?.trim() || null,
            contactPerson: data['담당자']?.trim() || null,
            position: data['직책']?.trim() || null,
            phone: data['전화번호']?.trim() || null,
            email: data['이메일']?.trim() || null,
            contactDate: this.formatDate(data['최종 컨택일']),
            website: data['회사홈페이지']?.trim() || null,
        };
    }

    private mapContentCategory(category: string | undefined): ContentCategory {
        if (!category) {
            throw new Error('카테고리 값이 비어 있습니다.');
        }

        const upperCategory = category.trim().toUpperCase();

        if (!Object.values(ContentCategory).includes(upperCategory as ContentCategory)) {
            throw new Error(`잘못된 카테고리 값: ${upperCategory}`);
        }

        return upperCategory as ContentCategory;
    }

    private mapProductCategory(category: string | undefined): ProductCategory {
        if (!category || category.trim() === '') return ProductCategory.ALL;

        const upperCategory = category.trim();

        if (!Object.values(ProductCategory).includes(upperCategory as ProductCategory)) {
            throw new Error(`잘못된 카테고리 값: ${upperCategory}`);
        }
        return upperCategory as ProductCategory;
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

    private formatDate(dateString: string | undefined): Date | null {
        if (!dateString || dateString.trim() === '') return null;
        return new Date(dateString.trim());
    }
}
